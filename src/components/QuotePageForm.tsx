"use client";

import { Suspense, useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { LeadQuoteForm } from "./LeadQuoteForm";
import { QuoteForm } from "./QuoteForm";

/**
 * /quote: the quote form, with the quick call-back option underneath ("Rather talk it through?").
 * The call-back form is the same one as on /contact. ?mode=callback opens it directly.
 */
export function QuotePageForm() {
  const [mode, setMode] = useState<"quote" | "callback">("quote");
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("mode") === "callback") setMode("callback");
  }, []);

  if (mode === "callback") {
    return (
      <Suspense fallback={null}>
        <QuoteForm initialMode="callback" onBackToQuote={() => setMode("quote")} />
      </Suspense>
    );
  }
  return (
    <LeadQuoteForm
      after={
        <p className="mt-4 text-center text-sm">
          Rather talk it through?{" "}
          <button type="button" onClick={() => { setMode("callback"); track("callback_mode", {}); }} className="font-semibold text-violet underline underline-offset-4">
            Request a quick call back
          </button>
        </p>
      }
    />
  );
}
