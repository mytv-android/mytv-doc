import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DocPageHeader } from '../../shared/doc-page-header';

@Component({
  selector: 'app-home',
  imports: [DocPageHeader, MatCardModule, MatIconModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <div class="hero">
        <img src="app-icon.png" alt="电视直播" class="hero-icon" />
        <div>
          <doc-page-header
            title="电视直播 使用文档"
            lead="基于天光云影 3.3.9 的 Android TV 电视直播应用 · 仅支持 Android 6.0（API 23）及以上 · 仅横屏"
          />
        </div>
      </div>

      <h2>这是什么？</h2>
      <p>
        <b>电视直播</b>（GitHub 仓库名 mytv-android）是一款使用 Android 原生（Kotlin + Jetpack Compose）开发的电视直播应用，
        支持自定义订阅源（m3u / Xtream / Stalker / 本地文件）、EPG 节目单（XML / DIYP / LOVETV）、
        WebView 播放器、多屏同播（最多 9 路）、云同步（Gist / WebDAV / Gitee / 本地文件）、
        ASR 实时字幕与实时翻译等能力。本文档面向<b>最终用户</b>，介绍每项功能在 TV 应用内和
        10591 网页面板上的配置方法。
      </p>

      <h2>从哪儿开始？</h2>
      <div class="card-grid">
        @for (c of cards; track c.path) {
          <a [routerLink]="c.path" class="card-link">
            <mat-card appearance="outlined" class="nav-card">
              <mat-card-header>
                <mat-icon mat-card-avatar>{{ c.icon }}</mat-icon>
                <mat-card-title>{{ c.title }}</mat-card-title>
                <mat-card-subtitle>{{ c.subtitle }}</mat-card-subtitle>
              </mat-card-header>
            </mat-card>
          </a>
        }
      </div>

      <h2>主要特性速览</h2>
      <ul>
        <li><b>多种订阅源</b>：m3u / txt / Xtream Codes / Stalker Portal / 本地文件；支持 <code>webView://</code>、<code>video://</code>、<code>javascript://</code> 三种特殊前缀。</li>
        <li><b>混合源</b>：内置 CCTV / CETV / 各省级卫视 / 央视频官网链接，主订阅源失效仍可观看。</li>
        <li><b>EPG 节目单</b>：XML / XML_GZ / DIYP / LOVETV / CHUNKED_XML 五种格式，支持回看（最大回退 48 小时）。</li>
        <li><b>远程配置面板</b>：电视上启动后，浏览器访问 <code>http://&lt;设备IP&gt;:10591</code> 即可远程改设置、传订阅、推 APK、看日志。</li>
        <li><b>WebView 播放器</b>：把网页当作视频源，注入 JS 提取 <code>&lt;video&gt;</code>；央视频付费频道支持 Cookie 注入。</li>
        <li><b>多屏同播</b>：最多 9 路同屏，支持方案保存（最多 20 套）。</li>
        <li><b>云同步</b>：GitHub Gist / Gitee / WebDAV / 网络链接 / 本地文件。</li>
        <li><b>ASR 实时字幕与翻译</b>：基于 Sherpa-ONNX 的本地语音识别，可对接腾讯 / 百度 / MTranServer 翻译。</li>
        <li><b>加密分组 / 隐藏规则</b>：分组名 <code>_数字</code> 结尾需密码；按正则隐藏频道。</li>
        <li><b>画中画、开机自启、自定义启动页</b>。</li>
      </ul>

      <h2>文档约定</h2>
      <ul>
        <li>所有功能描述基于电视直播当前源码（commit <code>77e2c27b</code>）。</li>
        <li>「默认 X」指 <code>Configs</code> 中的默认值，可由用户修改。</li>
        <li>「remoteConfig」字段在 TV 设置页只读，需通过 10591 web 面板编辑。</li>
        <li>「10591 面板」即应用内置的远程配置面板，详见 <a routerLink="/remote-panel">远程配置面板</a>。</li>
      </ul>
    </div>
  `,
  styles: `
    .hero {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 8px;
    }
    .hero-icon {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      flex-shrink: 0;
      margin-top: 4px;
    }
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 12px;
      margin: 16px 0 24px;
    }
    .card-link {
      text-decoration: none;
      color: inherit;
    }
    .nav-card {
      height: 100%;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .nav-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--mat-sys-level2);
    }
  `,
})
export class HomePage {
  protected readonly cards = [
    { path: '/getting-started', icon: 'rocket_launch', title: '快速上手', subtitle: '安装、首次启动、添加订阅' },
    { path: '/controls', icon: 'gamepad', title: '遥控器与触屏', subtitle: '完整按键映射与手势' },
    { path: '/live-screen', icon: 'live_tv', title: '直播主界面', subtitle: 'Dashboard 元素介绍' },
    { path: '/channels', icon: 'list', title: '频道 · 收藏 · 搜索', subtitle: '频道列表、收藏夹、加密分组' },
    { path: '/sources', icon: 'rss_feed', title: '订阅源', subtitle: 'm3u / Xtream / Stalker / 混合源' },
    { path: '/epg', icon: 'calendar_month', title: 'EPG 节目单', subtitle: 'XML / DIYP / LOVETV、回看' },
    { path: '/webview-player', icon: 'web', title: 'WebView 播放器', subtitle: 'webView://、X5 内核、超时' },
    { path: '/remote-panel', icon: 'settings_remote', title: '远程配置面板', subtitle: '10591 端口、API、推 APK' },
    { path: '/player-settings', icon: 'tune', title: '播放器与字幕', subtitle: '内核、缓冲、ASR、翻译' },
    { path: '/settings', icon: 'settings', title: '设置项总览', subtitle: '14 大类设置完整索引' },
    { path: '/sync', icon: 'cloud_sync', title: '云同步与备份', subtitle: 'Gist / Gitee / WebDAV / 本地' },
    { path: '/faq', icon: 'help', title: '常见问题', subtitle: '故障排查与 FAQ' },
    { path: '/build', icon: 'download', title: '下载与更新', subtitle: 'Release、应用内更新、推 APK' },
  ];
}
