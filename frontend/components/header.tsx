import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ConnectButton } from "@/components/connect-button";

export function Header() {
    return (
        <header className="w-full fixed top-0 left-0 right-0 z-50 backdrop-blur-[2px]">
            <div className="w-full flex h-16 items-center justify-between px-8">
                {/* Logo/Title */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-semibold">HackFund</span>
                    </Link>
                </div>

                {/* Center Navigation */}
                <nav className="flex items-center space-x-8">
                    <Button variant="secondary" className="rounded-full" asChild>
                        <Link href="/explore">Explore</Link>
                    </Button>
                    <Button variant="secondary" className="rounded-full" asChild>
                        <Link href="/launch">Launch</Link>
                    </Button>
                </nav>

                {/* Connect Button */}
                <div>
                    <ConnectButton />
                </div>
            </div>
        </header>
    );
}
