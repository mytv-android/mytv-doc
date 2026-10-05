# 文档同步状态

- **上次同步时间**：2026-10-05
- **同步到的 mytv-android commit**：9d106d8c（fix(python): 修复运行时在设备上无法加载 C 扩展（Android 12 模拟器实测）；文档亦覆盖 d82b1c62 的 Python 服务主体功能）
- **同步到的版本号**：3.0.0（versionCode 通过 `VERSION_CODE` 环境变量注入）
- **本次涉及页面**：/python-services（新增、后补 ELF 加载说明）、/remote-panel
- **备注**：新增「Python 服务」：设备端按需下载 CPython 3.11 运行环境（Android 7.0+，按 ABI，约 7MB），在应用进程内运行用户脚本并提供本地订阅地址（如 http://127.0.0.1:8767/all.m3u）；网页面板新增「服务」页（加载/检查代码、添加编辑删除、启用与局域网共享、地址复制、一键添加订阅、日志查看）；TV 端「设置 → 订阅源 → Python 服务」可查看状态与开关；remote-panel 页补充 /services 路由与 /api/python/* 接口说明，并在安全说明中标注脚本执行风险。运行环境包由仓库根目录 pack_python_runtime.py 生成并托管到 gitee release（tag python-runtime-v3.11.14）。模拟器实测后补充：扩展模块 DT_NEEDED 被改写为系统库、libpython 以 RTLD_GLOBAL 加载（原因见页面「开发者」小节）。
