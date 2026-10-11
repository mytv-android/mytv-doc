# 文档同步状态

- **上次同步时间**：2026-10-11
- **同步到的 mytv-android commit**：aec6adad（feat(player): 轨道编码统一大写，字幕翻译新增有道/谷歌/微软；手机竖屏模式完整实现）
- **同步到的 mytv-panel commit**：c5ecd5b（feat(player): 字幕翻译新增有道/谷歌/微软三个引擎）
- **同步到的版本号**：3.0.0（versionCode 通过 `VERSION_CODE` 环境变量注入）
- **本次涉及页面**：/live-screen, /controls, /channels, /epg, /settings, /home, /getting-started, /player-settings。
- **备注**：全面更新手机竖屏模式（Mobile Portrait Mode）与自适应交互文档，通过 Android 模拟器（Pixel 7 Android 14）捕获并添加 16 张实机截图（单屏与成对对比）：
  1. `/live-screen`：手机竖屏主页（继续观看大卡片、5列导航、收藏与最近观看横滑卡片）、上下分屏播放器（16:9 视频区、悬浮控制条、触控手势、正在播放卡片、画质音轨标签、分体式线路按钮）、播放器三大标签页（频道/节目单/更多快捷设置）、Material 3 底部抽屉（线路选择与实时延迟测速、画面比例选择）、全屏横屏流转与返回键分流机制（配图：`portrait-pair-main.png`, `portrait-pair-player-more.png`, `portrait-pair-sheets.png`）。
  2. `/controls`：重构触屏交互章节，分为手机竖屏原生手势（单击浮层、双击暂停、上下滑切台、左右滑快进快退、线路分体按键、底部抽屉关闭手势、导航返回分流）与电视横屏触控手势（配图：`portrait-player.png`）。
  3. `/channels`：新增手机竖屏全部频道流（分组胶囊 + 纵向卡片）与原生输入法软键盘即输即搜体验（配图：`portrait-pair-channels-epg.png`, `portrait-pair-search.png`）。
  4. `/epg`：新增手机竖屏节目单指南（`EpgGuidePortraitScreen`：顶部胶囊 + 80dp 紧凑频道轨道 + 日期选择与时间线节目单）（配图：`portrait-epg.png`）。
  5. `/settings`：新增手机竖屏设置分类（常用 6 / 播放 4 / 系统 6 三段式卡片列表）与屏幕方向设置（自动 / 横屏 / 竖屏）（配图：`portrait-pair-settings.png`）。
  6. `/home` 与 `/getting-started`：系统要求更新为支持电视（横屏）与手机平板（自适应横竖屏），更新特性列表。
  7. 另：字幕翻译引擎由 3 种扩到 6 种（新增有道/谷歌/微软），视轨/音轨列表编码大写显示。
