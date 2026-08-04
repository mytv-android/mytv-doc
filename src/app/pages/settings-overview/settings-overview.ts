import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocPageHeader } from '../../shared/doc-page-header';

@Component({
  selector: 'app-settings-overview',
  imports: [DocPageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="设置项总览"
        lead="应用内 14 大类设置的完整索引。每类逐项列出名称、默认值、含义。"
      />

      <h2>分类速查</h2>
      <table>
        <thead>
          <tr><th>分类</th><th>主要包含</th><th>详细文档</th></tr>
        </thead>
        <tbody>
          <tr><td>通用</td><td>语言、开机自启、启动页、画中画、清除缓存、恢复初始化</td><td>本页 §1</td></tr>
          <tr><td>订阅源</td><td>m3u、Xtream、Stalker、混合源、缓存、隐藏、加密分组</td><td><a href="/sources">订阅源</a></td></tr>
          <tr><td>节目单</td><td>EPG 来源、刷新阈值、跟随订阅源</td><td><a href="/epg">EPG</a></td></tr>
          <tr><td>界面</td><td>台标、节目进度、信息条、缩放、字幕样式</td><td><a href="/live-screen">直播主界面</a> + 本页 §4</td></tr>
          <tr><td>主题</td><td>颜色模式、配色方案、主题包</td><td>本页 §5</td></tr>
          <tr><td>控制</td><td>数字选台、跨组切换、按键行为</td><td><a href="/controls">遥控器与触屏</a></td></tr>
          <tr><td>播放器</td><td>内核、解码、缓冲、字幕、ASR、翻译</td><td><a href="/player-settings">播放器与字幕</a></td></tr>
          <tr><td>WebView</td><td>内核、超时、替换系统 WebView</td><td><a href="/webview-player">WebView</a></td></tr>
          <tr><td>更新</td><td>通道、强提醒</td><td>本页 §9</td></tr>
          <tr><td>网络</td><td>重试次数、重试间隔</td><td>本页 §10</td></tr>
          <tr><td>云同步</td><td>Gist / WebDAV / 本地文件 / 网络链接 / Gitee</td><td><a href="/sync">云同步</a></td></tr>
          <tr><td>权限</td><td>安装未知应用、外部存储</td><td>本页 §12</td></tr>
          <tr><td>调试</td><td>FPS、播放器元数据、布局网格、解码器信息</td><td>本页 §13</td></tr>
          <tr><td>日志</td><td>实时日志列表（最多 100 条）</td><td>本页 §14</td></tr>
        </tbody>
      </table>

      <h2 id="s1">§1 通用</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>语言</td><td>跟随系统</td><td>中文 / English / عربي</td></tr>
          <tr><td>开机自启</td><td>关</td><td>需设备支持；通过 <code>RECEIVE_BOOT_COMPLETED</code> 接收</td></tr>
          <tr><td>启动页面</td><td>首页</td><td>首页 / 直播 / 节目单 / 全部频道 / 收藏 / 搜索 / 多屏同播</td></tr>
          <tr><td>画中画</td><td>关</td><td>按主页键退出播放时小窗继续播放</td></tr>
          <tr><td>清除缓存</td><td>—</td><td>清除缓存目录、清空可播放线路 host/url 列表</td></tr>
          <tr><td>恢复初始化</td><td>—</td><td>清空所有 SharedPreferences，等同恢复出厂</td></tr>
        </tbody>
      </table>

      <h2 id="s4">§4 界面</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>节目进度</td><td>开</td><td>频道底部显示当前节目进度条</td></tr>
          <tr><td>常驻节目进度</td><td>关</td><td>播放器底部常驻进度条</td></tr>
          <tr><td>台标显示</td><td>开</td><td>—</td></tr>
          <tr><td>显示回放标志</td><td>开</td><td>回看时左上角显示「回放」角标</td></tr>
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
          <tr><td>换台时显示频道信息</td><td>开</td><td>—</td></tr>
          <tr><td>时间显示</td><td>整点</td><td>隐藏 / 常显 / 整点 / 半点（前后 30 秒显示）</td></tr>
          <tr><td>超时自动关闭界面</td><td>15 秒</td><td>5 / 10 / 15 / 20 / 25 / 30 秒 + 不关闭</td></tr>
          <tr><td>界面整体缩放</td><td>自适应</td><td>×0.5–×2.0 步进 0.1</td></tr>
          <tr><td>界面字体缩放</td><td>×1.0</td><td>×0.5–×2.0 步进 0.1</td></tr>
          <tr><td>字幕设置</td><td>—</td><td>详见 <a href="/player-settings">播放器与字幕</a></td></tr>
          <tr><td>焦点优化</td><td>开</td><td>关闭可解决触摸设备部分场景闪退</td></tr>
          <tr><td>启用收藏</td><td>开</td><td>—</td></tr>
          <tr><td>启用最近观看</td><td>开</td><td>最多保留 15 条历史</td></tr>
        </tbody>
      </table>

      <h2 id="s5">§5 主题</h2>
      <ul>
        <li><b>颜色模式</b>：浅色 / 深色 / 跟随系统（默认）。</li>
        <li><b>配色方案</b>：内置颜色（默认）/ 基于背景颜色 / 朴素颜色。</li>
        <li><b>主题包</b>：从 <code>res/raw/app_themes.json</code> 加载，分组展示；选择后下载背景图并用 <code>materialkolor</code> 提取主题色。</li>
        <li><b>恢复默认</b>：清除当前主题设置。</li>
      </ul>

      <h2 id="s9">§9 更新</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>更新通道</td><td>stable</td><td>stable / beta / dev，对应 Gitee 上 mytvstable / mytvbeta / mytvdev 三个仓库</td></tr>
          <tr><td>更新强提醒</td><td>关</td><td>开：检测到新版本时全屏提醒；关：仅消息提示</td></tr>
        </tbody>
      </table>

      <h2 id="s10">§10 网络</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>HTTP 请求重试次数</td><td>10</td><td>1–10 / 15 / 20 / 30 / 40 / 50；影响订阅源、节目单数据获取</td></tr>
          <tr><td>HTTP 请求重试间隔时间</td><td>1 秒</td><td>0 / 1 / 2 / 3 / 5 / 10 / 15 / 20 / 30 秒</td></tr>
        </tbody>
      </table>
      <p>
        注：播放器的 UA / 代理 / DNS 在「播放器」页以 remoteConfig 形式展示，需在 10591 面板编辑。
      </p>

      <h2 id="s12">§12 权限</h2>
      <table>
        <thead>
          <tr><th>权限</th><th>用途</th></tr>
        </thead>
        <tbody>
          <tr><td>安装未知应用</td><td>应用内 APK 更新、10591 面板推 APK 安装</td></tr>
          <tr><td>读取 / 管理外部存储</td><td>本地订阅源文件、本地云同步文件、ASR 模型存储</td></tr>
        </tbody>
      </table>
      <p>Manifest 中声明的所有权限：INTERNET、RECEIVE_BOOT_COMPLETED（开机自启）、REQUEST_INSTALL_PACKAGES、READ/WRITE_EXTERNAL_STORAGE、MANAGE_EXTERNAL_STORAGE、WAKE_LOCK、ACCESS_WIFI_STATE、ACCESS_NETWORK_STATE、GET_TASKS、READ_PHONE_STATE、FOREGROUND_SERVICE、FOREGROUND_SERVICE_DATA_SYNC、POST_NOTIFICATIONS、<code>com.peasun.aispeech.aiopen.control</code>（夏杰语音）、<code>com.android.providers.tv.permission.WRITE_EPG_DATA</code>。</p>

      <h2 id="s13">§13 调试</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>显示性能信息</td><td>关</td><td>屏幕角落显示 FPS、帧时间、Jank、PSS 内存</td></tr>
          <tr><td>显示播放器信息</td><td>关</td><td>编码、解码器、采样率等元数据</td></tr>
          <tr><td>显示布局网格</td><td>关</td><td>—</td></tr>
          <tr><td>解码器信息</td><td>—</td><td>跳转 <code>SettingsDecoderInfoScreen</code></td></tr>
        </tbody>
      </table>
      <p>
        <code>debugDeveloperMode</code> 开关在 TV UI 中被注释，只能在 10591 面板或 SP 中改；开启后才允许访问 <code>/ku9/js/*</code> 调试端点。
      </p>

      <h2 id="s14">§14 日志</h2>
      <p>
        实时（每秒刷新）展示应用内日志，最多保留 100 条；每条显示级别图标、tag、message+cause、时间（HH:mm:ss）。
        TV 界面无导出按钮，可通过 10591 面板 <code>GET /api/logs</code>（JSON）和 <code>GET /api/logcat</code>（text，最近 10000 行）拉取。
      </p>

      <h2>如何恢复默认</h2>
      <p>
        <b>设置 → 通用 → 恢复初始化</b> 一键清空所有 SharedPreferences。主题可在 <b>设置 → 主题 → 恢复默认</b> 单独重置。
      </p>
    </div>
  `,
})
export class SettingsOverviewPage {}
