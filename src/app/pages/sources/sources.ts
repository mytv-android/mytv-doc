import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';

@Component({
  selector: 'app-sources',
  imports: [DocPageHeader, DocCallout, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="订阅源（IPTV / 混合源）"
        lead="订阅源决定你能看哪些频道。本页介绍各类源的写法与添加方式、电视端和面板上的管理操作、缓存与刷新、回看、网页源与混合模式，以及 m3u 常见字段的含义。"
      />

      <h2 id="types">订阅源类型</h2>
      <p>
        订阅源就是一份频道清单，里面写着每个频道的分组和一条或多条<b>线路</b>（播放地址）。
        添加时按类型填写对应信息即可，其余留默认：
      </p>
      <table>
        <thead>
          <tr><th>类型</th><th>是什么</th><th>必填项</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><b>网络 m3u / txt</b></td>
            <td>
              最常见的直播源文件，m3u 与 txt 两种写法都支持，按内容自动识别；<code>.gz</code> 压缩包自动解压。
              放在 FTP / SMB / WebDAV 服务器上的源也可以，地址带 <code>ftp://</code>、<code>smb://</code>、<code>webdav://</code> 等前缀即可。
            </td>
            <td>
              链接。FTP / SMB / WebDAV 源还需账号密码：可直接写进链接（如 <code>ftp://用户名:密码@主机/路径</code>），
              也可在面板按「协议、端口、账号、密码」字段分开填。
            </td>
          </tr>
          <tr>
            <td><b>Xtream Codes</b></td>
            <td>服务商发的账号式源，App 会自动拼好取数地址，不用自己拼链接。</td>
            <td>服务器地址、用户名、密码、输出类型（<code>m3u_plus</code> 或 <code>m3u</code>）</td>
          </tr>
          <tr>
            <td><b>Stalker Portal</b></td>
            <td>机顶盒式门户源。</td>
            <td>服务器地址、MAC 地址（服务商提供）</td>
          </tr>
          <tr>
            <td><b>本地文件</b></td>
            <td>
              电视本机上的 m3u / txt 文件。需要先在 设置 → 权限 中授予「读取外部存储/管理全部文件」。
            </td>
            <td>文件路径</td>
          </tr>
          <tr>
            <td><b>直接粘贴内容</b></td>
            <td>
              在面板首页「订阅源」卡片选择「本地上传」，可直接挑选电脑 / 手机上的 <code>.m3u</code> / <code>.m3u8</code> / <code>.txt</code> 文件，
              或把内容整段粘贴进去；推送后 App 会把它存成电视上的本地文件来使用。
            </td>
            <td>文件或粘贴的内容</td>
          </tr>
          <tr>
            <td><b>聚合配置</b></td>
            <td>把多个已有订阅源合并成一个用，同名频道自动变成多条线路。见下文「聚合配置」。</td>
            <td>至少勾选一个已有订阅源</td>
          </tr>
        </tbody>
      </table>
      <doc-callout kind="warn" title="关于内置演示源" icon="warning">
        新装 App 自带的演示源仅供体验，可用性不保证。请自行准备合法的订阅源。
      </doc-callout>
      <doc-callout kind="tip" title="运营商组播 / RTSP 源要先转成 HTTP" icon="router">
        运营商的组播（<code>rtp://</code>、<code>udp://</code>）和 RTSP 单播地址通常只有拿到 IPTV 内网 IP 的设备才收得到，
        需要在路由器 / NAS 上用 rtp2httpd 之类的工具先转成 HTTP 单播，再把转好的播放列表添加进来。
        详见 <a [routerLink]="'/rtp2httpd'">配合 rtp2httpd 使用</a>。
      </doc-callout>

      <h2 id="add-manage">添加与管理</h2>

      <h3 id="add">添加订阅源</h3>
      <p>电视上打字不便，添加订阅源一律通过扫码在远程配置面板（下称面板）里完成：</p>
      <ol>
        <li>电视端打开 <b>设置 → 订阅源 → 自定义订阅源</b>，点底部「添加其他订阅源」，屏幕弹出二维码和地址。</li>
        <li>用手机 / 电脑扫码（或在浏览器输入该地址）打开面板。面板的打开方式详见 <a [routerLink]="'/remote-panel'">远程配置面板</a>。</li>
        <li>在面板首页「订阅源」卡片填好名称与链接（Xtream、Stalker、FTP 等类型会多出对应字段），点「推送订阅源」；也可以到面板的 订阅源 页点「新增」，用完整对话框添加。</li>
        <li>回到电视，列表里就能看到新源，点按它选「设为当前」即开始使用。</li>
      </ol>

      <h3 id="manage-tv">电视端管理（设置 → 订阅源 → 自定义订阅源）</h3>
      <ul>
        <li>列表每条显示：名称、类型标签（本地 / Xtream / Stalker / 聚合）、单源 UA、分组数 / 频道数、缓存大小与更新时间。</li>
        <li><b>点按某条</b>弹出操作：设为当前、删除、清除缓存；聚合条目另有「编辑聚合配置」。</li>
        <li>页面顶部「<b>刷新全部</b>」：无视缓存时间，立即重新下载所有订阅源。</li>
        <li>页面底部「<b>添加聚合配置</b>」：不扫码，直接在电视上勾选已有源进行合并，见下文「聚合配置」。</li>
      </ul>

      <h3 id="manage-panel">面板订阅源页</h3>
      <p>
        面板的 订阅源 页比电视端功能更全：单选钮切换当前源，每行菜单可<b>上移 / 下移排序</b>、编辑、删除。
        「新增 / 编辑订阅源」对话框的字段一览：
      </p>
      <table>
        <thead>
          <tr><th>字段</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>名称 / 类型 / 链接</td><td>基本信息；类型为「文件」时链接处填电视上的文件路径</td></tr>
          <tr><td>协议、端口、账号、密码</td><td>远程源选择 FTP / SMB / WebDAV 类协议时出现；地址里已带前缀和账号时可留空</td></tr>
          <tr><td>用户名 / 密码 / 输出类型</td><td>仅 Xtream 类型</td></tr>
          <tr><td>MAC 地址</td><td>仅 Stalker 类型</td></tr>
          <tr><td>UA</td><td>按源单独设置 User-Agent：拉取该源时使用；频道没单独指定 UA 时播放也沿用</td></tr>
          <tr><td>代理</td><td>按源单独设置代理，填 <code>http://</code> 或 <code>socks5://</code> 地址，可带账号密码</td></tr>
          <tr><td>EPG 地址</td><td>给这个源单独指定节目单，配合节目单的「跟随订阅源」使用，见 <a [routerLink]="'/epg'">EPG 节目单</a></td></tr>
          <tr><td>自动刷新</td><td>单位小时，0 = 关闭（默认）。设为大于 0 后，该源在使用期间每隔这么久在后台静默重新下载一次，不打断播放</td></tr>
          <tr><td>关闭预览图 / 关闭延迟检测</td><td>该源使用中时不抓频道预览首帧、不给线路测延迟，适合响应慢或对频繁探测敏感的源</td></tr>
          <tr><td>转换 JS</td><td>源作者向能力：下载后先用一段脚本加工频道列表。普通用户留空即可</td></tr>
          <tr><td>文件内容</td><td>仅本地文件类型：直接在面板里查看、修改电视上的源文件内容</td></tr>
        </tbody>
      </table>

      <h3 id="cache">缓存时间与刷新</h3>
      <table>
        <thead>
          <tr><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>设置 → 订阅源 → 订阅源缓存时间</td>
            <td>可选 不缓存 / 1～23 小时 / 1～15 天 / 永久，默认 <b>1 小时</b>。缓存没过期时直接用缓存，启动快；过期后重新下载，下载失败时回落到旧缓存。本地文件源没有过期一说</td>
          </tr>
          <tr>
            <td>面板的 订阅源 页 → 订阅源缓存时间</td><td>同一项，按小时填，0 = 不缓存</td>
          </tr>
        </tbody>
      </table>
      <doc-callout kind="tip" title="源的内容变了，电视上还是旧的？" icon="lightbulb">
        先在「自定义订阅源」页点顶部「刷新全部」；还不行就对那条源执行「清除缓存」再刷新。
        依然不变多半是源本身没更新或已失效，需要联系源作者或换源。
      </doc-callout>

      <h2 id="aggregation">聚合配置（多源合并）</h2>
      <p>
        <b>聚合配置</b>把多个已有订阅源合成一个：同名频道自动归并为一个频道的多条线路，
        播放时一条线路播不出来会自动切到下一条，逐条尝试到底。
      </p>
      <ul>
        <li><b>创建</b>：电视端 设置 → 订阅源 → 自定义订阅源 → 「添加聚合配置」，输入名称并勾选要合并的源，保存后自动设为当前；<b>勾选顺序就是线路优先级</b>。面板上在订阅源编辑对话框把类型选为「聚合配置」再勾选成员，效果相同。</li>
        <li><b>编辑</b>：电视端点按聚合条目 →「编辑聚合配置」；面板直接点编辑。增删成员、调整顺序都在这里。</li>
        <li><b>活引用</b>：聚合存的是对成员源的引用——面板里改了成员地址自动生效，成员被删除后自动剔除；成员源仍可单独使用，也可同时被多个聚合引用。聚合不能再套聚合。</li>
        <li><b>容错</b>：某个成员加载失败时用它的旧缓存，没有缓存就跳过；全部成员都失败才报错。</li>
        <li><b>缓存</b>：对聚合执行「清除缓存」会清空全部成员源的缓存；「刷新全部」连同成员一起刷新。</li>
      </ul>

      <h2 id="m3u-fields">m3u 里的常见字段</h2>
      <p>
        m3u 源里每个频道都可以带一些附加信息。<b>这些由源作者提供，App 会自动识别，不需要你动手</b>；
        了解含义有助于挑源和排查问题：
      </p>
      <table>
        <thead>
          <tr><th>字段</th><th>作用</th></tr>
        </thead>
        <tbody>
          <tr><td><code>tvg-id</code> / <code>tvg-name</code></td><td>频道在节目单里的身份。节目单靠它把节目对到频道上，对不上就看不到节目信息，见 <a [routerLink]="'/epg'">EPG 节目单</a></td></tr>
          <tr><td><code>tvg-logo</code></td><td>台标图片地址</td></tr>
          <tr><td><code>tvg-chno</code></td><td>频道号。遥控器数字选台优先按它匹配，见 <a [routerLink]="'/controls'">遥控器与触屏操作</a></td></tr>
          <tr><td><code>group-title</code></td><td>分组名，频道按它归入各个分组</td></tr>
          <tr><td><code>catchup</code> / <code>catchup-source</code></td><td>回看支持标记与回看地址，决定这条线路能不能回看，见下文「回看（时移）」</td></tr>
          <tr><td><code>http-user-agent</code> / <code>http-referrer</code></td><td>防盗链请求头。有的服务器会检查这些信息，对了才放行</td></tr>
        </tbody>
      </table>
      <p>
        txt 源的写法更简单：一行「<code>分组,#genre#</code>」声明分组，下面每行「<code>频道名,地址</code>」，
        同一频道的多个地址用 <code>#</code> 分隔，即多条线路。
      </p>

      <h2 id="catchup">回看（时移）</h2>
      <p>哪些线路能回看：</p>
      <ul>
        <li>源里带 <code>catchup</code> 参数的线路；</li>
        <li>运营商的 PLTV 线路——「<b>PLTV转TVOD</b>」开关（设置 → 订阅源，默认开）会自动把这类地址转换成可回看的形式，一般无需理会。</li>
      </ul>
      <p>怎么看回看：</p>
      <ol>
        <li>打开节目单（直播界面按 GUIDE 键，或长按左键），找到已播出的节目；</li>
        <li>按 OK 即开始回看。选台界面和节目单指南页里操作相同，详见 <a [routerLink]="'/epg'">EPG 节目单</a>。</li>
      </ol>
      <p>
        直播画面中按快退键可沿当前节目的时间轴回退（时移），最多回退 48 小时；回看时左下角会显示「回放」标志。
        相关操作与设置见 <a [routerLink]="'/live-screen'">直播主界面</a> 与 <a [routerLink]="'/player-settings'">播放器与字幕设置</a>。
      </p>

      <h2 id="url-prefix">URL 前缀（混合源线路）</h2>
      <p>有些源里的线路地址带特殊前缀，表示这条线路不走普通播放器：</p>
      <table>
        <thead>
          <tr><th>前缀</th><th>含义</th></tr>
        </thead>
        <tbody>
          <tr><td><code>webview://</code>、<code>video://</code></td><td>走网页播放：App 用内置浏览器内核打开页面、取出其中的视频流。央视频、各卫视官网的线路都是这种，详见 <a [routerLink]="'/webview-player'">WebView 播放器</a></td></tr>
          <tr><td><code>javascript://</code></td><td>源作者写的脚本线路，播放前实时计算出真实地址</td></tr>
        </tbody>
      </table>
      <p>普通用户只需知道：这些线路来自网页，加载通常比直接流慢一些；能不能用完全取决于源作者。</p>

      <h2 id="hybrid">自动添加网页源（混合模式）</h2>
      <p>
        开启后，App 自动为订阅源里对得上的频道附加官网网页线路——央视网、央视频，以及北京、江苏、浙江、湖南等各卫视官网。
        源内线路失效时多一条兜底。
      </p>
      <table>
        <thead>
          <tr><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>设置 → 订阅源 → 自动添加网页源</td>
            <td>三选一：<b>禁用</b> / <b>订阅源优先</b>（默认，网页线路排在源内线路之后）/ <b>网页源优先</b>（网页线路排在前）</td>
          </tr>
          <tr>
            <td>设置 → 订阅源 → 网页源央视频Cookie</td>
            <td>
              央视频的付费频道需要登录才能看：用浏览器登录央视频官网后复制全部 Cookie，粘贴到面板的「网页源央视频 Cookie」。
              电视端这一项只读显示，只能在面板改。看不了付费频道时的排查见 <a [routerLink]="'/faq'">常见问题</a>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        附加的网页线路走 WebView 播放（见 <a [routerLink]="'/webview-player'">WebView 播放器</a>），
        换台信息条上会带「央视网」「央视频」「官网」来源标签。
      </p>

      <h2 id="channel-rules">频道层面的规则</h2>
      <p>
        以下设置都在 设置 → 订阅源 里，管的是「源解析出来的频道怎么显示」。详细用法见
        <a [routerLink]="'/channels'">频道、收藏与搜索</a>，这里只列个大概：
      </p>
      <ul>
        <li><b>分类隐藏</b>：按分组整组隐藏 / 恢复。</li>
        <li><b>隐藏频道规则</b>：频道名命中规则的（如含「测试」）不进列表。</li>
        <li><b>支持加密频道组</b>：分组名以 <code>_数字</code> 结尾的分组要输密码才能进入，默认关。</li>
        <li><b>频道别名 + 相似频道合并</b>（默认开）：把不同写法的同名频道合并成一个频道的多条线路。</li>
        <li><b>频道图标提供 / 覆盖</b>（默认开）：用在线台标模板统一补台标，并覆盖源内自带台标。</li>
      </ul>

      <h2 id="group-params">分组级参数</h2>
      <p>
        「设置 → 订阅源 → 分组级参数」（默认开）允许源作者在源里按分组指定播放参数——
        比如某个分组用什么解码方式、带什么请求头。
      </p>
      <p>
        普通用户不需要任何操作；只有当你用的源在说明里提到「分组级参数」时，
        知道有这回事、确认开关是开的即可。关闭后，源里的分组级参数全部不生效。
      </p>
    </div>
  `,
})
export class SourcesPage {}
