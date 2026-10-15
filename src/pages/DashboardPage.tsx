import { useMemo } from "react";
import {
  Landmark,
  Wallet,
  TrendingDown,
  TrendingUp,
  AlertOctagon,
  ReceiptText,
  Home,
  BookmarkCheck,
  Building,
  Target,
  AlertTriangle,
  Ruler,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/KPICard";
import { MoneyFlowChart } from "@/components/dashboard/MoneyFlowChart";
import { ExpensesPieChart } from "@/components/dashboard/ExpensesPieChart";
import { PlanFactChart } from "@/components/dashboard/PlanFactChart";
import { SalesByTypeChart } from "@/components/dashboard/SalesByTypeChart";
import { RisksPanel } from "@/components/dashboard/RisksPanel";
import { useScope } from "@/context/ScopeContext";
import {
  getCashFlow,
  getDashboardKPIs,
  getExpensesByCategory,
  getStagePlanFact,
  getUnitSalesByType,
  getRisks,
} from "@/data/selectors";
import { formatMoney, formatPercent } from "@/utils/formatters";
import { projects } from "@/data/mockData";

export default function DashboardPage() {
  const { projectId } = useScope();
  const scope = useMemo(() => ({ projectId: projectId ?? undefined }), [projectId]);

  const kpis = useMemo(() => getDashboardKPIs(scope), [scope]);
  const cashFlow = useMemo(() => getCashFlow(scope), [scope]);
  const expenseSlices = useMemo(() => getExpensesByCategory(scope), [scope]);
  const stagePlanFact = useMemo(() => getStagePlanFact(scope), [scope]);
  const salesByType = useMemo(() => getUnitSalesByType(scope), [scope]);
  const risks = useMemo(() => getRisks(scope), [scope]);

  const activeProject = projects.find((p) => p.id === projectId);
  const budgetVariance = kpis.budgetActual - kpis.budgetPlanned;
  const budgetVariancePct = kpis.budgetPlanned > 0 ? (budgetVariance / kpis.budgetPlanned) * 100 : 0;

  return (
    <div>
      <PageHeader
        title="Дашборд"
        description={
          activeProject
            ? `Ключевые показатели по объекту: ${activeProject.name}`
            : "Ключевые показатели по всем объектам компании"
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        <KPICard label="Деньги на счетах" value={formatMoney(kpis.bankBalance, "TJS", true)} icon={Landmark} tone="info" hint="банк" />
        <KPICard label="Деньги в кассе" value={formatMoney(kpis.cashBalance, "TJS", true)} icon={Wallet} tone="default" hint="наличные" />
        <KPICard
          label="Поступления за месяц"
          value={formatMoney(kpis.monthIncome, "TJS", true)}
          icon={TrendingUp}
          tone="positive"
          trend="up"
          delta={formatPercent((kpis.monthIncome / Math.max(1, kpis.monthExpense) - 1) * 100)}
        />
        <KPICard
          label="Расходы за месяц"
          value={formatMoney(kpis.monthExpense, "TJS", true)}
          icon={TrendingDown}
          tone="risk"
        />
        <KPICard label="Долг перед поставщиками" value={formatMoney(kpis.supplierDebt, "TJS", true)} icon={AlertOctagon} tone="risk" />
        <KPICard label="Дебиторская задолженность" value={formatMoney(kpis.receivables, "TJS", true)} icon={ReceiptText} tone="warn" />
        <KPICard label="Продано объектов" value={String(kpis.unitsSold)} icon={BookmarkCheck} tone="positive" hint="ед." />
        <KPICard label="Забронировано" value={String(kpis.unitsReserved)} icon={Building} tone="info" hint="ед." />
        <KPICard label="Свободный фонд" value={String(kpis.unitsFree)} icon={Home} tone="default" hint="ед." />
        <KPICard
          label="План / факт бюджета"
          value={formatPercent(budgetVariancePct)}
          icon={Target}
          tone={budgetVariance > 0 ? "risk" : "positive"}
          trend={budgetVariance > 0 ? "up" : "down"}
          hint="отклонение от плана"
        />
        <KPICard
          label="Прогноз кассового разрыва"
          value={kpis.cashGapForecast > 0 ? formatMoney(kpis.cashGapForecast, "TJS", true) : "Не ожидается"}
          icon={AlertTriangle}
          tone={kpis.cashGapForecast > 0 ? "risk" : "positive"}
        />
        <KPICard label="Средняя стоимость 1 м²" value={formatMoney(kpis.avgCostPerSqm, "TJS")} icon={Ruler} tone="default" hint="строительство" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Cash Flow по месяцам</CardTitle>
              <CardDescription>Поступления, расходы и чистый остаток</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <MoneyFlowChart data={cashFlow} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Расходы по категориям</CardTitle>
              <CardDescription>За весь период</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ExpensesPieChart data={expenseSlices} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>План / факт по строительным этапам</CardTitle>
              <CardDescription>Плановый и фактический расход по каждому этапу</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <PlanFactChart data={stagePlanFact} />
          </CardContent>
        </Card>

        <RisksPanel risks={risks} />
      </div>

      <div className="mt-5">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Продажи недвижимости</CardTitle>
              <CardDescription>Соотношение проданных и свободных объектов по типам</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SalesByTypeChart data={salesByType} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
