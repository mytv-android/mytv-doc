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
        title="订阅源（IPTV）"
        lead="订阅源是电视直播的核心数据。本页介绍四种源类型、URL 前缀协议、混合源，以及 TV 应用内和 10591 面板上的全部相关设置。"
      />

      <h2>1. 订阅源类型</h2>
      <p>应用支持四种订阅源类型（<code>sourceType</code>），按内容自动识别或手动指定：</p>
      <table>
        <thead>
          <tr><th>类型</th><th>sourceType</th><th>说明</th><th>必填字段</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><b>网络 m3u / txt</b></td>
            <td><code>0</code></td>
            <td>按内容自动识别。<code>.m3u</code> 走 m3u 解析器；<code>.txt</code> 形如 <code>分组,#genre#</code> 行 + <code>频道名,url1#url2</code>。<code>.gz</code> 自动 GZIP 解压。</td>
            <td>链接（URL）</td>
          </tr>
          <tr>
            <td><b>本地文件</b></td>
            <td><code>1</code></td>
            <td>TV 本机 m3u / txt 路径，以 <code>/</code> 开头自动识别为本地源。不参与缓存过期（视为永久有效）。读取外部存储需授予「所有文件访问权限」。</td>
            <td>文件路径</td>
          </tr>
          <tr>
            <td><b>Xtream Codes</b></td>
            <td><code>2</code></td>
            <td>面板内部拼接 <code>&#123;url&#125;/get.php?username=…&amp;password=…&amp;type=…</code>。</td>
            <td>链接、用户名、密码、输出类型</td>
          </tr>
          <tr>
            <td><b>Stalker Portal</b></td>
            <td><code>3</code></td>
            <td>先 <code>portal.php?type=stb&amp;action=handshake</code> 取 token，再请求 <code>get_all_channels</code> + <code>get_genres</code>。</td>
            <td>链接、MAC 地址</td>
          </tr>
        </tbody>
      </table>

      <h2>2. 添加订阅源</h2>
      <p>有三种方式：</p>
      <ol>
        <li>
          <b>TV 端：设置 → 订阅源 → 自定义订阅源 → 添加其他订阅源</b>。弹二维码，扫码跳到面板添加页。
          <ul>
            <li>面板首页（<code>/</code>）→ 订阅源。支持 5 种类型：<code>remote</code>（网络 URL）/ <code>xtream</code> / <code>stalker</code> / <code>file</code>（TV 本地路径）/ <code>content</code>（直接粘贴 m3u / txt 内容，面板把内容写到 TV 本地文件 <code>iptv_source_local_&lt;时间戳&gt;.txt</code> 再注册为本地源）。</li>
            <li>面板订阅源页（<code>/sources</code>）→ 新增。同首页，但走完整编辑对话框。</li>
          </ul>
        </li>
        <li>
          <b>深链添加</b>：<code>mytv://add?url=&lt;订阅源地址&gt;&amp;name=&amp;user-agent=&amp;proxy=&amp;transform-js=</code>。从外部 App 唤起 TV 应用并直接写入订阅源列表。
        </li>
        <li>
          <b>面板 API 推送</b>：<code>POST /api/iptv-source/push</code>，请求体字段 <code>name</code> / <code>type</code>（<code>url|file|content|xtream|stalker</code>）/ <code>url</code> / <code>filePath</code> / <code>content</code> / <code>userName</code> / <code>password</code> / <code>format</code> / <code>mac</code> / <code>httpUserAgent</code> / <code>httpProxy</code>。
        </li>
      </ol>

      <h2>3. m3u 支持的扩展字段</h2>
      <h3><code>#EXTM3U</code> 行（全局）</h3>
      <ul>
        <li><code>catchup</code> / <code>catchup-source</code>：默认回看类型与回看地址，可被 <code>#EXTINF</code> 行覆写。</li>
        <li><code>host</code>：全局 host 覆写，形如 <code>host=old.com=new.com;old2.com=new2.com</code>，分号分隔多条。</li>
        <li><code>x-tvg-url</code> / <code>url-tvg</code>：内嵌 EPG 地址（需在 <a [routerLink]="'/epg'">EPG</a> 页开启「跟随订阅源」）。</li>
      </ul>
      <h3><code>#EXTINF</code> 行（单频道）</h3>
      <ul>
        <li><code>tvg-id</code> / <code>tvg-name</code> / <code>tvg-logo</code> / <code>tvg-chno</code>：频道 ID / 名称 / 台标 / 频道号。</li>
        <li><code>group-title</code>：分组，支持 <code>;</code> 分隔多组；缺省归入「其他」。</li>
        <li><code>http-user-agent</code> / <code>http-referrer</code> / <code>http-origin</code> / <code>http-cookie</code> / <code>host</code>：自定义请求头与 host 覆写。</li>
        <li><code>catchup</code> / <code>catchup-source</code>：本条线路的回看覆写。</li>
      </ul>
      <h3><code>#KODIPROP</code> 与 <code>#EXTVLCOPT</code></h3>
      <ul>
        <li><code>#KODIPROP:inputstream.adaptive.manifest_type</code> / <code>license_type</code> / <code>license_key</code> / <code>drm_legacy</code>：DRM 相关。</li>
        <li><code>#KODIPROP:inputstream.adaptive.stream_headers=Cookie=…&amp;User-Agent=…&amp;Referer=…</code></li>
        <li><code>#EXTVLCOPT:http-origin</code> / <code>http-referrer</code> / <code>http-user-agent</code> / <code>http-cookie</code> / <code>host</code></li>
      </ul>
      <h3>回看类型</h3>
      <p>
        <code>catchup</code> 字段取值（解析时按 <code>lowercase</code> 归一）：
      </p>
      <table>
        <thead>
          <tr><th>字符串</th><th>内部值</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td><code>default</code></td><td><code>0</code></td><td>默认回看</td></tr>
          <tr><td><code>append</code></td><td><code>1</code></td><td>追加参数式</td></tr>
          <tr><td><code>timeshift</code> / <code>shift</code></td><td><code>2</code></td><td>时移式</td></tr>
          <tr><td><code>flussonic</code></td><td><code>3</code></td><td>Flussonic 风格</td></tr>
          <tr><td><code>xtream codes</code></td><td><code>4</code></td><td>Xtream Codes 风格</td></tr>
          <tr><td><code>disabled</code></td><td><code>null</code></td><td>禁用回看</td></tr>
        </tbody>
      </table>

      <h2>4. URL 前缀（混合源协议）</h2>
      <p>
        每条线路的 URL 可以加前缀改变播放器行为。前缀决定 <code>hybridType</code>，影响线路被切到时的处理方式。
      </p>
      <table>
        <thead>
          <tr><th>前缀</th><th>行为</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>webview://https://…</code></td>
            <td>用 WebView 加载页面，注入 JS 提取 <code>&lt;video&gt;</code> 流。详见 <a [routerLink]="'/webview-player'">WebView 播放器</a>。</td>
          </tr>
          <tr>
            <td><code>video://https://…</code></td>
            <td>同样走 WebView，但视为纯视频流（不主动提取）。适用于页面本身就是裸视频地址的场景。</td>
          </tr>
          <tr>
            <td><code>javascript://…</code></td>
            <td>走 QuickJS 引擎执行代码，脚本 <code>return</code> 的字符串就是真正的播放地址。详见下方「javascript:// 源」。</td>
          </tr>
          <tr>
            <td>其它（无前缀）</td>
            <td>当作常规直播流（m3u8 / flv / ts / rtsp 等）交给视频播放器。</td>
          </tr>
        </tbody>
      </table>

      <h2>5. javascript:// 源</h2>
      <p>
        把订阅源某条线路的 URL 写成 <code>javascript://</code> 开头，播放器切到这条线路时不会直接请求网络，
        而是把整段 URL 交给内置的 <b>QuickJS</b> 引擎执行。脚本 <code>return</code> 的字符串就是真正的播放地址（m3u8 / mp4 等）。
      </p>
      <p>典型用途：</p>
      <ul>
        <li><b>动态拼接</b>：根据当前时间戳、设备指纹等动态生成播放地址。</li>
        <li><b>一次额外请求</b>：脚本里发起一次 HTTP 请求拿到真实地址再返回。</li>
        <li><b>解密</b>：对源站返回的加密地址做本地解密。</li>
      </ul>
      <p>注意事项：</p>
      <ul>
        <li>脚本运行在 QuickJS（不是浏览器），没有 <code>window</code> / <code>document</code>，只能用引擎提供的 API。</li>
        <li>整条 URL 都会作为脚本源码执行，所以脚本里不能含未转义的换行；一般写成单行。</li>
        <li>调试需要打开「开发者模式」（见 <a [routerLink]="'/remote-panel'">远程配置面板</a> → <code>/ku9/js/*</code> 端点）。</li>
      </ul>

      <h2>6. 混合源（自动添加网页源）</h2>
      <p>
        <b>电视直播</b>内置<b>混合源</b>能力：自动为订阅源中的频道追加官网 / 央视网 / 央视频等网页源线路，作为内置源失效时的兜底。
      </p>
      <p>
        线路在播放器底部信息条会用 tag 标记来源。判定依据是 URL 的 host：
      </p>
      <ul>
        <li><code>央视网</code>：<code>cctv.com</code></li>
        <li><code>央视频</code>：<code>yangshipin.cn</code></li>
        <li><code>官网</code>：命中小表的地方台官网（北京 <code>brtn.cn</code> / 江苏 <code>jstv.com</code> / 看看新闻 <code>kankanews.com</code> / 浙江 <code>cztv.com</code> / 河北 <code>hebtv.com</code> / 广东 <code>gdtv.cn</code> / 广西 <code>gxtv.cn</code> / 黑龙江 <code>hljtv.com</code> / 河南 <code>hnntv.cn</code> / 湖南 <code>hntv.tv</code> / 福建 <code>fjtv.net</code> / 贵州 <code>gzstv.com</code> / 江西 <code>jxntv.cn</code> / 安徽 <code>ahtv.cn</code> / 齐鲁 <code>iqilu.com</code> / 吉林 / 山西 / 甘肃 / 宁夏 / 内蒙古 / 云南 / 陕西 / 青海 / 西藏 / 新疆 等）</li>
        <li><code>其它</code>：未命中以上任一。</li>
      </ul>
      <p>
        央视频线路属于 WebView 源，付费频道需要配合「网页源央视频 Cookie」。
      </p>

      <h2>7. TV 应用内设置项（设置 → 订阅源）</h2>
      <p>入口：<b>设置 → 订阅源</b>。下列表格按 TV 设置页的顺序排列，「默认」列来自源码中的常量初始值。</p>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>作用 / 取值 / 操作方式</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><b>自定义订阅源</b></td>
            <td>WebView测试源</td>
            <td>
              <p>子页面管理全部订阅源。</p>
              <p>列表项显示：名称 + 类型徽标（<code>本地</code> / <code>XTREAM</code> / <code>STALKER PORTAL</code>，网络源无徽标）+ 转换JS 徽标 + 链接 + 单源 UA + 缓存信息（分组数 / 频道数 / 缓存大小 / 更新时间）。</p>
              <p>单项操作：设为当前 / 删除 / 清除缓存。页面顶部「刷新全部」重新拉取所有源并显示加载 / 错误状态。</p>
              <p>默认演示源：<code>https://gitee.com/mytv-android/iptv-api/raw/master/output/webview_demo.m3u</code>。</p>
            </td>
          </tr>
          <tr>
            <td><b>订阅源缓存时间</b></td>
            <td>1 小时</td>
            <td>
              <p>网络源缓存有效期。本地文件（sourceType=1）固定为永久，不参与过期。</p>
              <p>缓存失效后会重新下载；下载失败回落到旧缓存（缓存文件大小 &gt; 0 才视为有效）。</p>
              <p>子页面 6 列网格选择，可选值：</p>
              <ul>
                <li><code>不缓存</code>（0）</li>
                <li>1 小时 – 23 小时（步进 1 小时）</li>
                <li>1 天 – 15 天（步进 1 天）</li>
                <li><code>永久</code>（Long.MAX_VALUE）</li>
              </ul>
              <p>源码默认 <code>Constants.IPTV_SOURCE_CACHE_TIME = 1000*60*60</code>（1 小时）。<code>.gz</code> 响应自动 GZIP 解压。</p>
            </td>
          </tr>
          <tr>
            <td><b>分类隐藏</b></td>
            <td>空</td>
            <td>
              <p>按分组隐藏频道。子页面 4 列网格逐组切换可见性，命中隐藏的分组不会出现在频道列表。</p>
              <p>右侧显示「共 N 个分组」或「共 N 个分组，已隐藏 M 个分组」。</p>
              <p>面板用 chips 编辑，直接修改字符串集合。</p>
            </td>
          </tr>
          <tr>
            <td><b>隐藏频道规则</b></td>
            <td>空</td>
            <td>
              <p>按频道名<b>正则</b>匹配；命中的频道不会出现在列表 / 搜索中。支持多条正则。</p>
              <p>添加规则时输入正则表达式，示例：<code>.*测试.*</code>。</p>
              <p>右侧显示「暂无隐藏规则」或规则数量。面板用 chips 编辑。</p>
            </td>
          </tr>
          <tr>
            <td><b>支持加密频道组</b></td>
            <td>关</td>
            <td>
              <p>开启后，分组名以 <code>_数字</code> 结尾（正则 <code>.*_\\d+$</code>）时：</p>
              <ul>
                <li>在搜索结果与「全部频道」中默认隐藏；</li>
                <li>选台界面切换到此分组时弹出输入框，密码即 <code>_</code> 之后的数字部分（例：<code>成人_1234</code> → 密码 <code>1234</code>）。</li>
              </ul>
              <p>示例分组名：<code>付费_8888</code>。</p>
            </td>
          </tr>
          <tr>
            <td><b>频道别名</b></td>
            <td>—</td>
            <td>
              <p>只读显示，右侧显示「共 N 个频道，M 个别名」。编辑在面板（<code>/sources</code> 或 <code>/api/channel-alias</code>）。</p>
              <p>别名文件位于 TV 本地 <code>channel_name_alias.json</code>，格式：<code>&#123;"__suffix":[...], "CCTV1":["央视一套","cctv-1"]&#125;</code>。</p>
              <p><code>__suffix</code> 是频道名后缀剥离规则（如 <code>-HD</code> / <code>+高清</code>），剥离后再查别名表，实现「CCTV1-HD」归并到「CCTV1」。</p>
              <p>应用内置一份默认别名表（<code>raw/channel_name_alias.json</code>），用户别名与其合并，用户表优先。</p>
            </td>
          </tr>
          <tr>
            <td><b>相似频道合并</b></td>
            <td>开</td>
            <td>
              <p>开启后，经别名标准化后<b>名字相同</b>的频道（可能来自不同订阅源或不同分组）合并为一个频道，其线路合并到同一频道下。</p>
              <p>配合「频道别名」可让「CCTV1」「CCTV-1」「央视一套」合并显示。</p>
              <p>TV 开关项，面板为开关。</p>
            </td>
          </tr>
          <tr>
            <td><b>频道图标提供</b></td>
            <td>gitee myTVlogo</td>
            <td>
              <p>台标 URL 模板。只读显示，编辑在面板。</p>
              <p>默认值：<code>https://gitee.com/mytv-android/myTVlogo/raw/main/img/&#123;name|uppercase&#125;.png</code>。</p>
              <p>变量：<code>&#123;name&#125;</code> / <code>&#123;name|lowercase&#125;</code> / <code>&#123;name|uppercase&#125;</code>（频道标准名替换）。</p>
              <p>解析时自动追加 <code>&amp;_t=</code> 10 天周期参数，让 Coil 磁盘缓存 key 每 10 天变化，避免服务器图片更新后本地缓存永不过期。</p>
            </td>
          </tr>
          <tr>
            <td><b>频道图标覆盖</b></td>
            <td>开</td>
            <td>
              <p>开启后用「频道图标提供」返回的图标覆盖订阅源 <code>tvg-logo</code> 中定义的图标。</p>
              <p>关闭则保留订阅源自带的 <code>tvg-logo</code>。TV 开关项，面板为开关。</p>
            </td>
          </tr>
          <tr>
            <td><b>PLTV 转 TVOD</b></td>
            <td>开</td>
            <td>
              <p>仅对 <code>rtsp://</code> 且 URL 含 <code>pltv</code> 或 <code>tvod</code> 的线路生效。回看时把 URL 中的 <code>pltv</code> 替换为 <code>tvod</code>（大小写不敏感）以支持回看。</p>
              <p>回看 URL 还会追加 <code>?playseek=yyyyMMddHHmmss-yyyyMMddHHmmss</code>（起止时间）。</p>
              <p>TV 开关项，面板为开关。</p>
            </td>
          </tr>
          <tr>
            <td><b>自动添加网页源</b></td>
            <td>订阅源优先</td>
            <td>
              <p>混合源模式。子页面三选一，决定是否为订阅源频道追加网页源线路及排列顺序：</p>
              <ul>
                <li><b>禁用</b>（<code>DISABLE=0</code>）：不追加任何网页源线路。</li>
                <li><b>订阅源优先</b>（<code>IPTV_FIRST=1</code>）：追加，但网页源排在订阅源线路<b>之后</b>。</li>
                <li><b>网页源优先</b>（<code>HYBRID_FIRST=2</code>）：追加，且网页源排在订阅源线路<b>之前</b>。</li>
              </ul>
              <p>源码默认 <code>IptvHybridMode.IPTV_FIRST</code>。</p>
            </td>
          </tr>
          <tr>
            <td><b>网页源央视频 Cookie</b></td>
            <td>空</td>
            <td>
              <p>只读显示（取前 50 字符 + <code>…</code>），编辑在面板。用于央视频 WebView 线路收看付费频道。</p>
              <p>获取方式：浏览器登录央视频（<code>yangshipin.cn</code>）后，复制全部 Cookie 粘贴到面板。</p>
              <p>源码默认空字符串。</p>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>8. 10591 面板（<code>/sources</code>）的全部可配置项</h2>
      <p>面板订阅源页比 TV 多了排序、转换JS、单源 UA / 代理、别名编辑、文件内容直接编辑等能力。所有字段通过 <code>POST /api/configs</code> 写回，别名通过 <code>POST /api/channel-alias</code> 单独写回（写后自动刷新别名并清空 IPTV / EPG 缓存）。</p>
      <table>
        <thead>
          <tr><th>面板字段</th><th>类型</th><th>说明 / 默认 / 取值</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>订阅源列表</td>
            <td>列表 + 分页</td>
            <td>新增 / 编辑 / 删除 / 上移 / 下移 / 设为当前；分页 5 / 10 / 25 / 100；每项带 sourceType 徽标。</td>
          </tr>
          <tr>
            <td>编辑对话框 - 名称</td>
            <td>文本框</td>
            <td>订阅源显示名，必填。</td>
          </tr>
          <tr>
            <td>编辑对话框 - 类型</td>
            <td>下拉</td>
            <td><code>remote</code>（sourceType 0）/ <code>file</code>（1）/ <code>xtream</code>（2）/ <code>stalker</code>（3）。</td>
          </tr>
          <tr>
            <td>编辑对话框 - 链接 / 文件路径</td>
            <td>文本框</td>
            <td>网络源 URL 或本地文件路径（<code>/</code> 开头）。xtream / stalker 填服务器根地址。</td>
          </tr>
          <tr>
            <td>编辑对话框 - 文件内容</td>
            <td>多行文本</td>
            <td>仅 <code>file</code> 类型显示。直接编辑 TV 本地文件内容（<code>POST /api/file/content</code>）。</td>
          </tr>
          <tr>
            <td>编辑对话框 - 用户名 / 密码</td>
            <td>文本框</td>
            <td>仅 <code>xtream</code> 类型显示。用于拼接 <code>get.php?username=…&amp;password=…</code>。</td>
          </tr>
          <tr>
            <td>编辑对话框 - 输出类型</td>
            <td>下拉</td>
            <td>仅 <code>xtream</code> 类型显示。填 <code>m3u_plus</code> / <code>m3u</code> 等，作为 <code>&amp;type=</code> 参数；留空则不追加 <code>type</code>。</td>
          </tr>
          <tr>
            <td>编辑对话框 - MAC 地址</td>
            <td>文本框</td>
            <td>仅 <code>stalker</code> 类型显示。形如 <code>00:1A:79:xx:xx:xx</code>。</td>
          </tr>
          <tr>
            <td>编辑对话框 - 全局 UA</td>
            <td>文本框</td>
            <td>单源级 UA（<code>httpUserAgent</code>）。非 <code>file</code> 类型显示。请求订阅源时作为 <code>User-Agent</code> 头；若频道未单独指定 UA，则播放时也继承此 UA。</td>
          </tr>
          <tr>
            <td>编辑对话框 - HTTP 代理</td>
            <td>文本框</td>
            <td>
              <p>单源级代理（<code>httpProxy</code>）。非 <code>file</code> 类型显示。</p>
              <p>播放器解析有效代理的优先级：<b>播放器代理规则列表</b>（正则匹配）&gt; <b>当前订阅源的 httpProxy</b> &gt; <b>播放器全局代理</b>。</p>
              <p>格式：<code>http://host:port</code> 或 <code>socks5://host:port</code>。</p>
            </td>
          </tr>
          <tr>
            <td>编辑对话框 - 转换 JS</td>
            <td>多行文本</td>
            <td>
              <p>订阅源级转换脚本（<code>transformJs</code>）。订阅源下载并解析完成后，用 QuickJS 执行脚本对频道列表二次处理。</p>
              <p>脚本需定义 <code>function main(channelList) &#123; ... return channelList; &#125;</code>，参数和返回值都是 JSON 数组。</p>
              <p>执行失败时回退到原始列表。列表项带「转换JS」徽标。</p>
            </td>
          </tr>
          <tr>
            <td>订阅源缓存时间（小时）</td>
            <td>数字输入</td>
            <td>同 TV 的「订阅源缓存时间」，单位小时。<code>0</code> = 不缓存。本地源固定永久。</td>
          </tr>
          <tr>
            <td>频道隐藏分组</td>
            <td>chips 编辑</td>
            <td>同 TV 的「分类隐藏」。点击 chip 直接编辑字符串。</td>
          </tr>
          <tr>
            <td>频道隐藏列表</td>
            <td>chips 编辑</td>
            <td>同 TV 的「隐藏频道规则」。按正则，多条。</td>
          </tr>
          <tr>
            <td>频道别名</td>
            <td>多行文本</td>
            <td>
              <p>直接编辑 <code>channel_name_alias.json</code> 内容。示例：</p>
              <pre><code>&#123;
  "__suffix": ["-HD", "+高清"],
  "CCTV1": ["央视一套", "cctv-1"]
&#125;</code></pre>
              <p>写入后自动刷新别名并清空 IPTV / EPG 全部缓存（<code>IptvRepository.clearAllCache()</code> + <code>EpgRepository.clearAllCache()</code>）。</p>
            </td>
          </tr>
          <tr>
            <td>相似频道合并</td>
            <td>开关</td>
            <td>同 TV，默认开。</td>
          </tr>
          <tr>
            <td>频道图标提供</td>
            <td>单行文本</td>
            <td>同 TV，默认 <code>https://gitee.com/mytv-android/myTVlogo/raw/main/img/&#123;name|uppercase&#125;.png</code>。</td>
          </tr>
          <tr>
            <td>频道图标覆盖</td>
            <td>开关</td>
            <td>同 TV，默认开。</td>
          </tr>
          <tr>
            <td>PLTV 转 TVOD</td>
            <td>开关</td>
            <td>同 TV，默认开。</td>
          </tr>
          <tr>
            <td>自动添加网页源</td>
            <td>下拉</td>
            <td>同 TV：<code>禁用</code> / <code>IPTV 优先</code> / <code>网页源优先</code>。</td>
          </tr>
          <tr>
            <td>网页源央视频 Cookie</td>
            <td>多行文本</td>
            <td>从浏览器登录央视频（<code>yangshipin.cn</code>）后复制所有 Cookie 粘贴。</td>
          </tr>
        </tbody>
      </table>

      <h2>9. 与其他功能的联动</h2>
      <ul>
        <li><b>EPG</b>：m3u 中的 <code>x-tvg-url</code> / <code>url-tvg</code> 在「跟随订阅源」开启时优先作为 EPG 来源。详见 <a [routerLink]="'/epg'">EPG 节目单</a>。</li>
        <li><b>WebView 播放器</b>：<code>webview://</code> 前缀触发 WebView 内核加载。详见 <a [routerLink]="'/webview-player'">WebView 播放器</a>。</li>
        <li><b>加密分组</b>：开启后列表 / 搜索都需密码。详见 <a [routerLink]="'/channels'">频道、收藏与搜索</a>。</li>
        <li><b>频道别名</b>：配合「相似频道合并」让多源同名频道合并显示。详见 <a [routerLink]="'/channels'">频道、收藏与搜索</a>。</li>
        <li><b>云同步</b>：订阅源列表、缓存时间、混合源、别名等随云同步备份。详见 <a [routerLink]="'/sync'">云同步与备份</a>。</li>
        <li><b>深链播放</b>：<code>mytv://play?url=…</code> / <code>nanotv://play?url=…</code> / <code>https://play.aptv.app/&lt;url&gt;</code> 可直接播放一条媒体地址，不走订阅源列表。</li>
      </ul>

      <doc-callout kind="warn" title="关于内置演示源" icon="warning">
        仓库自带演示地址 <code>https://gitee.com/mytv-android/iptv-api/raw/master/output/webview_demo.m3u</code> 仅供测试，可用性不保证。请自行准备合法的 IPTV 订阅。
      </doc-callout>
    </div>
  `,
})
export class SourcesPage {}
