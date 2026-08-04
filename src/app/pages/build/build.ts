import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';

@Component({
  selector: 'app-build',
  imports: [DocPageHeader, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="下载与更新"
        lead="从 GitHub Release 下载安装包，或在应用内检查更新。"
      />

      <h2>1. 从 Release 下载</h2>
      <p>
        前往
        <a href="https://github.com/mytv-android/mytv-android/releases" target="_blank" rel="noopener">
          mytv-android Releases
        </a>
        下载最新 APK。Release 通常提供多个 ABI 分包：
      </p>
      <table>
        <thead>
          <tr><th>文件</th><th>适用</th></tr>
        </thead>
        <tbody>
          <tr><td><code>app-armeabi-v7a-release.apk</code></td><td><b>绝大多数电视 / 电视盒子（推荐）</b>。32 位 ARM，兼容性最好。</td></tr>
          <tr><td><code>app-arm64-v8a-release.apk</code></td><td>较新的 64 位电视 / 盒子。</td></tr>
          <tr><td><code>app-x86-release.apk</code> / <code>app-x86_64-release.apk</code></td><td>Intel / AMD 平板、模拟器。</td></tr>
          <tr><td><code>app-universal-release.apk</code></td><td>不确定选哪个时用这个，体积最大但全平台兼容。</td></tr>
        </tbody>
      </table>
      <p>
        普通电视用户<b>优先尝试 <code>armeabi-v7a</code></b>；装上跑不起来再换 <code>arm64-v8a</code> 或 <code>universal</code>。
      </p>

      <h2>2. 应用内更新</h2>
      <p>
        应用启动后会按 <b>设置 → 更新 → 更新通道</b> 检查新版本：
      </p>
      <table>
        <thead>
          <tr><th>通道</th><th>对应仓库</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td><b>stable</b>（默认）</td><td><code>mytv-android/mytvstable</code></td><td>稳定版，问题最少。</td></tr>
          <tr><td><b>beta</b></td><td><code>mytv-android/mytvbeta</code></td><td>预览版，新功能先试。</td></tr>
          <tr><td><b>dev</b></td><td><code>mytv-android/mytvdev</code></td><td>开发版，可能不稳定。</td></tr>
        </tbody>
      </table>
      <p>
        「更新强提醒」开启时，检测到新版本会全屏提醒；关闭时只 Snackbar 提示。
        下载完成后调起系统安装器（首次需授予「安装未知应用」权限）。
      </p>

      <h2>3. 通过 10591 面板推 APK</h2>
      <p>
        浏览器打开 <code>http://&lt;设备IP&gt;:10591</code>，在面板中找到「上传 APK」入口，
        选择本机 APK 文件即可推送到电视并自动调起安装。详见 <a [routerLink]="'/remote-panel'">远程配置面板</a>。
      </p>
    </div>
  `,
})
export class BuildPage {}
