import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const appUrl = new URL("../app.js", import.meta.url);
const cssUrl = new URL("../app.css", import.meta.url);
const htmlUrl = new URL("../index.html", import.meta.url);
const headersUrl = new URL("../_headers", import.meta.url);
const dependencyUrl = new URL("../assets/xstate-4.38.3.js", import.meta.url);

test("static app pins same-origin XState 4.38.3 and exposes Hebrew-first accessible shell", async () => {
  const html = await readFile(htmlUrl, "utf8");
  assert.match(html, /lang="he" dir="rtl"/);
  assert.match(html, /\.\/assets\/xstate-4\.38\.3\.js/);
  assert.doesNotMatch(html, /https?:\/\//);
  assert.doesNotMatch(html, /xstate\.web\.js/);
  assert.match(html, /דשבורד קריאות מילגם/);
  assert.match(html, /aria-live="polite"/);
});

test("static response policy confines executable code and the reviewed dependency is shipped", async () => {
  const [headers, dependency] = await Promise.all([readFile(headersUrl, "utf8"), readFile(dependencyUrl, "utf8")]);
  assert.match(headers, /Content-Security-Policy: default-src 'self'; script-src 'self'/);
  assert.match(headers, /object-src 'none'/);
  assert.match(headers, /script-src 'self'; style-src/);
  assert.match(dependency, /XState/);
});

test("verified same-origin SimplyVibe SDK is packaged without a public injected adapter", async () => {
  const [html, app, services, sdk] = await Promise.all([
    readFile(htmlUrl, "utf8"), readFile(appUrl, "utf8"),
    readFile(new URL("../host-services.js", import.meta.url), "utf8"),
    readFile(new URL("../assets/simplyvibe-client.js", import.meta.url), "utf8")
  ]);
  assert.match(html, /\.\/assets\/simplyvibe-client\.js/);
  assert.match(app, /createHostBootstrap/);
  assert.doesNotMatch(`${app}\n${services}`, /SimplyVibeHostAdapter/);
  assert.match(sdk, /function SimplyVibeClient/);
});

test("permit cleanup captures the control before awaits and guards focus", async () => {
  const source = await readFile(appUrl, "utf8");
  assert.match(source, /const activatingElement = event\.currentTarget/);
  assert.doesNotMatch(source, /event\.currentTarget\.focus/);
  assert.match(source, /activatingElement\?\.isConnected/);
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

test("chart rendering uses CSP-safe local classes and SVG presentation attributes", async () => {
  const [source, css] = await Promise.all([readFile(appUrl, "utf8"), readFile(cssUrl, "utf8")]);
  assert.doesNotMatch(source, /style=/);
  assert.doesNotMatch(source, /\.style\b/);
  assert.match(source, /<svg class="donut-svg"/);
  assert.match(source, /stroke-dasharray=/);
  assert.match(source, /magnitudeClass/);
  assert.match(css, /\.color-5/);
  assert.match(css, /\.magnitude-20/);
});

test("production source contains no forbidden endpoint or data fallback", async () => {
  const source = await readFile(appUrl, "utf8");
  assert.doesNotMatch(source, /EventStatistics|byAverage|fabricated|mockData|fixture/i);
});
