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
      <table>
        <thead>
          <tr><th>后端</th><th>拉取</th><th>推送</th><th>适用场景</th></tr>
        </thead>
        <tbody>
          <tr><td><b>GitHub Gist</b>（默认）</td><td>✓</td><td>✓</td><td>个人多设备同步，免费稳定。</td></tr>
          <tr><td><b>Gitee 代码片段</b></td><td>✓</td><td>✓</td><td>同 Gist，大陆访问更稳定。</td></tr>
          <tr><td><b>网络链接</b></td><td>✓</td><td>—</td><td>只读。从一个返回 sync.json 的 URL 拉配置，适合"管理员发配置、用户只拉"。</td></tr>
          <tr><td><b>本地文件</b></td><td>✓</td><td>✓</td><td>把 sync.json 写到 TV 本地路径（默认 <code>file:///storage/emulated/0/Download/</code>），适合无网环境或 U 盘备份。</td></tr>
          <tr><td><b>WebDAV</b></td><td>✓</td><td>✓</td><td>自建 NAS / Nextcloud / 坚果云用户。</td></tr>
        </tbody>
      </table>

      <h2>2. 同步哪些数据</h2>
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

      <h2>3. TV 应用内设置项（设置 → 云同步）</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>拉取云端 / 推送云端</td><td>—</td><td>顶部两个按钮，立即触发一次同步</td></tr>
          <tr><td>云端数据</td><td>—</td><td>显示最近一次拉到的版本、推送时间、推送设备、备注；<b>长按</b>重新应用云端数据</td></tr>
          <tr><td>自动拉取</td><td>关</td><td>开启后应用启动时自动拉取云端并应用</td></tr>
          <tr><td>系统备份</td><td>开</td><td>允许 Android 系统备份应用数据（设置、收藏等），换机时通过系统恢复</td></tr>
          <tr><td>云同步服务商</td><td>GitHub Gist</td><td>子页面选择五种后端；后端字段（id / token 等）在 TV 只读，编辑在面板</td></tr>
        </tbody>
      </table>

      <h2>4. 10591 面板（<code>/sync</code>）的全部可配置项</h2>
      <table>
        <thead>
          <tr><th>面板字段</th><th>类型</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>自动拉取</td><td>开关</td><td>同 TV</td></tr>
          <tr><td>服务商</td><td>按钮组</td><td>GitHub Gist / Gitee 代码片段 / 网络链接 / 本地文件 / WebDAV</td></tr>
          <tr><td>GitHub Gist ID / Token</td><td>文本框</td><td>仅服务商 = GITHUB_GIST 时显示</td></tr>
          <tr><td>Gitee 代码片段 ID / Token</td><td>文本框</td><td>仅服务商 = GITEE_GIST 时显示</td></tr>
          <tr><td>网络链接</td><td>文本框</td><td>仅服务商 = NETWORK_URL 时显示；占位 <code>https://example.com/sync</code></td></tr>
          <tr><td>本地文件路径</td><td>文本框</td><td>仅服务商 = LOCAL_FILE 时显示；默认 <code>file:///storage/emulated/0/Download/</code></td></tr>
          <tr><td>WebDAV URL / 用户名 / 密码</td><td>文本框</td><td>仅服务商 = WEBDAV 时显示</td></tr>
          <tr><td>推送</td><td>按钮</td><td>把当前面板的修改提交到 TV</td></tr>
          <tr><td>导入应用数据</td><td>跳转项</td><td>选择本机 .json 文件，调 <code>POST /api/cloud-sync/data</code> 应用</td></tr>
          <tr><td>导出应用数据</td><td>跳转项</td><td>下载 JSON，文件名 <code>&#123;syncFrom&#125;-v&#123;version&#125;-&#123;syncAt&#125;.json</code></td></tr>
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

      <h3>Gitee 代码片段</h3>
      <p>同 GitHub Gist，但 token 在 Gitee 创建（私人令牌，勾选 <code>gists</code> 权限）。</p>

      <h3>WebDAV</h3>
      <ol>
        <li>准备 WebDAV 服务器地址、用户名、密码（坚果云用应用密码，Nextcloud 用账号密码）。</li>
        <li>面板 <code>/sync</code> → 服务商 选 WebDAV，填三项。</li>
        <li>同步文件保存为你填写的 URL 对应路径。</li>
      </ol>

      <h3>网络链接</h3>
      <ol>
        <li>把一份 sync.json 放到任意一个可公开访问的 URL（GitHub raw / 自建 HTTP 服务）。</li>
        <li>面板 <code>/sync</code> → 服务商 选 网络链接，填 URL。</li>
        <li>TV 端点「拉取云端」即从此 URL 拉取（不能推送）。</li>
      </ol>

      <h3>本地文件</h3>
      <ol>
        <li>面板 <code>/sync</code> → 服务商 选 本地文件，路径默认 <code>file:///storage/emulated/0/Download/</code>。</li>
        <li>推送时把 sync.json 写到该路径；拉取时从该路径读。</li>
        <li>把该文件拷贝到 U 盘 / 其他设备即可完成备份 / 迁移。</li>
      </ol>

      <h2>6. 导入 / 导出应用数据</h2>
      <p>
        面板 <code>/sync</code> 提供「导入应用数据」「导出应用数据」两个跳转项：
      </p>
      <ul>
        <li><b>导出</b>：把当前 TV 的 CloudSyncData 下载为 JSON 文件，文件名形如 <code>客厅电视-v2.2.0.1-2026-08-05.json</code>。</li>
        <li><b>导入</b>：选择本机 .json 文件，调 <code>POST /api/cloud-sync/data</code> 应用到 TV。</li>
      </ul>
      <p>
        这是<b>不依赖任何云端</b>的迁移方式：旧电视导出 → 新电视导入。
      </p>

      <h2>7. 与其他功能的联动</h2>
      <ul>
        <li><b>10591 面板</b>：云同步的账号字段都只能在面板编辑，TV 设置页只读。详见 <a [routerLink]="'/remote-panel'">远程配置面板</a>。</li>
        <li><b>订阅源</b>：<code>extraLocalIptvSourceList</code> 会把所有「本地文件」类型的订阅源内容一并同步，换机后无需重新拷贝 m3u 文件。详见 <a [routerLink]="'/sources'">订阅源</a>。</li>
        <li><b>频道别名</b>：<code>extraChannelNameAlias</code> 同步别名文件，多设备共享统一命名。</li>
      </ul>
    </div>
  `,
})
export class SyncPage {}
