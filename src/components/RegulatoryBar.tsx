import { motion } from 'motion/react';
import fcaLogo from '../assets/images/extracted/regulation/fca_logo.png';
import asicLogo from '../assets/images/extracted/regulation/asic_logo.png';
import fscaLogo from '../assets/images/extracted/regulation/fsca_logo.png';
import cysecLogo from '../assets/images/extracted/regulation/cysec_logo.png';
import dfsaLogo from '../assets/images/extracted/regulation/dfsa_logo.png';

const REGULATORS = [
  { acronym: 'FCA', name: 'Financial Conduct\nAuthority', logo: fcaLogo },
  { acronym: 'ASIC', name: 'Australian Securities &\nInvestments Commission', logo: asicLogo },
  { acronym: 'FSCA', name: 'Financial Sector\nConduct Authority', logo: fscaLogo },
  { acronym: 'CySEC', name: 'Cyprus Securities &\nExchange Commission', logo: cysecLogo },
  { acronym: 'DFSA', name: 'Dubai Financial\nServices Authority', logo: dfsaLogo },
];

export default function RegulatoryBar() {
  return (
    <section className="w-full py-6 md:py-8" id="regulatory-container">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/[0.1] bg-[#101012] px-4 py-8 md:px-6 md:py-9 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <p className="text-center text-[10px] tracking-[0.42em] font-semibold text-white/55 uppercase mb-8">
            Trusted. Regulated. Secure.
          </p>

          <div className="flex flex-col md:flex-row md:items-stretch md:justify-between gap-7 md:gap-0">
            {REGULATORS.map((r, i) => (
              <div key={r.acronym} className="flex md:flex-1 items-center min-w-0">
                {i > 0 && (
                  <div className="hidden md:block w-px self-stretch bg-white/[0.12] mx-2 lg:mx-3 shrink-0" />
                )}
                <div className="flex items-center gap-3 md:justify-center w-full px-1">
                  <img
                    src={r.logo}
                    alt={`${r.acronym} logo`}
                    className="h-10 md:h-11 w-auto max-w-[72px] object-contain brightness-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]"
                    draggable={false}
                  />
                  <div className="min-w-0 text-left">
                    <div className="font-display text-[14px] md:text-[15px] font-bold text-white tracking-[0.04em]">
                      {r.acronym}
                    </div>
                    <div className="text-[9px] md:text-[10px] text-white/45 leading-[1.35] whitespace-pre-line mt-0.5">
                      {r.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
