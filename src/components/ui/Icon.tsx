import { BadgeCheck } from "lucide-react";
import { ICONS } from "@/lib/icons";

/**
 * Renders a lucide icon by name from the curated {@link ICONS} map.
 *
 * Content files store icon *names* so they stay serialisable; resolving via a
 * record lookup inside a component (rather than assigning the result of a
 * function call to a capitalised local during render) keeps the React
 * compiler's component-creation rule satisfied.
 */
export function Icon({
  name,
  className,
  label,
}: {
  name: string;
  className?: string;
  /** Supply only when the icon carries meaning on its own. */
  label?: string;
}) {
  const Glyph = ICONS[name] ?? BadgeCheck;
  return (
    <Glyph
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    />
  );
}
