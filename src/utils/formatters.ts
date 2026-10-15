import type {
  Currency,
  ProjectStatus,
  StageStatus,
  SupplierType,
  PurchaseRequestStatus,
  PurchaseOrderStatus,
  SupplyStage,
  UnitStatus,
  UnitType,
  DealStatus,
  DebtStatus,
  DocumentStatus,
  DocumentType,
  WorkActStatus,
  TransactionCategory,
  MovementType,
  Priority,
} from "@/types";

export function formatMoney(amount: number, currency: Currency = "TJS", compact = false): string {
  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(amount);
  if (compact && abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toLocaleString("ru-RU", { maximumFractionDigits: 1 })} млн ${symbol(currency)}`;
  }
  if (compact && abs >= 1_000) {
    return `${sign}${(abs / 1_000).toLocaleString("ru-RU", { maximumFractionDigits: 0 })} тыс ${symbol(currency)}`;
  }
  return `${sign}${abs.toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ${symbol(currency)}`;
}

function symbol(currency: Currency): string {
  return currency === "USD" ? "$" : "смн";
}

export function formatNumber(n: number, fractionDigits = 0): string {
  return n.toLocaleString("ru-RU", { maximumFractionDigits: fractionDigits, minimumFractionDigits: fractionDigits });
}

export function formatPercent(n: number): string {
  return `${n.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
}

export function daysBetween(a: string, b: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

// ---------------------------------------------------------------------------
// Status labels + tone mapping (tone drives StatusBadge color)
// ---------------------------------------------------------------------------

export type Tone = "default" | "positive" | "risk" | "warn" | "info" | "muted";

interface StatusMeta {
  label: string;
  tone: Tone;
}

export const projectStatusMeta: Record<ProjectStatus, StatusMeta> = {
  planning: { label: "Планирование", tone: "info" },
  active: { label: "В строительстве", tone: "warn" },
  finishing: { label: "Отделка", tone: "info" },
  completed: { label: "Завершён", tone: "positive" },
  suspended: { label: "Приостановлен", tone: "risk" },
};

export const stageStatusMeta: Record<StageStatus, StatusMeta> = {
  "not-started": { label: "Не начат", tone: "muted" },
  "in-progress": { label: "В работе", tone: "info" },
  delayed: { label: "Задержка", tone: "risk" },
  completed: { label: "Завершён", tone: "positive" },
  "on-hold": { label: "Приостановлен", tone: "warn" },
};

export const supplierTypeMeta: Record<SupplierType, string> = {
  factory: "Завод",
  supplier: "Поставщик",
  contractor: "Подрядчик",
  service: "Услуга",
};

export const purchaseRequestStatusMeta: Record<PurchaseRequestStatus, StatusMeta> = {
  draft: { label: "Черновик", tone: "muted" },
  approval: { label: "На согласовании", tone: "warn" },
  approved: { label: "Одобрено", tone: "info" },
  ordered: { label: "Заказано", tone: "info" },
  partial: { label: "Частично получено", tone: "warn" },
  closed: { label: "Закрыто", tone: "positive" },
  rejected: { label: "Отклонено", tone: "risk" },
};

export const purchaseOrderStatusMeta: Record<PurchaseOrderStatus, StatusMeta> = {
  pending: { label: "Ожидание", tone: "muted" },
  "in-transit": { label: "В пути", tone: "info" },
  partial: { label: "Частично доставлено", tone: "warn" },
  delivered: { label: "Доставлено", tone: "positive" },
  cancelled: { label: "Отменено", tone: "risk" },
};

export const supplyStageMeta: Record<SupplyStage, string> = {
  requested: "Заявка создана",
  approval: "На согласовании",
  approved: "Одобрено",
  ordered: "Заказано",
  "in-transit": "В пути",
  "received-warehouse": "Получено на склад",
  "issued-site": "Выдано на объект",
  used: "Использовано",
  closed: "Закрыто",
};

export const unitTypeMeta: Record<UnitType, string> = {
  apartment: "Квартира",
  parking: "Парковка",
  storage: "Кладовка",
  basement: "Подвал",
  commercial: "Коммерческое",
  office: "Офис",
  technical: "Техническое",
};

export const unitStatusMeta: Record<UnitStatus, StatusMeta> = {
  free: { label: "Свободно", tone: "positive" },
  reserved: { label: "Бронь", tone: "warn" },
  presale: { label: "Предпродажа", tone: "info" },
  installment: { label: "Рассрочка", tone: "info" },
  mortgage: { label: "Ипотека", tone: "info" },
  sold: { label: "Продано", tone: "muted" },
  "handed-over": { label: "Передано", tone: "positive" },
  unavailable: { label: "Недоступно", tone: "risk" },
  service: { label: "Служебное", tone: "muted" },
};

export const dealStatusMeta: Record<DealStatus, StatusMeta> = {
  reserved: { label: "Бронь", tone: "warn" },
  presale: { label: "Предпродажа", tone: "info" },
  installment: { label: "Рассрочка", tone: "info" },
  mortgage: { label: "Ипотека", tone: "info" },
  sold: { label: "Продано", tone: "positive" },
  cancelled: { label: "Отменено", tone: "risk" },
};

export const debtStatusMeta: Record<DebtStatus, StatusMeta> = {
  ok: { label: "Нормально", tone: "positive" },
  "due-soon": { label: "Скоро оплатить", tone: "warn" },
  overdue: { label: "Просрочено", tone: "risk" },
  disputed: { label: "Спорный долг", tone: "muted" },
};

export const documentTypeMeta: Record<DocumentType, string> = {
  "sale-contract": "Договор купли-продажи",
  "installment-contract": "Договор рассрочки",
  "reservation-contract": "Договор бронирования",
  "supply-contract": "Договор поставки",
  "works-contract": "Договор подряда",
  "work-act": "Акт выполненных работ",
  "handover-act": "Акт приёма-передачи",
  invoice: "Счёт",
  waybill: "Накладная",
  "payment-order": "Платёжное поручение",
  "material-cert": "Сертификат материала",
  "as-built-docs": "Исполнительная документация",
  permits: "Разрешения",
  "project-docs": "Проектная документация",
};

export const documentStatusMeta: Record<DocumentStatus, StatusMeta> = {
  draft: { label: "Черновик", tone: "muted" },
  approval: { label: "На согласовании", tone: "warn" },
  signed: { label: "Подписан", tone: "info" },
  paid: { label: "Оплачен", tone: "positive" },
  closed: { label: "Закрыт", tone: "muted" },
  archived: { label: "Архив", tone: "muted" },
};

export const workActStatusMeta: Record<WorkActStatus, StatusMeta> = {
  created: { label: "Создан", tone: "muted" },
  review: { label: "На проверке", tone: "warn" },
  signed: { label: "Подписан", tone: "info" },
  "partial-paid": { label: "Частично оплачен", tone: "warn" },
  paid: { label: "Оплачен", tone: "positive" },
  rejected: { label: "Отклонён", tone: "risk" },
};

export const transactionCategoryMeta: Record<TransactionCategory, string> = {
  concrete: "Бетон",
  rebar: "Арматура",
  cement: "Цемент",
  brick: "Кирпич",
  salary: "Зарплата",
  machinery: "Техника",
  contractors: "Подрядчики",
  documents: "Документы",
  "sales-income": "Поступления от продаж",
  other: "Прочее",
};

export const movementTypeMeta: Record<MovementType, string> = {
  in: "Приход",
  out: "Расход",
  transfer: "Перемещение",
  writeoff: "Списание",
  return: "Возврат",
  usage: "Использование на этапе",
};

export const priorityMeta: Record<Priority, StatusMeta> = {
  low: { label: "Низкий", tone: "muted" },
  normal: { label: "Обычный", tone: "info" },
  high: { label: "Высокий", tone: "warn" },
  urgent: { label: "Срочно", tone: "risk" },
};

export function stageInventoryStatusMeta(status: "ok" | "low" | "critical" | "excess"): StatusMeta {
  const map: Record<string, StatusMeta> = {
    ok: { label: "Норма", tone: "positive" },
    low: { label: "Низкий остаток", tone: "warn" },
    critical: { label: "Критично", tone: "risk" },
    excess: { label: "Избыток", tone: "info" },
  };
  return map[status];
}
