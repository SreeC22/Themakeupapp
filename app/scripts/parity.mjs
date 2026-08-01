// Quiz parity proof: extracts the live site's quiz functions from
// ../index.html and compares them against app/src/lib/tone.ts.
// House rule 6: identical results for identical inputs.
// Run: npm run parity (uses tsx so the TS module imports directly).

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

import * as app from '../src/lib/tone.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const html = readFileSync(path.join(root, 'index.html'), 'utf8');

// Pure block: ANCHORS through depthName (no DOM references).
const start = html.indexOf('const ANCHORS');
const end = html.indexOf('const UT = {');
if (start < 0 || end < 0) throw new Error('site quiz block not found in index.html');
const ctx = {};
vm.createContext(ctx);
// "const" is script-scoped inside the VM; "var" attaches to the sandbox
// global so later scripts and Node can read the values.
const attach = (src) => vm.runInContext(src.replace(/\bconst /g, 'var '), ctx);
attach(html.slice(start, end));

// UT map.
attach(html.match(/const UT = \{[\s\S]*?\};/)[0]);

// SHADE_COUNT and shadeValues (standalone pure statements).
attach(html.match(/const SHADE_COUNT = .*?;/)[0]);
attach(html.match(/const shadeValues = .*?;/)[0]);

// deriveUndertone reads answers.signals; parameterize its exact body.
const derive = html.match(/function deriveUndertone\(\)\{([\s\S]*?)\n\}/);
vm.runInContext(
  `function deriveUndertoneSite(signals){ const answers = { signals }; ${derive[1]} }`,
  ctx,
);

let checks = 0;
let failures = 0;
function eq(label, a, b) {
  checks++;
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    failures++;
    console.error(`FAIL ${label}: site=${JSON.stringify(a)} app=${JSON.stringify(b)}`);
  }
}

// 1. Depth color and name across the whole track.
for (let v = 0; v <= 100; v = Math.round((v + 0.1) * 10) / 10) {
  eq(`depthColor(${v})`, ctx.depthColor(v), app.depthColor(v));
  eq(`depthName(${v})`, ctx.depthName(v), app.depthName(v));
}

// 2. The 40-shade palette.
eq('SHADE_COUNT', ctx.SHADE_COUNT, app.SHADE_COUNT);
eq('shadeValues', ctx.shadeValues, app.shadeValues);
for (const v of ctx.shadeValues) {
  eq(`shade color ${v}`, ctx.depthColor(v), app.depthColor(v));
}

// 3. Undertone derivation over the full signal grid, in the site's
// insertion order (vein, sun, jewel).
const veins = ['warm', 'cool', 'neutral', 'olive', undefined];
const suns = ['warm', 'cool', 'neutral', undefined];
const jewels = ['warm', 'cool', 'neutral', undefined];
for (const vein of veins) {
  for (const sun of suns) {
    for (const jewel of jewels) {
      const signals = {};
      if (vein !== undefined) signals.vein = vein;
      if (sun !== undefined) signals.sun = sun;
      if (jewel !== undefined) signals.jewel = jewel;
      eq(
        `deriveUndertone(${JSON.stringify(signals)})`,
        ctx.deriveUndertoneSite(signals),
        app.deriveUndertone(signals),
      );
    }
  }
}

// 4. Tone-profile string format (the owner's inbox filters on it).
for (const depth of [0, 13, 37.5, 50, 62, 88, 100]) {
  for (const ut of ['warm', 'cool', 'neutral', 'olive']) {
    for (const overridden of [false, true]) {
      const site = `${ctx.depthName(depth)} (${ctx.depthColor(depth)}) · ${ctx.UT[ut]}${overridden ? ' (self-set)' : ''}`;
      eq(
        `profileString(${depth}, ${ut}, ${overridden})`,
        site,
        app.profileString(depth, ut, overridden),
      );
    }
  }
}

if (failures > 0) {
  console.error(`\nPARITY FAILED: ${failures} of ${checks} checks.`);
  process.exit(1);
}
console.log(`PARITY OK: ${checks} checks, site and app identical.`);
