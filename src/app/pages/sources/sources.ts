import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';

@Component({
  selector: 'app-sources',
  imports: [DocPageHeader, DocCallout, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="订阅源（IPTV）"
        lead="订阅源是 mytv-android 的核心数据。本页介绍四种源类型、URL 前缀协议、混合源，以及 TV 应用内和 10591 面板上的全部相关设置。"
      />

      <h2>1. 订阅源类型</h2>
      <table>
        <thead>
          <tr><th>类型</th><th>说明</th><th>必填字段</th></tr>
        </thead>
        <tbody>
          <tr><td><b>网络 m3u / txt</b></td><td>按内容自动识别。txt 形如 <code>分组,#genre#</code> 行 + <code>频道名,url1#url2</code>。</td><td>链接</td></tr>
          <tr><td><b>本地文件</b></td><td>TV 本机 m3u / txt 路径，不参与缓存过期。</td><td>文件路径</td></tr>
          <tr><td><b>Xtream Codes</b></td><td>面板内部拼接 <code>get.php?username=…&amp;password=…&amp;type=…</code>。</td><td>链接、用户名、密码、输出类型（m3u_plus / m3u）</td></tr>
          <tr><td><b>Stalker Portal</b></td><td>自动 handshake 取 token 后请求频道列表。</td><td>链接、MAC 地址</td></tr>
        </tbody>
      </table>

      <h2>2. 添加订阅源</h2>
      <p>有三种方式：</p>
      <ol>
        <li><b>TV 端：设置 → 订阅源 → 自定义订阅源 → 添加其他订阅源</b>。弹二维码，扫码跳到面板添加页。</li>
        <li><b>面板首页（<code>/</code>）→ 订阅源</b>。支持 5 种类型：remote / xtream / stalker / file / content（content 允许你直接粘贴 m3u 内容，面板把内容写到 TV 本地文件再注册为本地源）。</li>
        <li><b>面板订阅源页（<code>/sources</code>）→ 新增</b>。同首页，但走完整编辑对话框。</li>
      </ol>

      <h2>3. m3u 支持的扩展字段</h2>
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

      <h2>4. URL 前缀（混合源协议）</h2>
      <table>
        <thead>
          <tr><th>前缀</th><th>行为</th></tr>
        </thead>
        <tbody>
          <tr><td><code>webview://https://…</code></td><td>用 WebView 加载页面，注入 JS 提取视频流。详见 <a [routerLink]="'/webview-player'">WebView 播放器</a>。</td></tr>
          <tr><td><code>video://https://…</code></td><td>同样走 WebView，但视为纯视频流（不主动提取）。</td></tr>
          <tr><td><code>javascript://…</code></td><td>走 QuickJS 引擎执行代码，脚本 return 的字符串就是真正的播放地址。详见下方「javascript:// 源」。</td></tr>
          <tr><td>其它</td><td>当作常规直播流（m3u8 / flv / ts / rtsp 等）。</td></tr>
        </tbody>
      </table>

      <h2>5. javascript:// 源</h2>
      <p>
        把订阅源某条线路的 URL 写成 <code>javascript://</code> 开头，播放器切到这条线路时不会直接请求网络，
        而是把整段 URL 交给内置的 <b>QuickJS</b> 引擎执行。脚本 return 的字符串就是真正的播放地址（m3u8 / mp4 等）。
      </p>
      <p>典型用途：</p>
      <ul>
        <li><b>动态拼接</b>：根据当前时间戳、设备指纹等动态生成播放地址。</li>
        <li><b>一次额外请求</b>：脚本里发起一次 HTTP 请求拿到真实地址再返回。</li>
        <li><b>解密</b>：对源站返回的加密地址做本地解密。</li>
      </ul>
      <p>注意事项：</p>
      <ul>
        <li>脚本运行在 QuickJS（不是浏览器），没有 <code>window</code> / <code>document</code>，只能用引擎提供的 API。</li>
        <li>整条 URL 都会作为脚本源码执行，所以脚本里不能含未转义的换行；一般写成单行。</li>
        <li>调试需要打开「开发者模式」（见 <a [routerLink]="'/remote-panel'">远程配置面板</a> → <code>/ku9/js/*</code> 端点）。</li>
      </ul>

      <h2>6. 混合源（自动添加网页源）</h2>
      <p>
        mytv-android 内置<b>混合源</b>能力：自动为订阅源中的频道追加官网 / 央视网 / 央视频等网页源线路，作为内置源失效时的兜底。
        线路在播放器底部信息条会用 tag 标记来源：<code>央视网</code> / <code>央视频</code> / <code>官网</code>（命中小表的地方台官网，如北京 / 江苏 / 看看新闻 / 浙江 / 河北 / 广东 / 广西 / 黑龙江 / 河南 / 湖南 / 福建 / 贵州 / 江西 / 安徽 / 湖北 / 齐鲁 等）/ <code>其它</code>。
      </p>

      <h2>7. TV 应用内设置项（设置 → 订阅源）</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>取值 / 说明</th></tr>
        </thead>
        <tbody>
          <tr><td>自定义订阅源</td><td>演示源</td><td>子页面管理所有源：设为当前 / 删除 / 清除缓存 / 添加其他订阅源（弹二维码）/ 刷新全部</td></tr>
          <tr><td>订阅源缓存时间</td><td>1 小时</td><td>可选 不缓存 / 1–23 小时 / 1–15 天 / 永久。本地文件不参与过期；缓存失效后下载失败会回落到旧缓存；<code>.gz</code> 自动 GZIP 解压</td></tr>
          <tr><td>分类隐藏</td><td>空</td><td>4 列网格逐组切换可见性</td></tr>
          <tr><td>隐藏频道规则</td><td>空</td><td>按频道名<b>正则</b>匹配；命中的频道不会出现在列表 / 搜索中</td></tr>
          <tr><td>支持加密频道组</td><td>关</td><td>分组名以 <code>_数字</code> 结尾时需输入密码（密码即数字部分）；加密分组在搜索中隐藏</td></tr>
          <tr><td>频道别名</td><td>空</td><td>只读显示，编辑在面板</td></tr>
          <tr><td>相似频道合并</td><td>开</td><td>同别名合并显示</td></tr>
          <tr><td>频道图标提供</td><td>gitee myTVlogo</td><td>只读显示，编辑在面板；URL 模板变量 <code>&#123;name&#125;</code> / <code>&#123;name|lowercase&#125;</code> / <code>&#123;name|uppercase&#125;</code></td></tr>
          <tr><td>频道图标覆盖</td><td>开</td><td>用「图标提供」覆盖订阅源中的 <code>tvg-logo</code></td></tr>
          <tr><td>PLTV 转 TVOD</td><td>开</td><td>自动把 PLTV 链接替换为 TVOD 以支持回看</td></tr>
          <tr><td>自动添加网页源</td><td>订阅源优先</td><td>禁用 / 订阅源优先 / 网页源优先</td></tr>
          <tr><td>网页源央视频 Cookie</td><td>空</td><td>只读显示（前 50 字符），编辑在面板；央视频付费频道需要</td></tr>
        </tbody>
      </table>

      <h2>8. 10591 面板（<code>/sources</code>）的全部可配置项</h2>
      <p>面板订阅源页比 TV 多了排序、transformJs、单源 UA / 代理、别名编辑等能力。</p>
      <table>
        <thead>
          <tr><th>面板字段</th><th>类型</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>订阅源列表</td><td>列表 + 分页</td><td>新增 / 编辑 / 删除 / 上移 / 下移 / 设为当前；分页 5/10/25/100；带 sourceType 徽标</td></tr>
          <tr><td>编辑对话框 - 名称</td><td>文本框</td><td>订阅源显示名</td></tr>
          <tr><td>编辑对话框 - 类型</td><td>下拉</td><td>remote / file / xtream / stalker</td></tr>
          <tr><td>编辑对话框 - 链接 / 文件路径</td><td>文本框</td><td>网络源 URL 或本地文件路径</td></tr>
          <tr><td>编辑对话框 - 文件内容</td><td>多行文本</td><td>仅 file 类型显示；直接编辑 TV 本地文件内容</td></tr>
          <tr><td>编辑对话框 - 用户名 / 密码</td><td>文本框</td><td>仅 xtream 类型显示</td></tr>
          <tr><td>编辑对话框 - 输出类型</td><td>下拉</td><td>m3u_plus / m3u；仅 xtream 类型显示</td></tr>
          <tr><td>编辑对话框 - MAC 地址</td><td>文本框</td><td>仅 stalker 类型显示</td></tr>
          <tr><td>编辑对话框 - 全局 UA</td><td>文本框</td><td>单源级 UA；非 file 类型显示</td></tr>
          <tr><td>编辑对话框 - HTTP 代理</td><td>文本框</td><td>单源级代理；非 file 类型显示</td></tr>
          <tr><td>编辑对话框 - 转换 JS</td><td>多行文本</td><td><code>function transform(channels) &#123; ... &#125;</code>；解析后二次处理频道列表</td></tr>
          <tr><td>订阅源缓存时间（小时）</td><td>数字输入</td><td>0 = 无缓存；单位小时</td></tr>
          <tr><td>频道隐藏分组</td><td>chips 编辑</td><td>点击 chip 直接编辑字符串</td></tr>
          <tr><td>频道隐藏列表</td><td>chips 编辑</td><td>按正则</td></tr>
          <tr><td>频道别名</td><td>多行文本</td><td>示例 <code>&#123;__suffix:[...], CCTV1:[...]&#125;</code>；写入后刷新别名并清空 IPTV / EPG 缓存</td></tr>
          <tr><td>相似频道合并</td><td>开关</td><td>同 TV</td></tr>
          <tr><td>频道图标提供</td><td>单行文本</td><td>同 TV</td></tr>
          <tr><td>频道图标覆盖</td><td>开关</td><td>同 TV</td></tr>
          <tr><td>PLTV 转 TVOD</td><td>开关</td><td>同 TV</td></tr>
          <tr><td>自动添加网页源</td><td>下拉</td><td>禁用 / IPTV 优先 / 网页源优先</td></tr>
          <tr><td>网页源央视频 Cookie</td><td>多行文本</td><td>从浏览器登录央视频后复制所有 Cookie</td></tr>
        </tbody>
      </table>

      <h2>9. 与其他功能的联动</h2>
      <ul>
        <li><b>EPG</b>：m3u 中的 <code>x-tvg-url</code> / <code>url-tvg</code> 在「跟随订阅源」开启时优先作为 EPG 来源。详见 <a [routerLink]="'/epg'">EPG 节目单</a>。</li>
        <li><b>WebView 播放器</b>：<code>webview://</code> 前缀触发 WebView 内核加载。详见 <a [routerLink]="'/webview-player'">WebView 播放器</a>。</li>
        <li><b>加密分组</b>：开启后列表 / 搜索都需密码。详见 <a [routerLink]="'/channels'">频道、收藏与搜索</a>。</li>
        <li><b>频道别名</b>：配合「相似频道合并」让多源同名频道合并显示。详见 <a [routerLink]="'/channels'">频道、收藏与搜索</a>。</li>
      </ul>

      <doc-callout kind="warn" title="关于内置演示源" icon="warning">
        仓库自带演示地址 <code>https://gitee.com/mytv-android/iptv-api/raw/master/output/webview_demo.m3u</code> 仅供测试，可用性不保证。请自行准备合法的 IPTV 订阅。
      </doc-callout>
    </div>
  `,
})
export class SourcesPage {}
