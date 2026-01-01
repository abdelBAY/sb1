import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import seed1ImgWebp from '../../assets/optimized/seed1.webp';
import seed1ImgFallback from '../../assets/seed1.png';
import seedImgWebp from '../../assets/optimized/seed.webp';
import seedImgFallback from '../../assets/seed.png';
import sproutImgWebp from '../../assets/optimized/sprout.webp';
import sproutImgFallback from '../../assets/sprout.png';

interface SeedBalanceProps {
  balance?: number | null;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'nav' | 'card' | 'inline';
  showLabel?: boolean;
  label?: string;
  showEmptyMessage?: boolean;
  className?: string;
  emptyMessage?: string;
  onClick?: () => void;
}

const sizeMap = {
  sm: {
    padding: 'px-3 py-1.5',
    font: 'text-sm',
    icon: 'w-4 h-4',
    image: 'w-8 h-8',
    floatingImage: 'w-6 h-6',
    badge: 'text-xs',
  },
  md: {
    padding: 'px-4 py-2',
    font: 'text-base',
    icon: 'w-5 h-5',
    image: 'w-10 h-10',
    floatingImage: 'w-8 h-8',
    badge: 'text-sm',
  },
  lg: {
    padding: 'px-5 py-3',
    font: 'text-lg',
    icon: 'w-6 h-6',
    image: 'w-12 h-12',
    floatingImage: 'w-10 h-10',
    badge: 'text-base',
  },
};

const variantMap = {
  nav: 'bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 shadow-lg shadow-emerald-200/50 text-white',
  card: 'bg-white text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-200 border border-emerald-100/80 dark:border-emerald-500/20 shadow-[0_12px_30px_-15px_rgba(16,185,129,0.65)]',
  inline: 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800/40 shadow-sm',
};

export default function SeedBalance({
  balance,
  size = 'md',
  variant = 'card',
  showLabel = true,
  label = 'Seeds',
  showEmptyMessage = false,
  className = '',
  emptyMessage,
  onClick,
}: SeedBalanceProps) {
  const [delta, setDelta] = useState(0);
  const [showDelta, setShowDelta] = useState(false);
  const [floatingKey, setFloatingKey] = useState(0);
  const [floatingSeeds, setFloatingSeeds] = useState<
    Array<{ id: number; direction: 'up' | 'down'; offset: number }>
  >([]);
  const previousBalance = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const floatingTimeouts = useRef<number[]>([]);
  const seedIdRef = useRef(0);

  useEffect(() => {
    return () => {
      floatingTimeouts.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (balance === null || balance === undefined) return;

    const prev = previousBalance.current;
    if (prev !== null && prev !== balance) {
      const change = balance - prev;
      const direction: 'up' | 'down' = change > 0 ? 'up' : 'down';
      const offset = (Math.random() - 0.5) * 24;

      setDelta(change);
      setShowDelta(true);
      setFloatingKey((key) => key + 1);

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setShowDelta(false);
      }, 1400);

      seedIdRef.current += 1;
      const currentId = seedIdRef.current;
      setFloatingSeeds((prevSeeds) => [
        ...prevSeeds,
        { id: currentId, direction, offset },
      ]);

      const removalDelay = direction === 'up' ? 1600 : 1400;
      const removalId = window.setTimeout(() => {
        setFloatingSeeds((prevSeeds) =>
          prevSeeds.filter((seed) => seed.id !== currentId)
        );
        floatingTimeouts.current = floatingTimeouts.current.filter(
          (storedId) => storedId !== removalId
        );
      }, removalDelay);

      floatingTimeouts.current.push(removalId);
    }

    previousBalance.current = balance;

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [balance]);

  const formattedBalance = useMemo(() => {
    if (balance === null || balance === undefined) return '—';
    return balance.toLocaleString();
  }, [balance]);

  // Determine which seed image to use based on balance
  const getSeedImage = useMemo(() => {
    const seedCount = balance ?? 0;
    if (seedCount <= 3) return { webp: seed1ImgWebp, fallback: seed1ImgFallback }; // Low: 0-3 seeds
    if (seedCount <= 10) return { webp: seedImgWebp, fallback: seedImgFallback }; // Medium: 4-10 seeds
    return { webp: sproutImgWebp, fallback: sproutImgFallback }; // Full: 11+ seeds
  }, [balance]);

  const getFloatingSeedImage = (direction: 'up' | 'down') => {
    // For floating animations, use the current balance's image
    return getSeedImage.webp;
  };

  const { padding, font, icon, image, floatingImage, badge } = sizeMap[size];
  const variantClasses = variantMap[variant];
  const deltaPositive = delta > 0;
  const deltaNegative = delta < 0;
  const deltaClass = deltaPositive
    ? 'text-emerald-100'
    : deltaNegative
    ? 'text-emerald-50/90'
    : 'text-emerald-50/80';
  const fallbackEmptyMessage =
    emptyMessage ?? "You've used all your seeds. Give something to earn more and keep growing!";

  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      <div
        onClick={onClick}
        className={`
          relative flex items-center gap-2 rounded-2xl ${padding} ${variantClasses}
          transition-all duration-300 ease-out backdrop-blur-sm
          ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}
        `}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        } : undefined}
        aria-label={onClick ? 'Click to learn more about seeds' : undefined}
      >
        <div
          className={`flex items-center justify-center rounded-full bg-white/20 backdrop-blur px-2 py-1 shadow-inner`}
        >
          <picture>
            <source srcSet={getSeedImage.webp} type="image/webp" />
            <img
              src={getSeedImage.fallback}
              alt="Seed"
              className={`${image} object-contain`}
              loading="lazy"
            />
          </picture>
        </div>
        <div className="flex flex-col leading-tight">
          {showLabel && (
            <span className={`uppercase tracking-wide text-[11px] font-semibold opacity-90`}>
              {label}
            </span>
          )}
          <span className={`${font} font-semibold`}>
            {formattedBalance}
          </span>
        </div>

        {showDelta && delta !== 0 && (
          <span
            key={floatingKey}
            className={`
              absolute -top-4 right-3 ${badge} font-semibold ${deltaClass}
              seed-delta-pop
            `}
          >
            {deltaPositive ? '+' : ''}
            {delta}
          </span>
        )}

        {floatingSeeds.map((seed) => (
          <picture
            key={seed.id}
            className="pointer-events-none absolute"
            style={
              {
                right: '8px',
                ...(seed.direction === 'up'
                  ? { bottom: '-6px' }
                  : { top: '-6px' }),
                '--seed-shift': `${seed.offset}px`,
              } as CSSProperties & Record<string, string>
            }
            aria-hidden="true"
          >
            <source srcSet={getSeedImage.webp} type="image/webp" />
            <img
              src={getSeedImage.fallback}
              alt=""
              className={`${floatingImage} object-contain ${
                seed.direction === 'up'
                  ? 'seed-floating-up'
                  : 'seed-floating-down opacity-90'
              }`}
              loading="lazy"
            />
          </picture>
        ))}
      </div>

      {showEmptyMessage && (balance ?? 0) <= 0 && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-900/30 border border-emerald-100/80 dark:border-emerald-800/40 px-4 py-3 shadow-sm text-sm text-emerald-700 dark:text-emerald-200">
          <picture>
            <source srcSet={seed1ImgWebp} type="image/webp" />
            <img
              src={seed1ImgFallback}
              alt="Seed"
              className="w-8 h-8 object-contain"
              aria-label="seed"
              loading="lazy"
            />
          </picture>
          <p className="font-medium">
            {fallbackEmptyMessage}
          </p>
        </div>
      )}
    </div>
  );
}

