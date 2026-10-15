import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Building2, FileX } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/badge";
import { Money } from "@/components/ui/money";
import { Progress } from "@/components/ui/progress";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { PlanFactChart } from "@/components/dashboard/PlanFactChart";
import { MoneyFlowChart } from "@/components/dashboard/MoneyFlowChart";
import { ConstructionStageCard } from "@/components/construction/ConstructionStageCard";
import { StageDetailPanel } from "@/components/construction/StageDetailPanel";
import { FinancialTransactionsTable } from "@/components/finance/FinancialTransactionsTable";
import { PurchaseRequestTable } from "@/components/procurement/PurchaseRequestTable";
import { ProjectChessboardExplorer } from "@/components/realestate/ProjectChessboardExplorer";
import {
  projects,
  projectBuildings,
  projectStages,
  transactions,
  purchaseRequests,
  documents,
} from "@/data/mockData";
import { getStagePlanFact, getCashFlow, getFinanceOverview, getExecutiveReport } from "@/data/selectors";
import { projectStatusMeta, documentTypeMeta, documentStatusMeta, formatDate, formatPercent } from "@/utils/formatters";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

  const scope = useMemo(() => ({ projectId: id }), [id]);
  const buildings = useMemo(() => (id ? projectBuildings(id) : []), [id]);
  const stages = useMemo(() => (id ? projectStages(id) : []), [id]);
  const planFact = useMemo(() => getStagePlanFact(scope), [scope]);
  const cashFlow = useMemo(() => getCashFlow(scope), [scope]);
  const overview = useMemo(() => getFinanceOverview(scope), [scope]);
  const projectTransactions = useMemo(() => transactions.filter((t) => t.projectId === id), [id]);
  const projectRequests = useMemo(() => purchaseRequests.filter((r) => r.projectId === id), [id]);
  const projectDocs = useMemo(() => documents.filter((d) => d.relatedProjectId === id), [id]);
  const report = useMemo(() => getExecutiveReport().find((r) => r.projectId === id), [id]);

  const selectedStage = stages.find((s) => s.id === selectedStageId) ?? null;

  if (!project) {
    return (
      <div>
        <Link to="/projects" className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)]">
          <ArrowLeft className="h-4 w-4" /> К списку проектов
        </Link>
        <EmptyState icon={FileX} title="Проект не найден" />
      </div>
    );
  }

  const statusMeta = projectStatusMeta[project.status];

  return (
    <div>
      <Link to="/projects" className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)]">
        <ArrowLeft className="h-4 w-4" /> К списку проектов
      </Link>

      <PageHeader
        title={project.name}
        description={project.address}
        actions={<StatusBadge tone={statusMeta.tone}>{statusMeta.label}</StatusBadge>}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        <Metric label="Бюджет" value={<Money amount={project.budgetTotal} compact />} />
        <Metric label="Потрачено" value={<Money amount={project.spentTotal} compact />} />
        <Metric label="Поступления" value={<Money amount={project.revenueTotal} compact />} />
        <Metric label="Продано / всего" value={`${project.unitsSold} / ${project.unitsTotal}`} />
        <Metric label="Свободно" value={String(project.unitsFree)} />
        <Metric
          label="Готовность"
          value={
            <div className="flex items-center gap-2">
              <Progress value={project.completionPercent} className="w-14" />
              <span className="tnum text-xs">{project.completionPercent}%</span>
            </div>
          }
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="buildings">Корпуса</TabsTrigger>
          <TabsTrigger value="stages">Этапы</TabsTrigger>
          <TabsTrigger value="finance">Финансы</TabsTrigger>
          <TabsTrigger value="procurement">Закупки</TabsTrigger>
          <TabsTrigger value="realestate">Недвижимый фонд</TabsTrigger>
          <TabsTrigger value="documents">Документы</TabsTrigger>
          <TabsTrigger value="reports">Отчёты</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Cash Flow</CardTitle>
                  <CardDescription>Поступления и расходы по проекту</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <MoneyFlowChart data={cashFlow} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>План / факт по этапам</CardTitle>
                  <CardDescription>Отклонение бюджета по этапам проекта</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <PlanFactChart data={planFact} horizontal />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="buildings">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {buildings.map((b) => (
              <Card key={b.id} className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-brand-100)] text-[var(--color-brand-800)]">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold">{b.name}</div>
                    <div className="text-xs text-[var(--color-ink-500)]">{b.floorsCount} этажей · {b.sectionsCount} секций</div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="mb-1 flex items-center justify-between text-xs text-[var(--color-ink-500)]">
                    <span>Готовность</span>
                    <span className="tnum">{b.completionPercent}%</span>
                  </div>
                  <Progress value={b.completionPercent} tone="info" />
                </div>
                <div className="text-xs text-[var(--color-ink-500)]">Объектов: <span className="tnum font-medium text-[var(--color-ink-900)]">{b.unitsCount}</span></div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stages">
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {stages.map((stage) => (
              <ConstructionStageCard
                key={stage.id}
                stage={stage}
                selected={stage.id === selectedStageId}
                onClick={() => setSelectedStageId(stage.id === selectedStageId ? null : stage.id)}
              />
            ))}
          </div>
          {selectedStage && <StageDetailPanel stage={selectedStage} />}
        </TabsContent>

        <TabsContent value="finance">
          <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Metric label="Бюджет" value={<Money amount={overview.budgetTotal} compact />} />
            <Metric label="Потрачено" value={<Money amount={overview.spent} compact />} />
            <Metric label="Осталось" value={<Money amount={overview.remaining} compact />} />
            <Metric label="Рентабельность" value={formatPercent(overview.profitability)} />
          </div>
          <FinancialTransactionsTable transactions={projectTransactions} />
        </TabsContent>

        <TabsContent value="procurement">
          <PurchaseRequestTable requests={projectRequests} />
        </TabsContent>

        <TabsContent value="realestate">
          <ProjectChessboardExplorer projectId={project.id} />
        </TabsContent>

        <TabsContent value="documents">
          {projectDocs.length === 0 ? (
            <EmptyState icon={FileX} title="Документов не найдено" />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Номер</TH>
                  <TH>Тип</TH>
                  <TH>Контрагент</TH>
                  <TH>Дата</TH>
                  <TH>Статус</TH>
                </TR>
              </THead>
              <TBody>
                {projectDocs.map((d) => {
                  const meta = documentStatusMeta[d.status];
                  return (
                    <TR key={d.id}>
                      <TD className="font-medium">{d.number}</TD>
                      <TD>{documentTypeMeta[d.type]}</TD>
                      <TD>{d.counterpartyName}</TD>
                      <TD>{formatDate(d.date)}</TD>
                      <TD>
                        <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="reports">
          {report && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Metric label="Вложено" value={<Money amount={report.invested} compact />} />
              <Metric label="Получено" value={<Money amount={report.received} compact />} />
              <Metric label="Осталось получить" value={<Money amount={report.remaining} compact />} />
              <Metric label="Прогноз прибыли" value={<Money amount={report.profitForecast} compact signColor />} />
              <Metric label="Рентабельность" value={formatPercent(report.profitabilityPercent)} />
              <Metric label="Стоимость 1 м²" value={<Money amount={report.costPerSqm} />} />
              <Metric label="Готовность" value={`${report.completionPercent}%`} />
              <Metric label="Отклонение бюджета" value={formatPercent(report.budgetDeviationPercent)} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 shadow-[var(--shadow-card)]">
      <div className="mb-1 text-[11.5px] text-[var(--color-ink-500)]">{label}</div>
      <div className="text-[15px] font-semibold text-[var(--color-ink-900)]">{value}</div>
    </div>
  );
}
