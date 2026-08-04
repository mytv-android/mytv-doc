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
        lead="mytv-android 主要为遥控器设计；触屏手势会被映射为对应的遥控器按键。所有按键行为均可在「设置 → 控制 → 按键（手势）行为」中自定义。"
      />

      <h2>直播主界面按键（默认行为）</h2>
      <table>
        <thead>
          <tr><th>按键</th><th>默认行为</th><th>可自定义为</th></tr>
        </thead>
        <tbody>
          <tr><td>上方向键 / 上滑</td><td>前一频道</td><td rowspan="10">前一/后一频道、前一/后一线路、快进、快退、管理订阅源、频道列表、快捷设置、节目单、线路列表、播放控制、无操作</td></tr>
          <tr><td>下方向键 / 下滑</td><td>后一频道</td></tr>
          <tr><td>左方向键 / 左滑</td><td>前一线路</td></tr>
          <tr><td>右方向键 / 右滑</td><td>后一线路</td></tr>
          <tr><td>OK / 选择键</td><td>打开频道列表（数字选台时确认）</td></tr>
          <tr><td>长按 OK</td><td>快捷设置面板</td></tr>
          <tr><td>长按上键</td><td>管理订阅源</td></tr>
          <tr><td>长按下键</td><td>播放控制</td></tr>
          <tr><td>长按左键</td><td>节目单</td></tr>
          <tr><td>长按下右键</td><td>线路列表</td></tr>
        </tbody>
      </table>

      <h2>附加遥控键</h2>
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

      <h2>触屏 / 鼠标手势</h2>
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

      <h2>快进 / 快退</h2>
      <ul>
        <li>默认每次 ±10 秒。</li>
        <li>当 <b>SeekTo 方式 = 重载URL跳转</b> 且当前节目支持回看时，通过重载 URL 改变节目开始时间；否则直接调用 <code>seekTo</code>。</li>
        <li>持续长按方向键 / OK 仅在配置为快进/快退时持续触发。</li>
        <li>直播最多可回退 48 小时。</li>
      </ul>

      <h2>数字选台</h2>
      <p>
        在主界面直接按数字键输入频道号，OK 确认换台，返回键取消。
        可通过 <b>设置 → 控制 → 数字选台</b> 关闭（避免误触）。
      </p>

      <h2>语音控制</h2>
      <p>
        支持<b>夏杰语音</b>切台。授权 <code>com.peasun.aispeech.aiopen.control</code> 权限后，
        语音指令会触发频道切换，命中后 snackbar 提示「已为您切换至：xxx」。
      </p>

      <h2>防误触建议</h2>
      <p>「设置 → 控制」提供三类防误触开关：</p>
      <ul>
        <li><b>数字选台</b>：默认开。</li>
        <li><b>频道列表首尾循环</b>：默认开，到达列表末尾后跳到另一端。</li>
        <li><b>频道切换跨分组</b>：默认开，上下键跨分组连续换台；关闭后仅在当前分组内切换。</li>
      </ul>
      <p>
        如果只想保留最基本的"上下换台"，可在「按键（手势）行为」中把左 / 右键 / 长按都设为「无操作」。
      </p>

      <doc-callout kind="tip" title="找不到设置入口？" icon="help">
        直播主界面尝试：菜单键 → 长按 OK 键 → 双击屏幕 → 长按屏幕。Dashboard 主页直接有「设置」入口。
      </doc-callout>
    </div>
  `,
})
export class ControlsPage {}
