import type { Guide } from "@/lib/guides";
import { guide as brisbaneCleaningCost } from "./how-much-does-house-cleaning-cost-in-brisbane";
import { guide as goldCoastCleaningPrices } from "./average-price-cleaning-services-gold-coast";
import { guide as tweedCleaningPrices } from "./average-price-cleaning-services-tweed-heads";
import { guide as loganCleaningCost } from "./how-much-does-house-cleaning-cost-in-logan";
import { guide as bondBrisbane } from "./bond-cleaning-cost-brisbane";
import { guide as bondLogan } from "./bond-cleaning-cost-logan";
import { guide as bondGoldCoast } from "./bond-cleaning-cost-gold-coast";
import { guide as bondTweed } from "./bond-cleaning-cost-tweed-heads";

/*
 * Published Cleaning Guides.
 *
 * To publish a guide: create src/content/guides/<slug>.ts exporting `const guide: Guide`,
 * import it below and add it to the array. Nothing else needs changing – the guides page,
 * article page, metadata, sitemap and related links update automatically.
 * Full instructions: docs/CLEANING-GUIDES.md
 */

export const guideList: Guide[] = [brisbaneCleaningCost, goldCoastCleaningPrices, tweedCleaningPrices, loganCleaningCost, bondBrisbane, bondLogan, bondGoldCoast, bondTweed];
