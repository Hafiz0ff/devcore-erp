import type {
  Project,
  Building,
  Section,
  Floor,
  ConstructionStage,
  StageKey,
  Supplier,
  RealEstateUnit,
  UnitType,
  UnitStatus,
  InventoryItem,
  InventoryMovement,
  PurchaseRequest,
  PurchaseOrder,
  SupplyCard,
  SupplyStage,
  Client,
  SaleDeal,
  DealStatus,
  PaymentScheduleItem,
  FinancialTransaction,
  TransactionCategory,
  Debt,
  AppDocument,
  DocumentType,
  WorkAct,
  User,
  Role,
  RoleKey,
  Permission,
  PermissionSection,
  PermissionAction,
} from "@/types";
import { mulberry32, randInt, randFloat, pick, pickWeighted, addDays, pad, type RNG } from "./rng";

const rng: RNG = mulberry32(20260701);

// ============================================================================
// Справочники
// ============================================================================

export const STAGE_DEFS: { key: StageKey; name: string }[] = [
  { key: "site-prep", name: "Подготовка участка" },
  { key: "excavation", name: "Котлован" },
  { key: "foundation", name: "Фундамент" },
  { key: "monolith", name: "Монолит / каркас" },
  { key: "masonry", name: "Кладка" },
  { key: "roofing", name: "Кровля" },
  { key: "facade", name: "Фасад" },
  { key: "windows", name: "Окна" },
  { key: "engineering", name: "Инженерные сети" },
  { key: "elevators", name: "Лифты" },
  { key: "interior", name: "Отделка общих зон" },
  { key: "landscaping", name: "Благоустройство" },
  { key: "handover-docs", name: "Документы и сдача объекта" },
];

export const MATERIALS: { name: string; category: string; unit: string; basePrice: number }[] = [
  { name: "Цемент М500", category: "Цемент", unit: "т", basePrice: 980 },
  { name: "Арматура 12 мм", category: "Арматура", unit: "т", basePrice: 9200 },
  { name: "Арматура 16 мм", category: "Арматура", unit: "т", basePrice: 9600 },
  { name: "Кирпич рядовой", category: "Кирпич", unit: "тыс.шт", basePrice: 1450 },
  { name: "Бетон М350", category: "Бетон", unit: "м³", basePrice: 640 },
  { name: "Песок речной", category: "Инертные", unit: "м³", basePrice: 180 },
  { name: "Щебень фракционный", category: "Инертные", unit: "м³", basePrice: 220 },
  { name: "Газоблок", category: "Блоки", unit: "м³", basePrice: 560 },
  { name: "Трубы ПВХ", category: "Инженерия", unit: "м", basePrice: 42 },
  { name: "Кабель ВВГ", category: "Инженерия", unit: "м", basePrice: 38 },
  { name: "Окна ПВХ", category: "Окна и двери", unit: "шт", basePrice: 2350 },
  { name: "Двери входные", category: "Окна и двери", unit: "шт", basePrice: 1800 },
  { name: "Плитка керамическая", category: "Отделка", unit: "м²", basePrice: 145 },
  { name: "Лифтовое оборудование", category: "Оборудование", unit: "компл", basePrice: 185000 },
];

export const SUPPLIERS: Supplier[] = [
  mkSupplier("sup-1", 'Завод цемента "Худжанд Цемент"', "factory", "Цемент", "Фаррух Назаров", "+992 92 700 11 22", "Худжанд, Промзона-3", 4, 3),
  mkSupplier("sup-2", 'Кирпичный завод "Сомон Блок"', "factory", "Кирпич / Блоки", "Далер Каримов", "+992 93 555 44 10", "Турсунзаде, ул. Индустриальная 7", 4, 5),
  mkSupplier("sup-3", '"МеталлПром Таджикистан"', "supplier", "Арматура", "Рустам Абдуллоев", "+992 98 111 22 33", "Душанбе, ул. Айни 245", 3, 8),
  mkSupplier("sup-4", '"Бетон Сервис"', "supplier", "Бетон / Инертные", "Шариф Юсупов", "+992 90 234 56 78", "Душанбе, промзона Шохмансур", 5, 1),
  mkSupplier("sup-5", '"Азия Лифт"', "supplier", "Оборудование", "Тимур Расулов", "+992 91 777 88 99", "Душанбе, ул. Бохтар 12", 4, 12),
  mkSupplier("sup-6", '"СтройТехника"', "service", "Аренда техники", "Джамшед Олимов", "+992 93 400 20 10", "Душанбе, ул. Дружбы Народов 88", 3, 2),
  mkSupplier("sup-7", '"ОкноПласт Душанбе"', "supplier", "Окна и двери", "Азиз Раджабов", "+992 98 909 09 09", "Душанбе, ул. Пушкина 34", 4, 4),
  mkSupplier("sup-8", '"ЭлектроСетьСнаб"', "supplier", "Инженерия", "Ниёз Комилов", "+992 92 303 03 03", "Душанбе, ул. Сино 101", 3, 6),
];

