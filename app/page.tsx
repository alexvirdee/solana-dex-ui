'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import TokenCard from "./components/TokenCard";
import { useCachedTokens } from './hooks/useCachedTokens';


export default function Home() {
  const { tokens, loading, error } = useCachedTokens();

  const router = useRouter();

  const handleCardClick = (token: any) => {
    const query = new URLSearchParams({
      address: token.address,
      name: token.name,
      symbol: token.symbol,
      price: token.price.toString(),
      liquidity: token.liquidity.toString(),
      volume: token.v24hUSD?.toString() || "0",
      logo: token.logoURI || ''
    }).toString();

    router.push(`/token/${token.address}?${query}`);
  }

  if (loading) return <p className="p-6">Loading tokens...</p>
  if (error) return <p className="p-6">There was an error loading tokens.</p>

  return (
    <div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {tokens.map((token) => (
          <TokenCard 
            key={token.address}
            token={token}
            onClick={() => handleCardClick(token)}
          />
        ))}
      </div>
    </div>
  );
}
