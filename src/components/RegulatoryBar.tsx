import { motion } from 'motion/react';
import { Shield, Building2, Landmark, Gavel, Award } from 'lucide-react';

export default function RegulatoryBar() {
  const regulations = [
    {
      acronym: 'FCA',
      name: 'Financial Conduct Authority',
      desc: 'Providers for minimal slippage',
      icon: <Gavel className="w-6 h-6 text-gray-400 group-hover:text-brand-blue transition-colors" />,
    },
    {
      acronym: 'ASIC',
      name: 'Australian Securities & Investments Commission',
      desc: 'Australian regulatory compliance',
      icon: <Building2 className="w-6 h-6 text-gray-400 group-hover:text-brand-blue transition-colors" />,
    },
    {
      acronym: 'FSCA',
      name: 'Financial Sector Conduct Authority',
      desc: 'Financial sector safety standards',
      icon: <Landmark className="w-6 h-6 text-gray-400 group-hover:text-brand-blue transition-colors" />,
    },
    {
      acronym: 'CySEC',
      name: 'Cyprus Securities & Exchange Commission',
      desc: 'EU passported investment security',
      icon: <Award className="w-6 h-6 text-gray-400 group-hover:text-brand-blue transition-colors" />,
    },
    {
      acronym: 'DFSA',
      name: 'Dubai Financial Services Authority',
      desc: 'Middle East standard regulatory auth',
      icon: <Shield className="w-6 h-6 text-gray-400 group-hover:text-brand-blue transition-colors" />,
    },
  ];

  return (
    <div className="w-full bg-[#050508]/60 border-y border-white/[0.04] py-8 relative overflow-hidden" id="regulatory-container">
      {/* Dynamic line glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-blue/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title label */}
        <p className="text-[10px] tracking-[0.3em] font-bold text-center text-gray-500 uppercase mb-6 font-display">
          Trusted. Regulated. Secure.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6 items-center">
          {regulations.map((reg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
              className="group flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.04] bg-[#070709] transition-all cursor-default"
              id={`reg-card-${reg.acronym}`}
            >
              <div className="flex-shrink-0 p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] group-hover:bg-brand-blue/5 group-hover:border-brand-blue/20 transition-all">
                {reg.icon}
              </div>
              <div className="text-left">
                <span className="font-display font-bold text-base text-white tracking-wider block">
                  {reg.acronym}
                </span>
                <span className="text-[9px] text-gray-500 leading-tight block mt-0.5 max-w-[120px] truncate">
                  {reg.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