function mkSupplier(
  id: string,
  name: string,
  type: Supplier["type"],
  category: string,
  contact: string,
  phone: string,
  address: string,
  rating: number,
  delay: number
): Supplier {
  return {
    id,
    name,
    type,
    category,
    contactPerson: contact,
    phone,
    address,
    currentDebt: 0,
    totalPurchased: 0,
    reliabilityRating: rating,
    avgDeliveryDelayDays: delay,
    contractsCount: randInt(rng, 1, 6),
    status: "active",
  };
}

// ============================================================================
// Проекты, корпуса, секции, этажи
// ============================================================================

export const projects: Project[] = [
  {
    id: "p1",
    name: 'ЖК "Сомон Резиденс"',
    address: "г. Душанбе, район Сино, ул. Айни 118",
    status: "active",
    budgetTotal: 68_500_000,
    spentTotal: 41_200_000,
    revenueTotal: 38_900_000,
    completionPercent: 58,
    buildingsCount: 2,
    unitsTotal: 0,
    unitsSold: 0,
    unitsFree: 0,
    startDate: "2024-03-01",
    plannedHandoverDate: "2026-12-01",
    coverColor: "#1D5FA8",
    currency: "TJS",
  },
  {
    id: "p2",
    name: 'ЖК "Навруз Парк"',
    address: "г. Душанбе, район Фирдавси, проспект Сомони 214",
    status: "active",
    budgetTotal: 92_000_000,
    spentTotal: 33_600_000,
    revenueTotal: 27_400_000,
    completionPercent: 34,
    buildingsCount: 3,
    unitsTotal: 0,
    unitsSold: 0,
    unitsFree: 0,
    startDate: "2025-01-15",
    plannedHandoverDate: "2027-09-01",
    coverColor: "#12805C",
    currency: "TJS",
  },
  {
    id: "p3",
    name: 'ЖК "Истиклол Тауэр"',
    address: "г. Душанбе, район Шохмансур, ул. Бохтар 45",
    status: "finishing",
    budgetTotal: 54_300_000,
    spentTotal: 49_100_000,
    revenueTotal: 51_800_000,
    completionPercent: 87,
    buildingsCount: 1,
    unitsTotal: 0,
    unitsSold: 0,
    unitsFree: 0,
    startDate: "2023-05-10",
    plannedHandoverDate: "2026-08-01",
    coverColor: "#B8871F",
    currency: "TJS",
  },
];

export const buildings: Building[] = [];
export const sections: Section[] = [];
export const floors: Floor[] = [];
export const units: RealEstateUnit[] = [];

const BUILDING_LETTERS = ["A", "B", "C"];

const UNIT_TYPE_WEIGHTS: [UnitType, number][] = [
  ["apartment", 72],
  ["parking", 12],
  ["storage", 9],
  ["commercial", 4],
  ["basement", 2],
  ["office", 1],
];

const UNIT_STATUS_WEIGHTS_BY_PROJECT_STATUS: Record<string, [UnitStatus, number][]> = {
  active: [
    ["free", 34],
    ["reserved", 12],
    ["presale", 16],
    ["installment", 14],
    ["mortgage", 8],
    ["sold", 14],
    ["unavailable", 2],
  ],
  finishing: [
    ["free", 8],
    ["reserved", 6],
    ["presale", 6],
    ["installment", 16],
    ["mortgage", 12],
    ["sold", 38],
    ["handed-over", 12],
    ["unavailable", 2],
  ],
};

for (const project of projects) {
  const buildingCount = project.buildingsCount;
  for (let bi = 0; bi < buildingCount; bi++) {
    const buildingId = `b-${project.id}-${bi + 1}`;
    const floorsCount = project.id === "p3" ? 16 : randInt(rng, 9, 14);
    const sectionCount = floorsCount > 12 ? 2 : 1;
    buildings.push({
      id: buildingId,
      projectId: project.id,
      name: `Корпус ${BUILDING_LETTERS[bi]}`,
      floorsCount,
      sectionsCount: sectionCount,
      unitsCount: 0,
      completionPercent: Math.max(10, project.completionPercent + randInt(rng, -8, 8)),
    });

    for (let si = 0; si < sectionCount; si++) {
      const sectionId = `s-${buildingId}-${si + 1}`;
      sections.push({ id: sectionId, buildingId, name: `Секция ${si + 1}`, floorsCount });

      for (let fl = 1; fl <= floorsCount; fl++) {
        const floorId = `f-${sectionId}-${fl}`;
        floors.push({ id: floorId, sectionId, buildingId, number: fl });

        const isGroundFloor = fl === 1;
        const unitsOnFloor = isGroundFloor ? randInt(rng, 3, 5) : randInt(rng, 4, 6);

        for (let ui = 1; ui <= unitsOnFloor; ui++) {
          const type: UnitType = isGroundFloor && ui <= 2
            ? pick(rng, ["commercial", "office"] as UnitType[])
            : fl === 1 && ui > unitsOnFloor - 1
              ? "basement"
              : pickWeighted(rng, UNIT_TYPE_WEIGHTS);

          const statusWeights =
            UNIT_STATUS_WEIGHTS_BY_PROJECT_STATUS[project.status] ??
            UNIT_STATUS_WEIGHTS_BY_PROJECT_STATUS.active;
          const status = pickWeighted(rng, statusWeights);

          const area = areaForType(type, rng);
          const pricePerSqm = pricePerSqmFor(project.id, type, rng);
          const totalPrice = Math.round(area * pricePerSqm);
          const costPrice = Math.round(totalPrice * randFloat(rng, 0.58, 0.72, 2));
          const margin = totalPrice - costPrice;

          units.push({
            id: `u-${floorId}-${ui}`,
            number: `${BUILDING_LETTERS[bi]}-${pad(fl, 2)}${pad(ui, 2)}`,
            type,
            projectId: project.id,
            buildingId,
            sectionId,
            floor: fl,
            area,
            rooms: type === "apartment" ? roomsForArea(area) : undefined,
            pricePerSqm,
            totalPrice,
            costPrice,
            margin,
            status,
            comment: undefined,
          });
        }
      }
    }
  }

  const projectUnits = units.filter((u) => u.projectId === project.id);
  project.unitsTotal = projectUnits.length;
  project.unitsSold = projectUnits.filter((u) =>
    ["sold", "handed-over", "installment", "mortgage"].includes(u.status)
  ).length;
  project.unitsFree = projectUnits.filter((u) => u.status === "free").length;
}

