import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';

@Component({
  selector: 'app-settings-overview',
  imports: [DocPageHeader, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="设置项总览"
        lead="TV 应用内 14 大类设置的完整索引，并标注每类设置在 10591 面板中的对应页面。"
      />

      <h2>分类速查</h2>
      <table>
        <thead>
          <tr><th>TV 分类</th><th>主要包含</th><th>详细文档</th><th>10591 面板</th></tr>
        </thead>
        <tbody>
          <tr><td>通用</td><td>语言、开机自启、启动页、画中画、清除缓存、恢复初始化</td><td>本页 §1</td><td><code>/general</code></td></tr>
          <tr><td>订阅源</td><td>m3u、Xtream、Stalker、混合源、缓存、隐藏、加密分组</td><td><a [routerLink]="'/sources'">订阅源</a></td><td><code>/sources</code></td></tr>
          <tr><td>节目单</td><td>EPG 来源、刷新阈值、跟随订阅源</td><td><a [routerLink]="'/epg'">EPG</a></td><td><code>/epg</code></td></tr>
          <tr><td>界面</td><td>台标、节目进度、信息条、缩放、字幕样式</td><td><a [routerLink]="'/live-screen'">直播主界面</a></td><td><code>/ui</code></td></tr>
          <tr><td>主题</td><td>颜色模式、配色方案、主题包</td><td>本页 §5</td><td><code>/theme</code></td></tr>
          <tr><td>控制</td><td>数字选台、跨组切换、按键行为</td><td><a [routerLink]="'/controls'">遥控器与触屏</a></td><td><code>/control</code></td></tr>
          <tr><td>播放器</td><td>内核、解码、缓冲、字幕、ASR、翻译</td><td><a [routerLink]="'/player-settings'">播放器与字幕</a></td><td><code>/player</code></td></tr>
          <tr><td>WebView</td><td>内核、超时、替换系统 WebView</td><td><a [routerLink]="'/webview-player'">WebView</a></td><td><code>/webview</code></td></tr>
          <tr><td>更新</td><td>通道、强提醒</td><td>本页 §9</td><td><code>/update</code></td></tr>
          <tr><td>网络</td><td>重试次数、重试间隔</td><td>本页 §10</td><td><code>/network</code></td></tr>
          <tr><td>云同步</td><td>Gist / WebDAV / 本地文件 / 网络链接 / Gitee</td><td><a [routerLink]="'/sync'">云同步</a></td><td><code>/sync</code></td></tr>
          <tr><td>权限</td><td>安装未知应用、外部存储</td><td>本页 §12</td><td>—</td></tr>
          <tr><td>调试</td><td>FPS、播放器元数据、布局网格、解码器信息</td><td>本页 §13</td><td><code>/debug</code></td></tr>
          <tr><td>日志</td><td>实时日志列表（最多 100 条）</td><td>本页 §14</td><td><code>/log</code></td></tr>
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

      <h2 id="s5">§5 主题</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>颜色模式</td><td>跟随系统</td><td>浅色 / 深色 / 跟随系统</td></tr>
          <tr><td>配色方案</td><td>内置颜色</td><td>内置颜色 / 基于背景颜色 / 朴素颜色</td></tr>
          <tr><td>主题包</td><td>—</td><td>从 <code>res/raw/app_themes.json</code> 加载，分组展示；选择后下载背景图并提取主题色</td></tr>
          <tr><td>恢复默认</td><td>—</td><td>清除当前主题设置</td></tr>
        </tbody>
      </table>
      <p>
        面板 <code>/theme</code> 还提供自定义主题（名称 / 背景 / 贴图 / 贴图透明度）编辑。
      </p>

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
        注：播放器的 UA / 代理 / DNS 在「播放器」页以 remoteConfig 形式展示，需在面板 <code>/player</code> 编辑。
      </p>

      <h2 id="s12">§12 权限</h2>
      <table>
        <thead>
          <tr><th>权限</th><th>用途</th></tr>
        </thead>
        <tbody>
          <tr><td>安装未知应用</td><td>应用内 APK 更新、面板推 APK 安装</td></tr>
          <tr><td>读取 / 管理外部存储</td><td>本地订阅源文件、本地云同步文件、ASR 模型存储</td></tr>
        </tbody>
      </table>
      <p>
        Manifest 中声明的所有权限：INTERNET、RECEIVE_BOOT_COMPLETED（开机自启）、REQUEST_INSTALL_PACKAGES、READ/WRITE_EXTERNAL_STORAGE、MANAGE_EXTERNAL_STORAGE、WAKE_LOCK、ACCESS_WIFI_STATE、ACCESS_NETWORK_STATE、GET_TASKS、READ_PHONE_STATE、FOREGROUND_SERVICE、FOREGROUND_SERVICE_DATA_SYNC、POST_NOTIFICATIONS、<code>com.peasun.aispeech.aiopen.control</code>（夏杰语音）、<code>com.android.providers.tv.permission.WRITE_EPG_DATA</code>。
      </p>

      <h2 id="s13">§13 调试</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>显示性能信息</td><td>关</td><td>屏幕角落显示 FPS、帧时间、Jank、PSS 内存</td></tr>
          <tr><td>显示播放器信息</td><td>关</td><td>编码、解码器、采样率等元数据</td></tr>
          <tr><td>显示布局网格</td><td>关</td><td>—</td></tr>
          <tr><td>解码器信息</td><td>—</td><td>跳转 <code>SettingsDecoderInfoScreen</code>，详见 <a [routerLink]="'/player-settings'">播放器与字幕</a> §7</td></tr>
        </tbody>
      </table>
      <p>
        面板 <code>/debug</code> 除上述开关外还提供「导出 Logcat」下载 <code>logcat_&#123;时间戳&#125;.txt</code>。
      </p>
      <p>
        <code>debugDeveloperMode</code>（开发者模式）开关在 TV 和面板 UI 都<b>未提供</b>，只能通过 <code>POST /api/configs</code> 直接改字段；
        开启后才允许访问 <code>/ku9/js/*</code> 调试端点。
      </p>

      <h2 id="s14">§14 日志</h2>
      <p>
        TV 设置 → 日志：实时（每秒刷新）展示应用内日志，最多保留 100 条；每条显示级别图标、tag、message+cause、时间（HH:mm:ss）。
        TV 界面无导出按钮。
      </p>
      <p>
        面板 <code>/log</code>：纯只读页面，提供级别筛选（ALL / INFO / ERROR / WARN / DEBUG）、刷新按钮、
        日志表格（时间 / 级别 / 标签 / 消息 / 原因；列宽可拖拽；分页 10/20/50/100）。
        也可直接调 <code>GET /api/logs</code>（JSON）或 <code>GET /api/logcat</code>（text，最近 10000 行）。
      </p>

      <h2>如何恢复默认</h2>
      <p>
        <b>设置 → 通用 → 恢复初始化</b> 一键清空所有 SharedPreferences。主题可在 <b>设置 → 主题 → 恢复默认</b> 单独重置。
      </p>
    </div>
  `,
})
export class SettingsOverviewPage {}
