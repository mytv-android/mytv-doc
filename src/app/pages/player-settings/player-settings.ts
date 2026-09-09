import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';

@Component({
  selector: 'app-player-settings',
  imports: [DocPageHeader, DocCallout, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="播放器与字幕设置"
        lead="视频播放器内核、解码、渲染、缓冲、字幕样式、ASR 实时字幕、实时翻译的完整说明。本页同时覆盖 TV 应用内设置与 10591 面板配置。"
      />

      <h2>1. 视频播放器内核</h2>
      <p>
        <b>电视直播</b>提供三种视频播放器内核，在 <b>设置 → 播放器 → 视频播放器内核</b> 中切换。
      </p>
      <table>
        <thead>
          <tr><th>内核</th><th>label</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Media3</b></td>
            <td><code>Media3</code></td>
            <td>是</td>
            <td>ExoPlayer 系。除 RTSP 单播以外基本支持全部功能。无需额外下载。</td>
          </tr>
          <tr>
            <td><b>IjkPlayer</b></td>
            <td><code>IjkPlayer</code></td>
            <td>—</td>
            <td>基于 FFmpeg。部分视频（如加密的 dash）可能无法正常使用。<b>需先在「播放器组件管理」在线下载</b>。</td>
          </tr>
          <tr>
            <td><b>VLC</b></td>
            <td><code>VLC</code></td>
            <td>—</td>
            <td>支持更多字幕格式。<b>需先在「播放器组件管理」在线下载</b>。</td>
          </tr>
        </tbody>
      </table>
      <p>
        IJK / VLC 是<b>在线下发组件</b>：在 <b>设置 → 播放器 → 播放器组件管理</b> 中点击下载，长按可删除已下载的组件。
        未下载时内核选择项和播放界面抽屉中会显示「未下载，请先到播放组件管理下载」提示；组件状态包括
        <b>未下载 / 下载中（带百分比）/ 校验中 / 解压中 / 已安装 / 下载失败</b>。
      </p>

      <h2>2. TV 应用内设置项（设置 → 播放器）</h2>

      <h3>解码与渲染</h3>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>取值 / 说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>渲染方式</td>
            <td>SurfaceView</td>
            <td>
              <b>SurfaceView</b>（默认，性能更好）/ <b>TextureView</b>（支持动画、截图等场景）。
              <b>适配视频内容帧率</b>需要使用 SurfaceView。
            </td>
          </tr>
          <tr>
            <td>强制软解</td>
            <td>关</td>
            <td>
              开启后：<b>Media3</b> 使用设备和扩展软解码器；<b>IJK / VLC</b> 禁用 MediaCodec 解码，改用 FFmpeg。
              适合硬解异常或花屏时排查，会增加 CPU 占用与功耗。
            </td>
          </tr>
          <tr>
            <td>软解仅用于音频</td>
            <td>关</td>
            <td>
              仅对 <b>Media3</b> 内核生效：开启后「强制软解」只作用于音频解码，视频仍保持硬解。
              适合音频硬解异常（无声、杂音、音画不同步）但视频硬解正常的设备。
              <b>IJK / VLC</b> 的音频始终使用 FFmpeg 解码，无需此开关。
            </td>
          </tr>
          <tr>
            <td>实时超分</td>
            <td>选项</td>
            <td>
              在设置页选择超分路径，QuickOP 可循环切换。当前可运行的是共享 GLES Surface 的 GPU 空间增强和上采样；Anime4K、Real-ESRGAN 作为待接入候选保留，不能把当前路径当成神经网络超分。
            </td>
          </tr>
          <tr>
            <td>实时插帧</td>
            <td>选项</td>
            <td>
              在设置页选择插帧路径，QuickOP 可循环切换。当前可运行的是共享 GLES Surface 的相邻帧混合；RIFE 光流插帧作为待接入候选保留，帧混合在运动场景可能出现重影。
            </td>
          </tr>
          <tr>
            <td>停止上一媒体项</td>
            <td>关</td>
            <td>换台时是否停止上一个流。关闭时换台更快，但部分设备可能出现短暂双流。</td>
          </tr>
          <tr>
            <td>适配视频内容帧率</td>
            <td>关</td>
            <td>
              开启后，播放视频时会根据检测到的场率或帧率请求系统切换显示刷新率，以减少因刷新率不匹配造成的卡顿。
              <b>需要使用 SurfaceView 渲染模式</b>。切换期间可能短暂黑屏或闪烁。若无法检测到有效场率或帧率，将使用「兜底刷新率」。
            </td>
          </tr>
          <tr>
            <td>使用兜底刷新率</td>
            <td>系统默认刷新率</td>
            <td>
              仅在「适配视频内容帧率」开启时出现。可选：
              <b>系统默认刷新率</b>（不使用兜底，保持系统默认）/
              <b>50 Hz</b>（中国、英国、德国、法国、澳大利亚等 PAL/50Hz 制式）/
              <b>59.94 Hz</b>（美国、日本、韩国、加拿大等 NTSC/59.94Hz 制式）/
              <b>60 Hz</b>（互联网视频流、部分直播源，或不确定制式时建议）。
            </td>
          </tr>
          <tr>
            <td>更好的视频探测</td>
            <td>开</td>
            <td>
              开启后播放器将尝试更准确地探测视频格式，<b>可能会增加起播时间</b>：
              <b>Media3</b> 支持缺少 AUD/IDR 的 TS 文件，并禁用 HLS 无块准备；
              <b>IJK</b> 增大探测大小和分析时长，并开启环路过滤和精确跳转；
              <b>VLC</b> 启用 android-opaque 输出。
            </td>
          </tr>
          <tr>
            <td>记忆播放器和解码配置</td>
            <td>无</td>
            <td>
              <b>无 / Host / URL</b>。按线路 Host 或完整 URL 记忆「内核 / 渲染 / 软解」配置，换台回来时自动应用。
              切换模式<b>会清空现有记忆设置</b>，请谨慎切换。
            </td>
          </tr>
        </tbody>
      </table>

      <h3>缓冲与超时</h3>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>取值 / 说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>加载超时</td>
            <td>10 秒</td>
            <td>
              预设：<b>1 / 2 / 3 / 4 / 5 / 10 / 15 / 20 / 25 / 30 / 45 / 60</b> 秒。
              影响超时换源、断线重连的触发时机；值越小换源越快，但弱网下可能误判。
            </td>
          </tr>
          <tr>
            <td>播放缓冲</td>
            <td>0</td>
            <td>
              预设：<b>0 / 1 / 2 / 3 / 4 / 5 / 6 / 7 / 8 / 9 / 10 / 15 / 20 / 25 / 30 / 45 / 60</b>。
              <b>Media3 / VLC</b>：单位为<b>秒</b>（播放前的最小缓存加载时间）；
              <b>IJK</b>：单位为<b>帧</b>（播放前的最小缓存加载帧数，约 1 秒 ≈ 30 帧）。
              列表中展示形如 <code>10 s | 300f</code> 的「秒 | 帧」双单位值。
            </td>
          </tr>
          <tr>
            <td>SeekTo 方式</td>
            <td>重载URL跳转</td>
            <td>
              <b>重载URL跳转</b>（默认）：回看节目时通过修改 URL 的 <code>startAt</code> 参数重新请求；
              <b>播放器 seekTo 跳转</b>：使用播放器原生 seekTo，依赖已缓冲内容。
            </td>
          </tr>
          <tr>
            <td>RTSP 传输方式</td>
            <td>TCP</td>
            <td><b>TCP</b>（默认，更稳定）/ <b>UDP</b>（延迟更低，但易丢包）。仅对 RTSP 源生效。</td>
          </tr>
        </tbody>
      </table>

      <h3>显示模式</h3>
      <p>
        <b>设置 → 播放器 → 全局显示模式</b>，可选：
        <b>原始 / 填充 / 裁剪 / 4:3 / 16:9（默认）/ 2.35:1</b>。
        原始保留视频原始比例；填充拉伸铺满；裁剪等比裁剪铺满；4:3、16:9、2.35:1 按指定比例适配屏幕。
      </p>

      <h3>请求与网络</h3>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>在链接中提取 Header</td>
            <td>关</td>
            <td>
              解析 <code>url|Header1=v1&amp;Header2=v2</code> 格式，以 <code>|</code> 分隔的 Header 会作为请求头附加。
              适合需要单独给某条线路加 Referer / Origin 的场景。
            </td>
          </tr>
          <tr>
            <td>全局 UA</td>
            <td><code>Mytv.Android</code></td>
            <td>全局 User-Agent。TV 端<b>只读</b>，编辑请到 10591 面板。</td>
          </tr>
          <tr>
            <td>自定义 headers</td>
            <td>空</td>
            <td>
              TV 端<b>只读</b>，无效时显示错误图标；编辑请到面板。面板格式为每行 <code>Name: Value</code>。
            </td>
          </tr>
          <tr>
            <td>自定义 DNS</td>
            <td>空</td>
            <td>自定义 DNS 服务器，<b>仅 Media3 内核生效</b>。TV 端只读；编辑请到面板。</td>
          </tr>
          <tr>
            <td>HTTP 代理</td>
            <td>空</td>
            <td>全局 HTTP 代理。TV 端只读；编辑请到面板。</td>
          </tr>
          <tr>
            <td>代理规则</td>
            <td>空</td>
            <td>
              按正则规则匹配 URL 选择不同代理，可添加 / 删除多条。TV 端只读，编辑请到面板。
              TV 端显示「共 N 条规则」。
            </td>
          </tr>
        </tbody>
      </table>

      <h3>音量</h3>
      <p>
        <b>设置 → 播放器 → 音量平衡</b>（仅 Media3）：统一均衡输出播放音量，避免不同频道音量差异过大。可选：
      </p>
      <table>
        <thead>
          <tr><th>等级</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td><b>关闭</b>（默认）</td><td>不进行额外音量均衡处理；仅支持 Media3 播放器。</td></tr>
          <tr><td><b>低</b></td><td>轻度调节，尽量保留原始动态范围；仅支持 Media3 播放器。</td></tr>
          <tr><td><b>中</b></td><td>推荐模式，兼顾人声稳定和整体听感；仅支持 Media3 播放器。</td></tr>
          <tr><td><b>高</b></td><td>更积极地压平音量波动，适合音量差异很大的源；仅支持 Media3 播放器。</td></tr>
        </tbody>
      </table>

      <h2>3. 字幕样式（设置 → 界面 → 字幕设置）</h2>
      <p>字幕样式与播放器内核无关，统一在「设置 → 界面 → 字幕设置」中配置，页面带实时预览（示例文本「示例字幕」）。</p>
      <table>
        <thead>
          <tr><th>设置</th><th>默认 / 取值</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>使用系统样式</td>
            <td>关</td>
            <td>开启后使用 Android 系统（设置 → 无障碍）中设置的字体样式，忽略下方自定义。</td>
          </tr>
          <tr>
            <td>跟随源嵌入样式</td>
            <td>关</td>
            <td>开启后使用视频源（如 MKV 内嵌字幕）自带的样式与字号。</td>
          </tr>
          <tr>
            <td>字体颜色</td>
            <td>白</td>
            <td>12 色板：红、品红、绿、蓝、青、黄、黑、深灰、灰、浅灰、白、透明。</td>
          </tr>
          <tr>
            <td>背景颜色</td>
            <td>黑</td>
            <td>同上 12 色板；实际显示受「背景透明度」控制。</td>
          </tr>
          <tr>
            <td>边框颜色</td>
            <td>黑</td>
            <td>同上 12 色板；边框类型固定为描边（OUTLINE）。</td>
          </tr>
          <tr>
            <td>窗口颜色</td>
            <td>透明</td>
            <td>同上 12 色板；窗口为字幕背后的矩形区域。</td>
          </tr>
          <tr>
            <td>字体大小</td>
            <td>—</td>
            <td>10 / 20 / 30 / … / 180，步进 10（共 18 档），单位 dp。</td>
          </tr>
          <tr>
            <td>背景透明度</td>
            <td>—</td>
            <td>0–100% 滑杆，0% 为完全透明，100% 为完全不透明。</td>
          </tr>
          <tr>
            <td>字幕位置</td>
            <td>—</td>
            <td>0–50% 滑杆，控制字幕距屏幕底部的相对位置。</td>
          </tr>
        </tbody>
      </table>

      <h2>4. ASR 实时字幕（Beta）</h2>
      <p>
        对没有字幕的直播流，<b>电视直播</b>可基于 <b>Sherpa-ONNX</b> 实时生成字幕，<b>支持 Media3 和 IJK 播放器</b>。
        首次启用会下载 Sherpa 引擎和所选模型；模型从 GitHub Releases 下载 <code>tar.bz2</code> 并解压到应用文件目录。
      </p>
      <p><b>设置 → 播放器 → 实时字幕 (ASR)</b> 子页面提供：</p>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>取值 / 说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>启用实时字幕</td>
            <td>关</td>
            <td>开启后自动识别音频并生成字幕。首次启用会下载 Sherpa 引擎（下载中 / 解压中 / 加载中 / 失败）。</td>
          </tr>
          <tr>
            <td>实验性领先字幕（HLS）</td>
            <td>关</td>
            <td>
              开启后切换为 <b>实验性领先（HLS）</b> 模式：Media3 HLS 会主动解码未来分片并提前识别；不提前显示字幕，不支持的流会自动回退。
              关闭为 <b>标准（渲染器）</b> 模式。
            </td>
          </tr>
          <tr>
            <td>领先字幕提前量</td>
            <td>500 ms</td>
            <td>
              0–10000 ms，步进 100。主动识别优先从「当前播放进度 + 该时间」的位置开始；
              如果播放列表没有这么远的未来分片，则使用能取到的最远未来分片。
            </td>
          </tr>
          <tr>
            <td>非领先路径优先流式模型</td>
            <td>开</td>
            <td>
              当 HLS 主动领先不可用或失败时，优先使用已下载的流式 ASR 模型以降低字幕延迟；
              <b>不会在播放中自动下载模型</b>。
            </td>
          </tr>
          <tr>
            <td>VAD 类型</td>
            <td>Silero</td>
            <td>
              <b>Silero</b>（默认）/ <b>TenVad</b>（中英混杂、低信噪比下更准）。语音活动检测后端。
            </td>
          </tr>
          <tr>
            <td>断句静音阈值</td>
            <td>650 ms</td>
            <td>
              100–2000 ms，步进 50。说话后静音多久触发断句。值越小断句越灵敏，但可能在短停顿时切断；
              值越大字幕更连贯，但停顿后断句延迟更长。
            </td>
          </tr>
          <tr>
            <td>识别模型</td>
            <td>—</td>
            <td>
              按<b>分类</b>分组（云端 / 中文 / 英文 / 多语言 / 其他语言），每条显示「名称 · 语言 · 大小 · 描述」。
              状态：<b>未下载 / 下载中（带百分比）/ 解压中 / 已开启 / 点击选择</b>；
              点击未下载模型触发下载，点击已下载模型切换为当前；
              <b>长按可删除已下载模型</b>（云端模型不可删除）。模型类型含离线与流式（流式可作为真正的领先字幕）。
              大陆地区 ASR 模型自动通过 GitHub 代理下载。
            </td>
          </tr>
        </tbody>
      </table>
      <doc-callout kind="warn" title="Gemini 云端模型凭据" icon="cloud">
        当选中 <b>Gemini Live Translate（云端）</b> 模型时，子页面会额外显示
        <b>Gemini API Key</b>（Google AI Studio 申请，仅存本机，不参与云同步）和
        <b>Gemini 端点</b>（留空使用官方默认端点）。这两个字段在 TV 端只读，请到 10591 面板配置。
      </doc-callout>

      <h2>5. ASR 实时翻译（Beta）</h2>
      <p>在 ASR 字幕基础上，可再接一层实时翻译，将识别结果翻译为目标语言。</p>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>取值 / 说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>翻译引擎</td>
            <td>未配置</td>
            <td>
              <b>未配置</b> / <b>腾讯翻译</b> / <b>百度翻译</b> / <b>MTranServer（自托管）</b>。<br/>
              <b>腾讯翻译</b>：需 SecretId / SecretKey（面板填）。<br/>
              <b>百度翻译</b>：需 API Key / 密钥（面板填）。<br/>
              <b>MTranServer</b>：填服务器地址（如 <code>http://192.168.1.100:8989</code>）和可选 API Token（留空表示无认证服务器）。
            </td>
          </tr>
          <tr>
            <td>目标语言</td>
            <td>en</td>
            <td>
              en / zh / ja / ko / fr / de / es / ru / pt / it / th / vi / id / ms / ar / yue（粤语）。
              翻译的目标语言代码。
            </td>
          </tr>
        </tbody>
      </table>
      <p>引擎凭据（SecretId / SecretKey / API Key / 服务器地址 / Token 等）在 TV 端均<b>只读</b>，显示「已配置 / 未配置」，编辑请到 10591 面板。</p>

      <h2>6. 10591 面板（<code>/player</code>）的全部可配置项</h2>
      <p>
        面板播放器页是<b>最完整</b>的配置入口，覆盖 TV 全部字段，且额外提供「正则解码配置」「代理规则」「ASR 凭据」等 TV 没有的可视化编辑。
      </p>

      <h3>基础</h3>
      <table>
        <thead>
          <tr><th>面板字段</th><th>类型</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>视频播放器内核</td><td>下拉</td><td>Media3 / IjkPlayer / VLC</td></tr>
          <tr><td>渲染方式</td><td>下拉</td><td>SurfaceView / TextureView</td></tr>
          <tr><td>记忆播放器和解码配置</td><td>下拉</td><td>无 / Host / URL；切换会清空现有记忆</td></tr>
          <tr><td>强制软解</td><td>开关</td><td>—</td></tr>
          <tr><td>软解仅用于音频</td><td>开关</td><td>仅 Media3 内核</td></tr>
          <tr><td>实时超分模式</td><td>下拉</td><td>关闭 / GPU 空间增强（当前可运行）/ Anime4K（待接入）/ Real-ESRGAN（VOD/待接入）</td></tr>
          <tr><td>实时插帧模式</td><td>下拉</td><td>关闭 / GPU 帧混合（当前可运行）/ RIFE 光流插帧（待接入）</td></tr>
          <tr><td>停止上一媒体项</td><td>开关</td><td>—</td></tr>
          <tr><td>适配视频内容帧率</td><td>开关</td><td>系统 &gt; 11 且需 SurfaceView</td></tr>
          <tr><td>更好的视频探测</td><td>开关</td><td>—</td></tr>
          <tr><td>在链接中提取 Header</td><td>开关</td><td>以 <code>|</code> 分隔</td></tr>
          <tr><td>全局显示模式</td><td>下拉</td><td>原始 / 填充 / 裁剪 / 4:3 / 16:9 / 2.35:1</td></tr>
          <tr><td>SeekTo 方式</td><td>下拉</td><td>重载URL跳转 / 播放器 seekTo 跳转</td></tr>
          <tr><td>加载超时</td><td>数字输入</td><td>单位毫秒（默认 10000）</td></tr>
          <tr><td>播放缓冲</td><td>数字输入</td><td>Media3 / VLC 秒、IJK 帧（默认 0）</td></tr>
          <tr><td>RTSP 传输方式</td><td>下拉</td><td>TCP / UDP</td></tr>
          <tr><td>音量平衡</td><td>下拉</td><td>关闭 / 低 / 中 / 高；仅 Media3</td></tr>
        </tbody>
      </table>

      <h3>正则解码配置（面板专属）</h3>
      <p>
        按 URL pattern 选择不同内核 / 软解策略。每条规则包含：<b>正则规则</b>、<b>内核</b>、<b>强制软解</b>。
        可添加 / 删除多条；按顺序匹配，命中即用。
      </p>

      <h3>ASR 与翻译（面板专属凭据）</h3>
      <table>
        <thead>
          <tr><th>面板字段</th><th>类型</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>实时字幕 (ASR)</td><td>开关</td><td>关闭时下面所有 ASR 子项隐藏</td></tr>
          <tr><td>识别模型</td><td>文本框</td><td>占位 <code>/storage/emulated/0/sherpa-onnx-...</code>；当前标注「暂未实现，敬请期待」</td></tr>
          <tr><td>实验性领先字幕（HLS）</td><td>下拉</td><td>标准（渲染器）/ 实验性领先（HLS）</td></tr>
          <tr><td>领先字幕提前量</td><td>数字输入</td><td>默认 500，单位 ms</td></tr>
          <tr><td>断句静音阈值</td><td>数字输入</td><td>默认 650，单位 ms</td></tr>
          <tr><td>翻译引擎</td><td>按钮组</td><td>不翻译 / 腾讯翻译 / 百度翻译 / MTranServer（自托管）</td></tr>
          <tr><td>目标语言</td><td>文本框</td><td>如 <code>en</code>；仅在选了翻译引擎时显示</td></tr>
          <tr><td>腾讯云 SecretId / SecretKey</td><td>密码框</td><td>仅腾讯翻译时显示</td></tr>
          <tr><td>百度翻译 API Key / 密钥</td><td>文本框 / 密码框</td><td>仅百度翻译时显示</td></tr>
          <tr><td>MTranServer 服务器地址 / API Token</td><td>文本框 / 密码框</td><td>仅 MTranServer 时显示</td></tr>
        </tbody>
      </table>
      <p>
        <b>注意</b>：ASR 子区所有控件修改后必须点页面上的<b>保存</b>按钮才会提交到 TV。
      </p>

      <h3>请求与代理</h3>
      <table>
        <thead>
          <tr><th>面板字段</th><th>类型</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>全局 UA</td><td>单行文本</td><td>—</td></tr>
          <tr><td>自定义 headers</td><td>多行文本</td><td>每行 <code>Name: Value</code></td></tr>
          <tr><td>自定义 DNS</td><td>单行文本</td><td>仅 Media3 内核生效</td></tr>
          <tr><td>HTTP 代理</td><td>单行文本</td><td>—</td></tr>
          <tr><td>代理规则</td><td>动态列表</td><td>每项：正则规则 + HTTP 代理；可添加 / 删除多条</td></tr>
        </tbody>
      </table>

      <h2>7. 解码器信息</h2>
      <p>
        在 <b>设置 → 调试 → 解码器信息</b> 中可查看设备支持的所有解码器，
        左侧解码器列表 / 右侧详情：软硬解、最大并发实例、颜色格式、音频码率范围、最大视频码率、视频帧率范围，
        支持/可实现的视频帧率按 360P / 480P / 720P / 1080P / 2K / 4K / 8K 列出。
      </p>

      <h2>8. 与其他功能的联动</h2>
      <ul>
        <li><b>WebView</b>：WebView 取到视频地址后，交给本节配置的「视频播放器内核」播放，两套内核独立。详见 <a [routerLink]="'/webview-player'">WebView 播放器</a>。</li>
        <li><b>EPG 回看</b>：「SeekTo 方式 = 重载URL跳转」时回看通过修改 startAt 实现。详见 <a [routerLink]="'/epg'">EPG 节目单</a>。</li>
        <li><b>订阅源</b>：m3u 的 <code>http-user-agent</code> / <code>http-referrer</code> / <code>#EXTVLCOPT</code> 等字段与「自定义 headers / UA」叠加生效。详见 <a [routerLink]="'/sources'">订阅源</a>。</li>
      </ul>
    </div>
  `,
})
export class PlayerSettingsPage {}
