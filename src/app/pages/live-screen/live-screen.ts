import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocPageHeader } from '../../shared/doc-page-header';

@Component({
  selector: 'app-live-screen',
  imports: [DocPageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="直播主界面（Dashboard）"
        lead="应用启动后默认进入 Dashboard 首页，承载订阅源信息、模块入口、收藏、最近观看。"
      />

      <h2>Dashboard 组成</h2>
      <ul>
        <li>
          <b>顶部 Header</b>：
          <ul>
            <li>左侧：当前订阅源名（点击进入订阅源设置；<b>长按</b>清除该源缓存）。</li>
            <li>右侧：时钟，格式 <code>MM/dd EEE HH:mm:ss</code>，每秒刷新。</li>
          </ul>
        </li>
        <li>
          <b>导航模块网格（3 列）</b>：
          直播 / 全部频道 / 收藏（可关）/ 节目单（BETA）/ 搜索 / 设置 / 多屏同播 / 推送 / 关于。
        </li>
        <li><b>收藏区</b>：横向滚动的收藏频道卡片。</li>
        <li><b>最近观看区</b>：仅当 <code>iptvChannelHistoryEnable=true</code> 显示，最多保留 15 条历史。</li>
      </ul>

      <h2>直播播放器界面</h2>
      <p>
        点击「直播」或上次观看的频道卡片即进入 PlayerActivity 主界面，所有按键行为见
        <a href="/controls">遥控器与触屏</a>。换台 / 切线时屏幕底部会显示<b>频道信息条</b>，包含：
      </p>
      <ul>
        <li>频道号、频道名、当前线路名（含混合源 tag，如「央视网」「央视频」「官网」）。</li>
        <li>当前 / 下一个 EPG 节目与进度条。</li>
        <li>台标 Logo（来自 m3u 的 <code>tvg-logo</code>，或自定义图标提供方）。</li>
        <li>回放标志（回看节目时左上角显示）。</li>
      </ul>

      <h2>主界面相关设置</h2>
      <p>以下设置都集中在 <b>设置 → 界面</b>：</p>
      <table>
        <thead>
          <tr><th>设置</th><th>作用</th><th>默认</th></tr>
        </thead>
        <tbody>
          <tr><td>节目进度</td><td>在频道底部显示当前节目进度条</td><td>开</td></tr>
          <tr><td>常驻节目进度</td><td>在播放器底部常驻进度条</td><td>关</td></tr>
          <tr><td>台标显示</td><td>显示频道 Logo</td><td>开</td></tr>
          <tr><td>显示回放标志</td><td>回看时左上角显示「回放」角标</td><td>开</td></tr>
          <tr><td>换台时显示频道信息</td><td>换台时底部弹出信息条</td><td>开</td></tr>
          <tr><td>时间显示</td><td>隐藏 / 常显 / 整点 / 半点（整点前后 30 秒显示）</td><td>整点</td></tr>
          <tr><td>超时自动关闭界面</td><td>5/10/15/20/25/30 秒 + 不关闭</td><td>15 秒</td></tr>
          <tr><td>界面整体缩放</td><td>自适应 或 ×0.5–×2.0 步进 0.1</td><td>自适应</td></tr>
          <tr><td>界面字体缩放</td><td>×0.5–×2.0 步进 0.1</td><td>×1.0</td></tr>
          <tr><td>焦点优化</td><td>关闭可解决触摸设备部分场景闪退</td><td>开</td></tr>
        </tbody>
      </table>

      <h2>画中画</h2>
      <p>
        <b>设置 → 通用 → 画中画</b>（默认关）开启后，按主页键退出播放时将以小窗继续播放。
        由 <code>PlayerActivity</code> 的 <code>supportsPictureInPicture=true</code> 提供。
      </p>

      <h2>启动页面</h2>
      <p>
        <b>设置 → 通用 → 启动页面</b>：可选择首页（默认）/ 直播 / 节目单 / 全部频道 / 收藏 / 搜索 / 多屏同播。
      </p>
    </div>
  `,
})
export class LiveScreenPage {}
