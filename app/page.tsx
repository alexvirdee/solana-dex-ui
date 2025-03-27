'use client';

import { useEffect, useState } from "react";
import axios from 'axios';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import TokenCard from "./components/TokenCard";

type Token = {
  v24hUSD(v24hUSD: any): unknown;
  address: string;
  name: string;
  symbol: string;
  price: number;
  liquidity: number;
  logoURI: string;
};

export default function Home() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Initial app effect to get list of tokens
  useEffect(() => {
    const tokenList = 'https://public-api.birdeye.so/defi/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=50&min_liquidity=100';

    const fetchTokens = async () => {
      try {
        const cache = localStorage.getItem('tokenCache');
        const cacheTime = localStorage.getItem('tokenCacheTimestamp');
        const now = Date.now();

        // If the cache exists and is < 10 minutes old, use it
        if (cache && cacheTime && now - parseInt(cacheTime) < 10 * 60 * 1000) {
          const parsed = JSON.parse(cache);
          setTokens(parsed);
          setLoading(false);

          return;
        }

        const res = await axios.get(tokenList, {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_BIRDEYE_API_KEY!
          },
        });

        console.log('res', res);

        setTokens(res.data.data.tokens);

        // Save to localStorage for caching to avoid 429 rate limiting api error from bird eye
        localStorage.setItem("tokenCache", JSON.stringify(res.data.data.tokens));
        localStorage.setItem("tokenCacheTimestamp", now.toString());

      } catch (error) {
        console.error('Error fetching tokens', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTokens();
  }, [])

  // Watchlist logic for homepage
  // {tokens.map((token) => {
  //   const [isInWatchList, setIsInWatchList] = useState(false);

  //   // Track tokens in watchlist
  //   useEffect(() => {
  //     const existing = JSON.parse(localStorage.getItem("watchlist") || "[]");
  //     const found = existing.some((t: any) => t.address === token.address);
  //     setIsInWatchList(found);
  //   }, [token.address]);


  //   const toggleWatchList = (e: React.MouseEvent) => {
  //     e.stopPropagation();
  //     const existing = JSON.parse(localStorage.getItem("watchlist") || "[]");

  //     let updated;
  //     if (isInWatchList) {
  //       updated = existing.filter((t: any) => t.address !== token.address);
  //     } else {
  //       updated = [...existing, token];
  //     }

  //     localStorage.setItem("watchlist", JSON.stringify(updated));
  //     setIsInWatchList(!isInWatchList);
  //   }

  // })}

  const handleCardClick = (token: Token) => {
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

  if (loading) return <p>Loading tokens...</p>

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
