# 文档同步状态

- **上次同步时间**：2026-09-19
- **同步到的 mytv-android commit**：30244de87b9b8915241a8549551ac147b7166fac（feat(source): 订阅源支持EPG地址、自动刷新与预览/延迟检测开关）
- **同步到的版本号**：3.0.0（versionCode 通过 `VERSION_CODE` 环境变量注入）
- **本次涉及页面**：订阅源、EPG
- **备注**：订阅源新增 4 个源级字段（IptvSource）：EPG 地址（`epg`）、自动刷新间隔小时（`autoRefresh`，0=关闭）、关闭预览图（`disableChannelPreview`）、关闭延迟检测（`disableDelayDetection`）。均在 10591 面板订阅源编辑对话框配置，经 `POST /api/configs` 与云同步下发；EPG 地址在「跟随订阅源」时优先于 m3u 内嵌 `x-tvg-url`；自动刷新在运行期间按间隔静默强制刷新当前源；两个开关优先于对应全局设置生效。
