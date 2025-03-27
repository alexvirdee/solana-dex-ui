'use client';

import { useSearchParams } from "next/navigation";

export default function TokenDetailsPage() {
  const searchParams = useSearchParams();

  // Token Data
  const name = searchParams.get('name');
  const symbol = searchParams.get('symbol');
  const price = searchParams.get('price');
  const v24hUSD = searchParams.get('volume');
  const liquidity = searchParams.get('liquidity');
  const logo = searchParams.get('logo');

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        {logo && <img src={logo} alt={symbol || ''} className="w-12 h-12" />}
        <div>
          <h1 className="text-2xl font-bold">{name} ({symbol})</h1>
          <p className="text-gray-500">Address: (see URL)</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-lg">
        <p><strong>Price:</strong> ${Number(price).toFixed(4)}</p>
        <p><strong>Volume (24h):</strong> ${Number(v24hUSD).toLocaleString()}</p>
        <p><strong>Liquidity:</strong> ${Number(liquidity).toLocaleString()}</p>
      </div>
    </div>
  )
} 