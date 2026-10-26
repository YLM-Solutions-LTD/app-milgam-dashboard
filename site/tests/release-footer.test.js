import test from "node:test";
import assert from "node:assert/strict";
import { releaseFields } from "../assets/release-footer.js";

test("footer exposes no facts for missing or unsupported environments", () => {
  for (const releaseEnvironment of [undefined, "", "PREVIEW", "staging", "production "]) {
    const result = releaseFields({ releaseEnvironment, releaseVersion: "abcdef123456", releaseUpdatedAt: "2026-01-01T00:00:00Z" }, "en", "UTC");
    assert.deepEqual([result.version, result.updated, result.released], ["Unavailable", "Unavailable", "Unavailable"]);
  }
});

test("footer distinguishes preview from production using only stamped metadata", () => {
  const common = { releaseVersion: "abcdef123456", releaseUpdatedAt: "2026-01-01T00:00:00Z" };
  const preview = releaseFields({ ...common, releaseEnvironment: "preview", releaseReleasedAt: "" }, "en", "UTC");
  assert.equal(preview.version, "abcdef123456 (Preview)");
  assert.equal(preview.released, "Not released");
  const production = releaseFields({ ...common, releaseEnvironment: "production", releaseReleasedAt: "2026-01-02T00:00:00Z" }, "he", "UTC");
  assert.equal(production.version, "abcdef123456");
  assert.notEqual(production.released, "לא זמין");
});
