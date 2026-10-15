import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/badge";
import { Money } from "@/components/ui/money";
import { FilterBar } from "@/components/ui/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Users as UsersIcon, X } from "lucide-react";
import { clients, getUnit } from "@/data/mockData";
import { unitTypeMeta } from "@/utils/formatters";
import type { Client } from "@/types";

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Client | null>(null);

  const filtered = useMemo(
    () => clients.filter((c) => !search || c.fullName.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)),
    [search]
  );

  return (
    <div>
      <PageHeader title="Клиенты" description="Покупатели недвижимости и стороны договоров" />

      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="ФИО или телефон...">
        <span className="ml-auto text-xs text-[var(--color-ink-500)]">{filtered.length} клиентов</span>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState icon={UsersIcon} title="Клиенты не найдены" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>ФИО</TH>
              <TH>Телефон</TH>
              <TH className="text-right">Объектов</TH>
              <TH className="text-right">Сумма договоров</TH>
              <TH className="text-right">Оплачено</TH>
              <TH className="text-right">Остаток</TH>
              <TH>Статус</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((c) => (
              <TR key={c.id} className="cursor-pointer" onClick={() => setSelected(c)}>
                <TD className="font-medium">{c.fullName}</TD>
                <TD className="tnum">{c.phone}</TD>
                <TD className="tnum text-right">{c.purchasedUnitIds.length}</TD>
                <TD className="text-right">
                  <Money amount={c.contractsAmount} compact />
                </TD>
                <TD className="text-right">
                  <Money amount={c.paidAmount} compact />
                </TD>
                <TD className="text-right">
                  <Money amount={c.remainingAmount} compact />
                </TD>
                <TD>
                  <StatusBadge tone={c.overdueAmount > 0 ? "risk" : "positive"}>
                    {c.overdueAmount > 0 ? "Есть просрочка" : "В графике"}
                  </StatusBadge>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      {selected && (
        <div className="fixed inset-0 z-30 flex items-center justify-end bg-black/25" onClick={() => setSelected(null)}>
          <div className="h-full w-full max-w-md overflow-y-auto bg-[var(--color-surface)] p-6 shadow-[var(--shadow-panel)]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-[17px] font-semibold">{selected.fullName}</h3>
                <p className="text-sm text-[var(--color-ink-500)]">{selected.phone}</p>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-md p-1 text-[var(--color-ink-500)] hover:bg-[var(--color-surface-muted)]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <Card className="mb-4">
              <CardContent className="grid grid-cols-2 gap-y-2.5 pt-4 text-sm">
                <span className="text-[var(--color-ink-500)]">Паспортные данные (mock)</span>
                <span className="text-right tnum">{selected.passportMock}</span>
                <span className="text-[var(--color-ink-500)]">Сумма договоров</span>
                <Money amount={selected.contractsAmount} compact className="text-right font-medium" />
                <span className="text-[var(--color-ink-500)]">Оплачено</span>
                <Money amount={selected.paidAmount} compact className="text-right font-medium text-[var(--color-positive-600)]" />
                <span className="text-[var(--color-ink-500)]">Остаток</span>
                <Money amount={selected.remainingAmount} compact className="text-right font-medium" />
                {selected.overdueAmount > 0 && (
                  <>
                    <span className="text-[var(--color-ink-500)]">Просрочка</span>
                    <Money amount={selected.overdueAmount} compact className="text-right font-medium text-[var(--color-risk-600)]" />
                  </>
                )}
              </CardContent>
            </Card>

            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-500)]">
              Купленные объекты
            </div>
            <ul className="flex flex-col gap-2">
              {selected.purchasedUnitIds.map((uid) => {
                const unit = getUnit(uid);
                if (!unit) return null;
                return (
                  <li key={uid} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm">
                    <span>
                      {unit.number} · {unitTypeMeta[unit.type]}
                    </span>
                    <Money amount={unit.totalPrice} compact />
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 rounded-lg border border-dashed border-[var(--color-border-strong)] p-3 text-xs text-[var(--color-ink-500)]">
              Комментарии и документы клиента будут отображаться здесь.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
