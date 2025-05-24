'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function CryptoProvider({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
            clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID}
            config={{
                embeddedWallets: {
                    ethereum: {
                        createOnLogin: "off"
                    }
                }
            }}
        >
            {children}
        </PrivyProvider>
    );
}