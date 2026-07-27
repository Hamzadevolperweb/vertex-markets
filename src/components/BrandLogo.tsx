import { logoOfficial, assetLogo3dV } from '../assets/images';

interface BrandLogoProps {
  onClick?: () => void;
  variant?: 'full' | 'mark' | 'text';
  className?: string;
}

export default function BrandLogo({ onClick, variant = 'mark', className = '' }: BrandLogoProps) {
  const inner =
    variant === 'text' ? (
      <div className="flex flex-col leading-none text-left">
        <span className="font-display font-bold text-[17px] tracking-[0.14em] text-white uppercase">Vunex</span>
        <span className="text-[10px] tracking-[0.32em] text-brand-blue uppercase mt-1">Market</span>
      </div>
    ) : variant === 'full' ? (
      <img
        src={logoOfficial}
        alt="Vunex Market"
        className="h-12 md:h-14 w-auto object-contain object-left brightness-[1.45] contrast-[1.2] drop-shadow-[0_0_14px_rgba(30,96,255,0.45)]"
      />
    ) : (
      /* mark: readable composite — bright V + white/blue wordmark */
      <div className="flex items-center gap-2.5">
        <img
          src={assetLogo3dV}
          alt=""
          className="h-10 md:h-11 w-auto object-contain drop-shadow-[0_0_16px_rgba(30,96,255,0.55)]"
          draggable={false}
        />
        <div className="flex flex-col leading-none text-left">
          <span className="font-display font-bold text-[16px] md:text-[18px] tracking-[0.16em] text-white uppercase">
            Vunex
          </span>
          <span className="text-[9px] md:text-[10px] tracking-[0.34em] text-brand-blue uppercase mt-1 font-semibold">
            Market
          </span>
        </div>
      </div>
    );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center cursor-pointer focus:outline-none ${className}`}
        aria-label="Vunex Market home"
      >
        {inner}
      </button>
    );
  }

  return <div className={`flex items-center ${className}`}>{inner}</div>;
}
