// ============================================================================
// Общие типы
// ============================================================================

export type Currency = "TJS" | "USD";

export type ID = string;

export interface Money {
  amount: number;
  currency: Currency;
}

// ============================================================================
// Проекты / ЖК
// ============================================================================

export type ProjectStatus = "planning" | "active" | "finishing" | "completed" | "suspended";

export interface Project {
  id: ID;
  name: string;
  address: string;
  status: ProjectStatus;
  budgetTotal: number;
  spentTotal: number;
  revenueTotal: number;
  completionPercent: number;
  buildingsCount: number;
  unitsTotal: number;
  unitsSold: number;
  unitsFree: number;
  startDate: string;
  plannedHandoverDate: string;
  coverColor: string;
  currency: Currency;
}

export interface Building {
  id: ID;
  projectId: ID;
  name: string;
  floorsCount: number;
  sectionsCount: number;
  unitsCount: number;
  completionPercent: number;
}

export interface Section {
  id: ID;
  buildingId: ID;
  name: string;
  floorsCount: number;
}

export interface Floor {
  id: ID;
  sectionId: ID;
  buildingId: ID;
  number: number;
}

// ============================================================================
// Этапы строительства
// ============================================================================

export type StageKey =
  | "site-prep"
  | "excavation"
  | "foundation"
  | "monolith"
  | "masonry"
  | "roofing"
  | "facade"
  | "windows"
  | "engineering"
  | "elevators"
  | "interior"
  | "landscaping"
  | "handover-docs";

export type StageStatus = "not-started" | "in-progress" | "delayed" | "completed" | "on-hold";

export interface ConstructionStage {
  id: ID;
  projectId: ID;
  buildingId?: ID;
  key: StageKey;
  name: string;
  order: number;
  budgetPlanned: number;
  spentActual: number;
  progressPercent: number;
  startDatePlanned: string;
  endDatePlanned: string;
  endDateActual?: string;
  status: StageStatus;
  responsible: string;
  contractors: string[];
}

// ============================================================================
// Поставщики
// ============================================================================

export type SupplierType = "factory" | "supplier" | "contractor" | "service";

export interface Supplier {
  id: ID;
  name: string;
  type: SupplierType;
  category: string;
  contactPerson: string;
  phone: string;
  address: string;
  currentDebt: number;
  totalPurchased: number;
  reliabilityRating: number; // 1-5
  avgDeliveryDelayDays: number;
  contractsCount: number;
  status: "active" | "inactive" | "blacklist";
}

// ============================================================================
// Закупки
// ============================================================================

export type PurchaseRequestStatus =
  | "draft"
  | "approval"
  | "approved"
  | "ordered"
  | "partial"
  | "closed"
  | "rejected";

export type Priority = "low" | "normal" | "high" | "urgent";

export interface PurchaseRequest {
  id: ID;
  number: string;
  date: string;
  initiator: string;
  projectId: ID;
  stageId?: ID;
  material: string;
  quantity: number;
  unit: string;
  desiredDate: string;
  priority: Priority;
  status: PurchaseRequestStatus;
  comment?: string;
}

export type PurchaseOrderStatus = "pending" | "in-transit" | "partial" | "delivered" | "cancelled";

export interface PurchaseOrder {
  id: ID;
  number: string;
  requestId?: ID;
  supplierId: ID;
  material: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalAmount: number;
  paidAmount: number;
  debtAmount: number;
  deliveryDate: string;
  status: PurchaseOrderStatus;
  contractId?: ID;
}

// ============================================================================
// Снабжение (pipeline)
// ============================================================================

export type SupplyStage =
  | "requested"
  | "approval"
  | "approved"
  | "ordered"
  | "in-transit"
  | "received-warehouse"
  | "issued-site"
  | "used"
  | "closed";

export interface SupplyCard {
  id: ID;
  material: string;
  quantity: number;
  unit: string;
  projectId: ID;
  stageId: ID;
  supplierId: ID;
  responsible: string;
  neededByDate: string;
  status: SupplyStage;
  amount: number;
  delayRisk: "none" | "low" | "medium" | "high";
}

// ============================================================================
// Склад
// ============================================================================

export interface InventoryItem {
  id: ID;
  material: string;
  category: string;
  unit: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  minStock: number;
  avgPrice: number;
  totalValue: number;
  warehouse: string;
  status: "ok" | "low" | "critical" | "excess";
}

export type MovementType = "in" | "out" | "transfer" | "writeoff" | "return" | "usage";

export interface InventoryMovement {
  id: ID;
  date: string;
  type: MovementType;
  material: string;
  quantity: number;
  unit: string;
  warehouse: string;
  projectId?: ID;
  stageId?: ID;
  responsible: string;
  comment?: string;
}

// ============================================================================
// Недвижимый фонд
// ============================================================================

export type UnitType =
  | "apartment"
  | "parking"
  | "storage"
  | "basement"
  | "commercial"
  | "office"
  | "technical";

