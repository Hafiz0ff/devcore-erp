import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/badge";
import { Money } from "@/components/ui/money";
import { Select } from "@/components/ui/input";
import { FilterBar } from "@/components/ui/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Download } from "lucide-react";
import { documents, getProject } from "@/data/mockData";
import { documentTypeMeta, documentStatusMeta, formatDate } from "@/utils/formatters";
import type { DocumentType, DocumentStatus } from "@/types";

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<DocumentType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "all">("all");

  const filtered = useMemo(
    () =>
      documents
        .filter((d) => typeFilter === "all" || d.type === typeFilter)
        .filter((d) => statusFilter === "all" || d.status === statusFilter)
        .filter((d) => !search || d.number.toLowerCase().includes(search.toLowerCase()) || d.counterpartyName.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [search, typeFilter, statusFilter]
  );

  return (
    <div>
      <PageHeader
        title="Договоры и документы"
        description="Все юридически значимые документы компании"
        actions={
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" /> Новый документ
          </Button>
        }
      />

      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Номер, контрагент...">
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as DocumentType | "all")}>
          <option value="all">Все типы</option>
          {Object.entries(documentTypeMeta).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | "all")}>
          <option value="all">Любой статус</option>
          {Object.entries(documentStatusMeta).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </Select>
        <span className="ml-auto text-xs text-[var(--color-ink-500)]">{filtered.length} документов</span>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="Документы не найдены" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Номер</TH>
              <TH>Тип</TH>
              <TH>ЖК</TH>
              <TH>Контрагент</TH>
              <TH className="text-right">Сумма</TH>
              <TH>Дата</TH>
              <TH>Статус</TH>
              <TH>Ответственный</TH>
              <TH>Файл</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((d) => {
              const meta = documentStatusMeta[d.status];
              return (
                <TR key={d.id}>
                  <TD className="font-medium">{d.number}</TD>
                  <TD className="max-w-[190px] truncate">{documentTypeMeta[d.type]}</TD>
                  <TD className="max-w-[140px] truncate text-[var(--color-ink-500)]">
                    {d.relatedProjectId ? getProject(d.relatedProjectId)?.name : "—"}
                  </TD>
                  <TD className="max-w-[160px] truncate">{d.counterpartyName}</TD>
                  <TD className="text-right">{d.amount ? <Money amount={d.amount} compact /> : "—"}</TD>
                  <TD>{formatDate(d.date)}</TD>
                  <TD>
                    <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                  </TD>
                  <TD className="max-w-[130px] truncate text-[var(--color-ink-500)]">{d.responsible}</TD>
                  <TD>
                    <button className="flex items-center gap-1 text-[var(--color-info-600)] hover:underline">
                      <Download className="h-3.5 w-3.5" /> {d.fileName}
                    </button>
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
