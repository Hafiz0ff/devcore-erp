import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { UnitTypeSales } from "@/data/selectors";

interface Props {
  data: UnitTypeSales[];
}

export function SalesByTypeChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--color-ink-500)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "var(--color-ink-500)" }} axisLine={false} tickLine={false} width={28} />
        <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", fontSize: 12.5, boxShadow: "var(--shadow-panel)" }} />
        <Legend formatter={(v) => <span style={{ fontSize: 12.5, color: "var(--color-ink-700)" }}>{v}</span>} iconType="circle" iconSize={8} />
        <Bar dataKey="sold" name="Продано / в сделке" stackId="a" fill="var(--color-brand-800)" radius={[0, 0, 0, 0]} />
        <Bar dataKey="free" name="Свободно" stackId="a" fill="var(--color-positive-100)" stroke="var(--color-positive-600)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
