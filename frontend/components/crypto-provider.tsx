'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function CryptoProvider({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
            config={{
                loginMethods: [
                    "wallet",
                ],
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