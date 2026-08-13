type ClassValue = string | number | false | null | undefined;

/** Join truthy class names. Keeps CSS-module composition readable. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
