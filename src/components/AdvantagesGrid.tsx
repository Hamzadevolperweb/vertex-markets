import { motion } from 'motion/react';
import { assetBars, assetGauge, assetShield, assetMixer } from '../assets/images';

const ITEMS = [
  {
    title: 'Institutional Liquidity',
    desc: 'Access deep liquidity from Tier-1 providers for minimal slippage and maximum stability.',
    image: assetBars,
  },
  {
    title: 'Lightning Execution',
    desc: 'Average execution speed under 30ms with no dealing desk interference.',
    image: assetGauge,
  },
  {
    title: 'Security You Can Trust',
    desc: 'Segregated client funds, advanced encryption, and global regulatory oversight.',
    image: assetShield,
  },
  {
    title: 'Pro Trading Conditions',
    desc: 'Raw spreads, flexible leverage, and low commissions built for consistent performance.',
    image: assetMixer,
  },
];

export default function AdvantagesGrid() {
  return (
    <section className="py-16 md:py-20 bg-black" id="advantages">
      <div className="w-full px-6 lg:px-10 xl:px-14">
        <div className="text-center mb-12">
          <h2 className="font-display text-[22px] md:text-[28px] font-bold tracking-[0.04em] uppercase">
            <span className="text-white">Advantages Built For </span>
            <span className="text-brand-blue">Serious Traders</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {ITEMS.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              className="rounded-2xl border border-white/[0.07] bg-[#0c0c0e] px-5 pt-7 pb-6 text-center"
            >
              <div className="h-[110px] flex items-center justify-center mb-5">
                <img src={item.image} alt="" className="max-h-full max-w-[130px] w-auto object-contain" />
              </div>
              <h3 className="font-display text-[15px] font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-[12px] leading-relaxed text-white/40">{item.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
