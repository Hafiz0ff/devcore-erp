import { useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/ui/money";
import { Plus } from "lucide-react";
import { SupplyPipelineCard } from "@/components/procurement/SupplyPipelineCard";
import { useScope } from "@/context/ScopeContext";
import { supplyCards } from "@/data/mockData";
import { supplyStageMeta } from "@/utils/formatters";
import type { SupplyStage } from "@/types";

const COLUMN_ORDER: SupplyStage[] = [
  "requested",
  "approval",
  "approved",
  "ordered",
  "in-transit",
  "received-warehouse",
  "issued-site",
  "used",
  "closed",
];

export default function SupplyPage() {
  const { projectId } = useScope();

  const cards = useMemo(
    () => supplyCards.filter((c) => !projectId || c.projectId === projectId),
    [projectId]
  );

  const columns = useMemo(
    () =>
      COLUMN_ORDER.map((status) => ({
        status,
        cards: cards.filter((c) => c.status === status),
      })),
    [cards]
  );

  return (
    <div>
      <PageHeader
        title="Снабжение"
        description="Путь материала от заявки до использования на объекте"
        actions={
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" /> Новая заявка
          </Button>
        }
      />

      <div className="flex gap-3 overflow-x-auto pb-2">
        {columns.map((col) => {
          const total = col.cards.reduce((s, c) => s + c.amount, 0);
          return (
            <div key={col.status} className="flex w-[268px] shrink-0 flex-col rounded-xl bg-[var(--color-surface-muted)] p-2.5">
              <div className="mb-2 flex items-center justify-between px-1">
                <div>
                  <div className="text-[12.5px] font-semibold text-[var(--color-ink-900)]">{supplyStageMeta[col.status]}</div>
                  <Money amount={total} compact className="text-[11px] text-[var(--color-ink-500)]" />
                </div>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-surface)] px-1.5 text-[11px] font-semibold text-[var(--color-ink-700)]">
                  {col.cards.length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {col.cards.map((c) => (
                  <SupplyPipelineCard key={c.id} card={c} />
                ))}
                {col.cards.length === 0 && (
                  <div className="rounded-lg border border-dashed border-[var(--color-border-strong)] py-6 text-center text-[11px] text-[var(--color-ink-400)]">
                    Пусто
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
