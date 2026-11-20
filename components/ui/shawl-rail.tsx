"use client";

/**
 * Shawl Rail — adapted from the 21st.dev "Product Rail Gallery – Fashion Store
 * Hero" (@dhxwhy/product-rail-gallery). The rail physics, hanger swing, drag,
 * keyboard roving focus and lift-to-inspect dialog are the original component;
 * the garment illustrations were replaced with a draped-shawl renderer that
 * takes a woven texture, a palla (border) and a hand-knotted fringe, and the
 * price tag became a craft label. Real cut-out photography can be dropped in
 * later through `image` / `backImage` / `sideImage`.
 */

import * as React from "react";
import { createPortal } from "react-dom";

export interface RailShawl {
  id: string;
  name: string;
  description?: string;
  /** Hang-tag text — the craft label, never a price. */
  tag?: string;
  details?: string[];
  color: string;
  texture?: string;
  textureOpacity?: number;
  border: { color: string; texture?: string };
  /** Optional transparent cut-out photos (200 × 310 canvas) once the shoot is done. */
  image?: string;
  backImage?: string;
  sideImage?: string;
}

export interface ShawlRailLabels {
  front: string;
  back: string;
  close: string;
  show: string;
}

export interface ShawlRailProps extends Omit<React.ComponentProps<"section">, "children"> {
  items: RailShawl[];
  eyebrow?: React.ReactNode;
  heading?: string;
  caption?: string;
  action?: React.ReactNode;
  /** Rendered inside the detail dialog under the facts, e.g. an inquiry CTA. */
  renderDetailAction?: (item: RailShawl, close: () => void) => React.ReactNode;
  autoplay?: boolean;
  interval?: number;
  hanger?: "wood" | "brass" | "matte" | "none";
  labels?: ShawlRailLabels;
  /** Class applied to the portalled dialog so it inherits the section theme. */
  dialogClassName?: string;
  onOpenChange?: (index: number | null) => void;
}

const VB_W = 200;
const VB_H = 310;
const ASPECT = VB_W / VB_H;
const HOOK_TOP = 4;
const RAIL_R = 4.6;
/** Resting shawls hang at a gentle three-quarter turn (left edge toward the viewer), so the
 *  fold over the hanger, the palla border and the fringe read before any hover. */
const REST = 46;
const PERSPECTIVE = 1100;
const GAP = 0.035;
const FRONT_W = 0.84;
/** Rail space a resting shawl takes, as a share of its box width. */
const SIDE_W = 0.46;
const MAX_H = 440;
const MIN_WIDE_H = 210;
const CAROUSEL_H = 360;
const HEM = 302;
const DEFAULT_LABELS: ShawlRailLabels = { front: "Front", back: "Reverse", close: "Close", show: "Show" };

/* ------------------------------------------------------------------ */
/* Shawl geometry (viewBox 200 × 310)                                  */
/* ------------------------------------------------------------------ */

/* The long panel falls in five soft pleats, so its hem and border scallop gently. */
const PLEAT = 28;
const HEM_Y = 286;
const HEM_AMP = 2.4;
const BORDER_Y = 266;
const BORDER_AMP = 1.8;

function wave(x: number, amp: number) {
  return amp * Math.sin(((x - 30) / PLEAT) * Math.PI * 2);
}

/** " L x,y" segments tracing a pleated edge from x0 to x1 (x0 itself excluded). */
function waveSegments(x0: number, x1: number, base: number, amp: number, steps = 40) {
  let d = "";
  for (let k = 1; k <= steps; k++) {
    const x = x0 + ((x1 - x0) * k) / steps;
    d += ` L${x.toFixed(2)},${(base + wave(x, amp)).toFixed(2)}`;
  }
  return d;
}

const BACK_PANEL = `M34,60 C40,50 66,38 100,35 C134,38 160,50 166,60 L170,${(HEM_Y + wave(170, HEM_AMP)).toFixed(2)}${waveSegments(170, 30, HEM_Y, HEM_AMP)} Z`;
const BACK_BORDER = `M30.8,${(BORDER_Y + wave(30.8, BORDER_AMP)).toFixed(2)}${waveSegments(30.8, 169.2, BORDER_Y, BORDER_AMP)} L170,${(HEM_Y + wave(170, HEM_AMP)).toFixed(2)}${waveSegments(170, 30, HEM_Y, HEM_AMP)} Z`;
const FRONT_PANEL = "M37,63 C43,53 68,41.5 100,39 C132,41.5 157,53 163,63 L164.6,236 L35.4,206 Z";
const FRONT_BORDER = "M35.6,190 L164.4,220 L164.6,236 L35.4,206 Z";
const SILHOUETTE = "M34,60 C40,50 66,38 100,35 C134,38 160,50 166,60 L170,302 L30,302 Z";

/** Pleat valleys (shadow) and ridges (light), aligned with the scalloped hem. */
function pleatLine(x: number) {
  const top = 70 + Math.abs(x - 100) * 0.08;
  const xt = x + (100 - x) * 0.14;
  return `M${xt.toFixed(1)},${top.toFixed(1)} C${xt.toFixed(1)},${(top + 80).toFixed(1)} ${(x + Math.sin(x) * 1.6).toFixed(1)},200 ${x.toFixed(1)},${(HEM_Y + wave(x, HEM_AMP) - 1).toFixed(1)}`;
}
const PLEAT_VALLEYS = [0, 1, 2, 3, 4].map((k) => pleatLine(30 + PLEAT * (k + 0.75)));
const PLEAT_RIDGES = [0, 1, 2, 3, 4].map((k) => pleatLine(30 + PLEAT * (k + 0.25)));
const FOLDS_FRONT = ["M62,66 C58,120 64,170 60,212", "M138,66 C142,122 136,180 140,228", "M100,56 C98,120 102,170 99,220", "M80,90 C78,140 82,180 79,216", "M120,74 C122,130 118,176 121,222"];
const TOP_WRAP = "M38,58 C44,49 68,40 100,37.5 C132,40 156,49 162,58";

function fringeLines(x0: number, y0: number, x1: number, y1: number, step = 2.7, length = 14, waveAmp = 0) {
  const lines: string[] = [];
  const dx = x1 - x0;
  const dy = y1 - y0;
  const count = Math.max(2, Math.round(Math.hypot(dx, dy) / step));
  for (let k = 0; k <= count; k++) {
    const t = k / count;
    const x = x0 + dx * t;
    const y = y0 + dy * t + wave(x, waveAmp);
    const len = length * (0.82 + 0.28 * Math.abs(Math.sin(k * 12.9898) % 1));
    const sway = Math.sin(k * 1.7) * 1.4;
    lines.push(`M${x.toFixed(1)},${(y - 0.5).toFixed(1)} q${(sway * 0.5).toFixed(2)},${(len * 0.55).toFixed(1)} ${sway.toFixed(2)},${len.toFixed(1)}`);
  }
  return lines;
}

const FRINGE_BACK = fringeLines(31, HEM_Y, 169, HEM_Y, 2.7, 14, HEM_AMP);
const FRINGE_FRONT = fringeLines(36, 206, 164, 236, 2.7, 12);

const maskCache = new Map<string, string>();
function silhouetteMask() {
  const cached = maskCache.get("shawl");
  if (cached) return cached;
  const url = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${VB_W} ${VB_H}' preserveAspectRatio='xMidYMin meet'><path d='${SILHOUETTE}'/></svg>`)}")`;
  maskCache.set("shawl", url);
  return url;
}

