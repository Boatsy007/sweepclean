/*
 * Flat brand illustrations used where the mockup shows photography.
 * They hold the layout until real photos of Swept's work are available –
 * set paths in `site.images` (src/lib/site.ts) and the photo replaces the scene.
 */

const C = {
  wall: "#EEE9FF",
  floor: "#DCD3FF",
  violet: "#5B35D5",
  violetSoft: "#8E6CF0",
  lilac: "#C9BBFF",
  navy: "#0B1A3A",
  white: "#FFFFFF",
  leaf: "#3E9C7A",
  leafLight: "#63BE98",
  wood: "#C99A6E",
  sky: "#CFE0FF",
};

function Plant({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0c-8-18-28-22-34-40 18 2 30 14 34 30 2-22-6-40 2-60 10 18 8 40 2 62 6-16 18-26 34-28-6 18-26 22-38 36Z" fill={C.leaf} />
      <path d="M2 -6c-2-14 2-30 12-40-2 14-6 28-12 40Z" fill={C.leafLight} />
      <path d="M-16 0h36l-5 30h-26Z" fill={C.white} stroke={C.lilac} strokeWidth="2" />
    </g>
  );
}

function Sparkle({ x, y, s = 10, fill = C.violetSoft }: { x: number; y: number; s?: number; fill?: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -1 C .14 -.14 .14 -.14 1 0 C .14 .14 .14 .14 0 1 C -.14 .14 -.14 .14 -1 0 C -.14 -.14 -.14 -.14 0 -1 Z" fill={fill} />;
}

export function LivingScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 240" className={className} role="presentation" aria-hidden="true" preserveAspectRatio="xMidYMax slice">
      <rect width="400" height="240" fill={C.wall} />
      <rect x="250" y="28" width="110" height="120" rx="8" fill={C.sky} />
      <path d="M250 120h20v-30h12v30h10v-48h14v48h10v-20h14v20h30v28H250Z" fill="#B7CBF5" />
      <path d="M305 28v120M250 88h110" stroke={C.white} strokeWidth="5" />
      <rect y="190" width="400" height="50" fill={C.floor} />
      <ellipse cx="160" cy="206" rx="120" ry="12" fill="#C8BCF7" />
      <rect x="64" y="122" width="192" height="58" rx="22" fill={C.white} />
      <rect x="52" y="140" width="28" height="52" rx="12" fill={C.white} stroke={C.lilac} strokeWidth="2" />
      <rect x="240" y="140" width="28" height="52" rx="12" fill={C.white} stroke={C.lilac} strokeWidth="2" />
      <rect x="78" y="160" width="164" height="30" rx="10" fill="#F7F5FF" stroke={C.lilac} strokeWidth="2" />
      <rect x="92" y="116" width="44" height="40" rx="12" fill={C.lilac} transform="rotate(-8 114 136)" />
      <rect x="180" y="116" width="44" height="40" rx="12" fill="#7FC7B0" transform="rotate(6 202 136)" />
      <Plant x={330} y={176} s={0.95} />
      <Sparkle x={210} y={70} s={9} />
      <Sparkle x={232} y={92} s={5} fill={C.lilac} />
    </svg>
  );
}

export function BathScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 240" className={className} role="presentation" aria-hidden="true" preserveAspectRatio="xMidYMax slice">
      <rect width="400" height="240" fill="#F4F2FF" />
      {Array.from({ length: 9 }).map((_, i) => (
        <path key={i} d={`M${i * 48} 0v190`} stroke="#E4DEFF" strokeWidth="2" />
      ))}
      {Array.from({ length: 4 }).map((_, i) => (
        <path key={i} d={`M0 ${i * 48 + 46}h400`} stroke="#E4DEFF" strokeWidth="2" />
      ))}
      <rect y="190" width="400" height="50" fill={C.floor} />
      <path d="M96 128h196c0 44-30 66-98 66s-98-22-98-66Z" fill={C.white} stroke={C.lilac} strokeWidth="2" />
      <rect x="88" y="120" width="212" height="12" rx="6" fill={C.white} stroke={C.lilac} strokeWidth="2" />
      <path d="M262 120V84c0-10 14-10 14 0" fill="none" stroke="#9AA3BF" strokeWidth="6" strokeLinecap="round" />
      <rect x="120" y="194" width="10" height="14" rx="3" fill="#9AA3BF" />
      <rect x="258" y="194" width="10" height="14" rx="3" fill="#9AA3BF" />
      <circle cx="150" cy="112" r="10" fill={C.white} stroke={C.lilac} strokeWidth="2" />
      <circle cx="168" cy="104" r="7" fill={C.white} stroke={C.lilac} strokeWidth="2" />
      <circle cx="182" cy="114" r="6" fill={C.white} stroke={C.lilac} strokeWidth="2" />
      <Plant x={58} y={176} s={0.9} />
      <rect x="320" y="150" width="36" height="40" rx="4" fill={C.white} stroke={C.lilac} strokeWidth="2" />
      <path d="M326 150v-10h24v10" fill={C.lilac} />
      <Sparkle x={236} y={60} s={11} />
      <Sparkle x={262} y={40} s={6} fill={C.lilac} />
    </svg>
  );
}

