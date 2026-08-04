---
name: sync-from-android
description: 从 mytv-android 源码同步功能变更到本文档站点。当 mytv-android 仓库发生更新（新功能、新设置项、UI 文案变化、行为变更）时，使用本 skill 把变更传播到 mytv-doc 站点中对应的页面。
---

# Sync From Android Skill

把 `C:\PythonProject\mytv-android` 仓库的最新变更同步到本文档站点（`C:\PythonProject\mytv-doc`）。

## 何时使用

- mytv-android 仓库 release 了新版本（看 `tv/build.gradle.kts` 中 `versionName` 变化）。
- 用户明确说"同步一下源码"、"mytv-android 改了 X 功能，更新文档"。
- 用户提到新功能但文档站点里没写。

## 文档站点信息架构（必须熟记）

每个页面对应一个 Angular 组件文件，路径：`src/app/pages/<name>/<name>.ts`。

| 路由 | 组件 | 内容范围 |
| --- | --- | --- |
| `/home` | `home/home.ts` | 项目概述、入口卡片 |
| `/getting-started` | `getting-started/getting-started.ts` | 安装、首次启动、配置订阅源的最短路径 |
| `/controls` | `controls/controls.ts` | 遥控器按键、触屏手势、数字换台、防误触 |
| `/live-screen` | `live-screen/live-screen.ts` | Dashboard 组成、信息条、多视图 |
| `/channels` | `channels/channels.ts` | 频道列表、收藏、隐藏、搜索 |
| `/sources` | `sources/sources.ts` | m3u、Xtream、混合源、webView://、缓存 |
| `/epg` | `epg/epg.ts` | EPG 来源、格式、刷新策略、EPG 指南页 |
| `/webview-player` | `webview-player/webview-player.ts` | WebView 内核、JS 注入、超时 |
| `/remote-panel` | `remote-panel/remote-panel.ts` | 10591 端口、推送、二维码 |
| `/player-settings` | `player-settings/player-settings.ts` | 内核、解码、缓冲、字幕、ASR、翻译 |
| `/settings` | `settings-overview/settings-overview.ts` | 14 大类设置的总览索引 |
| `/sync` | `sync/sync.ts` | 云同步后端、数据范围、步骤 |
| `/faq` | `faq/faq.ts` | 常见故障排查 |
| `/build` | `build/build.ts` | 下载、签名、自行编译 |

## 同步工作流

### 第 1 步：找出 mytv-android 自上次同步以来的变更

先在 mytv-doc 仓库根目录看 `SYNC_STATE.md`（若存在），里面记录了上次同步时 mytv-android 的 commit hash 与同步时间。

```bash
# 在 mytv-android 仓库执行
cd /c/PythonProject/mytv-android
git log --oneline <上次同步的hash>..HEAD -- tv/src/main/java core webview
```

如果 `SYNC_STATE.md` 不存在，则对比 `tv/build.gradle.kts` 中 `versionName` 与文档站点 `/build` 页中提到的版本号。

### 第 2 步：分类变更

把变更按文档站点的页面对应关系分类：

- `tv/src/main/java/.../ui/screen/dashboard/`、`live/`、`player/` → `/live-screen`、`/controls`
- `tv/src/main/java/.../ui/screen/channels/`、`favorites/`、`search/` → `/channels`
- `tv/src/main/java/.../ui/screen/settings/categories/SettingsIptvScreen.kt`、`SettingsEpgScreen.kt` → `/sources`、`/epg`
- `tv/src/main/java/.../ui/screen/settings/categories/SettingsVideoPlayerScreen.kt`、`SettingsWebViewPlayerScreen.kt` → `/player-settings`、`/webview-player`
- `tv/src/main/java/.../ui/screen/settings/categories/SettingsCloudSyncScreen.kt` → `/sync`
- `tv/src/main/java/.../ui/screen/settings/categories/`（其他）→ `/settings` 或对应分类页面
- `tv/src/main/java/.../sync/` → `/sync`、`/remote-panel`
- `tv/src/main/java/.../ui/screen/push/` → `/remote-panel`
- `webview/` 模块 → `/webview-player`
- `tv/build.gradle.kts` 中 `versionName` / ABI 分包 → `/build`
- 新增 Screen（`Screens.kt`）→ 判断归入哪个页面，或考虑新增页面

