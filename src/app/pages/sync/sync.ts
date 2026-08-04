import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocPageHeader } from '../../shared/doc-page-header';

@Component({
  selector: 'app-sync',
  imports: [DocPageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="云同步与备份"
        lead="把订阅、收藏、设置同步到云端，多设备共享同一份配置。"
      />

      <h2>支持的后端</h2>
      <table>
        <thead>
          <tr><th>后端</th><th>拉取</th><th>推送</th><th>需要的字段</th></tr>
        </thead>
        <tbody>
          <tr><td><b>GitHub Gist</b>（默认）</td><td>✓</td><td>✓</td><td><code>cloudSyncGithubGistId</code>、<code>cloudSyncGithubGistToken</code></td></tr>
          <tr><td><b>Gitee 代码片段</b></td><td>✓</td><td>✓</td><td><code>cloudSyncGiteeGistId</code>、<code>cloudSyncGiteeGistToken</code></td></tr>
          <tr><td><b>网络链接</b></td><td>✓</td><td>—</td><td><code>cloudSyncNetworkUrl</code>（一个返回 sync.json 的 URL）</td></tr>
          <tr><td><b>本地文件</b></td><td>✓</td><td>✓</td><td><code>cloudSyncLocalFilePath</code>，默认 <code>file:///storage/emulated/0/Download/</code></td></tr>
          <tr><td><b>WebDAV</b></td><td>✓</td><td>✓</td><td><code>cloudSyncWebDavUrl</code>、<code>cloudSyncWebDavUsername</code>、<code>cloudSyncWebDavPassword</code></td></tr>
        </tbody>
      </table>
      <p>
        这些账号字段在 TV 上是<b>只读</b>的（remoteConfig），必须到 10591 面板 → <code>POST /api/configs</code> 编辑。
      </p>

      <h2>同步哪些数据</h2>
      <p>云同步包（<code>CloudSyncData</code>）包含：</p>
      <ul>
        <li><code>version</code>：当前应用版本名。</li>
        <li><code>syncAt</code> / <code>syncFrom</code>：同步时间与设备名。</li>
        <li>
          <code>configs</code>：几乎所有 <code>Configs</code> 字段，但<b>剔除</b>以下本地偏好与敏感字段：
          <ul>
            <li>云同步账号本身（gist id / token、webdav url / 用户名 / 密码 等）</li>
            <li><code>globalVideoPlayerCore</code>、<code>webViewCore</code>、<code>replaceSystemWebView</code>、<code>globalVideoPlayerForceSoftDecode</code></li>
            <li><code>iptvChannelHistoryList</code>（最近观看历史）</li>
            <li><code>iptvSourceCurrentIdx</code>、<code>iptvChannelLastPlay</code></li>
            <li><code>iptvChannelLinePlayableHostList</code> / <code>iptvChannelLinePlayableUrlList</code>（可播放线路缓存）</li>
            <li><code>uiFocusOptimize</code></li>
          </ul>
        </li>
        <li><code>extraLocalIptvSourceList</code>：本地订阅源文件内容（按路径字典）。</li>
        <li><code>extraChannelNameAlias</code>：频道别名文件。</li>
      </ul>

      <h2>同步操作</h2>
      <ul>
        <li><b>拉取云端</b>：把云端 sync.json 拉到本地并应用。</li>
        <li><b>推送云端</b>：把本地 configs + 本地源 + 别名打包上传。</li>
        <li><b>自动拉取</b>：默认关；开启后应用启动时自动拉取云端并应用。</li>
        <li><b>应用云端数据</b>：在「云端数据」项上长按，重新把最近一次拉到的数据写回 SP。</li>
      </ul>

      <h2>系统备份</h2>
      <p>
        <b>设置 → 云同步 → 系统备份</b>（默认开）：允许 Android 系统备份应用数据（设置、收藏等），换机时通过系统恢复。
      </p>

      <h2>GitHub Gist 配置步骤</h2>
      <ol>
        <li>GitHub → Settings → Developer settings → Personal access tokens 创建 token，勾选 <code>gist</code> 权限。</li>
        <li>电视端：<b>设置 → 云同步 → 云同步服务商</b> 选 GitHub Gist。</li>
        <li>浏览器打开 <code>http://&lt;设备IP&gt;:10591</code>，在配置中填 <code>cloudSyncGithubGistId</code>（已有 gist 的 ID；首次推送会自动创建）和 <code>cloudSyncGithubGistToken</code>。</li>
        <li>电视端点「推送云端」完成首次上传；其他设备点「拉取云端」即可同步。</li>
      </ol>

      <h2>WebDAV 配置步骤</h2>
      <ol>
        <li>准备 WebDAV 服务器地址、用户名、密码（坚果云用应用密码，Nextcloud 用账号密码）。</li>
        <li>在 10591 面板中填 <code>cloudSyncWebDavUrl</code> / <code>cloudSyncWebDavUsername</code> / <code>cloudSyncWebDavPassword</code>。</li>
        <li>同步文件保存为你填写的 URL 对应路径。</li>
      </ol>

      <h2>本地文件备份</h2>
      <p>
        把同步后端切到「本地文件」，路径默认 <code>file:///storage/emulated/0/Download/</code>。
        推送时把 sync.json 写到该路径；拉取时从该路径读。适合无网环境或自己拷贝到 U 盘备份。
      </p>
    </div>
  `,
})
export class SyncPage {}
