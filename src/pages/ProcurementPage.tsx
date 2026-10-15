import { useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Money } from "@/components/ui/money";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PurchaseRequestTable } from "@/components/procurement/PurchaseRequestTable";
import { PurchaseOrderTable } from "@/components/procurement/PurchaseOrderTable";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useScope } from "@/context/ScopeContext";
import { purchaseRequests, purchaseOrders, documents, getSupplier, MATERIALS } from "@/data/mockData";
import { documentStatusMeta, formatDate, formatMoney } from "@/utils/formatters";

export default function ProcurementPage() {
  const { projectId } = useScope();

  const requests = useMemo(
    () => purchaseRequests.filter((r) => !projectId || r.projectId === projectId),
    [projectId]
  );
  const orders = purchaseOrders; // заказы не привязаны к конкретному ЖК напрямую в модели
  const invoices = useMemo(() => documents.filter((d) => d.type === "invoice"), []);
  const payments = useMemo(() => orders.filter((o) => o.paidAmount > 0), [orders]);

  const priceHistory = useMemo(() => {
    return MATERIALS.map((mat) => {
      const matOrders = orders.filter((o) => o.material === mat.name);
      const prices = matOrders.map((o) => o.pricePerUnit);
      return {
        name: mat.name,
        unit: mat.unit,
        min: prices.length ? Math.min(...prices) : mat.basePrice,
        max: prices.length ? Math.max(...prices) : mat.basePrice,
        avg: prices.length ? Math.round(prices.reduce((s, p) => s + p, 0) / prices.length) : mat.basePrice,
        count: matOrders.length,
      };
    });
  }, [orders]);

  const spendBySupplier = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of orders) {
      const name = getSupplier(o.supplierId)?.name ?? "—";
      map.set(name, (map.get(name) ?? 0) + o.totalAmount);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [orders]);

  return (
    <div>
      <PageHeader
        title="Закупки"
        description="Заявки, заказы поставщикам, счета, оплаты и аналитика цен"
        actions={
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" /> Новая заявка
          </Button>
        }
      />

      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">Заявки на закупку</TabsTrigger>
          <TabsTrigger value="orders">Заказы поставщикам</TabsTrigger>
          <TabsTrigger value="invoices">Счета</TabsTrigger>
          <TabsTrigger value="payments">Оплаты</TabsTrigger>
          <TabsTrigger value="prices">История цен</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика закупок</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <PurchaseRequestTable requests={requests} />
        </TabsContent>

        <TabsContent value="orders">
          <PurchaseOrderTable orders={orders} />
        </TabsContent>

        <TabsContent value="invoices">
          <Table>
            <THead>
              <TR>
                <TH>Номер</TH>
                <TH>Контрагент</TH>
                <TH>Дата</TH>
                <TH className="text-right">Сумма</TH>
                <TH>Статус</TH>
              </TR>
            </THead>
            <TBody>
              {invoices.map((d) => {
                const meta = documentStatusMeta[d.status];
                return (
                  <TR key={d.id}>
                    <TD className="font-medium">{d.number}</TD>
                    <TD>{d.counterpartyName}</TD>
                    <TD>{formatDate(d.date)}</TD>
                    <TD className="text-right">{d.amount ? <Money amount={d.amount} compact /> : "—"}</TD>
                    <TD>
                      <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </TabsContent>

        <TabsContent value="payments">
          <Table>
            <THead>
              <TR>
                <TH>Заказ</TH>
                <TH>Поставщик</TH>
                <TH className="text-right">Оплачено</TH>
                <TH className="text-right">Остаток долга</TH>
                <TH>Дата поставки</TH>
              </TR>
            </THead>
            <TBody>
              {payments.map((o) => (
                <TR key={o.id}>
                  <TD className="font-medium">{o.number}</TD>
                  <TD>{getSupplier(o.supplierId)?.name}</TD>
                  <TD className="text-right">
                    <Money amount={o.paidAmount} compact />
                  </TD>
                  <TD className="text-right">
                    <Money amount={o.debtAmount} compact className={o.debtAmount > 0 ? "text-[var(--color-risk-600)]" : ""} />
                  </TD>
                  <TD>{formatDate(o.deliveryDate)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </TabsContent>

        <TabsContent value="prices">
          <Table>
            <THead>
              <TR>
                <TH>Материал</TH>
                <TH className="text-right">Мин. цена</TH>
                <TH className="text-right">Средняя цена</TH>
                <TH className="text-right">Макс. цена</TH>
                <TH className="text-right">Заказов</TH>
              </TR>
            </THead>
            <TBody>
              {priceHistory.map((m) => (
                <TR key={m.name}>
                  <TD className="font-medium">
                    {m.name} <span className="text-[var(--color-ink-400)]">/ {m.unit}</span>
                  </TD>
                  <TD className="text-right">
                    <Money amount={m.min} />
                  </TD>
                  <TD className="text-right">
                    <Money amount={m.avg} />
                  </TD>
                  <TD className="text-right">
                    <Money amount={m.max} />
                  </TD>
                  <TD className="tnum text-right">{m.count}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Закупки по поставщикам</CardTitle>
                <CardDescription>Общая сумма заказов по каждому поставщику</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={Math.max(280, spendBySupplier.length * 38)}>
                <BarChart data={spendBySupplier} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => formatMoney(v, "TJS", true)} tick={{ fontSize: 11, fill: "var(--color-ink-500)" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 12, fill: "var(--color-ink-700)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value) => formatMoney(Number(value), "TJS")}
                    contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", fontSize: 12.5, boxShadow: "var(--shadow-panel)" }}
                  />
                  <Bar dataKey="value" name="Сумма закупок" fill="var(--color-brand-800)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
