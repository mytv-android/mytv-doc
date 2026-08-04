import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';

@Component({
  selector: 'app-sources',
  imports: [DocPageHeader, DocCallout],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="订阅源（IPTV）"
        lead="mytv-android 支持四种订阅源类型，以及 webview:// / video:// / javascript:// 三种 URL 前缀。本页介绍格式、字段与缓存机制。"
      />

      <h2>订阅源类型</h2>
      <table>
        <thead>
          <tr><th>类型</th><th>说明</th><th>填写位置</th></tr>
        </thead>
        <tbody>
          <tr><td><b>网络 m3u / txt</b></td><td>按内容自动识别。txt 形如 <code>分组,#genre#</code> 行 + <code>频道名,url1#url2</code>。</td><td rowspan="4">设置 → 订阅源 → 自定义订阅源 → 添加其他订阅源（弹二维码，扫码到 10591 面板添加）</td></tr>
          <tr><td><b>本地文件</b></td><td>本机 m3u / txt 文件路径，不参与缓存过期。</td></tr>
          <tr><td><b>Xtream Codes</b></td><td>填地址、用户名、密码、格式（m3u_plus / ts / m3u8）。内部拼接 <code>get.php?username=…&amp;password=…&amp;type=…</code>。</td></tr>
          <tr><td><b>Stalker Portal</b></td><td>填地址、MAC。自动 handshake 取 token 后请求 <code>portal.php?type=itv&amp;action=get_all_channels</code>。</td></tr>
        </tbody>
      </table>

      <h2>m3u 支持的扩展字段</h2>

      <h3><code>#EXTM3U</code> 行</h3>
      <ul>
        <li><code>catchup</code> / <code>catchup-source</code>：默认回看类型与回看地址。</li>
        <li><code>host</code>：全局 host 覆写。</li>
        <li><code>x-tvg-url</code> / <code>url-tvg</code>：内嵌 EPG 地址（需开启「跟随订阅源」）。</li>
      </ul>

      <h3><code>#EXTINF</code> 行</h3>
      <ul>
        <li><code>tvg-id</code> / <code>tvg-name</code> / <code>tvg-logo</code> / <code>tvg-chno</code>：频道 ID / 名 / 台标 / 频道号。</li>
        <li><code>group-title</code>：分组，支持 <code>;</code> 分隔多组。</li>
        <li><code>http-user-agent</code> / <code>http-referrer</code> / <code>http-origin</code> / <code>http-cookie</code> / <code>host</code>：自定义请求头与 host。</li>
        <li><code>catchup</code> / <code>catchup-source</code>：本条线路的回看覆写。</li>
      </ul>

      <h3><code>#KODIPROP</code> 与 <code>#EXTVLCOPT</code></h3>
      <ul>
        <li><code>#KODIPROP:inputstream.adaptive.manifest_type</code> / <code>license_type</code> / <code>license_key</code> / <code>drm_legacy</code>：DRM 相关。</li>
        <li><code>#KODIPROP:inputstream.adaptive.stream_headers=Cookie=…&amp;User-Agent=…&amp;Referer=…</code></li>
        <li><code>#EXTVLCOPT:http-origin</code> / <code>http-referrer</code> / <code>http-user-agent</code> / <code>http-cookie</code> / <code>host</code></li>
      </ul>

      <h3>回看类型</h3>
      <p>
        <code>catchup</code> 字段取值：<code>default(0)</code> / <code>append(1)</code> / <code>timeshift|shift(2)</code> / <code>flussonic(3)</code> / <code>xtream codes(4)</code> / <code>disabled(无)</code>。
      </p>

      <h2>URL 前缀（混合源协议）</h2>
      <table>
        <thead>
          <tr><th>前缀</th><th>行为</th></tr>
        </thead>
        <tbody>
          <tr><td><code>webview://https://…</code></td><td>用 WebView 加载页面，注入 JS 提取视频流。详见 <a href="/webview-player">WebView 播放器</a>。</td></tr>
          <tr><td><code>video://https://…</code></td><td>同样走 WebView，但视为纯视频流（不主动提取）。</td></tr>
          <tr><td><code>javascript://…</code></td><td>走 QuickJS 引擎执行代码，通常用于程序化生成播放地址。</td></tr>
          <tr><td>其它</td><td>当作常规直播流（m3u8 / flv / ts / rtsp 等）。</td></tr>
        </tbody>
      </table>

      <h2>订阅源设置项</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>订阅源缓存时间</td><td>1 小时</td><td>可选 不缓存 / 1–23 小时 / 1–15 天 / 永久。本地文件不参与过期。缓存失效后下载失败会回落到旧缓存。<code>.gz</code> 自动 GZIP 解压。</td></tr>
          <tr><td>分类隐藏</td><td>—</td><td>按分组维度隐藏。</td></tr>
          <tr><td>隐藏频道规则</td><td>—</td><td>按频道名正则隐藏。</td></tr>
          <tr><td>支持加密频道组</td><td>关</td><td>分组名以 <code>_数字</code> 结尾时需密码。</td></tr>
          <tr><td>频道别名</td><td>—</td><td>10591 面板编辑，统一不同源的频道名。</td></tr>
          <tr><td>相似频道合并</td><td>开</td><td>同别名合并显示。</td></tr>
          <tr><td>频道图标提供</td><td>gitee myTVlogo</td><td>URL 模板，变量 <code>&#123;name&#125;</code> / <code>&#123;name|lowercase&#125;</code> / <code>&#123;name|uppercase&#125;</code>。自动追加 <code>_t=&lt;10天周期&gt;</code> 让缓存过期。</td></tr>
          <tr><td>频道图标覆盖</td><td>开</td><td>用「图标提供」覆盖订阅源中的 <code>tvg-logo</code>。</td></tr>
          <tr><td>PLTV 转 TVOD</td><td>开</td><td>把 PLTV 链接替换为 TVOD 以支持回看。</td></tr>
          <tr><td>自动添加网页源</td><td>订阅源优先</td><td>内置 CCTV-1 ~ CCTV-17、CETV、各省级卫视、央视频 PID 等。详见下节。</td></tr>
          <tr><td>网页源央视频 Cookie</td><td>空</td><td>央视频付费频道需登录后从浏览器复制 Cookie 填入。</td></tr>
        </tbody>
      </table>

      <h2>混合源（自动添加网页源）</h2>
      <p>
        mytv-android 内置<b>混合源</b>能力：自动为订阅源中的频道追加官网 / 央视网 / 央视频等网页源线路，作为内置源失效时的兜底。
        三种模式：
      </p>
      <ul>
        <li><b>禁用</b>：不自动添加。</li>
        <li><b>订阅源优先</b>（默认）：把网页源加在原订阅源线路后面。</li>
        <li><b>网页源优先</b>：把网页源放前面。</li>
      </ul>
      <p>
        播放器底部信息条会用 tag 标记当前线路来源：
        <code>央视网</code> / <code>央视频</code> / <code>官网</code>（命中小表的地方台官网，如北京 / 江苏 / 看看新闻 / 浙江 / 河北 / 广东 / 广西 / 黑龙江 / 河南 / 湖南 / 福建 / 贵州 / 江西 / 安徽 / 湖北 / 齐鲁 等）/ <code>其它</code>。
      </p>

      <h2>transformJs（订阅源级脚本）</h2>
      <p>
        添加订阅源时可附带一段 <b>QuickJS</b> 脚本，对解析后的频道列表做二次处理（过滤、改名、改 URL 等）。
        属于高级能力，普通用户一般用不到。
      </p>

      <h2>订阅源管理页</h2>
      <p>设置 → 订阅源 → 自定义订阅源 进入子页面，提供：</p>
      <ul>
        <li>设为当前 / 删除 / 清除缓存 / 返回。</li>
        <li>头部「刷新全部」按钮。</li>
        <li>底部「添加其他订阅源」：弹出二维码，扫码到 10591 面板添加。</li>
      </ul>

      <doc-callout kind="warn" title="关于内置演示源" icon="warning">
        仓库自带演示地址 <code>https://gitee.com/mytv-android/iptv-api/raw/master/output/webview_demo.m3u</code> 仅供测试，可用性不保证。请自行准备合法的 IPTV 订阅。
      </doc-callout>
    </div>
  `,
})
export class SourcesPage {}
