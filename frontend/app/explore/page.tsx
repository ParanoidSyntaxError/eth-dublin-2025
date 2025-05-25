import HackCard from "@/components/hack-card";
import { fetchHackMetadata } from "@/lib/ipfs";
import { getLatestHacks } from "@/lib/subgraph";
import { Hack, HackMetadata } from "@/lib/schema";

const blacklist: string[] = [
	"0x00ea09caed1be22ac85e71d121b69097afa234e7",
	"0xf944cdfbb281e754b27301a77b4da8a32ad303d3"
];

const PRICE_SCALE = 1e18;
const TOKEN_MAX_SUPPLY = 1_000_000_000 * 1e18;

function calculateAmounts(price: bigint, totalSupply: bigint, initialSupply: bigint) {
	// Calculate remaining supply to reach max
	const remainingSupply = BigInt(TOKEN_MAX_SUPPLY) - initialSupply;
	
	// Calculate target amount (cost to reach max supply, excluding initial supply)
	const targetAmount = Number((price * remainingSupply) / BigInt(PRICE_SCALE)) / 1e18;
	
	// Calculate raised amount (current supply minus initial supply) * price
	const raisedAmount = Number((price * (totalSupply - initialSupply)) / BigInt(PRICE_SCALE)) / 1e18;

	return { targetAmount, raisedAmount };
}

export default async function Explore() {
	const hacks = (await getLatestHacks())?.filter((hack) => 
		blacklist.length === 0 || !blacklist.includes(hack.token.address)
	);
	if (!hacks) {
		return <></>;
	}
	console.log(hacks);

	const metadataResponses = await Promise.allSettled(hacks.map((hack) => fetchHackMetadata(hack.metadataUri)));
	const hacksWithMetadata: (Hack & HackMetadata)[] = [];
	for(let i = 0; i < metadataResponses.length; i++) {
		const response = metadataResponses[i];
		if(response?.status === "fulfilled" && response.value !== undefined) {
			hacksWithMetadata.push({
				...hacks[i],
				...response.value
			});
		}
	}

	return (
		<div
			className="flex flex-col gap-4 space-y-12 items-center mt-32 mb-8"
		>
			{hacksWithMetadata?.map((hack, i) => {
				const { targetAmount, raisedAmount } = calculateAmounts(
					BigInt(hack.price),
					BigInt(hack.token.totalSupply),
					BigInt(hack.token.initialSupply)
				);

				return (
					<HackCard
						key={i}
						token={hack.token.address}
						name={hack.token.name}
						avatar={hack.avatar}
						banner={hack.banner}
						targetAmount={targetAmount}
						raisedAmount={raisedAmount}
						endDate={new Date(Number(hack.expiration) * 1000)}
						category={hack.category}
					/>
				);
			})}
		</div>
	);
}
