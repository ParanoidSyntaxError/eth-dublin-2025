"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { getOwnedOptimismNFTs } from "@/lib/alchemy";
import { newHack } from "@/lib/hackfund";
import { useWallets } from "@privy-io/react-auth";
import { Nft } from "alchemy-sdk";
import { CheckCircle, ExternalLink, Plus, Rocket, X } from "lucide-react";
import { useEffect, useState } from "react";
import { optimism } from "viem/chains";
import { useRouter } from "next/navigation";

const whitelistedNFTs = [
	"0x69B4e2BD6D5c5eeeB7E152FB9bc9b6c4364fA410",
	"0xe600A7AD9B86A2D949069A6092b7b5a1Dae50e20",
	"0x32382a82d9faDc55f971f33DaEeE5841cfbADbE0"
];

const categories = [
	"DeFi",
	"AI",
	"Gaming",
	"Infrastructure",
	"Social",
	"DAO",
];

export default function Launch() {
	const { wallets } = useWallets();
	const wallet = wallets?.[0];
	const router = useRouter();

	const [nfts, setNFTs] = useState<Nft[]>([]);
	useEffect(() => {
		if (wallet) {
			getOwnedOptimismNFTs(wallet.address).then((nfts) => {
				if (nfts !== undefined) {
					const filteredNFTs = nfts.filter((nft) => whitelistedNFTs.includes(nft.contract.address));
					setNFTs(filteredNFTs);
				}
			});
		}
	}, [wallet]);

	const [stepTitle, setStepTitle] = useState("Details");
	const [currentStep, setCurrentStep] = useState(1)
	const [tokenSplit, setTokenSplit] = useState([70])
	const [selectedNFTs, setSelectedNFTs] = useState<number[]>([])
	const [formData, setFormData] = useState({
		title: "",
		category: "",
		description: "",
		fundingGoal: "",
	})
	const [projectLinks, setProjectLinks] = useState<string[]>([""])

	const totalSteps = 4
	const progress = currentStep === totalSteps ? 100 : (currentStep / (totalSteps - 1)) * 100

	const addLink = () => {
		setProjectLinks([...projectLinks, ""])
	}

	const removeLink = (index: number) => {
		setProjectLinks(projectLinks.filter((_, i) => i !== index))
	}

	const updateLink = (index: number, value: string) => {
		const newLinks = [...projectLinks]
		newLinks[index] = value
		setProjectLinks(newLinks)
	}

	const toggleNFTSelection = (index: number) => {
		setSelectedNFTs((prev) => (prev.includes(index) ? prev.filter((id) => id !== index) : [...prev, index]));
	}

	const nextStep = () => {
		if (currentStep < totalSteps) {
			updateStepTitle(currentStep + 1);
			setCurrentStep(currentStep + 1)
		}

	}

	const prevStep = () => {
		if (currentStep > 1) {
			updateStepTitle(currentStep - 1);
			setCurrentStep(currentStep - 1)
		}
	}

	const updateStepTitle = (step: number) => {
		switch (step) {
			case 1:
				setStepTitle("Details")
				break
			case 2:
				setStepTitle("Funding")
				break
			case 3:
				setStepTitle("Showcase")
				break
		}
	}

	const handleLaunch = async () => {
		try {
			console.log(wallet);
			if (!wallet) {
				console.error("No primary wallet found");
				return;
			}

			const signedMessage = await wallet.sign(process.env.NEXT_PUBLIC_SIGNED_MESSAGE);
			console.log(signedMessage);

			const mintAmount = BigInt(((1_000_000_000 * 1e18) / 100) * (100 - tokenSplit[0]));
			
			const remainingSupply = BigInt(1_000_000_000 * 1e18) - mintAmount;
			const price = ((BigInt(Number(formData.fundingGoal) * 1e18) * BigInt(1e18)) / remainingSupply).toString();

			const hash = await newHack(
				wallet.address,
				signedMessage,
				formData.title,
				formData.title.toUpperCase(),
				price,
				((Date.now() / 1000) + 60 * 60 * 24 * 30).toFixed(0),
				wallet.address,
				mintAmount.toString(),
				wallet.address,
				{
					name: formData.title,
					description: formData.description,
					avatar: "",
					banner: "",
					category: formData.category,
					links: projectLinks,
					nfts: selectedNFTs.map((i) => { return {
						id: nfts[i].tokenId,
						contract: nfts[i].contract.address,
						network: optimism.id.toString()
					}})
				}
			);
			console.log(hash);
			
			router.push("/explore");
		} catch (error) {
			console.error(error);
		}
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<div className="space-y-12">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="title">
									Title <span className="text-red-500">*</span>
								</Label>
								<Input
									id="title"
									placeholder=""
									value={formData.title}
									onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="category">
									Category <span className="text-red-500">*</span>
								</Label>
								<Select
									value={formData.category}
									onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
								>
									<SelectTrigger className={!formData.category ? "border-red-500" : ""}>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((category) => (
											<SelectItem key={category} value={category.toLowerCase()}>
												{category}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">
								Pitch (markdown) <span className="text-red-500">*</span>
							</Label>
							<Textarea
								id="description"
								placeholder=""
								className="min-h-[120px]"
								value={formData.description}
								onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
								required
							/>
						</div>
					</div>
				)

			case 2:
				return (
					<div className="space-y-6">
						<div className="space-y-12">
							<div className="space-y-2">
								<Label htmlFor="funding-goal">
									Target (ETH) <span className="text-red-500">*</span>
								</Label>
								<Input
									id="funding-goal"
									type="number"
									placeholder="100.00"
									value={formData.fundingGoal}
									onChange={(e) => setFormData((prev) => ({ ...prev, fundingGoal: e.target.value }))}
									required
								/>
							</div>

							<div className="space-y-4">
								<div className="space-y-2">
									<Label>Token Distribution</Label>
									<div className="space-y-4">
										<div className="flex items-center justify-between text-xs">
											<span>Public allocation: {tokenSplit[0]}%</span>
											<span>Private allocation: {100 - tokenSplit[0]}%</span>
										</div>
										<Slider value={tokenSplit} onValueChange={setTokenSplit} max={100} step={5} className="w-full" />
									</div>
								</div>
							</div>
						</div>
					</div>
				)

			case 3:
				return (
					<div className="space-y-6">
						<div className="space-y-12">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label>Awards</Label>
									<Badge variant="secondary">{selectedNFTs.length} selected</Badge>
								</div>

								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									{nfts.map((nft, i) => (
										<Card
											key={i}
											className={`cursor-pointer transition-all ${selectedNFTs.includes(i) ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-md"
												}`}
											onClick={() => toggleNFTSelection(i)}
										>
											<CardContent className="p-3">
												<img
													src={nft.image.cachedUrl || nft.image.originalUrl || "/placeholder.svg"}
													alt={nft.name}
													className="w-full aspect-square rounded-md object-cover mb-2"
												/>
												<p className="text-xs font-medium truncate">{nft.name}</p>
												{selectedNFTs.includes(i) && <CheckCircle className="h-4 w-4 text-primary mt-1" />}
											</CardContent>
										</Card>
									))}
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label>Links</Label>
									<Button type="button" variant="outline" size="sm" onClick={addLink}>
										<Plus className="h-4 w-4 mr-2" />
										Add Link
									</Button>
								</div>

								<div className="space-y-3">
									{projectLinks.map((link, index) => (
										<div key={index} className="flex gap-3 items-center">
											<div className="flex-1 relative">
												<ExternalLink className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
												<Input
													type="url"
													placeholder="https://github.com/username/project or https://demo.vercel.app or https://youtube.com/watch?v=..."
													className="pl-10"
													value={link}
													onChange={(e) => updateLink(index, e.target.value)}
												/>
											</div>
											{projectLinks.length > 1 && (
												<Button type="button" variant="outline" size="sm" onClick={() => removeLink(index)}>
													<X className="h-4 w-4" />
												</Button>
											)}
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				)

			default:
				return null
		}
	}

	return (
		<div className="bg-background mb-8 mt-32">
			{/* Main Content */}
			<main className="container mx-auto px-4 max-w-4xl">
				<div className="space-y-4">
					{/* Progress Header */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h1 className="text-3xl font-bold">{stepTitle}</h1>
							<Badge variant="outline">
								Step {currentStep} of {totalSteps}
							</Badge>
						</div>
						<Progress value={progress} className="w-full" />
					</div>

					{/* Form Content */}
					<div className="py-8">
						{renderStepContent()}
					</div>

					{/* Navigation */}
					<div className="flex justify-between">
						<Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
							Previous
						</Button>

						{currentStep === totalSteps - 1 ? (
							<Button className="bg-primary hover:bg-primary/90" onClick={() => handleLaunch()}>
								<Rocket className="h-4 w-4 mr-2" />
								Launch
							</Button>
						) : currentStep === totalSteps ? (
							<div></div>
						) : (
							<Button
								onClick={nextStep}
								disabled={
									(currentStep === 1 && (!formData.title || !formData.category || !formData.description)) ||
									(currentStep === 2 && !formData.fundingGoal)
								}
							>
								Next Step
							</Button>
						)}
					</div>
				</div>
			</main>
		</div>
	)
}
