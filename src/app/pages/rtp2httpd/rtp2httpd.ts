import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';
import { DocShot } from '../../shared/doc-shot';

@Component({
  selector: 'app-rtp2httpd',
  imports: [DocPageHeader, DocCallout, DocShot, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="配合 rtp2httpd 使用"
        lead="rtp2httpd 是在路由器 / NAS 上把运营商 IPTV 的组播 RTP、RTSP 单播转成 HTTP 单播的开源工具。本页说明怎么把它的播放列表接进电视直播，以及两边各有哪些推荐设置。"
      />

      <h2 id="why">为什么要先用 rtp2httpd 转一道</h2>
      <p>
        运营商 IPTV 的频道大多是<b>组播</b>地址（<code>rtp://239.x.x.x:5140</code>），
        或者需要 IPTV 内网鉴权的 <b>RTSP 单播</b>地址，一般只有拿到了 IPTV 内网 IP 的设备才收得到，
        而电视、手机连的是普通家庭网络。
      </p>
      <p>
        rtp2httpd 在能接入 IPTV 网络的路由器（或 NAS、软路由）上把这些流转成普通的 HTTP 单播地址，
        家里任何设备都能看，而且<b>转一路、多台设备同时看</b>。它完全兼容 udpxy 的地址格式，
        原来用 udpxy / msd_lite 的地址可以直接搬过来。
      </p>
      <p>
        对本 App 来说，rtp2httpd 转出来的就是普通的 HTTP 源，按
        <a [routerLink]="'/sources'">订阅源</a> 的常规做法添加即可。
        FCC 快速换台、时移回看、视频快照这些能力都由 rtp2httpd 提供，通过播放列表里的参数和地址生效；
        App 侧不用配置服务端相关的东西，只要按下面的「推荐设置」把几个播放选项调好，
        就能把这些能力用足。
      </p>
      <doc-callout kind="info" title="服务端怎么装、怎么配" icon="menu_book">
        安装（OpenWrt 一键脚本 / Docker / 静态二进制）、IPTV 网络融合、抓包、FCC 服务器地址等细节，
        都以 <a href="https://rtp2httpd.com/guide/quick-start" target="_blank" rel="noopener">rtp2httpd 官方文档</a> 为准，
        本页只写与本 App 相关的一侧。
      </doc-callout>

      <h2 id="source">把它的播放列表接进 App</h2>
      <h3 id="by-playlist">方式一：直接用它生成的播放列表（推荐）</h3>
      <p>
        在 rtp2httpd 里配置好外部 M3U（<code>external-m3u</code>）或内联频道清单后，
        它会提供一个转换好的播放列表地址。把它当作普通的「网络 m3u」源添加：
      </p>
      <pre><code>http://路由器IP:5140/playlist.m3u</code></pre>
      <p>用这个地址的好处：</p>
      <ul>
        <li>频道地址里的 IP、端口、认证信息都被替换成 rtp2httpd 自己的地址，换路由器不用重新找源；</li>
        <li>节目单地址（<code>x-tvg-url</code>）也被一并代理，频道和节目单一起更新；</li>
        <li>源里写好的 FCC、时移回看参数原样保留。</li>
      </ul>

      <h3 id="by-hand">方式二：自己写 m3u，线路直接写 rtp2httpd 的地址</h3>
      <p>地址格式是「服务器地址 + 协议前缀 + 上游地址」：</p>
      <ul>
        <li><code>/rtp/组播地址:端口</code>、<code>/udp/组播地址:端口</code> —— 两者完全等价，选一个就行；</li>
        <li><code>/rtsp/RTSP服务器:端口/路径</code> —— RTSP 单播与时移回看；</li>
        <li><code>/http/上游服务器/路径</code> —— 代理内网的 HTTP / HLS 源。</li>
      </ul>
      <pre><code>#EXTM3U
#EXTINF:-1 group-title="央视",CCTV-1
http://192.168.1.1:5140/rtp/239.253.64.120:5140

#EXTINF:-1 group-title="卫视",广东卫视
http://192.168.1.1:5140/rtp/239.253.64.96:5140$超高清
http://192.168.1.1:5140/rtp/239.253.64.200:5140$高清</code></pre>
      <p>
        一个频道写多行地址就是多条线路，地址末尾的 <code>$标签</code> 会显示成线路名（如「超高清」「高清」），
        和别的源写法一致，详见 <a [routerLink]="'/sources'">订阅源</a>。
      </p>

      <h2 id="app-settings">推荐设置（App 侧）</h2>
      <table>
        <thead>
          <tr><th>设置项</th><th>位置</th><th>建议</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>全局UA</td>
            <td>面板 → 播放器</td>
            <td>加上 <code>TZ/UTC+8</code></td>
            <td>
              rtp2httpd 从 UA 里找 <code>TZ/</code> 标记来判断客户端时区，没写就按 UTC 算，
              回看时间会差 8 小时。电视端 设置 → 播放器 → 全局UA 也能改，见下文「时移回看」
            </td>
          </tr>
          <tr>
            <td>关闭延迟检测</td>
            <td>面板 → 订阅源 → 编辑该源</td>
            <td>打开</td>
            <td>线路延迟检测会对每条线路发一次请求，服务端随后就要为它拉一路流，平白占掉一个客户端名额</td>
          </tr>
          <tr>
            <td>频道预览</td>
            <td>设置 → 界面</td>
            <td>服务端开了视频快照再开，否则建议关</td>
            <td>开了快照时预览首帧直接拿一张 JPEG；没开时 App 只能自己拉流解码取帧，慢且费流量，见下文「频道预览图」</td>
          </tr>
          <tr>
            <td>频道预览并行数</td>
            <td>设置 → 界面</td>
            <td>保持默认 1；服务端是 x86 强机可调大</td>
            <td>每个预览请求都会让服务端跑一次转码取帧</td>
          </tr>
          <tr>
            <td>视频播放器内核</td>
            <td>设置 → 播放器</td>
            <td>Media3（默认）</td>
            <td>rtp2httpd 出来的是标准 HTTP MPEG-TS 流，默认内核即可，遇到花屏等再考虑换内核</td>
          </tr>
          <tr>
            <td>更好的视频探测</td>
            <td>设置 → 播放器</td>
            <td>用 FCC 快速换台时关闭</td>
            <td>开着会花更多时间探测视频格式，拖慢起播，把 FCC 省下的时间又还回去</td>
          </tr>
          <tr>
            <td>播放缓冲</td>
            <td>设置 → 播放器</td>
            <td>0～1 秒</td>
            <td>缓冲越小起播越快；网络确实丢包严重时再往上调，代价是起播变慢</td>
          </tr>
          <tr>
            <td>停滞重试</td>
            <td>设置 → 播放器</td>
            <td>默认关；网络不稳时可开 8～15 秒</td>
            <td>播放位置长时间不动时自动重试当前线路</td>
          </tr>
          <tr>
            <td>代理</td>
            <td>面板 → 播放器</td>
            <td>留空</td>
            <td>rtp2httpd 就在局域网里，直连即可；填了反而让流量绕一圈，见 <a [routerLink]="'/player-settings'">播放器与字幕</a></td>
          </tr>
        </tbody>
      </table>
      <doc-shot
        src="screenshots/panel-source-dialog.png"
        alt="面板编辑订阅源对话框：UA、关闭预览图、关闭延迟检测"
        caption="面板 → 订阅源 → 某一行的菜单 → 编辑：红框三项都在这个对话框里。组播源尤其建议打开「关闭延迟检测」，不然每次进选台界面都会让服务端多拉几路流。"
      />

      <h2 id="server-settings">推荐设置（rtp2httpd 侧）</h2>
      <p>在配置文件 <code>/etc/rtp2httpd.conf</code> 的 <code>[global]</code> 段里调整，改完重载配置生效：</p>
      <table>
        <thead>
          <tr><th>配置项</th><th>默认</th><th>建议</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>upstream-interface</code></td>
            <td>无（走系统路由）</td>
            <td><b>必须设成 IPTV 网络接口</b>，否则拉不到组播和 FCC</td>
          </tr>
          <tr>
            <td><code>maxclients</code></td>
            <td>5</td>
            <td>按家里的设备数调大，如 20。电视、手机、平板各算一个，预览图并发也占资源</td>
          </tr>
          <tr>
            <td><code>udp-rcvbuf-size</code></td>
            <td>512 KB</td>
            <td>4K 或高码率流调到 1～2 MB 减少丢包；Docker 部署要加 <code>--cap-add=NET_ADMIN</code> 才能超过内核上限</td>
          </tr>
          <tr>
            <td><code>buffer-pool-max-size</code></td>
            <td>16384（约 24 MB）</td>
            <td>客户端多、或上行吃紧时调大，给发送队列留余地</td>
          </tr>
          <tr>
            <td><code>mcast-rejoin-interval</code></td>
            <td>0（关闭）</td>
            <td>出现「看一会儿就断，重进又好了」时设 30～120 秒。<b>只在遇到问题时才开</b></td>
          </tr>
          <tr>
            <td><code>external-m3u-update-interval</code></td>
            <td>7200 秒（2 小时）</td>
            <td>外部源的自动更新间隔，按源的更新频率调整；设 0 改为手动更新</td>
          </tr>
          <tr>
            <td><code>video-snapshot</code></td>
            <td>关闭</td>
            <td>想用 App 的频道预览图就打开，需要另外装 ffmpeg；建议只在性能强的 x86 设备上开</td>
          </tr>
          <tr>
            <td><code>hostname</code> / <code>r2h-token</code> / <code>status-page-path</code> / <code>player-page-path</code></td>
            <td>空 / 未启用 / 默认</td>
            <td>只要暴露到公网就必须设置，见下文「公网访问与安全」</td>
          </tr>
        </tbody>
      </table>
      <doc-callout kind="tip" title="服务端负载不用太担心" icon="speed">
        rtp2httpd 的转发开销很低，普通路由器跑 8 路 40 Mbps 的流转发大约只占一个 CPU 核心的百分之几。
        真正容易成为瓶颈的是<b>上行带宽</b>，而不是这台机器的性能。
      </doc-callout>

      <h2 id="catchup">时移回看</h2>
      <p>
        回看的地址来自源里的 <code>catchup</code> 与 <code>catchup-source</code>。
        rtp2httpd 生成播放列表时会把 <code>catchup-source</code> 一起改写成自己的代理地址，
        并保留 <code>&#123;utc:...&#125;</code> 这类动态占位符，所以<b>直接用它的播放列表就带回看</b>。
        怎么用回看见 <a [routerLink]="'/epg'">EPG 节目单</a>：GUIDE 键打开节目单，选中已播出的节目按 OK。
      </p>
      <h3 id="catchup-time">回看时间差 8 小时</h3>
      <p>
        回看时间由 App 按设备本地时区生成。rtp2httpd 收到后，按请求头 <code>User-Agent</code> 里的
        <code>TZ/</code> 标记理解客户端时区，<b>UA 里没有这个标记就按 UTC 算</b>。
        App 默认 UA 是 <code>Mytv.Android</code>，不带这个标记，于是本地时间被当成 UTC，
        和上游期望的时间对不上，最典型的表现就是整体差 8 小时。
        两种改法任选：
      </p>
      <ol>
        <li>
          把 <b>面板 → 播放器 → 全局UA</b>（或电视端 设置 → 播放器 → 全局UA）改成带时区标记的形式，例如
          <code>Mytv.Android TZ/UTC+8</code>（<b>推荐</b>，一次改完对所有源生效）；
        </li>
        <li>
          在播放地址后追加时间偏移参数 <code>r2h-seek-offset</code>，
          可选 <code>28800</code> 或 <code>-28800</code>，按实际偏差方向选一个。
        </li>
      </ol>
      <p>
        上游用的时移参数名不是 <code>playseek</code> / <code>tvdr</code> 时，
        在地址上带 <code>r2h-seek-name=参数名</code>；服务端时钟有偏差也可用 <code>r2h-seek-offset</code> 微调。
      </p>
      <doc-shot
        src="screenshots/panel-player-network.png"
        alt="网页面板播放器页：全局 UA"
        caption="面板 → 播放器：红框是全局 UA，改成 Mytv.Android TZ/UTC+8 即可修正回看时区。电视端 设置 → 播放器 → 全局UA 也能改。"
      />
      <doc-callout kind="info" title="回看播完怎么回到直播" icon="movie">
        RTSP 上游如果支持，可以在地址上加 <code>r2h-seek-mode=range(...)</code> 启用 Range Seek：
        回看段播完会<b>无缝接回实时直播</b>，不用重新连接。这是可选项，只有确认上游支持时才开，
        否则请求会失败而不是自动回退——细节见 rtp2httpd 的「时间处理说明」。
      </doc-callout>

      <h2 id="fcc">FCC 快速换台</h2>
      <p>
        纯组播起播要等下一个关键帧（间隔通常 1～5 秒），这就是换台慢的原因。
        FCC 让 rtp2httpd 先向 FCC 服务器要一段缓存好的关键帧立刻起播，再无缝切回组播流。
        用法是在线路地址后带一个参数：
      </p>
      <pre><code>http://192.168.1.1:5140/rtp/239.253.64.120:5140?fcc=10.255.14.152:15970
http://192.168.1.1:5140/rtp/239.253.64.121:5140?fcc=10.255.14.152:8027&amp;fcc-type=huawei</code></pre>
      <p>
        不带 <code>fcc-type</code> 时按电信 / 中兴 / 烽火协议处理，<code>&amp;fcc-type=huawei</code> 走华为协议，
        大多数省份用默认的即可。效果上，启用 FCC 后换台一般在 1 秒内，未启用则要 2～5 秒。
      </p>
      <p>
        <b>FCC 由 rtp2httpd 侧完成</b>，App 不需要配置 FCC 服务器，把带参数的地址照常播放即可。
        但要让 FCC 的秒级换台真正体现出来，App 侧还要让起播尽量快：
      </p>
      <ul>
        <li><b>设置 → 播放器 → 更好的视频探测</b>：<b>关闭</b>。开着时播放器会花更多时间探测视频格式，凭空拖慢起播；</li>
        <li><b>设置 → 播放器 → 播放缓冲</b>：设为 <b>0～1 秒</b>。缓冲越大，起播前等待越久。</li>
      </ul>
      <doc-shot
        src="screenshots/panel-player-startup.png"
        alt="网页面板播放器页：更好的视频探测与播放缓冲"
        caption="面板 → 播放器：红框两项就是起播快慢的关键。想用 FCC 快速换台，把「更好的视频探测」关掉、「播放缓冲」压到 0～1 秒。"
      />
      <doc-shot
        src="screenshots/app-player-startup.png"
        alt="电视端设置 → 播放器：更好的视频探测"
        caption="同一项在电视上的位置：设置 → 播放器 → 「更好的视频探测」。下面几行依次是加载超时与播放缓冲。"
      />
      <p>
        FCC 服务器地址需要自己抓包或查社区汇总；rtp2httpd 跑在 NAT 后面（NAS、二级路由）时，
        还要按官方文档做端口转发或改用原生支持穿透的华为协议。
      </p>

      <h2 id="snapshot">频道预览图（视频快照）</h2>
      <p>
        这是本 App 与 rtp2httpd 目前唯一的直接对接点：抓取频道列表预览首帧时，
        App 会带上 <code>X-Request-Snapshot: 1</code> 请求头。服务端开了视频快照就<b>直接回一张 JPEG</b>，
        不用把媒体流拉下来解码，预览图出得非常快。
      </p>
      <ul>
        <li>服务端开关：<code>video-snapshot = yes</code>，并另外装好带 h264 / hevc 编解码器的 ffmpeg；</li>
        <li>速度：配合 FCC 一般 0.3 秒内返回，没开 FCC 最长约 1 秒（等下一个 IDR 帧）；</li>
        <li>服务端资源有限时，把 App 的「频道预览并行数」保持为 1，或关掉「频道预览」。</li>
      </ul>
      <doc-callout kind="warn" title="服务端没开快照时，预览会很吃亏" icon="warning">
        快照功能没开（或 ffmpeg 缺编解码器）时，App 只能退回本地拉流解码取帧，
        每次预览都要真拉一路流，既慢又占服务端的客户端名额和带宽。
        这种情况建议直接在 <b>设置 → 界面</b> 关掉「频道预览」，或按源勾选面板上的「关闭预览图」。
      </doc-callout>

      <h2 id="public">公网访问与安全</h2>
      <p>
        rtp2httpd 默认兼容 udpxy 的地址格式，而网上有大量扫描器专门探测开放的 udpxy / msd_lite 服务，
        一旦不加防护地暴露到公网就会被持续盗用带宽。要出公网时，应改掉 <code>hostname</code>、
        设置 <code>r2h-token</code>、改掉状态页与播放器页路径，前面再挂一层反向代理并开启 <code>xff</code>。
      </p>
      <p>
        启用 <code>r2h-token</code> 时，令牌<b>写在订阅源地址里</b>就行：
        rtp2httpd 生成播放列表时，会把令牌自动加到每个频道地址和节目单地址后面，
        App 拉到的线路本身就已经带着令牌，不用逐条改地址。
      </p>
      <pre><code>http://你的域名:5140/playlist.m3u?r2h-token=你的令牌</code></pre>
      <p>
        带宽方面：一条 1080p 流约 6～10 Mbps，4K 流可达 30～40 Mbps。
        近年来运营商对家庭宽带的<b>上行</b>（尤其跨运营商）限速很严格，外网看时如果频繁花屏、卡顿，
        先在服务端的 <code>/status</code> 页看看是不是出现了「慢客户端」——那多半是上行带宽不够，而不是 App 的问题。
      </p>

      <h2 id="troubleshoot">出问题时先看这几处</h2>
      <table>
        <thead>
          <tr><th>现象</th><th>先查什么</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>播放列表能加载，频道全部播不了</td>
            <td>服务端没拿到 IPTV 内网 IP，或「上游接口」没选对；浏览器打开 <code>http://路由器IP:5140/status</code> 看日志和客户端连接</td>
          </tr>
          <tr>
            <td>换台要 2～5 秒</td>
            <td>没启用 FCC，见上文；确认地址里带了 <code>?fcc=</code></td>
          </tr>
          <tr>
            <td>看一会儿就花屏、卡顿、断开</td>
            <td>服务端调大 <code>udp-rcvbuf-size</code>，或设 <code>mcast-rejoin-interval</code>；也可能是上游或上行带宽问题</td>
          </tr>
          <tr>
            <td>回看时间对不上</td>
            <td>时区问题，见「时移回看」一节</td>
          </tr>
          <tr>
            <td>预览图一直出不来</td>
            <td>服务端没开 <code>video-snapshot</code>，或 ffmpeg 缺 h264 / hevc 编解码器</td>
          </tr>
          <tr>
            <td>播放几路后新设备连不上</td>
            <td>客户端数到了 <code>maxclients</code> 上限（默认 5），调大即可</td>
          </tr>
        </tbody>
      </table>
      <doc-callout kind="tip" title="延伸阅读" icon="open_in_new">
        rtp2httpd 官方的
        <a href="https://rtp2httpd.com/guide/quick-start" target="_blank" rel="noopener">快速上手</a>、
        <a href="https://rtp2httpd.com/guide/url-formats" target="_blank" rel="noopener">URL 格式说明</a>、
        <a href="https://rtp2httpd.com/guide/m3u-integration" target="_blank" rel="noopener">M3U 播放列表集成</a>
        与 <a href="https://rtp2httpd.com/reference/configuration" target="_blank" rel="noopener">配置参数详解</a>，
        它的「相关软件」页也把本 App 列为支持视频快照的播放器。
      </doc-callout>
    </div>
  `,
})
export class Rtp2httpdPage {}