export type UnitStatus =
  | "free"
  | "reserved"
  | "presale"
  | "installment"
  | "mortgage"
  | "sold"
  | "handed-over"
  | "unavailable"
  | "service";

export interface RealEstateUnit {
  id: ID;
  number: string;
  type: UnitType;
  projectId: ID;
  buildingId: ID;
  sectionId: ID;
  floor: number;
  area: number;
  rooms?: number;
  pricePerSqm: number;
  totalPrice: number;
  costPrice: number;
  margin: number;
  status: UnitStatus;
  clientId?: ID;
  contractId?: ID;
  comment?: string;
}

// ============================================================================
// Клиенты
// ============================================================================

export interface Client {
  id: ID;
  fullName: string;
  phone: string;
  passportMock: string;
  purchasedUnitIds: ID[];
  contractsAmount: number;
  paidAmount: number;
  remainingAmount: number;
  overdueAmount: number;
  comment?: string;
}

// ============================================================================
// Продажи / сделки
// ============================================================================

export type DealStatus = "reserved" | "presale" | "installment" | "mortgage" | "sold" | "cancelled";

export interface PaymentScheduleItem {
  id: ID;
  dueDate: string;
  amount: number;
  paid: boolean;
  paidDate?: string;
  paidAmount?: number;
}

export interface SaleDeal {
  id: ID;
  number: string;
  clientId: ID;
  unitId: ID;
  projectId: ID;
  dealDate: string;
  price: number;
  discount: number;
  finalPrice: number;
  paidAmount: number;
  remainingAmount: number;
  status: DealStatus;
  manager: string;
  contractId?: ID;
  schedule: PaymentScheduleItem[];
}

// ============================================================================
// Финансы
// ============================================================================

export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "concrete"
  | "rebar"
  | "cement"
  | "brick"
  | "salary"
  | "machinery"
  | "contractors"
  | "documents"
  | "sales-income"
  | "other";

export type PaymentMethod = "bank" | "cash" | "card" | "transfer";

export type TransactionStatus = "planned" | "completed" | "cancelled";

export interface FinancialTransaction {
  id: ID;
  date: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  category: TransactionCategory;
  projectId: ID;
  stageId?: ID;
  counterpartyId?: ID;
  counterpartyName: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  documentNumber?: string;
  responsible: string;
}

export type DebtStatus = "ok" | "due-soon" | "overdue" | "disputed";

export interface Debt {
  id: ID;
  supplierId: ID;
  materialCategory: string;
  amount: number;
  dueDate: string;
  overdueDays: number;
  lastPaymentDate?: string;
  contractId?: ID;
  status: DebtStatus;
}

// ============================================================================
// Договоры и документы
// ============================================================================

export type DocumentType =
  | "sale-contract"
  | "installment-contract"
  | "reservation-contract"
  | "supply-contract"
  | "works-contract"
  | "work-act"
  | "handover-act"
  | "invoice"
  | "waybill"
  | "payment-order"
  | "material-cert"
  | "as-built-docs"
  | "permits"
  | "project-docs";

export type DocumentStatus = "draft" | "approval" | "signed" | "paid" | "closed" | "archived";

export interface AppDocument {
  id: ID;
  number: string;
  type: DocumentType;
  relatedUnitId?: ID;
  relatedProjectId?: ID;
  counterpartyName: string;
  amount?: number;
  date: string;
  status: DocumentStatus;
  fileName: string;
  responsible: string;
}

// ============================================================================
// Акты
// ============================================================================

export type WorkActStatus = "created" | "review" | "signed" | "partial-paid" | "paid" | "rejected";

export interface WorkAct {
  id: ID;
  number: string;
  contractorId: ID;
  projectId: ID;
  stageId: ID;
  workType: string;
  amount: number;
  date: string;
  status: WorkActStatus;
  paidAmount: number;
  remainingAmount: number;
  fileName: string;
  responsible: string;
}

// ============================================================================
// Сотрудники и роли
// ============================================================================

export type RoleKey =
  | "owner"
  | "ceo"
  | "cfo"
  | "accountant"
  | "procurement"
  | "warehouse"
  | "pm"
  | "engineer"
  | "foreman"
  | "lawyer"
  | "sales"
  | "viewer";

export interface Role {
  key: RoleKey;
  name: string;
  description: string;
}

export type PermissionSection =
  | "finance"
  | "procurement"
  | "warehouse"
  | "suppliers"
  | "realestate"
  | "sales"
  | "clients"
  | "contracts"
  | "acts"
  | "reports"
  | "settings";

export type PermissionAction = "view" | "create" | "edit" | "delete" | "approve" | "export";

export interface Permission {
  section: PermissionSection;
  actions: Record<PermissionAction, boolean>;
}

export interface User {
  id: ID;
  fullName: string;
  email: string;
  phone: string;
  role: RoleKey;
  avatarColor: string;
  status: "active" | "invited" | "disabled";
  lastActive: string;
}

// ============================================================================
// UI helpers
// ============================================================================

export interface KPI {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  tone?: "default" | "positive" | "risk" | "warn" | "info";
  hint?: string;
}
