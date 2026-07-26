import { logoOfficial } from '../assets/images';

interface BrandLogoProps {
  onClick?: () => void;
  variant?: 'full' | 'mark' | 'text';
  className?: string;
}

export default function BrandLogo({ onClick, variant = 'mark', className = '' }: BrandLogoProps) {
  const inner =
    variant === 'text' ? (
      <div className="flex flex-col leading-none text-left">
        <span className="font-display font-bold text-[15px] tracking-[0.14em] text-white uppercase">Vunex</span>
        <span className="text-[9px] tracking-[0.32em] text-brand-blue uppercase mt-1">Market</span>
      </div>
    ) : (
      <img
        src={logoOfficial}
        alt="Vunex Market"
        className="h-9 md:h-10 w-auto object-contain object-left"
      />
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
