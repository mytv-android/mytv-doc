# 文档同步状态

- **上次同步时间**：2026-09-09
- **同步到的 mytv-android commit**：96c650e2658a7869e5b23ba6ccd902a25d427875
- **同步到的版本号**：3.0.0（versionCode 通过 `VERSION_CODE` 环境变量注入）
- **本次涉及页面**：播放器设置
- **备注**：播放器设置和 QuickOP 的超分/插帧选项已区分实时路径与 VOD 路径：GPU 空间增强、Anime4K Shader、GPU 帧混合可实时运行；RIFE 与 Real-ESRGAN 通过 ncnn Vulkan/CPU 和 Media3 Transformer 处理有限文件型 VOD，生成可由 Media3、IjkPlayer、VLC 播放的缓存 MP4。直播流、回放窗口和带请求头的线路保留原播放路径。
