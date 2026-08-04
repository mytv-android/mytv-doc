import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';

@Component({
  selector: 'app-live-screen',
  imports: [DocPageHeader, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="直播主界面（Dashboard）"
        lead="应用启动后默认进入 Dashboard 首页，承载订阅源信息、模块入口、收藏、最近观看。本页介绍组成与全部界面相关设置。"
      />

      <h2>1. Dashboard 组成</h2>
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
        <li><b>最近观看区</b>：仅当「启用最近观看」开启时显示，最多保留 15 条历史。</li>
      </ul>

      <h2>2. 直播播放器界面</h2>
      <p>
        点击「直播」或上次观看的频道卡片即进入 PlayerActivity 主界面，所有按键行为见
        <a [routerLink]="'/controls'">遥控器与触屏</a>。换台 / 切线时屏幕底部会显示<b>频道信息条</b>，包含：
      </p>
      <ul>
        <li>频道号、频道名、当前线路名（含混合源 tag，如「央视网」「央视频」「官网」）。</li>
        <li>当前 / 下一个 EPG 节目与进度条。</li>
        <li>台标 Logo（来自 m3u 的 <code>tvg-logo</code>，或自定义图标提供方）。</li>
        <li>回放标志（回看节目时左下角显示）。</li>
      </ul>

      <h2>3. TV 应用内设置项（设置 → 界面）</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>节目进度</td><td>开</td><td>在频道底部显示当前节目进度条</td></tr>
          <tr><td>常驻节目进度</td><td>关</td><td>在播放器底部常驻进度条</td></tr>
          <tr><td>台标显示</td><td>开</td><td>—</td></tr>
          <tr><td>显示回放标志</td><td>开</td><td>回看节目时在播放器左下角显示「回放」角标</td></tr>
          <tr><td>频道预览</td><td>开</td><td>显示频道预览首帧</td></tr>
          <tr><td>频道预览并行数</td><td>1</td><td>1–10；过大可能网络卡顿</td></tr>
          <tr><td>列表项动画</td><td>开</td><td>频道列表重排时的过渡动画</td></tr>
          <tr><td>列表懒渲染</td><td>关</td><td>预览抓帧按间隔分批节流</td></tr>
          <tr><td>懒渲染每批并行数</td><td>1</td><td>1–10；仅懒渲染开启时出现</td></tr>
          <tr><td>懒渲染间隔</td><td>关闭</td><td>-1=关闭 / 50 / 100 / 200 / 300 / 500 / 1000 / 2000 ms</td></tr>
          <tr><td>经典选台界面</td><td>开</td><td>经典三段式 vs 现代面板</td></tr>
          <tr><td>经典-显示订阅源列表</td><td>开</td><td>—</td></tr>
          <tr><td>经典-显示频道信息</td><td>关</td><td>—</td></tr>
          <tr><td>经典-单独显示频道号</td><td>关</td><td>无台标时显示频道名首字</td></tr>
          <tr><td>经典-显示全部频道</td><td>关</td><td>—</td></tr>
          <tr><td>换台时显示频道信息</td><td>开</td><td>换台时底部弹出信息条</td></tr>
          <tr><td>时间显示</td><td>整点</td><td>隐藏 / 常显 / 整点 / 半点（整点前后 30 秒显示）</td></tr>
          <tr><td>超时自动关闭界面</td><td>15 秒</td><td>5 / 10 / 15 / 20 / 25 / 30 秒 + 不关闭</td></tr>
          <tr><td>界面整体缩放比例</td><td>自适应</td><td>×0.5–×2.0 步进 0.1</td></tr>
          <tr><td>界面字体缩放比例</td><td>×1.0</td><td>×0.5–×2.0 步进 0.1</td></tr>
          <tr><td>字幕设置</td><td>—</td><td>子页面调整字幕样式，详见 <a [routerLink]="'/player-settings'">播放器与字幕</a></td></tr>
          <tr><td>焦点优化</td><td>开</td><td>关闭可解决触摸设备部分场景闪退</td></tr>
          <tr><td>启用收藏</td><td>开</td><td>—</td></tr>
          <tr><td>启用最近观看</td><td>开</td><td>最多保留 15 条历史</td></tr>
        </tbody>
      </table>

      <h2>4. 10591 面板（<code>/ui</code>）的全部可配置项</h2>
      <table>
        <thead>
          <tr><th>面板字段</th><th>类型</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>节目进度</td><td>开关</td><td>—</td></tr>
          <tr><td>常驻节目进度</td><td>开关</td><td>—</td></tr>
          <tr><td>台标显示</td><td>开关</td><td>—</td></tr>
          <tr><td>显示回放标志</td><td>开关</td><td>左下角「回放」角标</td></tr>
          <tr><td>显示频道预览</td><td>开关</td><td>—</td></tr>
          <tr><td>经典选台界面</td><td>开关</td><td>—</td></tr>
          <tr><td>经典-显示订阅源列表</td><td>开关</td><td>仅经典模式显示</td></tr>
          <tr><td>经典-显示频道信息</td><td>开关</td><td>仅经典模式显示</td></tr>
          <tr><td>经典-单独显示频道号</td><td>开关</td><td>仅经典模式显示</td></tr>
          <tr><td>经典-显示全部频道</td><td>开关</td><td>仅经典模式显示</td></tr>
          <tr><td>时间显示</td><td>下拉</td><td>隐藏 / 常显 / 整点 / 半点</td></tr>
          <tr><td>超时自动关闭界面</td><td>下拉</td><td>不关闭 / 5s / 10s / 15s / 30s / 1m / 5m / 10m / 30m</td></tr>
          <tr><td>界面整体缩放比例</td><td>数字输入</td><td>step 0.1</td></tr>
          <tr><td>字体缩放比例</td><td>数字输入</td><td>step 0.1</td></tr>
          <tr><td>焦点优化</td><td>开关</td><td>—</td></tr>
          <tr><td>启用频道收藏</td><td>开关</td><td>—</td></tr>
          <tr><td>启用最近观看</td><td>开关</td><td>—</td></tr>
        </tbody>
      </table>

      <h2>5. 主题（设置 → 主题 / 面板 <code>/theme</code>）</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>颜色模式</td><td>跟随系统</td><td>浅色 / 深色 / 跟随系统</td></tr>
          <tr><td>配色方案</td><td>内置颜色</td><td>内置颜色 / 基于背景颜色 / 朴素颜色</td></tr>
          <tr><td>主题包</td><td>—</td><td>TV 上从 <code>res/raw/app_themes.json</code> 加载，分组展示；选择后下载背景图并提取主题色；「恢复默认」清除当前主题</td></tr>
          <tr><td>面板-主题名称</td><td>—</td><td>自定义主题名</td></tr>
          <tr><td>面板-背景</td><td>—</td><td>base64 / 网络链接 / 本地 <code>file://</code></td></tr>
          <tr><td>面板-贴图</td><td>—</td><td>同上</td></tr>
          <tr><td>面板-贴图透明度</td><td>0</td><td>0–1，步进 0.01</td></tr>
        </tbody>
      </table>

      <h2>6. 画中画与启动页</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>画中画</td><td>关</td><td>设置 → 通用；按主页键退出播放时小窗继续播放</td></tr>
          <tr><td>启动页面</td><td>首页</td><td>设置 → 通用；首页 / 直播 / 节目单 / 全部频道 / 收藏 / 搜索 / 多屏同播</td></tr>
        </tbody>
      </table>
    </div>
  `,
})
export class LiveScreenPage {}
