#!/usr/bin/env node
/*
 * Runs every regression suite against its own fresh production server (`next start`), one port per
 * suite. The quote API's rate limit and spam traps are per server process, so each suite starts with a
 * clean limit – without weakening or bypassing them.
 *
 *   npm run build && npm run test:all
 */
const { spawn, spawnSync } = require("child_process");
const path = require("path");

const root = path.join(__dirname, "..");
const suites = [
  ["smoke", ["scripts/smoke.cjs"]],
  ["seo", ["scripts/seo-check.cjs"]],
  ["bookingkoala", ["scripts/bookingkoala-check.cjs"]],
  ["cta", ["scripts/cta-check.cjs"]],
  // Jobber's embedded request form on /quote (real snippet + simulated Jobber success).
  ["jobber", ["scripts/jobber-check.cjs"]],
  // Lead webhook payload (Make.com) – a local capture server stands in for the webhook.
  ["webhook-a", ["scripts/webhook-check.cjs"], { LEAD_WEBHOOK_URL: "http://127.0.0.1:3299/hook" }, { CASES: "a", WEBHOOK_PORT: "3299" }],
  ["webhook-b", ["scripts/webhook-check.cjs"], { LEAD_WEBHOOK_URL: "http://127.0.0.1:3299/hook" }, { CASES: "b", WEBHOOK_PORT: "3299" }],
  // Enquiry delivery with a simulated Resend (starts its own servers, one per delivery setting).
  ["delivery", ["scripts/delivery-check.cjs"], null],
];

async function waitFor(url, ms = 30000) {
  const t = Date.now();
  while (Date.now() - t < ms) {
    try { if ((await fetch(url)).ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`server at ${url} did not start`);
}

(async () => {
  let failed = 0;
  let port = 3201;
  for (const [name, args, serverEnv = {}, suiteEnv = {}] of suites) {
    if (serverEnv === null) {
      console.log(`\n=== ${name} (starts its own servers) ===`);
      const r = spawnSync(process.execPath, args, { cwd: root, env: process.env, stdio: "inherit" });
      if (r.status !== 0) { failed++; console.log(`--- ${name}: FAILED`); } else console.log(`--- ${name}: passed`);
      continue;
    }
    const p = port++;
    const server = spawn(process.execPath, [require.resolve("next/dist/bin/next", { paths: [root] }), "start", "-p", String(p)], { cwd: root, env: { ...process.env, LEAD_DEV_LOG: "1", PORT: String(p), ...serverEnv }, stdio: "ignore" });
    try {
      await waitFor(`http://localhost:${p}/robots.txt`);
      console.log(`\n=== ${name} (fresh server on :${p}) ===`);
      const r = spawnSync(process.execPath, args, { cwd: root, env: { ...process.env, BASE: `http://localhost:${p}`, SITE_URL: process.env.SITE_URL || "https://sweptcleans.com.au", ...suiteEnv }, stdio: "inherit" });
      if (r.status !== 0) { failed++; console.log(`--- ${name}: FAILED`); } else console.log(`--- ${name}: passed`);
    } finally {
      server.kill();
    }
  }
  console.log(failed ? `\n${failed} suite(s) failed` : "\nAll suites passed");
  process.exit(failed ? 1 : 0);
})();
