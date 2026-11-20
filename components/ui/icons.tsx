import type { SVGProps } from "react";

/** WhatsApp glyph (Lucide no longer ships brand marks). */
export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.04 2.004a9.93 9.93 0 0 0-8.53 15.02L2 22l5.12-1.48a9.94 9.94 0 1 0 4.92-18.52Zm0 18.17a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.04.88.9-2.96-.2-.31a8.22 8.22 0 1 1 6.82 3.71Zm4.5-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.55.12-.16.25-.63.8-.78.96-.14.17-.29.19-.53.07-.25-.13-1.04-.39-1.99-1.23-.73-.66-1.23-1.47-1.37-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42h-.47a.9.9 0 0 0-.65.31c-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.13.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}

/** Eight-point star used as a section divider (from Mughal jaali work). */
export function StarMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 1.5 14.2 6.6 19.4 4.6 17.4 9.8 22.5 12l-5.1 2.2 2 5.2-5.2-2-2.2 5.1-2.2-5.1-5.2 2 2-5.2L1.5 12l5.1-2.2-2-5.2 5.2 2L12 1.5Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
    </svg>
  );
}
