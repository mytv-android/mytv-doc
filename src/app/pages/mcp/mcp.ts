import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';

@Component({
  selector: 'app-mcp',
  imports: [DocPageHeader, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="AI 助手（MCP）"
        lead="让 Claude Code、Cursor、Cherry Studio 这类支持 MCP 的 AI 助手直接读取电视正在播什么、换台、回看往期节目——用中文说一句就行，不用再找遥控器。"
      />

      <h2 id="what">这是什么</h2>
      <p>
        应用在网页面板同一个端口（默认 <b>10591</b>）上新开了一个 <code>/mcp</code> 端点，按 MCP（Model Context Protocol）
        的标准协议把电视的播放能力暴露给 AI 助手：读状态、查频道、查节目单、换台、换线路、切订阅源、跳转进度、回看节目、暂停。
        AI 助手在自己的对话里调用这些工具，电视上画面随之变化。
      </p>
      <p>
        它和<a [routerLink]="'/remote-panel'">远程配置面板</a>是两个入口：面板是给人点的网页，<code>/mcp</code> 是给 AI 调用的接口。
        两者共用同一个端口和前台服务，只是 <code>/mcp</code> 多了一道令牌校验。
      </p>

      <h2 id="enable">开启步骤</h2>
      <ol>
        <li>电视上打开 <b>设置 → 投屏与扩展 → AI 助手（MCP）</b>。</li>
        <li>打开「允许 AI 助手连接」。第一次开启会自动生成一串<b>访问令牌</b>。</li>
        <li>同屏能看到<b>连接地址</b>，形如 <code>http://192.168.1.10:10591/mcp</code>；手机或电脑要与电视在<b>同一局域网</b>。</li>
        <li>把地址和令牌填进 AI 助手（见下方「客户端接入」）。</li>
      </ol>
      <p>
        也可以在网页面板的「投屏与扩展」页改这几项，并直接复制一份客户端配置 JSON。
        权限级别、电视端提示都能在两边改，改完立即生效。
      </p>

      <h2 id="levels">权限级别</h2>
      <p>工具按三档开放，级别越高包含的越多。<code>tools/list</code> 只列出当前级别能用的工具。</p>
      <table>
        <thead>
          <tr><th>级别</th><th>能做什么</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><b>只读</b></td>
            <td>看播放状态、频道分组、搜索频道、频道节目单、订阅源列表。</td>
          </tr>
          <tr>
            <td><b>播放控制</b>（默认）</td>
            <td>只读的全部，加上换台、换线路、切换订阅源、跳转进度、回看节目、回到直播、播放/暂停。</td>
          </tr>
          <tr>
            <td><b>管理</b></td>
            <td>播放控制的全部，加上读写设置（仅播放 / 显示 / 节目单类白名单键）、添加订阅源、刷新数据、读运行日志。</td>
          </tr>
        </tbody>
      </table>
      <p>
        下文「工具清单」里标了每个工具的级别。不需要 AI 动手时，把级别压到「只读」最稳妥。
      </p>

      <h2 id="client">客户端接入</h2>
      <p>令牌放在请求头 <code>Authorization: Bearer &lt;令牌&gt;</code> 里，下面三种写法任选。</p>

      <h3 id="claude-code">Claude Code（原生支持 HTTP 传输）</h3>
      <p>在终端执行（地址与令牌换成电视上显示的）：</p>
      <pre><code>claude mcp add --transport http mytv http://192.168.1.10:10591/mcp \
  --header "Authorization: Bearer &lt;令牌&gt;"</code></pre>

      <h3 id="streamable">Cursor、Cherry Studio 等支持 Streamable HTTP 的客户端</h3>
      <p>在客户端的 MCP 配置里加一项（令牌换成电视上显示的）：</p>
      <pre><code>&#123;"mcpServers": &#123;"mytv": &#123;
  "url": "http://192.168.1.10:10591/mcp",
  "headers": &#123;"Authorization": "Bearer 令牌"&#125;
&#125;&#125;&#125;</code></pre>
      <p>网页面板的「投屏与扩展」页有一键复制按钮，会自动填好当前设备的地址与令牌。</p>

      <h3 id="stdio">只支持 stdio 的客户端（如 Claude Desktop）</h3>
      <p>用 <code>mcp-remote</code> 转接：局域网 HTTP 要加 <code>--allow-http</code>；Windows 上参数里的空格会被拆坏，所以令牌放进环境变量 <code>AUTH_HEADER</code>（值形如 <code>Bearer 令牌</code>），参数里写 <code>Authorization:$AUTH_HEADER</code>，冒号两边不留空格。</p>
      <pre><code>&#123;"mcpServers": &#123;"mytv": &#123;
  "command": "npx",
  "args": ["-y", "mcp-remote", "http://192.168.1.10:10591/mcp", "--allow-http",
           "--header", "Authorization:$AUTH_HEADER"],
  "env": &#123;"AUTH_HEADER": "Bearer 令牌"&#125;
&#125;&#125;&#125;</code></pre>

      <h2 id="tools">工具清单</h2>
      <table>
        <thead>
          <tr><th>工具</th><th>级别</th><th>作用</th></tr>
        </thead>
        <tbody>
          <tr><td><code>get_player_status</code></td><td>只读</td><td>当前频道、现在与下一档节目、播放位置（时移 / 回看 / 点播）、分辨率与码率；<code>now</code> 字段是电视当前时间。</td></tr>
          <tr><td><code>list_channel_groups</code></td><td>只读</td><td>频道分组与每组数量。</td></tr>
          <tr><td><code>search_channels</code></td><td>只读</td><td>按名称 / 频道号搜索，或列收藏、最近观看；每条带当前节目。</td></tr>
          <tr><td><code>get_epg</code></td><td>只读</td><td>节目单：默认当前频道、从正在播的节目开始；标出能否回看、是否已预约。</td></tr>
          <tr><td><code>list_sources</code></td><td>只读</td><td>订阅源名称与序号（不含 URL 与凭据）。</td></tr>
          <tr><td><code>change_channel</code></td><td>播放控制</td><td>按名称 / 别名 / 频道号换台，或按顺序换下一个 / 上一个。</td></tr>
          <tr><td><code>switch_line</code></td><td>播放控制</td><td>换当前频道的线路，与遥控换线同一逻辑。</td></tr>
          <tr><td><code>switch_source</code></td><td>播放控制</td><td>切换订阅源，与经典选台面板换源同一入口。</td></tr>
          <tr><td><code>seek</code></td><td>播放控制</td><td>跳转进度：相对秒数、点播绝对秒数、或墙钟时间。</td></tr>
          <tr><td><code>play_programme</code></td><td>播放控制</td><td>回看某个频道的往期节目。</td></tr>
          <tr><td><code>back_to_live</code></td><td>播放控制</td><td>从时移 / 回看回到直播。</td></tr>
          <tr><td><code>playback_control</code></td><td>播放控制</td><td>播放、暂停、切倍速。</td></tr>
          <tr><td><code>get_settings</code> / <code>update_settings</code></td><td>管理</td><td>读写设置，凭据类字段脱敏，写入只接受白名单键。</td></tr>
          <tr><td><code>add_source</code></td><td>管理</td><td>添加网络订阅源或节目单地址。</td></tr>
          <tr><td><code>refresh_data</code></td><td>管理</td><td>刷新频道表或节目单。</td></tr>
          <tr><td><code>get_logs</code></td><td>管理</td><td>读应用内置运行日志（不含 logcat 原文）。</td></tr>
        </tbody>
      </table>
      <p>换台等命令默认会等到开始播放或报错再返回，AI 能直接告诉你「这个台放不出来，要不要换线路」。</p>

      <h2 id="examples">可以这么说</h2>
      <ul>
        <li>「换到 CCTV-5」——AI 先 <code>search_channels</code> 确认频道，再 <code>change_channel</code>；名称不唯一时会把候选列出来让你选。</li>
        <li>「今晚湖南卫视放什么」——<code>get_epg</code>，默认从正在播的节目开始。</li>
        <li>「回看昨晚 8 点的新闻联播」——<code>get_epg</code> 找到节目，再用 <code>play_programme</code>。</li>
        <li>「往回倒 5 分钟」——直播可时移时 <code>seek</code> 用负数 <code>offset_sec</code>；再往前越过当前时刻就回到直播。</li>
      </ul>

      <h2 id="notice">电视端提示</h2>
      <p>
        「操作时在电视上提示」默认打开：AI 换台、切源、回看时，电视上会弹一条「AI 助手：已切换到 CCTV-5」。
        家里人在看的时候不会莫名其妙被换台。关系不大的场合可以关掉。
      </p>

      <h2 id="safety">安全须知</h2>
      <ul>
        <li><b>令牌</b>泄露（发到群里、截图里露出来）后，在设置页或面板点「重置」，旧令牌立即失效，客户端要重新填。</li>
        <li>令牌只防<b>网页脚本借你的浏览器偷调</b>和<b>端口被误映射到公网</b>。网页面板的 <code>/api/*</code> 本身没有密码，
          同一局域网里能打开面板的人同样能改配置，所以请只在可信网络使用，不要把 10591 映射到公网。</li>
        <li>文件读写、APK 安装、备份恢复、云同步数据、Python / PHP / JS 服务代码、logcat 原文<b>永不</b>对 AI 开放——
          这些要么等于任意代码执行，要么会覆盖整机配置。</li>
        <li>管理级的设置写入只认播放 / 显示 / 节目单类白名单键，凭据、远程配置、服务类键会被拒绝。</li>
      </ul>

      <h2 id="faq">常见问题</h2>
      <h3 id="faq-ip">换了网络，地址变了</h3>
      <p>地址里的 IP 由路由器分配。重开设置页或面板看新地址，客户端配置里改一下即可。</p>
      <h3 id="faq-player-off">AI 说「电视端未在直播页」</h3>
      <p>播放器没在运行时读不到频道和节目单。让 AI 先调用 <code>change_channel</code> 把播放器拉起来，或直接在电视上打开播放页。</p>
      <h3 id="faq-overlay">冷启动一直超时</h3>
      <p>
        播放器没在前台时，AI 换台要从后台拉起播放页，Android 10 及以上需要「显示在其他应用上层」权限——
        和投屏接收是同一个前提。去 <b>设置 → 应用与系统 → 权限</b> 授权后重试。
      </p>
      <h3 id="faq-401">客户端报 401 / 403</h3>
      <p>
        401 是令牌不对或没带：检查 <code>Authorization: Bearer 令牌</code> 的写法（冒号后一个空格）。
        403 是请求带了非本机的 <code>Origin</code> 头：多半是浏览器里的跨站脚本在调，正常客户端不会这样。
      </p>
      <h3 id="faq-off">怎么彻底关掉</h3>
      <p>把「允许 AI 助手连接」关掉，<code>/mcp</code> 直接回 404，网页面板不受影响。</p>
    </div>
  `,
})
export class McpPage {}
