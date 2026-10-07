import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';
import { DocShot } from '../../shared/doc-shot';

@Component({
  selector: 'app-sync',
  imports: [DocPageHeader, DocCallout, DocShot, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="云同步与备份"
        lead="防止配置丢失、换机迁移、多台电视共享一份设置的三种做法——云同步、本地备份快照、导入导出 JSON，以及五种云同步服务商的配置步骤。"
      />

      <h2 id="three-ways">三种方式怎么选</h2>
      <p>
        后两种方式都在<b>远程配置面板</b>（下称面板，用浏览器打开 http://电视IP:10591，见
        <a [routerLink]="'/remote-panel'">远程配置面板</a>）上操作；云同步的凭据也只能在面板里填写。
      </p>
      <table>
        <thead>
          <tr><th>方式</th><th>数据放在哪</th><th>在哪操作</th><th>适合</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><b>云同步</b></td>
            <td>推送到 Gist、WebDAV 等云端，或本地文件</td>
            <td>电视端 设置 → 云同步 拉取 / 推送；凭据在面板的 云同步 页填</td>
            <td>多台电视长期共享同一份配置</td>
          </tr>
          <tr>
            <td><b>备份管理</b></td>
            <td>电视端本地快照</td>
            <td>面板的 备份管理 页创建 / 恢复 / 删除</td>
            <td>大改配置前留个还原点（恢复会覆盖当前数据，且需重启生效）</td>
          </tr>
          <tr>
            <td><b>导入导出 JSON</b></td>
            <td>一个 .json 文件，随你存放</td>
            <td>面板的 云同步 页底部</td>
            <td>换机一次性迁移，不依赖任何云端账号</td>
          </tr>
        </tbody>
      </table>
      <p>
        「云同步」与「导入导出」打包的内容范围相同（见下文「同步哪些内容」）；
        「备份管理」则是把电视端当前设置与数据原样封存，不做筛选。
      </p>

      <h2 id="cloud-sync">云同步</h2>
      <p>
        把订阅源、收藏和各项设置打包推送到云端；其他电视（或重装之后）拉取同一份数据即可恢复。
        电视端入口：<b>设置 → 云同步</b>。
      </p>
      <table>
        <thead>
          <tr><th>条目</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>拉取云端 / 推送云端</td>
            <td>页面顶部的两个按钮，按当前服务商的能力显示（「网络链接」只显示拉取）。推送成功后自动重新拉取、刷新显示。</td>
          </tr>
          <tr>
            <td>云端数据</td>
            <td>
              进入页面自动拉取一次，显示云端的<b>版本、推送时间、推送设备、备注</b>；拉取失败或从未推送过显示「无云端数据」。
              <b>长按该条目</b> = 把云端数据应用到本机（覆盖本机设置）。
            </td>
          </tr>
          <tr>
            <td>自动拉取</td>
            <td>默认关。开启后每次启动应用自动拉取云端数据并应用——多台设备共用配置时方便；注意启动时的应用会覆盖本机尚未推送的改动。</td>
          </tr>
          <tr>
            <td>系统备份</td>
            <td>默认开。允许 Android 系统级备份应用数据（设置、收藏等），换机或重装时由系统恢复；与云同步互不干扰，建议保持开启。</td>
          </tr>
          <tr>
            <td>云同步服务商</td>
            <td>进入子页选择，默认 GitHub Gist；每个服务商右侧标注是否支持拉取 / 推送。</td>
          </tr>
          <tr>
            <td>各服务商凭据</td>
            <td>选择服务商后页面下方显示对应凭据条目（Gist ID、Token、WebDAV 地址等）。电视端只读，统一在面板的 云同步 页填写。</td>
          </tr>
        </tbody>
      </table>
      <doc-shot
        src="screenshots/panel-sync.png"
        alt="网页面板云同步页：服务商与凭据"
        caption="面板 → 云同步页：先选服务商，再填对应凭据。凭据在电视端只读，只在这里填。"
      />

      <h2 id="sync-scope">同步哪些内容</h2>
      <p><b>同步</b>：</p>
      <ul>
        <li>订阅源列表——包括「文件」类型订阅源的文件内容，换机后不用重新拷贝 m3u 文件；</li>
        <li>自定义节目单配置；</li>
        <li>频道收藏、频道别名；</li>
        <li>界面、主题、控制、播放器、网络等各项设置；</li>
        <li>Python / PHP 服务的配置——但脚本文件本身不同步：远程来源的脚本可在新设备上用「立即更新脚本」重新拉取，本地脚本需在面板重新上传。</li>
      </ul>
      <p><b>不同步</b>（与设备解码能力、性能或本机状态相关，每台电视要单独设置）：</p>
      <ul>
        <li>播放器内核、强制软解、软解仅用于音频、Media3 隧道解码；</li>
        <li>视频超分、插帧、插帧目标帧率、AI 超分执行后端；</li>
        <li>WebView 内核与「替换系统 WebView」；</li>
        <li>实时字幕（ASR）的全部设置、已选识别模型、Gemini 凭据；</li>
        <li>字幕翻译引擎及腾讯 / 百度 / MTranServer 凭据；</li>
        <li>最近观看记录、当前选中的订阅源、最后播放位置；</li>
        <li>焦点优化开关、云同步服务商的选择与「自动拉取」开关。</li>
      </ul>

      <h2 id="providers">各服务商配置步骤</h2>
      <p>
        凭据一律在面板的 云同步 页填写（电视端只读），保存后到电视端 <b>设置 → 云同步 → 推送云端</b> 完成首次上传。
      </p>

      <h3 id="github-gist">GitHub Gist（默认）</h3>
      <ol>
        <li>创建 token：GitHub 网页 → 头像 → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token (classic)，勾选 <code>gist</code> 权限，生成后复制 token。</li>
        <li>新建 Gist：打开 gist.github.com，内容随意（如一行说明），选 <b>Create secret gist</b> 建私有 Gist；创建后地址栏网址的最后一段就是 Gist ID。</li>
        <li>面板的 云同步 页 → 服务商选 GitHub Gist，填 Gist ID 和 Token，点「推送」保存。</li>
        <li>电视端 设置 → 云同步 → 推送云端。之后这个 Gist 里会出现 <code>all_configs.json</code> 文件，就是同步数据。</li>
        <li>其他电视填同一个 Gist ID + Token，点「拉取云端」即可同步。</li>
      </ol>

      <h3 id="gitee">Gitee 代码片段</h3>
      <p>
        步骤与 GitHub Gist 相同：token 在 Gitee 网页 → 头像 → 设置 → 私人令牌 中生成，勾选 <code>gists</code> 权限；
        再新建一个私有代码片段，取网址最后一段作为 ID，面板里填 ID + Token。国内网络访问通常更稳定。
      </p>

      <h3 id="webdav">WebDAV</h3>
      <p>填三项：地址、用户名、密码。</p>
      <ul>
        <li><b>坚果云</b>：不能用登录密码——在坚果云网页「账户信息 → 安全选项 → 第三方应用管理」生成<b>应用密码</b>；地址形如 <code>https://dav.jianguoyun.com/dav/</code>。</li>
        <li><b>Nextcloud 及兼容服务</b>：地址形如 <code>https://服务器地址/remote.php/dav/files/用户名/</code>。</li>
        <li>地址只填到目录时，同步数据自动保存为该目录下的 <code>all_configs.json</code>。</li>
      </ul>

      <h3 id="local-file">本地文件</h3>
      <ul>
        <li>默认路径 <code>file:///storage/emulated/0/Download/</code>（电视的「下载」目录），同步数据保存为其中的 <code>all_configs.json</code>。</li>
        <li>路径可改到 U 盘等外部存储目录；把生成的 all_configs.json 拷到其他电视，即可离线迁移。</li>
        <li>需要先在 设置 → 权限 授予「读取外部存储/管理全部文件」。</li>
      </ul>

      <h3 id="network-url">网络链接</h3>
      <ul>
        <li><b>只支持拉取、不能推送</b>：填一个能直接下载到同步文件的网址（如别人分享的 all_configs.json 直链）。</li>
        <li>适合「家人或群主发布一份配置、大家只管用」的场景；本机的改动不会上传。</li>
      </ul>

      <doc-callout kind="warn" title="安全提示" icon="warning">
        Gist / 代码片段务必建<b>私有</b>的——公开 Gist 任何人都能看到你的订阅源地址等全部配置。
        token 就是账号钥匙，不要泄露，怀疑泄露立刻到 GitHub / Gitee 吊销后重建。
        WebDAV 密码等同于网盘密码，坚果云务必用「应用密码」而不是登录密码。
      </doc-callout>

      <h2 id="backup">备份管理（本地快照）</h2>
      <p>
        面板的 <b>备份管理</b> 页在电视端本机创建数据快照（设置与数据原样封存），适合大改配置前留个还原点。
      </p>
      <ul>
        <li><b>创建备份</b>：输入名称（可用字母、数字、点、下划线、中划线）→ 创建备份；列表显示每个快照的名称、时间、大小。</li>
        <li><b>恢复</b>：二次确认后用快照<b>覆盖电视端当前全部设置与数据</b>，完成后需重启应用才完全生效。</li>
        <li><b>删除</b>：二次确认后删除。</li>
      </ul>
      <p>快照只保存在电视端本机，不上传云端；卸载应用会一并删除，重要快照建议配合「导出应用数据」存档。</p>

      <h2 id="import-export">导入导出 JSON</h2>
      <p>在面板的 云同步 页底部：</p>
      <ul>
        <li><b>导出应用数据</b>：把电视端当前的同步数据整包下载为 .json 文件（文件名带设备名、版本与时间），自己存档。</li>
        <li><b>导入应用数据</b>：选择之前导出的 .json 文件，推送到电视端并立即应用。</li>
      </ul>
      <p>这是不依赖任何云端账号的迁移方式：旧电视导出 → 新电视导入。</p>
    </div>
  `,
})
export class SyncPage {}
