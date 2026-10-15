import { LayoutPanelLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Money } from "@/components/ui/money";
import { Button } from "@/components/ui/button";
import type { RealEstateUnit } from "@/types";
import { unitTypeMeta, unitStatusMeta, formatPercent } from "@/utils/formatters";
import { getClient, getBuilding } from "@/data/mockData";

export function UnitDetailPanel({ unit }: { unit: RealEstateUnit }) {
  const client = unit.clientId ? getClient(unit.clientId) : undefined;
  const building = getBuilding(unit.buildingId);
  const statusMeta = unitStatusMeta[unit.status];
  const marginPercent = unit.totalPrice > 0 ? (unit.margin / unit.totalPrice) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{unit.number}</CardTitle>
          <p className="text-xs text-[var(--color-ink-500)]">
            {unitTypeMeta[unit.type]} · {building?.name}, этаж {unit.floor}
          </p>
        </div>
        <StatusBadge tone={statusMeta.tone}>{statusMeta.label}</StatusBadge>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="mb-4 flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] text-[var(--color-ink-400)]">
          <div className="flex flex-col items-center gap-1.5">
            <LayoutPanelLeft className="h-6 w-6" />
            <span className="text-xs">Планировка (mock)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-2.5 text-sm">
          <span className="text-[var(--color-ink-500)]">Площадь</span>
          <span className="tnum text-right font-medium">{unit.area} м²</span>
          {unit.rooms && (
            <>
              <span className="text-[var(--color-ink-500)]">Комнат</span>
              <span className="tnum text-right font-medium">{unit.rooms}</span>
            </>
          )}
          <span className="text-[var(--color-ink-500)]">Цена за м²</span>
          <Money amount={unit.pricePerSqm} className="text-right font-medium" />
          <span className="text-[var(--color-ink-500)]">Общая цена</span>
          <Money amount={unit.totalPrice} className="text-right font-semibold" />
          <span className="text-[var(--color-ink-500)]">Себестоимость</span>
          <Money amount={unit.costPrice} className="text-right font-medium" />
          <span className="text-[var(--color-ink-500)]">Маржа</span>
          <span className="text-right">
            <Money amount={unit.margin} compact signColor className="font-medium" /> <span className="text-xs text-[var(--color-ink-400)]">({formatPercent(marginPercent)})</span>
          </span>
        </div>

        {client && (
          <div className="mt-4 rounded-lg border border-[var(--color-border)] p-3">
            <div className="mb-0.5 text-[11px] text-[var(--color-ink-500)]">Клиент</div>
            <div className="text-sm font-medium">{client.fullName}</div>
            <div className="text-xs text-[var(--color-ink-500)]">{client.phone}</div>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          {unit.status === "free" ? (
            <Button variant="primary" size="sm" className="w-full">
              Создать сделку
            </Button>
          ) : (
            <Button variant="secondary" size="sm" className="w-full">
              Открыть сделку
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
