import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/badge";
import { Money } from "@/components/ui/money";
import { Select } from "@/components/ui/input";
import { FilterBar } from "@/components/ui/filter-bar";
import { KPICard } from "@/components/dashboard/KPICard";
import { Boxes, AlertTriangle, TrendingDown, Wallet } from "lucide-react";
import { inventoryItems, inventoryMovements } from "@/data/mockData";
import { stageInventoryStatusMeta, movementTypeMeta, formatDate, formatNumber } from "@/utils/formatters";

const WAREHOUSES = Array.from(new Set(inventoryItems.map((i) => i.warehouse)));
const CATEGORIES = Array.from(new Set(inventoryItems.map((i) => i.category)));

export default function WarehousePage() {
  const [search, setSearch] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(
    () =>
      inventoryItems
        .filter((i) => warehouseFilter === "all" || i.warehouse === warehouseFilter)
        .filter((i) => categoryFilter === "all" || i.category === categoryFilter)
        .filter((i) => statusFilter === "all" || i.status === statusFilter)
        .filter((i) => !search || i.material.toLowerCase().includes(search.toLowerCase())),
    [search, warehouseFilter, categoryFilter, statusFilter]
  );

  const totalValue = inventoryItems.reduce((s, i) => s + i.totalValue, 0);
  const criticalCount = inventoryItems.filter((i) => i.status === "critical").length;
  const lowCount = inventoryItems.filter((i) => i.status === "low").length;

  return (
    <div>
      <PageHeader title="Склад" description="Остатки и движение строительных материалов" />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPICard label="Общая стоимость остатков" value={`${formatNumber(totalValue / 1000)} тыс смн`} icon={Wallet} />
        <KPICard label="Позиций на складах" value={String(inventoryItems.length)} icon={Boxes} />
        <KPICard label="Низкий остаток" value={String(lowCount)} icon={TrendingDown} tone="warn" />
        <KPICard label="Критично" value={String(criticalCount)} icon={AlertTriangle} tone="risk" />
      </div>

      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock">Остатки</TabsTrigger>
          <TabsTrigger value="movements">Движение материалов</TabsTrigger>
        </TabsList>

        <TabsContent value="stock">
          <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Материал...">
            <Select value={warehouseFilter} onChange={(e) => setWarehouseFilter(e.target.value)}>
              <option value="all">Все склады</option>
              {WAREHOUSES.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </Select>
            <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">Все категории</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Любой статус</option>
              <option value="ok">Норма</option>
              <option value="low">Низкий остаток</option>
              <option value="critical">Критично</option>
              <option value="excess">Избыток</option>
            </Select>
            <span className="ml-auto text-xs text-[var(--color-ink-500)]">{filtered.length} позиций</span>
          </FilterBar>

          <Table>
            <THead>
              <TR>
                <TH>Материал</TH>
                <TH>Категория</TH>
                <TH className="text-right">Остаток</TH>
                <TH className="text-right">Резерв</TH>
                <TH className="text-right">Доступно</TH>
                <TH className="text-right">Мин. остаток</TH>
                <TH className="text-right">Средняя цена</TH>
                <TH className="text-right">Стоимость</TH>
                <TH>Склад / объект</TH>
                <TH>Статус</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((i) => {
                const meta = stageInventoryStatusMeta(i.status);
                return (
                  <TR key={i.id}>
                    <TD className="font-medium">{i.material}</TD>
                    <TD>{i.category}</TD>
                    <TD className="tnum text-right">
                      {formatNumber(i.quantityOnHand, 1)} {i.unit}
                    </TD>
                    <TD className="tnum text-right text-[var(--color-ink-500)]">{formatNumber(i.quantityReserved, 1)}</TD>
                    <TD className="tnum text-right font-medium">{formatNumber(i.quantityAvailable, 1)}</TD>
                    <TD className="tnum text-right text-[var(--color-ink-500)]">{formatNumber(i.minStock, 1)}</TD>
                    <TD className="text-right">
                      <Money amount={i.avgPrice} />
                    </TD>
                    <TD className="text-right">
                      <Money amount={i.totalValue} compact />
                    </TD>
                    <TD className="max-w-[160px] truncate">{i.warehouse}</TD>
                    <TD>
                      <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </TabsContent>

        <TabsContent value="movements">
          <Table>
            <THead>
              <TR>
                <TH>Дата</TH>
                <TH>Тип</TH>
                <TH>Материал</TH>
                <TH className="text-right">Кол-во</TH>
                <TH>Склад</TH>
                <TH>Ответственный</TH>
                <TH>Комментарий</TH>
              </TR>
            </THead>
            <TBody>
              {inventoryMovements.map((m) => (
                <TR key={m.id}>
                  <TD>{formatDate(m.date)}</TD>
                  <TD>
                    <StatusBadge tone={m.type === "in" ? "positive" : m.type === "out" || m.type === "writeoff" ? "risk" : "info"}>
                      {movementTypeMeta[m.type]}
                    </StatusBadge>
                  </TD>
                  <TD>{m.material}</TD>
                  <TD className="tnum text-right">
                    {formatNumber(m.quantity, 1)} {m.unit}
                  </TD>
                  <TD className="max-w-[160px] truncate">{m.warehouse}</TD>
                  <TD className="max-w-[140px] truncate">{m.responsible}</TD>
                  <TD className="max-w-[200px] truncate text-[var(--color-ink-500)]">{m.comment ?? "—"}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
