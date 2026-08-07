"use client";

import * as React from "react";

type QuoteState = {
  /** Pre-selected product for the enquiry form. */
  product: string;
  requestQuote: (product?: string) => void;
  setProduct: (product: string) => void;
};

const Ctx = React.createContext<QuoteState | null>(null);

export function useQuote() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useQuote must be used inside <QuoteProvider>");
  return ctx;
}

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = React.useState("");

  const requestQuote = React.useCallback((p?: string) => {
    if (p) setProduct(p);
    requestAnimationFrame(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
      // move focus into the form for keyboard and screen-reader users
      setTimeout(() => {
        document.getElementById("field-name")?.focus({ preventScroll: true });
      }, 700);
    });
  }, []);

  const value = React.useMemo(
    () => ({ product, requestQuote, setProduct }),
    [product, requestQuote],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
