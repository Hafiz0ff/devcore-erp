import { FileText, Image as ImageIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/badge";
import { Money } from "@/components/ui/money";
import { EmptyState } from "@/components/ui/empty-state";
import type { ConstructionStage } from "@/types";
import { supplyCards, workActs, getSupplier } from "@/data/mockData";
import { supplyStageMeta, workActStatusMeta, formatDate } from "@/utils/formatters";

export function StageDetailPanel({ stage }: { stage: ConstructionStage }) {
  const relatedSupply = supplyCards.filter((c) => c.stageId === stage.id);
  const relatedActs = workActs.filter((a) => a.stageId === stage.id);
  const mockPhotos = [1, 2, 3, 4];

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Связанные закупки — {stage.name}</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          {relatedSupply.length === 0 ? (
            <EmptyState icon={FileText} title="Нет связанных закупок" />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Материал</TH>
                  <TH>Кол-во</TH>
                  <TH>Поставщик</TH>
                  <TH>Статус</TH>
                  <TH className="text-right">Сумма</TH>
                </TR>
              </THead>
              <TBody>
                {relatedSupply.map((c) => (
                  <TR key={c.id}>
                    <TD>{c.material}</TD>
                    <TD className="tnum">
                      {c.quantity} {c.unit}
                    </TD>
                    <TD className="max-w-[150px] truncate">{getSupplier(c.supplierId)?.name}</TD>
                    <TD>
                      <StatusBadge tone="info">{supplyStageMeta[c.status]}</StatusBadge>
                    </TD>
                    <TD className="text-right">
                      <Money amount={c.amount} compact />
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Связанные акты</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          {relatedActs.length === 0 ? (
            <EmptyState icon={FileText} title="Нет связанных актов" />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Номер</TH>
                  <TH>Подрядчик</TH>
                  <TH>Статус</TH>
                  <TH className="text-right">Сумма</TH>
                </TR>
              </THead>
              <TBody>
                {relatedActs.map((a) => {
                  const meta = workActStatusMeta[a.status];
                  return (
                    <TR key={a.id}>
                      <TD className="font-medium">{a.number}</TD>
                      <TD className="max-w-[150px] truncate">{getSupplier(a.contractorId)?.name}</TD>
                      <TD>
                        <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                      </TD>
                      <TD className="text-right">
                        <Money amount={a.amount} compact />
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Фотографии и документы этапа</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {mockPhotos.map((n) => (
              <div
                key={n}
                className="flex aspect-video flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] text-[var(--color-ink-400)]"
              >
                <ImageIcon className="h-5 w-5" />
                <span className="text-[11px]">Фото площадки #{n}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--color-ink-500)]">
            Плановая дата завершения — {formatDate(stage.endDatePlanned)}
            {stage.endDateActual && <> · фактическая — {formatDate(stage.endDateActual)}</>}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
