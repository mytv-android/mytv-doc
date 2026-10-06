/**
 * 从页面组件的 inline template 自动生成搜索索引（src/app/shared/search-index.ts）。
 * 用法：node scripts/build-search-index.mjs
 *
 * 规则：
 * - 路由路径与页面标题取自 src/app/app.routes.ts
 * - 每个 h2/h3（必须带 id）生成一条索引；另为每个页面生成一条无锚点的页面级条目
 * - keywords = 该标题到下一个标题之间的正文纯文本（去标签、去模板语法、解码实体）
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// 1. 解析路由表：path / 组件文件 / 标题
const routesSrc = readFileSync(join(root, 'src/app/app.routes.ts'), 'utf8');
const routeRe =
  /path:\s*'([^']+)'[\s\S]*?import\('\.\/pages\/([^']+)'\)[\s\S]*?title:\s*'([^']+)'/g;
const routes = [];
for (const m of routesSrc.matchAll(routeRe)) {
  const [, path, file, title] = m;
  if (path === '**') continue;
  routes.push({ path: `/${path}`, file, title: title.replace(/\s*·\s*电视直播 使用文档\s*$/, '') });
}

// 2. 模板文本清洗
function cleanText(s) {
  return s
    .replace(/<\/?[a-zA-Z][^>]*>/g, ' ') // HTML 标签（含属性）
    .replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, ' ')
    .replace(/@(?:if|for|else|switch|case|defer|empty|loading|error|placeholder)(\([^)]*\))?/g, ' ')
    .replace(/\{\{[^}]*\}\}/g, ' ') // 插值
    .replace(/&#123;|&#125;/g, ' ') // 花括号实体
    .replace(/&lt;|&gt;|&amp;|&quot;|&#39;|&nbsp;|&#10;/g, ' ')
    .replace(/[{}[\]()@#$%^*_~|`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanHeading(s) {
  return cleanText(s).replace(/\s+/g, ' ').trim();
}

const MAX_KEYWORDS = 500;
const entries = [];

for (const route of routes) {
  const src = readFileSync(
    join(root, 'src/app/pages', route.file + '.ts'),
    'utf8',
  );
  const tplMatch = src.match(/template:\s*`([\s\S]*?)`/);
  if (!tplMatch) continue;
  const tpl = tplMatch[1];

  // 页面级条目：lead 文本
  const leadMatch = tpl.match(/lead="([^"]+)"/);
  entries.push({
    path: route.path,
    title: route.title,
    anchor: '',
    section: route.title,
    keywords: cleanText(leadMatch ? leadMatch[1] : '').slice(0, MAX_KEYWORDS),
  });

  // 小节条目：逐个 h2/h3
  const headingRe = /<h([23])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
  const headings = [];
  for (const m of tpl.matchAll(headingRe)) {
    headings.push({ level: m[1], id: m[2], text: cleanHeading(m[3]), start: m.index, end: m.index + m[0].length });
  }
  headings.forEach((h, i) => {
    const body = tpl.slice(h.end, headings[i + 1]?.start ?? tpl.length);
    entries.push({
      path: route.path,
      title: route.title,
      anchor: `#${h.id}`,
      section: h.text,
      keywords: cleanText(body).slice(0, MAX_KEYWORDS),
    });
  });
}

// 3. 生成 TS 文件
const ts = `export interface SearchIndexEntry {
  /** 路由路径，如 /sources */
  path: string;
  /** 页面显示标题 */
  title: string;
  /** 章节锚点，如 #s7；无锚点为空字符串 */
  anchor: string;
  /** 章节标题（用于结果展示） */
  section: string;
  /** 该章节的可搜索文本（标题 + 正文关键词，已去除 HTML 标签与模板语法） */
  keywords: string;
}

/**
 * 文档站点的全量搜索索引。
 * 每条记录对应某个页面中一个章节（h2/h3）。
 * 章节内的正文已被抽取为纯文本关键词串，便于做包含匹配。
 *
 * 本文件由 scripts/build-search-index.mjs 自动生成，请勿手工编辑；
 * 页面内容变更后运行 \`node scripts/build-search-index.mjs\` 重新生成。
 */
export const SEARCH_INDEX: SearchIndexEntry[] = ${JSON.stringify(entries, null, 2)
  .replace(/"([^"]+)":/g, '$1:') // 键名去引号，贴近现有风格
  .replace(/"(|[^"]*)"/g, (m, g1) => `'${g1.replace(/'/g, "\\'")}'`) // 字符串改单引号
};
`;

writeFileSync(join(root, 'src/app/shared/search-index.ts'), ts, 'utf8');
console.log(`OK: ${entries.length} entries, ${(ts.length / 1024).toFixed(1)} KB`);
