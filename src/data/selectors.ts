import {
  projects,
  stages,
  units,
  transactions,
  debts,
  saleDeals,
  SUPPLIERS,
} from "./mockData";
import { transactionCategoryMeta } from "@/utils/formatters";
import type { TransactionCategory, UnitType } from "@/types";

export interface ScopeFilter {
  projectId?: string; // undefined = все проекты
}

function inScope(projectId: string, scope?: ScopeFilter): boolean {
  return !scope?.projectId || scope.projectId === projectId;
}

// ---------------------------------------------------------------------------
// Cash flow по месяцам
// ---------------------------------------------------------------------------

export interface CashFlowPoint {
  month: string;
  income: number;
  expense: number;
  net: number;
}

const MONTH_LABELS = ["Июл", "Авг", "Сен", "Окт", "Ноя", "Дек", "Янв", "Фев", "Мар", "Апр", "Май", "Июн"];

export function getCashFlow(scope?: ScopeFilter): CashFlowPoint[] {
  const points: CashFlowPoint[] = MONTH_LABELS.map((label) => ({ month: label, income: 0, expense: 0, net: 0 }));
  const start = new Date("2025-07-01").getTime();

  for (const tx of transactions) {
    if (!inScope(tx.projectId, scope)) continue;
    const monthIndex = Math.floor((new Date(tx.date).getTime() - start) / (1000 * 60 * 60 * 24 * 30.4));
    const idx = Math.max(0, Math.min(11, monthIndex));
    if (tx.type === "income") points[idx].income += tx.amount;
    else points[idx].expense += tx.amount;
  }
  for (const p of points) p.net = p.income - p.expense;
  return points;
}

// ---------------------------------------------------------------------------
// Расходы по категориям
// ---------------------------------------------------------------------------

export interface CategorySlice {
  category: string;
  value: number;
}

export function getExpensesByCategory(scope?: ScopeFilter): CategorySlice[] {
  const totals = new Map<TransactionCategory, number>();
  for (const tx of transactions) {
    if (tx.type !== "expense") continue;
    if (!inScope(tx.projectId, scope)) continue;
    totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amount);
  }
  return Array.from(totals.entries())
    .map(([category, value]) => ({ category: transactionCategoryMeta[category], value }))
    .sort((a, b) => b.value - a.value);
}

// ---------------------------------------------------------------------------
// План/факт по этапам
// ---------------------------------------------------------------------------

export interface StagePlanFact {
  key: string;
  name: string;
  planned: number;
  actual: number;
}

export function getStagePlanFact(scope?: ScopeFilter): StagePlanFact[] {
  const relevant = stages.filter((s) => inScope(s.projectId, scope));
  const grouped = new Map<string, StagePlanFact>();
  for (const s of relevant) {
    const key = s.key;
    const existing = grouped.get(key);
    if (existing) {
      existing.planned += s.budgetPlanned;
      existing.actual += s.spentActual;
    } else {
      grouped.set(key, { key, name: s.name, planned: s.budgetPlanned, actual: s.spentActual });
    }
  }
  return Array.from(grouped.values());
}

// ---------------------------------------------------------------------------
// Продажи недвижимости по типам
// ---------------------------------------------------------------------------

export interface UnitTypeSales {
  type: UnitType;
  label: string;
  sold: number;
  free: number;
  total: number;
}

const TYPE_LABELS: Record<UnitType, string> = {
  apartment: "Квартиры",
  parking: "Парковки",
  storage: "Кладовки",
  basement: "Подвалы",
  commercial: "Коммерция",
  office: "Офисы",
  technical: "Технические",
};

