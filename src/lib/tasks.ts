/**
 * What Swept does – the owner's official task list. Everything the site promises
 * about what's cleaned should come from, or be consistent with, this list.
 */
export const tasks = [
  { name: "General tidy", detail: "Surfaces cleared, cushions and throws straightened, rooms left neat." },
  { name: "Dishes", detail: "Dishes washed, dried and put away, or loaded into the dishwasher." },
  { name: "Laundry", detail: "A load washed, hung out or dried, and folded." },
  { name: "Bed making", detail: "Beds made, with fresh linen if you leave it out." },
  { name: "Cleaning appliances", detail: "Microwave, kettle, toaster, dishwasher and fridge exteriors wiped." },
  { name: "Dusting", detail: "Surfaces, shelves, sills, frames and light fittings." },
  { name: "Blinds", detail: "Slats dusted and wiped." },
  { name: "Fans & vents", detail: "Ceiling fans, exhaust fans and air vents dusted." },
  { name: "Windows & tracks", detail: "Interior glass cleaned, tracks and sills vacuumed and wiped." },
  { name: "Kitchen cabinets", detail: "Cupboard and drawer fronts wiped and degreased." },
  { name: "Oven & stove", detail: "Stovetop, rangehood and oven cleaned and degreased." },
  { name: "Skirting boards", detail: "Skirting boards and door frames wiped down." },
  { name: "Bathrooms", detail: "Showers, screens, baths, basins, toilets, mirrors and tiles." },
  { name: "Vacuum & mopping", detail: "Carpets and rugs vacuumed, hard floors vacuumed and mopped." },
] as const;

/** Tasks customers typically add on top of a standard clean. */
export const EXTRA_TASKS = ["Dishes", "Laundry", "Bed making", "Oven & stove", "Kitchen cabinets", "Cleaning appliances", "Blinds", "Fans & vents", "Windows & tracks"] as const;
