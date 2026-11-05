import type { Guide } from "@/lib/guides";
import { guide as brisbaneCleaningCost } from "./how-much-does-house-cleaning-cost-in-brisbane";
import { guide as goldCoastCleaningPrices } from "./average-price-cleaning-services-gold-coast";
import { guide as tweedCleaningPrices } from "./average-price-cleaning-services-tweed-heads";
import { guide as loganCleaningCost } from "./how-much-does-house-cleaning-cost-in-logan";
import { guide as bondBrisbane } from "./bond-cleaning-cost-brisbane";
import { guide as bondLogan } from "./bond-cleaning-cost-logan";
import { guide as bondGoldCoast } from "./bond-cleaning-cost-gold-coast";
import { guide as bondTweed } from "./bond-cleaning-cost-tweed-heads";
import { guide as emergencyCleaning } from "./emergency-cleaning-services-how-quickly-can-you-help";
import { guide as hiringQuestions } from "./questions-to-ask-before-hiring-a-house-cleaner";
import { guide as avoidScams } from "./how-to-avoid-getting-scammed-by-cleaning-services";
import { guide as inspectionCleaning } from "./rental-inspection-cleaning-what-should-be-done";

/*
 * Published Cleaning Guides.
 *
 * To publish a guide: create src/content/guides/<slug>.ts exporting `const guide: Guide`,
 * import it below and add it to the array. Nothing else needs changing – the guides page,
 * article page, metadata, sitemap and related links update automatically.
 * Full instructions: docs/CLEANING-GUIDES.md
 */

export const guideList: Guide[] = [brisbaneCleaningCost, goldCoastCleaningPrices, tweedCleaningPrices, loganCleaningCost, bondBrisbane, bondLogan, bondGoldCoast, bondTweed, emergencyCleaning, hiringQuestions, avoidScams, inspectionCleaning];
