import type { ComponentType, SVGProps } from "react";
import { Gauge, Network, Package, Settings, TableProperties } from "lucide-react";

export interface NavigationItem {
  href: string;
  title: string;
  description?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    href: "/dashboard",
    title: "Dashboard",
    description: "KPIs, throughput, and cost variance",
    icon: Gauge,
  },
  {
    href: "/opc",
    title: "OPC",
    description: "Operation process chart visualisation",
    icon: Network,
  },
  {
    href: "/templates",
    title: "Templates",
    description: "Device templates, BOMs, and routings",
    icon: TableProperties,
  },
  {
    href: "/manufacturing",
    title: "Manufacturing",
    description: "Manufacturing orders and execution logs",
    icon: Package,
  },
  {
    href: "/admin",
    title: "Admin",
    description: "Master data management",
    icon: Settings,
  },
];

