import { useMemo, useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { KPICard } from "@/components/dashboard/KPICard";
import { Home, BookmarkCheck, Clock, Ban } from "lucide-react";
import { RealEstateChessboard, ChessboardLegend } from "@/components/realestate/RealEstateChessboard";
import { UnitDetailPanel } from "@/components/realestate/UnitDetailPanel";
import { RealEstateUnitTable } from "@/components/realestate/RealEstateUnitTable";
import { useScope } from "@/context/ScopeContext";
import { projects, projectBuildings, sections, units as allUnits, projectUnits } from "@/data/mockData";
import type { RealEstateUnit } from "@/types";

export default function RealEstatePage() {
  const { projectId } = useScope();
  const [localProjectId, setLocalProjectId] = useState(projectId ?? projects[0].id);
  const [buildingId, setBuildingId] = useState<string>("");
  const [sectionId, setSectionId] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<RealEstateUnit | null>(null);

  useEffect(() => {
    if (projectId) setLocalProjectId(projectId);
  }, [projectId]);

  const buildings = useMemo(() => projectBuildings(localProjectId), [localProjectId]);

  useEffect(() => {
    if (buildings.length > 0 && !buildings.some((b) => b.id === buildingId)) {
      setBuildingId(buildings[0].id);
    }
  }, [buildings, buildingId]);

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

  const scopeUnits = useMemo(
    () => (projectId ? projectUnits(projectId) : allUnits),
    [projectId]
  );

  const totals = useMemo(() => {
    return {
      free: scopeUnits.filter((u) => u.status === "free").length,
      sold: scopeUnits.filter((u) => ["sold", "handed-over", "installment", "mortgage"].includes(u.status)).length,
      reserved: scopeUnits.filter((u) => ["reserved", "presale"].includes(u.status)).length,
      unavailable: scopeUnits.filter((u) => u.status === "unavailable").length,
    };
  }, [scopeUnits]);

  return (
    <div>
      <PageHeader title="Недвижимый фонд" description="Каталог квартир, парковок, кладовок и коммерческих помещений" />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPICard label="Свободно" value={String(totals.free)} icon={Home} tone="positive" />
        <KPICard label="Продано / в сделке" value={String(totals.sold)} icon={BookmarkCheck} tone="default" />
        <KPICard label="Бронь / предпродажа" value={String(totals.reserved)} icon={Clock} tone="warn" />
        <KPICard label="Недоступно" value={String(totals.unavailable)} icon={Ban} tone="risk" />
      </div>

      <Tabs defaultValue="chessboard">
        <TabsList>
          <TabsTrigger value="chessboard">Шахматка</TabsTrigger>
          <TabsTrigger value="table">Таблица объектов</TabsTrigger>
        </TabsList>

        <TabsContent value="chessboard">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Select value={localProjectId} onChange={(e) => setLocalProjectId(e.target.value)} disabled={!!projectId}>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
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
                  Выберите объект на шахматке, чтобы увидеть детали
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="table">
          <RealEstateUnitTable units={scopeUnits} onSelectUnit={setSelectedUnit} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
