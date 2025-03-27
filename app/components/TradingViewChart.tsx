import { useEffect, useRef } from 'react';

export default function TradingViewChart({ symbol }: { symbol: string }) {
  const ref = useRef<HTMLDivElement>(null);

  console.log('symbol?', symbol)

  useEffect(() => {
    if (!ref.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      new TradingView.widget({
        width: "100%",
        height: 500,
        symbol: symbol, // Format: AGIX/SOL or AGIXUSDT
        interval: '15',
        timezone: 'Etc/UTC',
        theme: 'light',
        style: '1',
        locale: 'en',
        container_id: 'tradingview_chart'
      });
    };

    ref.current.appendChild(script);
  }, [symbol]);

  return <div id="tradingview_chart" ref={ref} className="w-full h-[500px]" />;
}
