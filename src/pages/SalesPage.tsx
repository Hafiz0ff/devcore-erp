import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/KPICard";
import { Handshake, Wallet, Clock3, TrendingUp } from "lucide-react";
import { DealsTable } from "@/components/sales/DealsTable";
import { DealDetailCard } from "@/components/sales/DealDetailCard";
import { useScope } from "@/context/ScopeContext";
import { saleDeals } from "@/data/mockData";
import type { SaleDeal } from "@/types";
import { formatMoney } from "@/utils/formatters";

export default function SalesPage() {
  const { projectId } = useScope();
  const [selectedDeal, setSelectedDeal] = useState<SaleDeal | null>(null);

  const deals = useMemo(
    () => saleDeals.filter((d) => !projectId || d.projectId === projectId),
    [projectId]
  );

  const totals = useMemo(
    () => ({
      count: deals.length,
      totalValue: deals.reduce((s, d) => s + d.finalPrice, 0),
      paid: deals.reduce((s, d) => s + d.paidAmount, 0),
      remaining: deals.reduce((s, d) => s + d.remainingAmount, 0),
    }),
    [deals]
  );

  return (
    <div>
      <PageHeader title="Продажи / предпродажи" description="Бронирования, рассрочки, ипотеки и учёт сделок" />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPICard label="Всего сделок" value={String(totals.count)} icon={Handshake} />
        <KPICard label="Сумма сделок" value={formatMoney(totals.totalValue, "TJS", true)} icon={TrendingUp} tone="positive" />
        <KPICard label="Оплачено" value={formatMoney(totals.paid, "TJS", true)} icon={Wallet} tone="info" />
        <KPICard label="Остаток к получению" value={formatMoney(totals.remaining, "TJS", true)} icon={Clock3} tone="warn" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
        <DealsTable deals={deals} onSelectDeal={setSelectedDeal} selectedDealId={selectedDeal?.id} />
        {selectedDeal ? (
          <DealDetailCard deal={selectedDeal} />
        ) : (
          <Card className="flex h-full min-h-[200px] items-center justify-center p-6 text-center text-sm text-[var(--color-ink-500)]">
            Выберите сделку в таблице, чтобы увидеть детали
          </Card>
        )}
      </div>
    </div>
  );
}
