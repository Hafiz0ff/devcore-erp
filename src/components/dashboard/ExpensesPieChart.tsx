import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { CategorySlice } from "@/data/selectors";
import { formatMoney } from "@/utils/formatters";

const COLORS = ["#1B2430", "#1D5FA8", "#12805C", "#B8871F", "#C0362C", "#667085", "#8B5CF6", "#0EA5A4", "#D97706"];

interface Props {
  data: CategorySlice[];
}

export function ExpensesPieChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="category" innerRadius={62} outerRadius={98} paddingAngle={1.5} strokeWidth={1}>
          {data.map((entry, idx) => (
            <Cell key={entry.category} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatMoney(Number(value), "TJS")}
          contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", fontSize: 12.5, boxShadow: "var(--shadow-panel)" }}
        />
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          formatter={(v) => <span style={{ fontSize: 12, color: "var(--color-ink-700)" }}>{v}</span>}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
