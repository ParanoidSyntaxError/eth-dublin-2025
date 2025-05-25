"use server";

import { HackMetadata } from "./schema";
import { keccak256, PublicClient } from "viem";
import { HackFundAbi } from "@/abi";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia, optimism } from "viem/chains";
import { pinata } from "./pinata";
import { randomBytes } from "crypto";
import { sign } from "./signature/sign";

const HACKFUND_ADDRESS = process.env.NEXT_PUBLIC_HACKFUND_ADDRESS as `0x${string}`;
const PRIVATE_KEY = process.env.SERVER_WALLET_PRIVATE_KEY as `0x${string}`;

const MESSAGE = process.env.NEXT_PUBLIC_SIGNED_MESSAGE;

/* eslint-disable  @typescript-eslint/no-explicit-any */
const clients = new Map<string, any>([
    // HackFund contracts
    [baseSepolia.id.toString(), createPublicClient({
        chain: baseSepolia,
        transport: http()
    })],

    // ETHGlobal finalist NFTs
    [optimism.id.toString(), createPublicClient({
        chain: optimism,
        transport: http()
    })],
]);
function getClient(network: string): PublicClient | undefined {
    try {
        const client = clients.get(network);
        if (!client) {
            throw new Error(`Unsupported network: ${network}`);
        }
        return client as PublicClient;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

const wallet = createWalletClient({
    account: privateKeyToAccount(PRIVATE_KEY),
    chain: baseSepolia,
    transport: http()
});

export async function newHack(
    signer: string,
    signedMessage: string,
    name: string,
    symbol: string,
    price: string,
    expiration: string,
    receiver: string,
    mintAmount: string,
    mintReceiver: string,
    metadata: HackMetadata
): Promise<string | undefined> {
    try {
        const hfClient = getClient(wallet.chain.id.toString());
        if (!hfClient) {
            throw new Error(`Unsupported network: ${wallet.chain.id}`);
        }

        const valid = await hfClient.verifyMessage({
            address: signer as `0x${string}`,
            message: MESSAGE,
            signature: signedMessage as `0x${string}`
        });
        if(!valid) {
            throw new Error("Invalid signed message");
        }

        for (const nft of metadata.nfts) {
            const nftClient = getClient(nft.network);
            if (!nftClient) {
                throw new Error(`Unsupported network: ${nft.network}`);
            }

            const owner = await nftClient.readContract({
                address: nft.contract as `0x${string}`,
                abi: [{
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "ownerOf",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }],
                functionName: 'ownerOf',
                args: [BigInt(nft.id)]
            });

            if (owner.toLowerCase() !== signer.toLowerCase()) {
                throw new Error('Invalid NFT owner');
            }
        }

        const salt = keccak256(randomBytes(32));
        const tokenAddress = await hfClient.readContract({
            address: HACKFUND_ADDRESS,
            abi: HackFundAbi,
            functionName: 'predictTokenAddress',
            args: [salt]
        });

        const signature = sign(tokenAddress);
        if (!signature) {
            throw new Error('Failed to sign token address');
        }

        const { cid } = await pinata.upload.public.json({
            ...metadata,
            signature: signature
        });

        const { request } = await hfClient.simulateContract({
            address: HACKFUND_ADDRESS,
            abi: HackFundAbi,
            functionName: 'newHack',
            args: [
                name,
                symbol,
                {
                    price: BigInt(price),
                    expiration: BigInt(expiration),
                    receiver: receiver as `0x${string}`,
                    metadataUri: cid
                },
                BigInt(mintAmount),
                mintReceiver as `0x${string}`,
                salt
            ],
            account: wallet.account
        });

        const hash = await wallet.writeContract(request);
        return hash as string;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}