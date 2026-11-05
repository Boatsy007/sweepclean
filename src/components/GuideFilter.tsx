"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/*
 * Topic filter for the Cleaning Guides listing.
 * Every guide card is rendered on the server (so all guides stay in the HTML for search
 * engines); the filter only hides cards that don't match. The chosen topic is kept in the
 * URL as ?topic=<slug> so filtered views can be shared and bookmarked.
 */

const topicSlug = (t: string) => t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type Ctx = { topic: string | null; setTopic: (t: string | null) => void };
const TopicContext = createContext<Ctx>({ topic: null, setTopic: () => {} });

export function GuideTopicProvider({ topics, children }: { topics: string[]; children: ReactNode }) {
  const [topic, setTopicState] = useState<string | null>(null);

  // Read ?topic= on load (and on back/forward).
  useEffect(() => {
    const read = () => {
      const q = new URLSearchParams(window.location.search).get("topic");
      setTopicState(topics.find((t) => topicSlug(t) === q) ?? null);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, [topics]);

  const setTopic = (t: string | null) => {
    setTopicState(t);
    const url = new URL(window.location.href);
    if (t) url.searchParams.set("topic", topicSlug(t));
    else url.searchParams.delete("topic");
    window.history.replaceState(null, "", url);
  };

  return <TopicContext.Provider value={{ topic, setTopic }}>{children}</TopicContext.Provider>;
}

export function TopicChips({ topics, counts, total }: { topics: string[]; counts: Record<string, number>; total: number }) {
  const { topic, setTopic } = useContext(TopicContext);
  const chip = (label: string, value: string | null, n: number) => {
    const on = topic === value;
    return (
      <li key={label}>
        <button
          type="button"
          aria-pressed={on}
          aria-controls="guide-grid"
          onClick={() => {
            setTopic(on && value ? null : value);
            // On phones the grid is below the fold – bring it into view so the result is visible.
            const results = document.getElementById("guide-results");
            if (results && results.getBoundingClientRect().top > window.innerHeight * 0.75) results.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
            on ? "border-violet bg-violet text-white" : "border-lilac bg-white text-violet-ink hover:border-violet hover:bg-lavender"
          }`}
        >
          {label}
          <span className={`rounded-full px-1.5 text-xs font-semibold ${on ? "bg-white/20 text-white" : "bg-lavender text-violet"}`}>{n}</span>
        </button>
      </li>
    );
  };
  return (
    <ul className="mt-7 flex flex-wrap gap-2" aria-label="Filter guides by topic">
      {chip("All guides", null, total)}
      {topics.map((t) => chip(t, t, counts[t] ?? 0))}
    </ul>
  );
}

export function GuideGrid({ items }: { items: { slug: string; categories: string[]; card: ReactNode }[] }) {
  const { topic } = useContext(TopicContext);
  const shown = items.filter((i) => !topic || i.categories.includes(topic));
  return (
    <>
      <p id="guide-results" className="mb-6 scroll-mt-28 text-sm font-medium text-slate" aria-live="polite">
        {topic ? (
          <>Showing {shown.length} {shown.length === 1 ? "guide" : "guides"} about <strong className="text-navy">{topic}</strong></>
        ) : (
          <>Showing all {items.length} guides</>
        )}
      </p>
      <ul id="guide-grid" className="reveal-stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i, n) => {
          const visible = !topic || i.categories.includes(topic);
          return (
            <li key={i.slug} hidden={!visible} className={n === 0 ? "![animation:none]" : undefined}>
              {i.card}
            </li>
          );
        })}
      </ul>
    </>
  );
}
