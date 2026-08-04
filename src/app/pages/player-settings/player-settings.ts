import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';

@Component({
  selector: 'app-player-settings',
  imports: [DocPageHeader, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="播放器与字幕设置"
        lead="视频播放器内核、解码、渲染、缓冲、字幕样式、ASR 实时字幕、实时翻译的完整说明。本页同时覆盖 TV 应用内设置与 10591 面板配置。"
      />

      <h2>1. 视频播放器内核</h2>
      <p><b>电视直播</b>提供三种视频播放器内核：</p>
      <table>
        <thead>
          <tr><th>内核</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td><b>Media3</b>（默认）</td><td>ExoPlayer 系。除 RTSP 单播以外基本支持全部功能。</td></tr>
          <tr><td><b>IjkPlayer</b></td><td>基于 FFmpeg。部分视频（如加密的 dash）可能无法正常使用。<b>需先在「播放器组件管理」在线下载</b>。</td></tr>
          <tr><td><b>VLC</b></td><td>支持更多字幕格式。<b>需先在「播放器组件管理」在线下载</b>。</td></tr>
        </tbody>
      </table>
      <p>
        IJK / VLC 是<b>在线下发组件</b>：在 <b>设置 → 播放器 → 播放器组件管理</b> 中下载 / 长按删除。
        未下载时内核选择项和播放界面抽屉中会显示「未下载」提示。
      </p>

      <h2>2. TV 应用内设置项（设置 → 播放器）</h2>

      <h3>解码与渲染</h3>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>取值 / 说明</th></tr>
        </thead>
        <tbody>
          <tr><td>渲染方式</td><td>SurfaceView</td><td>SurfaceView 性能好；TextureView 支持动画</td></tr>
          <tr><td>强制软解</td><td>关</td><td>Media3 用设备/扩展软解；IJK / VLC 禁用 MediaCodec 改用 FFmpeg</td></tr>
          <tr><td>停止上一媒体项</td><td>关</td><td>换台时是否停止上一个流</td></tr>
          <tr><td>适配视频内容帧率</td><td>关</td><td>需要 SurfaceView 且系统版本 &gt; 11；播放时按视频帧率切换显示刷新率</td></tr>
          <tr><td>使用兜底刷新率</td><td>系统默认</td><td>仅在「适配视频内容帧率」开启时出现；可选 50Hz / 59.94Hz / 60Hz（针对 PAL / NTSC / 网络流）</td></tr>
          <tr><td>更好的视频探测</td><td>开</td><td>Media3 支持缺 AUD/IDR 的 TS、禁用 HLS 无块准备；IJK 增大 probesize / 环路过滤；VLC 启用 android-opaque 输出</td></tr>
          <tr><td>记忆播放器和解码配置</td><td>无</td><td>无 / Host / URL；按线路 URL 或 Host 记忆内核 / 渲染 / 解码配置（LRU 500 条）；<b>切换模式会清空现有记忆</b></td></tr>
        </tbody>
      </table>

      <h3>缓冲与超时</h3>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>取值 / 说明</th></tr>
        </thead>
        <tbody>
          <tr><td>加载超时</td><td>10 秒</td><td>1 / 2 / 3 / 4 / 5 / 10 / 15 / 20 / 25 / 30 / 45 / 60 秒；影响超时换源、断线重连</td></tr>
          <tr><td>播放缓冲</td><td>0</td><td>0 / 1–10 / 15 / 20 / 25 / 30 / 45 / 60；Media3 / VLC 单位为秒、IJK 为帧</td></tr>
          <tr><td>SeekTo 方式</td><td>重载URL跳转</td><td>重载URL / 播放器 seekTo；回看节目时重载URL通过修改 startAt 实现</td></tr>
          <tr><td>RTSP 传输方式</td><td>TCP</td><td>TCP / UDP</td></tr>
        </tbody>
      </table>

      <h3>显示模式</h3>
      <p><b>设置 → 播放器 → 全局显示模式</b>：原始 / 填充 / 裁剪 / 4:3 / <b>16:9（默认）</b> / 2.35:1。</p>

      <h3>请求与网络</h3>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>在链接中提取 Header</td><td>关</td><td>解析 <code>url|Header1=v1&amp;Header2=v2</code> 格式</td></tr>
          <tr><td>全局 UA</td><td><code>Mytv.Android</code></td><td>TV 只读；编辑在面板</td></tr>
          <tr><td>自定义 headers</td><td>空</td><td>TV 只读，无效时显示错误图标；编辑在面板</td></tr>
          <tr><td>自定义 DNS</td><td>空</td><td>TV 只读；编辑在面板；<b>仅 Media3 内核生效</b></td></tr>
          <tr><td>HTTP 代理</td><td>空</td><td>TV 只读；编辑在面板</td></tr>
          <tr><td>代理规则</td><td>空</td><td>TV 只读；编辑在面板；按规则列表生效</td></tr>
        </tbody>
      </table>

      <h3>音量</h3>
      <p>
        <b>设置 → 播放器 → 音量平衡</b>（仅 Media3）：关闭（默认）/ 低 / 中 / 高。
        统一均衡输出播放音量，避免不同频道音量差异过大。
      </p>

      <h2>3. 字幕样式（设置 → 界面 → 字幕设置）</h2>
      <ul>
        <li>使用系统样式：使用 Android 系统（设置 → 无障碍）中设置的字体样式。</li>
        <li>跟随源嵌入样式：使用源（如 MKV 内嵌字幕）自带的样式。</li>
        <li>字体颜色 / 背景颜色 / 边框颜色 / 窗口颜色：12 色板（红、品红、绿、蓝、青、黄、黑、深灰、灰、浅灰、白、透明）。</li>
        <li>字体大小：10–180，步进 10。</li>
        <li>背景透明度：0–100% 滑杆。</li>
        <li>字幕位置：0–50% 滑杆。</li>
        <li>实时预览（示例文本「示例字幕」）。</li>
      </ul>

      <h2>4. ASR 实时字幕（Beta）</h2>
      <p>
        对没有字幕的直播流，<b>电视直播</b>可基于 <b>Sherpa-ONNX</b> 实时生成字幕，<b>支持 Media3 和 IJK 播放器</b>。
        首次启用会下载 Sherpa 引擎和所选模型。
      </p>
      <p><b>设置 → 播放器 → 实时字幕 (ASR)</b> 子页面提供：</p>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>取值 / 说明</th></tr>
        </thead>
        <tbody>
          <tr><td>启用实时字幕</td><td>关</td><td>首次启用会下载 Sherpa 引擎</td></tr>
          <tr><td>实验性领先字幕（HLS）</td><td>关</td><td>通过 HLS 预解码提前生成字幕</td></tr>
          <tr><td>领先字幕提前量</td><td>500 ms</td><td>0–10000 ms，步进 100</td></tr>
          <tr><td>非领先路径优先流式模型</td><td>开</td><td>—</td></tr>
          <tr><td>VAD 类型</td><td>Silero</td><td>Silero / TenVad（中英混杂、低信噪比更准）</td></tr>
          <tr><td>断句静音阈值</td><td>650 ms</td><td>100–2000 ms，步进 50</td></tr>
          <tr><td>识别模型</td><td>—</td><td>按分类分组（中文 / 英文 / 多语言等），显示名称 / 语言 / 大小 / 描述；状态机：未下载 / 下载中 / 解压中 / 已开启 / 已下载；长按可删除已下载模型；大陆地区 ASR 模型自动通过 GitHub 代理下载</td></tr>
        </tbody>
      </table>

      <h2>5. ASR 实时翻译（Beta）</h2>
      <p>在 ASR 字幕基础上，可再接一层实时翻译：</p>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>取值 / 说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>翻译引擎</td>
            <td>未配置</td>
            <td>
              未配置 / 腾讯翻译 / 百度翻译 / MTranServer（自托管）。<br/>
              <b>腾讯翻译</b>：需 SecretId / SecretKey（面板填）。<br/>
              <b>百度翻译</b>：需 API Key / 密钥（面板填）。<br/>
              <b>MTranServer</b>：填服务器地址（如 <code>http://192.168.1.100:8989</code>）和可选 API Token。
            </td>
          </tr>
          <tr>
            <td>目标语言</td>
            <td>—</td>
            <td>en / zh / ja / ko / fr / de / es / ru / pt / it / th / vi / id / ms / ar / yue（粤语）</td>
          </tr>
        </tbody>
      </table>

      <h2>6. 10591 面板（<code>/player</code>）的全部可配置项</h2>
      <p>面板播放器页是<b>最完整</b>的配置入口，覆盖 TV 全部字段，且额外提供「正则解码配置」「代理规则」「ASR 凭据」等 TV 没有的可视化编辑。</p>

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
          <tr><td>停止上一媒体项</td><td>开关</td><td>—</td></tr>
          <tr><td>适配视频内容帧率</td><td>开关</td><td>系统 &gt; 11 且需 SurfaceView</td></tr>
          <tr><td>更好的视频探测</td><td>开关</td><td>—</td></tr>
          <tr><td>在链接中提取 Header</td><td>开关</td><td>以 <code>|</code> 分隔</td></tr>
          <tr><td>全局显示模式</td><td>下拉</td><td>原始 / 填充 / 裁剪 / 4:3 / 16:9 / 2.35:1</td></tr>
          <tr><td>SeekTo 方式</td><td>下拉</td><td>重载URL跳转 / 播放器 seekTo 跳转</td></tr>
          <tr><td>加载超时</td><td>数字输入</td><td>单位毫秒</td></tr>
          <tr><td>播放缓冲</td><td>数字输入</td><td>Media3 / VLC 秒、IJK 帧</td></tr>
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
        在 <b>设置 → 调试 → 解码器信息</b> 中可查看设备支持的所有硬解器，
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
