import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';

@Component({
  selector: 'app-build',
  imports: [DocPageHeader, DocCallout, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="下载与更新"
        lead="从 GitHub Release 下载安装包、在应用内检查更新，或用网页面板把 APK 推到电视安装。"
      />

      <h2 id="release-download">从 Release 下载</h2>
      <p>
        前往
        <a href="https://github.com/mytv-android/mytv-android/releases" target="_blank" rel="noopener">
          mytv-android Releases
        </a>
        下载最新 APK。每个版本提供多个安装包，按设备的 CPU 架构（ABI）选择：
      </p>
      <table>
        <thead>
          <tr><th>文件名包含</th><th>适用设备</th></tr>
        </thead>
        <tbody>
          <tr><td><code>arm64-v8a</code></td><td>64 位系统的设备：手机、平板，以及少数 64 位系统的盒子。</td></tr>
          <tr><td><code>armeabi-v7a</code></td><td>32 位系统的设备：<b>绝大多数电视和盒子都属这一类</b>。</td></tr>
          <tr><td><code>x86</code> / <code>x86_64</code></td><td>Intel / AMD 处理器的设备、模拟器。</td></tr>
          <tr><td><code>all</code>（universal）</td><td>不确定选哪个时用它，体积最大但全平台兼容。</td></tr>
        </tbody>
      </table>
      <p>
        电视、盒子优先 <code>armeabi-v7a</code>；手机、平板用 <code>arm64-v8a</code>。盒子普遍是 64 位芯片配 32 位系统，决定能否安装的是<b>系统</b>位数而不是芯片位数，这类设备仍只能装 <code>armeabi-v7a</code>。装不上（提示「不兼容」「解析包错误」）就换 <code>all</code>。
      </p>
      <p>文件名还带三种后缀，按需选择：</p>
      <ul>
        <li><code>original</code>：标准版，默认选它。</li>
        <li><code>x5offline</code>：内置腾讯 X5 内核的版本（仅 armv7 / arm64），不想在应用内联网下载 X5 内核时选它。</li>
        <li><code>disguised</code>：应用包名不同的伪装版，功能与标准版相同，个别设备安装被拦截时备用。</li>
      </ul>

      <h2 id="in-app-update">应用内更新</h2>
      <p>
        应用启动时会按 <b>设置 → 更新 → 更新通道</b> 自动检查新版本，也可在 <b>首页 → 关于 → 检查更新</b> 手动检查：
      </p>
      <table>
        <thead>
          <tr><th>通道</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td><b>稳定版本</b>（默认）</td><td>问题最少，推荐日常使用。</td></tr>
          <tr><td><b>预览版本</b></td><td>提前体验新功能，可能有少量问题。</td></tr>
          <tr><td><b>开发版本</b></td><td>最新改动，可能不稳定。</td></tr>
        </tbody>
      </table>
      <p>
        「更新强提醒」（<b>设置 → 更新</b>）：开启时只要还有新版本，每次启动都全屏提醒，点「忽略并返回」只跳过这一次；关闭时仅消息提示，同一版本只提示一次。
      </p>

      <h3 id="update-screen">更新页</h3>
      <p>有新版本时进入更新页：左侧显示最新版本号和可滚动的更新日志，右侧两个按钮：</p>
      <ul>
        <li><b>立即更新</b>：下载安装包，首次需授予「安装未知应用」权限（也可提前在 <b>设置 → 权限</b> 中开启），随后调起系统安装界面。</li>
        <li><b>忽略并返回</b>：跳过这一次提醒。强提醒开启时，下次启动仍会再次全屏提醒，直到更新。</li>
      </ul>
      <p>已是最新时显示「当前为最新版本」，点击即可返回。</p>

      <h2 id="push-apk">用面板把 APK 推到电视安装</h2>
      <ol>
        <li>浏览器打开面板 <code>http://&lt;电视IP&gt;:10591</code>。</li>
        <li>在面板首页找到「安装 APK」卡片，选择本机的 APK 文件，点「上传并安装」。</li>
        <li>上传完成后，电视端弹出确认窗口，确认后进入系统安装流程。</li>
      </ol>
      <doc-callout kind="info" title="面板的「更新」页不能推 APK" icon="info">
        面板的「更新」页只能修改更新通道和更新强提醒。推 APK 安装请用面板首页的「安装 APK」卡片，详见
        <a [routerLink]="'/remote-panel'">远程配置面板</a>。
      </doc-callout>
    </div>
  `,
})
export class BuildPage {}
