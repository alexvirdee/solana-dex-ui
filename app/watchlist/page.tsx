'use client';

import { useEffect, useState } from 'react';
import TokenCard from '../components/TokenCard';

export default function Watchlist() {
  const [tokens, setTokens] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("watchlist");

    if (saved) {
      setTokens(JSON.parse(saved));
    }
  }, []);

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

    window.location.href = `/token/${token.address}?${query}`;
  };

  const handleRemove = (address: string) => {
    const updated = tokens.filter(t => t.address !== address);
    setTokens(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Watchlist</h1>

      {tokens.length === 0 ? (
        <p>Your watchlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tokens.map((token) => (
            <TokenCard
              key={token.address}
              token={token}
              onClick={() => handleCardClick(token)}
              onRemove={handleRemove}
              showRemove={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
