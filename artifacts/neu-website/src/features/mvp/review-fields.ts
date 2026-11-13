import type { LaunchCategory } from "./catalog";

export type ObservationField = { key: string; label: string; options: string[] };
const base: ObservationField[] = [
  { key: "shadeResult", label: "Shade result", options: ["Blends in", "Too warm", "Too cool", "Too orange", "Too pink", "Too yellow", "Too light", "Too dark", "Gray / ashy", "Changes after application", "Not sure"] },
  { key: "coverage", label: "Coverage I experienced", options: ["Sheer", "Medium", "Full", "Not sure"] },
  { key: "wear", label: "Wear I experienced", options: ["Comfortable", "Drying", "Oily over time", "Creasing", "Faded", "Not sure"] },
];
export function observationFields(category: LaunchCategory): ObservationField[] {
  if (category === "Foundation" || category === "Concealer") return base;
  if (category === "Blush") return [
    { key: "visibility", label: "Appearance on my complexion", options: ["Visible", "Hard to see", "Ashy", "Too pigmented", "Not sure"] },
    { key: "blend", label: "Application", options: ["Buildable", "Easy to blend", "Difficult to blend", "Not sure"] },
    { key: "feel", label: "Formula feel", options: ["Comfortable", "Drying", "Sticky", "Not sure"] },
  ];
  return [
    { key: "upperOpacity", label: "Opacity on my upper lip", options: ["Sheer", "Partly covers", "Opaque", "Not sure"] },
    { key: "lowerOpacity", label: "Opacity on my lower lip", options: ["Sheer", "Partly covers", "Opaque", "Not sure"] },
    { key: "visibleColor", label: "Compared with advertised color", options: ["Similar", "Warmer", "Cooler", "Lighter", "Darker", "Not sure"] },
    { key: "longevity", label: "Wear", options: ["Faded quickly", "Lasted through my wear", "Uneven fading", "Not sure"] },
    { key: "liner", label: "Lip liner used", options: ["Yes", "No", "Not sure"] },
  ];
}
