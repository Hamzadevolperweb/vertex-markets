import { motion } from 'motion/react';
import { featLiquidity, featExecution, featSecurity, featProConditions } from '../assets/images';

const ITEMS = [
  {
    title: 'Institutional Liquidity',
    desc: 'Access deep liquidity from Tier-1 providers for minimal slippage and maximum stability.',
    image: featLiquidity,
  },
  {
    title: 'Lightning Execution',
    desc: 'Average execution speed under 30ms with no dealing desk interference.',
    image: featExecution,
  },
  {
    title: 'Security You Can Trust',
    desc: 'Segregated client funds, advanced encryption, and global regulatory oversight.',
    image: featSecurity,
  },
  {
    title: 'Pro Trading Conditions',
    desc: 'Raw spreads, flexible leverage, and low commissions built for consistent performance.',
    image: featProConditions,
  },
];

export default function AdvantagesGrid() {
  return (
    <section className="py-14 md:py-16 bg-black" id="advantages">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-12 md:mb-14">
          <h2 className="font-display text-[18px] md:text-[24px] font-bold tracking-[0.08em] uppercase">
            <span className="text-white">Advantages Built For </span>
            <span className="text-brand-blue">Serious Traders</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {ITEMS.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              className="rounded-xl border border-white/[0.1] bg-[#121214] px-4 pt-5 pb-5 text-left hover:border-brand-blue/30 transition-colors overflow-visible"
            >
              <div className="relative h-[120px] mb-3.5 flex items-center justify-center overflow-visible">
                <img
                  src={item.image}
                  alt=""
                  className="max-h-[108px] max-w-[108px] w-auto h-auto object-contain drop-shadow-[0_6px_18px_rgba(30,96,255,0.3)] brightness-110 contrast-110"
                  draggable={false}
                />
              </div>
              <h3 className="font-display text-[13px] font-semibold text-white mb-1.5">
                {item.title}
              </h3>
              <p className="text-[12px] leading-relaxed text-white/50">{item.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
