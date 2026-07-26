import { motion } from 'motion/react';
import { heroBullComposed } from '../assets/images';

/**
 * Pixel-matched hero visual from design page 0001.
 * Uses the pre-composited scene (bull + pedestal + labeled glass HUDs)
 * which matches the mockup composition exactly.
 */
export default function HeroVisual({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full aspect-square max-w-[560px] mx-auto ${className}`}>
      <div
        className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[75%] h-[40%] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(30,96,255,0.35) 0%, transparent 70%)',
          filter: 'blur(32px)',
        }}
      />
      <motion.img
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        src={heroBullComposed}
        alt="Vunex Market — institutional trading bull"
        className="relative z-10 w-full h-full object-contain select-none"
        draggable={false}
      />
    </div>
  );
}
