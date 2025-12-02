import { downloadBrowser } from 'puppeteer/internal/node/install.js';

Promise.race([
  downloadBrowser(),
  new Promise((resolve, reject) => {
    setTimeout(() => { console.warn('下载超时'); resolve(0); }, 360000);
  }),
])
  .finally(() => { process.exit(0); })