import { cn } from "@/lib/cn";

/**
 * Mughal pointed arch — the house's signature frame. The same path is used
 * as a CSS mask for the content and as a gilt hairline drawn over it.
 * ViewBox is 100 × 140; any aspect works because the mask stretches.
 */
export const ARCH_PATH =
  "M0,140 L0,54 C0,31 16,15 36,8.5 C42.5,6.4 47.6,3.6 50,0 C52.4,3.6 57.5,6.4 64,8.5 C84,15 100,31 100,54 L100,140 Z";

const ARCH_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 140' preserveAspectRatio='none'><path d='${ARCH_PATH}'/></svg>`,
)}")`;

/** Shared gradients — rendered once in the root layout. */
export function GiltDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute" focusable="false">
      <defs>
        <linearGradient id="arch-gilt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4e8c7" />
          <stop offset="0.45" stopColor="#caa865" />
          <stop offset="1" stopColor="#6f5527" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ArchFrame({
  children,
  className,
  outline = true,
  inset = false,
}: {
  children: React.ReactNode;
  className?: string;
  outline?: boolean;
  /** Draw a second, inset hairline like a carved jharokha. */
  inset?: boolean;
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ WebkitMask: `${ARCH_MASK} center / 100% 100% no-repeat`, mask: `${ARCH_MASK} center / 100% 100% no-repeat` }}
      >
        {children}
      </div>
      {outline && (
        <svg
          aria-hidden="true"
          viewBox="0 0 100 140"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
        >
          <path d={ARCH_PATH} fill="none" stroke="url(#arch-gilt)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          {inset && (
            <path
              d={ARCH_PATH}
              fill="none"
              stroke="url(#arch-gilt)"
              strokeOpacity="0.45"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              transform="translate(5 6) scale(0.9 0.93)"
            />
          )}
        </svg>
      )}
    </div>
  );
}
