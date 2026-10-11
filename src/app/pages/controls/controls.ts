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
        alt="电视端设置 → 控制：频道列表首尾循环、跨分组切换、按键行为"
        caption="设置 → 控制：列表首尾循环、跨分组切换等开关，以及进入「按键（手势）行为」改绑按键的子页。"
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
          <tr><td><kbd>上</kbd> / <kbd>下</kbd> 键</td><td>前一 / 后一频道</td></tr>
          <tr><td><kbd>左</kbd> / <kbd>右</kbd> 键</td><td>前一 / 后一线路</td></tr>
          <tr><td><kbd>OK</kbd>（选择键）</td><td>打开选台面板</td></tr>
          <tr><td>长按 <kbd>OK</kbd></td><td>快捷设置</td></tr>
          <tr><td>长按 <kbd>上</kbd> / <kbd>下</kbd> / <kbd>左</kbd> / <kbd>右</kbd></td><td>管理订阅源 / 播放控制 / 节目单 / 线路列表</td></tr>
          <tr><td><kbd>菜单</kbd> 键（部分遥控器标为设置、帮助）</td><td>快捷设置</td></tr>
          <tr><td><kbd>0</kbd>–<kbd>9</kbd> 数字键</td><td>数字选台</td></tr>
        </tbody>
      </table>
      <p>彩色键与功能键为固定用途，不参与改绑：</p>
      <table>
        <thead>
          <tr><th>按键</th><th>作用</th></tr>
        </thead>
        <tbody>
          <tr><td><kbd>红键</kbd></td><td>线路列表</td></tr>
          <tr><td><kbd>绿键</kbd> / <kbd>音轨</kbd></td><td>音轨选择</td></tr>
          <tr><td><kbd>黄键</kbd> / <kbd>字幕</kbd></td><td>字幕选择</td></tr>
          <tr><td><kbd>蓝键</kbd> / <kbd>F2</kbd></td><td>回首页</td></tr>
          <tr><td><kbd>INFO</kbd> 键</td><td>显示 / 隐藏播放器信息（编码、解码器等）</td></tr>
          <tr><td><kbd>GUIDE</kbd> 键</td><td>当前频道节目单</td></tr>
          <tr><td><kbd>上一频道</kbd> 键</td><td>打开节目单指南页（自动定位到当前频道）</td></tr>
          <tr><td><kbd>快进</kbd> / <kbd>快退</kbd> 键</td><td>快进 / 快退 10 秒</td></tr>
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
          <tr><td><kbd>上键</kbd> / 上滑</td><td>前一频道</td></tr>
          <tr><td><kbd>下键</kbd> / 下滑</td><td>后一频道</td></tr>
          <tr><td><kbd>左键</kbd> / 左滑</td><td>前一线路</td></tr>
          <tr><td><kbd>右键</kbd> / 右滑</td><td>后一线路</td></tr>
          <tr><td><kbd>选择键</kbd></td><td>频道列表</td></tr>
          <tr><td>长按 <kbd>选择键</kbd></td><td>快捷设置</td></tr>
          <tr><td>长按 <kbd>上键</kbd></td><td>管理订阅源</td></tr>
          <tr><td>长按 <kbd>下键</kbd></td><td>播放控制</td></tr>
          <tr><td>长按 <kbd>左键</kbd></td><td>节目单</td></tr>
          <tr><td>长按 <kbd>右键</kbd></td><td>线路列表</td></tr>
        </tbody>
      </table>
      <p>
        每个按键可指派以下 13 种动作之一：前一频道、后一频道、前一线路、后一线路、快进、快退、
        管理订阅源、频道列表、快捷设置、节目单、线路列表、播放控制、无操作。
        在手机或电脑浏览器中打开<a [routerLink]="'/remote-panel'">远程配置面板</a>的「控制」页面，同样可以直观配置这些按键映射。
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
      <p>其余换台行为在 <b>设置 → 控制</b>（亦可在<a [routerLink]="'/remote-panel'">远程配置面板</a>的「控制」页面中调整）：</p>
      <table>
        <thead>
          <tr><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>频道列表首尾循环</td><td>上下键切到列表首尾时循环到另一端。开（默认）/ 关</td></tr>
          <tr><td>频道切换跨分组</td><td>上下键在所有频道间切换；关闭后只在当前分组内上下切换。开（默认）/ 关</td></tr>
        </tbody>
      </table>

      <h2 id="touch">触屏手势与移动交互</h2>
      <p>
        应用全面适配了触摸屏设备，在<b>手机竖屏模式</b>与<b>电视横屏触控设备</b>下分别提供针对性的触屏手势与交互支持。
      </p>

      <h3 id="touch-portrait">手机竖屏触屏手势（移动原生）</h3>
      <doc-shot
        src="screenshots/portrait-player.png"
        [portrait]="true"
        alt="手机竖屏播放器界面与触控层"
        caption="手机竖屏播放器：顶部 16:9 视频支持单击悬浮浮层、双击暂停、上下滑切台与左右滑 Seek；下方为正在播放卡片、线路分体按钮与频道列表。"
      />
      <table>
        <thead>
          <tr><th>区域 / 元素</th><th>触屏手势</th><th>对应操作</th></tr>
        </thead>
        <tbody>
          <tr><td rowspan="4">16:9 视频区</td><td>单击画面</td><td>显示 / 隐藏顶部返回栏与底部悬浮控制栏（无操作自动淡出）</td></tr>
          <tr><td>双击画面</td><td>快速暂停 / 恢复播放</td></tr>
          <tr><td>垂直上下滑</td><td>切台：上滑切换至下一频道，下滑切换至上一频道</td></tr>
          <tr><td>水平左右滑</td><td>快进 / 快退 10 秒（进度条实时显示位移）</td></tr>
          <tr><td rowspan="4">悬浮控制栏</td><td>点击 <code>&lt;</code> / <code>&gt;</code></td><td>上一频道 / 下一频道</td></tr>
          <tr><td>点击 <code>▶</code> / <code>⏸</code></td><td>播放 / 暂停</td></tr>
          <tr><td>点击 <code>⛶</code></td><td>进入横屏全屏播放（或旋转手机横屏）</td></tr>
          <tr><td>点击比例按钮</td><td>打开画面比例选择抽屉（原始/填充/裁剪/4:3/16:9/2.35:1）</td></tr>
          <tr><td rowspan="2">正在播放卡片</td><td>点击红心图标</td><td>收藏 / 取消收藏当前频道</td></tr>
          <tr><td>点击线路按钮</td><td>左侧点击顺序轮换下一线路；右侧下拉箭头呼出 Material 3 线路测速选择抽屉</td></tr>
          <tr><td>底部抽屉（BottomSheet）</td><td>向下滑动 / 点击半透遮罩</td><td>平滑关闭抽屉弹层</td></tr>
          <tr><td>返回导航</td><td>左上角返回 / 系统手势返回</td><td>全屏横屏时返回竖屏半屏播放；竖屏播放时返回手机首页；首页连按两次退出</td></tr>
        </tbody>
      </table>

      <h3 id="touch-tv">电视横屏触控手势（触屏电视 / 平板横屏）</h3>
      <p>在横屏触屏电视或平板横屏状态下，手势等效于遥控器键位（同样跟随「按键（手势）行为」的改绑设置）：</p>
      <table>
        <thead>
          <tr><th>手势</th><th>等效操作</th></tr>
        </thead>
        <tbody>
          <tr><td>上 / 下 / 左 / 右滑动</td><td>上 / 下 / 左 / 右方向键（默认上/下换台，左/右切线路）</td></tr>
          <tr><td>单击屏幕</td><td><kbd>OK</kbd> 键（默认打开经典或现代选台面板）</td></tr>
          <tr><td>长按屏幕</td><td>长按 <kbd>OK</kbd>（默认呼出快捷设置面板）</td></tr>
        </tbody>
      </table>
      <doc-callout kind="info" title="触摸设备焦点优化" icon="touch_app">
        在纯触摸屏或车机设备上若在列表滚动时遇到焦点跳动或个别场景闪退，可进入 <b>设置 → 界面</b> 关闭「焦点优化」，详见 <a [routerLink]="'/faq'">常见问题</a>。
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
        <li>回看时快进快退的跳转方式：<b>设置 → 播放器 → SeekTo方式</b>，见 <a [routerLink]="'/player-settings'">播放器与字幕</a>。</li>
        <li>播放控制界面把进度条换成 EPG 时间轴（左右键微调不变，按 OK 跳到节目开头 / 回到直播）：<b>设置 → 播放器 → SeekTo方式 → EPG时间轴</b>。</li>
      </ul>
    </div>
  `,
})
export class ControlsPage {}
