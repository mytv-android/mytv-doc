// 把 dist/mytv-doc/browser/index.html 复制为 404.html，让 GitHub Pages 在刷新非根路径时也能落到 SPA 入口。
import { copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const browserDir = join(here, '..', 'dist', 'mytv-doc', 'browser');
copyFileSync(join(browserDir, 'index.html'), join(browserDir, '404.html'));
console.log('[ghpages-404] wrote dist/mytv-doc/browser/404.html');
