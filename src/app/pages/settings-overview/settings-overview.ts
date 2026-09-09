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
      <p>
        设置入口由 <code>SettingsCategoriesScreen</code> 提供，<code>SettingsCategories</code> 枚举依次为：
        APP（通用）/ IPTV / EPG / UI / THEME / CONTROL / VIDEO_PLAYER / WEBVIEW_PLAYER / UPDATE / NETWORK / CLOUD_SYNC / PERMISSIONS / DEBUG / LOG，共 14 项。
      </p>
      <table>
        <thead>
          <tr><th>TV 分类</th><th>主要包含</th><th>详细文档</th><th>10591 面板</th></tr>
        </thead>
        <tbody>
          <tr><td>通用</td><td>语言、开机自启、启动页、画中画、后台播放、清除缓存、恢复初始化</td><td>本页 §1</td><td><code>/general</code></td></tr>
          <tr><td>订阅源</td><td>m3u、Xtream、Stalker、混合源、缓存、隐藏、加密分组</td><td><a [routerLink]="'/sources'">订阅源</a></td><td><code>/sources</code></td></tr>
          <tr><td>节目单</td><td>EPG 来源、刷新阈值、跟随订阅源</td><td><a [routerLink]="'/epg'">EPG</a></td><td><code>/epg</code></td></tr>
          <tr><td>界面</td><td>台标、节目进度、信息条、缩放、字幕样式</td><td><a [routerLink]="'/live-screen'">直播主界面</a></td><td><code>/ui</code></td></tr>
          <tr><td>主题</td><td>颜色模式、配色方案、主题包</td><td>本页 §5</td><td><code>/theme</code></td></tr>
          <tr><td>控制</td><td>数字选台、跨组切换、按键行为</td><td><a [routerLink]="'/controls'">遥控器与触屏</a></td><td><code>/control</code></td></tr>
          <tr><td>播放器</td><td>内核、解码、缓冲、超分、插帧、字幕、ASR、翻译</td><td><a [routerLink]="'/player-settings'">播放器与字幕</a></td><td><code>/player</code></td></tr>
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
      <p>对应 <code>SettingsAppScreen</code>。子页面包含语言、启动页面两项跳转。</p>
      <table>
        <thead>
          <tr><th>设置</th><th>对应字段 / 默认值</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>语言</td>
            <td>—（由 <code>setLanguage()</code> 写入系统配置）</td>
            <td>
              跳转 <code>SettingsLanguageScreen</code>，6 列网格选择：<code>🇨🇳 中文</code>(<code>zh-Hans</code>) /
              <code>🇬🇧 English</code>(<code>en</code>) / <code>🕌 عربي</code>(<code>ar</code>)。
              选择后提示「请重启应用以生效」。
            </td>
          </tr>
          <tr>
            <td>开机自启</td>
            <td><code>appBootLaunch</code> = <code>false</code></td>
            <td>开关。需设备支持；通过 <code>RECEIVE_BOOT_COMPLETED</code> 接收开机广播自启。</td>
          </tr>
          <tr>
            <td>启动页面</td>
            <td><code>appStartupScreen</code> = <code>Screens.Dashboard.name</code></td>
            <td>
              跳转 <code>SettingsStartupScreen</code>，6 列网格选择：首页 / 直播 / 节目单 / 全部频道 / 收藏 / 搜索 / 多屏同播
              （分别对应 <code>Screens.Dashboard / Live / EpgGuide / Channels / Favorites / Search / MultiView</code>）。
            </td>
          </tr>
          <tr>
            <td>画中画</td>
            <td><code>appPipEnable</code> = <code>false</code></td>
            <td>
              开关。开启后按主页键退出播放时小窗继续播放。与「后台播放」互斥：开启画中画会自动关闭后台播放。
            </td>
          </tr>
          <tr>
            <td>后台播放</td>
            <td><code>appBackgroundPlayEnable</code> = <code>false</code></td>
            <td>
              开关。切换至后台后继续播放音频（听电视）。与画中画互斥：开启后台播放会自动关闭画中画。
              通知渠道名「后台播放」，并提供上一频道 / 下一频道 / 播放 / 暂停控制。
            </td>
          </tr>
          <tr>
            <td>清除缓存</td>
            <td>—</td>
            <td>
              操作项。右侧显示「约 &#123;size&#125;」（实时统计缓存目录大小）。
              点击后清空 <code>iptvChannelLinePlayableHostList</code>、<code>iptvChannelLinePlayableUrlList</code>，
              并调 <code>AppCacheCleaner.clearAllCaches()</code> 清除全部缓存目录。
            </td>
          </tr>
          <tr>
            <td>恢复初始化</td>
            <td>—</td>
            <td>操作项。调 <code>SP.clear()</code> 清空所有 SharedPreferences，等同恢复出厂，提示「已恢复初始化」。</td>
          </tr>
        </tbody>
      </table>
      <p>
        面板 <code>/general</code>（<code>GeneralComponent</code>）提供：开机自启、启动页面（下拉选择）、
        画中画、后台播放四项，不含语言 / 清除缓存 / 恢复初始化。
      </p>

      <h2 id="s5">§5 主题</h2>
      <p>对应 <code>SettingsThemeScreen</code>。主题包从 <code>res/raw/app_themes.json</code> 加载并分组展示。</p>
      <table>
        <thead>
          <tr><th>设置</th><th>对应字段 / 默认值</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>颜色模式</td>
            <td><code>themeMode</code> = <code>2</code>（跟随系统）</td>
            <td>
              单选分段按钮。取值：<code>0</code> 浅色 / <code>1</code> 深色 / <code>2</code> 跟随系统。
            </td>
          </tr>
          <tr>
            <td>配色方案</td>
            <td><code>themeColorProvider</code> = <code>0</code>（内置颜色）</td>
            <td>
              单选分段按钮。取值：<code>0</code> 内置颜色（Android 12+ 为系统主题色）/ <code>1</code> 基于背景颜色 / <code>2</code> 朴素颜色。
            </td>
          </tr>
          <tr>
            <td>主题包</td>
            <td><code>themeAppCurrent</code>（<code>AppThemeDef?</code>，默认 <code>null</code>）</td>
            <td>
              从 <code>res/raw/app_themes.json</code> 加载的分组列表，每组横向滑动选择。
              选中后下载背景图（支持 http / file / data:image / <code>#</code> 纯色 / base64 五种来源）并提取主题色。
              URL 中的 <code>&#123;timestamp&#125;</code> 占位符会被当前时间戳替换以避免缓存。
            </td>
          </tr>
          <tr>
            <td>恢复默认</td>
            <td>—</td>
            <td>页面顶部按钮，<code>settingsViewModel.themeAppCurrent = null</code> 清除当前主题设置。</td>
          </tr>
        </tbody>
      </table>
      <p>
        面板 <code>/theme</code>（<code>ThemeComponent</code>）除上述两项分段按钮外，还提供自定义主题：
        名称 / 背景 / 贴图 / 贴图透明度（<code>mat-slider</code>，范围 <code>0–1</code>，步进 <code>0.01</code>），
        底部有格式说明。
      </p>

      <h2 id="s9">§9 更新</h2>
      <p>对应 <code>SettingsUpdateScreen</code>。</p>
      <table>
        <thead>
          <tr><th>设置</th><th>对应字段 / 默认值</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>更新通道</td>
            <td><code>updateChannel</code> = <code>"stable"</code></td>
            <td>
              跳转 <code>SettingsUpdateChannelScreen</code>，6 列网格选择：
              <code>stable</code>（稳定版本）/ <code>beta</code>（预览版本）/ <code>dev</code>（开发版本）。
              对应 Gitee 上 mytvstable / mytvbeta / mytvdev 三个仓库。选择后会立即触发一次更新检查。
            </td>
          </tr>
          <tr>
            <td>更新强提醒</td>
            <td><code>updateForceRemind</code> = <code>false</code></td>
            <td>
              开关。开：检测到新版本时全屏提醒；关：仅消息提示。
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        面板 <code>/update</code>（<code>UpdateComponent</code>）用 <code>mat-button-toggle-group</code> 选通道，
        用 <code>mat-slide-toggle</code> 切换强提醒。
      </p>

      <h2 id="s10">§10 网络</h2>
      <p>对应 <code>SettingsNetworkScreen</code>。</p>
      <table>
        <thead>
          <tr><th>设置</th><th>对应字段 / 默认值</th><th>可选值</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>HTTP 请求重试次数</td>
            <td><code>networkRetryCount</code> = <code>Constants.NETWORK_RETRY_COUNT</code> = <code>10L</code></td>
            <td>
              <code>SettingsNetworkRetryCountScreen</code> 6 列网格：<code>1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 30, 40, 50</code>
            </td>
            <td>影响订阅源、节目单数据获取。</td>
          </tr>
          <tr>
            <td>HTTP 请求重试间隔时间</td>
            <td><code>networkRetryInterval</code> = <code>Constants.NETWORK_RETRY_INTERVAL</code> = <code>1000L</code>（毫秒）</td>
            <td>
              <code>SettingsNetworkRetryIntervalScreen</code> 6 列网格（<code>humanizeMs</code> 友好显示）：
              <code>0 / 1000 / 2000 / 3000 / 5000 / 10000 / 15000 / 20000 / 30000</code> ms，
              即 <code>0 / 1 / 2 / 3 / 5 / 10 / 15 / 20 / 30</code> 秒
            </td>
            <td>影响订阅源、节目单数据获取。</td>
          </tr>
        </tbody>
      </table>
      <p>
        面板 <code>/network</code>（<code>NetworkComponent</code>）提供两个 <code>type="number"</code> 输入框，
        重试间隔后缀 <code>ms</code>，可直接填写任意数值（不受网格列表限制）。
      </p>
      <p>
        注：播放器的 UA / 代理 / DNS 在「播放器」页以 remoteConfig 形式展示，需在面板 <code>/player</code> 编辑。
      </p>

      <h2 id="s12">§12 权限</h2>
      <p>对应 <code>SettingsPermissionsScreen</code>。仅 TV 端可申请，面板无对应页。</p>
      <table>
        <thead>
          <tr><th>权限</th><th>用途</th><th>状态指示</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>安装未知应用</td>
            <td>应用内 APK 更新、面板推 APK 安装</td>
            <td>已授权显示对勾，未授权显示叉号；点击调 <code>rememberCanRequestPackageInstallsPermission()</code> 跳系统设置</td>
          </tr>
          <tr>
            <td>读取外部存储 / 管理全部文件</td>
            <td>本地订阅源文件、本地云同步文件、ASR 模型存储</td>
            <td>同上，调 <code>rememberReadExternalStoragePermission()</code></td>
          </tr>
        </tbody>
      </table>
      <p>
        Manifest 中声明的所有权限：INTERNET、RECEIVE_BOOT_COMPLETED（开机自启）、REQUEST_INSTALL_PACKAGES、READ/WRITE_EXTERNAL_STORAGE、MANAGE_EXTERNAL_STORAGE、WAKE_LOCK、ACCESS_WIFI_STATE、ACCESS_NETWORK_STATE、GET_TASKS、READ_PHONE_STATE、FOREGROUND_SERVICE、FOREGROUND_SERVICE_DATA_SYNC、FOREGROUND_SERVICE_MEDIA_PLAYBACK、POST_NOTIFICATIONS、<code>com.peasun.aispeech.aiopen.control</code>（夏杰语音）、<code>com.android.providers.tv.permission.WRITE_EPG_DATA</code>。
      </p>

      <h2 id="s13">§13 调试</h2>
      <p>对应 <code>SettingsDebugScreen</code>。</p>
      <table>
        <thead>
          <tr><th>设置</th><th>对应字段 / 默认值</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>显示性能信息</td>
            <td><code>debugShowFps</code> = <code>false</code></td>
            <td>开关。屏幕角落显示 FPS、帧时间、Jank、PSS 内存等性能信息。</td>
          </tr>
          <tr>
            <td>显示播放器信息</td>
            <td><code>debugShowVideoPlayerMetadata</code> = <code>false</code></td>
            <td>开关。显示播放器详细信息（编码、解码器、采样率等）。</td>
          </tr>
          <tr>
            <td>显示布局网格</td>
            <td><code>debugShowLayoutGrids</code> = <code>false</code></td>
            <td>开关。叠加布局网格辅助调试。</td>
          </tr>
          <tr>
            <td>解码器信息</td>
            <td>—</td>
            <td>跳转 <code>SettingsDecoderInfoScreen</code>，详见 <a [routerLink]="'/player-settings'">播放器与字幕</a> §7</td>
          </tr>
        </tbody>
      </table>
      <p>
        面板 <code>/debug</code>（<code>DebugComponent</code>）除上述三个开关外还提供「导出 Logcat」：
        下载 <code>logcat_&#123;时间戳&#125;.txt</code>（时间戳为 ISO 格式，<code>[:.]</code> 替换为 <code>-</code>）。
      </p>
      <p>
        <code>debugDeveloperMode</code>（开发者模式，默认 <code>false</code>）开关在 TV 和面板 UI 都<b>未提供</b>，只能通过 <code>POST /api/configs</code> 直接改字段；
        开启后才允许访问 <code>/ku9/js/*</code> 调试端点。
      </p>

      <h2 id="s14">§14 日志</h2>
      <p>
        TV 设置 → 日志（<code>SettingsLogScreen</code>）：实时（每秒刷新，<code>delay(1000)</code>）展示应用内日志，
        最多保留 <code>Constants.LOG_HISTORY_MAX_SIZE = 100</code> 条；每条显示级别图标（DEBUG=BugReport / INFO=Info / WARN=Warning / ERROR=Error）、
        tag、<code>message + cause</code>、时间（<code>HH:mm:ss</code>）。
        日志来源为 <code>Logger.history</code>，会合并本进程内存与跨进程 <code>history_&#123;pid&#125;.jsonl</code> 文件并去重。
        TV 界面无导出按钮。
      </p>
      <p>
        面板 <code>/log</code>（<code>LogComponent</code>）：纯只读页面，提供级别筛选（ALL / INFO / ERROR / WARN / DEBUG）、刷新按钮、
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
