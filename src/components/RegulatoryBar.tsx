import { motion } from 'motion/react';

const REGULATORS = [
  { acronym: 'FCA', name: 'Financial Conduct Authority' },
  { acronym: 'ASIC', name: 'Australian Securities &\nInvestments Commission' },
  { acronym: 'FSCA', name: 'Financial Sector\nConduct Authority' },
  { acronym: 'CySEC', name: 'Cyprus Securities &\nExchange Commission' },
  { acronym: 'DFSA', name: 'Dubai Financial\nServices Authority' },
];

/** Design: single tray bar with vertical dividers — not separate cards */
export default function RegulatoryBar() {
  return (
    <section className="w-full py-8 md:py-10" id="regulatory-container">
      <div className="w-full px-6 lg:px-10 xl:px-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/[0.08] bg-[#0c0c0e] px-5 py-6 md:px-8 md:py-7"
        >
          <p className="text-center text-[10px] tracking-[0.35em] font-semibold text-white/40 uppercase mb-6">
            Trusted. Regulated. Secure.
          </p>

          <div className="flex flex-col md:flex-row md:items-stretch md:justify-between gap-5 md:gap-0">
            {REGULATORS.map((r, i) => (
              <div key={r.acronym} className="flex md:flex-1 items-center">
                {i > 0 && (
                  <div className="hidden md:block w-px self-stretch bg-white/[0.08] mx-3 lg:mx-4" />
                )}
                <div className="flex items-center gap-3 md:justify-center w-full">
                  <span className="font-display text-[15px] md:text-[16px] font-bold text-white tracking-[0.08em] shrink-0">
                    {r.acronym}
                  </span>
                  <span className="text-[9px] md:text-[10px] text-white/35 leading-snug whitespace-pre-line max-w-[120px]">
                    {r.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
