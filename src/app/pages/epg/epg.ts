import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocPageHeader } from '../../shared/doc-page-header';

@Component({
  selector: 'app-epg',
  imports: [DocPageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="EPG 节目单"
        lead="EPG（Electronic Program Guide）让你看到每个频道正在播出与即将播出的节目。"
      />

      <h2>EPG 来源类型</h2>
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

      <h2>EPG 设置项</h2>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>节目单启用</td><td>开</td><td>首次加载可能较慢</td></tr>
          <tr><td>跟随订阅源</td><td>关</td><td>优先使用 m3u 中 <code>x-tvg-url</code> / <code>url-tvg</code> 定义的 EPG</td></tr>
          <tr><td>加载全部节目单</td><td>关</td><td>开启后一次性加载所有频道 EPG，可能导致内存溢出、加载时间变长</td></tr>
          <tr><td>经典选台界面节目单常显</td><td>关</td><td>仅当经典选台界面开启时出现</td></tr>
          <tr><td>自定义节目单</td><td>默认节目单 综合</td><td>子页面管理多个 EPG 源（设为当前 / 删除 / 清缓存 / 添加）</td></tr>
          <tr><td>刷新时间阈值</td><td>2</td><td>时间不到 <code>N:00</code> 不刷新；<code>-1</code> 表示启动时刷新；可选 <code>-1, 0..12</code></td></tr>
        </tbody>
      </table>

      <h2>EPG 与频道的匹配</h2>
      <p>
        EPG 通过 m3u 中的 <code>tvg-id</code>（优先）或 <code>tvg-name</code> 与频道匹配。
        如果 EPG 没显示节目，多半是 tvg-id 与 EPG 源不一致。
      </p>

      <h2>EPG 显示位置</h2>
      <ul>
        <li><b>频道信息条</b>：换台 / 切线时显示当前与下个节目。</li>
        <li><b>EPG 指南页</b>：完整的频道 × 时间二维表格，按遥控器「全局 EPG 切换键」跳到独立的 <code>EpgGuideActivity</code>，或在主界面长按左方向键。</li>
      </ul>

      <h2>回看</h2>
      <p>
        在 EPG 指南页选择已播出的节目，OK 即触发回看。回看地址由 m3u 的 <code>catchup</code> / <code>catchup-source</code> 决定；
        支持 <code>default</code> / <code>append</code> / <code>timeshift</code> / <code>flussonic</code> / <code>xtream codes</code> 五种回看类型。
        直播最大可回退 <b>48 小时</b>。
      </p>
    </div>
  `,
})
export class EpgPage {}
