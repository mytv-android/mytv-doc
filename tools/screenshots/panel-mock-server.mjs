// 用 mytv-panel 的构建产物 + 假 /api 数据把网页面板跑起来，供截图使用。
// 面板脱离电视拿不到配置，不喂数据的话页面是空的。
//
//   node tools/screenshots/panel-mock-server.mjs            # 默认 http://localhost:10592
//   PORT=10592 PANEL_DIST=... node tools/screenshots/panel-mock-server.mjs
//
// 配置项（环境变量）：
//   PANEL_DIST     面板构建产物目录，默认 C:/PythonProject/mytv-panel/dist/mytv-panel/browser
//   PANEL_API_SRC  面板 src/app/api.ts，用来推导 AppConfigs 的字段与枚举默认值
//   PORT           监听端口，默认 10592

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.env.PANEL_DIST ?? 'C:/PythonProject/mytv-panel/dist/mytv-panel/browser';
const API_SRC = process.env.PANEL_API_SRC ?? 'C:/PythonProject/mytv-panel/src/app/api.ts';
const PORT = Number(process.env.PORT ?? 10592);

// 从 api.ts 推导 AppConfigs 的默认值：枚举取第一个成员，其余按类型给空值。
// 这样面板上每个字段都有值，不会因为 undefined 渲染出空白下拉框。
function defaultConfigs() {
  const src = fs.readFileSync(API_SRC, 'utf8');

  const enums = {};
  for (const m of src.matchAll(/export enum (\w+) \{([^}]*)\}/g)) {
    const members = [...m[2].matchAll(/(\w+)\s*=\s*'([^']*)'/g)].map((x) => x[2]);
    if (members.length) enums[m[1]] = members[0];
  }

  const start = src.indexOf('export interface AppConfigs {');
  const body = src.slice(start, src.indexOf('\n}', start));
  const out = {};
  for (const line of body.split('\n')) {
    const m = line.match(/^\s{4}([A-Za-z0-9_]+)\??:\s*([^/]+?)\s*(\/\/.*)?$/);
    if (!m) continue;
    const [, name, rawType] = m;
    const type = rawType.trim();
    const bare = type.replace(/\s*\|\s*null$/, '').trim();
    if (enums[bare]) out[name] = enums[bare];
    else if (type.includes('boolean')) out[name] = false;
    else if (type.startsWith('number')) out[name] = 0;
    else if (type.startsWith('string')) out[name] = '';
    else if (type.includes('[]') || type.includes('Set<')) out[name] = [];
    else out[name] = {};
  }
  return out;
}

const SOURCE_LIST = {
  value: [
    {
      name: 'iptv 组播转单播',
      url: 'http://192.168.1.1:5140/playlist.m3u',
      sourceType: 0,
      protocol: '', httpUserAgent: '', httpProxy: '', epg: '', autoRefresh: 0,
      disableChannelPreview: false, disableDelayDetection: true,
    },
    {
      name: '网络 m3u 测试源',
      url: 'http://example.com/iptv.m3u',
      sourceType: 0,
      protocol: '', httpUserAgent: '', httpProxy: '', epg: '', autoRefresh: 12,
      disableChannelPreview: false, disableDelayDetection: false,
    },
    {
      name: '电视本地文件',
      url: '/storage/emulated/0/Download/local.m3u',
      sourceType: 1,
      protocol: '', httpUserAgent: '', httpProxy: '', epg: '', autoRefresh: 0,
      disableChannelPreview: false, disableDelayDetection: false,
    },
  ],
};

const EPG_LIST = {
  value: [
    { name: '默认节目单 综合', url: 'https://gitee.com/mytv-android/myepg/raw/master/output/epg.gz', format: 'XML', cacheHour: -1, timeZoneOffset: 0, externalStorage: false },
    { name: '自定义 xmltv', url: 'http://epg.example.com/epg.xml.gz', format: 'XML', cacheHour: 24, timeZoneOffset: 0, externalStorage: false },
  ],
};

const SERVICE_LIST = {
  value: [
    { id: 'python_8f3a1c2d', name: '本地聚合源', language: 'python', enabled: true, port: 8767, lanShare: true, codeUrl: '', updatedAt: 1762_000_000_000 },
    { id: 'php_1e618832c51c', name: '简单接口', language: 'php', enabled: false, port: 8768, lanShare: false, codeUrl: '', updatedAt: 1762_000_000_000 },
  ],
};

