import { useMemo, useState } from "react";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/badge";
import { Money } from "@/components/ui/money";
import { Select } from "@/components/ui/input";
import { FilterBar } from "@/components/ui/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { Inbox } from "lucide-react";
import type { RealEstateUnit } from "@/types";
import { unitTypeMeta, unitStatusMeta } from "@/utils/formatters";
import { getClient, getBuilding } from "@/data/mockData";

interface Props {
  units: RealEstateUnit[];
  onSelectUnit?: (unit: RealEstateUnit) => void;
}

export function RealEstateUnitTable({ units, onSelectUnit }: Props) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(
    () =>
      units
        .filter((u) => typeFilter === "all" || u.type === typeFilter)
        .filter((u) => statusFilter === "all" || u.status === statusFilter)
        .filter((u) => !search || u.number.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => a.number.localeCompare(b.number)),
    [units, typeFilter, statusFilter, search]
  );

  return (
    <div>
      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Номер объекта...">
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">Все типы</option>
          {Object.entries(unitTypeMeta).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Любой статус</option>
          {Object.entries(unitStatusMeta).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </Select>
        <span className="ml-auto text-xs text-[var(--color-ink-500)]">{filtered.length} объектов</span>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState icon={Inbox} title="Объекты не найдены" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>№</TH>
              <TH>Тип</TH>
              <TH>Корпус</TH>
              <TH>Этаж</TH>
              <TH className="text-right">Площадь</TH>
              <TH className="text-right">Цена / м²</TH>
              <TH className="text-right">Общая цена</TH>
              <TH>Статус</TH>
              <TH>Клиент</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((u) => {
              const meta = unitStatusMeta[u.status];
              const client = u.clientId ? getClient(u.clientId) : undefined;
              return (
                <TR key={u.id} className={onSelectUnit ? "cursor-pointer" : undefined} onClick={() => onSelectUnit?.(u)}>
                  <TD className="font-medium">{u.number}</TD>
                  <TD>{unitTypeMeta[u.type]}</TD>
                  <TD>{getBuilding(u.buildingId)?.name}</TD>
                  <TD className="tnum">{u.floor}</TD>
                  <TD className="tnum text-right">{u.area} м²</TD>
                  <TD className="text-right">
                    <Money amount={u.pricePerSqm} />
                  </TD>
                  <TD className="text-right">
                    <Money amount={u.totalPrice} compact />
                  </TD>
                  <TD>
                    <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                  </TD>
                  <TD className="max-w-[150px] truncate text-[var(--color-ink-500)]">{client?.fullName ?? "—"}</TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      )}
    </div>
  );
}
