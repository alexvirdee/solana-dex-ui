'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import logo from '../../assets/solraider-logo.png';
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [allTokens, setAllTokens] = useState<any[]>([]);

    const router = useRouter();

    // Fetch Jupiter's public token list on mount
    // useEffect(() => {
    //     const fetchAllTokens = async () => {
    //         try {
    //           const res = await fetch("https://public-api.birdeye.so/defi/tokenlist?limit=10000", {
    //             headers: {
    //               'X-API-KEY': process.env.NEXT_PUBLIC_BIRDEYE_API_KEY!,
    //             },
    //           });
        
    //           const json = await res.json();
    //           const tokens = json.data.tokens || [];
    //           console.log("Birdeye token list:", tokens);
    //           setAllTokens(tokens);
    //         } catch (err) {
    //           console.error("Failed to fetch token list from Birdeye:", err);
    //         }
    //       };

    //     fetchAllTokens();
    // }, [])

    // Local search on input change
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        const filtered = allTokens.filter((t) =>
            t.symbol?.toLowerCase().includes(query.toLowerCase()) ||
            t.name?.toLowerCase().includes(query.toLowerCase())
        );

        console.log('filtered results', filtered);

        setResults(filtered.slice(0, 10)); // limit to top 10 results
        setShowDropdown(true);
    }, [query, allTokens]);

    const handleSelect = (token: any) => {
        const queryParams = new URLSearchParams({
            address: token.address,
            name: token.name,
            symbol: token.symbol,
            price: token.price?.toString() || '0',
            liquidity: '0',
            volume: '0',
            logo: token.logoURI || ''
        }).toString();

        setQuery('');
        setShowDropdown(false);
        router.push(`/token/${token.address}?${queryParams}`);
    };

    return (
        <header className="w-full border-b bg-background sticky top-0 z-[100] relative">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold tracking-wide flex items-center gap-2">
                    {/* TODO: Work on app logo */}
                    {/* <Image src={logo} alt="SolRaider" width={250} height={250} className="w-6 h-6" />  */}
                    SolRaider
                </Link>

                {/* Center: Search */}
                <div className="relative w-72">
                    <Input
                        type="text"
                        placeholder="Search tokens..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="text-sm"
                    />
                    {showDropdown && results.length > 0 && (
                        <div className="absolute w-full bg-white border rounded-md shadow mt-1 max-h-64 overflow-y-auto z-50">
                            {results.map((token) => (
                                <div
                                    key={token.address}
                                    onClick={() => handleSelect(token)}
                                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                >
                                    {token.logoURI && (
                                        <img src={token.logoURI} alt={token.symbol} className="w-5 h-5" />
                                    )}
                                    <span className="text-sm font-medium">{token.symbol}</span>
                                    <span className="text-xs text-gray-500">({token.name})</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

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