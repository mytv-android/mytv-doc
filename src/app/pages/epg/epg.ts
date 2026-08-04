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
      <table>
        <thead>
          <tr><th>类型</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td><b>XML</b></td><td>标准 XMLTV 格式</td></tr>
          <tr><td><b>XML_GZ</b></td><td>gzip 压缩的 XMLTV，按 URL 含 <code>.gz</code> / <code>gzip</code> 或 content-type 自动识别</td></tr>
          <tr><td><b>DIYP</b></td><td><code>diyp://&#123;host&#125;/&#123;name&#125;/&#123;date&#125;</code> 模板，每频道每日期一次 JSON 请求</td></tr>
          <tr><td><b>LOVETV</b></td><td><code>lovetv://&#123;host&#125;/&#123;name&#125;/&#123;date&#125;</code>，超级直播格式</td></tr>
          <tr><td><b>CHUNKED_XML</b></td><td>分块流式 XMLTV</td></tr>
        </tbody>
      </table>
      <p>
        DIYP / LOVETV 类型会抓取 <code>previous=-6</code> 到 <code>next=+1</code> 共 8 天的节目，并发上限 8。
      </p>
      <p>
        默认 EPG：<code>https://gitee.com/mytv-android/myepg/raw/master/output/epg.gz</code>。
      </p>

      <h2>2. 添加 EPG 源</h2>
      <ol>
        <li><b>TV 端：设置 → 节目单 → 自定义节目单 → 添加其他节目单</b>。弹二维码到面板。</li>
        <li><b>面板首页（<code>/</code>）→ 自定义节目单</b>。粘贴名称 + 链接即可推送。</li>
        <li><b>面板节目单页（<code>/epg</code>）→ 自定义节目单</b>。打开 EPG 源管理对话框，支持拖拽排序、新增、编辑、删除、单选当前。</li>
      </ol>

      <h2>3. TV 应用内设置项（设置 → 节目单）</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>取值 / 说明</th></tr>
        </thead>
        <tbody>
          <tr><td>节目单启用</td><td>开</td><td>关闭后所有 EPG 功能（含信息条节目提示、指南页）都停用；首次开启加载可能较慢</td></tr>
          <tr><td>跟随订阅源</td><td>关</td><td>优先使用 m3u 中 <code>x-tvg-url</code> / <code>url-tvg</code> 定义的 EPG</td></tr>
          <tr><td>加载全部节目单</td><td>关</td><td>开启后一次性加载所有频道 EPG，可能导致内存溢出、加载时间变长、加载失败</td></tr>
          <tr><td>经典选台界面节目单常显</td><td>关</td><td>仅当「经典选台界面」开启时显示</td></tr>
          <tr><td>自定义节目单</td><td>默认节目单 综合</td><td>子页面管理：设为当前 / 删除 / 清缓存 / 添加其他节目单</td></tr>
          <tr><td>刷新时间阈值</td><td>2</td><td>时间不到 <code>N:00</code> 不刷新；<code>-1</code> 表示启动时刷新；可选 <code>-1, 0..12</code></td></tr>
        </tbody>
      </table>

      <h2>4. 10591 面板（<code>/epg</code>）的全部可配置项</h2>
      <table>
        <thead>
          <tr><th>面板字段</th><th>类型</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>节目单启用</td><td>开关</td><td>同 TV</td></tr>
          <tr><td>经典选台界面节目单常显</td><td>开关</td><td>同 TV；仅当经典选台界面开启时显示</td></tr>
          <tr><td>跟随订阅源</td><td>开关</td><td>同 TV</td></tr>
          <tr><td>加载全部节目单</td><td>开关</td><td>同 TV</td></tr>
          <tr><td>自定义节目单</td><td>跳转项</td><td>打开 EPG 源管理对话框；支持<b>拖拽排序</b>、新增、编辑、删除、单选当前</td></tr>
          <tr><td>刷新时间阈值</td><td>跳转项</td><td>预设：每次启动（-1）/ 00:00（0）/ 06:00（6）/ 12:00（12）/ 18:00（18）/ 自定义小时数（步进 0.5，最小 0）</td></tr>
          <tr><td>EPG 源编辑对话框 - 名称</td><td>文本框</td><td>—</td></tr>
          <tr><td>EPG 源编辑对话框 - 链接</td><td>文本框</td><td>—</td></tr>
        </tbody>
      </table>

      <h2>5. EPG 与频道的匹配</h2>
      <p>
        EPG 通过 m3u 中的 <code>tvg-id</code>（优先）或 <code>tvg-name</code> 与频道匹配。
        如果 EPG 没显示节目，多半是 tvg-id 与 EPG 源不一致。可在面板编辑<b>频道别名</b>把多个名字归并到同一逻辑频道。
      </p>

      <h2>6. EPG 显示位置</h2>
      <ul>
        <li><b>频道信息条</b>：换台 / 切线时显示当前与下个节目，含进度条。</li>
        <li><b>EPG 指南页</b>：完整的频道 × 时间二维表格，按遥控器「全局 EPG 切换键」跳到独立的 EpgGuideActivity，或在主界面长按左方向键。</li>
      </ul>

      <h2>7. 回看</h2>
      <p>
        在 EPG 指南页选择已播出的节目，OK 即触发回看。回看地址由 m3u 的 <code>catchup</code> / <code>catchup-source</code> 决定；
        支持 <code>default</code> / <code>append</code> / <code>timeshift</code> / <code>flussonic</code> / <code>xtream codes</code> 五种回看类型。
        直播最大可回退 <b>48 小时</b>。
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
