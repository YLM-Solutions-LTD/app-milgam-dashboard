const fs = require('fs');
const prior = '/workspace/src/apps/milgam-dashboard/.agents/performance-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-2/measure-preview.cjs';
const source = fs.readFileSync(prior, 'utf8')
  .replace('https://ea51f277.app-milgam-dashboard.pages.dev/', 'https://ef2f1185.app-milgam-dashboard.pages.dev/')
  .replace('8f1e577bbcb4670878dec24ff570c1382a18d170', '3dc45f69655efd2a2c6b0ad016b1a8cf8f738066')
  .replace('body: req.postData(), bytes:', "body: req.postData(), auth: req.headers()['authorization'] || null, bytes:");
new Function('require', source)(require);
