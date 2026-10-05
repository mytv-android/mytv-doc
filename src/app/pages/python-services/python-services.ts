import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';

@Component({
  selector: 'app-python-services',
  imports: [DocPageHeader, DocCallout, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="Python 服务"
        lead="在电视上运行 Python 脚本，把脚本提供的本地 HTTP 服务（例如央视频直播源）当作订阅源使用。运行环境按需下载，不占用基础安装包体积。"
      />

      <h2 id="what">这是什么</h2>
      <p>
        「Python 服务」允许你添加一个 Python 脚本（多数是为 <b>APTV</b> 等播放器编写的
        “服务脚本”，例如 <code>ysp-live.py</code>）。应用会在本机把脚本作为一个小型 HTTP
        服务运行起来，脚本对外提供 <code>m3u</code> 播放列表，随后就可以像普通订阅源一样使用，
        也可以分享给局域网内的其他播放器（APTV / 电脑播放器等）。
      </p>
      <ul>
        <li>脚本在<b>电视本机</b>执行，运行环境（CPython 3.11 + 标准库）为<b>可选下载</b>，默认不包含在安装包中。</li>
        <li>典型形态：单端口服务，例如 <code>http://127.0.0.1:8767/all.m3u</code>。</li>
        <li>脚本可用标准库（<code>http.server</code>、<code>ssl</code>、<code>urllib</code>、<code>threading</code> 等），参考脚本无需第三方依赖。</li>
      </ul>

      <h2 id="requirement">运行条件</h2>
      <table>
        <thead>
          <tr><th>项目</th><th>要求</th></tr>
        </thead>
        <tbody>
          <tr><td>系统版本</td><td><b>Android 7.0（API 24）及以上</b>；Android 6.0 设备不支持该功能（其他功能不受影响）</td></tr>
          <tr><td>CPU 架构</td><td>armeabi-v7a / arm64-v8a / x86 / x86_64 均支持</td></tr>
          <tr><td>运行环境体积</td><td>按 ABI 下载，约 7 MB（解压后约 20 MB），需保证设备存储空间充足</td></tr>
          <tr><td>网络</td><td>下载运行环境与脚本内访问网络均需要联网</td></tr>
        </tbody>
      </table>

      <h2 id="install">第一步：下载 Python 运行环境</h2>
      <ol>
        <li>打开网页面板，进入 <b>服务</b> 页（<code>/services</code>），或电视端：<b>设置 → 订阅源 → Python 服务</b>。</li>
        <li>点击 <b>下载运行环境</b>，等待“校验中 / 解压中”结束，状态变为<b>已安装 v3.11.14</b>。</li>
        <li>安装完成后可点击 <b>运行自检</b> 确认：会输出 Python 版本、OpenSSL、SQLite、CA 证书与本地端口绑定是否正常。</li>
      </ol>
      <doc-callout kind="info" title="环境可随时删除" icon="info">
        删除运行环境不会删除已添加的服务脚本，重新下载后可继续使用；“设置 → 订阅源 → Python 服务”中长按运行环境条目也可删除。
      </doc-callout>

      <h2 id="add">第二步：添加服务（网页面板）</h2>
      <p>流程与 APTV 的 Python 服务一致，但全部在网页面板完成：</p>
      <ol>
        <li>面板 <b>服务</b> 页 → 右上角 <b>添加服务</b>。</li>
        <li>填写 <b>服务名称</b>（如「央视频直播」）、<b>端口</b>（默认 8767）。</li>
        <li>
          <b>代码来源</b> 填写远程链接（如
          <code>https://example.com/others/ysp-live.py</code>），点击 <b>加载代码</b>；
          也可以在「脚本代码」文本框中直接粘贴代码。
        </li>
        <li>点击 <b>检查代码</b>，查看语法检查与依赖提示（缺失的第三方依赖、Android 上受限的模块等）。</li>
        <li>按需打开 <b>局域网共享</b>（见下文）与 <b>启用</b>，点击 <b>添加服务</b> 保存。</li>
      </ol>
      <p>
        保存后服务会立即按启用状态启动；启用过的服务在<b>应用启动时自动运行</b>。列表每 3 秒刷新一次状态，
        行内可直接开关启用、启动 / 停止、查看日志、编辑或删除。
      </p>

      <h2 id="address">第三步：订阅地址</h2>
      <table>
        <thead>
          <tr><th>地址</th><th>用途</th></tr>
        </thead>
        <tbody>
          <tr><td><code>http://127.0.0.1:8767/all.m3u</code></td><td><b>电视本机</b>播放器使用（一键添加订阅即用此地址）</td></tr>
          <tr><td><code>http://&lt;电视IP&gt;:8767/all.m3u</code></td><td>局域网内其他设备（APTV、电脑播放器等）使用；需开启<b>局域网共享</b></td></tr>
        </tbody>
      </table>
      <ul>
        <li>列表中每行的两个地址都提供 <b>复制</b> 按钮。</li>
        <li>
          <b>一键添加订阅</b>：菜单 → 一键添加订阅，会把本机地址
          <code>http://127.0.0.1:&lt;端口&gt;/all.m3u</code> 直接添加为订阅源（等价于在
          <a [routerLink]="'/sources'">订阅源</a>页手动添加）。
        </li>
        <li>
          <b>局域网共享</b>：关闭时脚本只绑定 <code>127.0.0.1</code>（仅本机可用）；开启后绑定
          <code>0.0.0.0</code>，局域网内其他设备可访问。修改后服务会自动重启生效。
        </li>
      </ul>

      <h2 id="log">日志与排查</h2>
      <ul>
        <li>菜单 → <b>查看日志</b>：实时查看脚本 stdout / stderr（含请求日志与异常堆栈），打开期间每 3 秒刷新。</li>
        <li>服务状态含义：<b>运行中</b>（脚本已创建 HTTP 服务）、<b>启动中</b>（脚本已启动但尚未监听端口，或正在等脚本初始化）、<b>异常</b>（脚本报错，见日志与行内错误信息）、<b>已停止</b>。</li>
        <li>常见失败：端口被占用（换端口）、脚本缺少第三方依赖（见「检查代码」提示）、来源 URL 无法访问（设备网络问题）。</li>
        <li>若脚本崩溃导致应用闪退，下次启动时会自动跳过该服务的自动启动，并在服务行显示“上次启动后异常退出”，可在修正脚本后手动启动。</li>
      </ul>

      <h2 id="limits">已知限制</h2>
      <ul>
        <li><b>只能运行纯 Python 脚本</b>：不内置 pip，第三方依赖需为纯 Python 包并手动放入 site-packages（可通过面板「文件」页上传）。</li>
        <li><b>无法主动停止不使用 http.server 的脚本</b>：停止依赖脚本创建的 socketserver；纯 socket / asyncio 脚本只能等其自行退出。</li>
        <li><b>Android 限制</b>：<code>multiprocessing</code>、<code>ctypes</code> 加载系统库、<code>subprocess</code> 运行应用目录内可执行文件等能力不可用或受限；脚本应避免使用。</li>
        <li><b>时区数据</b>：不含 tzdata，<code>zoneinfo</code> 需要系统时区支持（多数场景不受影响）。</li>
        <li><b>同解释器多服务</b>：多个服务共享一个 Python 解释器，脚本的 <code>sys.argv</code> 与工作目录为进程级状态，应用会依次启动以避免互相干扰，脚本应使用 <code>__file__</code> 定位自身目录。</li>
        <li><b>脚本能力等于应用权限</b>：Python 脚本在应用进程内执行，段错误等原生崩溃会连带应用退出；请只添加可信来源的脚本。</li>
      </ul>

      <doc-callout kind="warn" title="安全提示" icon="warning">
        Python 服务会执行你添加的脚本代码，等同于在你设备上运行程序。请只加载<b>可信来源</b>的脚本（优先 HTTPS 链接），
        不要在公共网络下开启网页面板的局域网访问；面板本身没有鉴权，具体见
        <a [routerLink]="'/remote-panel'">远程配置面板</a>的安全说明。
      </doc-callout>

      <h2 id="api">HTTP API（高级）</h2>
      <p>面板「服务」页背后的接口，便于脚本化调用：</p>
      <table>
        <thead>
          <tr><th>端点</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td><code>GET /api/python/status</code></td><td>运行环境状态 + 服务列表（状态 / 地址 / 错误）</td></tr>
          <tr><td><code>POST /api/python/runtime/download</code> / <code>POST /api/python/runtime/delete</code></td><td>下载 / 删除 Python 运行环境</td></tr>
          <tr><td><code>POST /api/python/selftest</code></td><td>运行时自检（版本 / OpenSSL / SQLite / CA / 端口绑定）</td></tr>
          <tr><td><code>POST /api/python/fetch-code</code></td><td>由设备端拉取远程脚本，body <code>&#123;"url":"…"&#125;</code></td></tr>
          <tr><td><code>POST /api/python/check</code></td><td>静态检查，body <code>&#123;"id":"…"&#125;</code> 或 <code>&#123;"code":"…"&#125;</code></td></tr>
          <tr>
            <td><code>POST /api/python/service/save</code></td>
            <td>
              新增 / 更新服务，body：<code>id</code>（可选）、<code>name</code>、<code>port</code>、
              <code>lanShare</code>、<code>enabled</code>、<code>codeUrl</code>、<code>code</code>
            </td>
          </tr>
          <tr><td><code>POST /api/python/service/delete</code></td><td>删除服务（脚本与日志一并删除）</td></tr>
          <tr><td><code>POST /api/python/service/start</code> / <code>POST /api/python/service/stop</code></td><td>启动 / 停止服务</td></tr>
          <tr><td><code>GET /api/python/service/log?id=…</code></td><td>服务日志（text，取尾部）</td></tr>
          <tr><td><code>GET /api/python/service/code?id=…</code></td><td>已保存的脚本内容（text）</td></tr>
        </tbody>
      </table>
      <p>服务元数据保存在配置项 <code>pythonServiceList</code>，随 <code>/api/configs</code>、云同步与备份一起保存；脚本文件保存在设备本地目录，不参与云同步。</p>

      <h2 id="dev">开发者：运行环境包的制作与托管</h2>
      <p>
        运行环境由仓库根目录的 <code>pack_python_runtime.py</code> 生成：从 Maven Central 拉取
        Chaquopy 预编译的 Android 版 CPython（MIT 许可，含 OpenSSL / SQLite / 标准库）与
        certifi 的 CA 证书，重组为按 ABI 的 <code>tar.bz2</code>：
      </p>
      <pre><code>python pack_python_runtime.py

# 输出 output/
#   python-runtime-3.11.14-arm64-v8a.tar.bz2
#   python-runtime-3.11.14-armeabi-v7a.tar.bz2
#   python-runtime-3.11.14-x86.tar.bz2
#   python-runtime-3.11.14-x86_64.tar.bz2
#   sha256.json</code></pre>
      <p>
        产物上传到应用使用的 gitee release（<code>mytv_lib</code>，tag
        <code>python-runtime-v3.11.14</code>），并把脚本打印的 SHA256 更新到
        <code>PythonRuntimeManager.kt</code> 的 <code>SHA256_BY_ABI</code>；版本升级时同步更新
        <code>VERSION</code>。
      </p>
      <p>
        运行环境归档结构（解压到 <code>filesDir/python_runtime/&lt;abi&gt;/</code>，
        <code>PYTHONHOME</code> 指向该目录）：<code>lib/*.so</code>（libpython 与
        OpenSSL/SQLite）、<code>lib/python3.11/</code>（标准库与 <code>lib-dynload</code>）、
        <code>cacert.pem</code>、<code>NOTICE.txt</code>。脚本运行由
        <code>PythonServiceManager</code> 通过 JNA 绑定 CPython C API 完成（Py_InitializeEx →
        PyEval_SaveThread → 每个服务一个线程 PyGILState_Ensure/Release），脚本侧引导模块
        <code>assets/python/mytv_service.py</code> 负责日志分流、socketserver 注册与状态落盘。
      </p>
      <p>
        打包时会对 <code>lib-dynload</code> 的扩展模块做一处 ELF 改写：Chaquopy 的 libpython
        没有 <code>DT_SONAME</code>、也不在 APK 的 lib 目录（运行时下载到应用私有目录），
        bionic 无法按名字解析扩展模块 <code>DT_NEEDED libpython3.11.so</code>；因此把这些
        NEEDED 等长改写为系统库，并在应用侧以 <code>RTLD_GLOBAL</code> 加载 libpython，
        Python C API 符号从全局作用域解析（Android 12 模拟器实测验证）。
      </p>
    </div>
  `,
})
export class PythonServicesPage {}
