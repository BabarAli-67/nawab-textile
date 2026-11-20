/**
 * Demo catalogue. Product names, bottle sizes and collection names come from
 * the client's own packaging; scent notes, shawl craft labels and fabric specs
 * are presentation copy to be confirmed with the client before launch.
 * Editorial photography is temporary and is swapped after the shoot.
 */

import type { CategoryId } from "./site";
import type { WeaveId } from "./weaves";

/* ------------------------------------------------------------------ */
/* Pillars (hero)                                                      */
/* ------------------------------------------------------------------ */

export type Pillar = {
  id: CategoryId;
  numeral: string;
  title: string;
  urdu: string;
  kicker: string;
  tagline: string;
  cta: string;
  image: string;
  imagePosition: string;
};

export const pillars: Pillar[] = [
  {
    id: "perfumes",
    numeral: "I",
    title: "Perfumes",
    urdu: "عطر",
    kicker: "Eau de Parfum",
    tagline: "Three signature scents — Hassan, Lehar and Janoon — composed to linger like a memory.",
    cta: "Discover the scents",
    image: "/images/perfumes/trio.jpg",
    imagePosition: "50% 60%",
  },
  {
    id: "shawls",
    numeral: "II",
    title: "Shawls",
    urdu: "شال",
    kicker: "Heritage Weaves",
    tagline: "Pashmina, kani and jamawar — winter heirlooms woven to be handed down.",
    cta: "Walk the shawl rail",
    image: "/images/editorial/shawl-jamawar-macro.jpg",
    imagePosition: "50% 45%",
  },
  {
    id: "fabrics",
    numeral: "III",
    title: "Unstitched Fabrics",
    urdu: "کپڑا",
    kicker: "Men's Suiting & Cotton",
    tagline: "Super-fine cottons and executive suiting, signed on every selvedge.",
    cta: "Inspect the weaves",
    image: "/images/editorial/suiting-stack-brown.jpg",
    imagePosition: "50% 50%",
  },
];

/* ------------------------------------------------------------------ */
/* Perfumes                                                            */
/* ------------------------------------------------------------------ */

export type Perfume = {
  id: "hassan" | "lehar" | "janoon";
  name: string;
  urdu: string;
  meaning: string;
  family: string;
  description: string;
  image: string;
  /** Colour sampled from the bottle — drives the stage glow. */
  accent: string;
  glow: string;
  sizes: string[];
  notes: { top: string[]; heart: string[]; base: string[] };
  profile: { label: string; value: number }[];
  mood: string[];
};

export const perfumes: Perfume[] = [
  {
    id: "hassan",
    name: "Hassan",
    urdu: "حسن",
    meaning: "Beauty",
    family: "Amber Woody",
    description:
      "A regal amber that opens bright and green, then settles into rose, saffron and smoked woods — composed for evenings that deserve to be remembered.",
    image: "/images/perfumes/hassan.jpg",
    accent: "#b7c26a",
    glow: "rgba(170, 182, 92, 0.34)",
    sizes: ["50 ml", "100 ml"],
    notes: {
      top: ["Bergamot", "Green Mandarin", "Saffron"],
      heart: ["Taif Rose", "Cardamom", "Vetiver"],
      base: ["Oud Accord", "Amber", "White Musk"],
    },
    profile: [
      { label: "Longevity", value: 4 },
      { label: "Sillage", value: 4 },
      { label: "Warmth", value: 4 },
    ],
    mood: ["Regal", "Warm", "Magnetic"],
  },
  {
    id: "lehar",
    name: "Lehar",
    urdu: "لہر",
    meaning: "The Wave",
    family: "Aquatic Aromatic",
    description:
      "A cool rush of sea salt and citrus breaking over lavender and driftwood. Fresh, kinetic and quietly confident — for men who move first.",
    image: "/images/perfumes/lehar.jpg",
    accent: "#5b9be0",
    glow: "rgba(64, 128, 210, 0.36)",
    sizes: ["50 ml", "100 ml"],
    notes: {
      top: ["Sea Salt", "Calabrian Bergamot", "Grapefruit"],
      heart: ["Lavender", "Sage", "Marine Accord"],
      base: ["Ambergris", "Driftwood", "Musk"],
    },
    profile: [
      { label: "Longevity", value: 3 },
      { label: "Sillage", value: 3 },
      { label: "Warmth", value: 2 },
    ],
    mood: ["Fresh", "Kinetic", "Coastal"],
  },
  {
    id: "janoon",
    name: "Janoon",
    urdu: "جنون",
    meaning: "Passion",
    family: "Spiced Leather",
    description:
      "Black pepper and cardamom ignite over supple leather, tobacco leaf and dark vanilla. Intense, nocturnal — an obsession in a black flacon.",
    image: "/images/perfumes/janoon.jpg",
    accent: "#d6b06a",
    glow: "rgba(202, 160, 90, 0.32)",
    sizes: ["50 ml", "100 ml"],
    notes: {
      top: ["Black Pepper", "Cardamom", "Elemi"],
      heart: ["Leather", "Tobacco Leaf", "Iris"],
      base: ["Oud", "Bourbon Vanilla", "Patchouli"],
    },
    profile: [
      { label: "Longevity", value: 5 },
      { label: "Sillage", value: 5 },
      { label: "Warmth", value: 5 },
    ],
    mood: ["Intense", "Nocturnal", "Unforgettable"],
  },
];

