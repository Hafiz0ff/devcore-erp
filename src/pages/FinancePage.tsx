import { useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/KPICard";
import { MoneyFlowChart } from "@/components/dashboard/MoneyFlowChart";
import { PlanFactChart } from "@/components/dashboard/PlanFactChart";
import { FinancialTransactionsTable } from "@/components/finance/FinancialTransactionsTable";
import { SupplierDebtTable } from "@/components/finance/SupplierDebtTable";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Money } from "@/components/ui/money";
import { StatusBadge } from "@/components/ui/badge";
import { Wallet, TrendingUp, TrendingDown, Landmark, ReceiptText, PieChart as PieChartIcon } from "lucide-react";
import { useScope } from "@/context/ScopeContext";
import { transactions, debts, clients } from "@/data/mockData";
import { getFinanceOverview, getCashFlow, getStagePlanFact, getProjectPnL } from "@/data/selectors";
import { formatPercent } from "@/utils/formatters";

export default function FinancePage() {
  const { projectId } = useScope();
  const scope = useMemo(() => ({ projectId: projectId ?? undefined }), [projectId]);

  const overview = useMemo(() => getFinanceOverview(scope), [scope]);
  const cashFlow = useMemo(() => getCashFlow(scope), [scope]);
  const planFact = useMemo(() => getStagePlanFact(scope), [scope]);
  const pnl = useMemo(() => getProjectPnL(), []);

  const relevantTransactions = useMemo(
    () => transactions.filter((t) => !projectId || t.projectId === projectId),
    [projectId]
  );
  const relevantDebts = debts; // долги общие по компании
  const receivableClients = useMemo(
    () => clients.filter((c) => c.remainingAmount > 0).sort((a, b) => b.remainingAmount - a.remainingAmount),
    []
  );

  return (
    <div>
      <PageHeader title="Финансы" description="Деньги, платежи, долги и рентабельность проектов" />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="movements">Движение денег</TabsTrigger>
          <TabsTrigger value="payments">Платежи</TabsTrigger>
          <TabsTrigger value="debts">Долги</TabsTrigger>
          <TabsTrigger value="receivables">Дебиторка</TabsTrigger>
          <TabsTrigger value="planfact">План/факт</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="pnl">P&L проекта</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <KPICard label="Общий бюджет" value={formatCompact(overview.budgetTotal)} icon={Landmark} />
            <KPICard label="Потрачено" value={formatCompact(overview.spent)} icon={TrendingDown} tone="risk" />
            <KPICard label="Осталось по бюджету" value={formatCompact(overview.remaining)} icon={Wallet} tone="info" />
            <KPICard label="Поступления от продаж" value={formatCompact(overview.salesIncome)} icon={TrendingUp} tone="positive" />
            <KPICard label="Ожидаемые поступления" value={formatCompact(overview.expectedIncome)} icon={ReceiptText} tone="warn" />
            <KPICard label="Долги поставщикам" value={formatCompact(overview.supplierDebt)} icon={TrendingDown} tone="risk" />
            <KPICard label="Долги клиентов" value={formatCompact(overview.clientDebt)} icon={ReceiptText} tone="warn" />
            <KPICard label="Рентабельность проекта" value={formatPercent(overview.profitability)} icon={PieChartIcon} tone={overview.profitability >= 0 ? "positive" : "risk"} />
          </div>
        </TabsContent>

        <TabsContent value="movements">
          <FinancialTransactionsTable transactions={relevantTransactions} />
        </TabsContent>

        <TabsContent value="payments">
          <FinancialTransactionsTable transactions={relevantTransactions} typeFilter="expense" />
        </TabsContent>

        <TabsContent value="debts">
          <SupplierDebtTable debts={relevantDebts} />
        </TabsContent>

        <TabsContent value="receivables">
          <Table>
            <THead>
              <TR>
                <TH>Клиент</TH>
                <TH className="text-right">Сумма договоров</TH>
                <TH className="text-right">Оплачено</TH>
                <TH className="text-right">Остаток</TH>
                <TH className="text-right">Просрочка</TH>
                <TH>Статус</TH>
              </TR>
            </THead>
            <TBody>
              {receivableClients.map((c) => (
                <TR key={c.id}>
                  <TD className="font-medium">{c.fullName}</TD>
                  <TD className="text-right">
                    <Money amount={c.contractsAmount} compact />
                  </TD>
                  <TD className="text-right">
                    <Money amount={c.paidAmount} compact />
                  </TD>
                  <TD className="text-right">
                    <Money amount={c.remainingAmount} compact />
                  </TD>
                  <TD className="text-right">
                    {c.overdueAmount > 0 ? <Money amount={c.overdueAmount} compact className="text-[var(--color-risk-600)]" /> : "—"}
                  </TD>
                  <TD>
                    <StatusBadge tone={c.overdueAmount > 0 ? "risk" : "info"}>
                      {c.overdueAmount > 0 ? "Есть просрочка" : "В графике"}
                    </StatusBadge>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </TabsContent>

        <TabsContent value="planfact">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>План / факт по этапам</CardTitle>
                <CardDescription>Сравнение планового и фактического расхода бюджета</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <PlanFactChart data={planFact} horizontal />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Cash Flow</CardTitle>
                <CardDescription>Динамика поступлений и расходов по месяцам</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <MoneyFlowChart data={cashFlow} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pnl">
          <Table>
            <THead>
              <TR>
                <TH>Проект</TH>
                <TH className="text-right">Выручка</TH>
                <TH className="text-right">Затраты</TH>
                <TH className="text-right">Прибыль</TH>
                <TH className="text-right">Маржа</TH>
              </TR>
            </THead>
            <TBody>
              {pnl.map((row) => (
                <TR key={row.projectId}>
                  <TD className="font-medium">{row.projectName}</TD>
                  <TD className="text-right">
                    <Money amount={row.revenue} compact />
                  </TD>
                  <TD className="text-right">
                    <Money amount={row.cost} compact />
                  </TD>
                  <TD className="text-right">
                    <Money amount={row.profit} compact signColor />
                  </TD>
                  <TD className="text-right tnum">{formatPercent(row.marginPercent)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function formatCompact(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toLocaleString("ru-RU", { maximumFractionDigits: 1 })} млн смн`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toLocaleString("ru-RU", { maximumFractionDigits: 0 })} тыс смн`;
  return `${sign}${abs.toLocaleString("ru-RU")} смн`;
}
