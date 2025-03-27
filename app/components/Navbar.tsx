import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import logo from '../../assets/solraider-logo.png'

export default function Navbar() {
    return (
        <header className="w-full border-b bg-background sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold tracking-wide flex items-center gap-2">
                {/* TODO: Work on app logo */}
                {/* <Image src={logo} alt="SolRaider" width={250} height={250} className="w-6 h-6" />  */}
                    SolRaider
                </Link>

                <nav className="space-x-4">
                    <Link href="/" className="text-sm font-medium hover:underline">
                        Home
                    </Link>
                    <Link href="/watchlist" className="text-sm font-medium hover:underline">
                        Watchlist
                    </Link>
                    <Link href="/about" className="text-sm font-medium hover:underline">
                        About
                    </Link>
                </nav>

                <div>
                    <Button variant="outline">Connect Wallet</Button>
                </div>
            </div>
        </header>
    )
}