/* ------------------------------------------------------------------ */
/* Shawls (rendered on the 21st.dev hanger rail)                       */
/* ------------------------------------------------------------------ */

export type Shawl = {
  id: string;
  name: string;
  craft: string;
  description: string;
  details: string[];
  /** Base cloth colour (also used for the fringe). */
  color: string;
  /** Close-up texture laid over the cloth. Omit for a plain loom finish. */
  texture?: string;
  textureOpacity?: number;
  /** Woven border (palla) along the hem. */
  border: { color: string; texture?: string };
};

export const shawls: Shawl[] = [
  {
    id: "kani-midnight",
    name: "Kani Midnight",
    craft: "Kani Weave",
    description: "Dense kani-woven paisleys on a midnight ground, finished with a hand-twisted fringe.",
    details: ["Kani weave", "Wool–silk blend", "100 × 200 cm"],
    color: "#1c2236",
    texture: "/images/textures/paisley-navy.jpg",
    border: { color: "#5a2a2a", texture: "/images/textures/border-maroon.jpg" },
  },
  {
    id: "pashmina-camel",
    name: "Pure Pashmina — Camel",
    craft: "Pure Pashmina",
    description: "Featherlight, hand-spun pashmina in the warm camel of a winter afternoon.",
    details: ["Pure pashmina", "Hand-spun", "Featherlight"],
    color: "#b8945f",
    texture: "/images/textures/camel.jpg",
    textureOpacity: 0.85,
    border: { color: "#6b3a2c", texture: "/images/textures/border-maroon.jpg" },
  },
  {
    id: "jamawar-ember",
    name: "Jamawar Ember",
    craft: "Jamawar",
    description: "A heritage jamawar of curling paisleys in ember, rust and ivory — reversible and regal.",
    details: ["Jamawar paisley", "Fine wool", "Reversible"],
    color: "#7a3b22",
    texture: "/images/textures/paisley-rust.jpg",
    border: { color: "#3b1d14" },
  },
  {
    id: "sozni-noir",
    name: "Sozni Noir",
    craft: "Sozni Embroidery",
    description: "Jet-black wool with a needle-worked sozni border — the quiet centrepiece of any evening.",
    details: ["Hand embroidery", "Fine wool", "Embroidered palla"],
    color: "#141416",
    border: { color: "#7d3a2a", texture: "/images/textures/paisley-rust.jpg" },
  },
  {
    id: "damask-dusk",
    name: "Damask Dusk",
    craft: "Woven Damask",
    description: "Tonal damask florals that catch the light as you move — bronze on cream.",
    details: ["Jacquard damask", "Wool blend", "Soft hand"],
    color: "#8a6a45",
    texture: "/images/textures/damask.jpg",
    border: { color: "#3e2c1c" },
  },
  {
    id: "merino-stone",
    name: "Fine Merino — Stone",
    craft: "Fine Merino",
    description: "An everyday luxury: fine merino in a stone neutral that pairs with everything.",
    details: ["Fine merino", "Breathable", "All-day warmth"],
    color: "#cdbfa6",
    texture: "/images/textures/linen-beige.jpg",
    textureOpacity: 0.9,
    border: { color: "#8d7b62" },
  },
  {
    id: "cashmere-moss",
    name: "Cashmere Moss",
    craft: "Cashmere Blend",
    description: "Moss-grey cashmere blend with a brushed, cloud-soft surface.",
    details: ["Cashmere blend", "Brushed finish", "100 × 200 cm"],
    color: "#5d6a66",
    texture: "/images/textures/wool-moss.jpg",
    textureOpacity: 0.9,
    border: { color: "#2f3735" },
  },
];

/* ------------------------------------------------------------------ */
/* Unstitched fabrics                                                  */
/* ------------------------------------------------------------------ */

export type Shade = { name: string; hex: string };

export type FabricCollection = {
  id: string;
  name: string;
  line: string;
  label: string;
  composition: string;
  feel: string;
  season: string;
  idealFor: string;
  length: string;
  description: string;
  box: string;
  weave: WeaveId;
  shades: Shade[];
};

