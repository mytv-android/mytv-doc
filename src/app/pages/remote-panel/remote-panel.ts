import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';

@Component({
  selector: 'app-remote-panel',
  imports: [DocPageHeader, DocCallout],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="远程配置面板（端口 10591）"
        lead="应用启动后内置 HTTP 服务，浏览器访问即可远程改订阅、改设置、传文件、看日志、推 APK。"
      />

      <h2>开启方式</h2>
      <p>
        应用启动时由 <code>HttpServerService</code> 前台服务拉起 <code>HttpServer</code>，监听端口 <code>10591</code>。
        端口被占用时自动回退到系统分配的空闲端口。CORS 全开，允许跨域。
      </p>
      <p>
        在电视端 <b>Dashboard → 推送</b> 页面会显示一个二维码，内容形如 <code>http://&lt;局域网IP&gt;:10591/?lang=zh</code>。
        手机扫码或浏览器手动输入地址即可打开面板。
      </p>

      <h2>如何查设备 IP</h2>
      <ul>
        <li>电视端：<b>设置 → 关于</b> 中可查设备名与设备 ID。</li>
        <li>或在路由器后台查看在线设备列表。</li>
      </ul>

      <h2>HTTP 端点清单</h2>

      <h3>静态页（面板）</h3>
      <table>
        <thead>
          <tr><th>路径</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td><code>GET /</code></td><td>面板首页 <code>panel/index.html</code></td></tr>
          <tr><td><code>GET /&lt;非 api 路径&gt;</code></td><td>对应 <code>panel/&lt;path&gt;/index.html</code> 或静态资源（CSS / JS / JSON / SVG / PNG / ICO）</td></tr>
        </tbody>
      </table>

      <h3>信息与日志</h3>
      <table>
        <thead>
          <tr><th>端点</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td><code>GET /api/info</code></td><td>应用标题 / 仓库 / 日志历史</td></tr>
          <tr><td><code>GET /api/about</code></td><td>applicationId、flavor、buildType、versionCode、versionName、设备名、设备 ID</td></tr>
          <tr><td><code>GET /api/logs</code></td><td>应用内日志（JSON，最多 100 条）</td></tr>
          <tr><td><code>GET /api/logcat</code></td><td>抓 <code>logcat -t 10000 -v threadtime</code>（text）</td></tr>
        </tbody>
      </table>

      <h3>订阅源 / EPG / 别名</h3>
      <table>
        <thead>
          <tr><th>端点</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>POST /api/iptv-source/push</code></td>
            <td>
              新增订阅源。body 字段：<code>name</code>、<code>type</code>（url / file / content / xtream / stalker）、<code>url</code>、<code>filePath</code>、<code>content</code>、<code>userName</code>、<code>password</code>、<code>format</code>、<code>mac</code>、<code>httpUserAgent</code>、<code>httpProxy</code>。新源会被追加并设为当前。
            </td>
          </tr>
          <tr><td><code>POST /api/epg-source/push</code></td><td>新增 EPG 源（<code>name</code>、<code>url</code>），追加并设为当前。</td></tr>
          <tr><td><code>GET /api/channel-alias</code></td><td>读频道别名文件。</td></tr>
          <tr><td><code>POST /api/channel-alias</code></td><td>覆写别名文件（写后刷新别名并清空 IPTV / EPG 缓存）。</td></tr>
        </tbody>
      </table>

      <h3>配置与文件</h3>
      <table>
        <thead>
          <tr><th>端点</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td><code>GET /api/configs</code></td><td>读取几乎所有 <code>Configs</code> 字段（不含云同步账号本身等敏感字段）。</td></tr>
          <tr><td><code>POST /api/configs</code></td><td>写入 <code>Configs</code> 字段。TV 上标记为「remoteConfig」的设置项必须从这里改。</td></tr>
          <tr><td><code>GET /api/file/content?path=…</code></td><td>读任意路径文件。</td></tr>
          <tr><td><code>POST /api/file/content</code></td><td>写任意路径文件。</td></tr>
          <tr><td><code>POST /api/file/content-with-dir</code></td><td>在 cacheDir 或 fileDir 下写文件。</td></tr>
        </tbody>
      </table>

      <h3>云同步 / APK / 动态 m3u8</h3>
      <table>
        <thead>
          <tr><th>端点</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td><code>GET /api/cloud-sync/data</code></td><td>拉取云同步数据。</td></tr>
          <tr><td><code>POST /api/cloud-sync/data</code></td><td>应用云同步数据。</td></tr>
          <tr><td><code>POST /api/upload/apk</code></td><td>multipart 上传 APK，自动调 <code>ApkInstaller.installApk</code> 安装（需先授予「安装未知应用」权限）。</td></tr>
          <tr><td><code>GET /api/local.m3u8</code></td><td>动态 m3u8（实时执行注册的 JS 生成，content-type <code>application/vnd.apple.mpegurl</code>）。</td></tr>
          <tr><td><code>GET /ku9/js/&lt;id&gt;</code> / <code>POST /ku9/js/debug?id=&lt;id&gt;</code></td><td>Ku9 JS 调试接口，仅当 <code>debugDeveloperMode=true</code> 可用。</td></tr>
        </tbody>
      </table>

      <h2>典型用法</h2>
      <h3>1. 推一个新订阅源到电视</h3>
      <pre><code>curl -X POST http://192.168.1.100:10591/api/iptv-source/push \\
  -H "Content-Type: application/json" \\
  -d '&#123;"name":"我的源","type":"url","url":"https://example.com/iptv.m3u"&#125;'</code></pre>

      <h3>2. 推一个 EPG 源</h3>
      <pre><code>curl -X POST http://192.168.1.100:10591/api/epg-source/push \\
  -H "Content-Type: application/json" \\
  -d '&#123;"name":"综合EPG","url":"https://example.com/epg.xml"&#125;'</code></pre>

      <h3>3. 远程改设置（云同步账号 / UA / 代理等 remoteConfig）</h3>
      <pre><code>curl -X POST http://192.168.1.100:10591/api/configs \\
  -H "Content-Type: application/json" \\
  -d '&#123;"videoPlayerUserAgent":"MyCustomUA/1.0"&#125;'</code></pre>

      <h3>4. 从面板推 APK 给电视安装</h3>
      <p>在面板页面里选择 APK 文件上传即可。电视端会自动调起安装界面。</p>

      <h2>安全说明</h2>
      <doc-callout kind="warn" title="仅限局域网" icon="warning">
        10591 端口<b>没有鉴权</b>。请只在家庭局域网内使用，<b>切勿</b>把端口映射到公网或不可信网络，
        否则任何人都能读取你的设置、推送任意 APK、改写任意文件。
      </doc-callout>
    </div>
  `,
})
export class RemotePanelPage {}