for (const b of buildings) {
  b.unitsCount = units.filter((u) => u.buildingId === b.id).length;
}

function areaForType(type: UnitType, rng: RNG): number {
  switch (type) {
    case "apartment":
      return randFloat(rng, 38, 142, 1);
    case "parking":
      return randFloat(rng, 14, 18, 1);
    case "storage":
      return randFloat(rng, 3, 9, 1);
    case "basement":
      return randFloat(rng, 20, 60, 1);
    case "commercial":
      return randFloat(rng, 45, 180, 1);
    case "office":
      return randFloat(rng, 30, 90, 1);
    default:
      return randFloat(rng, 10, 30, 1);
  }
}

function roomsForArea(area: number): number {
  if (area < 45) return 1;
  if (area < 65) return 2;
  if (area < 95) return 3;
  return 4;
}

function pricePerSqmFor(projectId: string, type: UnitType, rng: RNG): number {
  const base = projectId === "p3" ? 11800 : projectId === "p1" ? 9600 : 8400;
  const typeMultiplier: Record<UnitType, number> = {
    apartment: 1,
    commercial: 1.35,
    office: 1.2,
    parking: 0.32,
    storage: 0.48,
    basement: 0.4,
    technical: 0.25,
  };
  return Math.round(base * typeMultiplier[type] * randFloat(rng, 0.94, 1.08, 3));
}

// ============================================================================
// Этапы строительства
// ============================================================================

export const stages: ConstructionStage[] = [];

const RESPONSIBLES = ["Фаридун Ахмедов", "Шоҳрух Валиев", "Ориёна Собирова", "Далер Юнусов"];

for (const project of projects) {
  const progressCeiling = project.completionPercent;
  STAGE_DEFS.forEach((def, idx) => {
    const stageShareOfBudget = stageShare(def.key);
    const budgetPlanned = Math.round(project.budgetTotal * stageShareOfBudget);
    const stageProgressTarget = Math.max(0, Math.min(100, progressCeiling * 1.15 - idx * 9));
    const progressPercent = Math.max(0, Math.min(100, Math.round(stageProgressTarget + randInt(rng, -6, 6))));
    const overrun = progressPercent > 55 ? randFloat(rng, -0.04, 0.14, 3) : randFloat(rng, -0.08, 0.05, 3);
    const spentActual = Math.round(budgetPlanned * (progressPercent / 100) * (1 + overrun));

    let status: ConstructionStage["status"] = "not-started";
    if (progressPercent >= 100) status = "completed";
    else if (progressPercent > 0 && overrun > 0.08) status = "delayed";
    else if (progressPercent > 0) status = "in-progress";
    if (progressPercent === 0 && idx < 2 && project.status !== "planning") status = "in-progress";

    const startPlanned = addDays(project.startDate, idx * 55);
    const endPlanned = addDays(startPlanned, 60);

    stages.push({
      id: `st-${project.id}-${def.key}`,
      projectId: project.id,
      key: def.key,
      name: def.name,
      order: idx + 1,
      budgetPlanned,
      spentActual,
      progressPercent,
      startDatePlanned: startPlanned,
      endDatePlanned: endPlanned,
      endDateActual: status === "completed" ? addDays(endPlanned, randInt(rng, -5, 12)) : undefined,
      status,
      responsible: pick(rng, RESPONSIBLES),
      contractors: [pick(rng, SUPPLIERS).name, pick(rng, SUPPLIERS).name],
    });
  });
}

function stageShare(key: StageKey): number {
  const shares: Record<StageKey, number> = {
    "site-prep": 0.02,
    excavation: 0.05,
    foundation: 0.11,
    monolith: 0.22,
    masonry: 0.13,
    roofing: 0.05,
    facade: 0.12,
    windows: 0.06,
    engineering: 0.1,
    elevators: 0.05,
    interior: 0.05,
    landscaping: 0.02,
    "handover-docs": 0.02,
  };
  return shares[key];
}

// ============================================================================
// Склад
// ============================================================================

export const inventoryItems: InventoryItem[] = [];
const WAREHOUSES = ['Центральный склад', 'Склад "Сомон Резиденс"', 'Склад "Навруз Парк"', 'Склад "Истиклол Тауэр"'];

