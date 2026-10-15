import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/badge";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { RolePermissionMatrix } from "@/components/users/RolePermissionMatrix";
import { users, roles, permissionMatrix } from "@/data/mockData";
import { formatDate } from "@/utils/formatters";

const ROLE_LABEL = Object.fromEntries(roles.map((r) => [r.key, r.name]));

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState(roles[0].key);

  return (
    <div>
      <PageHeader
        title="Сотрудники и роли"
        description="Пользователи системы и матрица прав доступа"
        actions={
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" /> Пригласить сотрудника
          </Button>
        }
      />

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Сотрудники</TabsTrigger>
          <TabsTrigger value="permissions">Матрица прав</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Table>
            <THead>
              <TR>
                <TH>Сотрудник</TH>
                <TH>Email</TH>
                <TH>Телефон</TH>
                <TH>Роль</TH>
                <TH>Статус</TH>
                <TH>Последняя активность</TH>
              </TR>
            </THead>
            <TBody>
              {users.map((u) => (
                <TR key={u.id}>
                  <TD>
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                        style={{ backgroundColor: u.avatarColor }}
                      >
                        {u.fullName
                          .split(" ")
                          .map((p) => p[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <span className="font-medium">{u.fullName}</span>
                    </div>
                  </TD>
                  <TD className="text-[var(--color-ink-500)]">{u.email}</TD>
                  <TD className="tnum">{u.phone}</TD>
                  <TD>{ROLE_LABEL[u.role]}</TD>
                  <TD>
                    <StatusBadge tone={u.status === "active" ? "positive" : u.status === "invited" ? "warn" : "muted"}>
                      {u.status === "active" ? "Активен" : u.status === "invited" ? "Приглашён" : "Отключён"}
                    </StatusBadge>
                  </TD>
                  <TD>{formatDate(u.lastActive)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </TabsContent>

        <TabsContent value="permissions">
          <Card className="mb-4 flex flex-wrap items-center gap-3 p-4">
            <span className="text-sm font-medium text-[var(--color-ink-700)]">Роль:</span>
            <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}>
              {roles.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.name}
                </option>
              ))}
            </Select>
            <span className="text-xs text-[var(--color-ink-500)]">{roles.find((r) => r.key === roleFilter)?.description}</span>
          </Card>
          <RolePermissionMatrix permissions={permissionMatrix[roleFilter]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
