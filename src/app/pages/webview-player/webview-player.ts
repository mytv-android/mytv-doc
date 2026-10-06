import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';

@Component({
  selector: 'app-webview-player',
  imports: [DocPageHeader, DocCallout, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="WebView 播放器"
        lead="webview:// 线路把网页当作视频源：App 用网页内核打开页面、取出其中的视频来播。本页介绍三种网页线路、全部 WebView 设置与排查方法。"
      />

      <h2 id="what">什么是网页播放</h2>
      <p>
        大多数线路是直接的流地址（m3u8、flv 等），交给播放器内核解码播放。但有些频道只有网页版：
        必须登录、带防盗链，或站点根本不暴露流地址。这时线路可以写成 <code>webview://</code> 开头的网页地址——
        App 用 WebView（网页内核）打开这个页面，注入一段脚本找到页面里的视频元素，
        隐藏网页其余内容和控件，把视频铺满全屏、取消静音并播放。
      </p>
      <p>
        此时画面由 WebView 内核渲染，<b>不经过</b> Media3 / IJK / VLC 播放器内核；
        「设置 → 播放器」里的解码、缓冲等选项对它不生效（详见
        <a [routerLink]="'/player-settings'">播放器与字幕</a>）。
      </p>

      <h3 id="prefixes">三种 URL 前缀</h3>
      <table>
        <thead>
          <tr><th>前缀</th><th>工作方式</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>webview://</code></td>
            <td>把网页当播放器：WebView 加载页面后注入脚本，取出页中的视频铺满全屏，直接在网页内核里播放。最常用。</td>
          </tr>
          <tr>
            <td><code>video://</code></td>
            <td>
              先尝试从网页中提取纯视频流地址（先抓取网页源码匹配，失败再用 WebView 加载并嗅探网络请求）：
              提取到就交给普通播放器内核播放，享受解码、缓冲等全部播放能力；提取不到自动回退为
              <code>webview://</code> 方式播放。
            </td>
          </tr>
          <tr>
            <td><code>javascript://</code></td>
            <td>
              下载并执行订阅源作者提供的脚本，由脚本动态算出真实播放地址（可返回播放链接或 m3u8 内容）。
              脚本逻辑完全由源作者编写，用户无需任何操作，正常换台观看即可。
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="when">什么时候会遇到网页线路</h2>
      <ul>
        <li>订阅源里自带这些前缀的线路，线路列表会带上「网页源」等标签。</li>
        <li>
          开启 <b>设置 → 订阅源 → 自动添加网页源</b> 后，App 会为央视、央视频和各省卫视自动附加官网线路，
          这些官网线路都是网页播放（央视频的付费频道还需配置 Cookie，见下文）。详见
          <a [routerLink]="'/sources'">订阅源</a>。
        </li>
      </ul>
      <p>网页线路的起播速度取决于站点本身：页面重、请求多的站点加载慢属正常现象，可按下文设置项优化。</p>

      <h2 id="settings">设置逐项（设置 → WebView）</h2>
      <p>
        以下设置在电视端 <b>设置 → WebView</b>。除「清除 WebView 缓存」外，也能在远程配置面板（下称面板，见
        <a [routerLink]="'/remote-panel'">远程配置面板</a>）的 <b>WebView</b> 页修改，改动即保存。
      </p>
      <table>
        <thead>
          <tr><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>WebView 内核</td>
            <td>
              <b>Android</b>（默认，系统自带内核）/ <b>TBS X5</b>（腾讯 X5 内核，仅支持 armv7 / arm64 架构，
              第一次使用时需要初始化下载；下载失败或架构不支持时回退系统内核）。
              系统内核太老导致页面打不开时，优先试 X5。
            </td>
          </tr>
          <tr>
            <td>替换系统 WebView</td>
            <td>
              用包名为 <code>com.google.android.webview</code> 的应用替换系统 WebView 内核，默认关，<b>重启生效</b>。
              适合系统自带内核版本过旧、且已自行安装新版 WebView 的设备。
            </td>
          </tr>
          <tr>
            <td>WebView 加载超时</td>
            <td>
              可选 1 / 2 / 3 / 4 / 5 / <b>10（默认）</b> / 15 / 20 / 25 / 30 / 45 / 60 秒。
              超时仍取不到视频，该线路按失败处理（多线路频道自动尝试下一条）。页面慢的站点可调大。
            </td>
          </tr>
          <tr>
            <td>加载风格</td>
            <td>
              <b>默认网页</b>（默认，正常显示页面加载过程）/ <b>只显示百分比</b>（隐藏页面，只显示加载进度）/
              <b>只显示黑屏</b>（隐藏页面，加载完成前全黑）。后两档适合不想看到网页内容的场景。
            </td>
          </tr>
          <tr>
            <td>网页缩放</td>
            <td>
              <b>自适应</b>（默认）/ <b>100%</b> / <b>75%</b> / <b>50%</b>。
              降低缩放可减少渲染开销，低配设备更流畅；部分站点布局可能受影响。
            </td>
          </tr>
          <tr>
            <td>网页 UA</td>
            <td>
              <b>系统默认</b>（默认）/ <b>Windows</b> / <b>macOS</b> / <b>iPad</b>。
              有的站点按 UA 返回不同页面（例如移动版没有播放器），可换成桌面或平板 UA 再试。
            </td>
          </tr>
          <tr>
            <td>加载网页图片</td>
            <td>开（默认）。关闭后不加载页面图片，可显著加快加载、减少流量——看视频通常不需要网页里的图。</td>
          </tr>
          <tr>
            <td>图层加速</td>
            <td><b>关</b>（默认）/ <b>硬件</b> / <b>软件</b>。网页画面花屏、黑屏时可尝试切换。</td>
          </tr>
          <tr>
            <td>清除 WebView 缓存</td>
            <td>操作项，仅电视端。清除内核缓存与存储数据（<b>Cookie 保留</b>，已配置的央视频登录不受影响），清除后提示「WebView 缓存已清除」。</td>
          </tr>
        </tbody>
      </table>

      <doc-callout kind="tip" title="低配设备推荐组合" icon="speed">
        网页播放卡顿或起播慢时：关闭「加载网页图片」+「网页缩放」降到 75% 或 50% +「加载风格」选只显示黑屏，
        渲染压力最小。
      </doc-callout>

      <h2 id="yangshipin">央视频付费频道（Cookie）</h2>
      <p>央视频（yangshipin.cn）的付费频道需要登录后才能播放。App 加载央视频域名时会自动注入你配置的 Cookie：</p>
      <ol>
        <li>在电脑浏览器登录央视频网页版，复制登录后的全部 Cookie；</li>
        <li>打开面板，在首页「网页源央视频 Cookie」卡片粘贴并推送（面板的 订阅源 页是同一项）；</li>
        <li>回电视重新打开央视频频道。Cookie 过期后需要重新推送。</li>
      </ol>
      <p>
        电视端 <b>设置 → 订阅源 → 网页源央视频Cookie</b> 只读，仅用于确认是否已配置，编辑一律在面板进行。
        详细步骤见 <a [routerLink]="'/faq'" fragment="yangshipin-vip">常见问题</a>。
      </p>

      <h2 id="troubleshoot">一直加载或黑屏怎么办</h2>
      <ol>
        <li>换内核：<b>WebView 内核</b> 切到 TBS X5 再试；</li>
        <li>调大 <b>WebView 加载超时</b>（如 20～30 秒）；</li>
        <li>关闭 <b>加载网页图片</b>、把 <b>网页缩放</b> 降到 75% 或 50%，减轻低配设备负担；</li>
        <li>花屏、黑屏：切换 <b>图层加速</b>（硬件 / 软件都试一下），或换 <b>网页 UA</b>；</li>
        <li>页面状态异常：执行一次 <b>清除 WebView 缓存</b>；</li>
        <li>仍不行：站点可能使用了 DRM 加密或自定义播放器，无法提取视频，放弃这条线路换其他源。</li>
      </ol>
      <p>更多排查见 <a [routerLink]="'/faq'" fragment="webview-stuck">常见问题</a>。</p>

      <doc-callout kind="warn" title="合法使用" icon="gavel">
        网页播放用于观看你已有访问权的页面（如自己已登录的央视频账号）。请勿用于绕过登录、付费墙等场景。
      </doc-callout>
    </div>
  `,
})
export class WebviewPlayerPage {}
