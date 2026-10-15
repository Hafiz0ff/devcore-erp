import { useMemo, useState } from "react";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/badge";
import { Select } from "@/components/ui/input";
import { FilterBar } from "@/components/ui/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { Inbox } from "lucide-react";
import type { PurchaseRequest } from "@/types";
import { purchaseRequestStatusMeta, priorityMeta, formatDate } from "@/utils/formatters";
import { getProject, getStage } from "@/data/mockData";

interface Props {
  requests: PurchaseRequest[];
}

export function PurchaseRequestTable({ requests }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filtered = useMemo(
    () =>
      requests
        .filter((r) => statusFilter === "all" || r.status === statusFilter)
        .filter((r) => priorityFilter === "all" || r.priority === priorityFilter)
        .filter((r) => !search || r.material.toLowerCase().includes(search.toLowerCase()) || r.number.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [requests, statusFilter, priorityFilter, search]
  );

  return (
    <div>
      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Материал, номер заявки...">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Любой статус</option>
          {Object.entries(purchaseRequestStatusMeta).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </Select>
        <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="all">Любой приоритет</option>
          {Object.entries(priorityMeta).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </Select>
        <span className="ml-auto text-xs text-[var(--color-ink-500)]">{filtered.length} заявок</span>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState icon={Inbox} title="Заявки не найдены" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>№</TH>
              <TH>Дата</TH>
              <TH>Инициатор</TH>
              <TH>ЖК</TH>
              <TH>Этап</TH>
              <TH>Материал</TH>
              <TH>Кол-во</TH>
              <TH>Нужно к</TH>
              <TH>Приоритет</TH>
              <TH>Статус</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((r) => {
              const meta = purchaseRequestStatusMeta[r.status];
              const pMeta = priorityMeta[r.priority];
              return (
                <TR key={r.id}>
                  <TD className="font-medium">{r.number}</TD>
                  <TD>{formatDate(r.date)}</TD>
                  <TD className="max-w-[140px] truncate">{r.initiator}</TD>
                  <TD className="max-w-[140px] truncate">{getProject(r.projectId)?.name}</TD>
                  <TD className="max-w-[130px] truncate text-[var(--color-ink-500)]">{r.stageId ? getStage(r.stageId)?.name : "—"}</TD>
                  <TD>{r.material}</TD>
                  <TD className="tnum">
                    {r.quantity} {r.unit}
                  </TD>
                  <TD>{formatDate(r.desiredDate)}</TD>
                  <TD>
                    <StatusBadge tone={pMeta.tone}>{pMeta.label}</StatusBadge>
                  </TD>
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
