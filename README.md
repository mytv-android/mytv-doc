# mytv-doc

[mytv-android](https://github.com/mytv-android/mytv-android) 的中文使用文档站点，基于 Angular 22 + Angular Material 构建，部署到 GitHub Pages。

## 功能

- 14 个文档页面，覆盖快速上手、遥控器、Dashboard、频道、订阅源、EPG、WebView、10591 远程面板、播放器与字幕、设置项总览、云同步、FAQ、下载与编译。
- 深色 / 浅色主题切换（默认跟随系统）。
- 响应式侧栏（手机端折叠为抽屉）。
- 每页懒加载，初始包 < 1 MB（gzip 后更小）。

## 本地开发

```bash
npm install
npm start          # http://localhost:4200
```

## 构建

```bash
npm run build              # 产物：dist/mytv-doc/browser/
npm run build:ghpages      # 同 build，但 base-href=/mytv-doc/ 并复制 404.html
```

## 部署到 GitHub Pages

### 自动部署（推荐）

仓库已带 `.github/workflows/deploy.yml`，推到 `main` 分支即自动构建并发布。

一次性配置：

1. 仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。
2. 推送代码到 `main`，等 Action 跑完。
3. 几分钟后访问 `https://<owner>.github.io/<repo>/`。

base-href 会从仓库名自动推导（`${GITHUB_REPOSITORY##*/}`），仓库改名不需要改配置。

### 手动部署

也可以本地构建后通过 `angular-cli-ghpages` 推到 `gh-pages` 分支：

```bash
npm run deploy
```

注意：手动部署会把产物推到 `gh-pages` 分支，与 Action 的 Pages Source 设置相互独立；如果同时启用，以 Action 部署的为准。建议二选一，优先用 Action。

## 同步 mytv-android 源码变更

本仓库提供 `.claude/skills/sync-from-android/` skill。当 mytv-android 仓库发布新版本或引入新功能时：

1. 让 Claude Code 加载 `sync-from-android` skill。
2. skill 会引导读取 `SYNC_STATE.md` 中记录的上次同步 hash，用 `git log` 找出新 commit，按页面归属分类变更，逐项更新对应 `.ts` 文件。
3. 更新 `SYNC_STATE.md` 中的 hash、版本号、涉及页面。
4. `npm run build` 验证。

## 项目结构

```
src/
├── app/
│   ├── app.ts / app.html / app.scss   # 应用外壳：toolbar + sidenav + 路由出口
│   ├── app.routes.ts                  # 路由
│   ├── pages/                         # 14 个文档页面组件（inline template）
│   │   ├── home/  getting-started/  controls/  live-screen/  channels/
│   │   ├── sources/  epg/  webview-player/  remote-panel/
│   │   ├── player-settings/  settings-overview/  sync/
│   │   ├── faq/  build/  not-found/
│   └── shared/
│       ├── doc-page-header.ts         # 页面标题组件
│       └── doc-callout.ts             # 提示卡片
├── styles.scss                        # 全局样式 + .doc-page 排版 + 深色主题
└── index.html

scripts/ghpages-404.mjs                # 构建后复制 404.html
SYNC_STATE.md                          # 记录上次同步到的 mytv-android commit
.claude/skills/sync-from-android/      # 源码同步 skill
```

## 许可证

文档内容基于 [mytv-android](https://github.com/mytv-android/mytv-android) 源码整理，遵循其 GNU 许可证。
