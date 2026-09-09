import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';

@Component({
  selector: 'app-sync',
  imports: [DocPageHeader, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="云同步与备份"
        lead="把订阅、收藏、设置同步到云端或本地文件，多设备共享同一份配置。本页介绍五种后端、TV 与面板上的配置方法、导入导出。"
      />

      <h2>1. 五种同步后端</h2>
      <p>
        云同步通过 <code>CloudSyncProvider</code> 枚举选择后端，<code>CloudSync</code> 会按当前服务商返回对应仓库实现。
        每个后端是否支持拉取/推送见下表（来源：<code>CloudSyncProvider.supportPull / supportPush</code>）。
      </p>
      <table>
        <thead>
          <tr><th>后端</th><th>枚举值</th><th>拉取</th><th>推送</th><th>适用场景</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><b>GitHub Gist</b>（默认）</td>
            <td><code>GITHUB_GIST(0)</code></td>
            <td>✓</td><td>✓</td>
            <td>个人多设备同步，免费稳定。</td>
          </tr>
          <tr>
            <td><b>Gitee 代码片段</b></td>
            <td><code>GITEE_GIST(1)</code></td>
            <td>✓</td><td>✓</td>
            <td>同 Gist，大陆访问更稳定。</td>
          </tr>
          <tr>
            <td><b>网络链接</b></td>
            <td><code>NETWORK_URL(2)</code></td>
            <td>✓</td>
            <td>—</td>
            <td>只读。从一个返回 sync.json 的 URL 拉配置，<code>push()</code> 直接返回 <code>false</code>，适合"管理员发配置、用户只拉"。</td>
          </tr>
          <tr>
            <td><b>本地文件</b></td>
            <td><code>LOCAL_FILE(3)</code></td>
            <td>✓</td><td>✓</td>
            <td>把 sync.json 写到 TV 本地路径（默认 <code>file:///storage/emulated/0/Download/</code>），适合无网环境或 U 盘备份。</td>
          </tr>
          <tr>
            <td><b>WebDAV</b></td>
            <td><code>WEBDAV(4)</code></td>
            <td>✓</td><td>✓</td>
            <td>自建 NAS / Nextcloud / 坚果云用户。</td>
          </tr>
        </tbody>
      </table>
      <p>
        所有后端在 TV 设置页与面板中均可切换，切换后立即生效（<code>Configs.cloudSyncProvider</code> 持久化为整型）。
      </p>

      <h2>2. 同步哪些数据</h2>
      <p>
        云同步包（<code>CloudSyncData</code>）由 <code>CloudSync.getData()</code> 构造，包含以下字段：
      </p>
      <ul>
        <li><code>version</code>：当前应用版本名（<code>BuildConfig.VERSION_NAME</code>）。</li>
        <li><code>syncAt</code>：推送时间戳（<code>System.currentTimeMillis()</code>）。</li>
        <li><code>syncFrom</code>：推送设备名（<code>Globals.deviceName</code>）。</li>
        <li><code>description</code>：备注，Gist/WebDAV 后端会从远端读回（如 Gist 的 <code>description</code> 字段）。</li>
        <li>
          <code>configs</code>：<code>Configs.toPartial()</code> 生成的几乎全部字段，但<b>剔除</b>以下本地偏好与敏感字段（<code>desensitized()</code> 处理）：
          <ul>
            <li>云同步账号本身（gist id / token、webdav url / 用户名 / 密码 等）</li>
            <li><code>globalVideoPlayerCore</code>、<code>webViewCore</code>、<code>replaceSystemWebView</code>、<code>globalVideoPlayerForceSoftDecode</code>、<code>globalVideoPlayerMedia3SoftDecodeAudioOnly</code>、<code>globalVideoPlayerSuperResolution</code>、<code>globalVideoPlayerSuperResolutionMode</code>、<code>globalVideoPlayerFrameInterpolation</code>、<code>globalVideoPlayerFrameInterpolationMode</code></li>
            <li><code>iptvChannelHistoryList</code>（最近观看历史）</li>
            <li><code>iptvSourceCurrentIdx</code>、<code>iptvChannelLastPlay</code>、<code>iptvChannelLastPlayLineIdx</code></li>
            <li><code>iptvChannelLinePlayableHostList</code> / <code>iptvChannelLinePlayableUrlList</code>（可播放线路缓存）</li>
            <li><code>uiFocusOptimize</code></li>
            <li>所有 ASR / 翻译相关字段（<code>videoPlayerRealTimeASR</code>、<code>videoPlayerASRModel</code>、翻译引擎凭据等，均为设备本地配置）</li>
          </ul>
        </li>
        <li>
          <code>extraLocalIptvSourceList</code>：本地订阅源文件内容（按路径字典）。
          仅同步 <code>sourceType == 1</code> 且 <code>url</code> 以 <code>Globals.fileDir.path</code> 开头的源文件内容，并行读取以避免串行延迟。
        </li>
      </ul>
      <p>
        应用云端数据时（<code>CloudSyncData.apply()</code>）：先 <code>Configs.fromPartial()</code> 写回设置（含频道别名 <code>iptvChannelNameAlias</code>），再把本地订阅源文件内容写回原路径，最后把别名注入 <code>ChannelAlias</code> 并刷新缓存。
      </p>

      <h2>3. TV 应用内设置项（设置 → 云同步）</h2>
      <p>
        对应 <code>SettingsCloudSyncScreen</code>。页面顶部右上角有「拉取云端」「推送云端」两个按钮（仅当当前服务商支持对应操作时显示），
        下方为设置项列表。
      </p>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>拉取云端 / 推送云端</td>
            <td>—</td>
            <td>顶部两个按钮。拉取调 <code>CloudSync.pull()</code>，推送调 <code>CloudSync.push()</code>；推送成功后会自动再拉取一次刷新展示。</td>
          </tr>
          <tr>
            <td>云端数据</td>
            <td>—</td>
            <td>
              进入页面即自动拉取一次。展示「云端版本 / 推送时间（<code>yyyy-MM-dd HH:mm:ss</code>）/ 推送设备 / 备注」；
              拉取失败或为空显示「无云端数据」。<b>长按</b>该项会调用 <code>CloudSyncData.apply()</code> 重新应用云端数据并刷新界面。
            </td>
          </tr>
          <tr>
            <td>自动拉取</td>
            <td>关</td>
            <td>
              开关，对应 <code>cloudSyncAutoPull</code>。开启后应用启动时自动拉取云端并应用。
            </td>
          </tr>
          <tr>
            <td>系统备份</td>
            <td>开</td>
            <td>
              开关，对应 <code>appBackupEnable</code>。允许 Android 系统备份应用数据（设置、收藏等）。
              由 <code>MyTVBackupAgent</code> 实现，支持键值对备份与 Android 6.0+ 自动备份两种模式，
              换机时通过系统恢复。关闭后 <code>onBackup / onFullBackup / onRestore</code> 均会跳过。
            </td>
          </tr>
          <tr>
            <td>云同步服务商</td>
            <td>GitHub Gist</td>
            <td>
              跳转项，进入 <code>SettingsCloudSyncProviderScreen</code>。子页面以 6 列网格列出五种后端，
              每项右侧标注「支持拉取 / 不支持拉取」「支持推送 / 不支持推送」，选中项打勾。
            </td>
          </tr>
        </tbody>
      </table>

      <h3>后端字段（按服务商动态显示，TV 端只读）</h3>
      <p>
        选择不同服务商后，TV 页面下方会动态追加对应的账号字段，所有字段均标记 <code>remoteConfig = true</code>（TV 只读，编辑需在面板）。
      </p>
      <table>
        <thead>
          <tr><th>服务商</th><th>显示字段（对应 Configs 字段 / 默认值）</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>GitHub Gist</td>
            <td>
              <code>cloudSyncGithubGistId</code>（默认 <code>""</code>）<br>
              <code>cloudSyncGithubGistToken</code>（默认 <code>""</code>）
            </td>
          </tr>
          <tr>
            <td>Gitee 代码片段</td>
            <td>
              <code>cloudSyncGiteeGistId</code>（默认 <code>""</code>）<br>
              <code>cloudSyncGiteeGistToken</code>（默认 <code>""</code>）
            </td>
          </tr>
          <tr>
            <td>网络链接</td>
            <td><code>cloudSyncNetworkUrl</code>（默认 <code>""</code>）</td>
          </tr>
          <tr>
            <td>本地文件</td>
            <td>
              <code>cloudSyncLocalFilePath</code>（默认 <code>Constants.DEFAULT_LOCAL_SYNC_FILE_PATH</code> = <code>file:///storage/emulated/0/Download/</code>）
            </td>
          </tr>
          <tr>
            <td>WebDAV</td>
            <td>
              <code>cloudSyncWebDavUrl</code>（默认 <code>""</code>）<br>
              <code>cloudSyncWebDavUsername</code>（默认 <code>""</code>）<br>
              <code>cloudSyncWebDavPassword</code>（默认 <code>""</code>）
            </td>
          </tr>
        </tbody>
      </table>

      <h2>4. 10591 面板（<code>/sync</code>）的全部可配置项</h2>
      <p>
        对应 <code>BackupComponent</code>。面板用 <code>mat-button-toggle-group</code> 选服务商，
        字段在 TV 标记为只读的账号项在面板这里可直接编辑。
      </p>
      <table>
        <thead>
          <tr><th>面板字段</th><th>控件</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>自动拉取</td><td><code>mat-slide-toggle</code></td><td>同 TV，绑定 <code>cloudSyncAutoPull</code></td></tr>
          <tr>
            <td>服务商</td>
            <td><code>mat-button-toggle-group</code></td>
            <td>GitHub Gist / Gitee 代码片段 / 网络链接 / 本地文件 / WebDAV</td>
          </tr>
          <tr>
            <td>GitHub Gist ID / Token</td>
            <td>文本框</td>
            <td>仅服务商 = <code>GITHUB_GIST</code> 时显示</td>
          </tr>
          <tr>
            <td>Gitee 代码片段 ID / Token</td>
            <td>文本框</td>
            <td>仅服务商 = <code>GITEE_GIST</code> 时显示</td>
          </tr>
          <tr>
            <td>网络链接</td>
            <td>文本框</td>
            <td>仅服务商 = <code>NETWORK_URL</code> 时显示；占位 <code>https://example.com/sync</code></td>
          </tr>
          <tr>
            <td>本地文件路径</td>
            <td>文本框</td>
            <td>仅服务商 = <code>LOCAL_FILE</code> 时显示；占位 <code>file:///storage/emulated/0/Download/</code></td>
          </tr>
          <tr>
            <td>WebDAV URL / 用户名 / 密码</td>
            <td>文本框</td>
            <td>仅服务商 = <code>WEBDAV</code> 时显示；URL 占位 <code>https://webdav.example.com/remote.php/dav/files/username/</code></td>
          </tr>
          <tr>
            <td>推送</td>
            <td>按钮</td>
            <td>把当前面板的修改提交到 TV（<code>configsService.updateData</code>）</td>
          </tr>
          <tr>
            <td>导入应用数据</td>
            <td>跳转项</td>
            <td>选择本机 .json 文件，调 <code>POST /api/cloud-sync/data</code>（<code>AppApi.pushCloudSyncData</code>）应用</td>
          </tr>
          <tr>
            <td>导出应用数据</td>
            <td>跳转项</td>
            <td>下载 JSON，文件名 <code>&#123;syncFrom&#125;-v&#123;version&#125;-&#123;syncAt&#125;.json</code></td>
          </tr>
        </tbody>
      </table>

      <h2>5. 各后端配置步骤</h2>

      <h3>GitHub Gist</h3>
      <ol>
        <li>GitHub → Settings → Developer settings → Personal access tokens 创建 token，勾选 <code>gist</code> 权限。</li>
        <li>面板 <code>/sync</code> → 服务商 选 GitHub Gist。</li>
        <li>填 <code>GitHub Gist Token</code>；<code>GitHub Gist ID</code> 首次推送时会自动创建并回填。</li>
        <li>面板点「推送」提交到 TV；TV 端点「推送云端」完成首次上传。</li>
        <li>其他设备填同样的 ID + Token，点「拉取云端」即可同步。</li>
      </ol>
      <p>
        实现细节：<code>GithubGistSyncRepository</code> 调 <code>https://api.github.com/gists/&#123;gistId&#125;</code>，
        带 <code>Authorization: Bearer &#123;token&#125;</code> 与 <code>X-GitHub-Api-Version: 2022-11-28</code>。
        推送用 <code>PATCH</code>，文件名 <code>all_configs.json</code>，内容经 Base64 编码；
        拉取时若 <code>truncated=true</code> 会从 <code>raw_url</code> 下载完整内容再解码。
      </p>

      <h3>Gitee 代码片段</h3>
      <p>同 GitHub Gist，但 token 在 Gitee 创建（私人令牌，勾选 <code>gists</code> 权限）。</p>
      <p>
        实现细节：<code>GiteeGistSyncRepository</code> 调 <code>https://gitee.com/api/v5/gists/&#123;gistId&#125;</code>，
        推送用 <code>PATCH</code> 并在 body 里带 <code>access_token</code>；拉取时把 token 拼到 URL query。
      </p>

      <h3>WebDAV</h3>
      <ol>
        <li>准备 WebDAV 服务器地址、用户名、密码（坚果云用应用密码，Nextcloud 用账号密码）。</li>
        <li>面板 <code>/sync</code> → 服务商 选 WebDAV，填三项。</li>
        <li>同步文件保存为你填写的 URL 对应路径。</li>
      </ol>
      <p>
        实现细节：<code>WebDavSyncRepository</code> 用 HTTP Basic 认证（<code>Credentials.basic(username, password)</code>）。
        若 URL 末段不含 <code>.</code>（即只给目录），会自动追加 <code>all_configs.json</code> 作为文件名；
        推送 <code>PUT</code>，拉取 <code>GET</code>，内容为明文 JSON。
      </p>

      <h3>网络链接</h3>
      <ol>
        <li>把一份 sync.json 放到任意一个可公开访问的 URL（GitHub raw / 自建 HTTP 服务）。</li>
        <li>面板 <code>/sync</code> → 服务商 选 网络链接，填 URL。</li>
        <li>TV 端点「拉取云端」即从此 URL 拉取（不能推送）。</li>
      </ol>
      <p>
        实现细节：<code>NetworkUrlSyncRepository.push()</code> 直接返回 <code>false</code>，<code>pull()</code> 用 <code>URL(url).readText()</code> 拉取并反序列化。
      </p>

      <h3>本地文件</h3>
      <ol>
        <li>面板 <code>/sync</code> → 服务商 选 本地文件，路径默认 <code>file:///storage/emulated/0/Download/</code>。</li>
        <li>推送时把 sync.json 写到该路径；拉取时从该路径读。</li>
        <li>把该文件拷贝到 U 盘 / 其他设备即可完成备份 / 迁移。</li>
      </ol>
      <p>
        实现细节：<code>LocalFileSyncRepository</code> 判断路径末段是否含 <code>.</code>：
        含则当作完整文件名，否则视为目录并追加 <code>all_configs.json</code>。
        推送 / 拉取都是普通文件读写（<code>File.writeText / readText</code>）。
      </p>

      <h2>6. 导入 / 导出应用数据</h2>
      <p>
        面板 <code>/sync</code> 提供「导入应用数据」「导出应用数据」两个跳转项：
      </p>
      <ul>
        <li>
          <b>导出</b>：调 <code>AppApi.getCloudSyncData()</code>（即 <code>CloudSync.getData()</code>）拿到当前 TV 的 CloudSyncData，
          下载为 JSON 文件，文件名形如 <code>客厅电视-v2.2.0.1-2026-08-05.json</code>。
        </li>
        <li>
          <b>导入</b>：弹出文件选择器（<code>accept=".json"</code>），读取本机 .json 文件，
          调 <code>AppApi.pushCloudSyncData()</code>（<code>POST /api/cloud-sync/data</code>）应用到 TV。
        </li>
      </ul>
      <p>
        这是<b>不依赖任何云端</b>的迁移方式：旧电视导出 → 新电视导入。
      </p>

      <h2>7. 与其他功能的联动</h2>
      <ul>
        <li><b>10591 面板</b>：云同步的账号字段都只能在面板编辑，TV 设置页只读。详见 <a [routerLink]="'/remote-panel'">远程配置面板</a>。</li>
        <li><b>订阅源</b>：<code>extraLocalIptvSourceList</code> 会把所有「本地文件」类型的订阅源内容一并同步，换机后无需重新拷贝 m3u 文件。详见 <a [routerLink]="'/sources'">订阅源</a>。</li>
        <li><b>频道别名</b>：<code>iptvChannelNameAlias</code> 随配置同步，多设备共享统一命名。</li>
        <li><b>系统备份</b>：<code>appBackupEnable</code> 默认开启，由 <code>MyTVBackupAgent</code> 接管 Android 系统备份；与云同步独立，互不影响。</li>
      </ul>
    </div>
  `,
})
export class SyncPage {}
