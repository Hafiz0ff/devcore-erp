import { useMemo, useState } from "react";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/badge";
import { Money } from "@/components/ui/money";
import { Select } from "@/components/ui/input";
import { FilterBar } from "@/components/ui/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { Inbox } from "lucide-react";
import type { PurchaseOrder } from "@/types";
import { purchaseOrderStatusMeta, formatDate } from "@/utils/formatters";
import { getSupplier, SUPPLIERS } from "@/data/mockData";

interface Props {
  orders: PurchaseOrder[];
}

export function PurchaseOrderTable({ orders }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");

  const filtered = useMemo(
    () =>
      orders
        .filter((o) => statusFilter === "all" || o.status === statusFilter)
        .filter((o) => supplierFilter === "all" || o.supplierId === supplierFilter)
        .filter((o) => !search || o.material.toLowerCase().includes(search.toLowerCase()) || o.number.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => (a.deliveryDate < b.deliveryDate ? 1 : -1)),
    [orders, statusFilter, supplierFilter, search]
  );

  return (
    <div>
      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Материал, номер заказа...">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Любой статус</option>
          {Object.entries(purchaseOrderStatusMeta).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </Select>
        <Select value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)}>
          <option value="all">Все поставщики</option>
          {SUPPLIERS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
        <span className="ml-auto text-xs text-[var(--color-ink-500)]">{filtered.length} заказов</span>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState icon={Inbox} title="Заказы не найдены" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>№</TH>
              <TH>Поставщик</TH>
              <TH>Материал</TH>
              <TH>Кол-во</TH>
              <TH className="text-right">Сумма</TH>
              <TH className="text-right">Оплачено</TH>
              <TH className="text-right">Долг</TH>
              <TH>Дата поставки</TH>
              <TH>Статус</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((o) => {
              const meta = purchaseOrderStatusMeta[o.status];
              return (
                <TR key={o.id}>
                  <TD className="font-medium">{o.number}</TD>
                  <TD className="max-w-[160px] truncate">{getSupplier(o.supplierId)?.name}</TD>
                  <TD>{o.material}</TD>
                  <TD className="tnum">
                    {o.quantity} {o.unit}
                  </TD>
                  <TD className="text-right">
                    <Money amount={o.totalAmount} compact />
                  </TD>
                  <TD className="text-right">
                    <Money amount={o.paidAmount} compact />
                  </TD>
                  <TD className="text-right">
                    <Money amount={o.debtAmount} compact className={o.debtAmount > 0 ? "text-[var(--color-risk-600)]" : ""} />
                  </TD>
                  <TD>{formatDate(o.deliveryDate)}</TD>
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
