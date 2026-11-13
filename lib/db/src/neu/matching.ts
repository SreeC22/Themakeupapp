import type { Catalog, Candidate, Category, Claim, ProfileInput, Recommendations, Shade } from "./types.ts";

export const MATCHING_VERSION = "neu-descriptor-rules-1";
const CATEGORIES: Category[] = ["Foundation", "Concealer", "Blush", "Lips"];
const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
const chosen = (s?: string | null) => Boolean(s && !["", "Not sure", "Still exploring", "No preference", "Flexible", "Open to anything"].includes(s));

/** Only fresh, explicit source assertions participate. Estimates/reports never upgrade themselves. */
export function verifiedValues(claims: Claim[], field: string, asOf: string): string[] {
  return [...new Set(claims.filter(c => {
    const age = (Date.parse(asOf) - Date.parse(c.checkedOn)) / 86400000;
    return c.field === field && c.basis === "verified" && /^https:\/\//.test(c.sourceUrl)
      && /^\d{4}-\d{2}-\d{2}$/.test(c.checkedOn) && age >= 0 && age <= 30;
  }).map(c => c.value))];
}
function single(claims: Claim[], field: string, asOf: string): string | undefined {
  const values = verifiedValues(claims, field, asOf);
  return values.length === 1 ? values[0] : undefined;
}

