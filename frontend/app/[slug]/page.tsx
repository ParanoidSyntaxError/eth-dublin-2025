import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import ReactMarkdown from 'react-markdown'
import Link from "next/link"
import FundForm from "@/components/fund-form";
import { getHackByToken } from "@/lib/subgraph";
import { fetchHackMetadata } from "@/lib/ipfs"
import { getOptimismNFTs } from "@/lib/alchemy"

export default async function HackPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const hack = await getHackByToken(slug);
    if (!hack) {
        return <></>
    }
    const metadata = await fetchHackMetadata(hack.metadataUri);
    if (!metadata) {
        return <></>
    }

    const nfts = await getOptimismNFTs(metadata.nfts);

    return (
        <div className="min-h-screen w-full bg-background pb-8">
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
                                    <AvatarImage src="/placeholder.svg" className="object-cover" />
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="secondary">{metadata.category}</Badge>
                                    </div>
                                    <h1 className="text-3xl font-bold mb-2">{metadata.name}</h1>
                                </div>
                            </div>
                        </Card>

                        <FundForm hack={hack} metadata={metadata} />

                        {/* Awards */}
                        {nfts && nfts.length > 0 && (
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Awards</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {nfts.map((nft, i) => (
                                        <Card key={i} className="hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden bg-zinc-800">
                                            <div className="aspect-square relative">
                                                <Image src={nft.image.cachedUrl || nft.image.originalUrl || "./placeholder.svg"} alt={"Nft"} fill className="object-cover" />
                                            </div>
                                            <CardContent className="p-3">
                                                <h3 className="font-medium text-sm mb-1 truncate">{nft.name}</h3>
                                                <Badge variant="outline" className="text-green-500 border-green-500">
                                                    Verifed
                                                </Badge>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </Card>
                        )}

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
                                    {metadata.description}
                                </ReactMarkdown>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}