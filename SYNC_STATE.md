# 文档同步状态

- **上次同步时间**：2026-09-10
- **同步到的 mytv-android commit**：ba5341579349d3587696a1542f352d043f6ff24b
- **同步到的版本号**：3.0.0（versionCode 通过 `VERSION_CODE` 环境变量注入）
- **本次涉及页面**：播放器设置
- **备注**：播放器设置和 QuickOP 的超分/插帧选项已区分实时路径与 VOD 路径：GPU 空间增强、Anime4K Shader、GPU 帧混合可实时运行；RIFE 与 Real-ESRGAN 通过 ncnn Vulkan/CPU 和 Media3 Transformer 处理有限文件型 VOD，生成可由 Media3、IjkPlayer、VLC 播放的缓存 MP4。QuickOP 改为通过弹出面板选择路径，调试播放器信息和频道 Tag 会显示当前增强模式。