### 第 3 步：定位受影响的设置项

对 `settings/categories/` 下每个变更的 Screen，重新阅读该文件，列出**当前所有可见设置项**。注意：

- 中文文案优先取 `tv/src/main/res/values/strings.xml` 中的值。
- 设置项的默认值去 `core/data/.../Settings*.kt` 数据类中查。
- 新增 / 删除 / 改名都要在文档里体现。

### 第 4 步：编辑对应页面

- 找到 `src/app/pages/<name>/<name>.ts` 中对应的章节。
- 用 Edit 工具修改 inline template。**不要改动组件结构**，只改模板字符串里的内容。
- 保留页面头部 `<doc-page-header>` 不动，除非标题 / 简介本身要改。
- 修改时遵循已有的 markdown-in-template 排版约定：
  - `<h2>` 主章节，`<h3>` 子章节
  - 设置项用 `<table>` 或 `<ul>` 列表
  - 重要提示用 `<doc-callout kind="info|warn|tip" title="..." icon="...">…</doc-callout>`
  - 代码用 `<code>` 或 `<pre><code>…</code></pre>`

### 第 5 步：交叉链接检查

如果某次变更引入了新的页面级别概念（比如新增了一类设置），考虑：

1. 在 `/settings`（`settings-overview.ts`）的分类速查表中加一行。
2. 在 `/home` 的「主要特性速览」中补一句。
3. 如果是新页面，在 `app.routes.ts` 加路由、在 `app.ts` 的 `NAV_ENTRIES` 加入口。

### 第 6 步：更新 SYNC_STATE.md

在 mytv-doc 仓库根目录写 / 更新 `SYNC_STATE.md`：

```markdown
# 文档同步状态

- **上次同步时间**：YYYY-MM-DD
- **同步到的 mytv-android commit**：<full-hash>
- **同步到的版本号**：<versionName>
- **本次涉及页面**：/sources, /settings
- **备注**：<一句话总结>
```

### 第 7 步：构建验证

```bash
cd /c/PythonProject/mytv-doc
npm run build
```

必须通过。如果失败，按错误信息修复。

## 同步风格约定

- **不要为同步而新写章节**：优先并入现有页面。
- **避免冗余**：同一信息不要在两个页面重复写。一个页面写详情，另一个页面只做一句话链接。
- **保留作者的语气和格式**：参考已有段落的写法。
- **不要无中生有**：源码里没找到的细节不要写"可能会"、"通常"。如果不确定，标注"源码未明确"。
- **如果某项功能被删除**，从文档中删除对应描述，并在 `SYNC_STATE.md` 备注里说明。

## 反模式（避免）

- ❌ 看到 mytv-android 改了一行就去改文档：先评估这个改动是否影响**用户可见行为**。
- ❌ 把 Kotlin 实现细节（类名、函数名）抄进用户文档：用户文档只描述"用户能看到什么、能做什么"。
- ❌ 改文档忘了更新 SYNC_STATE.md：会导致下次同步漏掉变更。
- ❌ 一次同步试图更新所有页面：每次只改真正受影响的页面。

## 示例

mytv-android 在 `SettingsIptvScreen.kt` 新增了「源刷新视图」开关：

1. `git log` 发现新 commit。
2. 阅读 `SettingsIptvScreen.kt`，找到新增的 `SettingsIptvSourceRefreshViewModel` 与对应 UI。
3. 查 `strings.xml` 拿到中文文案「显示源刷新视图」。
4. 编辑 `src/app/pages/sources/sources.ts`，在「订阅源缓存」一节后新增「源刷新视图」小节。
5. 在 `SYNC_STATE.md` 更新 hash、版本、涉及页面。
6. `npm run build` 验证。
