'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner"

type Props = {
    token: any;
    onClick: () => void;
    onRemove?: (address: string) => void;
    showRemove?: boolean;
  };

export default function TokenCard({ token, onClick, onRemove, showRemove }: Props) {
    const [isInWatchlist, setIsInWatchlist] = useState(false);

    useEffect(() => {
        const existing = JSON.parse(localStorage.getItem("watchlist") || "[]");
        const found = existing.some((t: any) => t.address === token.address);
        setIsInWatchlist(found);
      }, [token.address]);
    
      const toggleWatchlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        const existing = JSON.parse(localStorage.getItem("watchlist") || "[]");
    
        const updated = isInWatchlist
          ? existing.filter((t: any) => t.address !== token.address)
          : [...existing, token];

          console.log('updated', updated);
    
        localStorage.setItem("watchlist", JSON.stringify(updated));
        setIsInWatchlist(!isInWatchlist);

        // If we are in the watchlist view - trigger parent to remove the component
        if (isInWatchlist && onRemove) {
            toast(`Removed ${token.name} from Watchlist`)
            onRemove(token.address);
        } else {
            // Token has been added to the watchlist show a toast to the user
            toast(`Added ${token.name} to Watchlist`)
        }
      };
    
      return (
        <div
          onClick={onClick}
          className="border rounded-xl p-4 shadow hover:shadow-md transition cursor-pointer hover:bg-blue-100"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <img src={token.logoURI || '/fallback-token.svg'} alt={token.symbol} className="w-6 h-6" />
              <h2 className="text-lg font-semibold">{token.symbol}</h2>
            </div>
            <Button
              variant="ghost"
              className={`text-xs cursor-pointer ${isInWatchlist ? 'text-red-500' : 'text-blue-500'}`}
              onClick={toggleWatchlist}
            >
              {isInWatchlist ? '– Watchlist' : '+ Watchlist'}
            </Button>
          </div>
          <p>Name: {token.name}</p>
          <p>Price: ${token.price.toFixed(4)}</p>
          <p>Volume (24h): ${Number(token.v24hUSD || 0).toLocaleString()}</p>
          <p>Liquidity: ${Number(token.liquidity).toLocaleString()}</p>
        </div>
      );
}