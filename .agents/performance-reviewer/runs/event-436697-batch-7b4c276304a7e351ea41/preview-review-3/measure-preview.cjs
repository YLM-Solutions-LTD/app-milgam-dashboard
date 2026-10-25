const fs = require('fs');
const prior = '/workspace/src/apps/milgam-dashboard/.agents/performance-reviewer/runs/event-436697-batch-7b4c276304a7e351ea41/preview-review-2/measure-preview.cjs';
const source = fs.readFileSync(prior, 'utf8')
  .replace('https://ea51f277.app-milgam-dashboard.pages.dev/', 'https://5ab11833.app-milgam-dashboard.pages.dev/')
  .replace('8f1e577bbcb4670878dec24ff570c1382a18d170', 'c9686ba1ad6d4f7b0896ba32c29ad38dcf607022')
  .replace('body: req.postData(), bytes:', "body: req.postData(), auth: req.headers()['authorization'] || null, bytes:");
new Function('require', source)(require);
