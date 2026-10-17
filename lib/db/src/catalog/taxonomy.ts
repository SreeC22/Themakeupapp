export const taxonomy = [
  { id: "complexion", name: "Complexion", categories: ["Foundation", "Concealer", "Color corrector", "Skin tint", "Setting powder", "Primer"] },
  { id: "cheeks", name: "Cheeks", categories: ["Blush", "Bronzer", "Contour", "Highlighter"] },
  { id: "eyes-brows", name: "Eyes & brows", categories: ["Eyeshadow", "Eyeliner", "Mascara", "Brow pencil", "Brow gel"] },
  { id: "lips", name: "Lips", categories: ["Lipstick", "Lip liner", "Lip gloss", "Lip balm"] },
  { id: "prep-finish", name: "Prep & finish", categories: ["Moisturizer", "Sunscreen", "Setting spray"] },
] as const;
export const slug = (name: string) => name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/^-|-$/g, "");
export const categories = taxonomy.flatMap(d => d.categories.map(name => ({ id: slug(name), name, divisionId: d.id })));
// Deliberately conservative: punctuation variants can be aliases, but sub-brands need human review.
export const normalizeName = (name: string) => name.normalize("NFKC").toLowerCase().replaceAll(/[™®]/g, "").replaceAll(/\s+/g, " ").trim();
