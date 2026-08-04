import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';

@Component({
  selector: 'app-webview-player',
  imports: [DocPageHeader, DocCallout],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="WebView 播放器"
        lead="把网页当作视频源：适用于必须登录、带防盗链、或只能在网页里播放的频道。"
      />

      <h2>什么是 WebView 播放器？</h2>
      <p>
        mytv-android 内置一个独立的 <code>webview</code> 模块。当订阅源中的某条线路 URL 形如
        <code>webview://https://example.com/live/xxx</code> 时，应用会用 WebView 加载该页面，
        并通过注入 JS 自动探测页中的视频流（<code>&lt;video&gt;</code> 元素），再交给原生播放器播放。
      </p>

      <h2>三种 URL 前缀</h2>
      <table>
        <thead>
          <tr><th>前缀</th><th>用途</th></tr>
        </thead>
        <tbody>
          <tr><td><code>webview://</code></td><td>WebView 加载并提取 <code>&lt;video&gt;</code></td></tr>
          <tr><td><code>video://</code></td><td>WebView 加载，但视为纯视频流（不主动提取）</td></tr>
          <tr><td><code>javascript://</code></td><td>QuickJS 引擎执行代码，程序化生成播放地址</td></tr>
        </tbody>
      </table>

      <h2>WebView 加载流程</h2>
      <ol>
        <li>应用按 URL 加载页面，同时按 host 应用黑名单（拦截广告 / 统计域名）。</li>
        <li><code>onPageFinished</code> 后注入 <code>webview_player_impl.js</code>。</li>
        <li>央视频域名（<code>yangshipin.cn</code>）额外注入「网页源央视频 Cookie」。</li>
        <li>注入的 JS 会：
          <ul>
            <li>找到页面中的 <code>&lt;video&gt;</code>（含 shadowRoot 中的）。</li>
            <li>移除主流播放器控件（<code>xg-controls</code>、<code>prism-controlbar</code>、<code>vjs-control-bar</code>、<code>dplayer-controller</code> 等）。</li>
            <li>隐藏页面上除 <code>&lt;script&gt;</code> / <code>&lt;video&gt;</code> 之外的 div。</li>
            <li>把 video 元素直接挂到 <code>body</code>，宽高 100%、<code>object-fit: fill</code>、设置背景色为应用背景。</li>
            <li>通过 <code>Android.changeVideoResolution(w, h)</code> 通知原生层（隐藏占位）。</li>
            <li>持续 <code>enableVideo()</code>：取消静音、<code>autoplay=true</code>、<code>volume=1</code>、调用 <code>play()</code>。</li>
          </ul>
        </li>
        <li>超时（默认 10 秒）未取到视频则视为该线路失败，自动切到下一条线路。</li>
      </ol>

      <h2>WebView 设置项</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>WebView 内核</td>
            <td>系统 WebView</td>
            <td>
              <b>SYSTEM</b>（默认）：系统自带 WebView。<br/>
              <b>X5</b>：腾讯 TBS X5 内核，仅支持 armv7 / arm64，第一次使用需在线下载；不可用时回退到系统内核。
            </td>
          </tr>
          <tr>
            <td>替换系统 WebView</td>
            <td>关</td>
            <td>使用包名 <code>com.google.android.webview</code> 的应用替换系统 WebView 内核，<b>重启生效</b>。</td>
          </tr>
          <tr>
            <td>WebView 加载超时</td>
            <td>10 秒</td>
            <td>可选 1/2/3/4/5/10/15/20/25/30/45/60 秒。</td>
          </tr>
        </tbody>
      </table>

      <h2>WebView 网页优化细节</h2>
      <ul>
        <li>启用 JS、DOM storage。</li>
        <li>不加载图片（<code>loadsImagesAutomatically=false</code>、<code>blockNetworkImage=true</code>）节省流量。</li>
        <li>允许 mixed content（https 页面里的 http 资源）。</li>
        <li>禁用缩放控件。</li>
        <li>自定义 UA（除 <code>passer-by.com/browser</code> 这种 UA 测试页外）。</li>
      </ul>

      <h2>常见问题</h2>
      <ul>
        <li><b>页面没全屏</b>：JS 已尝试把 video 挂到 body 并设为 100% 宽高，仍失败多半是站点用了自定义容器。可尝试换 WebView 内核。</li>
        <li><b>提取不到流</b>：站点可能使用 DRM 或自定义播放器。可换源。</li>
        <li><b>央视频付费频道黑屏</b>：需要在设置 → 订阅源 → 网页源央视频 Cookie 中填入登录后的 Cookie。</li>
      </ul>

      <doc-callout kind="warn" title="合法使用" icon="gavel">
        <code>webview://</code> 用于播放你已有访问权的页面。请勿用于绕过登录 / 付费墙等场景。
      </doc-callout>
    </div>
  `,
})
export class WebviewPlayerPage {}
