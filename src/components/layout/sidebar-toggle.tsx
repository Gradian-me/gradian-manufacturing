'use client';

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarState } from "@/lib/hooks/use-sidebar-state";

export function SidebarToggle() {
  const { toggle } = useSidebarState();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      onClick={toggle}
      aria-label="Toggle navigation menu"
    >
      <Menu className="h-5 w-5" aria-hidden="true" />
    </Button>
  );
}

