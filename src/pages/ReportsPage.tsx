import { useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Money } from "@/components/ui/money";
import { KPICard } from "@/components/dashboard/KPICard";
import { MoneyFlowChart } from "@/components/dashboard/MoneyFlowChart";
import { Progress } from "@/components/ui/progress";
import { Eye, Landmark, TrendingDown, TrendingUp, ReceiptText, Target, Percent, Ruler, AlertTriangle } from "lucide-react";
import { getExecutiveReport, getCashFlow, getDashboardKPIs } from "@/data/selectors";
import { formatPercent, formatMoney } from "@/utils/formatters";

export default function ReportsPage() {
  const rows = useMemo(() => getExecutiveReport(), []);
  const cashFlow = useMemo(() => getCashFlow(), []);
  const kpis = useMemo(() => getDashboardKPIs(), []);

  const totals = useMemo(
    () => ({
      invested: rows.reduce((s, r) => s + r.invested, 0),
      spent: rows.reduce((s, r) => s + r.spent, 0),
      received: rows.reduce((s, r) => s + r.received, 0),
      remaining: rows.reduce((s, r) => s + r.remaining, 0),
      profitForecast: rows.reduce((s, r) => s + r.profitForecast, 0),
    }),
    [rows]
  );

  return (
    <div>
      <PageHeader
        title="Отчёты для учредителей"
        description="Сводная картина по всем проектам компании"
        actions={
          <span className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface-muted)] px-2.5 py-1 text-xs font-medium text-[var(--color-ink-500)]">
            <Eye className="h-3.5 w-3.5" /> Только просмотр
          </span>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <KPICard label="Вложено" value={formatMoney(totals.invested, "TJS", true)} icon={Landmark} />
        <KPICard label="Потрачено" value={formatMoney(totals.spent, "TJS", true)} icon={TrendingDown} tone="risk" />
        <KPICard label="Реально получено" value={formatMoney(totals.received, "TJS", true)} icon={TrendingUp} tone="positive" />
        <KPICard label="Осталось получить" value={formatMoney(totals.remaining, "TJS", true)} icon={ReceiptText} tone="warn" />
        <KPICard label="Прогноз прибыли" value={formatMoney(totals.profitForecast, "TJS", true)} icon={Target} tone={totals.profitForecast >= 0 ? "positive" : "risk"} />
        <KPICard label="Долг поставщикам" value={formatMoney(kpis.supplierDebt, "TJS", true)} icon={AlertTriangle} tone="risk" />
        <KPICard label="Средняя стоимость 1 м²" value={formatMoney(kpis.avgCostPerSqm, "TJS")} icon={Ruler} />
        <KPICard
          label="Кассовый разрыв"
          value={kpis.cashGapForecast > 0 ? formatMoney(kpis.cashGapForecast, "TJS", true) : "Не ожидается"}
          icon={AlertTriangle}
          tone={kpis.cashGapForecast > 0 ? "risk" : "positive"}
        />
        <KPICard
          label="Средняя рентабельность"
          value={formatPercent(rows.reduce((s, r) => s + r.profitabilityPercent, 0) / rows.length)}
          icon={Percent}
          tone="positive"
        />
      </div>

      <Card className="mb-5">
        <CardHeader>
          <div>
            <CardTitle>Динамика продаж и расходов</CardTitle>
            <CardDescription>Поступления от продаж против расходов по месяцам</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <MoneyFlowChart data={cashFlow} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Проекты компании</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <Table>
            <THead>
              <TR>
                <TH>Проект</TH>
                <TH className="text-right">Вложено</TH>
                <TH className="text-right">Потрачено</TH>
                <TH className="text-right">Продано</TH>
                <TH className="text-right">Получено</TH>
                <TH className="text-right">Осталось получить</TH>
                <TH className="text-right">Прогноз прибыли</TH>
                <TH className="text-right">Рентабельность</TH>
                <TH className="text-right">1 м²</TH>
                <TH>Готовность</TH>
                <TH className="text-right">Отклонение бюджета</TH>
              </TR>
            </THead>
            <TBody>
              {rows.map((r) => (
                <TR key={r.projectId}>
                  <TD className="font-medium">{r.projectName}</TD>
                  <TD className="text-right">
                    <Money amount={r.invested} compact />
                  </TD>
                  <TD className="text-right">
                    <Money amount={r.spent} compact />
                  </TD>
                  <TD className="text-right">
                    <Money amount={r.soldAmount} compact />
                  </TD>
                  <TD className="text-right">
                    <Money amount={r.received} compact />
                  </TD>
                  <TD className="text-right">
                    <Money amount={r.remaining} compact />
                  </TD>
                  <TD className="text-right">
                    <Money amount={r.profitForecast} compact signColor />
                  </TD>
                  <TD className="tnum text-right">{formatPercent(r.profitabilityPercent)}</TD>
                  <TD className="text-right">
                    <Money amount={r.costPerSqm} />
                  </TD>
                  <TD className="w-32">
                    <div className="flex items-center gap-2">
                      <Progress value={r.completionPercent} className="w-16" />
                      <span className="tnum text-xs text-[var(--color-ink-500)]">{r.completionPercent}%</span>
                    </div>
                  </TD>
                  <TD className={`tnum text-right ${r.budgetDeviationPercent > 0 ? "text-[var(--color-risk-600)]" : "text-[var(--color-positive-600)]"}`}>
                    {formatPercent(r.budgetDeviationPercent)}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
