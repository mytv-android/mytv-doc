import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';

@Component({
  selector: 'app-getting-started',
  imports: [DocPageHeader, DocCallout],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="快速上手"
        lead="从下载安装到看到第一个频道画面，约 5 分钟。"
      />

      <h2>1. 准备环境</h2>
      <ul>
        <li>一台运行 <b>Android 6.0（API 23）及以上</b> 的电视 / 电视盒子 / 投影仪。</li>
        <li>仅横屏（应用锁定 <code>sensorLandscape</code>）。</li>
        <li>稳定的网络（推荐有线）。</li>
        <li>遥控器（或者触屏 / 鼠标）。</li>
      </ul>

      <h2>2. 安装应用</h2>
      <p>
        前往 GitHub Release 下载最新 APK：
        <a href="https://github.com/mytv-android/mytv-android/releases" target="_blank" rel="noopener">
          mytv-android/releases
        </a>
        。Release 通常包含多个 ABI 分包（<code>armeabi-v7a</code>、<code>arm64-v8a</code>、<code>x86</code>、<code>x86_64</code>）以及一个 universal 包，电视一般选 <b>arm64-v8a</b> 或 universal。
      </p>
      <p>把 APK 拷贝到 U 盘，或通过手机 / 电脑推送到电视安装。</p>

      <h2>3. 首次启动</h2>
      <ul>
        <li>首次启动会显示<b>用户协议</b>，阅读后同意进入。</li>
        <li>之后进入<b>加载页</b>，应用会拉取默认的订阅源与 EPG：
          <ul>
            <li>默认订阅源（演示）：<code>https://gitee.com/mytv-android/iptv-api/raw/master/output/webview_demo.m3u</code></li>
            <li>默认 EPG：<code>https://gitee.com/mytv-android/myepg/raw/master/output/epg.gz</code></li>
          </ul>
        </li>
        <li>网络正常时，几秒后进入 Dashboard 首页。</li>
        <li>默认源不可用时，按 <b>菜单键 → 设置</b> 进入配置自定义订阅源。</li>
      </ul>

      <h2>4. 配置订阅源</h2>
      <p>订阅源是 mytv-android 的核心数据。<b>实际使用建议自行准备 m3u 订阅</b>。</p>
      <ol>
        <li>进入 <b>设置 → 订阅源 → 自定义订阅源</b>。</li>
        <li>底部「添加其他订阅源」会弹出二维码，扫码到 10591 web 面板添加；或直接在浏览器粘贴：
          <pre><code>curl -X POST http://&lt;设备IP&gt;:10591/api/iptv-source/push \\
  -H "Content-Type: application/json" \\
  -d '&#123;"name":"我的源","type":"url","url":"https://example.com/iptv.m3u"&#125;'</code></pre>
        </li>
        <li>可选：调整「订阅源缓存时间」「混合源模式」「隐藏频道规则」等。</li>
        <li>返回主界面，应用会重新拉取频道列表。</li>
      </ol>
      <p>详细的订阅源格式与示例，见 <a href="/sources">订阅源</a> 章节。</p>

      <h2>5. 配置 EPG（可选）</h2>
      <p>
        默认 EPG 已经能用。如需更换或追加来源，进入 <b>设置 → 节目单 → 自定义节目单</b>，支持 XML / XML_GZ / DIYP / LOVETV / CHUNKED_XML 多种格式。
        详见 <a href="/epg">EPG 节目单</a>。
      </p>

      <h2>6. 远程配置面板（推荐）</h2>
      <p>
        电视遥控器改大量设置不方便。mytv-android 启动后会监听局域网 <code>10591</code> 端口，
        浏览器访问 <code>http://&lt;设备IP&gt;:10591</code> 即可打开配置面板，
        远程修改订阅源、所有 remoteConfig（云同步账号、UA、代理、央视频 Cookie 等）、上传文件、推 APK、看日志。
        详见 <a href="/remote-panel">远程配置面板</a>。
      </p>

      <doc-callout kind="tip" title="建议的下一步" icon="lightbulb">
        先按 <a href="/controls">遥控器与触屏</a> 章节熟悉所有按键，再按
        <a href="/settings">设置项总览</a> 把每个设置项过一遍，能避开 80% 的"为什么没生效"。
      </doc-callout>
    </div>
  `,
})
export class GettingStartedPage {}
