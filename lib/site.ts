export const site = {
  name: "Nawab Textile",
  wordmark: "NAWAB",
  urdu: "نواب",
  tagline: "The Royal Combination of Style",
  promise: "Tradition meets quality",
  description:
    "Nawab — a house of signature perfumes, heritage shawls and premium men's unstitched fabrics. The royal combination of style.",
} as const;

/**
 * The client's WhatsApp Business number in international format, digits
 * only (e.g. 923001234567). Set NEXT_PUBLIC_WHATSAPP_NUMBER in `.env.local`.
 * Until it is set, links open WhatsApp's share sheet with the message
 * pre-filled, so the demo never dials a wrong number.
 */
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

export function whatsappLink(message: string) {
  const text = encodeURIComponent(message.trim());
  return WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${text}` : `https://wa.me/?text=${text}`;
}

export const nav = [
  { id: "perfumes", label: "Perfumes", urdu: "عطر" },
  { id: "shawls", label: "Shawls", urdu: "شال" },
  { id: "fabrics", label: "Fabrics", urdu: "کپڑا" },
  { id: "story", label: "Our Story", urdu: "داستان" },
] as const;

export type CategoryId = "perfumes" | "shawls" | "fabrics";
