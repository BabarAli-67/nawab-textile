# Nawab Textile — brand showcase (client demo)

A luxury showcase and lead-generation site for Nawab's three houses: **Perfumes**, **Shawls** and **Unstitched Fabrics**.
There is no cart or checkout. Every call to action opens WhatsApp with a pre-filled message.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Before going live

1. **WhatsApp number.** Create `.env.local`:
   ```
   NEXT_PUBLIC_WHATSAPP_NUMBER=923001234567   # digits only, international format
   NEXT_PUBLIC_SITE_URL=https://www.example.com
   ```
   Until the number is set, WhatsApp links open WhatsApp's share sheet with the message pre-filled, so the demo never dials a wrong number.
2. **Copy to confirm.** Scent notes, shawl craft labels and fabric specs in `lib/catalog.ts` are presentation copy.
   Product names, bottle sizes and collection names come from the client's own packaging.

## Swapping photography after the shoot

Every image is a plain file in `public/images/`. Replace a file with the same name, or change the path in `lib/catalog.ts`.

| Folder | What it is | Source |
| --- | --- | --- |
| `perfumes/` | Hassan, Lehar, Janoon and the trio | **Client** |
| `collections/` | Signature boxes and the shade card | **Client** |
| `brand/` | Emblem and monogram pattern, generated from the client logo | **Client** |
| `editorial/` | Shawl portraits, suiting, tailor, heritage scenes | Unsplash / Pexels, temporary |
| `textures/` | Close-ups that "weave" the shawls on the rail | Unsplash, temporary |

- **Hero pillars.** Images are statically imported in `components/sections/hero-pillars.tsx` for blur placeholders. Keep the file names or update the imports.
- **Shawl rail.** Shawls are drawn as cloth (texture, palla border and fringe) by `components/ui/shawl-rail.tsx`. After the shoot, add transparent cut-outs (200 × 310 canvas) through the `image`, `backImage` and `sideImage` fields of a rail item to show real photos on the hangers.
- **Fabric inspector.** `textures/suiting-neutral.jpg` is a neutral grey weave, tinted live to each shade's hex.

## Structure

```
app/                 layout (fonts, metadata), page, global design tokens
components/site/     navbar, footer, floating WhatsApp button
components/sections/ hero-pillars, perfume-showcase, shawl-gallery, fabric-atelier, heritage, inquiry
components/ui/       shawl-rail (adapted from 21st.dev Product Rail Gallery), arch-frame, reveal, icons
lib/                 catalog data, site config, WhatsApp link builder
```
