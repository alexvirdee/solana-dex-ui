'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from 'axios';

type Token = {
  address: string;
  name: string;
  symbol: string;
  price: number;
  volume_24h: number;
  liquidity: number;
  logoURI: string;
};

export default function Home() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenList = 'https://public-api.birdeye.so/defi/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=50&min_liquidity=100';

    const fetchTokens = async() => {
      try {
        const res = await axios.get(tokenList, {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_BIRDEYE_API_KEY!
          },
        });

        console.log('res', res)

        setTokens(res.data.data.tokens); 
      } catch (error) {
        console.error('Error fetching tokens', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTokens();
  }, [])

  if (loading) return <p>Loading tokens...</p>

  return (
    <div>
      solana dex ui

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {tokens.map((token) => (
        <div key={token.address} className="border rounded-xl p-4 shadow hover:shadow-md transition">
          <div className="flex items-center gap-2 mb-2">
            <img src={token.logoURI} alt={token.symbol} className="w-6 h-6" />
            <h2 className="text-lg font-semibold">{token.symbol}</h2>
          </div>
          <p>Name: {token.name}</p>
          <p>Price: ${token.price.toFixed(4)}</p>
          <p>Volume (24h): ${Number(token.volume_24h).toLocaleString()}</p>
          <p>Liquidity: ${Number(token.liquidity).toLocaleString()}</p>
        </div>
      ))}
    </div>
    </div>
  );
}
