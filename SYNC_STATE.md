# 文档同步状态

- **上次同步时间**：2026-10-06
- **同步到的 mytv-android commit**：82867f1a（服务支持 PHP 脚本：运行环境同 Python 一样在线下发、PHP 脚本按请求执行；承接 50504e31 聚合配置与 d87b462a 远程脚本拉取）
- **同步到的版本号**：3.0.0（versionCode 通过 `VERSION_CODE` 环境变量注入）
- **本次涉及页面**：/python-services（服务支持 PHP：脚本语言二选一、PHP 运行环境、默认端口 8768、按请求执行与已知限制；修正「加载代码 / 粘贴代码」旧文案）、/settings-overview（组件下载含 PHP 运行环境）、/faq 与 /remote-panel 等服务相关表述。
- **备注**：新增 PHP 服务（`language=php`）：运行环境为自编译 libphp embed（PHP 8.4 + curl/openssl/json 等内置，按 ABI 在线下发，gitee `mytv_lib` 的 `php-runtime-v8.4.26`）；PHP 脚本按 Web 请求逐次执行（`$_GET/$_POST/$_COOKIE/$_SERVER`、`php://input` 可用、`header()` 生效、输出即响应体），不支持 multipart 上传；应用内单执行线程串行所有 PHP 服务；面板不提供手动加载 / 粘贴代码（脚本一律由应用自动拉取）。上一轮：聚合配置（50504e31）。
