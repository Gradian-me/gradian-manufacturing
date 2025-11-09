'use client';

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { cn } from "@/lib/utils";
import { useSidebarState } from "@/lib/hooks/use-sidebar-state";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isOpen } = useSidebarState();
  return (
    <div className="relative flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div
        className={cn(
          "flex min-h-screen flex-1 flex-col transition-[margin-left] duration-300 ease-in-out",
          isOpen ? "lg:ml-72" : "lg:ml-16",
        )}
      >
        <Header />
        <main className="flex flex-1 flex-col">
          <div className="mx-auto flex w-full max-w-[120rem] flex-1 flex-col px-4 py-6 sm:px-6 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

