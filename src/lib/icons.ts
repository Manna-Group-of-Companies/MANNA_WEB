import {
  Activity,
  BadgeCheck,
  Bus,
  Disc3,
  Flame,
  Forklift,
  Fuel,
  Gauge,
  HardHat,
  IndianRupee,
  Layers,
  Leaf,
  Mountain,
  Package,
  PiggyBank,
  Recycle,
  ScanSearch,
  Timer,
  Tractor,
  TrendingUp,
  Truck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Content files reference icons by name so the data stays serialisable.
 * Importing the set explicitly (rather than a dynamic lookup on the whole
 * library) keeps tree-shaking effective.
 */
export const ICONS: Record<string, LucideIcon> = {
  Activity,
  BadgeCheck,
  Bus,
  Disc3,
  Flame,
  Forklift,
  Fuel,
  Gauge,
  HardHat,
  IndianRupee,
  Layers,
  Leaf,
  Mountain,
  Package,
  PiggyBank,
  Recycle,
  ScanSearch,
  Timer,
  Tractor,
  TrendingUp,
  Truck,
  Users,
  Wrench,
};

export function getIcon(name: string): LucideIcon {
  return ICONS[name] ?? BadgeCheck;
}
