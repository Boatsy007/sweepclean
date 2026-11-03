# Swept Cleaning – website

Residential cleaning website for **Swept Cleaning**, Brisbane → Tweed Heads. Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript. No other runtime dependencies.

- **Strategy, research, audit and roadmap:** [`docs/STRATEGY.md`](docs/STRATEGY.md)
- **Before going live:** [`docs/LAUNCH-CHECKLIST.md`](docs/LAUNCH-CHECKLIST.md)

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
```

Copy `.env.example` to `.env.local` for lead delivery and analytics. In development, quote requests are logged to the terminal.

## Where things live

| What | File |
|---|---|
| Business facts, contact details, commitments, trust toggles | `src/lib/site.ts` |
| Services: copy, checklists, FAQs | `src/lib/services.ts` |
| Areas: copy, local notes, suburbs | `src/lib/areas.ts` |
| General FAQs | `src/lib/faqs.ts` |
| Quote form (multi-step) | `src/components/QuoteForm.tsx` |
| Lead API (email/webhook delivery, spam protection) | `src/app/api/quote/route.ts` |
| Structured data | `src/lib/schema.ts` |
| Brand tokens | `src/app/globals.css` |

## Test

```bash
npm run build
LEAD_DEV_LOG=1 npx next start -p 3100 &
npm run test:smoke   # needs playwright (npm i -D playwright, or a global install)
```

## Deploy

Import the repo into Vercel (framework: Next.js) and set the environment variables from `.env.example`. Robots are set to `noindex` automatically on preview deployments.