for (const wh of WAREHOUSES) {
  for (const mat of MATERIALS) {
    if (rng() < 0.15) continue; // не на каждом складе есть все материалы
    const onHand = randFloat(rng, 5, 800, 1);
    const reserved = randFloat(rng, 0, onHand * 0.4, 1);
    const min = randFloat(rng, 10, 120, 1);
    const avgPrice = Math.round(mat.basePrice * randFloat(rng, 0.95, 1.12, 3));
    const available = Math.round((onHand - reserved) * 10) / 10;
    let status: InventoryItem["status"] = "ok";
    if (available < min * 0.4) status = "critical";
    else if (available < min) status = "low";
    else if (onHand > min * 6) status = "excess";

    inventoryItems.push({
      id: `inv-${wh}-${mat.name}`.replace(/\s+/g, "-"),
      material: mat.name,
      category: mat.category,
      unit: mat.unit,
      quantityOnHand: onHand,
      quantityReserved: reserved,
      quantityAvailable: available,
      minStock: min,
      avgPrice,
      totalValue: Math.round(onHand * avgPrice),
      warehouse: wh,
      status,
    });
  }
}

export const inventoryMovements: InventoryMovement[] = [];
const MOVEMENT_TYPES: InventoryMovement["type"][] = ["in", "out", "transfer", "writeoff", "return", "usage"];
for (let i = 0; i < 46; i++) {
  const mat = pick(rng, MATERIALS);
  const type = pick(rng, MOVEMENT_TYPES);
  const project = pick(rng, projects);
  const stage = pick(rng, stages.filter((s) => s.projectId === project.id));
  inventoryMovements.push({
    id: `mv-${i + 1}`,
    date: addDays("2026-01-05", randInt(rng, 0, 175)),
    type,
    material: mat.name,
    quantity: randFloat(rng, 1, 60, 1),
    unit: mat.unit,
    warehouse: pick(rng, WAREHOUSES),
    projectId: type === "usage" || type === "out" ? project.id : undefined,
    stageId: type === "usage" ? stage?.id : undefined,
    responsible: pick(rng, RESPONSIBLES),
    comment: type === "writeoff" ? "Порча при хранении" : undefined,
  });
}
inventoryMovements.sort((a, b) => (a.date < b.date ? 1 : -1));

// ============================================================================
// Закупки
// ============================================================================

export const purchaseRequests: PurchaseRequest[] = [];
const PR_STATUSES: PurchaseRequest["status"][] = [
  "draft",
  "approval",
  "approved",
  "ordered",
  "partial",
  "closed",
  "rejected",
];
const INITIATORS = ["Далер Юнусов", "Ориёна Собирова", "Мунира Гафурова", "Шоҳрух Валиев"];

for (let i = 0; i < 22; i++) {
  const mat = pick(rng, MATERIALS);
  const project = pick(rng, projects);
  const stage = pick(rng, stages.filter((s) => s.projectId === project.id));
  const date = addDays("2026-01-10", randInt(rng, 0, 170));
  purchaseRequests.push({
    id: `preq-${i + 1}`,
    number: `PR-${pad(i + 1, 5)}`,
    date,
    initiator: pick(rng, INITIATORS),
    projectId: project.id,
    stageId: stage?.id,
    material: mat.name,
    quantity: randFloat(rng, 5, 120, 1),
    unit: mat.unit,
    desiredDate: addDays(date, randInt(rng, 5, 25)),
    priority: pick(rng, ["low", "normal", "high", "urgent"]),
    status: pick(rng, PR_STATUSES),
    comment: rng() < 0.3 ? "Срочно для соблюдения графика этапа" : undefined,
  });
}

export const purchaseOrders: PurchaseOrder[] = [];
for (let i = 0; i < 20; i++) {
  const mat = pick(rng, MATERIALS);
  const supplier = pick(rng, SUPPLIERS.filter((s) => s.category.toLowerCase().includes(mat.category.toLowerCase().split(" ")[0].toLowerCase()) || rng() < 0.35));
  const quantity = randFloat(rng, 8, 150, 1);
  const pricePerUnit = Math.round(mat.basePrice * randFloat(rng, 0.96, 1.15, 3));
  const totalAmount = Math.round(quantity * pricePerUnit);
  const paidAmount = Math.round(totalAmount * randFloat(rng, 0, 1, 2));
  purchaseOrders.push({
    id: `po-${i + 1}`,
    number: `PO-${pad(i + 1, 5)}`,
    supplierId: supplier.id,
    material: mat.name,
    quantity,
    unit: mat.unit,
    pricePerUnit,
    totalAmount,
    paidAmount,
    debtAmount: totalAmount - paidAmount,
    deliveryDate: addDays("2026-01-15", randInt(rng, 0, 165)),
    status: pick(rng, ["pending", "in-transit", "partial", "delivered", "cancelled"]),
  });
}

// накопим статистику поставщика на основе заказов
for (const supplier of SUPPLIERS) {
  const orders = purchaseOrders.filter((o) => o.supplierId === supplier.id);
  supplier.totalPurchased = orders.reduce((s, o) => s + o.totalAmount, 0);
  supplier.currentDebt = orders.reduce((s, o) => s + o.debtAmount, 0);
}

