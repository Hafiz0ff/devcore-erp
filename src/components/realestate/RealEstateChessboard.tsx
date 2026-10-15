import { useMemo } from "react";
import type { RealEstateUnit } from "@/types";
import { CHESSBOARD_STATUS_STYLE } from "./statusColors";
import { unitTypeMeta } from "@/utils/formatters";
import { cn } from "@/lib/utils";

interface Props {
  units: RealEstateUnit[];
  floorNumbers: number[];
  selectedUnitId: string | null;
  onSelectUnit: (unit: RealEstateUnit) => void;
}

function columnIndex(unit: RealEstateUnit): number {
  const parts = unit.id.split("-");
  return Number(parts[parts.length - 1]);
}

export function RealEstateChessboard({ units, floorNumbers, selectedUnitId, onSelectUnit }: Props) {
  const byFloor = useMemo(() => {
    const map = new Map<number, RealEstateUnit[]>();
    for (const fl of floorNumbers) {
      const floorUnits = units.filter((u) => u.floor === fl).sort((a, b) => columnIndex(a) - columnIndex(b));
      map.set(fl, floorUnits);
    }
    return map;
  }, [units, floorNumbers]);

  const maxCols = Math.max(1, ...Array.from(byFloor.values()).map((arr) => arr.length));
  const sortedFloors = [...floorNumbers].sort((a, b) => b - a);

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex min-w-full flex-col gap-1.5">
        {sortedFloors.map((fl) => {
          const floorUnits = byFloor.get(fl) ?? [];
          return (
            <div key={fl} className="flex items-center gap-1.5">
              <div className="flex h-14 w-11 shrink-0 items-center justify-center rounded-md bg-[var(--color-surface-muted)] text-[12px] font-semibold text-[var(--color-ink-500)]">
                {fl}
              </div>
              <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${maxCols}, minmax(74px, 1fr))` }}>
                {Array.from({ length: maxCols }).map((_, colIdx) => {
                  const unit = floorUnits[colIdx];
                  if (!unit) return <div key={colIdx} className="h-14 w-full rounded-md" />;
                  const style = CHESSBOARD_STATUS_STYLE[unit.status];
                  const selected = unit.id === selectedUnitId;
                  return (
                    <button
                      key={unit.id}
                      onClick={() => onSelectUnit(unit)}
                      title={`${unit.number} · ${unitTypeMeta[unit.type]} · ${style.label}`}
                      className={cn(
                        "flex h-14 w-full flex-col items-center justify-center gap-0.5 rounded-md border text-[11px] font-medium transition-transform hover:z-10 hover:scale-[1.04]",
                        selected && "ring-2 ring-offset-1 ring-[var(--color-brand-800)]"
                      )}
                      style={{ backgroundColor: style.bg, borderColor: style.border, color: style.text }}
                    >
                      <span className="tnum font-semibold">{unit.number}</span>
                      <span className="tnum text-[10px] opacity-80">{unit.area} м²</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ChessboardLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
      {Object.values(CHESSBOARD_STATUS_STYLE).map((s) => (
        <div key={s.label} className="flex items-center gap-1.5 text-xs text-[var(--color-ink-600)]">
          <span className="h-3 w-3 rounded-[3px] border" style={{ backgroundColor: s.bg, borderColor: s.border }} />
          {s.label}
        </div>
      ))}
    </div>
  );
}
