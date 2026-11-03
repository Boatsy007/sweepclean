/* Line icons in the style of the mockup (1.75 stroke, rounded). */
const paths: Record<string, React.ReactNode> = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" /></>,
  sparkle: <><path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z" /><path d="M19 15.5c.25 1.6.9 2.25 2.5 2.5-1.6.25-2.25.9-2.5 2.5-.25-1.6-.9-2.25-2.5-2.5 1.6-.25 2.25-.9 2.5-2.5Z" /></>,
  heart: <path d="M12 20s-7.5-4.6-9.2-9.4C1.6 7.2 3.8 4 7.1 4c2 0 3.4 1.1 4.9 3 1.5-1.9 2.9-3 4.9-3 3.3 0 5.5 3.2 4.3 6.6C19.5 15.4 12 20 12 20Z" />,
  box: <><path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9L12 3Z" /><path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9" /><path d="m7.8 5.3 8.4 4.5" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /><path d="m9 15 2 2 4-4" /></>,
  chat: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A2.5 2.5 0 0 1 4 13.5Z" /><path d="M8.5 9.5h.01M12 9.5h.01M15.5 9.5h.01" strokeWidth="2.6" /></>,
  doc: <><path d="M6.5 3h8l4 4v12.5a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 19.5v-15A1.5 1.5 0 0 1 6.5 3Z" /><path d="M14 3v4.5h4.5M8.5 12h7M8.5 15.5h7M8.5 8.5h3" /></>,
  pin: <><path d="M12 21s7-6.1 7-11.5a7 7 0 0 0-14 0C5 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  checkCircle: <><circle cx="12" cy="12" r="9.5" /><path d="m7.5 12.3 3 3 6-6" /></>,
  arrow: <path d="M5 12h14m-5.5-6 6 6-6 6" />,
  phone: <path d="M5 3.5h3.2l1.6 4.4-2.1 1.4a11 11 0 0 0 7 7l1.4-2.1 4.4 1.6V19a1.5 1.5 0 0 1-1.6 1.5C10.6 19.9 4.1 13.4 3.5 5.1A1.5 1.5 0 0 1 5 3.5Z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 6.5 8.5 6.5 8.5-6.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  shield: <><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6L12 3Z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
  city: <><path d="M3 21h18M5 21V10l4-2v13M9 21V5l5-2v18M14 21V9h5v12" /><path d="M11 8h.01M11 11h.01M11 14h.01M16.5 12h.01M16.5 15h.01" strokeWidth="2.4" /></>,
  palm: <><path d="M12 21c0-5 .5-8.5 1-11" /><path d="M13 10c-2-3-5.5-3.5-8-2 2.5.2 4.6 1 6 2.8M13 10c1-3.2 4-5 7.2-4.2-2.4.8-4.3 2.3-5.2 4.5M13 10c3 .2 5.6 2.2 6.2 5-1.9-1.4-4-2.2-6.2-2.3M13 10c-2.6.5-4.7 2.7-5 5.4 1.4-1.6 3.2-2.6 5-3" /><path d="M8 21h9" /></>,
  wave: <><path d="M2.5 16.5c2.2 0 2.2-1.5 4.4-1.5s2.2 1.5 4.4 1.5 2.2-1.5 4.4-1.5 2.2 1.5 4.4 1.5" /><path d="M5 12.5C6 7.8 9.6 5 13.6 5c2.7 0 5 1.3 6.4 3.3-2.6-.7-5.3.3-6.6 2.5-.8 1.3-1 2.4-1 3.2" /></>,
  bridge: <><path d="M2 17h20M4 17v-4M20 17v-4M8 17V9M16 17V9" /><path d="M2 13c3.5 0 6-1.7 6-4M22 13c-3.5 0-6-1.7-6-4M8 9c1.5 2.5 2.5 3.5 4 3.5S14.5 11.5 16 9" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  key: <><circle cx="8" cy="15" r="4.5" /><path d="m11.2 11.8 8.3-8.3M16 7l2.5 2.5M14 9l2 2" /></>,
  paw: <><circle cx="7" cy="9" r="1.8" /><circle cx="11" cy="6" r="1.8" /><circle cx="15.5" cy="7" r="1.8" /><circle cx="18" cy="11" r="1.8" /><path d="M8.5 17.5c0-2.8 2-5.5 4.5-5.5s4 2.2 4 4.4c0 1.8-1.2 3.1-3 3.1-1.3 0-1.8-.6-3-.6s-1.6.6-2.5.6c-.7 0-1-.9-1-2Z" /></>,
};

export type IconName = keyof typeof paths;

export function Icon({ name, className = "size-6", strokeWidth = 1.75 }: { name: IconName | string; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  );
}