export function ComfortScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 240" className={className} role="presentation" aria-hidden="true" preserveAspectRatio="xMidYMax slice">
      <rect width="400" height="240" fill={C.wall} />
      <rect x="40" y="30" width="96" height="110" rx="8" fill={C.sky} />
      <path d="M88 30v110M40 84h96" stroke={C.white} strokeWidth="5" />
      <rect y="190" width="400" height="50" fill={C.floor} />
      <path d="M170 110c0-22 18-30 50-30s50 8 50 30v52h-100Z" fill={C.violetSoft} />
      <rect x="156" y="132" width="26" height="58" rx="12" fill={C.violet} />
      <rect x="258" y="132" width="26" height="58" rx="12" fill={C.violet} />
      <rect x="172" y="150" width="96" height="28" rx="10" fill="#7B57E8" />
      <rect x="168" y="188" width="8" height="14" rx="3" fill={C.navy} opacity=".5" />
      <rect x="264" y="188" width="8" height="14" rx="3" fill={C.navy} opacity=".5" />
      <rect x="300" y="150" width="54" height="8" rx="4" fill={C.wood} />
      <path d="M306 158l-6 38M348 158l6 38" stroke={C.wood} strokeWidth="5" strokeLinecap="round" />
      <path d="M314 150v-14h20v14" fill={C.white} stroke={C.lilac} strokeWidth="2" />
      <path d="M334 140c8 0 8 8 0 8" fill="none" stroke={C.lilac} strokeWidth="2.5" />
      <path d="M320 128c0-6 4-6 4-12M328 128c0-6 4-6 4-12" stroke={C.lilac} strokeWidth="2" strokeLinecap="round" fill="none" />
      <Plant x={60} y={176} s={0.9} />
      <path d="M215 64c-6-8-20-4-18 6 2 8 18 16 18 16s16-8 18-16c2-10-12-14-18-6Z" fill="#F08DB4" />
      <Sparkle x={250} y={56} s={7} fill={C.lilac} />
    </svg>
  );
}

export function MoveScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 240" className={className} role="presentation" aria-hidden="true" preserveAspectRatio="xMidYMax slice">
      <rect width="400" height="240" fill="#F5F3FF" />
      <rect x="230" y="26" width="130" height="124" rx="8" fill={C.sky} />
      <path d="M295 26v124M230 88h130" stroke={C.white} strokeWidth="5" />
      <rect y="190" width="400" height="50" fill="#E3DBFF" />
      <path d="M0 214h400" stroke="#D3C8FF" strokeWidth="2" />
      <rect x="70" y="128" width="90" height="64" rx="4" fill={C.wood} />
      <path d="M70 146h90M115 128v18" stroke="#A97C54" strokeWidth="3" />
      <rect x="90" y="84" width="64" height="46" rx="4" fill="#D8AE84" />
      <path d="M90 98h64M122 84v14" stroke="#A97C54" strokeWidth="3" />
      <rect x="170" y="150" width="60" height="42" rx="4" fill="#D8AE84" />
      <path d="M170 162h60M200 150v12" stroke="#A97C54" strokeWidth="3" />
      <rect x="276" y="160" width="10" height="32" rx="3" fill={C.violet} />
      <path d="M262 192h38" stroke={C.violet} strokeWidth="6" strokeLinecap="round" />
      <path d="M281 160V72" stroke="#9AA3BF" strokeWidth="5" strokeLinecap="round" />
      <path d="M266 192c4-14 26-14 30 0" fill={C.lilac} />
      <Sparkle x={330} y={176} s={10} />
      <Sparkle x={354} y={160} s={5} fill={C.lilac} />
    </svg>
  );
}

export const serviceScenes = {
  home: LivingScene,
  sparkle: BathScene,
  heart: ComfortScene,
  box: MoveScene,
} as const;
