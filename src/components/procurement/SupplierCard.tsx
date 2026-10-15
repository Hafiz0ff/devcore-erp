import { Link } from "react-router-dom";
import { Star, Phone, MapPin, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Money } from "@/components/ui/money";
import type { Supplier } from "@/types";
import { supplierTypeMeta } from "@/utils/formatters";

export function SupplierCard({ supplier }: { supplier: Supplier }) {
  return (
    <Link to={`/suppliers/${supplier.id}`}>
      <Card className="group h-full p-4 transition-shadow hover:shadow-[var(--shadow-panel)]">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div>
            <StatusBadge tone="default" dot={false} className="mb-1.5">
              {supplierTypeMeta[supplier.type]}
            </StatusBadge>
            <h3 className="text-[14.5px] font-semibold text-[var(--color-ink-900)]">{supplier.name}</h3>
            <p className="text-xs text-[var(--color-ink-500)]">{supplier.category}</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-[var(--color-ink-400)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-brand-800)]" />
        </div>

        <div className="mb-3 flex items-center gap-1 text-xs text-[var(--color-ink-500)]">
          <Star className="h-3.5 w-3.5 fill-[var(--color-gold-500)] text-[var(--color-gold-500)]" />
          <span className="tnum font-medium text-[var(--color-ink-700)]">{supplier.reliabilityRating.toFixed(1)}</span>
          <span>надёжность · задержка ~{supplier.avgDeliveryDelayDays} дн.</span>
        </div>

        <div className="mb-3 flex flex-col gap-1 text-xs text-[var(--color-ink-500)]">
          <div className="flex items-center gap-1.5 truncate">
            <Phone className="h-3 w-3 shrink-0" /> {supplier.phone}
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="h-3 w-3 shrink-0" /> {supplier.address}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-1.5 border-t border-[var(--color-border)] pt-3 text-xs">
          <div className="text-[var(--color-ink-500)]">Всего закуплено</div>
          <Money amount={supplier.totalPurchased} compact className="text-right font-medium text-[var(--color-ink-900)]" />
          <div className="text-[var(--color-ink-500)]">Текущий долг</div>
          <Money
            amount={supplier.currentDebt}
            compact
            className={`text-right font-medium ${supplier.currentDebt > 0 ? "text-[var(--color-risk-600)]" : "text-[var(--color-positive-600)]"}`}
          />
        </div>
      </Card>
    </Link>
  );
}
