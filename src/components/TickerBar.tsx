import {
  tickerEurUsd,
  tickerGbpUsd,
  tickerXauUsd,
  tickerUsdJpy,
  tickerBtcUsd,
  tickerUsOil,
} from '../assets/images';

const TICKER_IMAGES = [
  { symbol: 'EURUSD', image: tickerEurUsd },
  { symbol: 'GBPUSD', image: tickerGbpUsd },
  { symbol: 'XAUUSD', image: tickerXauUsd },
  { symbol: 'USDJPY', image: tickerUsdJpy },
  { symbol: 'BTCUSD', image: tickerBtcUsd },
  { symbol: 'USOIL', image: tickerUsOil },
];

/** Static equal-size ticker cards — display only, no selection or navigation */
export default function TickerBar() {
  return (
    <div className="w-full py-5 md:py-7" id="ticker-bar-container">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-3.5">
          {TICKER_IMAGES.map(({ symbol, image }) => (
            <div
              key={symbol}
              className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#0a0a0c] border border-white/[0.08]"
            >
              <img
                src={image}
                alt={symbol}
                className="w-full h-full object-cover object-center select-none pointer-events-none"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
