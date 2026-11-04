import { pageMeta } from "@/lib/seo";
import { MotionReport } from "./MotionReport";

export const metadata = pageMeta({ title: "Motion check | Swept Cleaning", description: "Diagnostic page showing whether animations are enabled in this browser.", path: "/motion-check", noindex: true });

export default function MotionCheck() {
  const commit = (process.env.VERCEL_GIT_COMMIT_SHA ?? "local").slice(0, 7);
  const builtAt = new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC";
  return (
    <section className="container-x max-w-2xl py-14">
      <h1 className="text-3xl font-extrabold">Animation check</h1>
      <p className="mt-3">This page shows why animations may not be visible in this browser.</p>
      <MotionReport commit={commit} builtAt={builtAt} />
      <div className="intro mt-8 rounded-2xl bg-violet p-6 font-display text-lg font-semibold text-white [--d:300ms]">
        If animation is working, this purple box slid up and faded in when the page loaded.
      </div>
    </section>
  );
}
