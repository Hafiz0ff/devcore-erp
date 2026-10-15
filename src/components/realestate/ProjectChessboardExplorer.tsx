import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { RealEstateChessboard, ChessboardLegend } from "./RealEstateChessboard";
import { UnitDetailPanel } from "./UnitDetailPanel";
import { projectBuildings, sections, units as allUnits } from "@/data/mockData";
import type { RealEstateUnit } from "@/types";

export function ProjectChessboardExplorer({ projectId }: { projectId: string }) {
  const buildings = useMemo(() => projectBuildings(projectId), [projectId]);
  const [buildingId, setBuildingId] = useState(buildings[0]?.id ?? "");
  const [sectionId, setSectionId] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<RealEstateUnit | null>(null);

  const buildingSections = useMemo(() => sections.filter((s) => s.buildingId === buildingId), [buildingId]);

  useEffect(() => {
    if (buildingSections.length > 0 && !buildingSections.some((s) => s.id === sectionId)) {
      setSectionId(buildingSections[0].id);
    }
  }, [buildingSections, sectionId]);

  const activeSection = buildingSections.find((s) => s.id === sectionId);
  const sectionUnits = useMemo(() => allUnits.filter((u) => u.sectionId === sectionId), [sectionId]);
  const floorNumbers = useMemo(
    () => Array.from({ length: activeSection?.floorsCount ?? 0 }, (_, i) => i + 1),
    [activeSection]
  );

  if (buildings.length === 0) return null;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Select value={buildingId} onChange={(e) => setBuildingId(e.target.value)}>
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </Select>
        {buildingSections.length > 1 && (
          <Select value={sectionId} onChange={(e) => setSectionId(e.target.value)}>
            {buildingSections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
        <Card className="p-4">
          <div className="mb-4">
            <ChessboardLegend />
          </div>
          <RealEstateChessboard
            units={sectionUnits}
            floorNumbers={floorNumbers}
            selectedUnitId={selectedUnit?.id ?? null}
            onSelectUnit={setSelectedUnit}
          />
        </Card>
        <div>
          {selectedUnit ? (
            <UnitDetailPanel unit={selectedUnit} />
          ) : (
            <Card className="flex h-full min-h-[200px] items-center justify-center p-6 text-center text-sm text-[var(--color-ink-500)]">
              Выберите объект на шахматке
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
