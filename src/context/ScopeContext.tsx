import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { projects } from "@/data/mockData";

interface ScopeContextValue {
  projectId: string | null; // null = все ЖК
  setProjectId: (id: string | null) => void;
  currentUserRole: string;
}

const ScopeContext = createContext<ScopeContextValue | null>(null);

export function ScopeProvider({ children }: { children: ReactNode }) {
  const [projectId, setProjectId] = useState<string | null>(null);
  const value = useMemo(() => ({ projectId, setProjectId, currentUserRole: "ceo" }), [projectId]);
  return <ScopeContext.Provider value={value}>{children}</ScopeContext.Provider>;
}

export function useScope() {
  const ctx = useContext(ScopeContext);
  if (!ctx) throw new Error("useScope must be used within ScopeProvider");
  return ctx;
}

export function useScopedProjects() {
  return projects;
}
