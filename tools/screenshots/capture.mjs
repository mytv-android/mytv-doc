// 用无头 Chrome（CDP）批量截全页图。默认针对本地面板，也可以指向文档站本地预览。
//
//   node tools/screenshots/capture.mjs http://localhost:10592 ./pages.json ./out
//
// pages.json 是一个数组，每项：
//   { "name": "panel-sources", "path": "/sources?lang=zh",
//     "waitMs": 3500,                    // 导航后等待渲染
//     "pre": "(() => { ... })()",        // 可选：截图前执行的 JS（可 await）
//     "afterMs": 800 }                   // 执行 pre 后再等多久
//
// 注：面板把内容放在 .main-content 里自行滚动，直接截只能拿到一屏，
// 所以截图前会先注入样式把它展开。

import { spawn } from 'node:child_process';
import fs from 'node:fs';

const BASE = process.argv[2] ?? 'http://localhost:10592';
const PAGES = JSON.parse(fs.readFileSync(process.argv[3] ?? './pages.json', 'utf8'));
const OUT = process.argv[4] ?? './out';
const PORT = 9333;
const WIDTH = Number(process.env.SHOT_WIDTH ?? 1400);
const CHROME = process.env.CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PROFILE = process.env.SHOT_PROFILE ?? 'C:/Users/ldm/AppData/Local/Temp/mytv-shots/profile';

fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${PROFILE}`,
  `--window-size=${WIDTH},900`,
  'about:blank',
], { stdio: 'ignore' });

async function wsUrl() {
  for (let i = 0; i < 40; i++) {
    try {
      const j = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error('chrome devtools not ready');
}

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.session = null;
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    const sessionId = this.session;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify(sessionId ? { id, method, params, sessionId } : { id, method, params }));
    });
  }
}

const ws = new WebSocket(await wsUrl());
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
const cdp = new CDP(ws);

const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
cdp.session = sessionId;
await cdp.send('Page.enable');
await cdp.send('Emulation.setDeviceMetricsOverride', {
  width: WIDTH, height: 900, deviceScaleFactor: 1, mobile: false,
});

for (const page of PAGES) {
  await cdp.send('Page.navigate', { url: BASE + page.path });
  await sleep(page.waitMs ?? 3500);
  await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const s = document.createElement('style');
      s.textContent = 'html,body,mat-sidenav-container,mat-drawer-container,mat-drawer-content,mat-sidenav-content,.main-content{height:auto!important;max-height:none!important;overflow:visible!important}';
      document.head.appendChild(s);
      window.scrollTo(0, 0);
    })()`,
  });
  await sleep(400);
  if (page.pre) {
    await cdp.send('Runtime.evaluate', { expression: page.pre, awaitPromise: true });
    await sleep(page.afterMs ?? 800);
  }
  const broken = await cdp.send('Runtime.evaluate', {
    expression: "JSON.stringify([...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.getAttribute('src')))",
    returnByValue: true,
  });
  if (broken.result.value !== '[]') console.log(`  ${page.name} 有未加载的图片:`, broken.result.value);
  const shot = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  fs.writeFileSync(`${OUT}/${page.name}.png`, Buffer.from(shot.data, 'base64'));
  const { result } = await cdp.send('Runtime.evaluate', {
    expression: 'JSON.stringify({h: document.body.scrollHeight, w: document.body.scrollWidth})',
    returnByValue: true,
  });
  console.log(page.name, result.value);
}

await cdp.send('Target.closeTarget', { targetId });
ws.close();
chrome.kill();
console.log('done ->', OUT);
