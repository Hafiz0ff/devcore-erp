import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Phone, MapPin, User, Star } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/badge";
import { Money } from "@/components/ui/money";
import { EmptyState } from "@/components/ui/empty-state";
import { FileX } from "lucide-react";
import { SUPPLIERS, purchaseOrders, debts, documents } from "@/data/mockData";
import { purchaseOrderStatusMeta, supplierTypeMeta, debtStatusMeta, documentTypeMeta, documentStatusMeta, formatDate } from "@/utils/formatters";

export default function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>();
  const supplier = SUPPLIERS.find((s) => s.id === id);

  const orders = useMemo(() => purchaseOrders.filter((o) => o.supplierId === id), [id]);
  const supplierDebts = useMemo(() => debts.filter((d) => d.supplierId === id), [id]);
  const supplierDocs = useMemo(
    () => documents.filter((d) => supplier && d.counterpartyName === supplier.name),
    [supplier]
  );

  const priceHistory = useMemo(() => {
    const map = new Map<string, { date: string; price: number }[]>();
    for (const o of orders) {
      const arr = map.get(o.material) ?? [];
      arr.push({ date: o.deliveryDate, price: o.pricePerUnit });
      map.set(o.material, arr);
    }
    return Array.from(map.entries()).map(([material, points]) => ({
      material,
      points: points.sort((a, b) => (a.date < b.date ? -1 : 1)),
    }));
  }, [orders]);

  if (!supplier) {
    return (
      <div>
        <Link to="/suppliers" className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)]">
          <ArrowLeft className="h-4 w-4" /> К списку поставщиков
        </Link>
        <EmptyState icon={FileX} title="Поставщик не найден" />
      </div>
    );
  }

  return (
    <div>
      <Link to="/suppliers" className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)]">
        <ArrowLeft className="h-4 w-4" /> К списку поставщиков
      </Link>

      <PageHeader
        title={supplier.name}
        description={`${supplierTypeMeta[supplier.type]} · ${supplier.category}`}
      />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoTile icon={User} label="Контактное лицо" value={supplier.contactPerson} />
        <InfoTile icon={Phone} label="Телефон" value={supplier.phone} />
        <InfoTile icon={MapPin} label="Адрес" value={supplier.address} />
        <InfoTile icon={Star} label="Надёжность" value={`${supplier.reliabilityRating.toFixed(1)} / 5 · задержка ~${supplier.avgDeliveryDelayDays} дн.`} />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="p-4">
          <div className="text-xs text-[var(--color-ink-500)]">Всего закуплено</div>
          <Money amount={supplier.totalPurchased} compact className="mt-1 block text-lg font-semibold" />
        </Card>
        <Card className="p-4">
          <div className="text-xs text-[var(--color-ink-500)]">Текущий долг</div>
          <Money amount={supplier.currentDebt} compact className="mt-1 block text-lg font-semibold text-[var(--color-risk-600)]" />
        </Card>
        <Card className="p-4">
          <div className="text-xs text-[var(--color-ink-500)]">Договоров</div>
          <div className="tnum mt-1 text-lg font-semibold">{supplier.contractsCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-[var(--color-ink-500)]">Заказов</div>
          <div className="tnum mt-1 text-lg font-semibold">{orders.length}</div>
        </Card>
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Поставки / заказы</TabsTrigger>
          <TabsTrigger value="debts">Долги</TabsTrigger>
          <TabsTrigger value="prices">История цен</TabsTrigger>
          <TabsTrigger value="documents">Документы</TabsTrigger>
          <TabsTrigger value="comments">Комментарии</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Table>
            <THead>
              <TR>
                <TH>Номер</TH>
                <TH>Материал</TH>
                <TH>Кол-во</TH>
                <TH className="text-right">Цена / ед.</TH>
                <TH className="text-right">Сумма</TH>
                <TH className="text-right">Оплачено</TH>
                <TH className="text-right">Долг</TH>
                <TH>Дата поставки</TH>
                <TH>Статус</TH>
              </TR>
            </THead>
            <TBody>
              {orders.map((o) => {
                const meta = purchaseOrderStatusMeta[o.status];
                return (
                  <TR key={o.id}>
                    <TD className="font-medium">{o.number}</TD>
                    <TD>{o.material}</TD>
                    <TD className="tnum">
                      {o.quantity} {o.unit}
                    </TD>
                    <TD className="text-right">
                      <Money amount={o.pricePerUnit} />
                    </TD>
                    <TD className="text-right">
                      <Money amount={o.totalAmount} compact />
                    </TD>
                    <TD className="text-right">
                      <Money amount={o.paidAmount} compact />
                    </TD>
                    <TD className="text-right">
                      <Money amount={o.debtAmount} compact className={o.debtAmount > 0 ? "text-[var(--color-risk-600)]" : ""} />
                    </TD>
                    <TD>{formatDate(o.deliveryDate)}</TD>
                    <TD>
                      <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </TabsContent>

        <TabsContent value="debts">
          {supplierDebts.length === 0 ? (
            <EmptyState icon={FileX} title="Долгов нет" />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Категория</TH>
                  <TH className="text-right">Сумма</TH>
                  <TH>Срок оплаты</TH>
                  <TH>Просрочка</TH>
                  <TH>Статус</TH>
                </TR>
              </THead>
              <TBody>
                {supplierDebts.map((d) => {
                  const meta = debtStatusMeta[d.status];
                  return (
                    <TR key={d.id}>
                      <TD>{d.materialCategory}</TD>
                      <TD className="text-right">
                        <Money amount={d.amount} compact />
                      </TD>
                      <TD>{formatDate(d.dueDate)}</TD>
                      <TD className="tnum">{d.overdueDays > 0 ? `${d.overdueDays} дн.` : "—"}</TD>
                      <TD>
                        <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="prices">
          {priceHistory.length === 0 ? (
            <EmptyState icon={FileX} title="Нет истории цен" />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {priceHistory.map((h) => (
                <Card key={h.material}>
                  <CardHeader>
                    <CardTitle className="text-sm">{h.material}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-1">
                    <ul className="flex flex-col gap-1.5">
                      {h.points.map((p, idx) => (
                        <li key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-[var(--color-ink-500)]">{formatDate(p.date)}</span>
                          <Money amount={p.price} />
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents">
          {supplierDocs.length === 0 ? (
            <EmptyState icon={FileX} title="Документов не найдено" />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Номер</TH>
                  <TH>Тип</TH>
                  <TH>Дата</TH>
                  <TH className="text-right">Сумма</TH>
                  <TH>Статус</TH>
                </TR>
              </THead>
              <TBody>
                {supplierDocs.map((d) => {
                  const meta = documentStatusMeta[d.status];
                  return (
                    <TR key={d.id}>
                      <TD className="font-medium">{d.number}</TD>
                      <TD>{documentTypeMeta[d.type]}</TD>
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
          )}
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardContent className="pt-5 text-sm text-[var(--color-ink-500)]">
              Комментариев пока нет. Здесь будет отображаться история переписки и внутренние заметки по поставщику.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <Card className="flex items-start gap-2.5 p-3.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--color-brand-100)] text-[var(--color-brand-800)]">
        <Icon className="h-[15px] w-[15px]" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] text-[var(--color-ink-500)]">{label}</div>
        <div className="truncate text-[13px] font-medium text-[var(--color-ink-900)]">{value}</div>
      </div>
    </Card>
  );
}
