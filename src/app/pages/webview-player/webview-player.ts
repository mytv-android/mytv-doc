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
        lead="把网页当作视频源：适用于必须登录、带防盗链、或只能在网页里播放的频道。本页介绍用法与全部相关设置。"
      />

      <h2>1. 什么是 WebView 播放器？</h2>
      <p>
        当订阅源中的某条线路 URL 以 <code>webview://</code> 开头时，应用不会用常规播放器请求这个 URL，
        而是用 WebView 加载页面，并注入一段 JS 找到页中的 <code>&lt;video&gt;</code> 元素，把视频地址交给原生播放器播放。
        这样即使源站有防盗链、需要登录、或只能在网页里播放，也能在 TV 上观看。
      </p>

      <h2>2. 三种 URL 前缀</h2>
      <table>
        <thead>
          <tr><th>前缀</th><th>用途</th></tr>
        </thead>
        <tbody>
          <tr><td><code>webview://</code></td><td>WebView 加载并主动提取 <code>&lt;video&gt;</code>。最常用。</td></tr>
          <tr><td><code>video://</code></td><td>WebView 加载，但视为纯视频流（不主动提取）。适用于页面本身就是裸视频地址的场景。</td></tr>
          <tr><td><code>javascript://</code></td><td>QuickJS 引擎执行代码，返回真实播放地址。详见 <a [routerLink]="'/sources'">订阅源</a> §5。</td></tr>
        </tbody>
      </table>

      <h2>3. 使用方法</h2>
      <ol>
        <li>在订阅源（m3u / txt / 面板推送）中把某个频道的 URL 写成 <code>webview://https://example.com/live/xxx</code>。</li>
        <li>播放器切到这条线路时自动启动 WebView 内核。</li>
        <li>页面加载完成后，应用尝试全屏显示视频。</li>
        <li>加载超时（默认 10 秒）未取到视频则视为该线路失败，自动切到下一条线路。</li>
      </ol>

      <h2>4. TV 应用内设置项（设置 → WebView 播放器）</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>取值 / 说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>WebView 内核</td>
            <td>系统 WebView</td>
            <td>
              <b>Android（SYSTEM）</b>：系统自带 WebView。<br/>
              <b>TBS X5</b>：腾讯 X5 内核，仅支持 armv7 / arm64，第一次使用需在线下载；不可用时回退到系统内核。
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
            <td>1 / 2 / 3 / 4 / 5 / 10 / 15 / 20 / 25 / 30 / 45 / 60 秒。</td>
          </tr>
        </tbody>
      </table>

      <h2>5. 10591 面板（<code>/webview</code>）的全部可配置项</h2>
      <table>
        <thead>
          <tr><th>面板字段</th><th>类型</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>WebView 内核</td><td>下拉</td><td>Android（SYSTEM）/ TBS X5（X5）</td></tr>
          <tr><td>替换系统 WebView</td><td>开关</td><td>同 TV；重启生效</td></tr>
          <tr><td>WebView 加载超时</td><td>数字输入</td><td>单位毫秒</td></tr>
        </tbody>
      </table>

      <h2>6. 央视频 Cookie</h2>
      <p>
        央视频（<code>yangshipin.cn</code>）的付费频道需要登录后才能播放。在 <b>设置 → 订阅源 → 网页源央视频 Cookie</b>（只读）
        或 <b>面板首页 → 网页源央视频 Cookie</b> 中填入登录后的 Cookie，WebView 加载央视频域名时会自动注入。
      </p>

      <h2>7. 与其他功能的联动</h2>
      <ul>
        <li><b>订阅源</b>：<code>webview://</code> 前缀触发 WebView 内核；混合源中「央视频」「官网」tag 的线路都是 WebView 线路。详见 <a [routerLink]="'/sources'">订阅源</a>。</li>
        <li><b>播放器</b>：WebView 取到视频地址后，交给「视频播放器内核」播放，所以<b>视频播放器内核</b>和<b>WebView 内核</b>是两个独立开关。详见 <a [routerLink]="'/player-settings'">播放器与字幕</a>。</li>
      </ul>

      <h2>8. 常见问题</h2>
      <ul>
        <li><b>页面没全屏</b>：应用已尝试把 video 设为全屏，仍失败多半是站点用了自定义容器。可尝试换 WebView 内核。</li>
        <li><b>提取不到流</b>：站点可能使用 DRM 或自定义播放器。可换源。</li>
        <li><b>央视频付费频道黑屏</b>：在面板填入登录后的 Cookie。</li>
        <li><b>X5 内核下载失败</b>：X5 内核需在线下载，检查网络；失败时自动回退到系统 WebView。</li>
      </ul>

      <doc-callout kind="warn" title="合法使用" icon="gavel">
        <code>webview://</code> 用于播放你已有访问权的页面。请勿用于绕过登录 / 付费墙等场景。
      </doc-callout>
    </div>
  `,
})
export class WebviewPlayerPage {}
