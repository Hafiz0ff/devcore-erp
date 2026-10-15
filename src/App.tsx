import { HashRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ScopeProvider } from "@/context/ScopeContext";
import { AppLayout } from "@/components/layout/AppLayout";

const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const FinancePage = lazy(() => import("@/pages/FinancePage"));
const ProjectsPage = lazy(() => import("@/pages/ProjectsPage"));
const ProjectDetailPage = lazy(() => import("@/pages/ProjectDetailPage"));
const ConstructionPage = lazy(() => import("@/pages/ConstructionPage"));
const ProcurementPage = lazy(() => import("@/pages/ProcurementPage"));
const SupplyPage = lazy(() => import("@/pages/SupplyPage"));
const WarehousePage = lazy(() => import("@/pages/WarehousePage"));
const SuppliersPage = lazy(() => import("@/pages/SuppliersPage"));
const SupplierDetailPage = lazy(() => import("@/pages/SupplierDetailPage"));
const RealEstatePage = lazy(() => import("@/pages/RealEstatePage"));
const SalesPage = lazy(() => import("@/pages/SalesPage"));
const ClientsPage = lazy(() => import("@/pages/ClientsPage"));
const DocumentsPage = lazy(() => import("@/pages/DocumentsPage"));
const ActsPage = lazy(() => import("@/pages/ActsPage"));
const ReportsPage = lazy(() => import("@/pages/ReportsPage"));
const UsersPage = lazy(() => import("@/pages/UsersPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));

function PageFallback() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border-strong)] border-t-[var(--color-brand-800)]" />
    </div>
  );
}

export default function App() {
  return (
    <ScopeProvider>
      <HashRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/construction" element={<ConstructionPage />} />
              <Route path="/procurement" element={<ProcurementPage />} />
              <Route path="/supply" element={<SupplyPage />} />
              <Route path="/warehouse" element={<WarehousePage />} />
              <Route path="/suppliers" element={<SuppliersPage />} />
              <Route path="/suppliers/:id" element={<SupplierDetailPage />} />
              <Route path="/real-estate" element={<RealEstatePage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/acts" element={<ActsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </ScopeProvider>
  );
}
