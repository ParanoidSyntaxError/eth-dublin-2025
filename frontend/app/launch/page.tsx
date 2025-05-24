"use client";

import { Button } from "@/components/ui/button";
import { newHack } from "@/lib/hackfund";
import { useWallets } from "@privy-io/react-auth";

export default function Launch() {
	const { wallets } = useWallets();
	const wallet = wallets?.[0];

	const handleLaunch = async () => {
		try {
			console.log(wallet);
			if (!wallet) {
				console.error("No primary wallet found");
				return;
			}

			const metadata = {
				name: "Test Hack",
				description: "This is a test hack",
				avatar: "undefined",
				banner: "undefined",
				catagory: "DeFi",
				links: [],
				nfts: []
			};

			const signedMessage = await wallet.sign(process.env.NEXT_PUBLIC_SIGNED_MESSAGE);
			console.log(signedMessage);

			const hash = await newHack(
				wallet.address,
				signedMessage,
				"Test Hack",
				"TEST",
				"100",
				((Date.now() / 1000) + 60 * 60 * 24 * 30).toFixed(0),
				wallet.address,
				"1000",
				wallet.address,
				metadata
			);
			console.log(hash);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<Button onClick={handleLaunch}>
				Launch
			</Button>
		</div>
	);
}
