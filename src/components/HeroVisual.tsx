import { motion } from 'motion/react';
import { heroBullScene } from '../assets/images';

/**
 * Hero visual — composed bull + pedestal + glass scene
 * (transparent PNG from client asset, black bg removed)
 */
export default function HeroVisual({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className={`relative w-full max-w-[660px] mx-auto ${className}`}
    >
      {/* Soft blue bloom behind the scene */}
      <div
        className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[55%] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(30,96,255,0.28) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Floor glow under pedestal */}
      <div
        className="absolute bottom-[4%] left-1/2 -translate-x-1/2 w-[60%] h-[18%] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(30,96,255,0.45) 0%, transparent 70%)',
          filter: 'blur(28px)',
        }}
      />

      <img
        src={heroBullScene}
        alt="Vunex Market trading bull with live market panels"
        draggable={false}
        className="relative z-10 w-full h-auto object-contain select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
      />
    </motion.div>
  );
}
