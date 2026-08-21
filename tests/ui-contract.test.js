import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const appUrl = new URL("../app.js", import.meta.url);
const cssUrl = new URL("../app.css", import.meta.url);
const htmlUrl = new URL("../index.html", import.meta.url);

test("static app pins XState 4.38.3 and exposes Hebrew-first accessible shell", async () => {
  const html = await readFile(htmlUrl, "utf8");
  assert.match(html, /lang="he" dir="rtl"/);
  assert.match(html, /xstate@4\.38\.3\/dist\/xstate\.js/);
  assert.doesNotMatch(html, /xstate\.web\.js/);
  assert.match(html, /דשבורד קריאות מילגם/);
  assert.match(html, /aria-live="polite"/);
});

test("renderer contains all eight dashboard components and null-average em dash", async () => {
  const source = await readFile(appUrl, "utf8");
  for (const required of [
    "חלוקה לפי חטיבות",
    "בניין מטה מול סניפים",
    "תמהיל קריאות מטה",
    "תמהיל קריאות סניפים",
    "ממוצע ימים לסגירת קריאה – מטה",
    "ממוצע ימים לסגירת קריאה – סניפים",
    "headquarters",
    "branches"
  ]) assert.ok(source.includes(required), `missing UI contract text: ${required}`);
  assert.match(source, /if \(value === null\) return "—"/);
  assert.match(source, /<caption class="sr-only">/);
});

test("styles use the required background, responsive layouts, logical properties, focus, and reduced motion", async () => {
  const css = await readFile(cssUrl, "utf8");
  assert.match(css, /--page: #f2f5fc/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /margin-inline/);
  assert.match(css, /inline-size/);
});

test("production source contains no forbidden endpoint or data fallback", async () => {
  const source = await readFile(appUrl, "utf8");
  assert.doesNotMatch(source, /EventStatistics|byAverage|fabricated|mockData|fixture/i);
});
