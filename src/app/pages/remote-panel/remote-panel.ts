import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';

@Component({
  selector: 'app-remote-panel',
  imports: [DocPageHeader, DocCallout, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="远程配置面板（10591 端口）"
        lead="应用启动后内置 HTTP 服务，浏览器访问即可远程改订阅、改设置、传文件、看日志、推 APK。本页介绍面板的页面与地址。"
      />

      <h2>怎么打开</h2>
      <ol>
        <li>确保手机 / 电脑与电视在<b>同一局域网</b>。</li>
        <li>电视端启动电视直播，应用会自动监听 <code>10591</code> 端口（被占用时自动换端口）。</li>
        <li>电视端 <b>Dashboard → 推送</b> 页面会显示一个二维码，扫码直达；或浏览器手动输入 <code>http://&lt;设备IP&gt;:10591</code>。</li>
      </ol>
      <p>
        面板支持中文 / 英文 / 阿拉伯语，可通过 URL 参数切换，例如 <code>http://&lt;IP&gt;:10591/?lang=zh</code>。
      </p>

      <h2>面板页面一览</h2>
      <table>
        <thead>
          <tr><th>面板路由</th><th>名称</th><th>作用</th><th>对应文档</th></tr>
        </thead>
        <tbody>
          <tr><td><code>/</code></td><td>首页</td><td>快速添加订阅源 / EPG / 别名 / 云同步 / 推 APK / 关于</td><td>本页 §3</td></tr>
          <tr><td><code>/general</code></td><td>通用</td><td>开机自启、启动页、画中画</td><td><a [routerLink]="'/settings'">设置项总览 §1</a></td></tr>
          <tr><td><code>/sources</code></td><td>订阅源</td><td>订阅源列表管理、隐藏规则、别名、混合源、PLTV</td><td><a [routerLink]="'/sources'">订阅源</a></td></tr>
          <tr><td><code>/epg</code></td><td>节目单</td><td>EPG 源管理、刷新阈值、跟随订阅源</td><td><a [routerLink]="'/epg'">EPG</a></td></tr>
          <tr><td><code>/ui</code></td><td>界面</td><td>进度条、台标、回放标志、预览、缩放、收藏、历史</td><td><a [routerLink]="'/settings'">设置项总览 §4</a></td></tr>
          <tr><td><code>/theme</code></td><td>主题</td><td>颜色模式、配色方案、自定义主题</td><td><a [routerLink]="'/settings'">设置项总览 §5</a></td></tr>
          <tr><td><code>/control</code></td><td>控制</td><td>数字选台、跨组切换、按键行为映射</td><td><a [routerLink]="'/controls'">遥控器与触屏</a></td></tr>
          <tr><td><code>/player</code></td><td>播放器</td><td>内核、解码、缓冲、字幕、ASR、翻译、UA / 代理 / DNS</td><td><a [routerLink]="'/player-settings'">播放器与字幕</a></td></tr>
          <tr><td><code>/webview</code></td><td>WebView</td><td>内核、替换系统 WebView、超时</td><td><a [routerLink]="'/webview-player'">WebView</a></td></tr>
          <tr><td><code>/network</code></td><td>网络</td><td>重试次数、重试间隔</td><td><a [routerLink]="'/settings'">设置项总览 §10</a></td></tr>
          <tr><td><code>/update</code></td><td>更新</td><td>通道、强提醒</td><td><a [routerLink]="'/settings'">设置项总览 §9</a></td></tr>
          <tr><td><code>/sync</code></td><td>云同步</td><td>自动拉取、各后端账号、导入 / 导出应用数据</td><td><a [routerLink]="'/sync'">云同步</a></td></tr>
          <tr><td><code>/debug</code></td><td>调试</td><td>FPS、播放器元数据、布局网格、导出 logcat</td><td><a [routerLink]="'/settings'">设置项总览 §13</a></td></tr>
          <tr><td><code>/log</code></td><td>日志</td><td>实时日志查看（只读，含筛选 / 分页）</td><td><a [routerLink]="'/settings'">设置项总览 §14</a></td></tr>
        </tbody>
      </table>

      <h2 id="s3">§3 首页（<code>/</code>）能快速做什么</h2>
      <p>面板首页是多个高频操作的聚合页，包括：</p>
      <ul>
        <li><b>推送订阅源</b>：支持 5 种类型 — remote（网络 URL）/ xtream / stalker / file（TV 本地路径）/ content（直接粘贴 m3u / txt 内容，面板把内容写到 TV 本地文件再注册为本地源）。</li>
        <li><b>网页源央视频 Cookie</b>：从浏览器登录央视频后复制 Cookie 粘贴到这里。</li>
        <li><b>频道图标提供</b>：URL 模板，支持 <code>&#123;name&#125;</code> / <code>&#123;name|lowercase&#125;</code> / <code>&#123;name|uppercase&#125;</code> 变量。</li>
        <li><b>频道别名</b>：直接编辑别名文件，示例 <code>&#123;__suffix:[...], CCTV1:[...]&#125;</code>。</li>
        <li><b>推送节目单</b>：粘贴名称 + EPG 链接（xml / xml.gz）。</li>
        <li><b>播放器全局设置</b>：全局 UA、自定义 headers。</li>
        <li><b>云同步</b>：五种服务商的账号字段。</li>
        <li><b>安装 APK</b>：选择本机 APK 文件推送到电视并触发安装（需先授予「安装未知应用」权限）。</li>
        <li><b>关于应用</b>（只读）：applicationId、versionName + buildType、设备名、设备 ID。</li>
      </ul>

      <h2>TV 设置页 vs 10591 面板</h2>
      <p>大多数设置在 TV 和面板都能改，但以下功能<b>只能在面板</b>完成：</p>
      <ul>
        <li>订阅源<b>排序</b>（上移 / 下移）、分页管理。</li>
        <li>订阅源的 <b>transformJs 转换脚本</b>编辑。</li>
        <li>订阅源的 <b>httpUserAgent</b>、<b>httpProxy</b> 单源级配置。</li>
        <li>EPG 源<b>拖拽排序</b>。</li>
        <li>播放器的<b>正则解码配置</b>（按 URL pattern 选内核 / 软解）和<b>代理规则</b>可视化编辑。</li>
        <li>播放器的 <b>全局 UA</b>、<b>自定义 headers</b>、<b>自定义 DNS</b>、<b>HTTP 代理</b>。</li>
        <li>ASR 翻译的<b>腾讯 / 百度 / MTranServer 凭据</b>。</li>
        <li>云同步的<b>所有账号字段</b>（Gist ID / Token、Gitee ID / Token、网络链接、本地路径、WebDAV URL / 用户名 / 密码）。</li>
        <li>云同步的<b>导入 / 导出应用数据</b>（本地 JSON 文件）。</li>
        <li><b>推 APK</b> 到电视安装。</li>
        <li><b>导出 logcat</b>。</li>
        <li><b>央视频 Cookie</b>、<b>频道图标提供</b>、<b>频道别名</b>（虽然 TV 设置页有只读项，但编辑在面板）。</li>
      </ul>

      <h2>HTTP API（高级）</h2>
      <p>
        面板背后就是一组 HTTP 接口。如果你写脚本自动化，可以直接调用。下面按用途分组：
      </p>

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
              新增订阅源。body 字段：<code>name</code>、<code>type</code>（url / file / content / xtream / stalker）、<code>url</code>、<code>filePath</code>、<code>content</code>、<code>userName</code>、<code>password</code>、<code>format</code>、<code>mac</code>、<code>httpUserAgent</code>、<code>httpProxy</code>。新源追加并设为当前。
            </td>
          </tr>
          <tr><td><code>POST /api/epg-source/push</code></td><td>新增 EPG 源（<code>name</code>、<code>url</code>），追加并设为当前。</td></tr>
          <tr><td><code>GET /api/channel-alias</code> / <code>POST /api/channel-alias</code></td><td>读 / 覆写频道别名文件（写后刷新别名并清空 IPTV / EPG 缓存）。</td></tr>
        </tbody>
      </table>

      <h3>配置与文件</h3>
      <table>
        <thead>
          <tr><th>端点</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td><code>GET /api/configs</code> / <code>POST /api/configs</code></td><td>读 / 写几乎所有 <code>Configs</code> 字段（剔除云同步账号本身等敏感字段）。</td></tr>
          <tr><td><code>GET /api/file/content?path=…</code> / <code>POST /api/file/content</code></td><td>读 / 写任意路径文件。</td></tr>
          <tr><td><code>POST /api/file/content-with-dir</code></td><td>在 cacheDir 或 fileDir 下写文件（用于「面板推 m3u 内容到 TV 本地」）。</td></tr>
        </tbody>
      </table>

      <h3>云同步 / APK / 动态 m3u8</h3>
      <table>
        <thead>
          <tr><th>端点</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td><code>GET /api/cloud-sync/data</code> / <code>POST /api/cloud-sync/data</code></td><td>拉取 / 应用云同步数据。</td></tr>
          <tr><td><code>POST /api/upload/apk</code></td><td>multipart 上传 APK，自动调起安装。</td></tr>
          <tr><td><code>GET /api/local.m3u8</code></td><td>动态 m3u8（执行注册的 JS 生成，content-type <code>application/vnd.apple.mpegurl</code>）。</td></tr>
          <tr><td><code>GET /ku9/js/&lt;id&gt;</code> / <code>POST /ku9/js/debug?id=&lt;id&gt;</code></td><td>Ku9 JS 调试接口，仅当 <code>debugDeveloperMode=true</code> 可用。</td></tr>
        </tbody>
      </table>

      <h2>典型用法</h2>
      <h3>1. 推一个新订阅源</h3>
      <pre><code>curl -X POST http://192.168.1.100:10591/api/iptv-source/push \\
  -H "Content-Type: application/json" \\
  -d '&#123;"name":"我的源","type":"url","url":"https://example.com/iptv.m3u"&#125;'</code></pre>

      <h3>2. 推 EPG 源</h3>
      <pre><code>curl -X POST http://192.168.1.100:10591/api/epg-source/push \\
  -H "Content-Type: application/json" \\
  -d '&#123;"name":"综合EPG","url":"https://example.com/epg.xml"&#125;'</code></pre>

      <h3>3. 改全局 UA</h3>
      <pre><code>curl -X POST http://192.168.1.100:10591/api/configs \\
  -H "Content-Type: application/json" \\
  -d '&#123;"videoPlayerUserAgent":"MyCustomUA/1.0"&#125;'</code></pre>

      <h2>安全说明</h2>
      <doc-callout kind="warn" title="仅限局域网" icon="warning">
        10591 端口<b>没有鉴权</b>，CORS 全开。请只在家庭局域网内使用，<b>切勿</b>把端口映射到公网或不可信网络，
        否则任何人都能读取你的设置、推送任意 APK、改写任意文件。
      </doc-callout>
    </div>
  `,
})
export class RemotePanelPage {}
