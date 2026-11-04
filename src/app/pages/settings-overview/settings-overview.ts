import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';
import { DocShot } from '../../shared/doc-shot';

@Component({
  selector: 'app-settings-overview',
  imports: [DocPageHeader, DocCallout, DocShot, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="设置项总览"
        lead="整本手册的「设置地图」：设置按「观看 / 个性化 / 连接与数据 / 系统」4 组共 11 个分类排列，每类分成几个小节，出问题时才需要动的项收在页底的「高级设置」里。本页逐类列出每一项在哪、去哪一章看详细说明；外观、网络与代理、应用与系统、帮助与诊断没有单独章节，条目直接在本页查。"
      />

      <doc-callout kind="info" title="设置换了分类，也换了名字" icon="info">
        设置按「要做什么」重新分了类，大部分条目也换成了更直白的名字，例如「更好的视频探测」现在叫「更仔细地识别视频格式」，「播放缓冲」现在叫「起播前缓冲」。
        手册各章第一次提到改过名的条目时会在括号里注明原名；旧的 16 个分类各自去了哪里，见本页 <a [routerLink]="'/settings'" fragment="general">旧版分类去哪了</a>。
      </doc-callout>

      <h2 id="entries">在哪里改设置</h2>
      <p>有两个入口，进入的是同一套设置：</p>
      <ul>
        <li><b>首页 → 设置</b>；</li>
        <li><b>直播界面 → 快捷设置 → 设置</b>：直播画面里长按 OK 打开快捷设置，再进设置，看完返回直接回到直播。</li>
      </ul>

      <h3 id="settings-tv">电视与横屏</h3>
      <doc-shot
        src="screenshots/app-settings.png"
        alt="旧版电视端设置首页：16 个分类图标"
        caption="旧版界面截图（改版前的 16 个分类磁贴首页）。新版打开设置就是左侧分类导航 + 右侧设置列表，见下文说明。"
      />
      <p>电视（以及横屏使用的手机、平板）打开设置后，左边是一列<b>分类导航</b>，右边是所选分类的设置列表：</p>
      <ul>
        <li>导航从上到下是标题「设置」、<b>搜索设置</b>和 11 个分类；4 组之间只留间距，不写组名。</li>
        <li>焦点在导航里上下移动、停留片刻（约 0.15 秒），右侧就换成该分类，焦点仍留在导航，方便快速浏览；上下到头不会跳出导航。</li>
        <li>按 <b>OK</b> 或<b>右键</b>（触屏点按）进入右侧列表；在列表里按<b>左键</b>回到导航（按钮组那一行的左右键用来切换选项，见下文）。</li>
        <li>按<b>返回键</b>先回到导航，在导航上再按返回才退出设置。</li>
        <li>订阅源列表、主题、实时字幕等子页和搜索页占满整屏，不显示导航。</li>
      </ul>

      <h3 id="settings-portrait">手机竖屏</h3>
      <doc-shot
        src="screenshots/portrait-pair-settings.png"
        alt="旧版手机竖屏设置：三段式分类卡片与屏幕方向弹窗"
        caption="旧版界面截图（改版前的「常用 / 播放 / 系统」三段式卡片）。新版竖屏设置首页的结构见下文说明。"
      />
      <p>手机竖屏的设置首页从上到下是：</p>
      <ul>
        <li>大标题「设置」和<b>搜索框</b>；</li>
        <li>
          <b>订阅源卡片</b>：显示「订阅源 · 正在用「当前订阅源」」、当前频道数和订阅源个数，带「<b>添加订阅源</b>」「<b>管理</b>」两个按钮；
          还没有订阅源时只显示「还没有订阅源」和「添加订阅源」；
        </li>
        <li>按 4 组排列的 11 个分类，每行是图标、名称和一行简介，点进分类页。</li>
      </ul>
      <p>
        分类页顶部是大标题和简介，下面按小节排列设置项，当前值直接写在标题下方。
        平板横持、折叠屏展开时设置分左右两栏：左栏是搜索与分类，右栏是所选分类，见 <a [routerLink]="'/live-screen'" fragment="large-screens">平板、折叠屏与双屏</a>。
        手机想用电视那套横屏界面，在 <b>设置 → 外观 → 屏幕方向</b> 选「横屏」。
      </p>

      <h3 id="pickers">怎么改一项设置</h3>
      <table>
        <thead>
          <tr><th>样子</th><th>怎么改</th></tr>
        </thead>
        <tbody>
          <tr><td>开关</td><td>按 OK / 点按切换。</td></tr>
          <tr>
            <td>连在一起的一排按钮</td>
            <td>例如 播放内核（Media3 / IJK / VLC）、深浅模式、选台界面样式。触屏直接点选；电视上焦点停在这一行时按<b>左右键</b>原地切换，不用弹窗。</td>
          </tr>
          <tr>
            <td>右侧显示当前值的单选项</td>
            <td>
              按 OK 弹出<b>选择面板</b>：手机从底部弹出，电视从右侧滑出。面板标题下有一行说明这项是干什么的，已选项打勾，选中即生效并关闭。
              「起播前缓冲」的面板是三档预设加一根滑块。
            </td>
          </tr>
          <tr>
            <td>需要输入的项</td>
            <td>
              例如 频道别名、浏览器标识（UA）、云同步凭据。电视端先选「<b>扫码编辑</b>」或「<b>直接输入</b>」（手机上直接显示表单）。
              「直接输入」就在电视上填：方向键在输入框之间移动不会弹出软键盘，需要输入时在框上按 OK。
              长文本更适合「扫码编辑」（表单左下角也可随时切换）：用手机扫码或在电脑浏览器打开<b>远程配置面板</b>（<code>http://&lt;设备IP&gt;:10591</code>）输入，保存后即时生效，见 <a [routerLink]="'/remote-panel'">远程配置面板</a>。
            </td>
          </tr>
          <tr><td>带箭头的项</td><td>进入子页，例如 订阅源、节目单地址、AI 实时字幕、字幕样式、本机备份、权限。</td></tr>
          <tr>
            <td>「高级设置」</td>
            <td>每个分类页底部收起的一组，标着「N 项 · 出问题时再调整」，展开才看到。平时不用碰，排查播放、网络问题时再来。</td>
          </tr>
        </tbody>
      </table>
      <p>
        部分条目标题旁带小标签：<b>推荐 Media3</b>（建议的选项）、<b>Beta</b> / <b>实验性</b>（新功能，可能不稳定或在部分设备上闪退）、
        <b>仅 Media3</b> / <b>需 SurfaceView</b>（只在这个前提下生效）、<b>经典样式</b>（只对经典选台界面生效，选新版样式时设了也没效果）。
      </p>

      <h3 id="search">搜索设置</h3>
      <p>
        电视在导航顶部选「搜索设置」，手机在设置首页的搜索框，平板在左栏顶部。可以输入名称、说明里的文字或<b>拼音首字母</b>，
        例如输入 <code>hc</code> 能找到「起播前缓冲」「清除缓存」等。搜索只认<b>新名字</b>，用旧名（如「更好的视频探测」）搜不到，可以先查本页的对照表。
      </p>
      <ul>
        <li>单选项在搜索结果里按 OK 直接弹出同样的选择面板，开关原地切换，带箭头的项直接进入子页；</li>
        <li>其余项跳到所在分类页；</li>
        <li>手机上结果按分类分组显示。</li>
      </ul>

      <h2 id="categories">分类速查</h2>
      <table>
        <thead>
          <tr><th>组</th><th>分类</th><th>小节</th><th>详细文档</th></tr>
        </thead>
        <tbody>
          <tr><td rowspan="4">观看</td><td><a [routerLink]="'/settings'" fragment="source">订阅源与节目单</a></td><td>订阅源 · 节目单 · 频道整理</td><td><a [routerLink]="'/sources'">订阅源</a>、<a [routerLink]="'/epg'">节目单</a>、<a [routerLink]="'/channels'">频道、收藏与搜索</a></td></tr>
          <tr><td><a [routerLink]="'/settings'" fragment="player">播放</a></td><td>常用 · 播不了或卡顿时 · 离开播放页时 · 网页源</td><td><a [routerLink]="'/player-settings'">播放器与字幕设置</a>、<a [routerLink]="'/webview-player'">WebView 播放器</a></td></tr>
          <tr><td><a [routerLink]="'/settings'" fragment="enhance">字幕与画质</a></td><td>字幕 · 画质</td><td><a [routerLink]="'/player-settings'">播放器与字幕设置</a>、<a [routerLink]="'/translation'">实时字幕与翻译</a></td></tr>
          <tr><td><a [routerLink]="'/settings'" fragment="channels">选台与频道列表</a></td><td>选台界面 · 频道列表 · 播放时</td><td><a [routerLink]="'/live-screen'">直播主界面</a></td></tr>
          <tr><td rowspan="2">个性化</td><td><a [routerLink]="'/settings'" fragment="look">外观</a></td><td>主题 · 语言与启动 · 大小 · 屏幕时钟</td><td>本页</td></tr>
          <tr><td><a [routerLink]="'/settings'" fragment="control">遥控与手势</a></td><td>换台 · 遥控器按键 · 长按 · 全屏手势</td><td><a [routerLink]="'/controls'">遥控器与触屏操作</a></td></tr>
          <tr><td rowspan="3">连接与数据</td><td><a [routerLink]="'/settings'" fragment="cast">投屏与扩展</a></td><td>投屏 · 脚本服务 · 可下载组件</td><td>本页、<a [routerLink]="'/python-services'">服务（Python / PHP）</a></td></tr>
          <tr><td><a [routerLink]="'/settings'" fragment="network">网络与代理</a></td><td>下载失败时 · 代理</td><td>本页</td></tr>
          <tr><td><a [routerLink]="'/settings'" fragment="sync">备份与同步</a></td><td>云同步 · 本机</td><td><a [routerLink]="'/sync'">云同步与备份</a></td></tr>
          <tr><td rowspan="2">系统</td><td><a [routerLink]="'/settings'" fragment="app">应用与系统</a></td><td>开机 · 更新 · 存储与权限</td><td>本页</td></tr>
          <tr><td><a [routerLink]="'/settings'" fragment="debug">帮助与诊断</a></td><td>排查播放问题 · 流畅度</td><td>本页</td></tr>
        </tbody>
      </table>
      <p>多屏同播没有设置项，它的用法见 <a [routerLink]="'/multiview'">多屏同播</a>。</p>

      <h2 id="source">订阅源与节目单</h2>
      <p>直播源从哪来、节目单从哪来、频道怎么整理。详见 <a [routerLink]="'/sources'">订阅源</a>、<a [routerLink]="'/epg'">节目单</a>、<a [routerLink]="'/channels'">频道、收藏与搜索</a>。</p>
      <table>
        <thead>
          <tr><th>小节</th><th>设置项（括号内为原名）</th></tr>
        </thead>
        <tbody>
          <tr><td>订阅源</td><td>订阅源（自定义订阅源，进入订阅源列表）、订阅源多久更新一次（订阅源缓存时间）、网页源线路（自动添加网页源）、央视频账号（网页源央视频Cookie）</td></tr>
          <tr><td>节目单</td><td>显示节目单（节目单启用）、节目单地址（自定义节目单，进入节目单列表）、优先用订阅源自带的节目单（跟随订阅源）、节目单每天几点后更新（刷新时间阈值）</td></tr>
          <tr><td>频道整理</td><td>隐藏分组（分类隐藏）、按名称隐藏频道（隐藏频道规则）、频道别名、合并同一个频道（相似频道合并）、台标地址（频道图标提供）、统一使用上面的台标（频道图标覆盖）、密码保护分组（支持加密频道组）</td></tr>
          <tr><td>高级设置</td><td>为运营商直播源开启回看（PLTV转TVOD）、读取分组附加参数（分组级参数）、同时加载全部节目单（加载全部节目单）</td></tr>
        </tbody>
      </table>

      <h2 id="player">播放</h2>
      <p>播放内核、画面比例、打不开或卡顿时怎么办、离开播放页后怎样。详见 <a [routerLink]="'/player-settings'">播放器与字幕设置</a>，网页源一节见 <a [routerLink]="'/webview-player'">WebView 播放器</a>。</p>
      <table>
        <thead>
          <tr><th>小节</th><th>设置项（括号内为原名）</th></tr>
        </thead>
        <tbody>
          <tr><td>常用</td><td>播放内核（视频播放器内核）、画面比例（全局显示模式）、换台时先黑屏（换台时黑屏，原在界面）、音量均衡（音量平衡）、广播频道显示背景图（音频屏保）</td></tr>
          <tr><td>播不了或卡顿时</td><td>多久打不开就换线路（加载超时）、起播前缓冲（播放缓冲，现在一律按秒设置，带三档预设）、画面卡住时自动重连（停滞重试）</td></tr>
          <tr><td>离开播放页时</td><td>画中画小窗（画中画）、后台继续播放声音（后台播放），两项原在通用，二选一</td></tr>
          <tr><td>网页源</td><td>网页源播放（原 WebView 分类，进入子页：网页内核、加载与显示、清除 WebView 缓存）</td></tr>
          <tr>
            <td>高级设置</td>
            <td>
              记住每个频道的播放方式（记忆播放器和解码配置）、按地址指定内核（正则解码配置）、使用软件解码（强制软解）、只对声音用软件解码（软解仅用于音频）、
              隧道播放（Media3 隧道解码）、优先选 AAC 音轨（AAC 优先）、更仔细地识别视频格式（更好的视频探测）、换台前先停止上一个频道（停止上一媒体项）、
              画面渲染方式（渲染方式）、自动切换屏幕刷新率（适配视频内容帧率）、识别不到帧率时使用（使用兜底刷新率）、回看拖动方式（SeekTo方式）、EPG时间轴、
              RTSP 传输协议（RTSP 传输方式）、读取链接里的请求头（在链接中提取 Header）
            </td>
          </tr>
        </tbody>
      </table>
      <p>代理、全局 UA、自定义请求头、自定义 DNS 不在这里了，搬到了 <a [routerLink]="'/settings'" fragment="network">网络与代理</a>。</p>

      <h2 id="enhance">字幕与画质</h2>
      <p>没有高级设置，四项都进入子页。详见 <a [routerLink]="'/player-settings'">播放器与字幕设置</a> 和 <a [routerLink]="'/translation'">实时字幕与翻译</a>。</p>
      <table>
        <thead>
          <tr><th>小节</th><th>设置项（括号内为原名）</th></tr>
        </thead>
        <tbody>
          <tr><td>字幕</td><td>AI 实时字幕（实时字幕 (ASR)，Beta）、字幕翻译（Beta）、字幕样式（原 界面 → 字幕设置，改成了带预览的新页面）</td></tr>
          <tr><td>画质</td><td>画质增强（视频增强与插帧，实验性）：视频超分、视频插帧、插帧目标帧率、AI 超分执行后端</td></tr>
        </tbody>
      </table>

      <h2 id="channels">选台与频道列表</h2>
      <p>按 OK 弹出的选台界面、频道列表里显示什么、播放时屏幕上显示什么。详见 <a [routerLink]="'/live-screen'" fragment="ui-settings">直播主界面 → 选台与频道列表设置</a>。</p>
      <table>
        <thead>
          <tr><th>小节</th><th>设置项（括号内为原名）</th></tr>
        </thead>
        <tbody>
          <tr><td>选台界面</td><td>选台界面样式（新版 / 经典，原「经典选台界面」开关）、显示订阅源列表、显示频道详情（显示频道信息）、频道号和台标一起显示（单独显示频道号）、节目单一直展开（经典选台界面节目单常显，原在节目单）、「全部频道」分组（显示全部频道）、收藏（启用收藏）、最近观看（启用最近观看）</td></tr>
          <tr><td>频道列表</td><td>显示台标（台标显示）、显示节目进度（节目进度）、频道预览画面（频道预览）、预览加载速度（新增：省流量 / 均衡 / 快速）、列表动画（列表项动画）</td></tr>
          <tr><td>播放时</td><td>换台时显示信息条（换台时显示频道信息）、一直显示节目进度（常驻节目进度）、看回放时显示「回放」标记（显示回放标志）</td></tr>
          <tr><td>高级设置</td><td>预览同时加载几个（频道预览并行数）、分批加载预览（列表懒渲染）、每批加载几个（懒渲染每批并行数）、每批间隔（懒渲染间隔）</td></tr>
        </tbody>
      </table>

      <h2 id="look">外观</h2>
      <table>
        <thead>
          <tr><th>小节</th><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td rowspan="3">主题</td><td>深浅模式（原 颜色模式）</td><td>浅色 / 深色 / 跟随系统（默认）</td></tr>
          <tr><td>配色（原 配色方案）</td><td>界面配色来源：内置颜色（默认）/ 基于背景颜色 / 朴素颜色。Android 12 及以上，「内置颜色」跟随系统壁纸取色。</td></tr>
          <tr><td>自定义主题</td><td>进入「主题」子页：内置主题卡片、自定义主题和「恢复默认」，见下文 <a [routerLink]="'/settings'" fragment="theme">主题</a>。</td></tr>
          <tr><td rowspan="3">语言与启动</td><td>语言（原在通用）</td><td>简体中文（默认）/ English / العربية，选中即生效，<b>无需重启</b>。</td></tr>
          <tr><td>打开应用时进入（原 启动页面，在通用）</td><td>首页（默认）/ 直播 / 节目单 / 全部频道 / 收藏 / 搜索 / 多屏同播。设为「直播」可开机直接看，此时在直播画面连按两次返回键才退出应用（第一次提示「再按一次退出」）。</td></tr>
          <tr><td>屏幕方向（原在界面）</td><td>自动（默认）/ 横屏 / 竖屏；只在手机、平板上显示，电视始终横屏。</td></tr>
          <tr><td rowspan="2">大小</td><td>界面大小（原 界面整体缩放比例）</td><td>文字和图片一起缩放：自适应（默认）/ ×0.5～×2.0（步进 0.1）；竖屏下不生效。</td></tr>
          <tr><td>文字大小（原 界面字体缩放比例）</td><td>只缩放文字：×0.5～×2.0（步进 0.1），默认 ×1.0。</td></tr>
          <tr><td>屏幕时钟</td><td>播放时显示时间（原 时间显示）</td><td>播放界面右上角时钟：不显示 / 一直显示 / 整点（默认）/ 半点；整点、半点为该时刻前后 30 秒显示。</td></tr>
        </tbody>
      </table>

      <h3 id="theme">主题</h3>
      <p>
        <b>设置 → 外观 → 自定义主题</b> 进入「主题」子页：顶部「<b>恢复默认</b>」清除当前主题、回到默认外观；下面是多组内置主题卡片，点击应用整套背景与配色，并按背景图自动生成主题色。
      </p>
      <p>
        子页里的「<b>自定义主题</b>」（或网页面板的「外观」页）可设主题名称、<b>背景、贴图和贴图透明度</b>（0～1）；
        背景与贴图支持 base64、http(s) 网络链接或 <code>file:///</code> 开头的电视本地文件，适合把全家福、风景照设为背景。
      </p>

      <h2 id="control">遥控与手势</h2>
      <p>
        换台方式，以及遥控器每个键、全屏每种手势做什么。电视只显示「换台」「遥控器按键」「长按」，竖屏手机只显示「换台」「全屏手势」，横屏手机和平板全部显示。
        详见 <a [routerLink]="'/controls'">遥控器与触屏操作</a>。
      </p>
      <table>
        <thead>
          <tr><th>小节</th><th>设置项（括号内为原名）</th></tr>
        </thead>
        <tbody>
          <tr><td>换台</td><td>到头后从另一端继续（频道列表首尾循环）、跨分组换台（频道切换跨分组）</td></tr>
          <tr><td>遥控器按键</td><td>上键、下键、左键、右键、确认键</td></tr>
          <tr><td>长按</td><td>长按确认键、长按上键、长按下键、长按左键、长按右键</td></tr>
          <tr><td>全屏手势</td><td>左侧 / 中间 / 右侧的上滑与下滑（共 6 项）、左滑、右滑、单击画面、长按画面</td></tr>
        </tbody>
      </table>
      <p>原来「控制」里的「按键/滑动行为」子页已取消，各项直接列在这一页；左滑 / 右滑与左键 / 右键、单击画面 / 长按画面与确认键 / 长按确认键是同一项设置。</p>

      <h2 id="cast">投屏与扩展</h2>
      <table>
        <thead>
          <tr><th>小节</th><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td rowspan="2">投屏</td>
            <td>接收投屏（原 通用 → 投屏接收）</td>
            <td>
              默认关。开启后，同一局域网内支持 DLNA / AirPlay 推送的应用（系统投屏、视频类 App）可以把视频推到本机播放。
              安装下方「组件下载」里的「AirPlay 投屏组件」后还支持 iPhone 屏幕镜像与音频、手机端暂停/拖进度与 H.265 镜像（Android 7.0+，未装则 AirPlay 仅视频推送）；组件随应用更新，版本不匹配时在组件页重新下载即可。
              Miracast（Windows「连接」等源端）在设备支持 Wi-Fi 直连时自动可用，需在 设置 → 应用与系统 → 权限 授权「附近设备/Wi-Fi 直连」；Google Cast 接收为实验性（本应用互投可用，官方发送端的设备认证不支持）。
            </td>
          </tr>
          <tr><td>设备名称与投屏状态</td><td>进入「投屏接收」子页：修改投屏设备列表里显示的名称（留空用本机型号），查看本机地址以及 DLNA、AirPlay、Miracast、Google Cast 各自是运行中、未启用还是不可用（并写明原因）。</td></tr>
          <tr><td>脚本服务</td><td>脚本服务（原「服务」分类）</td><td>添加、编辑、启停 Python / PHP 服务，查看日志与地址，详见 <a [routerLink]="'/python-services'">服务（Python / PHP）</a>。</td></tr>
          <tr><td>可下载组件</td><td>组件下载（原独立分类）</td><td>所有需要在线下载的组件，见下文。</td></tr>
        </tbody>
      </table>

      <h3 id="components">组件下载</h3>
      <doc-shot
        src="screenshots/app-components.png"
        alt="电视端组件下载页：Python 运行环境、PHP 运行环境、语音识别组件等"
        caption="组件下载页（旧版截图，页头路径与部分名称已变，操作方式相同）。每行右侧显示状态（未下载 / 下载中 / 已安装…），按 OK 下载，长按 OK 删除。"
      />
      <p>
        <b>设置 → 投屏与扩展 → 组件下载</b> 统一管理所有需要在线下载的组件。每行显示名称、用途和状态
        （未下载 / 下载中 / 校验中 / 解压中 / 已安装 / 下载失败）；按 <b>OK 开始下载</b>，已安装的组件
        <b>长按 OK 删除</b>（删除后要用得重新下载）。
      </p>
      <table>
        <thead>
          <tr><th>组件</th><th>用途</th></tr>
        </thead>
        <tbody>
          <tr><td>Python 运行环境</td><td>CPython 3.11 + 标准库，按设备 ABI 下载（约 7MB），运行 Python 脚本服务的前提；需要 Android 7.0 及以上。详见 <a [routerLink]="'/python-services'">服务（Python / PHP）</a></td></tr>
          <tr><td>PHP 运行环境</td><td>PHP 8.4 + 常用扩展（curl/openssl/json 等），按设备 ABI 下载，运行 PHP 脚本服务的前提</td></tr>
          <tr><td>AirPlay 投屏组件</td><td>接收 iPhone、iPad 的屏幕镜像和音频，按设备 ABI 下载（约 3～5MB）；安装后重开「接收投屏」或重启应用生效</td></tr>
          <tr><td>语音识别组件（原 语音识别运行库（sherpa-onnx））</td><td>AI 实时字幕的识别引擎；此处只提供下载，删除在实时字幕设置或模型处管理</td></tr>
          <tr><td>AI Lite ONNX运行库 + AI 模型</td><td>AI Lite 实时超分所需的运行库与模型，两项合并下载、合并显示进度</td></tr>
          <tr><td>RIFE 补帧运行库</td><td>RIFE Vulkan 实时插帧，在「字幕与画质 → 画质增强」中选用</td></tr>
          <tr><td>Real-ESRGAN 超分运行库</td><td>Real-ESRGAN Vulkan 实时超分辨率</td></tr>
          <tr><td>VLC播放组件</td><td>VLC 播放内核；下载后「播放 → 播放内核」才能选 VLC</td></tr>
          <tr><td>IJK播放组件</td><td>IJK 播放内核；下载后才能选 IJK</td></tr>
          <tr><td>语音识别模型</td><td>按 云端 / 中文 / 英文 / 多语言 / 其他语言 分组；标注「云端」的模型无需下载，本地模型点击下载、长按删除</td></tr>
        </tbody>
      </table>
      <p>这些组件分别在 <a [routerLink]="'/python-services'">服务</a>、上文「接收投屏」和 <a [routerLink]="'/player-settings'">播放器与字幕设置</a> 中使用。</p>

      <h2 id="network">网络与代理</h2>
      <table>
        <thead>
          <tr><th>小节</th><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td rowspan="2">下载失败时</td><td>重试次数（原 HTTP请求重试次数）</td><td>获取订阅源、节目单失败时的重试次数，默认 10；可选 1～10、15、20、30、40、50。</td></tr>
          <tr><td>重试间隔（原 HTTP请求重试间隔时间）</td><td>每次重试之间的间隔，默认 1 秒；可选 0 / 1 / 2 / 3 / 5 / 10 / 15 / 20 / 30 秒。</td></tr>
          <tr><td rowspan="2">代理</td><td>代理服务器（原 播放器 → 代理）</td><td>填 <code>http://</code> 或 <code>socks5://</code> 开头的地址。只有命中下一项规则的地址才走代理。</td></tr>
          <tr><td>哪些地址走代理（原 代理规则）</td><td>子页里逐条添加正则规则，地址匹配时改走指定代理。</td></tr>
          <tr><td rowspan="3">高级设置</td><td>浏览器标识（UA）（原 全局UA）</td><td>播放请求默认带的 User-Agent，有些源只认特定标识。</td></tr>
          <tr><td>附加请求头（原 自定义headers）</td><td>每个播放请求都带上的请求头，每行一个，格式 <code>Key: Value</code>。</td></tr>
          <tr><td>DNS 服务器（原 自定义DNS）</td><td>域名解析失败或被劫持时填写；仅 Media3 内核生效。</td></tr>
        </tbody>
      </table>
      <p>
        重试两项只影响订阅源与节目单数据的获取；源地址不稳定、经常加载失败时可适当调大重试次数。
        代理、UA、请求头和 DNS 原来在「播放器」里，详细用法仍见 <a [routerLink]="'/player-settings'">播放器与字幕设置</a>。
      </p>

      <h2 id="sync">备份与同步</h2>
      <p>详见 <a [routerLink]="'/sync'">云同步与备份</a>。</p>
      <table>
        <thead>
          <tr><th>小节</th><th>设置项（括号内为原名）</th></tr>
        </thead>
        <tbody>
          <tr><td>云同步</td><td>存到哪里（云同步服务商）、所选方式的凭据项、同步（「上传到云端」「从云端恢复」两个按钮，原来的推送 / 拉取）、打开应用时自动恢复（自动拉取）</td></tr>
          <tr><td>本机</td><td>本机备份（备份管理，原在通用）、允许系统备份（系统备份）</td></tr>
        </tbody>
      </table>

      <h2 id="app">应用与系统</h2>
      <table>
        <thead>
          <tr><th>小节</th><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td rowspan="2">开机</td>
            <td>开机自动打开（原 开机自启）</td>
            <td>设备开机后自动启动应用，默认关。部分电视和盒子会拦截自启，开了没反应属设备限制，可能还要在系统设置里允许。与下一项互斥。</td>
          </tr>
          <tr>
            <td>开机只启动后台服务（原 开机静默自启）</td>
            <td>设备开机后只在后台启动 HTTP 服务（含网页面板与已启用的脚本服务），不显示应用界面，适合把盒子当常驻服务器给局域网其他设备提供直播。默认关；与上一项互斥。节目单与订阅源仍要等打开应用后才加载。</td>
          </tr>
          <tr><td rowspan="2">更新</td><td>更新渠道（原 更新通道）</td><td>正式版（默认）/ 测试版 / 开发版，切换后立即检查一次该渠道的新版本，见下文 <a [routerLink]="'/settings'" fragment="update">更新</a>。</td></tr>
          <tr><td>有新版本时弹窗提醒（原 更新强提醒）</td><td>默认关。开 = 只要还有新版本，每次启动都全屏提醒，忽略只跳过这一次；关 = 仅消息提示，同一版本只提示一次。</td></tr>
          <tr><td rowspan="4">存储与权限</td><td>清除缓存</td><td>右侧显示当前占用，按「清除」清空台标、预览图等临时文件，提示「缓存已清除」，不影响设置与收藏。</td></tr>
          <tr><td>缓存放到外部存储（原 缓存写入外部存储）</td><td>默认关。开启后把缓存目录放到外部存储上应用自己的目录（Android/data 下），重启应用后生效，不需要额外权限。</td></tr>
          <tr><td>权限</td><td>进入权限子页，见下文 <a [routerLink]="'/settings'" fragment="permissions">权限</a>。</td></tr>
          <tr><td>恢复初始设置（原 恢复初始化）</td><td>清空本机全部设置与数据（订阅源、收藏、观看记录等一并清除），恢复到首次安装状态。按「恢复」立即生效、没有二次确认，<b>不可撤销</b>，慎用。</td></tr>
        </tbody>
      </table>

      <h3 id="update">更新</h3>
      <p>
        「更新渠道」决定接收哪个渠道的版本：正式版（原「稳定版本」）、测试版（原「预览版本」）、开发版（原「开发版本」）。
        各渠道的区别、更新页面的使用，见 <a [routerLink]="'/build'">下载与更新</a>。
      </p>

      <h3 id="permissions">权限</h3>
      <p>
        <b>设置 → 应用与系统 → 权限</b>：点击条目跳转到系统授权界面，条目右侧图标显示当前是否已授权。
        面板没有对应页面，只能在设备上操作。
      </p>
      <table>
        <thead>
          <tr><th>权限</th><th>用途</th></tr>
        </thead>
        <tbody>
          <tr><td>安装未知应用</td><td>应用内更新、面板推送 APK 到电视安装时需要</td></tr>
          <tr><td>读取外部存储/管理全部文件</td><td>读取本地订阅源文件、本地云同步文件、语音识别模型等存储内容时需要</td></tr>
          <tr><td>通知</td><td>遥控面板、后台播放的常驻通知显示需要；Android 13 及以上需手动授权</td></tr>
          <tr><td>读取电话状态</td><td>腾讯 X5 网页内核需要；网页源用系统 WebView 时可以不开</td></tr>
          <tr><td>附近设备/Wi-Fi 直连</td><td>接收 Miracast 投屏需要</td></tr>
          <tr><td>显示在其他应用上层</td><td>投屏时从后台拉起播放器需要</td></tr>
        </tbody>
      </table>
      <p>开机自启、画中画、后台播放不在这里：开机两项在「应用与系统 → 开机」，画中画与后台播放在「播放 → 离开播放页时」。</p>

      <h2 id="debug">帮助与诊断</h2>
      <p>排查问题时使用，正常观看保持关闭即可。</p>
      <table>
        <thead>
          <tr><th>小节</th><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td rowspan="3">排查播放问题</td><td>在画面上显示播放信息（原 显示播放器信息）</td><td>默认关。显示当前播放的分辨率、编码、解码器、码率、采样率等详细信息；直播界面按 INFO 键效果相同。</td></tr>
          <tr><td>本机支持的视频格式（原 解码器信息）</td><td>子页查看系统全部解码器的能力：软解/硬解、各分辨率与码率的支持情况。选超分、插帧方案前可先看这里。</td></tr>
          <tr><td>运行日志（原「日志」分类）</td><td>见下文 <a [routerLink]="'/settings'" fragment="log">运行日志</a>。</td></tr>
          <tr><td rowspan="2">流畅度</td><td>显示性能信息</td><td>默认关。开启后所有界面（含直播）左上角浮窗显示 FPS（含近 15 秒柱状图）、帧时间、Jank 卡顿数、内存占用。</td></tr>
          <tr><td>返回时回到原来的位置（原 界面 → 焦点优化）</td><td>返回上一页时焦点回到原来的条目。开（默认）/ 关；触屏设备在部分场景闪退可尝试关闭，见 <a [routerLink]="'/faq'">常见问题</a>。</td></tr>
          <tr><td>高级设置</td><td>显示布局网格</td><td>默认关。在界面上叠加布局网格线，开发调试用。</td></tr>
        </tbody>
      </table>
      <p>网页面板的「帮助与诊断」页除上述开关外，还能<b>导出 logcat</b>：把设备的系统日志下载为 txt 文件，反馈问题时一并附上。</p>

      <h3 id="log">运行日志</h3>
      <p>
        <b>设置 → 帮助与诊断 → 运行日志</b> 显示应用运行日志的实时列表：按时间倒序、每秒自动刷新，每条包含级别、标签、内容与时间。
        只读，没有设置项。
      </p>
      <p>
        网页面板「帮助与诊断」页里嵌着的运行日志更适合细看：可按级别（ALL / INFO / ERROR / WARN / DEBUG）筛选、分页查看、手动刷新。
        注意导出的 logcat 是系统日志，和这里的应用内日志不是同一份。
      </p>

      <h2 id="general">旧版分类去哪了</h2>
      <p>改版前设置有 16 个分类，下表是它们的条目现在所在的位置。</p>
      <table>
        <thead>
          <tr><th>旧分类</th><th>现在在哪里</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>通用</td>
            <td>
              语言、启动页面 → 外观 → 语言与启动；开机自启、开机静默自启、缓存写入外部存储、清除缓存、恢复初始化 → 应用与系统；
              画中画、后台播放 → 播放 → 离开播放页时；投屏接收 → 投屏与扩展 → 投屏；备份管理 → 备份与同步 → 本机备份
            </td>
          </tr>
          <tr><td>订阅源</td><td>订阅源与节目单 → 订阅源 / 频道整理；PLTV转TVOD、分组级参数 → 同页高级设置</td></tr>
          <tr><td>服务</td><td>投屏与扩展 → 脚本服务</td></tr>
          <tr><td>节目单</td><td>订阅源与节目单 → 节目单；经典选台界面节目单常显 → 选台与频道列表 → 节目单一直展开</td></tr>
          <tr>
            <td>界面</td>
            <td>
              选台、台标、预览、进度、换台信息 → 选台与频道列表；换台时黑屏 → 播放 → 常用；时间显示、缩放、屏幕方向 → 外观；
              字幕设置 → 字幕与画质 → 字幕样式；焦点优化 → 帮助与诊断 → 返回时回到原来的位置
            </td>
          </tr>
          <tr><td>主题</td><td>外观 → 主题</td></tr>
          <tr><td>控制</td><td>遥控与手势</td></tr>
          <tr>
            <td>播放器</td>
            <td>
              内核、解码、缓冲、超时等 → 播放；实时字幕、字幕翻译、视频增强与插帧 → 字幕与画质；
              代理、代理规则、全局UA、自定义headers、自定义DNS → 网络与代理
            </td>
          </tr>
          <tr><td>组件下载</td><td>投屏与扩展 → 可下载组件 → 组件下载</td></tr>
          <tr><td>WebView</td><td>播放 → 网页源 → 网页源播放</td></tr>
          <tr><td>更新</td><td>应用与系统 → 更新</td></tr>
          <tr><td>网络</td><td>网络与代理 → 下载失败时</td></tr>
          <tr><td>云同步</td><td>备份与同步 → 云同步；系统备份 → 备份与同步 → 本机</td></tr>
          <tr><td>权限</td><td>应用与系统 → 存储与权限 → 权限</td></tr>
          <tr><td>调试</td><td>帮助与诊断（显示布局网格在高级设置）</td></tr>
          <tr><td>日志</td><td>帮助与诊断 → 运行日志</td></tr>
        </tbody>
      </table>

      <h2 id="reset">改错了怎么办</h2>
      <p>
        <b>设置 → 应用与系统 → 恢复初始设置</b> 一键清空全部设置与数据，回到首次安装状态；只想还原外观，用
        <b>设置 → 外观 → 自定义主题</b> 子页顶部的「恢复默认」单独重置主题。
      </p>
      <doc-callout kind="warn" title="恢复初始设置不可撤销" icon="warning">
        动手前先留好后路：用 <a [routerLink]="'/sync'">云同步</a>「上传到云端」，或在 设置 → 备份与同步 → 本机备份（或面板「备份与同步」页的本机备份）建一个本地快照。
        这样就算误清空，随时能把配置找回来。
      </doc-callout>
    </div>
  `,
})
export class SettingsOverviewPage {}
