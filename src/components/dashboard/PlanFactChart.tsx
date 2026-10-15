import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { StagePlanFact } from "@/data/selectors";
import { formatMoney } from "@/utils/formatters";

interface Props {
  data: StagePlanFact[];
  horizontal?: boolean;
}

export function PlanFactChart({ data, horizontal = false }: Props) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(280, data.length * 34)}>
      <BarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 4, right: 16, left: horizontal ? 8 : 0, bottom: 0 }}
        barGap={4}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" {...(horizontal ? { horizontal: false } : { vertical: false })} />
        {horizontal ? (
          <>
            <XAxis type="number" tickFormatter={(v) => formatMoney(v, "TJS", true)} tick={{ fontSize: 11, fill: "var(--color-ink-500)" }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12, fill: "var(--color-ink-700)" }} axisLine={false} tickLine={false} />
          </>
        ) : (
          <>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-ink-500)" }} axisLine={false} tickLine={false} interval={0} angle={-28} textAnchor="end" height={70} />
            <YAxis tickFormatter={(v) => formatMoney(v, "TJS", true)} tick={{ fontSize: 11, fill: "var(--color-ink-500)" }} axisLine={false} tickLine={false} width={68} />
          </>
        )}
        <Tooltip
          formatter={(value, name) => [formatMoney(Number(value), "TJS"), String(name)]}
          contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", fontSize: 12.5, boxShadow: "var(--shadow-panel)" }}
        />
        <Legend formatter={(v) => <span style={{ fontSize: 12.5, color: "var(--color-ink-700)" }}>{v}</span>} iconType="circle" iconSize={8} />
        <Bar dataKey="planned" name="План" fill="var(--color-brand-100)" stroke="var(--color-brand-600)" radius={[4, 4, 4, 4]} />
        <Bar dataKey="actual" name="Факт" fill="var(--color-info-600)" radius={[4, 4, 4, 4]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
