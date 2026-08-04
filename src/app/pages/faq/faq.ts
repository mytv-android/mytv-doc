import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';

@Component({
  selector: 'app-faq',
  imports: [DocPageHeader, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="常见问题"
        lead="使用中最常遇到的问题与排查思路。"
      />

      <h3>Q：换台 / 切线卡顿，缓冲时间长？</h3>
      <p>依次排查：</p>
      <ol>
        <li>网络稳定性（有线优先）。</li>
        <li>播放器内核：在 <b>设置 → 播放器 → 视频播放器内核</b> 试试切换到 IjkPlayer 或 VLC。</li>
        <li>缓冲时间：<b>设置 → 播放器 → 播放缓冲</b> 调大到 3–5 秒。</li>
        <li>源本身的质量。换源试试。</li>
      </ol>

      <h3>Q：某个频道黑屏但有声音？</h3>
      <p>
        多半是解码问题。试试：换播放器内核；或在 <b>设置 → 播放器 → 渲染方式</b> 切换 SurfaceView / TextureView；
        或打开 <b>设置 → 播放器 → 强制软解</b>。
      </p>

      <h3>Q：EPG 不显示节目？</h3>
      <ul>
        <li>检查 m3u 中的 <code>tvg-id</code> 是否与 EPG 源中的频道 ID 一致。</li>
        <li>确认 EPG 地址可访问（浏览器打开看看）。</li>
        <li>试试 <b>设置 → 节目单 → 加载全部节目单</b>。</li>
        <li>手动刷新：设置 → 节目单 → 自定义节目单 → 清缓存。</li>
      </ul>

      <h3>Q：webView:// 频道一直缓冲？</h3>
      <p>
        该站点可能用了 DRM 或自定义播放器。可：
      </p>
      <ul>
        <li>在 <b>设置 → WebView → WebView 内核</b> 切换到 X5。</li>
        <li>调大 <b>设置 → WebView → WebView 加载超时</b>。</li>
        <li>央视频付费频道：在 <b>设置 → 订阅源 → 网页源央视频 Cookie</b> 填登录后的 Cookie。</li>
        <li>都不行就放弃这条线路。</li>
      </ul>

      <h3>Q：10591 面板打不开？</h3>
      <ul>
        <li>确认手机 / 电脑与电视在同一局域网。</li>
        <li>确认电视 IP 正确（路由器后台可查）。</li>
        <li>部分路由器开启了 AP 隔离，需关闭。</li>
        <li>检查电视端 <b>电视直播</b> 是否在前台运行（前台服务退了面板就关了）。</li>
      </ul>

      <h3>Q：云同步失败？</h3>
      <ul>
        <li>GitHub Gist：确认 token 没过期、有 <code>gist</code> 权限。</li>
        <li>Gitee：同上。</li>
        <li>WebDAV：确认服务器地址、用户名、密码；坚果云要用应用密码。</li>
        <li>网络链接：只支持拉取，不能推送。</li>
      </ul>

      <h3>Q：默认演示源失效？</h3>
      <p>
        仓库自带演示地址仅供测试，可用性不保证。请按 <a [routerLink]="'/sources'">订阅源</a> 章节配置自己的订阅。
      </p>

      <h3>Q：IJK / VLC 内核显示「未下载」？</h3>
      <p>
        IJK 和 VLC 是在线下发组件。到 <b>设置 → 播放器 → 播放器组件管理</b> 下载对应组件，然后切换内核才生效。
      </p>

      <h3>Q：触摸设备上某些场景闪退？</h3>
      <p>
        试试关闭 <b>设置 → 界面 → 焦点优化</b>。
      </p>

      <h3>Q：ASR 实时字幕下载慢？</h3>
      <p>
        大陆地区 ASR 模型默认通过 GitHub 代理下载。如果还是慢，可先手动下载模型文件，再通过 10591 面板推到设备本地。
      </p>

      <h3>Q：如何提交 bug？</h3>
      <p>
        前往
        <a href="https://github.com/mytv-android/mytv-android/issues" target="_blank" rel="noopener">GitHub Issues</a>
        提交。附上：应用版本、设备型号、复现步骤、日志（10591 面板 → <code>GET /api/logs</code> 或 <code>GET /api/logcat</code>）。
      </p>
    </div>
  `,
})
export class FaqPage {}
