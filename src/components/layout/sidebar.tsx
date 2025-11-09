'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useSidebarState } from "@/lib/hooks/use-sidebar-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMemo } from "react";

interface SidebarContentProps {
  onNavigate?: () => void;
}

function SidebarContent({ onNavigate }: SidebarContentProps) {
  const pathname = usePathname();
  const activeHref = useMemo(() => pathname?.split("?")[0] ?? "", [pathname]);

  return (
    <div className="flex h-full flex-col gap-6 px-4 py-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Gradian Manufacturing
        </p>
        <h1 className="text-lg font-semibold text-foreground">
          Operations Portal
        </h1>
      </div>
      <ScrollArea className="-mr-2 pr-2">
        <nav className="space-y-1">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeHref === item.href || activeHref.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition hover:bg-primary",
                  isActive
                    ? "bg-primary text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => {
                  if (onNavigate) {
                    onNavigate();
                  }
                }}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <div className="flex flex-1 flex-col">
                  <span className="font-medium leading-none">{item.title}</span>
                  {item.description ? (
                    <span className="text-xs text-foreground">
                      {item.description}
                    </span>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="mt-auto rounded-lg border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Logged in as</p>
        <p>Mahyar Abidi</p>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { isOpen, setOpen } = useSidebarState();

  return (
    <>
      <aside
        className={cn(
          "hidden h-screen w-72 shrink-0 border-r border-border bg-sidebar transition-all lg:flex",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        aria-label="Primary navigation"
      >
        <SidebarContent />
      </aside>
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-[280px] border-border bg-sidebar px-0 py-0 lg:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Navigate between application areas.</SheetDescription>
          </SheetHeader>
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}

