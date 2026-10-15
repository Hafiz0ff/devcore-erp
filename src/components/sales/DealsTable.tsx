import { useMemo, useState } from "react";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/badge";
import { Money } from "@/components/ui/money";
import { Select } from "@/components/ui/input";
import { FilterBar } from "@/components/ui/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { Inbox } from "lucide-react";
import type { SaleDeal } from "@/types";
import { dealStatusMeta, unitTypeMeta, formatDate } from "@/utils/formatters";
import { getClient, getUnit } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface Props {
  deals: SaleDeal[];
  onSelectDeal: (deal: SaleDeal) => void;
  selectedDealId?: string;
}

export function DealsTable({ deals, onSelectDeal, selectedDealId }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(
    () =>
      deals
        .filter((d) => statusFilter === "all" || d.status === statusFilter)
        .filter((d) => {
          if (!search) return true;
          const client = getClient(d.clientId)?.fullName.toLowerCase() ?? "";
          const unit = getUnit(d.unitId)?.number.toLowerCase() ?? "";
          return client.includes(search.toLowerCase()) || unit.includes(search.toLowerCase()) || d.number.toLowerCase().includes(search.toLowerCase());
        })
        .sort((a, b) => (a.dealDate < b.dealDate ? 1 : -1)),
    [deals, statusFilter, search]
  );

  return (
    <div>
      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Клиент, объект, номер сделки...">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Любой статус</option>
          {Object.entries(dealStatusMeta).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </Select>
        <span className="ml-auto text-xs text-[var(--color-ink-500)]">{filtered.length} сделок</span>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState icon={Inbox} title="Сделки не найдены" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>№</TH>
              <TH>Клиент</TH>
              <TH>Объект</TH>
              <TH>Тип</TH>
              <TH className="text-right">Сумма</TH>
              <TH className="text-right">Оплачено</TH>
              <TH className="text-right">Остаток</TH>
              <TH>Статус</TH>
              <TH>Менеджер</TH>
              <TH>Дата</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((d) => {
              const meta = dealStatusMeta[d.status];
              const unit = getUnit(d.unitId);
              return (
                <TR
                  key={d.id}
                  className={cn("cursor-pointer", selectedDealId === d.id && "bg-[var(--color-brand-100)]/40")}
                  onClick={() => onSelectDeal(d)}
                >
                  <TD className="font-medium">{d.number}</TD>
                  <TD className="max-w-[150px] truncate">{getClient(d.clientId)?.fullName}</TD>
                  <TD>{unit?.number}</TD>
                  <TD>{unit ? unitTypeMeta[unit.type] : "—"}</TD>
                  <TD className="text-right">
                    <Money amount={d.finalPrice} compact />
                  </TD>
                  <TD className="text-right">
                    <Money amount={d.paidAmount} compact />
                  </TD>
                  <TD className="text-right">
                    <Money amount={d.remainingAmount} compact className={d.remainingAmount > 0 ? "text-[var(--color-warn-600)]" : ""} />
                  </TD>
                  <TD>
                    <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                  </TD>
                  <TD className="max-w-[130px] truncate text-[var(--color-ink-500)]">{d.manager}</TD>
                  <TD>{formatDate(d.dealDate)}</TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      )}
    </div>
  );
}
