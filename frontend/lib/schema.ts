export interface HackMetadata {
    name: string;
    description: string;
    avatar: string;
    banner: string;
    category: string;
    links: string[];
    nfts: NFT[];
}

export interface NFT {
    id: string;
    network: string;
    contract: string;
}