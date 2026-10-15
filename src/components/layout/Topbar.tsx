import { useState } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { useScope } from "@/context/ScopeContext";
import { projects } from "@/data/mockData";
import { cn } from "@/lib/utils";

const NOTIFICATIONS = [
  { id: 1, title: "Просрочен платёж поставщику", detail: '"МеталлПром Таджикистан" — 3 дня просрочки', tone: "risk" as const },
  { id: 2, title: "Этап задержан", detail: 'ЖК "Навруз Парк" — Кладка отстаёт от графика', tone: "warn" as const },
  { id: 3, title: "Новая сделка", detail: "Забронирована квартира A-0603 в Сомон Резиденс", tone: "info" as const },
];

export function Topbar() {
  const { projectId, setProjectId } = useScope();
  const [notifOpen, setNotifOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);

  const activeProject = projects.find((p) => p.id === projectId);

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5">
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-400)]" />
        <input
          placeholder="Поиск по объектам, клиентам, документам..."
          className="h-9 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] pl-9 pr-3 text-sm text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-400)] focus:border-[var(--color-info-600)] focus:bg-[var(--color-surface)] focus:outline-none"
        />
      </div>

      <div className="relative ml-auto">
        <button
          onClick={() => setProjectOpen((v) => !v)}
          className="flex h-9 items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 text-sm font-medium text-[var(--color-ink-700)] hover:bg-[var(--color-surface-muted)]"
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: activeProject?.coverColor ?? "#667085" }}
          />
          {activeProject ? activeProject.name : "Все объекты"}
          <ChevronDown className="h-3.5 w-3.5 text-[var(--color-ink-400)]" />
        </button>
        {projectOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setProjectOpen(false)} />
            <div className="absolute right-0 z-20 mt-1.5 w-64 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-[var(--shadow-panel)]">
              <button
                onClick={() => {
                  setProjectId(null);
                  setProjectOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[var(--color-surface-muted)]",
                  !projectId && "font-medium text-[var(--color-brand-800)]"
                )}
              >
                Все объекты
              </button>
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setProjectId(p.id);
                    setProjectOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[var(--color-surface-muted)]",
                    projectId === p.id && "font-medium text-[var(--color-brand-800)]"
                  )}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.coverColor }} />
                  {p.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setNotifOpen((v) => !v)}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-ink-500)] hover:bg-[var(--color-surface-muted)]"
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-risk-600)]" />
        </button>
        {notifOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 z-20 mt-1.5 w-80 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-panel)]">
              <div className="border-b border-[var(--color-border)] px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-500)]">
                Уведомления
              </div>
              {NOTIFICATIONS.map((n) => (
                <div key={n.id} className="flex gap-2.5 border-b border-[var(--color-border)] px-3.5 py-3 last:border-0 hover:bg-[var(--color-surface-muted)]">
                  <span
                    className={cn(
                      "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
                      n.tone === "risk" && "bg-[var(--color-risk-600)]",
                      n.tone === "warn" && "bg-[var(--color-warn-600)]",
                      n.tone === "info" && "bg-[var(--color-info-600)]"
                    )}
                  />
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-[var(--color-ink-900)]">{n.title}</div>
                    <div className="text-xs text-[var(--color-ink-500)]">{n.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-brand-800)] text-[12px] font-semibold text-white">
        УР
      </div>
    </header>
  );
}
