"use server";

import { Hack } from "./schema";

const latestHacksQuery = `{
    hacks(first: 100) {
        id
        token {
            id
            address
            name
            symbol
            initialSupply
            totalSupply
        }
        deployer
        price
        expiration
        metadataUri
    }
}`;

const hackByTokenQuery = `
    query GetHackByToken($tokenAddress: String!) {
        hacks(first: 1, where: { token_: { address: $tokenAddress } }) {
            id
            token {
                id
                address
                name
                symbol
                initialSupply
                totalSupply
            }
            deployer
            price
            expiration
            metadataUri
        }
    }
`;

const URL = process.env.SUBGRAPH_URL;
const headers = { Authorization: process.env.SUBGRAPH_BEARER_TOKEN };

export async function getLatestHacks(): Promise<Hack[] | undefined> {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify({
                query: latestHacksQuery
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.errors) {
            throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
        }

        return result.data.hacks;
    } catch (error) {
        console.error('Error fetching hacks:', error);
        return undefined;
    }
}

export async function getHackByToken(token: string): Promise<Hack | undefined> {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify({
                query: hackByTokenQuery,
                variables: {
                    tokenAddress: token.toLowerCase()
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.errors) {
            throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
        }

        return result.data.hacks[0];
    } catch (error) {
        console.error('Error fetching hack by token:', error);
        return undefined;
    }
}

