import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";

// Accept the review checkout too, so the GitHub branch and preview use one check.
const root = path.resolve(
  process.argv[2] || "artifacts/mockup-sandbox/public/neu-website",
);
const read = (name) => readFileSync(path.join(root, name), "utf8");
const landing = read("index.html");
const community = read("community.html");
const script = read("community.js");
const styles = read("community.css");
const inlineScripts = [...landing.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
  .map((match) => match[1]);

// The public landing page's complete quiz/waitlist script, before this port.
assert.equal(inlineScripts.length, 1, "Keep the original landing script intact");
assert.equal(
  createHash("sha256").update(inlineScripts[0]).digest("hex"),
  "45f44c827873d319d56ffe88af7130425103499ced259663cab327046e6c76f4",
  "The existing tone quiz and waitlist behavior must remain byte-identical",
);
new vm.Script(inlineScripts[0], { filename: "index.html inline script" });
new vm.Script(script, { filename: "community.js" });
new vm.Script(read("community-config.js"), { filename: "community-config.js" });

for (const [filename, html] of [["index.html", landing], ["community.html", community]]) {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${filename}: duplicate element IDs`);
  assert(!/<input\b[^>]*type=["']file["']/i.test(html), "No photo-upload requests");
  for (const [, value] of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)) {
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value)) continue;
    const target = value.split(/[?#]/)[0];
    assert(!target.startsWith("/"), `${filename}: links must work on GitHub Pages`);
    if (target) {
      assert(existsSync(path.join(root, target)), `${filename}: missing local link ${target}`);
    }
  }
}
for (const view of ["feed", "share", "saved", "profile"]) {
  assert(community.includes(`id="view-${view}"`), `Missing ${view} view`);
  assert(community.includes(`data-view="${view}"`), `Missing ${view} navigation`);
}
assert(/community\.html/.test(landing), "Landing page must link to the community");
assert(/example/i.test(community + script), "Example content must be labeled");
assert(script.includes("neu.web.profile.v1"), "Preserve the existing local tone profile");
assert(/formsubmit\.co\/ajax\//.test(inlineScripts[0]), "Preserve the waitlist provider");
assert(
  /\.product-dialog:not\(\[open\]\)\s*\{\s*display:\s*none/.test(styles),
  "Closed product dialogs must remain hidden from display and accessibility",
);
console.log("Neu checks passed: quiz/waitlist unchanged, JavaScript syntax, local links, unique IDs, four views, privacy and example labels.");
