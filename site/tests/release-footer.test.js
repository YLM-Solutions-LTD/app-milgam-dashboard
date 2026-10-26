import test from 'node:test';
import assert from 'node:assert/strict';
import { releaseFields } from '../release-footer.js';

test('footer only shows release details for an explicit supported environment', () => {
  const metadata = { releaseVersion: '012345abcdef', releaseUpdatedAt: '2026-10-20T09:30:00.000Z', releaseReleasedAt: '2026-10-26T12:00:00.000Z' };
  for (const language of ['en', 'he']) {
    const unknown = language === 'he' ? 'לא זמין' : 'Unavailable';
    for (const environment of [undefined, '', 'staging', 'Production', 'production ', null]) {
      const data = { ...metadata };
      if (environment !== undefined) data.releaseEnvironment = environment;
      const fields = releaseFields(data, language, 'Asia/Jerusalem');
      assert.deepEqual([fields.version, fields.updated, fields.released], [unknown, unknown, unknown]);
    }
    const preview = releaseFields({ ...metadata, releaseEnvironment: 'preview' }, language, 'Asia/Jerusalem');
    assert.equal(preview.released, language === 'he' ? 'טרם פורסם' : 'Not released');
    const production = releaseFields({ ...metadata, releaseEnvironment: 'production' }, language, 'Asia/Jerusalem');
    assert.equal(production.version, metadata.releaseVersion);
    assert.notEqual(production.updated, unknown);
    assert.notEqual(production.released, unknown);
  }
});
