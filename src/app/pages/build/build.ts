import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';

@Component({
  selector: 'app-build',
  imports: [DocPageHeader, DocCallout],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="下载与自行编译"
        lead="推荐直接下载 Release；如需定制可按本页步骤本地编译。"
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
          <tr><td><code>app-arm64-v8a-release.apk</code></td><td>绝大多数新电视 / 盒子（推荐）</td></tr>
          <tr><td><code>app-armeabi-v7a-release.apk</code></td><td>较老的 32 位设备</td></tr>
          <tr><td><code>app-x86-release.apk</code> / <code>app-x86_64-release.apk</code></td><td>Intel / AMD 平板、模拟器</td></tr>
          <tr><td><code>app-universal-release.apk</code></td><td>不确定就选这个（体积最大）</td></tr>
        </tbody>
      </table>
      <p>
        当前版本号规则：<code>2.2.0.$&#123;VERSION_CODE&#125;</code>（<code>versionCode</code> 由 CI 注入）。
      </p>

      <h2>2. 应用内更新</h2>
      <p>
        应用启动后会按 <b>设置 → 更新 → 更新通道</b> 检查新版本：
      </p>
      <ul>
        <li><b>stable</b>（默认）：稳定版，对应 Gitee <code>mytv-android/mytvstable</code>。</li>
        <li><b>beta</b>：预览版，对应 <code>mytv-android/mytvbeta</code>。</li>
        <li><b>dev</b>：开发版，对应 <code>mytv-android/mytvdev</code>。</li>
      </ul>
      <p>
        「更新强提醒」开启时，检测到新版本会全屏提醒；关闭时只 Snackbar 提示。
        下载到 <code>cacheDir/latest.apk</code> 后调起系统安装器（需授予「安装未知应用」权限）。
      </p>

      <h2>3. 自行编译</h2>

      <h3>环境要求</h3>
      <ul>
        <li>JDK 17 或更高。</li>
        <li>Android SDK（compileSdk 见 <code>gradle/libs.versions.toml</code>，目前为 36）。</li>
        <li>Gradle Wrapper（仓库自带 <code>gradlew</code> / <code>gradlew.bat</code>）。</li>
      </ul>

      <h3>克隆代码</h3>
      <pre><code>git clone https://github.com/mytv-android/mytv-android.git
cd mytv-android</code></pre>

      <h3>签名配置</h3>
      <p>
        在仓库根目录创建 <code>signing.properties</code>：
      </p>
      <pre><code>storeFile=keystore.jks
storePassword=你的密码
keyAlias=你的别名
keyPassword=你的密码</code></pre>
      <p>
        把对应的 <code>keystore.jks</code> 放到仓库根目录，或用环境变量 <code>KEYSTORE</code> / <code>KEYSTORE_PASSWORD</code> / <code>KEY_ALIAS</code> / <code>KEY_PASSWORD</code> 替代。
      </p>

      <h3>构建命令</h3>
      <pre><code># Windows (PowerShell)
$env:VERSION_CODE = "1"
gradlew.bat assembleRelease

# Linux / macOS
VERSION_CODE=1 ./gradlew assembleRelease</code></pre>
      <p>
        构建产物位于 <code>tv/build/outputs/apk/release/</code>。
        <code>versionCode</code> 通过环境变量 <code>VERSION_CODE</code> 注入；未设置时构建会失败，所以本地构建时记得加上。
      </p>

      <doc-callout kind="warn" title="许可证提醒" icon="gavel">
        本项目使用 GNU 许可证。分发修改后的版本时，必须保持相同许可证并公开源码。详见
        <a href="https://github.com/mytv-android/mytv-android/blob/main/LICENSE" target="_blank" rel="noopener">LICENSE</a>。
      </doc-callout>
    </div>
  `,
})
export class BuildPage {}
