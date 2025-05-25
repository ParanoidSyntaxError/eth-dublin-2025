"use client";

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, ChevronDown } from "lucide-react"
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Hack, HackMetadata } from "@/lib/schema";

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

interface FundFormProps {
    hack: Hack;
    metadata: HackMetadata;
}

export default function FundForm({ hack }: FundFormProps) {
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

    // Calculate funding progress
    const totalSupply = Number(hack.token.totalSupply);
    const initialSupply = Number(hack.token.initialSupply);
    const price = Number(hack.price);
    const PRICE_SCALE = 1e18;

    const raisedAmount = (price * (totalSupply - initialSupply)) / PRICE_SCALE;
    const targetAmount = (price * (1_000_000_000 * 1e18 - initialSupply)) / PRICE_SCALE;
    const fundingProgress = (raisedAmount / targetAmount) * 100;

    // Calculate time remaining
    const expiration = Number(hack.expiration) * 1000; // Convert to milliseconds
    const now = Date.now();
    const timeRemaining = expiration - now;
    const daysLeft = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)));

    const privateAllocation = (initialSupply / (1_000_000_000 * 1e18)) * 100;
    const publicAllocation = 100 - privateAllocation;

    return (
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
                        <div className="text-2xl font-bold">{(raisedAmount / 1e18).toLocaleString()} ETH</div>
                        <div className="text-sm text-muted-foreground">Raised</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{(targetAmount / 1e18).toLocaleString()} ETH</div>
                        <div className="text-sm text-muted-foreground">Goal</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{Math.floor((totalSupply - initialSupply) / 1e18)}</div>
                        <div className="text-sm text-muted-foreground">Tokens Minted</div>
                    </div>
                </div>

                <div>
                    <div className="relative">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Public Allocation</span>
                            <span className="text-sm text-muted-foreground">Private Allocation</span>
                        </div>
                        <Progress value={publicAllocation} />
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-sm font-medium">{publicAllocation.toFixed(0)}%</span>
                            <span className="text-sm font-medium">{privateAllocation.toFixed(0)}%</span>
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
    )
}