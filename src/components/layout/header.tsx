'use client';

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { SidebarToggle } from "./sidebar-toggle";
import { NAVIGATION_ITEMS } from "@/lib/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Filter, Search, Sparkles } from "lucide-react";

function useCurrentNav() {
  const pathname = usePathname();
  return useMemo(() => {
    const currentPath = pathname?.split("?")[0] ?? "";
    return (
      NAVIGATION_ITEMS.find(
        (item) =>
          item.href === currentPath ||
          (item.href !== "/" && currentPath.startsWith(`${item.href}/`)),
      ) ?? NAVIGATION_ITEMS[0]
    );
  }, [pathname]);
}

export function Header() {
  const navItem = useCurrentNav();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
      <div className="flex items-center gap-3">
        <SidebarToggle />
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="text-muted-foreground">
                Gradian Manufacturing
              </BreadcrumbItem>
              <BreadcrumbItem>{navItem.title}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="mt-1 text-xs text-muted-foreground">
            {navItem.description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Global search">
          <Search className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Filter">
          <Filter className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button className="hidden sm:inline-flex" variant="default">
          <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
          New Request
        </Button>
      </div>
    </header>
  );
}

