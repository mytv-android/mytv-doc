import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';
import { DocShot } from '../../shared/doc-shot';

@Component({
  selector: 'app-controls',
  imports: [DocPageHeader, DocCallout, DocShot, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="遥控器与触屏"
        lead="直播界面每个键的默认作用、改键方法，以及数字选台、触屏手势和语音换台。"
      />

      <h2 id="default-keys">直播界面默认键位</h2>
      <doc-shot
        src="screenshots/app-control.png"
        alt="电视端设置 → 控制：数字选台、频道列表首尾循环、跨分组切换、按键行为"
        caption="设置 → 控制：数字选台、列表首尾循环、跨分组切换等开关，以及进入「按键（手势）行为」改绑按键的子页。"
      />
      <p>
        下表是直播界面的默认键位，均可按下一节的方法改绑。
        遥控器的<b>频道±、翻页±、小键盘±</b>键与上 / 下方向键等效，小键盘确认键与 OK 等效。
      </p>
      <table>
        <thead>
          <tr><th>按键</th><th>默认动作</th></tr>
        </thead>
        <tbody>
          <tr><td>上 / 下键</td><td>前一 / 后一频道</td></tr>
          <tr><td>左 / 右键</td><td>前一 / 后一线路</td></tr>
          <tr><td>OK（选择键）</td><td>打开选台面板</td></tr>
          <tr><td>长按 OK</td><td>快捷设置</td></tr>
          <tr><td>长按上 / 下 / 左 / 右</td><td>管理订阅源 / 播放控制 / 节目单 / 线路列表</td></tr>
          <tr><td>菜单键（部分遥控器标为设置、帮助）</td><td>快捷设置</td></tr>
          <tr><td>数字键 0–9</td><td>数字选台</td></tr>
        </tbody>
      </table>
      <p>彩色键与功能键为固定用途，不参与改绑：</p>
      <table>
        <thead>
          <tr><th>按键</th><th>作用</th></tr>
        </thead>
        <tbody>
          <tr><td>红键</td><td>线路列表</td></tr>
          <tr><td>绿键 / 音轨键</td><td>音轨选择</td></tr>
          <tr><td>黄键 / 字幕键</td><td>字幕选择</td></tr>
          <tr><td>蓝键 / F2</td><td>回首页</td></tr>
          <tr><td>INFO 键</td><td>显示 / 隐藏播放器信息（编码、解码器等）</td></tr>
          <tr><td>GUIDE 键</td><td>当前频道节目单</td></tr>
          <tr><td>「上一频道」键</td><td>打开节目单指南页（自动定位到当前频道）</td></tr>
          <tr><td>快进 / 快退键</td><td>快进 / 快退 10 秒</td></tr>
        </tbody>
      </table>
      <p>
        把方向键改绑为快进 / 快退后：单击每次 ±10 秒；长按每步 ±1 分钟，
        屏幕上方会提示本次长按累计的位移（如「+3分钟」），松手后重新计数。
      </p>

      <h2 id="remap">改键：按键（手势）行为</h2>
      <p>
        入口：<b>设置 → 控制 → 按键（手势）行为</b>。共 10 个按键 / 手势可逐项改绑，
        方向键与同方向的滑动手势是同一项配置，改一处两边同时生效：
      </p>
      <table>
        <thead>
          <tr><th>按键 / 手势</th><th>默认动作</th></tr>
        </thead>
        <tbody>
          <tr><td>上键 / 上滑</td><td>前一频道</td></tr>
          <tr><td>下键 / 下滑</td><td>后一频道</td></tr>
          <tr><td>左键 / 左滑</td><td>前一线路</td></tr>
          <tr><td>右键 / 右滑</td><td>后一线路</td></tr>
          <tr><td>选择键</td><td>频道列表</td></tr>
          <tr><td>长按选择键</td><td>快捷设置</td></tr>
          <tr><td>长按上键</td><td>管理订阅源</td></tr>
          <tr><td>长按下键</td><td>播放控制</td></tr>
          <tr><td>长按左键</td><td>节目单</td></tr>
          <tr><td>长按右键</td><td>线路列表</td></tr>
        </tbody>
      </table>
      <p>
        每个按键可指派以下 13 种动作之一：前一频道、后一频道、前一线路、后一线路、快进、快退、
        管理订阅源、频道列表、快捷设置、节目单、线路列表、播放控制、无操作。
        用电脑或手机浏览器打开<a [routerLink]="'/remote-panel'">远程配置面板</a>（下称面板）的
        <b>控制</b> 页，也能改这些键位。
      </p>
      <doc-callout kind="tip" title="屏蔽容易误按的键" icon="block">
        把容易误按的键（例如长按方向键）设为「无操作」，按下就不会有反应，其余键不受影响。
      </doc-callout>

      <h2 id="channel-switch">换台行为</h2>
      <p>
        <b>数字选台</b>：直接按数字键输入号码，屏幕右上角实时显示已输入的数字；
        停顿片刻自动换台（输入的位数越多停顿越短），按 OK 立即换台，按返回键取消输入。
        号码优先匹配订阅源里定义的频道号，其次匹配列表中的排列序号。
      </p>
      <p>其余换台行为在 <b>设置 → 控制</b>（面板的 <b>控制</b> 页同步可改）：</p>
      <table>
        <thead>
          <tr><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>数字选台</td><td>用遥控器数字键直接选台。开（默认）/ 关</td></tr>
          <tr><td>频道列表首尾循环</td><td>上下键切到列表首尾时循环到另一端。开（默认）/ 关</td></tr>
          <tr><td>频道切换跨分组</td><td>上下键在所有频道间切换；关闭后只在当前分组内上下切换。开（默认）/ 关</td></tr>
        </tbody>
      </table>

      <h2 id="touch">触屏手势</h2>
      <table>
        <thead>
          <tr><th>手势</th><th>等效操作</th></tr>
        </thead>
        <tbody>
          <tr><td>上 / 下 / 左 / 右滑动</td><td>上 / 下 / 左 / 右方向键（跟随改绑动作）</td></tr>
          <tr><td>单击屏幕</td><td>OK 键（默认打开选台面板）</td></tr>
          <tr><td>长按屏幕</td><td>长按 OK（默认打开快捷设置）</td></tr>
        </tbody>
      </table>
      <doc-callout kind="info" title="触摸设备上闪退？" icon="touch_app">
        应用面向遥控器设计。在触摸屏设备上若遇到闪退，到 <b>设置 → 界面</b> 关闭「焦点优化」，
        详见 <a [routerLink]="'/faq'">常见问题</a>。
      </doc-callout>

      <h2 id="voice">语音换台</h2>
      <p>
        安装「夏杰语音」App 后自动生效，无需任何设置：说出频道名即可换台。
        匹配时先精确后包含，避免说「CCTV1」却切到「CCTV10」。
        成功提示「已为您切换至：频道名」，找不到时提示「未找到频道」。
      </p>

      <h2 id="related-settings">相关设置入口</h2>
      <ul>
        <li>换台时屏幕底部是否显示频道信息条：<b>设置 → 界面 → 换台时显示频道信息</b>，见 <a [routerLink]="'/live-screen'">直播主界面与首页</a>。</li>
        <li>各类面板无操作后自动关闭的时长：<b>设置 → 界面 → 超时自动关闭界面</b>。</li>
        <li>回看时快进快退的跳转方式：<b>设置 → 播放器 → SeekTo方式</b>，见 <a [routerLink]="'/player-settings'">播放器与字幕</a>。</li>
        <li>播放控制界面把进度条换成 EPG 时间轴（左右键微调不变，按 OK 跳到节目开头 / 回到直播）：<b>设置 → 播放器 → SeekTo方式 → EPG时间轴</b>。</li>
      </ul>
    </div>
  `,
})
export class ControlsPage {}
