import { desc } from "drizzle-orm";
import { db, neuResearchObservations, neuSources } from "../index";

export async function loadNeuResearch() {
  return db.transaction(async tx => {
    const observations = await tx.select().from(neuResearchObservations).orderBy(desc(neuResearchObservations.createdAt), desc(neuResearchObservations.id));
    const sources = await tx.select().from(neuSources);
    const seen = new Set<string>();
    const entries = observations.flatMap(o => {
      const source = sources.find(s => s.id === o.sourceId);
      if (!source) return [];
      const key = JSON.stringify([source.url, o.productName, o.shade]);
      if (seen.has(key)) return [];
      seen.add(key);
      return [{
        id: o.id, productName: o.productName, shade: o.shade, sourceUrl: source.url, observedOn: source.observedOn,
        platform: o.platform, reportedCharacteristics: o.reportedCharacteristics, positive: o.positive, negative: o.negative,
        routines: o.routines, disclosure: o.disclosure, strength: o.strength, independentGroup: o.independentGroup,
        // Promotion requires a separately reviewed research policy; no favorite is claimed by a lone observation.
        status: "research_candidate" as const,
      }];
    });
    return { entries, notes: [
      "These are dated source observations, not public Neu reviews, votes or endorsements.",
      "A manufacturer claim, creator report and independent repeat experience are different evidence types.",
      "Independent corroboration and genuinely supported favorites are not established in this initial library.",
      "Missing characteristics, disclosures, negatives or exact shades are unknown—not evidence of absence.",
      "Historical experiences do not establish current formula performance, personal fit or safe cross-application.",
      "The initial editorial experiences are older UK reports, not evidence of current US formula equivalence. A misspelled shade remains unreconciled.",
      "Public Neu reviews and community remain deferred until at least 500 registered users and separate owner approval.",
    ] };
  }, { isolationLevel: "repeatable read", accessMode: "read only" });
}
