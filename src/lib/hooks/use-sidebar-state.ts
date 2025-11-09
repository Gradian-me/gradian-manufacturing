'use client';

import { useEffect } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SidebarState {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      isOpen: true,
      setOpen: (open) => set({ isOpen: open }),
      toggle: () => set({ isOpen: !get().isOpen }),
    }),
    {
      name: "gradian-sidebar-state",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function useSidebarState() {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const setOpen = useSidebarStore((state) => state.setOpen);
  const toggle = useSidebarStore((state) => state.toggle);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const update = () => {
      if (mediaQuery.matches) {
        setOpen(false);
      }
    };

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, [setOpen]);

  return { isOpen, setOpen, toggle };
}

