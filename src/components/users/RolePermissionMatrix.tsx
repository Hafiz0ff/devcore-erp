import { Check, Minus } from "lucide-react";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import type { Permission, PermissionAction } from "@/types";
import { cn } from "@/lib/utils";

const SECTION_LABEL: Record<Permission["section"], string> = {
  finance: "Финансы",
  procurement: "Закупки",
  warehouse: "Склад",
  suppliers: "Поставщики",
  realestate: "Недвижимый фонд",
  sales: "Продажи",
  clients: "Клиенты",
  contracts: "Договоры",
  acts: "Акты",
  reports: "Отчёты",
  settings: "Настройки",
};

const ACTION_LABEL: Record<PermissionAction, string> = {
  view: "Просмотр",
  create: "Создание",
  edit: "Редактирование",
  delete: "Удаление",
  approve: "Согласование",
  export: "Экспорт",
};

const ACTIONS: PermissionAction[] = ["view", "create", "edit", "delete", "approve", "export"];

export function RolePermissionMatrix({ permissions }: { permissions: Permission[] }) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>Раздел</TH>
          {ACTIONS.map((a) => (
            <TH key={a} className="text-center">
              {ACTION_LABEL[a]}
            </TH>
          ))}
        </TR>
      </THead>
      <TBody>
        {permissions.map((p) => (
          <TR key={p.section}>
            <TD className="font-medium">{SECTION_LABEL[p.section]}</TD>
            {ACTIONS.map((a) => (
              <TD key={a} className="text-center">
                {p.actions[a] ? (
                  <Check className="mx-auto h-4 w-4 text-[var(--color-positive-600)]" />
                ) : (
                  <Minus className={cn("mx-auto h-4 w-4 text-[var(--color-ink-400)]")} />
                )}
              </TD>
            ))}
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
