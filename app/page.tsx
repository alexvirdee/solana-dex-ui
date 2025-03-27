'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from 'axios';
import Link from "next/link";
import { useRouter } from "next/navigation";

type Token = {
  v24hUSD(v24hUSD: any): unknown;
  address: string;
  name: string;
  symbol: string;
  price: number;
  volume: number;
  liquidity: number;
  logoURI: string;
};

export default function Home() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter()

  useEffect(() => {
    const tokenList = 'https://public-api.birdeye.so/defi/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=50&min_liquidity=100';

    const fetchTokens = async () => {
      try {
        const res = await axios.get(tokenList, {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_BIRDEYE_API_KEY!
          },
        });

        console.log('res', res);

        setTokens(res.data.data.tokens);
      } catch (error) {
        console.error('Error fetching tokens', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTokens();
  }, [])

  const handleCardClick = (token: Token) => {
    const query = new URLSearchParams({
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
            <div onClick={() => handleCardClick(token)} key={token.address} className="border rounded-xl p-4 shadow hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-2">
                <img src={token.logoURI} alt={token.symbol} className="w-6 h-6" />
                <h2 className="text-lg font-semibold">{token.symbol}</h2>
              </div>
              <p>Name: {token.name}</p>
              <p>Price: ${token.price.toFixed(4)}</p>
              <p>Volume (24h): ${Number(token.v24hUSD).toLocaleString()}</p>
              <p>Liquidity: ${Number(token.liquidity).toLocaleString()}</p>
            </div>
        ))}
      </div>
    </div>
  );
}