export const supplyCards: SupplyCard[] = [];
const SUPPLY_STAGES: SupplyStage[] = [
  "requested",
  "approval",
  "approved",
  "ordered",
  "in-transit",
  "received-warehouse",
  "issued-site",
  "used",
  "closed",
];
for (let i = 0; i < 24; i++) {
  const mat = pick(rng, MATERIALS);
  const project = pick(rng, projects);
  const stage = pick(rng, stages.filter((s) => s.projectId === project.id));
  const quantity = randFloat(rng, 5, 90, 1);
  const price = Math.round(mat.basePrice * randFloat(rng, 0.95, 1.1, 2));
  supplyCards.push({
    id: `sc-${i + 1}`,
    material: mat.name,
    quantity,
    unit: mat.unit,
    projectId: project.id,
    stageId: stage.id,
    supplierId: pick(rng, SUPPLIERS).id,
    responsible: pick(rng, INITIATORS),
    neededByDate: addDays("2026-02-01", randInt(rng, -20, 90)),
    status: pick(rng, SUPPLY_STAGES),
    amount: Math.round(quantity * price),
    delayRisk: pick(rng, ["none", "none", "low", "medium", "high"]),
  });
}

// ============================================================================
// Клиенты, сделки
// ============================================================================

const FIRST_NAMES_M = ["Фаррух", "Далер", "Шариф", "Рустам", "Тимур", "Азиз", "Ниёз", "Джамшед", "Умед", "Сухроб", "Бахтиёр", "Хуршед"];
const FIRST_NAMES_F = ["Мадина", "Зарина", "Гулнора", "Шахноза", "Фарзона", "Наргис", "Мунира", "Ориёна", "Дилноза", "Парвина"];
const LAST_NAMES = ["Каримов", "Назаров", "Юсупов", "Раджабов", "Абдуллоев", "Расулов", "Олимов", "Комилов", "Хакимов", "Сафаров", "Мирзоев", "Гафуров"];

export const clients: Client[] = [];
for (let i = 0; i < 16; i++) {
  const male = rng() < 0.6;
  const first = pick(rng, male ? FIRST_NAMES_M : FIRST_NAMES_F);
  const last = pick(rng, LAST_NAMES) + (male ? "" : "а");
  clients.push({
    id: `cl-${i + 1}`,
    fullName: `${last} ${first}`,
    phone: `+992 9${randInt(rng, 0, 9)} ${randInt(rng, 100, 999)} ${randInt(rng, 10, 99)} ${randInt(rng, 10, 99)}`,
    passportMock: `A ${randInt(rng, 1000000, 9999999)}`,
    purchasedUnitIds: [],
    contractsAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    overdueAmount: 0,
  });
}

export const saleDeals: SaleDeal[] = [];
const dealEligibleUnits = units.filter((u) =>
  ["reserved", "presale", "installment", "mortgage", "sold", "handed-over"].includes(u.status)
);

let dealCounter = 1;
for (const unit of dealEligibleUnits) {
  const client = pick(rng, clients);
  const dealDate = addDays("2025-02-01", randInt(rng, 0, 500));
  const discount = rng() < 0.25 ? Math.round(unit.totalPrice * randFloat(rng, 0.01, 0.05, 3)) : 0;
  const finalPrice = unit.totalPrice - discount;

  const statusMap: Record<string, DealStatus> = {
    reserved: "reserved",
    presale: "presale",
    installment: "installment",
    mortgage: "mortgage",
    sold: "sold",
    "handed-over": "sold",
  };
  const status = statusMap[unit.status];

  const isInstallment = status === "installment";
  const schedule: PaymentScheduleItem[] = [];
  let paidAmount = 0;

  if (isInstallment) {
    const months = pick(rng, [12, 18, 24, 36]);
    const monthly = Math.round(finalPrice / months);
    let remaining = finalPrice;
    for (let m = 0; m < months; m++) {
      const due = addDays(dealDate, 30 * (m + 1));
      const paid = m < months * randFloat(rng, 0.2, 0.7, 2);
      const amount = m === months - 1 ? remaining : monthly;
      remaining -= amount;
      schedule.push({
        id: `sch-${unit.id}-${m}`,
        dueDate: due,
        amount,
        paid,
        paidDate: paid ? due : undefined,
        paidAmount: paid ? amount : undefined,
      });
      if (paid) paidAmount += amount;
    }
  } else if (status === "sold") {
    paidAmount = finalPrice;
  } else if (status === "mortgage") {
    paidAmount = Math.round(finalPrice * randFloat(rng, 0.15, 0.35, 2));
  } else if (status === "presale") {
    paidAmount = Math.round(finalPrice * randFloat(rng, 0.1, 0.3, 2));
  } else {
    paidAmount = Math.round(finalPrice * randFloat(rng, 0.05, 0.15, 2));
  }

  const remainingAmount = finalPrice - paidAmount;

  const deal: SaleDeal = {
    id: `deal-${dealCounter}`,
    number: `SL-${pad(dealCounter, 5)}`,
    clientId: client.id,
    unitId: unit.id,
    projectId: unit.projectId,
    dealDate,
    price: unit.totalPrice,
    discount,
    finalPrice,
    paidAmount,
    remainingAmount,
    status,
    manager: pick(rng, ["Наргис Шарипова", "Умед Собиров", "Парвина Латифова"]),
    schedule,
  };
  saleDeals.push(deal);
  unit.clientId = client.id;

  client.purchasedUnitIds.push(unit.id);
  client.contractsAmount += finalPrice;
  client.paidAmount += paidAmount;
  client.remainingAmount += remainingAmount;
  if (isInstallment) {
    const overdue = schedule.filter((s) => !s.paid && new Date(s.dueDate) < new Date("2026-07-01"));
    client.overdueAmount += overdue.reduce((sum, s) => sum + s.amount, 0);
  }

  dealCounter++;
}

