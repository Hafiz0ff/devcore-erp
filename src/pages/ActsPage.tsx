import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/badge";
import { Money } from "@/components/ui/money";
import { Select } from "@/components/ui/input";
import { FilterBar } from "@/components/ui/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/dashboard/KPICard";
import { ClipboardCheck, Plus, Wallet, AlertCircle } from "lucide-react";
import { useScope } from "@/context/ScopeContext";
import { workActs, getProject, getStage, getSupplier } from "@/data/mockData";
import { workActStatusMeta, formatDate, formatMoney } from "@/utils/formatters";
import type { WorkActStatus } from "@/types";

export default function ActsPage() {
  const { projectId } = useScope();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkActStatus | "all">("all");

  const scoped = useMemo(() => workActs.filter((a) => !projectId || a.projectId === projectId), [projectId]);

  const filtered = useMemo(
    () =>
      scoped
        .filter((a) => statusFilter === "all" || a.status === statusFilter)
        .filter((a) => !search || a.number.toLowerCase().includes(search.toLowerCase()) || a.workType.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [scoped, statusFilter, search]
  );

  const totals = useMemo(
    () => ({
      total: scoped.reduce((s, a) => s + a.amount, 0),
      remaining: scoped.reduce((s, a) => s + a.remainingAmount, 0),
    }),
    [scoped]
  );

  return (
    <div>
      <PageHeader
        title="Акты"
        description="Акты выполненных работ, связанные с этапами и подрядчиками"
        actions={
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" /> Новый акт
          </Button>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPICard label="Актов всего" value={String(scoped.length)} icon={ClipboardCheck} />
        <KPICard label="Сумма актов" value={formatMoney(totals.total, "TJS", true)} icon={Wallet} />
        <KPICard label="Остаток к оплате" value={formatMoney(totals.remaining, "TJS", true)} icon={AlertCircle} tone="warn" />
      </div>

      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Номер, вид работ...">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as WorkActStatus | "all")}>
          <option value="all">Любой статус</option>
          {Object.entries(workActStatusMeta).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </Select>
        <span className="ml-auto text-xs text-[var(--color-ink-500)]">{filtered.length} актов</span>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="Акты не найдены" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Номер</TH>
              <TH>Подрядчик</TH>
              <TH>ЖК</TH>
              <TH>Этап</TH>
              <TH>Вид работ</TH>
              <TH className="text-right">Сумма</TH>
              <TH>Дата</TH>
              <TH>Статус</TH>
              <TH className="text-right">Оплачено</TH>
              <TH className="text-right">Остаток</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((a) => {
              const meta = workActStatusMeta[a.status];
              return (
                <TR key={a.id}>
                  <TD className="font-medium">{a.number}</TD>
                  <TD className="max-w-[150px] truncate">{getSupplier(a.contractorId)?.name}</TD>
                  <TD className="max-w-[130px] truncate text-[var(--color-ink-500)]">{getProject(a.projectId)?.name}</TD>
                  <TD className="max-w-[130px] truncate text-[var(--color-ink-500)]">{getStage(a.stageId)?.name}</TD>
                  <TD className="max-w-[170px] truncate">{a.workType}</TD>
                  <TD className="text-right">
                    <Money amount={a.amount} compact />
                  </TD>
                  <TD>{formatDate(a.date)}</TD>
                  <TD>
                    <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                  </TD>
                  <TD className="text-right">
                    <Money amount={a.paidAmount} compact />
                  </TD>
                  <TD className="text-right">
                    <Money amount={a.remainingAmount} compact className={a.remainingAmount > 0 ? "text-[var(--color-warn-600)]" : ""} />
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
