import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';

@Component({
  selector: 'app-controls',
  imports: [DocPageHeader, DocCallout],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="遥控器与触屏操作"
        lead="电视直播主要为遥控器设计；触屏手势会被映射为对应的遥控器按键。所有按键行为均可在 TV 应用内或 10591 面板自定义。"
      />

      <h2>1. 直播主界面按键（默认行为）</h2>
      <table>
        <thead>
          <tr><th>按键</th><th>默认行为</th><th>对应 KeyDownAction</th></tr>
        </thead>
        <tbody>
          <tr><td>上方向键 / 上滑</td><td>前一频道</td><td><code>ChangeCurrentChannelToPrev</code></td></tr>
          <tr><td>下方向键 / 下滑</td><td>后一频道</td><td><code>ChangeCurrentChannelToNext</code></td></tr>
          <tr><td>左方向键 / 左滑</td><td>前一线路</td><td><code>ChangeCurrentChannelLineIdxToPrev</code></td></tr>
          <tr><td>右方向键 / 右滑</td><td>后一线路</td><td><code>ChangeCurrentChannelLineIdxToNext</code></td></tr>
          <tr><td>OK / 选择键</td><td>频道列表</td><td><code>ToChannelScreen</code></td></tr>
          <tr><td>长按 OK</td><td>快捷设置</td><td><code>ToQuickOpScreen</code></td></tr>
          <tr><td>长按上键</td><td>管理订阅源</td><td><code>ToIptvSourceScreen</code></td></tr>
          <tr><td>长按下键</td><td>播放控制</td><td><code>ToVideoPlayerControllerScreen</code></td></tr>
          <tr><td>长按左键</td><td>节目单</td><td><code>ToEpgScreen</code></td></tr>
          <tr><td>长按右键</td><td>线路列表</td><td><code>ToChannelLineScreen</code></td></tr>
        </tbody>
      </table>

      <h2>2. 可自定义的按键行为</h2>
      <p>每个按键都可重新映射到以下 13 种行为之一（枚举 <code>KeyDownAction</code>）：</p>
      <table>
        <thead>
          <tr><th>行为（中文显示）</th><th>枚举值</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>前一频道</td><td><code>ChangeCurrentChannelToPrev</code></td><td>切换到上一个频道</td></tr>
          <tr><td>后一频道</td><td><code>ChangeCurrentChannelToNext</code></td><td>切换到下一个频道</td></tr>
          <tr><td>前一线路</td><td><code>ChangeCurrentChannelLineIdxToPrev</code></td><td>切换到上一个线路</td></tr>
          <tr><td>后一线路</td><td><code>ChangeCurrentChannelLineIdxToNext</code></td><td>切换到下一个线路</td></tr>
          <tr><td>快进</td><td><code>SeekForward</code></td><td>每次 +10 秒</td></tr>
          <tr><td>快退</td><td><code>SeekBackward</code></td><td>每次 -10 秒</td></tr>
          <tr><td>管理订阅源</td><td><code>ToIptvSourceScreen</code></td><td>打开订阅源管理</td></tr>
          <tr><td>频道列表</td><td><code>ToChannelScreen</code></td><td>打开频道列表</td></tr>
          <tr><td>快捷设置</td><td><code>ToQuickOpScreen</code></td><td>打开快捷设置面板</td></tr>
          <tr><td>节目单</td><td><code>ToEpgScreen</code></td><td>打开节目单面板</td></tr>
          <tr><td>线路列表</td><td><code>ToChannelLineScreen</code></td><td>打开当前频道的线路列表</td></tr>
          <tr><td>播放控制</td><td><code>ToVideoPlayerControllerScreen</code></td><td>打开播放控制面板</td></tr>
          <tr><td>无操作</td><td><code>NoAction</code></td><td>禁用该按键</td></tr>
        </tbody>
      </table>
      <p>
        TV 端：<b>设置 → 控制 → 按键（手势）行为</b>（自定义播放界面的按键/手势行为）。
        子页面列出 10 个按键：上键/上滑、下键/下滑、左键/左滑、右键/右滑、选择键、长按选择键、长按上键、长按下键、长按左键、长按右键，每项点击后在弹出的 4 列网格中选择映射行为。
      </p>
      <p>面板：<code>/control</code> → 「按键（手势）行为」与「长按按键行为」分组，各 5 个下拉框（上/下/左/右/确认键）。</p>

      <h2>3. 附加遥控键</h2>
      <p>以下按键事件<b>不</b>走「按键（手势）行为」配置，但会在主界面触发对应面板：</p>
      <table>
        <thead>
          <tr><th>按键</th><th>作用</th></tr>
        </thead>
        <tbody>
          <tr><td>菜单 / 设置键</td><td>打开快捷设置面板</td></tr>
          <tr><td>频道线路键</td><td>切换线路面板</td></tr>
          <tr><td>音轨键</td><td>音轨面板</td></tr>
          <tr><td>字幕键</td><td>字幕面板</td></tr>
          <tr><td>信息键</td><td>切换播放器元数据显示（fps、编码、码率等）</td></tr>
          <tr><td>主页面切换键</td><td>回到 Dashboard</td></tr>
          <tr><td>节目单键</td><td>节目单面板</td></tr>
          <tr><td>全局 EPG 切换键</td><td>跳到独立的 EpgGuideActivity（完整 EPG 导航页）</td></tr>
          <tr><td>数字键 0–9</td><td>数字选台（默认开，可在「设置 → 控制 → 数字选台」关闭）</td></tr>
          <tr><td>返回键</td><td>退出当前面板；数字选台中取消输入；连续按两次退出应用</td></tr>
        </tbody>
      </table>

      <h2>4. 触屏 / 鼠标手势</h2>
      <table>
        <thead>
          <tr><th>手势</th><th>等价按键</th><th>作用</th></tr>
        </thead>
        <tbody>
          <tr><td>屏幕上下滑动</td><td>方向上 / 下</td><td>切换频道</td></tr>
          <tr><td>屏幕左右滑动</td><td>方向左 / 右</td><td>切换线路</td></tr>
          <tr><td>单击屏幕</td><td>OK</td><td>打开频道列表</td></tr>
          <tr><td>长按屏幕</td><td>长按 OK</td><td>快捷设置面板</td></tr>
          <tr><td>双击屏幕</td><td>菜单键</td><td>快捷设置面板</td></tr>
        </tbody>
      </table>

      <h2>5. 快进 / 快退</h2>
      <ul>
        <li>默认每次 ±10 秒。</li>
        <li>当 <b>SeekTo 方式 = 重载URL跳转</b> 且当前节目支持回看时，通过重载 URL 改变节目开始时间；否则直接调用 <code>seekTo</code>。</li>
        <li>持续长按方向键 / OK 仅在配置为快进/快退（<code>SeekForward</code> / <code>SeekBackward</code>）时持续触发。</li>
        <li>直播最多可回退 48 小时。</li>
      </ul>

      <h2>6. 数字选台</h2>
      <p>
        在主界面直接按数字键输入频道号，OK 确认换台，返回键取消。
        可通过 <b>设置 → 控制 → 数字选台</b> 关闭（避免误触）。
        开关默认开，配置项 <code>iptvChannelNoSelectEnable</code>，说明文案为「通过数字键选择频道」。
      </p>

      <h2>7. TV 应用内设置项（设置 → 控制）</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th><th>配置项</th></tr>
        </thead>
        <tbody>
          <tr><td>数字选台</td><td>开</td><td>通过数字键选择频道</td><td><code>iptvChannelNoSelectEnable</code></td></tr>
          <tr><td>频道列表首尾循环</td><td>开</td><td>启用后，到达列表首尾时将循环切换到另一端</td><td><code>iptvChannelChangeListLoop</code></td></tr>
          <tr><td>频道切换跨分组</td><td>开</td><td>启用后，上下键可在所有频道间切换；关闭则仅在当前分组内切换</td><td><code>iptvChannelChangeCrossGroup</code></td></tr>
          <tr><td>按键（手势）行为</td><td>见 §1</td><td>子页面为 10 个按键（上/下/左/右/OK + 长按上/下/左/右/OK）逐一映射 13 种 KeyDownAction</td><td><code>keyDownEvent*</code> 共 10 项</td></tr>
        </tbody>
      </table>
      <p>说明文案均取自 Android <code>strings.xml</code>，与 TV 端显示完全一致。</p>

      <h2>8. 10591 面板（<code>/control</code>）的全部可配置项</h2>
      <table>
        <thead>
          <tr><th>面板字段</th><th>类型</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>数字选台</td><td>开关</td><td>同 TV</td></tr>
          <tr><td>频道列表首尾循环</td><td>开关</td><td>同 TV</td></tr>
          <tr><td>频道切换跨分组</td><td>开关</td><td>同 TV</td></tr>
          <tr><td>按键（手势）行为 - 上 / 下 / 左 / 右 / 确认键</td><td>下拉</td><td>13 种 KeyDownAction</td></tr>
          <tr><td>长按按键行为 - 上 / 下 / 左 / 右 / 确认键</td><td>下拉</td><td>同上</td></tr>
        </tbody>
      </table>

      <h2>9. 语音控制</h2>
      <p>
        支持<b>夏杰语音</b>切台。授权 <code>com.peasun.aispeech.aiopen.control</code> 权限后，
        语音指令会触发频道切换，命中后 snackbar 提示「已为您切换至：xxx」。
      </p>

      <h2>10. 防误触建议</h2>
      <p>「设置 → 控制」提供三类防误触开关：数字选台 / 频道列表首尾循环 / 频道切换跨分组。
        如果只想保留最基本的"上下换台"，可在「按键（手势）行为」中把左 / 右键 / 长按都设为「无操作」。
      </p>

      <doc-callout kind="tip" title="找不到设置入口？" icon="help">
        直播主界面尝试：菜单键 → 长按 OK 键 → 双击屏幕 → 长按屏幕。Dashboard 主页直接有「设置」入口。
      </doc-callout>
    </div>
  `,
})
export class ControlsPage {}