export function getUnitSalesByType(scope?: ScopeFilter): UnitTypeSales[] {
  const relevant = units.filter((u) => inScope(u.projectId, scope));
  const map = new Map<UnitType, UnitTypeSales>();
  for (const u of relevant) {
    const entry = map.get(u.type) ?? { type: u.type, label: TYPE_LABELS[u.type], sold: 0, free: 0, total: 0 };
    entry.total += 1;
    if (["sold", "handed-over", "installment", "mortgage"].includes(u.status)) entry.sold += 1;
    if (u.status === "free") entry.free += 1;
    map.set(u.type, entry);
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

// ---------------------------------------------------------------------------
// KPI дашборда
// ---------------------------------------------------------------------------

export interface DashboardKPIs {
  bankBalance: number;
  cashBalance: number;
  monthExpense: number;
  monthIncome: number;
  supplierDebt: number;
  receivables: number;
  unitsSold: number;
  unitsReserved: number;
  unitsFree: number;
  budgetPlanned: number;
  budgetActual: number;
  cashGapForecast: number;
  avgCostPerSqm: number;
}

export function getDashboardKPIs(scope?: ScopeFilter): DashboardKPIs {
  const relevantProjects = projects.filter((p) => inScope(p.id, scope));
  const relevantUnits = units.filter((u) => inScope(u.projectId, scope));
  const relevantStages = stages.filter((s) => inScope(s.projectId, scope));
  const relevantDeals = saleDeals.filter((d) => inScope(d.projectId, scope));

  const cashFlow = getCashFlow(scope);
  const currentMonth = cashFlow[cashFlow.length - 1];
  const prevMonth = cashFlow[cashFlow.length - 2];

  const budgetPlanned = relevantStages.reduce((s, st) => s + st.budgetPlanned, 0);
  const budgetActual = relevantStages.reduce((s, st) => s + st.spentActual, 0);

  const totalSpent = relevantProjects.reduce((s, p) => s + p.spentTotal, 0);
  const totalConstructionArea = relevantUnits
    .filter((u) => u.type === "apartment")
    .reduce((s, u) => s + u.area, 0);

  return {
    bankBalance: relevantProjects.reduce((s, p) => s + p.revenueTotal - p.spentTotal * 0.42, 0),
    cashBalance: Math.round(totalSpent * 0.015) + 420_000,
    monthExpense: currentMonth.expense,
    monthIncome: currentMonth.income,
    supplierDebt: SUPPLIERS.reduce((s, sup) => s + sup.currentDebt, 0),
    receivables: relevantDeals.reduce((s, d) => s + d.remainingAmount, 0),
    unitsSold: relevantUnits.filter((u) => ["sold", "handed-over", "installment", "mortgage"].includes(u.status)).length,
    unitsReserved: relevantUnits.filter((u) => ["reserved", "presale"].includes(u.status)).length,
    unitsFree: relevantUnits.filter((u) => u.status === "free").length,
    budgetPlanned,
    budgetActual,
    cashGapForecast: currentMonth.net - prevMonth.net < 0 ? Math.abs(Math.round((currentMonth.net - prevMonth.net) * 1.4)) : 0,
    avgCostPerSqm: totalConstructionArea > 0 ? Math.round(totalSpent / totalConstructionArea) : 0,
  };
}

// ---------------------------------------------------------------------------
// Метрики себестоимости строительства
// ---------------------------------------------------------------------------

export interface StageCostMetrics {
  excavationCost: number;
  foundationCost: number;
  avgFloorCost: number;
  monolithPerSqm: number;
  masonryPerSqm: number;
  facadePerSqm: number;
  landscapingCost: number;
}

export function getStageCostMetrics(scope?: ScopeFilter): StageCostMetrics {
  const relevantStages = stages.filter((s) => inScope(s.projectId, scope));
  const relevantProjects = projects.filter((p) => inScope(p.id, scope));
  const relevantUnits = units.filter((u) => inScope(u.projectId, scope) && u.type === "apartment");

  const byKey = (key: string) => relevantStages.filter((s) => s.key === key).reduce((s, st) => s + st.spentActual, 0);
  const totalFloors = relevantProjects.reduce((sum, p) => {
    const projectBuildings = p.buildingsCount;
    return sum + projectBuildings * 11; // средняя этажность допущение
  }, 0);
  const totalArea = relevantUnits.reduce((s, u) => s + u.area, 0) || 1;

  return {
    excavationCost: byKey("excavation"),
    foundationCost: byKey("foundation"),
    avgFloorCost: totalFloors > 0 ? Math.round(byKey("monolith") / totalFloors) : 0,
    monolithPerSqm: Math.round(byKey("monolith") / totalArea),
    masonryPerSqm: Math.round(byKey("masonry") / totalArea),
    facadePerSqm: Math.round(byKey("facade") / totalArea),
    landscapingCost: byKey("landscaping"),
  };
}

// ---------------------------------------------------------------------------
// Финансовый обзор и P&L
// ---------------------------------------------------------------------------

export interface FinanceOverview {
  budgetTotal: number;
  spent: number;
  remaining: number;
  salesIncome: number;
  expectedIncome: number;
  supplierDebt: number;
  clientDebt: number;
  profitability: number; // %
}

export function getFinanceOverview(scope?: ScopeFilter): FinanceOverview {
  const relevantProjects = projects.filter((p) => inScope(p.id, scope));
  const relevantDeals = saleDeals.filter((d) => inScope(d.projectId, scope));
  const relevantDebts = debts.filter((d) => {
    const supplier = SUPPLIERS.find((s) => s.id === d.supplierId);
    return supplier ? true : false;
  });

  const budgetTotal = relevantProjects.reduce((s, p) => s + p.budgetTotal, 0);
  const spent = relevantProjects.reduce((s, p) => s + p.spentTotal, 0);
  const salesIncome = relevantProjects.reduce((s, p) => s + p.revenueTotal, 0);
  const expectedIncome = relevantDeals.reduce((s, d) => s + d.remainingAmount, 0);
  const clientDebt = expectedIncome;
  const supplierDebt = scope?.projectId ? SUPPLIERS.reduce((s, sup) => s + sup.currentDebt, 0) : relevantDebts.reduce((s, d) => s + d.amount, 0);
  const profitability = budgetTotal > 0 ? ((salesIncome - spent) / budgetTotal) * 100 : 0;

  return {
    budgetTotal,
    spent,
    remaining: budgetTotal - spent,
    salesIncome,
    expectedIncome,
    supplierDebt,
    clientDebt,
    profitability,
  };
}

export interface ProjectPnL {
  projectId: string;
  projectName: string;
  revenue: number;
  cost: number;
  profit: number;
  marginPercent: number;
}

export function getProjectPnL(): ProjectPnL[] {
  return projects.map((p) => {
    const profit = p.revenueTotal - p.spentTotal;
    return {
      projectId: p.id,
      projectName: p.name,
      revenue: p.revenueTotal,
      cost: p.spentTotal,
      profit,
      marginPercent: p.revenueTotal > 0 ? (profit / p.revenueTotal) * 100 : 0,
    };
  });
}

// ---------------------------------------------------------------------------
// Отчёт для учредителей
// ---------------------------------------------------------------------------

export interface ExecutiveReportRow {
  projectId: string;
  projectName: string;
  invested: number;
  spent: number;
  soldAmount: number;
  received: number;
  remaining: number;
  supplierDebt: number;
  profitForecast: number;
  profitabilityPercent: number;
  costPerSqm: number;
  completionPercent: number;
  budgetDeviationPercent: number;
}

export function getExecutiveReport(): ExecutiveReportRow[] {
  return projects.map((p) => {
    const projectDeals = saleDeals.filter((d) => d.projectId === p.id);
    const received = projectDeals.reduce((s, d) => s + d.paidAmount, 0);
    const remaining = projectDeals.reduce((s, d) => s + d.remainingAmount, 0);
    const soldAmount = projectDeals.reduce((s, d) => s + d.finalPrice, 0);
    const projectStages = stages.filter((s) => s.projectId === p.id);
    const planned = projectStages.reduce((s, st) => s + st.budgetPlanned, 0);
    const actual = projectStages.reduce((s, st) => s + st.spentActual, 0);
    const area = units.filter((u) => u.projectId === p.id && u.type === "apartment").reduce((s, u) => s + u.area, 0) || 1;
    const supplierDebtShare = Math.round(
      SUPPLIERS.reduce((s, sup) => s + sup.currentDebt, 0) / projects.length
    );

    return {
      projectId: p.id,
      projectName: p.name,
      invested: p.budgetTotal,
      spent: p.spentTotal,
      soldAmount,
      received,
      remaining,
      supplierDebt: supplierDebtShare,
      profitForecast: soldAmount - p.spentTotal,
      profitabilityPercent: p.budgetTotal > 0 ? ((soldAmount - p.spentTotal) / p.budgetTotal) * 100 : 0,
      costPerSqm: Math.round(p.spentTotal / area),
      completionPercent: p.completionPercent,
      budgetDeviationPercent: planned > 0 ? ((actual - planned) / planned) * 100 : 0,
    };
  });
}

// ---------------------------------------------------------------------------
// Риски
// ---------------------------------------------------------------------------

export type RiskSeverity = "high" | "medium" | "low";

export interface RiskItem {
  id: string;
  title: string;
  detail: string;
  severity: RiskSeverity;
}

export function getRisks(scope?: ScopeFilter): RiskItem[] {
  const risks: RiskItem[] = [];

  const overdueDebts = debts.filter((d) => d.status === "overdue");
  if (overdueDebts.length > 0) {
    const total = overdueDebts.reduce((s, d) => s + d.amount, 0);
    risks.push({
      id: "risk-debts",
      title: "Просроченные платежи поставщикам",
      detail: `${overdueDebts.length} поставщиков, на сумму ${Math.round(total / 1000)} тыс смн`,
      severity: overdueDebts.length > 3 ? "high" : "medium",
    });
  }

  const relevantStages = stages.filter((s) => inScope(s.projectId, scope));
  const overBudgetStages = relevantStages.filter((s) => s.spentActual > s.budgetPlanned && s.progressPercent < 100);
  if (overBudgetStages.length > 0) {
    risks.push({
      id: "risk-budget",
      title: "Превышение бюджета по этапам",
      detail: `${overBudgetStages.length} этапов превышают плановый бюджет`,
      severity: overBudgetStages.length > 4 ? "high" : "medium",
    });
  }

  const delayedStages = relevantStages.filter((s) => s.status === "delayed");
  if (delayedStages.length > 0) {
    risks.push({
      id: "risk-delay",
      title: "Задержка этапа строительства",
      detail: delayedStages.map((s) => s.name).slice(0, 3).join(", "),
      severity: delayedStages.length > 3 ? "high" : "medium",
    });
  }

  const kpis = getDashboardKPIs(scope);
  if (kpis.cashGapForecast > 0) {
    risks.push({
      id: "risk-cashgap",
      title: "Ожидаемый кассовый разрыв",
      detail: `Прогноз дефицита около ${Math.round(kpis.cashGapForecast / 1000)} тыс смн в следующем месяце`,
      severity: "high",
    });
  }

  risks.push({
    id: "risk-lowstock",
    title: "Низкий остаток материалов",
    detail: "Арматура 16 мм и цемент М500 приближаются к минимальному остатку",
    severity: "low",
  });

  return risks;
}
