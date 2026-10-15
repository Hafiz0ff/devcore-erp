import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  Building2,
  HardHat,
  ShoppingCart,
  Truck,
  Warehouse,
  Factory,
  Grid3x3,
  Handshake,
  Users,
  FileText,
  ClipboardCheck,
  PieChart,
  UserCog,
  Settings,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/finance", label: "Финансы", icon: Wallet },
  { to: "/projects", label: "Проекты / ЖК", icon: Building2 },
  { to: "/construction", label: "Этапы строительства", icon: HardHat },
  { to: "/procurement", label: "Закупки", icon: ShoppingCart },
  { to: "/supply", label: "Снабжение", icon: Truck },
  { to: "/warehouse", label: "Склад", icon: Warehouse },
  { to: "/suppliers", label: "Поставщики", icon: Factory },
  { to: "/real-estate", label: "Недвижимый фонд", icon: Grid3x3 },
  { to: "/sales", label: "Продажи / предпродажи", icon: Handshake },
  { to: "/clients", label: "Клиенты", icon: Users },
  { to: "/documents", label: "Договоры и документы", icon: FileText },
  { to: "/acts", label: "Акты", icon: ClipboardCheck },
  { to: "/reports", label: "Отчёты для учредителей", icon: PieChart },
  { to: "/users", label: "Сотрудники и роли", icon: UserCog },
  { to: "/settings", label: "Настройки", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col bg-[var(--color-brand-900)] text-white">
      <div className="flex h-14 items-center gap-2.5 border-b border-white/10 px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-gold-500)]">
          <Boxes className="h-4 w-4 text-[var(--color-brand-900)]" />
        </div>
        <div className="leading-tight">
          <div className="text-[13.5px] font-semibold tracking-tight">Devcore</div>
          <div className="text-[10.5px] text-white/45">Developer ERP</div>
        </div>
      </div>

      <nav className="scrollbar-none flex-1 overflow-y-auto px-2.5 py-3">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-white/65 transition-colors",
                    "hover:bg-white/[0.06] hover:text-white",
                    isActive && "bg-white/[0.09] text-white"
                  )
                }
              >
                <item.icon className="h-[17px] w-[17px] shrink-0" strokeWidth={1.8} />
                <span className="truncate">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-white/10 px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-gold-500)] text-[12px] font-semibold text-[var(--color-brand-900)]">
            УР
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-[12.5px] font-medium text-white">Убайдулло Раҳимов</div>
            <div className="text-[11px] text-white/45">Учредитель</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
