import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: TabsPrimitive.TabsListProps) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-[var(--color-surface-muted)] p-1 border border-[var(--color-border)]",
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: TabsPrimitive.TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-ink-500)] transition-colors",
        "data-[state=active]:bg-[var(--color-surface)] data-[state=active]:text-[var(--color-ink-900)] data-[state=active]:shadow-[var(--shadow-card)]",
        "hover:text-[var(--color-ink-900)]",
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: TabsPrimitive.TabsContentProps) {
  return <TabsPrimitive.Content className={cn("mt-5 focus:outline-none", className)} {...props} />;
}
