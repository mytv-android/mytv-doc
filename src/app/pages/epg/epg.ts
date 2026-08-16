import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';

@Component({
  selector: 'app-epg',
  imports: [DocPageHeader, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="EPG 节目单"
        lead="EPG（Electronic Program Guide）让你看到每个频道正在播出与即将播出的节目。本页介绍来源格式、TV 与面板上的设置，以及回看用法。"
      />

      <h2>1. EPG 来源类型</h2>
      <p>
        类型由 URL 自动探测（<code>EpgSourceType.fromUrl</code>）：先匹配 scheme <code>lovetv://</code> / <code>diyp://</code>，再判断 URL 是否含 <code>.gz</code> / <code>gzip</code>，否则按普通 XMLTV 处理。<code>channel=&#123;name&#125;</code> 也会被识别为 LOVETV，<code>ch=&#123;name&#125;</code> 会被识别为 DIYP。
      </p>
      <table>
        <thead>
          <tr><th>类型</th><th>识别规则</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td><b>XML</b></td><td>其他所有 URL（默认）</td><td>标准 XMLTV 格式，整份源一次请求</td></tr>
          <tr><td><b>XML_GZ</b></td><td>URL 含 <code>.gz</code> 或 <code>gzip</code></td><td>gzip 压缩的 XMLTV，响应自动 GZIP 解压</td></tr>
          <tr><td><b>DIYP</b></td><td><code>diyp://</code> 开头，或 URL 含 <code>ch=&#123;name&#125;</code></td><td><code>diyp://&#123;host&#125;/&#123;name&#125;/&#123;date&#125;</code> 模板，每频道每日期一次 JSON 请求；返回 <code>&#123;date, epg_data:[&#123;start,end,title,desc?&#125;]&#125;</code>，start/end 为 <code>HH:mm</code></td></tr>
          <tr><td><b>LOVETV</b></td><td><code>lovetv://</code> 开头，或 URL 含 <code>channel=&#123;name&#125;</code></td><td><code>lovetv://&#123;host&#125;/&#123;name&#125;/&#123;date&#125;</code>，超级直播格式；返回 <code>&#123;频道:&#123;program:[&#123;st秒,et秒,t标题&#125;]&#125;&#125;</code></td></tr>
          <tr><td><b>CHUNKED_XML</b></td><td>—</td><td>分块流式 XMLTV</td></tr>
        </tbody>
      </table>
      <p>
        DIYP / LOVETV 类型按 <code>previous=-6</code> 到 <code>next=+1</code> 共 8 天抓取（<code>JsonTemplateEpgFetcher.PREVIOUS_DAYS = -6</code> / <code>NEXT_DAYS = 1</code>），并发上限 8（<code>Semaphore(8)</code>），自定义 scheme 在请求前替换为 <code>http://</code>。
      </p>
      <p>
        默认 EPG 源（<code>Constants.EPG_SOURCE_LIST</code>）：<code>https://gitee.com/mytv-android/myepg/raw/master/output/epg.gz</code>，名称「默认节目单 综合」。
      </p>

      <h2>2. 添加 EPG 源</h2>
      <p>EPG 源数据结构为 <code>EpgSource(name, url)</code>，<code>url</code> 为空字符串的源会被跳过（不显示、不加载）。</p>
      <ol>
        <li><b>TV 端：设置 → 节目单 → 自定义节目单 → 添加其他节目单</b>。弹二维码到面板，面板填好名称 + 链接后推送回 TV。</li>
        <li><b>面板首页（<code>/</code>）→ 自定义节目单</b>。粘贴名称 + 链接即可推送，面板提示「支持 xml、xml.gz 格式」（<code>EPG_SUBTITLE</code>）。</li>
        <li><b>面板节目单页（<code>/epg</code>）→ 自定义节目单</b>。打开 EPG 源管理对话框（宽 600px），支持拖拽排序、新增、编辑、删除、单选当前。</li>
      </ol>
      <p>
        TV 端「自定义节目单」子页面（<code>SettingsEpgSourceScreen</code>）每个源显示：名称 + 链接 + 缓存信息「频道：N | 节目：M | 缓存：xx KB | 更新：yyyy-MM-dd HH:mm:ss」（<code>ui_settings_epg_source_item_info</code>）。单项操作弹出 2×2 网格：<b>设为当前</b> / <b>删除</b> / <b>清除缓存</b> / <b>返回</b>。页面顶部「刷新全部」按钮重新拉取全部源并显示加载 / 错误图标。底部「添加其他节目单」同样弹二维码到面板。
      </p>

      <h2>3. TV 应用内设置项（设置 → 节目单）</h2>
      <p>对应 <code>SettingsEpgScreen</code>，标题「设置 / 节目单」。开关均为即时写入 <code>Configs</code>（SpState 持久化）。</p>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>取值 / 说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><b>节目单启用</b><br><code>ui_epg_enable</code></td>
            <td>开（<code>Configs.epgEnable = true</code>）</td>
            <td>
              <p>开关。作用：总开关，关闭后所有 EPG 功能（含信息条节目提示、EPG 指南页）都停用。</p>
              <p>子标题（<code>ui_epg_enable_desc</code>）：「首次加载时可能会较为缓慢」。</p>
              <p>配置方法：设置 → 节目单 → 节目单启用，OK 切换。</p>
            </td>
          </tr>
          <tr>
            <td><b>跟随订阅源</b><br><code>ui_epg_source_follow_iptv</code></td>
            <td>关（<code>Configs.epgSourceFollowIptv = false</code>）</td>
            <td>
              <p>开关。作用：开启后优先使用订阅源 m3u 中 <code>x-tvg-url</code> / <code>url-tvg</code> 定义的 EPG，而非自定义节目单。</p>
              <p>子标题（<code>ui_epg_source_follow_iptv_desc</code>）：「优先使用订阅源中定义的节目单」。</p>
              <p>配置方法：设置 → 节目单 → 跟随订阅源，OK 切换。</p>
            </td>
          </tr>
          <tr>
            <td><b>加载全部节目单</b><br><code>ui_epg_source_load_all</code></td>
            <td>关（<code>Configs.epgSourceLoadAll = false</code>）</td>
            <td>
              <p>开关。作用：开启后一次性加载所有自定义节目单源并合并（<code>EpgList.merge</code>），而非只加载当前源。</p>
              <p>子标题（<code>ui_epg_source_load_all_desc</code>）：「启用后，应用将加载所有的自定义节目单，这可能会导致内存溢出、加载事件变长和加载失败等问题。」</p>
              <p>配置方法：设置 → 节目单 → 加载全部节目单，OK 切换。仅在确需多源合并时开启。</p>
            </td>
          </tr>
          <tr>
            <td><b>经典选台界面节目单常显</b><br><code>ui_epg_always_show_in_classic_channel_screen</code></td>
            <td>关（<code>Configs.alwaysShowEPGInClassicChannelScreen = false</code>）</td>
            <td>
              <p>开关。作用：开启后经典选台界面始终显示节目单面板。仅当「经典选台界面」开关（<code>Configs.uiUseClassicPanelScreen</code>）开启时本项才在列表中显示。</p>
              <p>子标题（<code>ui_epg_always_show_in_classic_channel_screen_desc</code>）：「启用后，经典选台界面将始终显示节目单界面」。</p>
              <p>配置方法：设置 → 界面 → 经典选台界面（开启）→ 设置 → 节目单 → 经典选台界面节目单常显。</p>
            </td>
          </tr>
          <tr>
            <td><b>自定义节目单</b><br><code>ui_epg_source_custom</code></td>
            <td>当前源名称（默认「默认节目单 综合」）</td>
            <td>
              <p>跳转项。作用：进入 <code>SettingsEpgSourceScreen</code> 子页面管理所有 EPG 源。</p>
              <p>右侧显示当前源名称（<code>settingsViewModel.epgSourceCurrent.name</code>）。</p>
              <p>子页面操作：设为当前 / 删除 / 清除缓存 / 添加其他节目单；顶部「刷新全部」重新拉取。</p>
              <p>配置方法：设置 → 节目单 → 自定义节目单，OK 进入子页面。</p>
            </td>
          </tr>
          <tr>
            <td><b>刷新时间阈值</b><br><code>ui_epg_refresh_time_threshold</code></td>
            <td>2（<code>Constants.EPG_REFRESH_TIME_THRESHOLD = 2</code>）</td>
            <td>
              <p>跳转项，类型 <code>Int</code>。作用：控制节目单刷新时机。</p>
              <p>子标题随当前值变化：</p>
              <ul>
                <li>阈值 ≥ 0：「时间不到&#123;N&#125;:00节目单将不会刷新」（<code>ui_epg_refresh_time_threshold_desc</code>）。</li>
                <li>阈值 = -1：「应用将在每次启动时刷新节目单」（<code>ui_epg_refresh_time_on_startup_threshold_desc</code>）。</li>
              </ul>
              <p>子页面（<code>SettingsEpgRefreshTimeThresholdScreen</code>）6 列网格，可选值范围 <code>-1..&lt;13</code>，即 <code>-1, 0, 1, 2, …, 12</code> 共 14 项：</p>
              <ul>
                <li><code>-1</code> 显示为「启动时刷新」（<code>epg_loaded_on_Startup</code>）</li>
                <li><code>0</code> → 「0:00」，<code>6</code> → 「6:00」，…，<code>12</code> → 「12:00」</li>
              </ul>
              <p>配置方法：设置 → 节目单 → 刷新时间阈值，OK 进入子页面，选择目标时间。</p>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>4. 10591 面板（<code>/epg</code>）的全部可配置项</h2>
      <p>面板组件 <code>app-epg</code>。开关即时写入 <code>configsService</code> 并 <code>updateConfig()</code> 推送回 TV。</p>
      <table>
        <thead>
          <tr><th>面板字段</th><th>类型</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><b>节目单启用</b>（<code>EPG.ENABLE</code>）</td>
            <td><code>mat-slide-toggle</code></td>
            <td>同 TV。描述（<code>EPG.ENABLE_DESC</code>）：「首次加载时可能会较为缓慢」。</td>
          </tr>
          <tr>
            <td><b>经典选台界面节目单常显</b>（<code>EPG.ALWAYS_SHOW_IN_CLASSIC</code>）</td>
            <td><code>mat-slide-toggle</code></td>
            <td>同 TV；仅当经典选台界面开启时显示。描述（<code>EPG.ALWAYS_SHOW_IN_CLASSIC_DESC</code>）：「开启后，经典选台界面将始终显示节目单。」</td>
          </tr>
          <tr>
            <td><b>跟随订阅源</b>（<code>EPG.FOLLOW_SOURCE</code>）</td>
            <td><code>mat-slide-toggle</code></td>
            <td>同 TV。描述（<code>EPG.FOLLOW_SOURCE_DESC</code>）：「优先使用订阅源中定义的节目单」。</td>
          </tr>
          <tr>
            <td><b>加载全部节目单</b>（<code>EPG.LOAD_ALL</code>）</td>
            <td><code>mat-slide-toggle</code></td>
            <td>同 TV。描述（<code>EPG.LOAD_ALL_DESC</code>）：「启用后，应用将加载所有的自定义节目单，这可能会导致内存溢出、加载事件变长和加载失败等问题。」</td>
          </tr>
          <tr>
            <td><b>自定义节目单</b>（<code>EPG.CUSTOM_EPG</code>）</td>
            <td>跳转项</td>
            <td>
              <p>打开 EPG 源管理对话框 <code>app-epg-manager</code>（宽 600px）。</p>
              <p>支持<b>拖拽排序</b>（<code>cdkDropList</code>，拖拽手柄 <code>drag_indicator</code>）、新增（<code>app-epg-source-dialog</code>）、编辑、删除、单选当前源。</p>
              <p>保存按钮文案「更新」（<code>SYNC.UPDATE</code>），取消按钮「关闭」（<code>HOME.CLOSE</code>）。保存后弹出「更新成功」提示 3 秒。</p>
            </td>
          </tr>
          <tr>
            <td><b>刷新时间阈值</b>（<code>EPG.REFRESH_THRESHOLD</code>）</td>
            <td>跳转项</td>
            <td>
              <p>打开阈值对话框 <code>app-epg-threshold-dialog</code>。右侧显示当前值：<code>-1</code> 显示「每次启动」，否则显示 <code>HH:MM</code>（<code>Math.floor</code> 取小时、<code>Math.round((o-e)*60)</code> 取分钟）。</p>
              <p>预设单选：</p>
              <ul>
                <li>每次启动（<code>-1</code>，<code>EPG.THRESHOLD_ALWAYS</code>）</li>
                <li>00:00（<code>0</code>）</li>
                <li>06:00（<code>6</code>）</li>
                <li>12:00（<code>12</code>）</li>
                <li>18:00（<code>18</code>）</li>
                <li>自定义（<code>EPG.CUSTOM</code>）：<code>&lt;input type="number" min="0" step="0.5"&gt;</code>，支持小数小时（如 <code>0.5</code> = 00:30，<code>12.5</code> = 12:30），最小 0。</li>
              </ul>
              <p>描述（<code>EPG.REFRESH_THRESHOLD_DESC</code>）：「每天 &#123;time&#125; 之前启动应用将不会刷新节目单」；<code>-1</code> 时为「每次启动应用都会尝试刷新节目单」（<code>EPG.REFRESH_THRESHOLD_ALWAYS_DESC</code>）。</p>
              <p>注意：面板存的是 <code>number</code>，可含小数；TV 端 <code>SpState.int</code> 存整数，同步时小数部分会被截断。</p>
            </td>
          </tr>
          <tr>
            <td><b>EPG 源编辑对话框 - 名称</b>（<code>HOME.NAME</code>）</td>
            <td>文本框（必填）</td>
            <td>
              <p><code>&lt;input matInput required&gt;</code>，绑定 <code>source.name</code>。</p>
              <p>新增时初始值空字符串；编辑时回填原值。</p>
              <p>示例：「默认节目单 综合」。</p>
            </td>
          </tr>
          <tr>
            <td><b>EPG 源编辑对话框 - 链接</b>（<code>HOME.LINK</code>）</td>
            <td>文本框（必填）</td>
            <td>
              <p><code>&lt;input matInput required&gt;</code>，绑定 <code>source.url</code>。</p>
              <p>支持 <code>http(s)://</code> XMLTV、<code>.gz</code> 压缩、<code>diyp://</code> / <code>lovetv://</code> 模板（见第 1 节）。</p>
              <p>示例：<code>https://gitee.com/mytv-android/myepg/raw/master/output/epg.gz</code>、<code>diyp://example.com/epg/&#123;name&#125;/&#123;date&#125;</code>。</p>
              <p>名称和链接都非空时「推送」按钮才可点击。</p>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>5. EPG 与频道的匹配</h2>
      <p>
        EPG 与频道通过 <code>EpgList.match(channel, epgSourceFollowIptv)</code> 匹配，优先级依次：
      </p>
      <ol>
        <li><b>tvg-id</b>（m3u <code>tvg-id="..."</code> → <code>Channel.epgID</code>）：索引精确查找，大小写不敏感。</li>
        <li><b>tvg-name</b>（m3u <code>tvg-name="..."</code> → <code>Channel.epgName</code>）：索引精确查找，大小写不敏感。</li>
        <li><b>standardName</b>（频道标准名）：进缓存查找，先查 <code>standardName</code>，再查 <code>displayName</code>，最后遍历 <code>Epg.channelList</code> 做 <code>equals</code> 比对。</li>
      </ol>
      <p>
        如果 EPG 没显示节目，多半是 <code>tvg-id</code> / <code>tvg-name</code> 与 EPG 源中的 <code>id</code> / <code>channel</code> 不一致。可在面板编辑<b>频道别名</b>（<code>CHANNEL_ALIAS</code>）把多个名字归并到同一逻辑频道。<code>epgSourceFollowIptv</code> 开启时优先使用订阅源内嵌 EPG。
      </p>

      <h2>6. EPG 显示位置</h2>
      <ul>
        <li><b>频道信息条</b>：换台 / 切线时显示当前与下个节目，含进度条。</li>
        <li><b>EPG 指南页</b>：完整的频道 × 时间二维表格，按遥控器「全局 EPG 切换键」跳到独立的 EpgGuideActivity，或在主界面长按左方向键。</li>
      </ul>

      <h2>7. 回看</h2>
      <p>
        在 EPG 指南页选择已播出的节目，OK 即触发回看。回看类型由 m3u 的 <code>catchup</code> / <code>catchup-source</code> 决定（<code>M3uIptvParser</code> 解析），支持全局 <code>#EXTM3U</code> 行与每条 <code>#EXTINF</code> 行两种位置；后者覆盖前者。
      </p>
      <p>支持的回看类型（字符串大小写不敏感）：</p>
      <ul>
        <li><code>default</code> → 0</li>
        <li><code>append</code> → 1</li>
        <li><code>timeshift</code> / <code>shift</code> → 2</li>
        <li><code>flussonic</code> → 3</li>
        <li><code>xtream codes</code> → 4</li>
        <li><code>disabled</code> → null（禁用）</li>
      </ul>
      <p>
        直播最大可回退 <b>48 小时</b>（<code>Constants.LIVE_SEEKTO_MAX_REWIND_HOURS = 48</code>）。
      </p>

      <h2>8. 与其他功能的联动</h2>
      <ul>
        <li><b>订阅源</b>：m3u 内嵌 EPG 地址 + 「跟随订阅源」开关联动，见 <a [routerLink]="'/sources'">订阅源</a>。</li>
        <li><b>播放器</b>：「SeekTo 方式 = 重载URL跳转」时回看通过修改 startAt 实现，见 <a [routerLink]="'/player-settings'">播放器与字幕</a>。</li>
        <li><b>界面</b>：「节目进度」「常驻节目进度」「经典选台界面节目单常显」三个开关控制 EPG 在 UI 上的呈现，见 <a [routerLink]="'/live-screen'">直播主界面</a>。</li>
      </ul>
    </div>
  `,
})
export class EpgPage {}
