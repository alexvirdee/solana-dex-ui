'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export type Token = {
    address: string;
    name: string;
    symbol: string;
    price: number;
    liquidity: number;
    logoURI: string;
    v24hUSD: number;
};

const TOKEN_CACHE_KEY = 'tokenCache';
const TOKEN_CACHE_TIMESTAMP = 'tokenCacheTimestamp';
const TOKEN_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export function useCachedTokens() {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const tokenList = 'https://public-api.birdeye.so/defi/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=50&min_liquidity=100';

    useEffect(() => {
        const fetchTokens = async () => {
            try {
                const cached = localStorage.getItem(TOKEN_CACHE_KEY);
                const cachedTime = localStorage.getItem(TOKEN_CACHE_TIMESTAMP);
                const now = Date.now();

                if (cached && cachedTime && now - parseInt(cachedTime) < TOKEN_CACHE_TTL) {
                    setTokens(JSON.parse(cached));
                    setLoading(false);
                    return;
                }

                const res = await axios.get(tokenList, {
                    headers: {
                        'X-API-KEY': process.env.NEXT_PUBLIC_BIRDEYE_API_KEY!,
                    },
                });

                const freshTokens = res.data.data.tokens;
                setTokens(freshTokens);

                localStorage.setItem(TOKEN_CACHE_KEY, JSON.stringify(freshTokens));
                localStorage.setItem(TOKEN_CACHE_TIMESTAMP, now.toString());
            } catch (err: any) {
                console.error('Error fetching tokens:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTokens();
    }, []);

    return { tokens, loading, error };
}