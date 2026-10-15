import type { UnitStatus } from "@/types";

export interface ChessboardStatusStyle {
  label: string;
  bg: string;
  border: string;
  text: string;
}

export const CHESSBOARD_STATUS_STYLE: Record<UnitStatus, ChessboardStatusStyle> = {
  free: { label: "Свободно", bg: "var(--color-positive-100)", border: "var(--color-positive-600)", text: "var(--color-positive-700)" },
  reserved: { label: "Бронь", bg: "var(--color-warn-100)", border: "var(--color-warn-600)", text: "var(--color-warn-700)" },
  presale: { label: "Предпродажа", bg: "var(--color-info-100)", border: "var(--color-info-600)", text: "var(--color-info-700)" },
  installment: { label: "Рассрочка", bg: "var(--color-violet-100)", border: "var(--color-violet-600)", text: "var(--color-violet-700)" },
  mortgage: { label: "Ипотека", bg: "var(--color-cyan-100)", border: "var(--color-cyan-600)", text: "var(--color-cyan-700)" },
  sold: { label: "Продано", bg: "var(--color-brand-100)", border: "var(--color-brand-700)", text: "var(--color-brand-800)" },
  "handed-over": { label: "Передано", bg: "#eef7f1", border: "var(--color-positive-700)", text: "var(--color-positive-700)" },
  unavailable: { label: "Недоступно", bg: "var(--color-risk-100)", border: "var(--color-risk-600)", text: "var(--color-risk-700)" },
  service: { label: "Служебное", bg: "var(--color-surface-muted)", border: "var(--color-border-strong)", text: "var(--color-ink-500)" },
};
