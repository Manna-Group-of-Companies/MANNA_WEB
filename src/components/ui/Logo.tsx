import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * ── Brand lockup ──────────────────────────────────────────────
 *
 * The MANNA Group mark is a wide wordmark: an outlined ellipse around
 * "MANNA", with "MA" and the final "A" in brand orange, "NN" in graphite,
 * "Group" bottom-right and ® top-right.
 *
 * Rendered as inline SVG (not an <img>) so it picks up the loaded display
 * font, uses `currentColor` for the graphite parts, and stays legible in dark
 * mode from a single asset.
 *
 * Sizing is driven entirely by CSS height classes — pass e.g.
 * `className="h-11 lg:h-14"`. Width follows the viewBox. Never set an inline
 * height here: it would beat the responsive classes.
 *
 * ▸ CURRENT ASSET
 *   The supplied artwork is raster, so `currentColor` is not available and the
 *   graphite half is baked in. Two files are shipped instead: the original, and
 *   a variant whose achromatic pixels are lifted to near-white for near-black
 *   backgrounds. Callers on a dark surface pass `onDark`; everything else
 *   follows the theme via `dark:` classes.
 *
 *   Replace both with a vector when one is available — then a single file with
 *   `currentColor` graphite can serve every case and `onDark` becomes dead.
 */
const REAL_LOGO = true;
const LOGO_SRC = "/brand/manna-group.png";
const LOGO_SRC_DARK = "/brand/manna-group-dark.png";
/**
 * Only establishes the aspect ratio — CSS classes control rendered size.
 * Both files are trimmed flush to the artwork: the supplied original carried
 * ~28% transparent margin, which ate into every height class it was given.
 * Spacing comes from the flex gap at each call site instead.
 */
const INTRINSIC = { width: 158, height: 60 };

function WordmarkSvg({ className, title }: { className?: string; title: string }) {
  return (
    <svg
      viewBox="0 0 286 150"
      className={className}
      role="img"
      aria-label={title}
      // graphite in light mode, near-white in dark
      style={{ color: "var(--logo-graphite, #4a4a4c)" }}
    >
      <ellipse
        cx="134"
        cy="62"
        rx="128"
        ry="54"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
      />
      {/*
        textLength pins the wordmark to an exact width, so the layout can't
        break if the display font hasn't loaded yet or falls back.
      */}
      <text
        x="134"
        y="83"
        textAnchor="middle"
        textLength="210"
        lengthAdjust="spacingAndGlyphs"
        fontFamily="var(--font-sora), ui-sans-serif, system-ui, sans-serif"
        fontSize="60"
        fontWeight="800"
      >
        <tspan fill="var(--color-brand-500)">MA</tspan>
        <tspan fill="currentColor">NN</tspan>
        <tspan fill="var(--color-brand-500)">A</tspan>
      </text>
      <text
        x="270"
        y="142"
        textAnchor="end"
        textLength="78"
        lengthAdjust="spacingAndGlyphs"
        fontFamily="var(--font-sora), ui-sans-serif, system-ui, sans-serif"
        fontSize="30"
        fontWeight="700"
        fill="currentColor"
      >
        Group
      </text>
      <text
        x="272"
        y="26"
        textAnchor="end"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize="16"
        fill="currentColor"
      >
        ®
      </text>
    </svg>
  );
}

/**
 * Wide brand lockup.
 *
 * @param className must carry the height, e.g. `h-11 lg:h-14`.
 * @param onDark for surfaces that are near-black in *both* themes (footer, the
 *   loader curtain, the navbar while over the hero). Without it the lockup
 *   tracks the theme instead.
 */
export function Logo({
  className,
  title = "MANNA Group",
  priority,
  onDark,
}: {
  className?: string;
  title?: string;
  priority?: boolean;
  onDark?: boolean;
}) {
  if (REAL_LOGO) {
    const common = cn("h-11 w-auto", className);
    const img = (src: string, extra?: string) => (
      <Image
        src={src}
        alt={title}
        width={INTRINSIC.width}
        height={INTRINSIC.height}
        priority={priority}
        /*
          The optimizer re-encodes to AVIF/WebP at srcset widths, which on a
          158px source only costs detail — and it was serving a 79px variant
          into a ~147px slot. These files are already small and a fixed size,
          so ship the bytes as-is.
        */
        unoptimized
        className={cn(common, extra)}
      />
    );

    // Pinned to a dark surface — one file, no theme-dependent swap.
    if (onDark) return img(LOGO_SRC_DARK);

    /*
      Theme is a runtime `.dark` class, so the swap has to happen in CSS rather
      than here. Both files are ~16KB and the hidden one isn't decoded.
    */
    return (
      <>
        {img(LOGO_SRC, "dark:hidden")}
        {img(LOGO_SRC_DARK, "hidden dark:block")}
      </>
    );
  }

  return <WordmarkSvg title={title} className={cn("h-11 w-auto", className)} />;
}

/**
 * Square mark for tight slots — the wordmark is ~2:1 and can't square well,
 * so this is the MANNA "M" on a brand tile. Same geometry as the generated
 * favicon (`public/icon.svg`); keep the two in sync.
 *
 * The M is a stroked polyline with round caps and joins: thick rounded
 * strokes, stems splaying outward at the baseline, middle vertex descending
 * past centre. No font dependency, so it stays exact at 16px.
 */
export function LogoMark({
  className,
  size = 40,
  /** 0 for a flat square (matches the favicon); default is app-tile rounding. */
  radius = 96,
}: {
  className?: string;
  size?: number;
  radius?: number;
}) {
  return (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="MANNA Group"
    >
      <rect width="512" height="512" rx={radius || undefined} fill="var(--color-brand-500)" />
      <path
        d="M146 356 L180 148 L256 324 L332 148 L366 356"
        fill="none"
        stroke="#ffffff"
        strokeWidth="94"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