// ============================================================================
// Финансы: транзакции, долги
// ============================================================================

export const transactions: FinancialTransaction[] = [];
const EXPENSE_CATEGORIES: TransactionCategory[] = [
  "concrete",
  "rebar",
  "cement",
  "brick",
  "salary",
  "machinery",
  "contractors",
  "documents",
  "other",
];

let txCounter = 1;
for (let month = 0; month < 12; month++) {
  const monthStart = addDays("2025-07-01", month * 30);
  for (const project of projects) {
    const txPerMonth = randInt(rng, 5, 9);
    for (let i = 0; i < txPerMonth; i++) {
      const isIncome = rng() < 0.32;
      const category: TransactionCategory = isIncome ? "sales-income" : pick(rng, EXPENSE_CATEGORIES);
      const amount = isIncome
        ? randInt(rng, 80_000, 950_000)
        : randInt(rng, 15_000, 620_000);
      const stage = pick(rng, stages.filter((s) => s.projectId === project.id));
      transactions.push({
        id: `tx-${txCounter}`,
        date: addDays(monthStart, randInt(rng, 0, 27)),
        type: isIncome ? "income" : "expense",
        amount,
        currency: "TJS",
        category,
        projectId: project.id,
        stageId: !isIncome ? stage?.id : undefined,
        counterpartyName: isIncome ? pick(rng, clients).fullName : pick(rng, SUPPLIERS).name,
        paymentMethod: pick(rng, ["bank", "cash", "card", "transfer"]),
        status: month === 11 && rng() < 0.2 ? "planned" : "completed",
        documentNumber: `${isIncome ? "PAY" : "EXP"}-${pad(txCounter, 6)}`,
        responsible: pick(rng, RESPONSIBLES),
      });
      txCounter++;
    }
  }
}

export const debts: Debt[] = [];
let debtCounter = 1;
for (const supplier of SUPPLIERS) {
  if (supplier.currentDebt <= 0) continue;
  const dueDate = addDays("2026-06-01", randInt(rng, -40, 60));
  const overdueDays = Math.max(0, daysSince(dueDate));
  let status: Debt["status"] = "ok";
  if (overdueDays > 30) status = "overdue";
  else if (overdueDays > 0) status = rng() < 0.7 ? "overdue" : "disputed";
  else if (daysSince(dueDate) > -14) status = "due-soon";

  debts.push({
    id: `debt-${debtCounter}`,
    supplierId: supplier.id,
    materialCategory: supplier.category,
    amount: supplier.currentDebt,
    dueDate,
    overdueDays,
    lastPaymentDate: addDays(dueDate, -randInt(rng, 10, 60)),
    status,
  });
  debtCounter++;
}

