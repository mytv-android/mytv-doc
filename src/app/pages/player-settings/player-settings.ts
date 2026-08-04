import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocPageHeader } from '../../shared/doc-page-header';

@Component({
  selector: 'app-player-settings',
  imports: [DocPageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="播放器与字幕设置"
        lead="播放器内核、解码、渲染、缓冲、字幕、ASR 实时字幕、实时翻译的全部选项。"
      />

      <h2>播放器内核</h2>
      <p>在 <b>设置 → 播放器 → 视频播放器内核</b> 中切换：</p>
      <table>
        <thead>
          <tr><th>内核</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td><b>Media3</b>（默认）</td><td>ExoPlayer 系，除 RTSP 单播以外基本支持全部功能</td></tr>
          <tr><td><b>IjkPlayer</b></td><td>基于 FFmpeg；需先在「播放器组件管理」下载；部分加密 dash 不可用</td></tr>
          <tr><td><b>VLC</b></td><td>需先下载；支持更多字幕格式</td></tr>
        </tbody>
      </table>
      <p>
        IJK / VLC 是<b>在线下发组件</b>：在 <b>设置 → 播放器 → 播放器组件管理</b> 中下载 / 长按删除。
        未下载时内核选择项和播放界面抽屉中会显示「未下载」提示。
      </p>

      <h2>解码与渲染</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>渲染方式</td><td>SurfaceView</td><td>SurfaceView 性能好；TextureView 支持动画</td></tr>
          <tr><td>强制软解</td><td>关</td><td>Media3 用设备/扩展软解；IJK / VLC 禁用 MediaCodec 改用 FFmpeg</td></tr>
          <tr><td>停止上一媒体项</td><td>关</td><td>换台时是否停止上一个流</td></tr>
          <tr><td>适配视频内容帧率</td><td>关</td><td>需要 SurfaceView；播放时按视频帧率切换显示刷新率</td></tr>
          <tr><td>使用兜底刷新率</td><td>系统默认</td><td>仅在「适配视频内容帧率」开启时出现；可选 50Hz / 59.94Hz / 60Hz</td></tr>
          <tr><td>更好的视频探测</td><td>开</td><td>Media3 支持缺 AUD/IDR 的 TS；IJK 增大 probesize / 环路过滤；VLC 启用 android-opaque 输出</td></tr>
          <tr><td>记忆播放器和解码配置</td><td>无</td><td>可选 无 / Host / URL；按线路 URL 或 Host 记忆内核 / 渲染 / 解码配置（LRU 500 条）；切换模式会清空记忆</td></tr>
        </tbody>
      </table>

      <h2>缓冲与超时</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>可选</th></tr>
        </thead>
        <tbody>
          <tr><td>加载超时</td><td>10 秒</td><td>1 / 2 / 3 / 4 / 5 / 10 / 15 / 20 / 25 / 30 / 45 / 60 秒</td></tr>
          <tr><td>播放缓冲</td><td>0</td><td>0 / 1–10 / 15 / 20 / 25 / 30 / 45 / 60；Media3 / VLC 单位为秒、IJK 为帧</td></tr>
          <tr><td>SeekTo 方式</td><td>重载URL跳转</td><td>重载URL / 播放器 seekTo</td></tr>
          <tr><td>RTSP 传输方式</td><td>TCP</td><td>TCP / UDP</td></tr>
        </tbody>
      </table>

      <h2>显示模式</h2>
      <p><b>设置 → 播放器 → 全局显示模式</b>：原始 / 填充 / 裁剪 / 4:3 / <b>16:9（默认）</b> / 2.35:1。</p>

      <h2>请求相关</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>在链接中提取 Header</td><td>关</td><td>解析 <code>url|Header1=v1&amp;Header2=v2</code> 格式</td></tr>
          <tr><td>全局 UA</td><td><code>Mytv.Android</code></td><td>10591 面板编辑</td></tr>
          <tr><td>自定义 headers</td><td>空</td><td>10591 面板编辑，无效时显示错误图标</td></tr>
          <tr><td>自定义 DNS</td><td>空</td><td>10591 面板编辑；仅 Media3 生效</td></tr>
          <tr><td>HTTP 代理</td><td>空</td><td>10591 面板编辑</td></tr>
          <tr><td>代理规则</td><td>空</td><td>10591 面板编辑；按规则列表生效</td></tr>
        </tbody>
      </table>

      <h2>音量</h2>
      <p><b>设置 → 播放器 → 音量平衡</b>（仅 Media3）：关闭（默认）/ 低 / 中 / 高。统一均衡输出播放音量，避免不同频道音量差异过大。</p>

      <h2>字幕样式</h2>
      <p>在 <b>设置 → 界面 → 字幕设置</b> 中可调整：</p>
      <ul>
        <li>使用系统样式（Android 设置 → 无障碍中的字幕样式）</li>
        <li>跟随源嵌入样式</li>
        <li>字体颜色 / 背景颜色 / 边框颜色 / 窗口颜色：12 色板（红、品红、绿、蓝、青、黄、黑、深灰、灰、浅灰、白、透明）</li>
        <li>字体大小：10–180，步进 10</li>
        <li>背景透明度：0–100% 滑杆</li>
        <li>字幕位置：0–50% 滑杆</li>
        <li>实时预览（示例文本「示例字幕」）</li>
      </ul>

      <h2>ASR 实时字幕（Beta）</h2>
      <p>
        对没有字幕的直播流，mytv-android 可基于 <b>Sherpa-ONNX</b> 实时生成字幕，支持 Media3 和 IJK 播放器。
        首次启用会下载 Sherpa 引擎和所选模型。
      </p>
      <ul>
        <li><b>启用实时字幕</b>：默认关。</li>
        <li><b>实验性领先字幕（HLS）</b>：通过 HLS 预解码提前生成字幕，默认关。</li>
        <li><b>领先字幕提前量</b>：0–10000 ms，步进 100，默认 500。</li>
        <li><b>非领先路径优先流式模型</b>：默认开。</li>
        <li><b>VAD 类型</b>：Silero（默认）/ TenVad（中英混杂、低信噪比更准）。</li>
        <li><b>断句静音阈值</b>：100–2000 ms，步进 50，默认 650。</li>
        <li><b>模型列表</b>：按分类分组（中文 / 英文 / 多语言等），显示名称 / 语言 / 大小 / 描述；状态机：未下载 / 下载中 / 解压中 / 已开启 / 已下载；长按可删除已下载模型。大陆地区 ASR 模型自动通过 GitHub 代理下载。</li>
      </ul>

      <h2>ASR 实时翻译（Beta）</h2>
      <p>在 ASR 字幕基础上，可再接一层实时翻译：</p>
      <ul>
        <li><b>翻译引擎</b>：
          <ul>
            <li>腾讯翻译：需 SecretId / SecretKey（在 10591 面板填）。</li>
            <li>百度翻译：需 API Key / 密钥（10591 面板填）。</li>
            <li>MTranServer（自托管）：填服务器地址（如 <code>http://192.168.1.100:8989</code>）和可选 API Token。</li>
          </ul>
        </li>
        <li><b>目标语言</b>：en / zh / ja / ko / fr / de / es / ru / pt / it / th / vi / id / ms / ar / yue（粤语）。</li>
      </ul>

      <h2>解码器信息</h2>
      <p>
        在 <b>设置 → 调试 → 解码器信息</b> 中可查看设备支持的所有硬解器，
        左侧解码器列表 / 右侧详情：软硬解、最大并发实例、颜色格式、音频码率范围、最大视频码率、视频帧率范围，
        支持/可实现的视频帧率按 360P / 480P / 720P / 1080P / 2K / 4K / 8K 列出。
      </p>
    </div>
  `,
})
export class PlayerSettingsPage {}
