"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, ChevronDown } from "lucide-react"
import Image from "next/image"
import ReactMarkdown from 'react-markdown'
import Link from "next/link"
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
    token: z.string().min(1, "Please select a payment token"),
    amount: z
        .string()
        .min(1, "Please enter an amount")
        .refine((val) => {
            const num = Number.parseFloat(val)
            return !isNaN(num) && num > 0
        }, "Amount must be a positive number"),
});

export default function ProjectPage() {
    const [isBackingExpanded, setIsBackingExpanded] = useState(false);
    const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            token: "",
            amount: "",
        },
    });
    const watchedToken = form.watch("token");

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log("Form submitted:", values)
        // Handle token purchase logic here
    };


    const getTokenDisplay = (token: string) => {
        const supportedToken = supportedTokens.find((t) => t.symbol === token)
        if (supportedToken) {
            return supportedToken.symbol
        }
        return token || "TOKEN"
    };

    const supportedTokens = [
        { symbol: "ETH", name: "Ethereum", address: "0x0000000000000000000000000000000000000000" },
        { symbol: "USDC", name: "USD Coin", address: "0xA0b86a33E6441b8dB2B2B0b0b0b0b0b0b0b0b0" },
        { symbol: "USDT", name: "Tether USD", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
        { symbol: "DAI", name: "Dai Stablecoin", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" },
        { symbol: "MATIC", name: "Polygon", address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0" },
    ];

    const fundingProgress = 68
    const currentAmount = 340000
    const targetAmount = 500000
    const daysLeft = 23
    const backers = 1247

    // Default description if none provided
    const defaultDescription = `
# About This Project

Welcome to the future of gaming! Our MetaVerse Gaming Platform is revolutionizing the way players
interact with virtual worlds through blockchain technology and NFTs. This innovative platform combines
cutting-edge graphics, immersive gameplay, and true digital ownership.

## Key Features

- Immersive 3D virtual worlds with stunning graphics
- Play-to-earn mechanics with cryptocurrency rewards
- NFT-based character customization and item ownership
- Cross-platform compatibility (PC, Mobile, VR)
- Community-driven content creation tools

## Why Support Us?

By backing this project, you're not just supporting a game – you're investing in the future of digital
entertainment. Early supporters will receive exclusive NFTs, beta access, and governance tokens that
give you a voice in the platform's development.

Our team consists of industry veterans from major gaming studios and blockchain experts who have
successfully launched multiple projects. We're committed to transparency and will provide regular
updates throughout the development process.
    `.trim()

    const nfts = [
        {
            id: 1,
            name: "Genesis Collection #001",
            image: "/placeholder.svg?height=200&width=200&query=digital art NFT genesis",
            price: "0.5 ETH",
        },
        {
            id: 2,
            name: "Rare Artifact #042",
            image: "/placeholder.svg?height=200&width=200&query=rare digital artifact NFT",
            price: "1.2 ETH",
        },
        {
            id: 3,
            name: "Limited Edition #007",
            image: "/placeholder.svg?height=200&width=200&query=limited edition digital collectible",
            price: "0.8 ETH",
        },
        {
            id: 4,
            name: "Exclusive Access #156",
            image: "/placeholder.svg?height=200&width=200&query=exclusive access token NFT",
            price: "2.0 ETH",
        },
    ]

    return (
        <div className="min-h-screen w-full bg-background">
            {/* Banner Section */}
            <div className="relative h-80 w-full overflow-hidden">
                <Image
                    src="/placeholder.svg?height=320&width=1200&query=futuristic digital art project banner"
                    alt="Project Banner"
                    fill
                    className="object-cover"
                />
            </div>
            <div className="max-w-3xl mx-auto">
                <div className="container mx-auto px-4 -mt-16 relative z-10">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Project Header */}
                        <Card className="p-6">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src="/placeholder.svg?height=64&width=64&query=project creator avatar" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="secondary">Gaming</Badge>
                                    </div>
                                    <h1 className="text-3xl font-bold mb-2">MetaVerse Gaming Platform</h1>
                                </div>
                            </div>
                        </Card>

                        {/* Funding Progress */}
                        <Card className="p-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-semibold">Funding</h2>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        {daysLeft} days left
                                    </div>
                                </div>

                                <Progress value={fundingProgress} className="h-6" />

                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold">${currentAmount.toLocaleString()}</div>
                                        <div className="text-sm text-muted-foreground">Raised</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">${targetAmount.toLocaleString()}</div>
                                        <div className="text-sm text-muted-foreground">Goal</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{backers}</div>
                                        <div className="text-sm text-muted-foreground">Backers</div>
                                    </div>
                                </div>

                                <div>
                                    <div className="relative">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-muted-foreground">Public Allocation</span>
                                            <span className="text-sm text-muted-foreground">Team Allocation</span>
                                        </div>
                                        <Progress value={fundingProgress} />
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-sm font-medium">60%</span>
                                            <span className="text-sm font-medium">40%</span>
                                        </div>
                                    </div>
                                </div>

                                {!isBackingExpanded ? (
                                    <div className="flex gap-2 pt-4">
                                        <Button className="flex-1" onClick={() => setIsBackingExpanded(true)}>
                                            Fund This Hack
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="pt-4 space-y-4">
                                        <div
                                            className="space-y-4 animate-in slide-in-from-top-2 duration-300"
                                            style={{
                                                animation: "slideIn 0.3s ease-out",
                                            }}
                                        >
                                            <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="token"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Currency</FormLabel>
                                                                <FormControl>
                                                                    <div
                                                                        className="relative"
                                                                        onBlur={(e) => {
                                                                            if (!e.currentTarget.contains(e.relatedTarget)) {
                                                                                setIsTokenDropdownOpen(false)
                                                                            }
                                                                        }}
                                                                    >
                                                                        <Input
                                                                            placeholder="Select or enter token contract"
                                                                            {...field}
                                                                            onFocus={() => setIsTokenDropdownOpen(true)}
                                                                            className="pr-8"
                                                                            autoComplete="off"
                                                                        />
                                                                        <ChevronDown
                                                                            className={`absolute right-2 top-2.5 h-4 w-4 text-muted-foreground transition-transform duration-200 ${isTokenDropdownOpen ? "rotate-180" : ""
                                                                                }`}
                                                                        />

                                                                        {isTokenDropdownOpen && (
                                                                            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                                                                                <div className="p-1 max-h-48 overflow-y-auto">
                                                                                    {supportedTokens.map((token) => (
                                                                                        <button
                                                                                            key={token.symbol}
                                                                                            type="button"
                                                                                            onClick={() => {
                                                                                                field.onChange(token.symbol)
                                                                                                setIsTokenDropdownOpen(false)
                                                                                            }}
                                                                                            className="w-full text-left p-2 hover:bg-muted rounded-sm transition-colors duration-150 flex items-center justify-between"
                                                                                        >
                                                                                            <div>
                                                                                                <div className="text-sm font-medium">{token.symbol}</div>
                                                                                                <div className="text-xs text-muted-foreground">{token.name}</div>
                                                                                            </div>
                                                                                            {field.value === token.symbol && (
                                                                                                <div className="w-2 h-2 bg-primary rounded-full" />
                                                                                            )}
                                                                                        </button>
                                                                                    ))}

                                                                                    {field.value &&
                                                                                        !supportedTokens.some((token) => token.symbol === field.value) && (
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => {
                                                                                                    setIsTokenDropdownOpen(false)
                                                                                                }}
                                                                                                className="w-full text-left p-2 hover:bg-muted rounded-sm transition-colors duration-150 flex items-center justify-between border-t"
                                                                                            >
                                                                                                <div>
                                                                                                    <div className="text-sm font-medium">Custom Token</div>
                                                                                                    <div className="text-xs text-muted-foreground truncate">
                                                                                                        {field.value}
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="w-2 h-2 bg-primary rounded-full" />
                                                                                            </button>
                                                                                        )}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="amount"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Amount</FormLabel>
                                                                <FormControl>
                                                                    <div className="relative">
                                                                        <Input type="number" placeholder="0.00" {...field} className="pr-16" />
                                                                        <span className="absolute right-3 top-2 text-sm text-muted-foreground">
                                                                            {getTokenDisplay(watchedToken)}
                                                                        </span>
                                                                    </div>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <div className="flex gap-2">
                                                        <Button type="submit" className="flex-1 transition-all duration-200 hover:scale-[1.02]">
                                                            Confirm
                                                        </Button>
                                                    </div>
                                                </form>
                                            </Form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Project Description */}
                        <Card className="p-6">
                            <div className="prose prose-gray dark:prose-invert max-w-none">
                                <ReactMarkdown
                                    components={{
                                        h1: ({ ...props }) => <h1 className="text-3xl font-bold mb-4" {...props} />,
                                        h2: ({ ...props }) => <h2 className="text-2xl font-semibold mb-3" {...props} />,
                                        h3: ({ ...props }) => <h3 className="text-xl font-semibold mb-2" {...props} />,
                                        p: ({ ...props }) => <p className="text-muted-foreground mb-4" {...props} />,
                                        ul: ({ ...props }) => <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4" {...props} />,
                                        ol: ({ ...props }) => <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4" {...props} />,
                                        li: ({ ...props }) => <li className="text-muted-foreground" {...props} />,
                                        a: ({ ...props }) => <a className="text-primary hover:underline" {...props} />,
                                    }}
                                >
                                    {defaultDescription}
                                </ReactMarkdown>
                            </div>
                        </Card>

                        {/* Associated NFTs */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Associated NFTs</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {nfts.map((nft) => (
                                    <Link
                                        key={nft.id}
                                        href={`/project/${nft.id}`}
                                        className="hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                                    >
                                        <Card key={nft.id} className="overflow-hidden bg-zinc-800">
                                            <div className="aspect-square relative">
                                                <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
                                            </div>
                                            <CardContent className="p-3">
                                                <h3 className="font-medium text-sm mb-1 truncate">{nft.name}</h3>
                                                <Badge variant="outline" className="text-green-500 border-green-500">
                                                    Verifed
                                                </Badge>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </Card>

                        {/* Team Section */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Meet the Team</h2>
                            <p className="text-muted-foreground mb-6">
                                Our diverse team brings together expertise from gaming, blockchain, and design to create an exceptional
                                experience.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src="/placeholder.svg?height=64&width=64&query=male game developer portrait" />
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">John Doe</h3>
                                        <p className="text-sm text-muted-foreground mb-2">Lead Game Developer</p>
                                        <p className="text-sm text-muted-foreground">
                                            Former senior developer at Epic Games with 8+ years experience in Unreal Engine and multiplayer
                                            systems.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src="/placeholder.svg?height=64&width=64&query=female blockchain engineer portrait" />
                                        <AvatarFallback>SA</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">Sarah Anderson</h3>
                                        <p className="text-sm text-muted-foreground mb-2">Blockchain Engineer</p>
                                        <p className="text-sm text-muted-foreground">
                                            Smart contract specialist with expertise in Ethereum and Polygon. Previously worked at ConsenSys.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src="/placeholder.svg?height=64&width=64&query=male creative director portrait" />
                                        <AvatarFallback>MR</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">Mike Rodriguez</h3>
                                        <p className="text-sm text-muted-foreground mb-2">Creative Director</p>
                                        <p className="text-sm text-muted-foreground">
                                            Award-winning artist and designer with experience at Blizzard Entertainment and Riot Games.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src="/placeholder.svg?height=64&width=64&query=female product manager portrait" />
                                        <AvatarFallback>EL</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">Emily Liu</h3>
                                        <p className="text-sm text-muted-foreground mb-2">Product Manager</p>
                                        <p className="text-sm text-muted-foreground">
                                            Former PM at Meta with expertise in virtual worlds and user experience design for gaming
                                            platforms.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src="/placeholder.svg?height=64&width=64&query=male marketing director portrait" />
                                        <AvatarFallback>DK</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">David Kim</h3>
                                        <p className="text-sm text-muted-foreground mb-2">Marketing Director</p>
                                        <p className="text-sm text-muted-foreground">
                                            Growth marketing expert with successful launches at major gaming studios and Web3 companies.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src="/placeholder.svg?height=64&width=64&query=female technical lead portrait" />
                                        <AvatarFallback>AL</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">Anna Lopez</h3>
                                        <p className="text-sm text-muted-foreground mb-2">Technical Lead</p>
                                        <p className="text-sm text-muted-foreground">
                                            Full-stack engineer specializing in scalable backend systems and real-time multiplayer
                                            architecture.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}