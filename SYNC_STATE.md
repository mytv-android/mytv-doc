# 文档同步状态

- **上次同步时间**：2026-09-07
- **同步到的 mytv-android commit**：f3f83afd
- **同步到的版本号**：3.0.0（versionCode 通过 `VERSION_CODE` 环境变量注入）
- **本次涉及页面**：播放器设置（新增「软解仅用于音频」设置项与面板字段）、云同步（desensitized 剔除字段补充 `globalVideoPlayerMedia3SoftDecodeAudioOnly`）、搜索索引
- **备注**：新增「软解仅用于音频」开关（仅 Media3 内核生效）：开启后强制软解只作用于音频解码，视频保持硬解；IJK/VLC 音频始终走 FFmpeg 解码，无需此开关。
