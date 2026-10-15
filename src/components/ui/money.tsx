import { cn } from "@/lib/utils";
import { formatMoney } from "@/utils/formatters";
import type { Currency } from "@/types";

interface MoneyProps {
  amount: number;
  currency?: Currency;
  compact?: boolean;
  className?: string;
  signColor?: boolean;
}

export function Money({ amount, currency = "TJS", compact = false, className, signColor = false }: MoneyProps) {
  const colorClass = signColor
    ? amount < 0
      ? "text-[var(--color-risk-600)]"
      : amount > 0
        ? "text-[var(--color-positive-600)]"
        : ""
    : "";
  return <span className={cn("tnum", colorClass, className)}>{formatMoney(amount, currency, compact)}</span>;
}