export function recommend(catalog: Catalog, input: ProfileInput, asOf = new Date().toISOString().slice(0, 10)): Recommendations {
  const notes = new Set<string>([
    "Manufacturer descriptors are not calibrated color measurements. These are candidates to compare, never guaranteed exact matches.",
    "Verified observations, estimates and self-reported experiences are separate. Only fresh verified assertions drive these rules.",
    "Prices are unknown unless a specific dated verified price claim is shown. Current stock is not verified. Check the linked US source before purchase.",
  ]);
  const products = new Map(catalog.products.map(p => [p.id, p]));
  const shades = new Map(catalog.shades.map(s => [s.id, s]));
  const perfect: Shade[] = [];
  const avoid = new Set<string>();
  for (const reference of input.references ?? []) {
    const shade = shades.get(reference.shadeId);
    if (!shade || shade.status !== "verified") {
      notes.add("A reference has no verified catalog identity; it is preserved locally but cannot establish a precise cross-brand match.");
      continue;
    }
    const product = products.get(shade.productId);
    if (!product || !["Foundation", "Concealer"].includes(product.category)) {
      notes.add("Only foundation/concealer references can inform complexion descriptors.");
      continue;
    }
    const goodFit = reference.fit.length === 1 && ["Blends in perfectly", "Perfect match"].includes(reference.fit[0]);
    const unstable = Boolean(reference.oxidation?.trim() && !/^(no|none|not noticed|no change(?: noticed)?|none noticed)$/i.test(reference.oxidation.trim()))
      || reference.fit.includes("Changes color after application");
    if (!goodFit || unstable) {
      avoid.add(shade.id);
      notes.add("A corrected reference or one with changing/unconfirmed stability is not used to infer a new shade. No measured lighter/darker or undertone offset is available; confirm your traits manually.");
    } else perfect.push(shade);
  }
  const referenceTrait = (field: string) => {
    const values = perfect.map(s => single(s.claims, field, asOf));
    if (!values.length) return undefined;
    if (values.some(v => v === undefined) || new Set(values).size !== 1) {
      notes.add(`Reference ${field} is missing or conflicting. A precise cross-brand match cannot be established from these references.`);
      return undefined;
    }
    return values[0];
  };
  const refDepth = referenceTrait("depth");
  const refTone = referenceTrait("undertone");
  const refTemperature = referenceTrait("temperature");
  const depth = chosen(input.depth) ? normalize(input.depth!) : refDepth;
  const tone = chosen(input.undertone) ? input.undertone! : refTone;
  const oliveTemperature = tone === "Olive"
    ? chosen(input.oliveSubtype) ? input.oliveSubtype!.split("-")[0] : refTemperature
    : undefined;
  if (perfect.length) notes.add("Reference fit is self-reported. Any inferred profile descriptor comes from the manufacturer's explicit shade description, not an exact shade equivalence.");
  if (refDepth && chosen(input.depth) && refDepth !== normalize(input.depth!)) notes.add("Your manually confirmed depth overrides a conflicting reference descriptor.");
  if (refTone && chosen(input.undertone) && refTone !== input.undertone) notes.add("Your manually confirmed undertone overrides a conflicting reference descriptor.");
  if (perfect.length && !chosen(input.depth) && refDepth) notes.add(`Reference-derived depth descriptor: ${refDepth}. You can override it in your profile.`);
  if (perfect.length && !chosen(input.undertone) && refTone) notes.add(`Reference-derived undertone descriptor: ${refTone}. You can override it in your profile.`);
  if (!depth || !tone) notes.add("Some complexion traits are unknown. Limited-evidence exploration is not a verified shade match.");
  if (chosen(input.saturation)) notes.add("Complexion saturation is not documented for the reviewed foundations/concealers; no muted or saturated formula equivalence is assumed.");

  let excludedCount = 0;
  const ranked: { candidate: Candidate; order: number }[] = [];
  for (const shade of catalog.shades) {
    const product = products.get(shade.productId);
    if (!product || shade.status !== "verified" || avoid.has(shade.id)) { excludedCount++; continue; }
    const complexion = ["Foundation", "Concealer"].includes(product.category);
    const reasons: string[] = [];
    const limitations: string[] = [];
    let order = 0;
    let exclude = false;
    let limited = false;
    const sd = single(shade.claims, "depth", asOf);
    const st = single(shade.claims, "undertone", asOf);
    const temperature = single(shade.claims, "temperature", asOf);
    const facts = [...shade.claims, ...product.claims];
    const scalar = (field: string) => single(shade.claims, field, asOf) ?? single(product.claims, field, asOf);
    if (complexion) {
      // Do not offer an arbitrary name-only complexion shade against known user traits.
      // Such lines remain browsable in the catalog; that is not a personalized shade suggestion.
      if ((depth || tone) && !sd && !st) exclude = true;
      order += Number(Boolean(sd)) + Number(Boolean(st));
      if (["depth", "undertone", "temperature"].some(f => verifiedValues(shade.claims, f, asOf).length > 1)) exclude = true;
      if (depth && sd && depth !== sd) exclude = true;
      if (depth && sd === depth) { order += 8; reasons.push(`Source depth descriptor: ${sd}; aligns with your selected/reference descriptor.`); }
      else { limited = true; limitations.push("Depth alignment is not established. Neu does not equate brand depth terms or shade numbers automatically."); }
      if (tone && st) {
        // Hard exclusions precede scoring: formula/preferences can never outweigh a known undertone conflict.
        if (tone === "Olive") {
          if (st !== "Olive") exclude = true;
          else if (oliveTemperature && temperature && oliveTemperature !== temperature) exclude = true;
          else {
            order += 8; reasons.push("Manufacturer explicitly describes this shade as olive.");
            if (!oliveTemperature || !temperature) { limited = true; limitations.push("The olive temperature is not confirmed on both sides; warm, neutral and cool olive are not interchangeable."); }
            else reasons.push(`Olive temperature descriptor: ${temperature}.`);
          }
        } else {
          if (st === "Olive" || (tone === "Cool" && temperature === "Warm") || (tone === "Warm" && temperature === "Cool")) exclude = true;
          else if (st !== tone && !(st === "Neutral" && temperature === tone)) exclude = true;
          else { order += 8; reasons.push(`Source undertone: ${st}${temperature && temperature !== st ? `, ${temperature.toLowerCase()}-leaning` : ""}.`); }
        }
      } else { limited = true; limitations.push("Undertone alignment is not established; unknown does not mean neutral."); }
      if (chosen(input.saturation)) { limited = true; limitations.push("Shade saturation has not been verified; this is not a muted/bright match claim."); }
    } else reasons.push("Color exploration, not a complexion shade equivalence. Wear any color you enjoy.");

    if (chosen(input.skinType)) {
      const types = scalar("skin_types");
      if (types?.split("|").includes(input.skinType!)) { order += 2; reasons.push(`Manufacturer lists ${input.skinType!.toLowerCase()} skin among supported types; this is not a safety guarantee.`); }
      else limitations.push("Suitability for your skin type is not established by the reviewed evidence.");
    }
    const pref = input.preferences?.[product.category];
    for (const [field, desired] of [["coverage", pref?.coverage], ["finish", pref?.finish], ["formula", pref?.formula]] as const) {
      if (!chosen(desired)) continue;
      const known = scalar(field);
      if (!known) { limited = true; limitations.push(`${field} preference cannot be verified from this source.`); }
      else if (normalize(known) !== normalize(desired!)) exclude = true;
      else { order++; reasons.push(`Source ${field}: ${known}, as requested.`); }
    }
    if (product.category === "Concealer" && chosen(pref?.intent)) {
      limitations.push(pref!.intent!.includes("bright") || pref!.intent!.includes("Bright")
        ? "Brightening is an application intent, not a verified lighter-shade offset. No automatic shade-step recommendation is made."
        : "Spot concealing uses the same depth/undertone gates; coverage claims do not guarantee correction of discoloration.");
    }
    if (product.category === "Lips") {
      const opacity = scalar("opacity");
      const wantsEven = pref?.opacity?.includes("Opaque") || pref?.opacity?.includes("even") || pref?.opacity === "High coverage" || pref?.coverage === "Full";
      const wantsSheer = pref?.opacity?.includes("Sheer") || pref?.coverage === "Sheer";
      if (wantsEven && wantsSheer) {
        exclude = true;
        notes.add("Lips: full/even coverage and sheer opacity goals conflict. Choose a consistent goal; no shade can establish both outcomes from this evidence.");
      }
      if (wantsEven && opacity === "Sheer") exclude = true;
      if (wantsSheer && opacity === "High coverage") exclude = true;
      if ((wantsEven || wantsSheer) && !opacity) { limited = true; limitations.push("Opacity is unverified; intense color is not proof of opaque coverage."); }
      if (opacity) { reasons.push(`Manufacturer opacity/coverage descriptor: ${opacity}.`); order += wantsEven && opacity === "High coverage" || wantsSheer && opacity === "Sheer" ? 3 : 0; }
      if (chosen(pref?.pigmentation) && pref?.pigmentation !== "Even") {
        limitations.push(`Your ${pref!.pigmentation!.toLowerCase()} lip pigmentation can change the visible result. High coverage is not proof of even color on two-toned lips; no verified outcome data is available.`);
        limited = true;
      }
    }
    if (pref?.colorFamilies?.some(chosen)) {
      const families = verifiedValues(facts, "color_family", asOf);
      if (!families.length) { limited = true; limitations.push("Color-family preference is unverified; names and photographs are not normalized into a color promise."); }
      else if (!pref.colorFamilies.some(wanted => families.some(f => normalize(f) === normalize(wanted)))) exclude = true;
      else { order += 2; reasons.push(`Source color family: ${families.join(", ")}.`); }
    }
    if (product.category === "Blush" && chosen(input.saturation)) {
      const saturation = scalar("saturation");
      if (saturation && saturation === input.saturation) { order++; reasons.push(`Source describes this color as ${saturation.toLowerCase()}; an aesthetic suggestion, not a complexion requirement.`); }
    }
    if (["Drugstore", "Mid-range", "Luxury"].includes(input.budget ?? "")) {
      if (catalog.brands.find(b => b.id === product.brandId)?.tier !== input.budget) exclude = true;
      limitations.push("Brand tier is an editorial browsing category, not a verified product price.");
    } else if (chosen(input.budget)) limitations.push("Budget compatibility is unknown because current prices have not been verified.");
    if (!reasons.length) reasons.push("A source-observed product shade you can explore; no personal shade alignment has been established.");
    limitations.push("Check the source for current range, price and availability. Compare on your own skin/lips before choosing.");
    if (exclude) { excludedCount++; continue; }
    ranked.push({ order, candidate: { shadeId: shade.id, productId: product.id, category: product.category,
      label: complexion ? limited ? "Limited-evidence suggestion" : "Descriptor-aligned candidate" : "Color exploration",
      reasons, limitations, sourceUrl: product.sourceUrl, checkedOn: product.checkedOn } });
  }
  const candidates: Candidate[] = [];
  for (const category of CATEGORIES) {
    const perProduct = new Map<string, number>();
    const list = ranked.filter(r => r.candidate.category === category).sort((a, b) => b.order - a.order || a.candidate.shadeId.localeCompare(b.candidate.shadeId));
    for (const entry of list) {
      // Representative discovery, not dozens of superficially identical same-line results.
      if ((perProduct.get(entry.candidate.productId) ?? 0) >= 3 || candidates.filter(c => c.category === category).length >= 6) continue;
      candidates.push(entry.candidate);
      perProduct.set(entry.candidate.productId, (perProduct.get(entry.candidate.productId) ?? 0) + 1);
    }
    if (!candidates.some(c => c.category === category)) notes.add(`${category}: no reviewed candidates meet the known constraints. Do not substitute a conflicting undertone or invent a match.`);
  }
  return { version: MATCHING_VERSION, candidates, notes: [...notes], excludedCount };
}
