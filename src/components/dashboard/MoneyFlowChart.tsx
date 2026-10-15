import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { CashFlowPoint } from "@/data/selectors";
import { formatMoney } from "@/utils/formatters";

interface Props {
  data: CashFlowPoint[];
}

export function MoneyFlowChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-positive-600)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--color-positive-600)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-risk-600)" stopOpacity={0.22} />
            <stop offset="100%" stopColor="var(--color-risk-600)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-ink-500)" }} axisLine={false} tickLine={false} />
        <YAxis
          tickFormatter={(v) => formatMoney(v, "TJS", true)}
          tick={{ fontSize: 11, fill: "var(--color-ink-500)" }}
          axisLine={false}
          tickLine={false}
          width={70}
        />
        <Tooltip
          formatter={(value, name) => [formatMoney(Number(value), "TJS"), String(name)]}
          contentStyle={{
            borderRadius: 10,
            border: "1px solid var(--color-border)",
            fontSize: 12.5,
            boxShadow: "var(--shadow-panel)",
          }}
        />
        <Legend
          formatter={(v) => <span style={{ fontSize: 12.5, color: "var(--color-ink-700)" }}>{v}</span>}
          iconType="circle"
          iconSize={8}
        />
        <Area type="monotone" dataKey="income" name="Поступления" stroke="var(--color-positive-600)" fill="url(#incomeGrad)" strokeWidth={2} />
        <Area type="monotone" dataKey="expense" name="Расходы" stroke="var(--color-risk-600)" fill="url(#expenseGrad)" strokeWidth={2} />
        <Area type="monotone" dataKey="net" name="Чистый остаток" stroke="var(--color-info-600)" fill="none" strokeWidth={2} strokeDasharray="4 3" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