export const fabricCollections: FabricCollection[] = [
  {
    id: "royal-executive",
    name: "Royal Executive",
    line: "Italian Suiting",
    label: "Wash & Wear",
    composition: "Premium blended suiting",
    feel: "Smooth drape, crease-resistant",
    season: "All seasons",
    idealFor: "Shalwar kameez · Kurta",
    length: "4.5 m per suit",
    description:
      "Our signature suiting — the name Nawab Textile International is woven into every selvedge. A refined, low-maintenance drape for the working week and the wedding season alike.",
    box: "/images/editorial/swatch-board.jpg",
    weave: "twill",
    shades: [
      { name: "Desert Sand", hex: "#c8b38c" },
      { name: "Ivory", hex: "#ebe7dc" },
      { name: "Mink", hex: "#8c7f77" },
      { name: "Sea Glass", hex: "#9db6ae" },
      { name: "Oat", hex: "#cab69a" },
      { name: "Lilac Ash", hex: "#a8a5b4" },
      { name: "Jet", hex: "#1a1b1e" },
    ],
  },
  {
    id: "american-latha",
    name: "American Latha",
    line: "Summer Collection",
    label: "100% Super Fine Cotton",
    composition: "100% super fine cotton",
    feel: "Crisp, cool, breathable",
    season: "Summer",
    idealFor: "Shalwar kameez",
    length: "4.5 m per suit",
    description:
      "The summer classic. A crisp, high-count latha with a clean hand and a bright finish that keeps its shape from the first prayer to the last meeting.",
    box: "/images/collections/american-latha.jpg",
    weave: "latha",
    shades: [
      { name: "Pearl White", hex: "#f0eee8" },
      { name: "Sky Haze", hex: "#c8d4de" },
      { name: "Sand", hex: "#d5c5a6" },
      { name: "Stone", hex: "#b7b1a6" },
    ],
  },
  {
    id: "premium-cotton",
    name: "Premium Cotton",
    line: "Summer Collection",
    label: "100% Super Fine Cotton",
    composition: "100% super fine cotton",
    feel: "Soft, airy, mid-weight",
    season: "Spring – Summer",
    idealFor: "Shalwar kameez · Kurta",
    length: "4.5 m per suit",
    description:
      "Soft-handled super fine cotton in a palette of considered tones — easy to tailor, easier to wear.",
    box: "/images/collections/premium-cotton-blue.jpg",
    weave: "poplin",
    shades: [
      { name: "Chalk", hex: "#ecebe5" },
      { name: "Powder Blue", hex: "#b6c6d5" },
      { name: "Slate Teal", hex: "#5d7b83" },
      { name: "Clay", hex: "#b39a85" },
      { name: "Maroon", hex: "#6a2a33" },
    ],
  },
  {
    id: "royalty-heritage",
    name: "Royalty Heritage",
    line: "Heritage Collection",
    label: "Heritage Blend",
    composition: "Rich heritage blend",
    feel: "Full-bodied, warm drape",
    season: "Autumn – Winter",
    idealFor: "Shalwar kameez · Waistcoat sets",
    length: "4.5 m per suit",
    description:
      "Deeper tones and a fuller body for the cooler months — the collection to reach for when the occasion is formal.",
    box: "/images/collections/royalty-heritage.jpg",
    weave: "herringbone",
    shades: [
      { name: "Charcoal", hex: "#3a3a3e" },
      { name: "Walnut", hex: "#5a4535" },
      { name: "Olive", hex: "#686a4b" },
      { name: "Midnight", hex: "#1f293b" },
    ],
  },
  {
    id: "egyptian-giza",
    name: "Egyptian Giza",
    line: "Luxury Cotton",
    label: "Long-Staple Giza Cotton",
    composition: "Long-staple Giza cotton",
    feel: "Silken, lustrous, cool",
    season: "Spring – Summer",
    idealFor: "Formal shalwar kameez · Kurta",
    length: "4.5 m per suit",
    description:
      "Spun from long-staple Egyptian cotton for a silken hand and a quiet lustre — the summer cloth for formal days and evening gatherings.",
    box: "/images/editorial/suiting-stack-blue.jpg",
    weave: "sateen",
    shades: [
      { name: "Pearl", hex: "#eee9df" },
      { name: "Champagne", hex: "#d8c7a4" },
      { name: "Ice Blue", hex: "#cbd8e1" },
      { name: "Dove Grey", hex: "#a7a6a2" },
      { name: "Ink Navy", hex: "#222b3c" },
    ],
  },
  {
    id: "blended",
    name: "Blended Collection",
    line: "Easy Care",
    label: "Wash & Wear Blend",
    composition: "Poly-viscose wash & wear",
    feel: "Light, wrinkle-resistant",
    season: "All seasons",
    idealFor: "Everyday shalwar kameez",
    length: "4.5 m per suit",
    description:
      "Wash, hang, wear. A practical blend that keeps a sharp line through long days and quick turnarounds.",
    box: "/images/collections/blended.jpg",
    weave: "rib",
    shades: [
      { name: "Ash", hex: "#9a9996" },
      { name: "Ivory", hex: "#ece8dd" },
      { name: "Steel Blue", hex: "#5e7389" },
      { name: "Black", hex: "#18191b" },
    ],
  },
];

export const boxes = [
  { src: "/images/collections/american-latha.jpg", name: "American Latha", note: "Summer Collection" },
  { src: "/images/collections/premium-cotton-maroon.jpg", name: "Premium Cotton", note: "Garnet Edition" },
  { src: "/images/collections/premium-cotton-blue.jpg", name: "Premium Cotton", note: "Teal Edition" },
  { src: "/images/collections/royalty-heritage.jpg", name: "Royalty Heritage", note: "Heritage Collection" },
  { src: "/images/collections/blended.jpg", name: "Blended Collection", note: "Easy Care" },
];
