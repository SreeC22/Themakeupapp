import { lazy, type ComponentType } from "react";
import { OverviewPage, ColorsPage, FontsPage, LayoutPage } from "./neu-foundations";

export type PreviewEntry = { id: string; name: string; description: string; Page: ComponentType };
export type NavGroup = { name: string; entries: PreviewEntry[] };
const story = (name: "ButtonStory" | "TypeaheadStory" | "ChoiceStory" | "SwatchStory" | "NavigationStory") =>
  lazy(() => import("./demos/neu").then((module) => ({ default: module[name] })));
export const DESIGN_SYSTEM = {
  title: "Neu Design System",
  description: "Soft color. Clear choices. A shared foundation for confident makeup discovery.",
} as const;
export const OVERVIEW_ENTRY: PreviewEntry = {
  id: "overview", name: "Overview", description: "The Neu component pilot and usage rules.", Page: OverviewPage,
};
export const NAV_GROUPS: NavGroup[] = [
  { name: "Foundations", entries: [
    { id: "colors", name: "Colors", description: "Approved light palette and derived dark palette.", Page: ColorsPage },
    { id: "fonts", name: "Typography", description: "Headlines, reading text and utility labels.", Page: FontsPage },
    { id: "layout", name: "Spacing and accessibility", description: "Compact layouts and accessible interaction rules.", Page: LayoutPage },
  ] },
  { name: "Neu components", entries: [
    { id: "button", name: "Buttons", description: "Primary, secondary, text and disabled actions.", Page: story("ButtonStory") },
    { id: "typeahead", name: "Typed autocomplete", description: "Keyboard suggestions and manual entries.", Page: story("TypeaheadStory") },
    { id: "choice", name: "Choices", description: "Selected, unselected and multi-select states.", Page: story("ChoiceStory") },
    { id: "swatch", name: "Tone swatches", description: "Accessible labeled color selection.", Page: story("SwatchStory") },
    { id: "navigation", name: "Step navigation", description: "Back, optional skip and one primary action.", Page: story("NavigationStory") },
  ] },
];
export const ALL_ENTRIES: PreviewEntry[] = [OVERVIEW_ENTRY, ...NAV_GROUPS.flatMap((group) => group.entries)];
