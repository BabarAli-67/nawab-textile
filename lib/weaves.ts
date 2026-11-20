import type { CSSProperties } from "react";

/**
 * Procedural weave tiles. Each one is a tiny grayscale SVG blended over the
 * cloth colour, so the same shade reads as twill, latha or herringbone.
 * Tiles are vectors, so the inspector's 3× loupe magnifies them crisply.
 */

export type WeaveId = "twill" | "latha" | "poplin" | "herringbone" | "rib" | "sateen";

export type Weave = {
  id: WeaveId;
  name: string;
  /** CSS url() of the tile */
  tile: string;
  /** rendered tile size in px at 1× */
  w: number;
  h: number;
  opacity: number;
  /** adds a soft diagonal lustre (long-staple cotton) */
  sheen?: boolean;
};

const svg = (w: number, h: number, body: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>${body}</svg>`,
  )}")`;

const PLAIN = svg(
  8,
  8,
  `<rect width='8' height='8' fill='#000' fill-opacity='.24'/><g fill='#fff' fill-opacity='.5'><rect x='.3' y='.8' width='3.4' height='2.4' rx='1.2'/><rect x='4.8' y='.3' width='2.4' height='3.4' rx='1.2'/><rect x='.8' y='4.3' width='2.4' height='3.4' rx='1.2'/><rect x='4.3' y='4.8' width='3.4' height='2.4' rx='1.2'/></g>`,
);

export const weaves: Record<WeaveId, Weave> = {
  twill: {
    id: "twill",
    name: "Fine twill",
    tile: svg(
      6,
      6,
      `<path d='M-1 1l2-2M0 6l6-6M5 7l2-2' stroke='#fff' stroke-opacity='.6' stroke-width='1.4'/><path d='M-1 4l5-5M2 7l5-5' stroke='#000' stroke-opacity='.45' stroke-width='1.1'/>`,
    ),
    w: 6,
    h: 6,
    opacity: 0.32,
  },
  latha: { id: "latha", name: "Crisp plain weave", tile: PLAIN, w: 5, h: 5, opacity: 0.3 },
  poplin: { id: "poplin", name: "Soft plain weave", tile: PLAIN, w: 7, h: 7, opacity: 0.26 },
  herringbone: {
    id: "herringbone",
    name: "Herringbone",
    tile: svg(
      12,
      12,
      `<g stroke='#fff' stroke-opacity='.5' stroke-width='1.3'><path d='M0 3l6-6M0 9l6-6M0 15l6-6'/><path d='M6-3l6 6M6 3l6 6M6 9l6 6'/></g><g stroke='#000' stroke-opacity='.4' stroke-width='1.1'><path d='M0 6l6-6M0 12l6-6'/><path d='M6 0l6 6M6 6l6 6'/></g><path d='M6 0v12' stroke='#000' stroke-opacity='.3' stroke-width='.7'/>`,
    ),
    w: 12,
    h: 12,
    opacity: 0.34,
  },
  rib: {
    id: "rib",
    name: "Fine rib",
    tile: svg(
      4,
      4,
      `<rect width='4' height='4' fill='#000' fill-opacity='.2'/><rect y='.6' width='4' height='1.7' fill='#fff' fill-opacity='.45'/><path d='M0 3.4h4' stroke='#000' stroke-opacity='.3' stroke-width='.6'/><path d='M2 0v4' stroke='#000' stroke-opacity='.14' stroke-width='.5'/>`,
    ),
    w: 4,
    h: 4,
    opacity: 0.3,
  },
  sateen: {
    id: "sateen",
    name: "Lustrous sateen",
    tile: svg(
      8,
      4,
      `<path d='M0 4L8 0' stroke='#fff' stroke-opacity='.55' stroke-width='.9'/><path d='M-4 4L4 0M4 4L12 0' stroke='#000' stroke-opacity='.22' stroke-width='.7'/>`,
    ),
    w: 8,
    h: 4,
    opacity: 0.3,
    sheen: true,
  },
};

/** Background layer for a weave, optionally magnified (the loupe passes 3). */
export function weaveLayer(weave: Weave, zoom = 1): CSSProperties {
  return {
    backgroundImage: weave.tile,
    backgroundSize: `${weave.w * zoom}px ${weave.h * zoom}px`,
    mixBlendMode: "overlay",
    opacity: weave.opacity,
  };
}

export const SHEEN = "linear-gradient(115deg, transparent 28%, rgba(255,255,255,0.22) 47%, transparent 66%)";