function daysSince(iso: string): number {
  const ms = new Date("2026-07-01").getTime() - new Date(iso).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// ============================================================================
// Документы
// ============================================================================

export const documents: AppDocument[] = [];
const DOC_TYPES: DocumentType[] = [
  "sale-contract",
  "installment-contract",
  "reservation-contract",
  "supply-contract",
  "works-contract",
  "work-act",
  "handover-act",
  "invoice",
  "waybill",
  "payment-order",
  "material-cert",
  "as-built-docs",
  "permits",
  "project-docs",
];
const DOC_STATUSES: AppDocument["status"][] = ["draft", "approval", "signed", "paid", "closed", "archived"];

for (let i = 0; i < 34; i++) {
  const type = pick(rng, DOC_TYPES);
  const project = pick(rng, projects);
  const isClientDoc = ["sale-contract", "installment-contract", "reservation-contract"].includes(type);
  const counterparty = isClientDoc ? pick(rng, clients).fullName : pick(rng, SUPPLIERS).name;
  documents.push({
    id: `doc-${i + 1}`,
    number: `${docPrefix(type)}-${pad(i + 1, 5)}`,
    type,
    relatedProjectId: project.id,
    relatedUnitId: isClientDoc ? pick(rng, units.filter((u) => u.projectId === project.id))?.id : undefined,
    counterpartyName: counterparty,
    amount: rng() < 0.8 ? randInt(rng, 5_000, 900_000) : undefined,
    date: addDays("2025-08-01", randInt(rng, 0, 330)),
    status: pick(rng, DOC_STATUSES),
    fileName: `${docPrefix(type)}-${pad(i + 1, 5)}.pdf`,
    responsible: pick(rng, [...RESPONSIBLES, "Гулнора Саидова"]),
  });
}

function docPrefix(type: DocumentType): string {
  const map: Record<DocumentType, string> = {
    "sale-contract": "DKP",
    "installment-contract": "RAS",
    "reservation-contract": "BRN",
    "supply-contract": "SUP",
    "works-contract": "WRK",
    "work-act": "ACT",
    "handover-act": "HND",
    invoice: "INV",
    waybill: "WB",
    "payment-order": "PMT",
    "material-cert": "CERT",
    "as-built-docs": "ISP",
    permits: "PRM",
    "project-docs": "PRJ",
  };
  return map[type];
}

// ============================================================================
// Акты выполненных работ
// ============================================================================

export const workActs: WorkAct[] = [];
const WORK_TYPES = [
  "Устройство фундамента",
  "Монолитные работы каркаса",
  "Кладочные работы",
  "Кровельные работы",
  "Фасадные работы",
  "Монтаж инженерных сетей",
  "Монтаж лифтового оборудования",
  "Отделочные работы МОП",
  "Благоустройство территории",
];

for (let i = 0; i < 26; i++) {
  const project = pick(rng, projects);
  const stage = pick(rng, stages.filter((s) => s.projectId === project.id));
  const contractor = pick(rng, SUPPLIERS.filter((s) => s.type === "contractor" || s.type === "service" || rng() < 0.4));
  const amount = randInt(rng, 25_000, 780_000);
  const paidAmount = Math.round(amount * randFloat(rng, 0, 1, 2));
  workActs.push({
    id: `act-${i + 1}`,
    number: `ACT-${pad(i + 1, 5)}`,
    contractorId: contractor.id,
    projectId: project.id,
    stageId: stage.id,
    workType: pick(rng, WORK_TYPES),
    amount,
    date: addDays("2025-09-01", randInt(rng, 0, 290)),
    status: pick(rng, ["created", "review", "signed", "partial-paid", "paid", "rejected"]),
    paidAmount,
    remainingAmount: amount - paidAmount,
    fileName: `ACT-${pad(i + 1, 5)}.pdf`,
    responsible: pick(rng, RESPONSIBLES),
  });
}

// ============================================================================
// Сотрудники, роли, права
// ============================================================================

export const roles: Role[] = [
  { key: "owner", name: "Учредитель", description: "Полный обзор бизнеса, без операционных действий" },
  { key: "ceo", name: "Директор", description: "Полное управление операционной деятельностью" },
  { key: "cfo", name: "Финансовый директор", description: "Управление финансами и бюджетами" },
  { key: "accountant", name: "Бухгалтер", description: "Учёт платежей, долгов и документов" },
  { key: "procurement", name: "Снабженец", description: "Закупки и снабжение материалами" },
  { key: "warehouse", name: "Кладовщик", description: "Учёт остатков и движения материалов" },
  { key: "pm", name: "Project Manager", description: "Управление проектом и этапами" },
  { key: "engineer", name: "Инженер", description: "Контроль качества и технической части" },
  { key: "foreman", name: "Прораб", description: "Контроль работ на площадке" },
  { key: "lawyer", name: "Юрист", description: "Договоры и юридическое сопровождение" },
  { key: "sales", name: "Sales Manager", description: "Продажи недвижимости и работа с клиентами" },
  { key: "viewer", name: "Наблюдатель", description: "Доступ только на просмотр" },
];

const PERMISSION_SECTIONS: PermissionSection[] = [
  "finance",
  "procurement",
  "warehouse",
  "suppliers",
  "realestate",
  "sales",
  "clients",
  "contracts",
  "acts",
  "reports",
  "settings",
];

function perm(section: PermissionSection, actions: Partial<Record<PermissionAction, boolean>>): Permission {
  return {
    section,
    actions: {
      view: !!actions.view,
      create: !!actions.create,
      edit: !!actions.edit,
      delete: !!actions.delete,
      approve: !!actions.approve,
      export: !!actions.export,
    },
  };
}

const FULL = { view: true, create: true, edit: true, delete: true, approve: true, export: true };
const VIEW_EXPORT = { view: true, export: true };
const VIEW_ONLY = { view: true };
const NONE = {};

function buildRoleMatrix(overrides: Partial<Record<PermissionSection, Partial<Record<PermissionAction, boolean>>>>): Permission[] {
  return PERMISSION_SECTIONS.map((section) => perm(section, overrides[section] ?? NONE));
}

export const permissionMatrix: Record<RoleKey, Permission[]> = {
  owner: buildRoleMatrix(
    Object.fromEntries(PERMISSION_SECTIONS.map((s) => [s, VIEW_EXPORT])) as Record<PermissionSection, Partial<Record<PermissionAction, boolean>>>
  ),
  ceo: buildRoleMatrix(
    Object.fromEntries(PERMISSION_SECTIONS.map((s) => [s, FULL])) as Record<PermissionSection, Partial<Record<PermissionAction, boolean>>>
  ),
  cfo: buildRoleMatrix({
    finance: FULL,
    procurement: VIEW_EXPORT,
    warehouse: VIEW_ONLY,
    suppliers: VIEW_EXPORT,
    realestate: VIEW_ONLY,
    sales: VIEW_EXPORT,
    clients: VIEW_ONLY,
    contracts: VIEW_EXPORT,
    acts: { view: true, approve: true, export: true },
    reports: VIEW_EXPORT,
    settings: NONE,
  }),
  accountant: buildRoleMatrix({
    finance: { view: true, create: true, edit: true, export: true },
    procurement: VIEW_ONLY,
    warehouse: VIEW_ONLY,
    suppliers: VIEW_ONLY,
    realestate: NONE,
    sales: VIEW_ONLY,
    clients: VIEW_ONLY,
    contracts: { view: true, export: true },
    acts: { view: true, edit: true, export: true },
    reports: VIEW_ONLY,
    settings: NONE,
  }),
  procurement: buildRoleMatrix({
    finance: NONE,
    procurement: FULL,
    warehouse: VIEW_ONLY,
    suppliers: { view: true, create: true, edit: true },
    realestate: NONE,
    sales: NONE,
    clients: NONE,
    contracts: VIEW_ONLY,
    acts: NONE,
    reports: NONE,
    settings: NONE,
  }),
  warehouse: buildRoleMatrix({
    procurement: VIEW_ONLY,
    warehouse: { view: true, create: true, edit: true },
    suppliers: VIEW_ONLY,
  }),
  pm: buildRoleMatrix({
    finance: VIEW_ONLY,
    procurement: { view: true, create: true, approve: true },
    warehouse: VIEW_ONLY,
    suppliers: VIEW_ONLY,
    realestate: VIEW_ONLY,
    contracts: VIEW_ONLY,
    acts: { view: true, approve: true },
    reports: VIEW_ONLY,
  }),
  engineer: buildRoleMatrix({
    procurement: { view: true, create: true },
    warehouse: VIEW_ONLY,
    acts: { view: true, create: true },
    reports: VIEW_ONLY,
  }),
  foreman: buildRoleMatrix({
    procurement: { view: true, create: true },
    warehouse: { view: true, create: true },
    acts: { view: true, create: true },
  }),
  lawyer: buildRoleMatrix({
    contracts: FULL,
    acts: VIEW_EXPORT,
    clients: VIEW_ONLY,
    suppliers: VIEW_ONLY,
    reports: VIEW_ONLY,
  }),
  sales: buildRoleMatrix({
    realestate: { view: true, edit: true },
    sales: { view: true, create: true, edit: true },
    clients: { view: true, create: true, edit: true },
    contracts: { view: true, create: true },
    reports: VIEW_ONLY,
  }),
  viewer: buildRoleMatrix(
    Object.fromEntries(PERMISSION_SECTIONS.map((s) => [s, VIEW_ONLY])) as Record<PermissionSection, Partial<Record<PermissionAction, boolean>>>
  ),
};

export const users: User[] = [
  mkUser("Убайдулло Раҳимов", "u.rahimov@devcore.tj", "owner", "#1B2430"),
  mkUser("Фаридун Ахмедов", "f.akhmedov@devcore.tj", "ceo", "#1D5FA8"),
  mkUser("Гулнора Саидова", "g.saidova@devcore.tj", "cfo", "#12805C"),
  mkUser("Мунира Гафурова", "m.gafurova@devcore.tj", "accountant", "#B8871F"),
  mkUser("Далер Юнусов", "d.yunusov@devcore.tj", "procurement", "#C0362C"),
  mkUser("Ориёна Собирова", "o.sobirova@devcore.tj", "warehouse", "#667085"),
  mkUser("Шоҳрух Валиев", "sh.valiev@devcore.tj", "pm", "#1D5FA8"),
  mkUser("Хуршед Назаров", "kh.nazarov@devcore.tj", "engineer", "#12805C"),
  mkUser("Сухроб Олимов", "s.olimov@devcore.tj", "foreman", "#B8871F"),
  mkUser("Парвина Латифова", "p.latifova@devcore.tj", "lawyer", "#C0362C"),
  mkUser("Наргис Шарипова", "n.sharipova@devcore.tj", "sales", "#1D5FA8"),
  mkUser("Умед Собиров", "u.sobirov@devcore.tj", "sales", "#12805C"),
];

function mkUser(fullName: string, email: string, role: RoleKey, color: string): User {
  return {
    id: `usr-${email}`,
    fullName,
    email,
    phone: `+992 9${randInt(rng, 0, 9)} ${randInt(rng, 100, 999)} ${randInt(rng, 10, 99)} ${randInt(rng, 10, 99)}`,
    role,
    avatarColor: color,
    status: "active",
    lastActive: addDays("2026-06-25", randInt(rng, 0, 6)),
  };
}

// ============================================================================
// Публичные lookup-хелперы
// ============================================================================

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
export function getSupplier(id: string): Supplier | undefined {
  return SUPPLIERS.find((s) => s.id === id);
}
export function getClient(id: string): Client | undefined {
  return clients.find((c) => c.id === id);
}
export function getUnit(id: string): RealEstateUnit | undefined {
  return units.find((u) => u.id === id);
}
export function getStage(id: string): ConstructionStage | undefined {
  return stages.find((s) => s.id === id);
}
export function getBuilding(id: string): Building | undefined {
  return buildings.find((b) => b.id === id);
}
export function projectStages(projectId: string): ConstructionStage[] {
  return stages.filter((s) => s.projectId === projectId).sort((a, b) => a.order - b.order);
}
export function projectUnits(projectId: string): RealEstateUnit[] {
  return units.filter((u) => u.projectId === projectId);
}
export function projectBuildings(projectId: string): Building[] {
  return buildings.filter((b) => b.projectId === projectId);
}
