import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Настройки" description="Параметры компании, валюта и интеграции" />

      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">Компания</TabsTrigger>
          <TabsTrigger value="finance">Финансы</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="integrations">Интеграции</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card className="max-w-xl">
            <CardHeader>
              <div>
                <CardTitle>Профиль компании</CardTitle>
                <CardDescription>Основная информация о застройщике</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-2">
              <Field label="Название компании">
                <Input defaultValue='ОсОО "Devcore Development"' />
              </Field>
              <Field label="Юридический адрес">
                <Input defaultValue="г. Душанбе, ул. Айни 118" />
              </Field>
              <Field label="Часовой пояс">
                <Select defaultValue="dushanbe">
                  <option value="dushanbe">Душанбе (UTC+5)</option>
                </Select>
              </Field>
              <div>
                <Button variant="primary" size="sm">
                  Сохранить изменения
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance">
          <Card className="max-w-xl">
            <CardHeader>
              <div>
                <CardTitle>Финансовые настройки</CardTitle>
                <CardDescription>Валюта и параметры отчётности</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-2">
              <Field label="Основная валюта">
                <Select defaultValue="TJS">
                  <option value="TJS">Сомони (TJS)</option>
                  <option value="USD">Доллар США (USD)</option>
                </Select>
              </Field>
              <Field label="Начало финансового года">
                <Select defaultValue="jan">
                  <option value="jan">Январь</option>
                  <option value="jul">Июль</option>
                </Select>
              </Field>
              <div>
                <Button variant="primary" size="sm">
                  Сохранить изменения
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="max-w-xl">
            <CardHeader>
              <div>
                <CardTitle>Уведомления</CardTitle>
                <CardDescription>Когда система должна предупреждать команду</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-2 text-sm">
              {[
                "Просрочка платежа поставщику",
                "Превышение бюджета этапа более чем на 10%",
                "Остаток материала ниже минимального",
                "Задержка этапа строительства",
                "Прогноз кассового разрыва",
              ].map((item) => (
                <label key={item} className="flex items-center gap-2.5 rounded-lg border border-[var(--color-border)] px-3 py-2.5">
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--color-brand-800)]" />
                  {item}
                </label>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card className="max-w-xl">
            <CardHeader>
              <div>
                <CardTitle>Интеграции</CardTitle>
                <CardDescription>Подключение внешних систем (в разработке)</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-2 text-sm text-[var(--color-ink-500)]">
              API для подключения 1C, банковских выписок и внешних складских систем будет добавлен на этапе разработки backend.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[var(--color-ink-500)]">{label}</label>
      {children}
    </div>
  );
}
