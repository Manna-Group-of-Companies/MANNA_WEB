import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Normalise a string for forgiving search (case/×/x/spaces/punctuation). */
export function normalise(value: string) {
  return value
    .toLowerCase()
    .replace(/×/g, "x")
    .replace(/[\s./_-]+/g, "")
    .trim();
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}

/** Debounce that is safe to use inside React effects. */
export function debounce<A extends unknown[]>(fn: (...args: A) => void, ms = 200) {
  let t: ReturnType<typeof setTimeout>;
  return (...args: A) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export const waLink = (phone: string, text: string) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
