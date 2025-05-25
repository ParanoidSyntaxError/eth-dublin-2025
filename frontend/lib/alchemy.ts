"use server";

import { Network, Alchemy, Nft, NftMetadata } from "alchemy-sdk";
import { NFT } from "./schema";

const alchemyOptimism = new Alchemy({
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.OPT_MAINNET,
});

export async function getOwnedOptimismNFTs(address: string): Promise<Nft[] | undefined> {
    try {
        const nftsForOwner = await alchemyOptimism.nft.getNftsForOwner(address);
        const nftMetadata = await alchemyOptimism.nft.getNftMetadataBatch(nftsForOwner.ownedNfts.map((nft) => ({
            contractAddress: nft.contract.address,
            tokenId: nft.tokenId,
        })));

        return nftMetadata.nfts;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export async function getOptimismNFTs(nfts: NFT[]): Promise<Nft[] | undefined> {
    try {
        const nftMetadata = await alchemyOptimism.nft.getNftMetadataBatch(
            nfts.map((nft) => ({
                contractAddress: nft.contract,
                tokenId: nft.id,
            }))
        );

        return nftMetadata.nfts;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}