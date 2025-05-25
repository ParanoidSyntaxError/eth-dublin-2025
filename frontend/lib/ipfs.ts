"use server";

import { HackMetadata } from "./schema";

export async function fetchHackMetadata(cid: string): Promise<HackMetadata | undefined> {
    try {
        const url = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${cid}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const metadata = await response.json();
        return metadata as HackMetadata;
    } catch (error) {
        console.log('Error fetching hack metadata:', error);
        return undefined;
    }
}
