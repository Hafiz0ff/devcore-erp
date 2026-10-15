import { useMemo, useState } from "react";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/badge";
import { Money } from "@/components/ui/money";
import { Select } from "@/components/ui/input";
import { FilterBar } from "@/components/ui/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { Inbox } from "lucide-react";
import type { FinancialTransaction, TransactionType } from "@/types";
import { formatDate, transactionCategoryMeta } from "@/utils/formatters";
import { getProject, getStage } from "@/data/mockData";
import { projects } from "@/data/mockData";

interface Props {
  transactions: FinancialTransaction[];
  typeFilter?: TransactionType;
}

const STATUS_LABEL: Record<FinancialTransaction["status"], string> = {
  planned: "Запланировано",
  completed: "Выполнено",
  cancelled: "Отменено",
};

const METHOD_LABEL: Record<FinancialTransaction["paymentMethod"], string> = {
  bank: "Банк",
  cash: "Касса",
  card: "Карта",
  transfer: "Перевод",
};

export function FinancialTransactionsTable({ transactions, typeFilter }: Props) {
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const base = useMemo(
    () => (typeFilter ? transactions.filter((t) => t.type === typeFilter) : transactions),
    [transactions, typeFilter]
  );

  const filtered = useMemo(() => {
    return base
      .filter((t) => projectFilter === "all" || t.projectId === projectFilter)
      .filter((t) => categoryFilter === "all" || t.category === categoryFilter)
      .filter((t) => statusFilter === "all" || t.status === statusFilter)
      .filter(
        (t) =>
          !search ||
          t.counterpartyName.toLowerCase().includes(search.toLowerCase()) ||
          t.documentNumber?.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [base, projectFilter, categoryFilter, statusFilter, search]);

  return (
    <div>
      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Контрагент, номер документа...">
        <Select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
          <option value="all">Все ЖК</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
        <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">Все категории</option>
          {Object.entries(transactionCategoryMeta).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Любой статус</option>
          {Object.entries(STATUS_LABEL).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
        <span className="ml-auto text-xs text-[var(--color-ink-500)]">{filtered.length} операций</span>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState icon={Inbox} title="Операции не найдены" description="Измените фильтры поиска" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Дата</TH>
              <TH>Тип</TH>
              <TH>Категория</TH>
              <TH>ЖК</TH>
              <TH>Этап</TH>
              <TH>Контрагент</TH>
              <TH>Способ</TH>
              <TH>Документ</TH>
              <TH>Статус</TH>
              <TH>Ответственный</TH>
              <TH className="text-right">Сумма</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((t) => (
              <TR key={t.id}>
                <TD>{formatDate(t.date)}</TD>
                <TD>
                  <StatusBadge tone={t.type === "income" ? "positive" : "risk"}>
                    {t.type === "income" ? "Приход" : "Расход"}
                  </StatusBadge>
                </TD>
                <TD>{transactionCategoryMeta[t.category]}</TD>
                <TD className="max-w-[140px] truncate">{getProject(t.projectId)?.name}</TD>
                <TD className="max-w-[130px] truncate text-[var(--color-ink-500)]">
                  {t.stageId ? getStage(t.stageId)?.name : "—"}
                </TD>
                <TD className="max-w-[160px] truncate">{t.counterpartyName}</TD>
                <TD>{METHOD_LABEL[t.paymentMethod]}</TD>
                <TD className="tnum text-[var(--color-ink-500)]">{t.documentNumber}</TD>
                <TD>
                  <StatusBadge tone={t.status === "completed" ? "positive" : t.status === "planned" ? "warn" : "muted"}>
                    {STATUS_LABEL[t.status]}
                  </StatusBadge>
                </TD>
                <TD className="max-w-[130px] truncate text-[var(--color-ink-500)]">{t.responsible}</TD>
                <TD className="text-right">
                  <Money amount={t.type === "income" ? t.amount : -t.amount} signColor />
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