function mix(color: string, amount: number) {
  if (amount === 0) return color;
  const keep = Math.round((1 - Math.min(1, Math.abs(amount))) * 1000) / 10;
  return `color-mix(in oklab, ${color} ${keep}%, ${amount > 0 ? "white" : "black"})`;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function lambert(angle: number) {
  const r = (angle * Math.PI) / 180;
  const diffuse = Math.max(0, Math.sin(r) * 0.42 + Math.cos(r) * 0.91);
  return 0.66 + 0.34 * diffuse;
}

/* ------------------------------------------------------------------ */
/* Shared SVG definitions                                              */
/* ------------------------------------------------------------------ */

function Defs({ uid, items }: { uid: string; items: RailShawl[] }) {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute" focusable="false">
      <defs>
        {items.map((item, i) => (
          <React.Fragment key={item.id}>
            {item.texture && (
              <>
                <pattern id={`${uid}-tex-${i}`} patternUnits="userSpaceOnUse" x="-30" y="-45" width="260" height="400">
                  <image href={item.texture} width="260" height="400" preserveAspectRatio="xMidYMid slice" />
                </pattern>
                <pattern id={`${uid}-tex2-${i}`} patternUnits="userSpaceOnUse" x="-50" y="-80" width="270" height="410">
                  <image href={item.texture} width="270" height="410" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </>
            )}
            {item.border.texture && (
              <pattern id={`${uid}-bord-${i}`} patternUnits="userSpaceOnUse" width="44" height="44">
                <image href={item.border.texture} width="44" height="44" preserveAspectRatio="xMidYMid slice" />
              </pattern>
            )}
          </React.Fragment>
        ))}
        <clipPath id={`${uid}-clip-back`}><path d={BACK_PANEL} /></clipPath>
        <clipPath id={`${uid}-clip-front`}><path d={FRONT_PANEL} /></clipPath>
        {/* Pleats gather softly under the hanger and deepen toward the hem */}
        <linearGradient id={`${uid}-pleatfade`} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="56" y2="190">
          <stop offset="0" stopColor="white" stopOpacity="0.3" />
          <stop offset="1" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id={`${uid}-pleatmask`} maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
          <rect width={VB_W} height={VB_H} fill={`url(#${uid}-pleatfade)`} />
        </mask>
        {/* Warm rim light: brightest on the near (left) edge, a faint glow on the far one */}
        <linearGradient id={`${uid}-rim`} gradientUnits="userSpaceOnUse" x1="30" x2="170" y1="0" y2="0">
          <stop offset="0" stopColor="#ffe2a6" stopOpacity="0.75" />
          <stop offset="0.1" stopColor="#ffe2a6" stopOpacity="0" />
          <stop offset="0.9" stopColor="#ffcf86" stopOpacity="0" />
          <stop offset="1" stopColor="#ffcf86" stopOpacity="0.32" />
        </linearGradient>
        <linearGradient id={`${uid}-brassbar`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff1c9" />
          <stop offset="0.3" stopColor="#dcbf7f" />
          <stop offset="0.7" stopColor="#9b7638" />
          <stop offset="1" stopColor="#5c451f" />
        </linearGradient>
        <linearGradient id={`${uid}-volume`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="black" stopOpacity="0.42" />
          <stop offset="0.16" stopColor="black" stopOpacity="0.1" />
          <stop offset="0.42" stopColor="white" stopOpacity="0.08" />
          <stop offset="0.58" stopColor="white" stopOpacity="0.04" />
          <stop offset="0.84" stopColor="black" stopOpacity="0.14" />
          <stop offset="1" stopColor="black" stopOpacity="0.46" />
        </linearGradient>
        <linearGradient id={`${uid}-drape`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0.14" />
          <stop offset="0.2" stopColor="white" stopOpacity="0" />
          <stop offset="0.75" stopColor="black" stopOpacity="0.05" />
          <stop offset="1" stopColor="black" stopOpacity="0.26" />
        </linearGradient>
        <linearGradient id={`${uid}-wood`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#8a5f3c" />
          <stop offset="0.45" stopColor="#5a3b22" />
          <stop offset="1" stopColor="#2f1d10" />
        </linearGradient>
        <linearGradient id={`${uid}-brass`} gradientUnits="userSpaceOnUse" x1="98.5" x2="101.7" y1="0" y2="0">
          <stop offset="0" stopColor="#a68548" />
          <stop offset="0.35" stopColor="#fff1c9" />
          <stop offset="0.78" stopColor="#7d5f2c" />
          <stop offset="1" stopColor="#caa865" />
        </linearGradient>
        <pattern id={`${uid}-twill`} width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <rect width="1.1" height="3" fill="black" fillOpacity="0.16" />
          <rect x="1.4" width="0.6" height="3" fill="white" fillOpacity="0.06" />
        </pattern>
        <filter id={`${uid}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.55" />
          </feComponentTransfer>
        </filter>
        <filter id={`${uid}-soft`} x="-20%" y="-5%" width="140%" height="110%">
          <feGaussianBlur stdDeviation="3.4" />
        </filter>
      </defs>
    </svg>
  );
}

const HOOK = "M100,36 L100,-0.4 C100,-3.4 102.2,-4.2 103.9,-2.8 C104.9,-2 105.4,-1.2 105.6,-0.2";
const HOOK_HI = "M99.5,30 L99.5,-0.2 C99.5,-2.4 101,-3.2 102.4,-2.6";
const BAR = "M38,57 Q70,38 100,36 Q130,38 162,57";
const BAR_HI = "M40,54.5 Q71,35.5 100,33.5 Q129,35.5 160,54.5";

function Hook({ uid }: { uid: string }) {
  return (
    <>
      <path d={HOOK} fill="none" stroke="black" strokeOpacity="0.32" strokeWidth="3.4" strokeLinecap="round" transform="translate(0.9 1.1)" />
      <path d={HOOK} fill="none" stroke={`url(#${uid}-brass)`} strokeWidth="2.6" strokeLinecap="round" />
      <path d={HOOK_HI} fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="0.6" strokeLinecap="round" />
      <ellipse cx="105.9" cy="0.6" rx="1.9" ry="0.9" fill="black" fillOpacity="0.4" />
      <rect x="96" y="27" width="8" height="9" rx="2" fill={`url(#${uid}-brass)`} />
      <rect x="97.2" y="28.2" width="2" height="6.6" rx="1" fill="white" fillOpacity="0.45" />
    </>
  );
}

type HangerMaterial = "wood" | "brass" | "matte" | "none";

function barPaint(uid: string, material: HangerMaterial) {
  if (material === "wood") return `url(#${uid}-wood)`;
  if (material === "brass") return `url(#${uid}-brassbar)`;
  return "currentColor";
}

function Hanger({ uid, material }: { uid: string; material: HangerMaterial }) {
  if (material === "none") return null;
  const brass = material === "brass";
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMin meet" className={`absolute inset-0 size-full overflow-visible ${material === "matte" ? "text-foreground/85" : ""}`}>
      <path d={BAR} fill="none" stroke="black" strokeOpacity="0.25" strokeWidth={brass ? 7.5 : 9.5} strokeLinecap="round" transform="translate(0.6 1.6)" />
      <path d={BAR} fill="none" stroke={barPaint(uid, material)} strokeWidth={brass ? 6.5 : 8.5} strokeLinecap="round" />
      <path d={BAR_HI} fill="none" stroke="white" strokeOpacity={material === "wood" ? 0.26 : brass ? 0.5 : 0.14} strokeWidth={brass ? 0.9 : 1.1} strokeLinecap="round" />
      <Hook uid={uid} />
    </svg>
  );
}

function SideHanger({ uid, material }: { uid: string; material: HangerMaterial }) {
  if (material === "none") return null;
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMin meet" className={`absolute inset-0 size-full overflow-visible ${material === "matte" ? "text-foreground/85" : ""}`}>
      <path d="M97.8,35 L102.2,35 L104.5,50 L95.5,50 Z" fill={barPaint(uid, material)} />
      <path d="M98.6,36 L100,36 L100,49 L97.3,49 Z" fill="white" fillOpacity="0.2" />
      <Hook uid={uid} />
    </svg>
  );
}

/** Cloth fill: base colour, woven texture, twill and grain, clipped to a panel. */
function Cloth({ uid, index, item, clip, alt = false }: { uid: string; index: number; item: RailShawl; clip: string; alt?: boolean }) {
  return (
    <g clipPath={`url(#${uid}-clip-${clip})`}>
      <rect width={VB_W} height={VB_H} fill={item.color} />
      {item.texture && <rect width={VB_W} height={VB_H} fill={`url(#${uid}-${alt ? "tex2" : "tex"}-${index})`} opacity={item.textureOpacity ?? 1} />}
      <rect width={VB_W} height={VB_H} fill={`url(#${uid}-twill)`} opacity={item.texture ? 0.45 : 1} />
    </g>
  );
}

function Border({ uid, index, item, d }: { uid: string; index: number; item: RailShawl; d: string }) {
  return (
    <>
      <path d={d} fill={item.border.color} />
      {item.border.texture && <path d={d} fill={`url(#${uid}-bord-${index})`} opacity="0.92" />}
      <path d={d} fill="none" stroke={mix(item.border.color, 0.35)} strokeOpacity="0.5" strokeWidth="0.5" />
    </>
  );
}

function Fringe({ lines, color }: { lines: string[]; color: string }) {
  return (
    <g fill="none" strokeLinecap="round">
      {lines.map((d) => <path key={d} d={d} stroke={mix(color, -0.25)} strokeWidth="1.15" />)}
      {lines.map((d, k) => (k % 2 ? null : <path key={`${d}-hi`} d={d} stroke={mix(color, 0.25)} strokeOpacity="0.45" strokeWidth="0.45" />))}
    </g>
  );
}

function ShawlFace({ uid, index, item, side }: { uid: string; index: number; item: RailShawl; side: "front" | "back" }) {
  const soft = `url(#${uid}-soft)`;
  const fringeColor = item.border.texture ? item.color : item.border.color;
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMin meet" className="absolute inset-0 size-full overflow-visible">
      {/* Long panel, falling in soft pleats */}
      <Fringe lines={FRINGE_BACK} color={fringeColor} />
      <Cloth uid={uid} index={index} item={item} clip="back" />
      <g clipPath={`url(#${uid}-clip-back)`}>
        <Border uid={uid} index={index} item={item} d={BACK_BORDER} />
        {/* --pleat is set per frame: folds read deeper while the shawl hangs turned, softer when it faces you */}
        <g mask={`url(#${uid}-pleatmask)`} style={{ opacity: "var(--pleat, 0.8)" }}>
          <g filter={soft} fill="none" strokeLinecap="round">
            {PLEAT_VALLEYS.map((d) => <path key={d} d={d} stroke="black" strokeOpacity="0.34" strokeWidth="10" />)}
            {PLEAT_RIDGES.map((d) => <path key={d} d={d} stroke="#fff3da" strokeOpacity="0.17" strokeWidth="7" />)}
          </g>
        </g>
        {side === "front" && (
          <g filter={soft} fill="none" strokeLinecap="round">
            <path d="M35,212 L165,242" stroke="black" strokeOpacity="0.55" strokeWidth="10" />
          </g>
        )}
        <rect width={VB_W} height={VB_H} fill={`url(#${uid}-volume)`} />
        <rect width={VB_W} height={VB_H} fill={`url(#${uid}-drape)`} />
        <rect width={VB_W} height={VB_H} filter={`url(#${uid}-grain)`} opacity="0.18" style={{ mixBlendMode: "multiply" }} />
        {side === "back" && <rect width={VB_W} height={VB_H} fill="black" opacity="0.12" />}
        {/* Warm rim light along the edges */}
        <path d={BACK_PANEL} fill="none" stroke={`url(#${uid}-rim)`} strokeWidth="7" filter={soft} />
      </g>

      {side === "front" && (
        <>
          {/* Fold falling over the hanger */}
          <Fringe lines={FRINGE_FRONT} color={fringeColor} />
          <Cloth uid={uid} index={index} item={item} clip="front" alt />
          <g clipPath={`url(#${uid}-clip-front)`}>
            <Border uid={uid} index={index} item={item} d={FRONT_BORDER} />
            <g filter={soft} fill="none" strokeLinecap="round" style={{ opacity: "var(--pleat, 0.8)" }}>
              {FOLDS_FRONT.map((d) => <path key={d} d={d} stroke="black" strokeOpacity="0.24" strokeWidth="8" />)}
              {FOLDS_FRONT.map((d) => <path key={`${d}-hi`} d={d} stroke="#fff3da" strokeOpacity="0.13" strokeWidth="4.5" transform="translate(5 0)" />)}
            </g>
            <rect width={VB_W} height={VB_H} fill={`url(#${uid}-volume)`} />
            <rect width={VB_W} height={VB_H} fill={`url(#${uid}-drape)`} />
            <rect width={VB_W} height={VB_H} filter={`url(#${uid}-grain)`} opacity="0.18" style={{ mixBlendMode: "multiply" }} />
            <path d={FRONT_PANEL} fill="none" stroke={`url(#${uid}-rim)`} strokeWidth="6" filter={soft} />
          </g>
        </>
      )}
      <path d={TOP_WRAP} fill="none" stroke="#ffe9c4" strokeOpacity="0.3" strokeWidth="2.4" strokeLinecap="round" filter={soft} />
    </svg>
  );
}

function Photo({ src, alt, full }: { src: string; alt: string; full: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element -- masked, physics-driven cut-out; next/image adds wrappers that break the mask
  return <img src={src} alt={alt} draggable={false} className={`pointer-events-none absolute inset-x-0 bottom-0 size-auto w-full select-none object-contain object-top ${full ? "top-0 h-full" : "top-[8%] h-[92%]"}`} />;
}

/* ------------------------------------------------------------------ */
/* Physics                                                             */
/* ------------------------------------------------------------------ */

type Sim = {
  x: number[]; vx: number[]; tx: number[]; px: number[];
  turn: number[]; vturn: number[]; tturn: number[];
  swing: number[]; vswing: number[];
  tag: number[]; vtag: number[];
  drag: number; grab: number; free: number; last: number; raf: number;
};

function emptySim(): Sim {
  return { x: [], vx: [], tx: [], px: [], turn: [], vturn: [], tturn: [], swing: [], vswing: [], tag: [], vtag: [], drag: -1, grab: 0, free: 0, last: 0, raf: 0 };
}

function footprint(h: number, angle: number, sideW = 0.4) {
  const e = clamp(1 - angle / REST, 0, 1);
  const ease = e * e * (3 - 2 * e);
  return h * ASPECT * (sideW + (FRONT_W - sideW) * ease);
}

export function ShawlRail({
  items,
  eyebrow,
  heading,
  caption,
  action,
  renderDetailAction,
  autoplay = false,
  interval = 2800,
  hanger = "wood",
  labels = DEFAULT_LABELS,
  dialogClassName,
  onOpenChange,
  className,
  ...rest
}: ShawlRailProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const count = items.length;
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const slots = React.useRef<(HTMLButtonElement | null)[]>([]);
  const swings = React.useRef<(HTMLSpanElement | null)[]>([]);
  const turns = React.useRef<(HTMLSpanElement | null)[]>([]);
  const sides = React.useRef<(HTMLSpanElement | null)[]>([]);
  const drapes = React.useRef<(HTMLSpanElement | null)[]>([]);
  const shades = React.useRef<(HTMLSpanElement | null)[]>([]);
  const shadows = React.useRef<(HTMLSpanElement | null)[]>([]);
  const tags = React.useRef<(HTMLSpanElement | null)[]>([]);
  const sim = React.useRef(emptySim());
  const [size, setSize] = React.useState({ width: 0, h: 300, carousel: false });
  const [active, setActive] = React.useState<number | null>(null);
  const [focusIndex, setFocusIndex] = React.useState(0);
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const [reduced, setReduced] = React.useState(false);
  const [playing, setPlaying] = React.useState(autoplay);
  const [visible, setVisible] = React.useState(false);
  const [lifted, setLifted] = React.useState<number | null>(null);
  const returnFocus = React.useRef<number | null>(null);
  const pendingOpen = React.useRef(-1);
  const pointer = React.useRef({ id: -1, index: -1, x: 0, y: 0, t: 0, moved: false, kind: "", swipe: 0, lastX: 0, lastT: 0, v: 0 });
  const sideWidths = React.useMemo(() => items.map((item) => (item.image ? (item.sideImage ? 0.3 : 0.4) : SIDE_W)), [items]);
  const live = React.useRef({ active: null as number | null, size, reduced, count, openIndex: null as number | null, carouselIndex: 0, sideWidths });
  React.useLayoutEffect(() => {
    live.current = { ...live.current, active, size, reduced, count, openIndex, sideWidths };
  });

  const carouselIndex = size.carousel ? (active ?? live.current.carouselIndex) : null;

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting), { threshold: 0.35 });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  React.useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = (width: number) => {
      const sideW = live.current.sideWidths.reduce((sum, w) => sum + w, 0) / Math.max(1, live.current.sideWidths.length);
      const restK = footprint(1, REST, sideW) + GAP;
      const activeK = footprint(1, 0, sideW) + GAP;
      const fit = (width - 24) / (count * restK + (activeK - restK));
      const carousel = fit < MIN_WIDE_H;
      const h = carousel ? Math.min(CAROUSEL_H, Math.max(240, width * 0.9)) : Math.min(MAX_H, fit);
      setSize((old) => (Math.abs(old.width - width) < 0.5 && old.carousel === carousel && Math.abs(old.h - h) < 0.5 ? old : { width, h: Math.round(h), carousel }));
    };
    measure(stage.clientWidth);
    const observer = new ResizeObserver((entries) => {
      const box = entries[0];
      if (box) measure(box.contentRect.width);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [count]);

  const targets = React.useCallback((h: number, width: number, carousel: boolean, front: number | null) => {
    const feet = items.map((_, i) => footprint(h, i === front ? 0 : REST, sideWidths[i]) + h * GAP);
    if (carousel) {
      const centre = front ?? 0;
      const xs = feet.map(() => 0);
      xs[centre] = width / 2;
      for (let i = centre + 1; i < feet.length; i++) xs[i] = (xs[i - 1] ?? 0) + ((feet[i - 1] ?? 0) + (feet[i] ?? 0)) / 2;
      for (let i = centre - 1; i >= 0; i--) xs[i] = (xs[i + 1] ?? 0) - ((feet[i + 1] ?? 0) + (feet[i] ?? 0)) / 2;
      return xs;
    }
    const total = feet.reduce((sum, f) => sum + f, 0);
    let cursor = (width - total) / 2;
    return feet.map((f) => {
      const x = cursor + f / 2;
      cursor += f;
      return x;
    });
  }, [items, sideWidths]);

  const paint = React.useCallback((i: number) => {
    const s = sim.current;
    const { h } = live.current.size;
    const w = h * ASPECT;
    const slot = slots.current[i];
    if (!slot) return;
    const angle = s.turn[i] ?? REST;
    const swing = s.swing[i] ?? 0;
    slot.style.transform = `translate3d(${((s.x[i] ?? 0) - w / 2).toFixed(2)}px,0,0)`;
    const sw = swings.current[i];
    if (sw) sw.style.transform = `rotate(${swing.toFixed(3)}deg)`;
    const e = clamp(1 - angle / REST, 0, 1);
    const tu = turns.current[i];
    const sd = sides.current[i];
    if (tu) {
      tu.style.transform = `perspective(${PERSPECTIVE}px) rotateY(${angle.toFixed(2)}deg)`;
      tu.style.opacity = sd ? clamp((e - 0.44) / 0.12, 0, 1).toFixed(3) : "1";
      // Folds read deeper while the shawl hangs turned, and relax as it swings to face you.
      tu.style.setProperty("--pleat", (0.62 + 0.38 * (1 - e)).toFixed(3));
    }
    if (sd) {
      // Only photo cut-outs with a dedicated side shot use the side face.
      sd.style.opacity = clamp((0.56 - e) / 0.12, 0, 1).toFixed(3);
      sd.style.transform = `perspective(${PERSPECTIVE}px) rotateY(${(Math.min(1, e * 2) * 84 * Math.sign(REST)).toFixed(2)}deg)`;
    }
    const lag = clamp(-(s.vswing[i] ?? 0) * 0.018, -5, 5);
    const dr = drapes.current[i];
    if (dr) dr.style.setProperty("--drape", `${lag.toFixed(3)}deg`);
    const sh = shades.current[i];
    if (sh) sh.style.setProperty("--shade", (1 - lambert(angle)).toFixed(3));
    const shadow = shadows.current[i];
    if (shadow) shadow.style.transform = `translate3d(${(w * 0.05).toFixed(1)}px, ${(h * 0.035).toFixed(1)}px, 0) scaleX(${Math.max(0.12, Math.abs(Math.cos((angle * Math.PI) / 180))).toFixed(3)})`;
    const tag = tags.current[i];
    if (tag) tag.style.transform = `rotate(${(-12 + (s.tag[i] ?? 0)).toFixed(2)}deg)`;
  }, []);

  const step = React.useCallback(function stepFrame(now: number) {
    const s = sim.current;
    const n = live.current.count;
    const dt = s.last ? Math.min(0.034, (now - s.last) / 1000) : 1 / 60;
    s.last = now;
    const { h, width, carousel } = live.current.size;
    let busy = false;
    const sub = 2;
    const sdt = dt / sub;
    for (let k = 0; k < sub; k++) {
      for (let i = 0; i < n; i++) {
        const before = s.vx[i] ?? 0;
        if (i !== s.drag) {
          const restoring = now > s.free;
          const stiff = restoring ? 130 : 0;
          const damp = restoring ? 2 * Math.sqrt(130) * 0.86 : 3.2;
          const ax = -stiff * ((s.x[i] ?? 0) - (s.tx[i] ?? 0)) - damp * before;
          s.vx[i] = before + ax * sdt;
          s.x[i] = (s.x[i] ?? 0) + (s.vx[i] ?? 0) * sdt;
        }
        const accel = ((s.vx[i] ?? 0) - before) / sdt;
        const ta = -150 * ((s.turn[i] ?? 0) - (s.tturn[i] ?? 0)) - 2 * Math.sqrt(150) * 0.78 * (s.vturn[i] ?? 0);
        s.vturn[i] = (s.vturn[i] ?? 0) + ta * sdt;
        s.turn[i] = (s.turn[i] ?? 0) + (s.vturn[i] ?? 0) * sdt;
        const sa = -24 * (s.swing[i] ?? 0) - 2.1 * (s.vswing[i] ?? 0) - clamp(accel, -6000, 6000) * 0.0045;
        s.vswing[i] = (s.vswing[i] ?? 0) + sa * sdt;
        s.swing[i] = clamp((s.swing[i] ?? 0) + (s.vswing[i] ?? 0) * sdt, -12, 12);
        const tagA = -46 * ((s.tag[i] ?? 0) - (s.swing[i] ?? 0) * 0.6) - 3.4 * (s.vtag[i] ?? 0) - (s.vswing[i] ?? 0) * 0.9;
        s.vtag[i] = (s.vtag[i] ?? 0) + tagA * sdt;
        s.tag[i] = clamp((s.tag[i] ?? 0) + (s.vtag[i] ?? 0) * sdt, -30, 30);
      }
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < n - 1; i++) {
          const a = s.x[i] ?? 0;
          const b = s.x[i + 1] ?? 0;
          const minGap = (footprint(h, s.turn[i] ?? REST, live.current.sideWidths[i]) + footprint(h, s.turn[i + 1] ?? REST, live.current.sideWidths[i + 1])) / 2 + h * 0.012;
          const overlap = minGap - (b - a);
          if (overlap <= 0) continue;
          if (i === s.drag) s.x[i + 1] = b + overlap;
          else if (i + 1 === s.drag) s.x[i] = a - overlap;
          else {
            s.x[i] = a - overlap / 2;
            s.x[i + 1] = b + overlap / 2;
          }
          const va = s.vx[i] ?? 0;
          const vb = s.vx[i + 1] ?? 0;
          if (va > vb) {
            const shared = (va + vb) / 2;
            if (i !== s.drag) s.vx[i] = shared;
            if (i + 1 !== s.drag) s.vx[i + 1] = shared;
          }
        }
      }
      if (!carousel && n > 0) {
        const edge = h * 0.06;
        const first = edge + footprint(h, s.turn[0] ?? REST, live.current.sideWidths[0]) / 2;
        const last = width - edge - footprint(h, s.turn[n - 1] ?? REST, live.current.sideWidths[n - 1]) / 2;
        if ((s.x[0] ?? 0) < first) { s.x[0] = first; s.vx[0] = Math.abs(s.vx[0] ?? 0) * 0.3; }
        if ((s.x[n - 1] ?? 0) > last) { s.x[n - 1] = last; s.vx[n - 1] = -Math.abs(s.vx[n - 1] ?? 0) * 0.3; }
      }
    }
    for (let i = 0; i < n; i++) {
      paint(i);
      if (Math.abs(s.vx[i] ?? 0) > 0.4 || (now > s.free && Math.abs((s.x[i] ?? 0) - (s.tx[i] ?? 0)) > 0.25) || Math.abs((s.turn[i] ?? 0) - (s.tturn[i] ?? 0)) > 0.05 || Math.abs(s.vturn[i] ?? 0) > 0.05 || Math.abs(s.swing[i] ?? 0) > 0.02 || Math.abs(s.vswing[i] ?? 0) > 0.05 || Math.abs(s.tag[i] ?? 0) > 0.05 || Math.abs(s.vtag[i] ?? 0) > 0.08) busy = true;
    }
    if (s.drag >= 0 || now < s.free) busy = true;
    if (busy) s.raf = requestAnimationFrame(stepFrame);
    else {
      s.raf = 0;
      s.last = 0;
      for (let i = 0; i < n; i++) {
        if (now > s.free) s.x[i] = s.tx[i] ?? 0;
        s.swing[i] = 0; s.vswing[i] = 0; s.tag[i] = 0; s.vtag[i] = 0;
        paint(i);
      }
    }
  }, [paint]);

  const kick = React.useCallback(() => {
    const s = sim.current;
    if (live.current.reduced) {
      for (let i = 0; i < live.current.count; i++) {
        s.x[i] = s.tx[i] ?? 0; s.turn[i] = s.tturn[i] ?? REST; s.vx[i] = 0; s.vturn[i] = 0; s.swing[i] = 0; s.vswing[i] = 0;
        paint(i);
      }
      return;
    }
    if (!s.raf) {
      s.last = 0;
      s.raf = requestAnimationFrame(step);
    }
  }, [paint, step]);

  const impulse = React.useCallback((i: number, amount: number) => {
    const s = sim.current;
    if (live.current.reduced || i < 0 || i >= live.current.count) return;
    s.vswing[i] = (s.vswing[i] ?? 0) + amount;
    kick();
  }, [kick]);

  React.useLayoutEffect(() => {
    if (!size.width) return;
    const s = sim.current;
    const front = size.carousel ? (active ?? live.current.carouselIndex) : active;
    const xs = targets(size.h, size.width, size.carousel, front);
    const fresh = s.x.length !== count;
    for (let i = 0; i < count; i++) {
      s.tx[i] = (xs[i] ?? 0) + (size.carousel ? pointer.current.swipe : 0);
      s.tturn[i] = i === front ? 0 : REST;
      if (fresh || reduced) {
        s.x[i] = s.tx[i] ?? 0; s.vx[i] = 0; s.px[i] = 0;
        s.turn[i] = s.tturn[i] ?? REST; s.vturn[i] = 0;
        s.swing[i] = s.swing[i] ?? 0; s.vswing[i] = s.vswing[i] ?? 0; s.tag[i] = 0; s.vtag[i] = 0;
      }
    }
    if (fresh) {
      s.x.length = count;
      for (let i = 0; i < count; i++) paint(i);
    }
    kick();
  }, [size, active, count, reduced, targets, paint, kick]);

  // Brush along the rail the first time it scrolls into view.
  const brushed = React.useRef(false);
  React.useEffect(() => {
    if (!size.width || !visible || brushed.current || reduced) return;
    brushed.current = true;
    const timers = items.map((_, i) => window.setTimeout(() => impulse(i, 46 - i * 2.5), 120 + i * 55));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [size.width, visible, reduced, items, impulse]);

  React.useEffect(() => () => {
    cancelAnimationFrame(sim.current.raf);
    sim.current.raf = 0;
  }, []);

  React.useLayoutEffect(() => {
    if (openIndex !== null || lifted !== null || returnFocus.current === null) return;
    const index = returnFocus.current;
    returnFocus.current = null;
    slots.current[index]?.focus({ preventScroll: true });
  }, [openIndex, lifted]);

  const choose = React.useCallback((index: number | null) => {
    setActive((old) => {
      if (old === index) return old;
      if (index !== null) { impulse(index - 1, -30); impulse(index + 1, 30); }
      if (old !== null && old !== index) { impulse(old - 1, 14); impulse(old + 1, -14); }
      if (index !== null) live.current.carouselIndex = index;
      return index;
    });
  }, [impulse]);

  const stop = React.useCallback(() => setPlaying(false), []);

  React.useEffect(() => {
    if (!playing || !visible || reduced || openIndex !== null || count === 0 || !size.width) return;
    let timer = window.setTimeout(function advance() {
      const current = live.current.active;
      choose(current === null ? 0 : (current + 1) % live.current.count);
      timer = window.setTimeout(advance, interval);
    }, active === null ? 1100 : interval);
    return () => window.clearTimeout(timer);
  }, [playing, visible, reduced, openIndex, count, interval, size.width, choose, active]);

  const open = React.useCallback((index: number) => {
    stop();
    setActive(index);
    setOpenIndex(index);
    onOpenChange?.(index);
  }, [onOpenChange, stop]);

  const close = React.useCallback(() => {
    setOpenIndex(null);
    onOpenChange?.(null);
  }, [onOpenChange]);

  function nearest(clientX: number, clientY: number) {
    const stage = stageRef.current;
    if (!stage) return null;
    const box = stage.getBoundingClientRect();
    const x = clientX - box.left;
    const y = clientY - box.top;
    const { h } = live.current.size;
    if (y < 0 || y > h + 46) return null;
    const s = sim.current;
    let best: number | null = null;
    let distance = Infinity;
    for (let i = 0; i < live.current.count; i++) {
      const half = footprint(h, s.turn[i] ?? REST, live.current.sideWidths[i]) / 2 + 4;
      const d = Math.abs(x - (s.x[i] ?? 0));
      if (d < half && d < distance) { best = i; distance = d; }
    }
    return best;
  }

  const onPointerMove = (event: React.PointerEvent) => {
    const p = pointer.current;
    const s = sim.current;
    const stage = stageRef.current;
    if (p.id === event.pointerId && stage) {
      const dx = event.clientX - p.x;
      const now = performance.now();
      if (!p.moved && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(event.clientY - p.y)) {
        p.moved = true;
        stop();
        if (stage.isConnected) stage.setPointerCapture(event.pointerId);
        if (!live.current.size.carousel && p.index >= 0) {
          s.drag = p.index;
          s.grab = event.clientX - stage.getBoundingClientRect().left - (s.x[p.index] ?? 0);
        }
      }
      if (p.moved) {
        const v = (event.clientX - p.lastX) / Math.max(1, now - p.lastT);
        p.v = p.v * 0.6 + v * 0.4;
        p.lastX = event.clientX;
        p.lastT = now;
        if (s.drag >= 0) {
          const x = event.clientX - stage.getBoundingClientRect().left - s.grab;
          s.vx[s.drag] = p.v * 1000;
          s.x[s.drag] = x;
          s.free = now + 900;
          kick();
        } else if (live.current.size.carousel) {
          p.swipe = dx;
          const xs = targets(live.current.size.h, live.current.size.width, true, live.current.active ?? live.current.carouselIndex);
          for (let i = 0; i < live.current.count; i++) s.tx[i] = (xs[i] ?? 0) + dx;
          kick();
        }
      }
      return;
    }
    if (event.pointerType !== "mouse" || live.current.size.carousel || live.current.openIndex !== null) return;
    const hit = nearest(event.clientX, event.clientY);
    const current = live.current.active;
    if (current !== null && hit !== current) {
      const box = stage?.getBoundingClientRect();
      const keep = box ? Math.abs(event.clientX - box.left - (s.x[current] ?? 0)) < footprint(live.current.size.h, 0) / 2 + 14 : false;
      if (keep && (hit === null || Math.abs(event.clientY - (box?.top ?? 0)) < live.current.size.h + 40)) return;
    }
    if (hit !== null) { stop(); choose(hit); }
  };

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.button !== 0) return;
    const hit = nearest(event.clientX, event.clientY);
    const now = performance.now();
    pendingOpen.current = -1;
    pointer.current = { id: event.pointerId, index: hit ?? -1, x: event.clientX, y: event.clientY, t: now, moved: false, kind: event.pointerType, swipe: 0, lastX: event.clientX, lastT: now, v: 0 };
  };

  const finishPointer = (event: React.PointerEvent, cancelled: boolean) => {
    const p = pointer.current;
    if (p.id !== event.pointerId) return;
    const s = sim.current;
    const stage = stageRef.current;
    if (stage?.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    pointer.current = { ...p, id: -1 };
    if (s.drag >= 0) {
      s.drag = -1;
      s.free = performance.now() + 700;
      kick();
      return;
    }
    if (p.moved && live.current.size.carousel) {
      const dx = event.clientX - p.x;
      const current = live.current.active ?? live.current.carouselIndex;
      const delta = Math.abs(dx) > 40 || Math.abs(p.v) > 0.45 ? (dx < 0 ? 1 : -1) : 0;
      pointer.current.swipe = 0;
      choose(clamp(current + delta, 0, live.current.count - 1));
      for (let i = 0; i < live.current.count; i++) impulse(i, clamp(-p.v * 22, -30, 30));
      return;
    }
    if (cancelled || p.moved || p.index < 0) return;
    stop();
    const touch = p.kind !== "mouse";
    if (touch && live.current.active !== p.index) choose(p.index);
    else pendingOpen.current = p.index;
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    stop();
    const from = active ?? focusIndex;
    const next = event.key === "Home" ? 0 : event.key === "End" ? count - 1 : clamp(from + (event.key === "ArrowRight" ? 1 : -1), 0, count - 1);
    setFocusIndex(next);
    choose(next);
    slots.current[next]?.focus({ preventScroll: true });
  };

  const current = active === null ? null : items[active];
  const h = size.h;
  const boxW = h * ASPECT;
  const railY = Math.round(h * 0.07) + 10;
  const railR = Math.max(3, Math.round((RAIL_R / VB_H) * h * 10) / 10);
  const bottom = count ? Math.max(...items.map((item) => (item.image ? VB_H : HEM + 8))) / VB_H : 1;
  const mask = silhouetteMask();
  const brass = "linear-gradient(to bottom, #f6e7bf 0%, #fff6dc 16%, #d8b874 40%, #9b7638 66%, #4f3a1b 100%)";

  return (
    <section
      {...rest}
      data-slot="shawl-rail"
      data-mode={size.carousel ? "carousel" : "rail"}
      data-active={active ?? ""}
      aria-roledescription="shawl rail"
      className={`relative isolate w-full overflow-hidden text-foreground ${className ?? ""}`}
    >
      <Defs uid={uid} items={items} />
      {(eyebrow || heading) && (
        <header className="relative z-10 flex flex-col items-center gap-2 px-6 text-center">
          {eyebrow}
          {heading && <h3 className="text-balance font-display text-3xl font-light sm:text-4xl">{heading}</h3>}
        </header>
      )}

      <div
        ref={stageRef}
        data-stage
        role="group"
        aria-label={heading ?? "Shawl rail"}
        className="relative mt-6 w-full touch-pan-y select-none"
        style={{ height: Math.round(railY + h * bottom + h * 0.05 + 12), overflowX: "clip" }}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={(event) => finishPointer(event, false)}
        onPointerCancel={(event) => finishPointer(event, true)}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse" && pointer.current.id < 0 && !size.carousel && !document.activeElement?.matches("[data-garment]:focus-visible")) choose(null);
        }}
        onKeyDown={onKeyDown}
      >
        {/* Brass rail */}
        <div aria-hidden="true" data-rail className="pointer-events-none absolute inset-x-0 z-0" style={{ top: railY - railR, height: railR * 2 }}>
          <div className="absolute inset-x-0 h-3 rounded-full bg-black/40 blur-[6px]" style={{ top: railR * 2 + 2 }} />
          <div className="absolute inset-0 rounded-full" style={{ background: brass, boxShadow: "0 1px 0 rgba(0,0,0,0.35)" }} />
          <div className="absolute inset-0 rounded-full opacity-35 mix-blend-overlay" style={{ background: "repeating-linear-gradient(90deg, transparent 0 2px, rgba(255,255,255,0.4) 2px 3px, transparent 3px 7px)" }} />
          {[0, 1].map((edge) => (
            <div key={edge} className="absolute top-1/2 h-7 w-4 -translate-y-1/2 rounded-[3px]" style={{ [edge ? "right" : "left"]: 6, background: "linear-gradient(to right, #e8cf93, #a8833f 55%, #5e4520)", boxShadow: "0 3px 6px rgba(0,0,0,0.4)" }}>
              <span className="absolute top-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-black/40" />
              <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-black/40" />
            </div>
          ))}
        </div>

        {items.map((item, i) => {
          const turned = active === i;
          const itemMask = item.image ? `url("${item.image}")` : mask;
          const photoBox = hanger === "none" ? "inset-0" : "inset-x-0 bottom-0 top-[8%]";
          return (
            <button
              key={item.id}
              ref={(node) => { slots.current[i] = node; }}
              type="button"
              data-garment={i}
              data-front={turned || undefined}
              tabIndex={i === (active ?? focusIndex) ? 0 : -1}
              aria-label={`${item.name}${item.tag ? ` — ${item.tag}` : ""}`}
              aria-describedby={`${uid}-caption`}
              aria-pressed={turned}
              className="absolute left-0 cursor-pointer rounded-xl outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              style={{ top: railY - (HOOK_TOP / VB_H) * h, width: boxW, height: h, zIndex: turned ? 30 : 10 + i, visibility: lifted === i ? "hidden" : undefined, transform: "translate3d(-9999px,0,0)" }}
              onFocus={() => {
                setFocusIndex(i);
                if (pointer.current.id < 0) { stop(); choose(i); }
              }}
              onClick={(event) => {
                const pending = pendingOpen.current;
                pendingOpen.current = -1;
                if (event.detail === 0 || pending === i) open(i);
              }}
            >
              <span ref={(node) => { swings.current[i] = node; }} className="absolute inset-0" style={{ transformOrigin: `50% ${(HOOK_TOP / VB_H) * 100}%` }}>
                <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ filter: `blur(${Math.max(3, h * 0.024).toFixed(1)}px)` }}>
                  <span ref={(node) => { shadows.current[i] = node; }} className={`absolute block bg-black opacity-55 ${item.image ? photoBox : "inset-0"}`} style={{ WebkitMask: `${itemMask} top center / contain no-repeat`, mask: `${itemMask} top center / contain no-repeat` }} />
                </span>
                {item.sideImage && (
                  <span ref={(node) => { sides.current[i] = node; }} data-face="side" className="absolute inset-0" style={{ transform: `perspective(${PERSPECTIVE}px) rotateY(0deg)` }}>
                    <SideHanger uid={uid} material={hanger} />
                    <Photo src={item.sideImage} alt="" full={hanger === "none"} />
                  </span>
                )}
                {/* Drawn shawls rest on their real face at a three-quarter turn, so the drape reads before any hover */}
                <span ref={(node) => { turns.current[i] = node; }} data-turn className="absolute inset-0 rounded-lg [transform-style:preserve-3d]" style={{ transform: `perspective(${PERSPECTIVE}px) rotateY(${REST}deg)`, opacity: item.sideImage ? 0 : 1 }}>
                  {(["front", "back"] as const).map((side) => (
                    <span key={side} data-face={side} className="absolute inset-0 [backface-visibility:hidden]" style={{ transform: side === "back" ? "rotateY(180deg)" : undefined }}>
                      <Hanger uid={uid} material={hanger} />
                      <span ref={side === "front" ? (node) => { drapes.current[i] = node; } : undefined} data-drape className="absolute inset-0 origin-top [transform:skewX(var(--drape,0deg))]" style={side === "back" ? { transform: "skewX(calc(var(--drape, 0deg) * -1))" } : undefined}>
                        {item.image
                          ? <Photo src={(side === "back" ? item.backImage : undefined) ?? item.image} alt="" full={hanger === "none"} />
                          : <ShawlFace uid={uid} index={i} item={item} side={side} />}
                        <span ref={side === "front" ? (node) => { shades.current[i] = node; } : undefined} className={`pointer-events-none absolute bg-black ${item.image ? photoBox : "inset-0"}`} style={{ opacity: "var(--shade, 0.2)", WebkitMask: `${itemMask} top center / contain no-repeat`, mask: `${itemMask} top center / contain no-repeat` }} />
                      </span>
                    </span>
                  ))}
                </span>
                {item.tag && (
                  <span ref={(node) => { tags.current[i] = node; }} aria-hidden="true" className="pointer-events-none absolute left-1/2 origin-top" style={{ top: (30 / VB_H) * h, transform: "rotate(-12deg)" }}>
                    <span className="block h-[16px] w-px translate-x-[3px] bg-gold-200/60" />
                    <span className="relative block translate-x-[calc(-50%+3px)] rounded-[3px] border border-gold-500/40 bg-ivory-100 px-2 pt-2.5 pb-1.5 font-caps text-[9px] leading-none font-semibold tracking-[0.14em] whitespace-nowrap text-ink-900 shadow-[0_4px_10px_rgba(0,0,0,0.45)]">
                      <span className="absolute top-[3px] left-1/2 size-[3px] -translate-x-1/2 rounded-full bg-ink-900/40" />
                      {item.tag}
                    </span>
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {size.carousel && count > 1 && (
        <div className="relative z-10 mt-1 flex justify-center gap-1.5" role="group" aria-label={labels.show}>
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`${labels.show} ${item.name}`}
              aria-current={carouselIndex === i}
              onClick={() => { stop(); choose(i); }}
              className="flex h-6 items-center outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ${carouselIndex === i ? "w-6 bg-gold-300" : "w-1.5 bg-foreground/25"}`} />
            </button>
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-5 px-6 pt-5 text-center">
        <div id={`${uid}-caption`} aria-live="polite" className="min-h-[4.5rem]">
          <p key={current?.id ?? "caption"} className="animate-fade-in font-display text-2xl text-foreground motion-reduce:animate-none">
            {current ? current.name : caption}
          </p>
          {current?.description && (
            <p key={`${current.id}-d`} className="mx-auto mt-1.5 max-w-[46ch] animate-fade-in text-[14px] leading-relaxed text-muted-foreground motion-reduce:animate-none">
              {current.description}
            </p>
          )}
        </div>
        {action}
      </div>

      {openIndex !== null && items[openIndex] && (
        <Detail
          uid={uid}
          item={items[openIndex]}
          index={openIndex}
          total={count}
          hanger={hanger}
          labels={labels}
          reduced={reduced}
          className={dialogClassName}
          renderAction={renderDetailAction}
          source={() => turns.current[openIndex]?.getBoundingClientRect() ?? null}
          onLift={(lift) => setLifted(lift ? openIndex : null)}
          onClose={() => {
            const index = openIndex;
            returnFocus.current = index;
            close();
            impulse(index, (index % 2 ? 1 : -1) * 44);
          }}
        />
      )}
    </section>
  );
}

function Detail({ uid, item, index, total, hanger, labels, reduced, className, renderAction, source, onLift, onClose }: {
  uid: string;
  item: RailShawl;
  index: number;
  total: number;
  hanger: HangerMaterial;
  labels: ShawlRailLabels;
  reduced: boolean;
  className?: string;
  renderAction?: (item: RailShawl, close: () => void) => React.ReactNode;
  source: () => DOMRect | null;
  onLift: (lifted: boolean) => void;
  onClose: () => void;
}) {
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const figureRef = React.useRef<HTMLDivElement | null>(null);
  const spinRef = React.useRef<HTMLDivElement | null>(null);
  const closeRef = React.useRef<HTMLButtonElement | null>(null);
  const [side, setSide] = React.useState<"front" | "back">("front");
  const [shown, setShown] = React.useState(false);
  const angle = React.useRef({ value: 0, target: 0, velocity: 0, raf: 0, last: 0, dragging: false, startX: 0, startAngle: 0 });
  const closing = React.useRef(false);
  const titleId = `${uid}-detail-title`;

  const spin = React.useCallback(() => {
    const a = angle.current;
    const node = spinRef.current;
    const loop = (now: number) => {
      const dt = a.last ? Math.min(0.034, (now - a.last) / 1000) : 1 / 60;
      a.last = now;
      const accel = -90 * (a.value - a.target) - 2 * Math.sqrt(90) * 0.82 * a.velocity;
      a.velocity += accel * dt;
      a.value += a.velocity * dt;
      if (node) node.style.transform = `rotateY(${a.value.toFixed(2)}deg)`;
      if (Math.abs(a.value - a.target) < 0.05 && Math.abs(a.velocity) < 0.05) {
        a.value = a.target;
        if (node) node.style.transform = `rotateY(${a.value}deg)`;
        a.raf = 0;
        a.last = 0;
        return;
      }
      a.raf = requestAnimationFrame(loop);
    };
    if (reduced) {
      a.value = a.target;
      if (node) node.style.transform = `rotateY(${a.value}deg)`;
      return;
    }
    if (!a.raf) a.raf = requestAnimationFrame(loop);
  }, [reduced]);

  const turnTo = React.useCallback((next: "front" | "back") => {
    const a = angle.current;
    const base = Math.round(a.value / 360) * 360;
    a.target = base + (next === "back" ? 180 : 0);
    if (Math.abs(a.target - a.value) > 180) a.target -= 360 * Math.sign(a.target - a.value);
    setSide(next);
    spin();
  }, [spin]);

  React.useLayoutEffect(() => {
    const figure = figureRef.current;
    const from = source();
    const spinState = angle.current;
    closeRef.current?.focus({ preventScroll: true });
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let animation: Animation | null = null;
    if (figure && from && !reduced && from.width > 0) {
      const to = figure.getBoundingClientRect();
      const scale = from.height / to.height;
      const dx = from.left + from.width / 2 - (to.left + to.width / 2);
      const dy = from.top - to.top;
      const lift = Math.min(90, Math.abs(dy) * 0.25 + 30);
      onLift(true);
      animation = figure.animate([
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
        { transform: `translate(${dx * 0.4}px, ${dy * 0.4 - lift}px) scale(${((scale + 1) / 2) * 1.03}) rotate(${dx > 0 ? -2.5 : 2.5}deg)`, offset: 0.5 },
        { transform: "none" },
      ], { duration: 680, easing: "cubic-bezier(.22,.85,.3,1)" });
    }
    const raf = requestAnimationFrame(() => setShown(true));
    return () => {
      cancelAnimationFrame(raf);
      animation?.cancel();
      document.body.style.overflow = overflow;
      cancelAnimationFrame(spinState.raf);
      onLift(false);
    };
  }, [source, reduced, onLift]);

  const dismiss = React.useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setShown(false);
    const figure = figureRef.current;
    const to = source();
    if (!figure || !to || reduced || to.width === 0) { onClose(); return; }
    const from = figure.getBoundingClientRect();
    const scale = to.height / from.height;
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top - from.top;
    const animation = figure.animate([
      { transform: "none" },
      { transform: `translate(${dx * 0.6}px, ${dy * 0.6 - 30}px) scale(${(scale + 1) / 2})`, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
    ], { duration: 560, easing: "cubic-bezier(.45,0,.55,1)", fill: "forwards" });
    animation.onfinish = () => onClose();
  }, [source, reduced, onClose]);

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const dialog = dialogRef.current;
      if (!dialog || dialog.contains(event.target as Node)) return;
      if (event.key === "Escape") { event.preventDefault(); dismiss(); }
      else if (event.key === "ArrowLeft" || event.key === "ArrowRight") turnTo(side === "front" ? "back" : "front");
      else if (event.key === "Tab") {
        const first = dialog.querySelector<HTMLElement>("button, a[href]");
        if (first) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [dismiss, turnTo, side]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") { event.preventDefault(); dismiss(); return; }
    if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && (event.target as HTMLElement).tagName !== "A") { turnTo(side === "front" ? "back" : "front"); return; }
    if (event.key !== "Tab") return;
    const controls = [...(dialogRef.current?.querySelectorAll<HTMLElement>("button, a[href]") ?? [])].filter((node) => !(node as HTMLButtonElement).disabled);
    const first = controls[0];
    const last = controls.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  const stage = (
    <div ref={figureRef} className="relative mx-auto aspect-[200/310] h-[min(58vh,560px)] max-h-full origin-top">
      <div aria-hidden="true" className="absolute left-1/2 h-[40vh] w-[3px] -translate-x-1/2 rounded-full" style={{ background: "linear-gradient(to right, #e8cf93, #a8833f, #5e4520)", top: `calc(-40vh + ${(HOOK_TOP / VB_H) * 100}%)` }} />
      <div
        className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
        style={{ perspective: "1400px" }}
        onPointerDown={(event) => {
          const a = angle.current;
          a.dragging = true; a.startX = event.clientX; a.startAngle = a.value;
          cancelAnimationFrame(a.raf); a.raf = 0; a.last = 0;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const a = angle.current;
          if (!a.dragging) return;
          a.value = clamp(a.startAngle + (event.clientX - a.startX) * 0.45, a.startAngle - 220, a.startAngle + 220);
          if (spinRef.current) spinRef.current.style.transform = `rotateY(${a.value.toFixed(2)}deg)`;
        }}
        onPointerUp={() => {
          const a = angle.current;
          if (!a.dragging) return;
          a.dragging = false;
          const facing = ((a.value % 360) + 360) % 360;
          turnTo(facing > 90 && facing < 270 ? "back" : "front");
        }}
        onPointerCancel={() => { angle.current.dragging = false; turnTo(side); }}
      >
        <div ref={spinRef} className="absolute inset-0 [transform-style:preserve-3d]">
          {(["front", "back"] as const).map((face) => (
            <div key={face} className="absolute inset-0 [backface-visibility:hidden]" style={{ transform: face === "back" ? "rotateY(180deg)" : undefined }}>
              <Hanger uid={uid} material={hanger} />
              {item.image
                ? <Photo src={(face === "back" ? item.backImage : undefined) ?? item.image} alt={face === "front" ? item.name : ""} full={hanger === "none"} />
                : <ShawlFace uid={uid} index={index} item={item} side={face} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return createPortal(
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className={`fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto p-6 text-foreground ${className ?? ""}`} onKeyDown={onKeyDown}>
      <div aria-hidden="true" className={`absolute inset-0 bg-background/92 backdrop-blur-xl transition-opacity duration-300 motion-reduce:transition-none ${shown ? "opacity-100" : "opacity-0"}`} onClick={dismiss} />
      <button ref={closeRef} type="button" onClick={dismiss} className={`absolute top-5 right-5 z-10 inline-flex h-11 items-center gap-2 rounded-full border border-border px-4 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase outline-none transition-[opacity,color] duration-300 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none ${shown ? "opacity-100" : "opacity-0"}`}>
        {labels.close}
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13" /></svg>
      </button>
      <div className="relative grid w-full max-w-5xl items-center gap-10 pt-16 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:pt-10">
        {stage}
        <div className={`flex flex-col gap-4 text-center transition-[opacity,transform] delay-150 duration-500 motion-reduce:transition-none md:text-left ${shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
          <p className="font-caps text-[11px] tracking-[0.3em] text-accent">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {item.tag}</p>
          <h3 id={titleId} className="font-display text-4xl font-light sm:text-5xl">{item.name}</h3>
          {item.description && <p className="text-[15px] leading-relaxed text-muted-foreground">{item.description}</p>}
          {item.details && item.details.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-2 md:justify-start">
              {item.details.map((detail) => <li key={detail} className="rounded-full border border-border px-3 py-1 text-xs tracking-wide text-muted-foreground">{detail}</li>)}
            </ul>
          )}
          <div role="group" aria-label={`${labels.front} / ${labels.back}`} className="mt-2 inline-flex justify-center gap-6 md:justify-start">
            {(["front", "back"] as const).map((face) => (
              <button key={face} type="button" aria-pressed={side === face} onClick={() => turnTo(face)} className={`relative pb-1.5 text-sm tracking-wide outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${side === face ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {face === "front" ? labels.front : labels.back}
                <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-px origin-left bg-accent transition-transform duration-300 motion-reduce:transition-none ${side === face ? "scale-x-100" : "scale-x-0"}`} />
              </button>
            ))}
          </div>
          {renderAction && <DetailAction render={renderAction} item={item} onClose={dismiss} />}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function DetailAction({ render, item, onClose }: { render: (item: RailShawl, close: () => void) => React.ReactNode; item: RailShawl; onClose: () => void }) {
  return <div className="mt-4 flex flex-wrap items-center justify-center gap-4 md:justify-start">{render(item, onClose)}</div>;
}

export default ShawlRail;
