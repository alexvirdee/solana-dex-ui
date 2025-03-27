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
        console.log('api key =>', process.env.BIRDEYE_API_KEY)

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

      {tokens.map((token) => (
        <div key={token.address}>
          <p>Name: {token.name}</p>
        </div>
      ))}
    </div>
  );
}
