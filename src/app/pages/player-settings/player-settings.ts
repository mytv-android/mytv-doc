import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';
import { DocShot } from '../../shared/doc-shot';

@Component({
  selector: 'app-player-settings',
  imports: [DocPageHeader, DocCallout, DocShot, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="播放器与字幕"
        lead="播放内核、解码渲染、超分插帧、缓冲、画面声音、网络请求与字幕的全部设置。播放出问题，先从「内核与组件」「解码与渲染」两节入手。"
      />

      <h2 id="core">内核与组件下载</h2>
      <p>
        电视端 <b>设置 → 播放器 → 视频播放器内核</b> 切换全局默认内核；播放中也可以在快捷设置面板里临时切换。
      </p>
      <table>
        <thead>
          <tr><th>内核</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Media3</b>（默认）</td>
            <td>除 RTSP 单播以外基本支持全部功能，随 App 内置、无需下载。绝大多数情况用它。</td>
          </tr>
          <tr>
            <td><b>IjkPlayer</b></td>
            <td>基于 FFmpeg。部分视频（如加密的 DASH）可能无法正常使用。<b>需先在组件下载中安装 IJK播放组件</b>。</td>
          </tr>
          <tr>
            <td><b>VLC</b></td>
            <td>支持更多的字幕格式。<b>需先在组件下载中安装 VLC播放组件</b>。</td>
          </tr>
        </tbody>
      </table>
      <p>未下载的内核在内核选择页会显示「未下载，请先到「组件下载」中下载」。</p>

      <doc-shot
        src="screenshots/panel-player-basic.png"
        alt="网页面板播放器页：内核、渲染与解码设置"
        caption="面板 → 播放器页顶部：视频播放器内核、渲染方式、解码相关开关都在这里，改动即保存。"
      />

      <h3 id="components">组件下载（设置 → 组件下载）</h3>
      <p>
        所有需要在线下载的组件统一在 <b>设置 → 组件下载</b> 管理：点击（OK）下载，
        已安装的<b>长按可删除</b>（删除后需重新下载）。状态包括：
        未下载 / 下载中（带百分比）/ 校验中 / 解压中 / 已安装 / 下载失败。
      </p>
      <table>
        <thead>
          <tr><th>组件</th><th>用途</th></tr>
        </thead>
        <tbody>
          <tr><td>Python 运行环境</td><td>CPython 3.11 + 标准库（约 7 MB，需 Android 7.0 及以上），供「服务」使用，见 <a [routerLink]="'/python-services'">服务（Python / PHP）</a></td></tr>
          <tr><td>PHP 运行环境</td><td>PHP 8.4 + 常用扩展，供 PHP 语言的服务使用</td></tr>
          <tr><td>语音识别运行库（sherpa-onnx）</td><td>实时字幕（ASR）的识别引擎</td></tr>
          <tr><td>AI Lite ONNX运行库 + AI 模型</td><td>AI Lite 超分（运行库与模型一起下载）</td></tr>
          <tr><td>RIFE 补帧运行库</td><td>RIFE Vulkan 插帧</td></tr>
          <tr><td>Real-ESRGAN 超分运行库</td><td>Real-ESRGAN Vulkan 超分</td></tr>
          <tr><td>VLC播放组件 / IJK播放组件</td><td>VLC / IjkPlayer 播放内核</td></tr>
          <tr>
            <td>语音识别模型</td>
            <td>
              按 云端 / 中文 / 英文 / 多语言 / 其他语言 分组列出，显示语言与大小；
              标注「云端」的模型无需下载，本地模型点击下载、长按删除。与 ASR 子页里的模型列表是同一份。
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="decode">解码与渲染</h2>
      <p>
        本节中标注「仅面板」的条目只能在远程配置面板（下称面板，见
        <a [routerLink]="'/remote-panel'">远程配置面板</a>）的 <b>播放器</b> 页修改，电视端没有入口。
      </p>
      <table>
        <thead>
          <tr><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>渲染方式</td>
            <td>
              <b>SurfaceView</b>（默认，性能更好）/ <b>TextureView</b>。
              「适配视频内容帧率」需要使用 SurfaceView；画面异常时可在两者之间互换排查。
            </td>
          </tr>
          <tr>
            <td>强制软解</td>
            <td>
              开 / 关（默认）。Media3 使用设备和扩展软解码器；IJK / VLC 禁用 MediaCodec、改用 FFmpeg。
              硬解异常（花屏、绿屏、无声）时的排查手段，会增加 CPU 占用与功耗。
            </td>
          </tr>
          <tr>
            <td>软解仅用于音频</td>
            <td>
              开 / 关（默认），<b>仅 Media3 生效</b>：开启后强制软解只作用于音频，视频仍硬解。
              适合音频硬解异常（无声、杂音、音画不同步）但视频正常的设备。
              IJK / VLC 的音频始终用 FFmpeg 解码，无需此开关。
            </td>
          </tr>
          <tr>
            <td>记忆播放器和解码配置</td>
            <td>
              <b>无</b>（默认，不记忆）/ <b>Host</b>（按源的主机名记忆）/ <b>URL</b>（按源的完整链接记忆）。
              记忆后，给某个频道临时换过的内核、软解配置在换台回来时自动应用。
              <b>更改选项会清空现有记忆</b>，请谨慎切换。
            </td>
          </tr>
          <tr>
            <td>正则解码配置（仅面板）</td>
            <td>
              面板的 播放器 页可增删多条规则：正则规则 + 内核 + 强制软解。按顺序匹配线路 URL，
              命中即用——例如给某个总是花屏的源单独指定内核和软解，不影响全局设置。电视端无此入口。
            </td>
          </tr>
          <tr>
            <td>Media3 隧道解码（仅面板）</td>
            <td>
              开 / 关（默认）。开启后音视频由设备硬件直接解码输出，可降低功耗与延迟；
              部分设备不兼容，会花屏或无声，遇到即关回。属设备本地设置，不参与云同步；保存后立即生效。
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="enhancement">视频增强与插帧（实验性）</h2>
      <p>
        入口：<b>设置 → 播放器 → 视频增强与插帧</b>（带 Beta 标记）。页面顶部有红字警告：
        「相关模式涉及底层调用，不兼容的设备可能导致应用退出，请确认设备支持后使用。」
        播放中也可在快捷设置面板里临时切换超分与插帧。
      </p>
      <table>
        <thead>
          <tr><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>视频超分</td>
            <td>
              关闭超分（默认）/ Anime4K Shader（实时，适合 720p / 1080p 动漫内容）/ AMD FSR 1（EASU + RCAS）/
              SGSR1（实时，优先适合 Adreno，其他设备也可尝试）/ SGSR2（无运动矢量回退，动态画面可能拖影）/
              Arm ASR（无运动矢量回退，运动场景效果下降）/ <b>AI Lite 超分</b>（需在组件下载安装 ONNX 运行库 + 模型）/
              <b>Real-ESRGAN Vulkan</b>（需在组件下载安装运行库，准备期间先用 AMD FSR 1 输出）。
            </td>
          </tr>
          <tr>
            <td>视频插帧</td>
            <td>
              关闭插帧（默认）/ GPU 帧混合（实时，运动场景可能有混合拖影）/
              <b>RIFE Vulkan</b>（需在组件下载安装运行库，准备期间先用 GPU 帧混合）。
            </td>
          </tr>
          <tr>
            <td>插帧目标帧率</td>
            <td>
              自动跟随源帧率（默认）/ 目标 30 / 50 / 60 / 120 FPS。
              固定值会为增强输出请求对应刷新率；实际输出受设备刷新率、源帧率和处理性能影响。
            </td>
          </tr>
          <tr>
            <td>AI 超分执行后端</td>
            <td>
              自动选择（默认，优先 NNAPI，失败回退 CPU）/ NNAPI 设备加速（由系统选择 GPU、NPU 等加速实现）/
              CPU（兼容性较高，速度取决于设备 CPU）。仅对 AI Lite 超分生效。
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        不兼容的设备开启后可能花屏、卡顿甚至闪退：出问题回本页把「视频超分」「视频插帧」都关回「关闭」即可；
        想继续尝试就一次只开一项、目标帧率先选 30。详见
        <a [routerLink]="'/faq'" fragment="enhancement-crash">常见问题</a>。
      </p>

      <h2 id="smooth">流畅度与缓冲</h2>
      <table>
        <thead>
          <tr><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>适配视频内容帧率</td>
            <td>
              开 / 关（默认）。按检测到的场率 / 帧率请求系统切换显示刷新率，减少刷新率不匹配造成的卡顿。
              <b>需 SurfaceView 渲染模式</b>（Android 11 及以上）；切换期间可能短暂黑屏或闪烁。
            </td>
          </tr>
          <tr>
            <td>使用兜底刷新率</td>
            <td>
              仅在「适配视频内容帧率」开启后显示，检测不到有效帧率时使用：
              系统默认刷新率（默认，不使用兜底）/ 50 Hz（中国、欧洲、澳洲等 PAL 制式地区）/
              59.94 Hz（美、日、韩等 NTSC 制式地区）/ 60 Hz（互联网视频，或不确定制式时建议）。
            </td>
          </tr>
          <tr>
            <td>更好的视频探测</td>
            <td>开（默认）/ 关。更准确地探测视频格式（对三种内核分别启用不同优化），但可能增加起播时间。</td>
          </tr>
          <tr>
            <td>停止上一媒体项</td>
            <td>开 / 关（默认）。开启后换台前先停止上一个流；关闭时换台更快，但部分设备可能出现短暂双流。</td>
          </tr>
          <tr>
            <td>加载超时</td>
            <td>
              可选 1 / 2 / 3 / 4 / 5 / <b>10（默认）</b> / 15 / 20 / 25 / 30 / 45 / 60 秒。
              影响超时换源与断线重连的触发时机：调小换源更快，但弱网下可能误判。
            </td>
          </tr>
          <tr>
            <td>播放缓冲</td>
            <td>
              播放前的最小缓存加载量，预设 0～60 多档，默认 0。
              <b>Media3 / VLC 单位为秒，IJK 单位为帧</b>（列表以「秒 | 帧」形式展示，如 10 s | 300f）。
              经常卡顿可调到 3～5 秒。
            </td>
          </tr>
          <tr>
            <td>停滞重试</td>
            <td>
              关闭（默认）/ 3 / 5 / 8 / 10 / 15 / 20 / 30 / 45 / 60 秒。
              播放位置长时间不变时，自动重试当前线路。
            </td>
          </tr>
          <tr>
            <td>SeekTo方式</td>
            <td>
              <b>重载URL跳转</b>（默认）：回看时通过修改 URL 的 startAt 参数重新请求；
              <b>播放器seekTo跳转</b>：使用播放器原生跳转，依赖已缓冲内容。与回看相关，见
              <a [routerLink]="'/epg'">节目单</a>。
            </td>
          </tr>
          <tr>
            <td>RTSP 传输方式</td>
            <td><b>TCP</b>（默认，更稳定）/ <b>UDP</b>（延迟更低，但易丢包）。仅对 RTSP 源生效。</td>
          </tr>
        </tbody>
      </table>
      <doc-shot
        src="screenshots/panel-player-startup.png"
        alt="网页面板播放器页：更好的视频探测、加载超时、播放缓冲、停滞重试"
        caption="面板 → 播放器页的起播相关项：追求换台快就把「更好的视频探测」关掉、缓冲压到 0～1 秒；网络不稳再靠「停滞重试」兜底。"
      />

      <h2 id="av">画面与声音</h2>
      <table>
        <thead>
          <tr><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>全局显示模式</td>
            <td>
              <b>16:9</b>（默认）/ 原始 / 填充 / 裁剪 / 4:3 / 2.35:1。
              播放中也可在快捷设置面板里临时切换显示模式，并可「应用到全局」（等同修改本项）。
            </td>
          </tr>
          <tr>
            <td>音量平衡</td>
            <td>
              关闭（默认）/ 低 / 中 / 高。统一均衡各频道音量，解决不同频道音量大小不一的问题；
              日常推荐「中」。<b>仅 Media3 播放器生效</b>。
            </td>
          </tr>
          <tr>
            <td>音频屏保（仅面板）</td>
            <td>
              开 / 关（默认）。开启后，没有视频轨的纯音频频道（如广播）隐藏画面、改显当前主题背景，音频照常播放；
              切回带画面的频道自动恢复。轨道还没探测出来时不会误触发。
            </td>
          </tr>
          <tr>
            <td>AAC 优先（仅面板）</td>
            <td>
              开 / 关（默认）。多音轨时优先选择 AAC。<b>Media3、IJK 生效</b>；
              VLC 的轨道信息不带编码，无法判断，保持播放器默认选择。
              手动选过音轨的频道以记忆为准，本项不覆盖。
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="network">网络请求（仅网页面板可改）</h2>
      <p>
        以下条目影响播放器发起网络请求的方式。电视端只读（「自定义headers」格式非法时会显示错误图标，
        「代理规则」显示「共N条规则」），编辑一律在面板的 <b>播放器</b> 页（部分也可在面板首页快捷卡片修改），改动即保存。
      </p>
      <table>
        <thead>
          <tr><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>全局UA</td>
            <td>播放器网络请求的 User-Agent，默认 <code>Mytv.Android</code>。个别源站校验 UA 时才需要改。</td>
          </tr>
          <tr>
            <td>自定义headers</td>
            <td>附加到播放器请求的 HTTP 头，面板中每行一条 <code>Name: Value</code>。</td>
          </tr>
          <tr>
            <td>自定义DNS</td>
            <td>播放器域名解析使用的 DNS 服务器，<b>仅 Media3 内核生效</b>。</td>
          </tr>
          <tr>
            <td>代理</td>
            <td>
              播放器全局代理，支持 <code>http://</code> / <code>socks5://</code>，可带认证
              <code>user:pass@host:port</code>（IJK / VLC 内核的 SOCKS 认证支持有限）。
            </td>
          </tr>
          <tr>
            <td>代理规则</td>
            <td>按正则规则匹配 URL 选择不同代理，可添加多条，分流使用。</td>
          </tr>
          <tr>
            <td>在链接中提取 Header</td>
            <td>
              开 / 关（默认）。开启后支持解析 <code>url|Header1=v1&amp;Header2=v2</code> 格式，
              把 <code>|</code> 后的内容作为请求头附加。适合只需要给某条线路单独加 Referer 等请求头的场景。
              <b>此项电视端可直接修改</b>（设置 → 播放器）。
            </td>
          </tr>
        </tbody>
      </table>
      <doc-shot
        src="screenshots/panel-player-network.png"
        alt="网页面板播放器页：自定义 DNS、代理、代理规则、全局 UA、自定义 headers"
        caption="面板 → 播放器页的网络部分：自定义 DNS、代理、代理规则、全局 UA、自定义 headers——电视端都只读，只能在这里改。"
      />

      <h2 id="subtitle-style">字幕样式（设置 → 界面 → 字幕设置）</h2>
      <p>
        字幕样式与播放器内核无关，统一在 <b>设置 → 界面 → 字幕设置</b> 配置，页面下方带实时预览（示例文本「示例字幕」）。
      </p>
      <table>
        <thead>
          <tr><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>使用系统样式</td>
            <td>开 / 关（默认）。开启后使用 Android 系统（设置 → 无障碍）中的字幕样式，忽略下方自定义。</td>
          </tr>
          <tr>
            <td>跟随源嵌入样式</td>
            <td>开（默认）/ 关。开启后使用视频源（如内嵌字幕）自带的样式与字号。</td>
          </tr>
          <tr>
            <td>字体颜色</td>
            <td>默认白色。12 色色板：红、品红、绿、蓝、青、黄、黑、深灰、灰、浅灰、白、透明。</td>
          </tr>
          <tr>
            <td>背景颜色</td>
            <td>默认透明，同色板；实际深浅还受「背景透明度」控制。</td>
          </tr>
          <tr>
            <td>边框颜色</td>
            <td>默认透明，同色板；边框为描边样式。</td>
          </tr>
          <tr>
            <td>窗口颜色</td>
            <td>默认透明，同色板；窗口指字幕背后的整块矩形区域。</td>
          </tr>
          <tr>
            <td>字体大小</td>
            <td>10 ～ 180，步进 10，默认 70。</td>
          </tr>
          <tr>
            <td>背景透明度</td>
            <td>滑杆 0% ～ 100%，0% 完全透明。</td>
          </tr>
          <tr>
            <td>字幕位置</td>
            <td>滑杆 0% ～ 50%，字幕距屏幕底部的相对位置，默认 8%。</td>
          </tr>
        </tbody>
      </table>

      <h2 id="asr">实时字幕 ASR（Beta）</h2>
      <p>
        对没有字幕的直播流，在设备本地做语音识别、实时生成字幕。<b>支持 Media3 和 IJK 播放器</b>（VLC 不支持）。
        入口：<b>设置 → 播放器 → 实时字幕 (ASR)</b>。
      </p>
      <p>启用前需要准备两样东西（都在 <a href="#components">组件下载</a> 一节）：</p>
      <ol>
        <li><b>语音识别运行库（sherpa-onnx）</b>：识别引擎，首次启用实时字幕时也会自动开始下载；</li>
        <li><b>识别模型</b>：在子页模型列表或组件下载中点击下载。标注「云端」的模型无需下载，也不需要运行库。</li>
      </ol>

      <h3 id="asr-options">子页设置项</h3>
      <table>
        <thead>
          <tr><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>启用实时字幕</td>
            <td>开 / 关（默认）。开启后自动识别音频并生成字幕。</td>
          </tr>
          <tr>
            <td>实验性领先字幕（HLS）</td>
            <td>
              开 / 关（默认）。开启后 Media3 HLS 会主动解码未来分片并提前识别，让字幕更接近对白时机；
              不提前显示字幕，不支持的流自动回退为标准（渲染器）模式。
            </td>
          </tr>
          <tr>
            <td>领先字幕提前量</td>
            <td>
              滑杆 0 ～ 10000 ms（步进 100），默认 500 ms。
              主动识别从「当前播放进度 + 该时间」的位置开始；播放列表没有这么远的分片时，用能取到的最远分片。
            </td>
          </tr>
          <tr>
            <td>非领先路径优先流式模型</td>
            <td>
              开（默认）/ 关。领先字幕不可用或失败时，优先使用已下载的流式模型以降低字幕延迟；
              不会在播放中自动下载模型。
            </td>
          </tr>
          <tr>
            <td>VAD 类型</td>
            <td>Silero（默认）/ TenVad。语音活动检测后端；TenVad 在中英混杂、低信噪比下更准。</td>
          </tr>
          <tr>
            <td>断句静音阈值</td>
            <td>
              滑杆 100 ～ 2000 ms（步进 50），默认 650 ms。说话后静音多久触发断句：
              越小断句越灵敏但可能切断短停顿，越大字幕更连贯但停顿后断句更慢。
            </td>
          </tr>
        </tbody>
      </table>

      <h3 id="asr-models">识别模型</h3>
      <p>
        子页下半部分是模型列表，按 <b>云端 / 中文 / 英文 / 多语言 / 其他语言</b> 分组，
        每条显示名称、语言、大小与描述：
      </p>
      <ul>
        <li>点击未下载的模型开始下载（带进度百分比）；点击已下载的模型选用为当前模型，再点一次取消选用；</li>
        <li><b>长按删除</b>已下载的本地模型（云端模型不可删除）；</li>
        <li>同一份模型列表也在「设置 → 组件下载」中统一管理。</li>
      </ul>
      <doc-callout kind="info" title="云端 Gemini 模型" icon="cloud">
        选中 <b>Gemini Live Translate（云端）</b> 模型后，子页会多出 <b>Gemini API Key</b> 与
        <b>Gemini 端点</b> 两项（电视端只读，在面板的 播放器 页填写）：Key 在 Google AI Studio 申请，
        仅存本机、不参与云同步；端点留空使用官方默认。该模型识别与翻译一体。
        模型下载慢或失败的处理见 <a [routerLink]="'/faq'" fragment="asr-model-download">常见问题</a>。
      </doc-callout>

      <h2 id="translation">字幕翻译（Beta）</h2>
      <p>
        把实时字幕（ASR）或视频已选字幕轨翻译成目标语言，译文显示在原文<b>上方</b>。
        入口：<b>设置 → 播放器 → 字幕翻译</b>。
      </p>
      <table>
        <thead>
          <tr><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>翻译引擎</td>
            <td>
              未配置（默认，不翻译）/ <b>腾讯翻译</b>（需 SecretId、SecretKey）/ <b>百度翻译</b>（需 API Key、密钥）/
              <b>MTranServer（自托管）</b>（填服务器地址，如 <code>http://192.168.1.100:8989</code>，
              API Token 可选、留空表示无认证）。<b>凭据均在面板的 播放器 页填写</b>，电视端只显示「已配置 / 未配置」。
            </td>
          </tr>
          <tr>
            <td>目标语言</td>
            <td>
              默认 English；共 16 种：英 / 中 / 日 / 韩 / 法 / 德 / 西 / 俄 / 葡 / 意 / 泰 / 越 / 印尼 / 马来 / 阿 / 粤语。
            </td>
          </tr>
          <tr>
            <td>译文大小</td>
            <td>
              翻译字幕相对原文字幕的字号比例，×0.5 ～ ×1.5（步进 0.1），默认 ×1.0（面板可设 0.5 ～ 2.0）。
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        注意区分：云端 Gemini 模型是「实时字幕 (ASR)」里的识别模型（识别与翻译一体），
        不是这里的翻译引擎；两者互不影响，可单独使用。
      </p>

      <doc-callout kind="tip" title="面板上的两张卡片要单独保存" icon="save">
        面板的 播放器 页大部分选项改动即保存，但 <b>ASR 语音识别</b> 和 <b>字幕翻译</b> 两张卡片各有自己的
        「保存」按钮——改完识别模型、提前量、引擎凭据等，记得点卡片内的「保存」才会推送到电视。
      </doc-callout>

      <h2 id="decoder-info">解码器信息</h2>
      <p>
        <b>设置 → 调试 → 解码器信息</b> 可查看设备支持的全部解码器：软硬解、最大并发实例数、颜色格式、
        码率与帧率范围、各分辨率（360P ～ 8K）支持情况。决定换内核还是开软解之前，可以先来这里确认设备的硬解能力。
      </p>

      <doc-callout kind="tip" title="播放问题三板斧" icon="build">
        某个频道卡顿、花屏、无声时，按顺序试：
        <b>换内核</b>（视频播放器内核）→ <b>开强制软解</b> → <b>调大播放缓冲</b>（3～5 秒）。
        仍不行按 <a [routerLink]="'/faq'">常见问题</a> 的播放问题一节排查。
      </doc-callout>
    </div>
  `,
})
export class PlayerSettingsPage {}
