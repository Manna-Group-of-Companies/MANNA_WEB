import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Infinite horizontal marquee. Content is duplicated once and translated -50%,
 * so the loop is seamless without measuring anything at runtime.
 */
export function Marquee({
  children,
  className,
  reverse = false,
  slow = false,
  pauseOnHover = true,
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  slow?: boolean;
  pauseOnHover?: boolean;
}) {
  return (
    <div className={cn("group relative w-full overflow-hidden mask-fade-x", className)}>
      <div
        aria-hidden={false}
        className={cn(
          "flex w-max min-w-full shrink-0 items-center",
          slow ? "animate-[var(--animate-marquee-slow)]" : "animate-[var(--animate-marquee)]",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
