export interface Hack {
    id: string;
    token: {
        id: string;
        address: string;
        name: string;
        symbol: string;
        initialSupply: string;
        totalSupply: string;
    };
    deployer: string;
    price: string;
    expiration: string;
    metadataUri: string;
};

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