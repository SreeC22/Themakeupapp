import { OverviewPage, ColorsPage, FontsPage, LayoutPage } from "@workspace/neu-design-system/guide";

export default function DesignGuidePage() {
  return <main className="content">
    <OverviewPage allowThemeSwitch={false} />
    <details className="guide-disclosure"><summary>Color tokens</summary><ColorsPage /></details>
    <details className="guide-disclosure"><summary>Typography rules</summary><FontsPage /></details>
    <details className="guide-disclosure"><summary>Spacing and accessibility rules</summary><LayoutPage /></details>
  </main>;
}
