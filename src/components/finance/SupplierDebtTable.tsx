import { useMemo, useState } from "react";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/badge";
import { Money } from "@/components/ui/money";
import { Select } from "@/components/ui/input";
import { FilterBar } from "@/components/ui/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { ShieldCheck } from "lucide-react";
import type { Debt } from "@/types";
import { debtStatusMeta, formatDate } from "@/utils/formatters";
import { getSupplier } from "@/data/mockData";

interface Props {
  debts: Debt[];
}

export function SupplierDebtTable({ debts }: Props) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return debts
      .filter((d) => statusFilter === "all" || d.status === statusFilter)
      .filter((d) => !search || getSupplier(d.supplierId)?.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.amount - a.amount);
  }, [debts, statusFilter, search]);

  return (
    <div>
      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Поставщик...">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Любой статус</option>
          {Object.entries(debtStatusMeta).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </Select>
        <span className="ml-auto text-xs text-[var(--color-ink-500)]">{filtered.length} долгов</span>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="Долгов не найдено" description="Все обязательства перед поставщиками закрыты" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Поставщик</TH>
              <TH>Категория материала</TH>
              <TH className="text-right">Сумма долга</TH>
              <TH>Срок оплаты</TH>
              <TH>Просрочка</TH>
              <TH>Последний платёж</TH>
              <TH>Статус</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((d) => {
              const meta = debtStatusMeta[d.status];
              const supplier = getSupplier(d.supplierId);
              return (
                <TR key={d.id}>
                  <TD className="font-medium">{supplier?.name}</TD>
                  <TD>{d.materialCategory}</TD>
                  <TD className="text-right">
                    <Money amount={d.amount} />
                  </TD>
                  <TD>{formatDate(d.dueDate)}</TD>
                  <TD className={d.overdueDays > 0 ? "tnum font-medium text-[var(--color-risk-600)]" : "tnum text-[var(--color-ink-400)]"}>
                    {d.overdueDays > 0 ? `${d.overdueDays} дн.` : "—"}
                  </TD>
                  <TD>{d.lastPaymentDate ? formatDate(d.lastPaymentDate) : "—"}</TD>
                  <TD>
                    <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      )}
    </div>
  );
}
