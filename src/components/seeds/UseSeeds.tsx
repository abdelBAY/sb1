import { useMemo, useState } from 'react';
import { Sprout } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UseSeedsProps {
  cost: number;
  balance?: number | null;
  label: string;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  helperText?: string;
  emptyMessage?: string;
}

export default function UseSeeds({
  cost,
  balance,
  label,
  onClick,
  disabled = false,
  loading = false,
  className = '',
  helperText,
  emptyMessage,
}: UseSeedsProps) {
  const { t } = useTranslation('common');
  const [internalLoading, setInternalLoading] = useState(false);
  const totalLoading = loading || internalLoading;
  const hasEnoughSeeds = useMemo(() => {
    if (balance === null || balance === undefined) return true;
    return balance >= cost;
  }, [balance, cost]);
  const balanceLabel = t('seeds.balanceLabel', 'Balance');
  const balanceText =
    balance === null || balance === undefined
      ? '—'
      : t('seeds.seedUnit', { count: balance });
  const costTag = t('seeds.costTag', { count: cost });

  const handleClick = async () => {
    if (!onClick || totalLoading || disabled || !hasEnoughSeeds) return;
    const maybePromise = onClick();
    if (maybePromise && maybePromise instanceof Promise) {
      try {
        setInternalLoading(true);
        await maybePromise;
      } finally {
        setInternalLoading(false);
      }
    }
  };

  return (
    <div className={`flex flex-col gap-2 items-end ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || totalLoading || !hasEnoughSeeds}
        className={`
          inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
          transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          shadow-md hover:shadow-lg
          ${
            disabled || totalLoading || !hasEnoughSeeds
              ? 'bg-emerald-200 text-emerald-700 cursor-not-allowed opacity-70'
              : 'bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 text-white hover:from-emerald-600 hover:via-green-600 hover:to-lime-600 focus-visible:ring-emerald-400'
          }
        `}
      >
        <span className="flex items-center gap-2">
          <span className="relative isolate flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-white/20 blur-sm" />
            <Sprout className="relative w-4 h-4" />
          </span>
          {totalLoading ? 'Working...' : label}
        </span>
        <span
          className={`
            rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wide
            ${
              disabled || totalLoading || !hasEnoughSeeds
                ? 'bg-white/50 text-emerald-700'
                : 'bg-white/20 text-white'
            }
          `}
        >
          {costTag}
        </span>
      </button>
      <div className="flex flex-col gap-1">
        <p className="text-xs text-emerald-700/80 dark:text-emerald-200/80 font-medium">
          {balanceLabel}: {balanceText}
        </p>
        {!hasEnoughSeeds && (
          <p className="text-sm rounded-lg bg-emerald-50/80 dark:bg-emerald-900/40 border border-emerald-100/80 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-200 px-3 py-2 font-medium">
            {emptyMessage ?? "You've used all your seeds. Give something to earn more and keep growing!"}
          </p>
        )}
        {helperText && (
          <p className="text-xs text-emerald-700/70 dark:text-emerald-300/70">
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
}

