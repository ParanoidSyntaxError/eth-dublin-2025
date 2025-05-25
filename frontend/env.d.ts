declare namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_HACKFUND_ADDRESS: string;
        SERVER_WALLET_PRIVATE_KEY: string;

        NEXT_PUBLIC_SIGNATURE_PUBLIC_KEY: string;
        SIGNATURE_PRIVATE_KEY: string;

        PINATA_JWT: string;
        PINATA_GATEWAY_URL: string;

        SUBGRAPH_URL: string;
        SUBGRAPH_BEARER_TOKEN: string;

        ALCHEMY_API_KEY: string;

        NEXT_PUBLIC_PRIVY_APP_ID: string;

        NEXT_PUBLIC_SIGNED_MESSAGE: string;
    }
} 