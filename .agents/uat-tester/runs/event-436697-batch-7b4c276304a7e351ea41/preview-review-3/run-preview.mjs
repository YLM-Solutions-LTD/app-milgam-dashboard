import fs from 'node:fs/promises';

const prior = new URL('../preview-review-2/run-preview.mjs', import.meta.url);
let source = await fs.readFile(prior, 'utf8');
source = source
  .replace("import playwright from '../../../tmp/playwright/node_modules/playwright-core/index.js';", "import playwright from 'file:///workspace/src/apps/milgam-dashboard/.agents/uat-tester/tmp/playwright/node_modules/playwright-core/index.js';")
  .replace("const preview = 'https://ea51f277.app-milgam-dashboard.pages.dev';", "const preview = 'https://42ad1c5f.app-milgam-dashboard.pages.dev';")
  .replace("const head = '8f1e577bbcb4670878dec24ff570c1382a18d170';", "const head = 'b138df3040ab4468220a29f595d0caa62920f679';")
  .replace("const out = new URL('./evidence/', import.meta.url);", "const out = new URL('file:///workspace/src/apps/milgam-dashboard/.agents/uat-tester/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-3/evidence/');");
await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
