import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FilterBar } from "@/components/ui/filter-bar";
import { Select } from "@/components/ui/input";
import { SupplierCard } from "@/components/procurement/SupplierCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SUPPLIERS } from "@/data/mockData";
import { supplierTypeMeta } from "@/utils/formatters";

export default function SuppliersPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(
    () =>
      SUPPLIERS.filter((s) => typeFilter === "all" || s.type === typeFilter).filter(
        (s) => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase())
      ),
    [search, typeFilter]
  );

  return (
    <div>
      <PageHeader
        title="Поставщики"
        description="Заводы, поставщики, подрядчики и услуги"
        actions={
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" /> Новый поставщик
          </Button>
        }
      />
      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Название, категория...">
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">Все типы</option>
          {Object.entries(supplierTypeMeta).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </FilterBar>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((s) => (
          <SupplierCard key={s.id} supplier={s} />
        ))}
      </div>
    </div>
  );
}
