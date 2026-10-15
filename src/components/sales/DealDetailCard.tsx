import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Money } from "@/components/ui/money";
import type { SaleDeal } from "@/types";
import { dealStatusMeta, unitTypeMeta, formatDate } from "@/utils/formatters";
import { getClient, getUnit } from "@/data/mockData";
import { CheckCircle2, Circle } from "lucide-react";

export function DealDetailCard({ deal }: { deal: SaleDeal }) {
  const client = getClient(deal.clientId);
  const unit = getUnit(deal.unitId);
  const meta = dealStatusMeta[deal.status];

  const paid = deal.schedule.filter((s) => s.paid);
  const upcoming = deal.schedule.filter((s) => !s.paid);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Сделка {deal.number}</CardTitle>
          <p className="text-xs text-[var(--color-ink-500)]">
            {unit?.number} · {unit && unitTypeMeta[unit.type]}
          </p>
        </div>
        <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="mb-4 rounded-lg border border-[var(--color-border)] p-3">
          <div className="text-[11px] text-[var(--color-ink-500)]">Клиент</div>
          <div className="text-sm font-medium">{client?.fullName}</div>
          <div className="text-xs text-[var(--color-ink-500)]">{client?.phone}</div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-[var(--color-ink-500)]">Цена объекта</span>
          <Money amount={deal.price} className="text-right font-medium" />
          <span className="text-[var(--color-ink-500)]">Скидка</span>
          <Money amount={deal.discount} className="text-right font-medium" />
          <span className="text-[var(--color-ink-500)]">Итоговая цена</span>
          <Money amount={deal.finalPrice} className="text-right font-semibold" />
          <span className="text-[var(--color-ink-500)]">Оплачено</span>
          <Money amount={deal.paidAmount} className="text-right font-medium text-[var(--color-positive-600)]" />
          <span className="text-[var(--color-ink-500)]">Остаток</span>
          <Money amount={deal.remainingAmount} className="text-right font-medium text-[var(--color-warn-600)]" />
        </div>

        {deal.schedule.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-500)]">
              График платежей
            </div>
            <ul className="flex max-h-64 flex-col gap-1.5 overflow-y-auto pr-1">
              {[...paid, ...upcoming].map((s) => (
                <li key={s.id} className="flex items-center gap-2 rounded-md border border-[var(--color-border)] px-2.5 py-1.5 text-sm">
                  {s.paid ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--color-positive-600)]" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 shrink-0 text-[var(--color-ink-400)]" />
                  )}
                  <span className="flex-1 text-[var(--color-ink-700)]">{formatDate(s.dueDate)}</span>
                  <Money amount={s.amount} className={s.paid ? "text-[var(--color-ink-500)]" : "font-medium"} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