const OVERRIDES = {
  appStartupScreen: 'Screens.Dashboard.name',
  appBackupEnable: true,
  iptvSourceCacheTime: 3600000,
  iptvSourceCurrentIdx: 0,
  iptvSourceList: SOURCE_LIST,
  epgSourceList: EPG_LIST,
  epgSourceCurrent: EPG_LIST.value[0],
  pythonServiceList: SERVICE_LIST,
  iptvSimilarChannelMerge: true,
  iptvChannelLogoOverride: true,
  iptvPLTVToTVOD: true,
  iptvChannelFavoriteEnable: true,
  iptvChannelHistoryEnable: true,
  iptvChannelGroupConfigEnable: true,
  iptvChannelChangeShowInfoPanel: true,
  iptvHybridMode: 'IPTV_FIRST',
  epgEnable: true,
  epgSourceFollowIptv: true,
  epgRefreshTimeThreshold: 2,
  uiShowChannelPreview: true,
  uiShowChannelLogo: true,
  uiShowReplayBadge: true,
  channelPreviewParallelCount: 1,
  videoPlayerUserAgent: 'Mytv.Android',
  videoPlayerBufferTime: 0,
  videoPlayerLoadTimeout: 10000,
  videoPlayerApplyBetterDetection: true,
  networkRetryCount: 10,
  networkRetryInterval: 1000,
  cloudSyncProvider: 'GITHUB_GIST',
};

const CONFIGS = { ...defaultConfigs(), ...OVERRIDES };

const ABOUT = {
  applicationId: 'top.yogiczy.mytv',
  flavor: 'tv',
  buildType: 'debug',
  versionCode: 677,
  versionName: '3.0.0.677',
  deviceName: 'Television 1080p',
  deviceId: '2f8a1c4e9b7d',
};

const LOGS = [
  { level: 'I', tag: 'IptvRepository', message: '加载订阅源 [iptv 组播转单播] 完成，共 6 个分组 / 128 个频道', time: 1762000000000 },
  { level: 'I', tag: 'M3u8AnalysisUtil', message: 'getFirstFrame: http://192.168.1.1:5140/央视/CCTV-1', time: 1762000001000 },
  { level: 'W', tag: 'VideoPlayer', message: '播放失败，准备重试当前线路（1/10）', time: 1762000002000 },
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

function json(res, data, code = 200) {
  const body = JSON.stringify(data);
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(body) });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const p = url.pathname;

  if (p.startsWith('/api/')) {
    if (p === '/api/configs') {
      if (req.method === 'POST') return json(res, { code: 0, msg: 'ok' });
      return json(res, CONFIGS);
    }
    if (p === '/api/about') return json(res, ABOUT);
    if (p === '/api/logs') return json(res, LOGS);
    if (p === '/api/logcat') {
      res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
      return res.end(LOGS.map((l) => `${l.level}/${l.tag}: ${l.message}`).join('\n'));
    }
    if (p === '/api/backup/list') return json(res, []);
    if (p === '/api/python/status') {
      const svc = (o, state) => ({
        ...o,
        state,
        ready: state === 'running',
        scriptExists: true,
        codeSource: 0,
        httpUserAgent: '',
        httpProxy: '',
        refreshIntervalHours: 0,
        extraArgs: '',
        envVars: '',
        autoRestart: true,
        lastFetchedAt: 1762_000_000_000,
        localUrl: `http://127.0.0.1:${o.port}/`,
      });
      return json(res, {
        data: {
          runtime: { supported: true, state: 'ready', version: '3.11', abi: 'arm64-v8a' },
          phpRuntime: { supported: true, state: 'notDownloaded', version: '8.4.26', abi: 'arm64-v8a' },
          services: [svc(SERVICE_LIST.value[0], 'running'), svc(SERVICE_LIST.value[1], 'stopped')],
        },
      });
    }
    if (p === '/api/file/list') return json(res, { path: '/storage/emulated/0/Download', entries: [] });
    return json(res, { code: 0, msg: 'ok' });
  }

  const file = path.resolve(ROOT, '.' + (p === '/' ? '/index.html' : decodeURIComponent(p)));
  if (file.startsWith(path.resolve(ROOT)) && fs.existsSync(file) && fs.statSync(file).isFile()) {
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' });
    return fs.createReadStream(file).pipe(res);
  }
  res.writeHead(200, { 'content-type': MIME['.html'] });
  fs.createReadStream(path.join(ROOT, 'index.html')).pipe(res);
});

server.listen(PORT, () => console.log(`mock panel on http://localhost:${PORT}`));
