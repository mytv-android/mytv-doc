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
            lead="基于天光云影 3.3.9 的 Android TV 电视直播应用 · 支持 Android 6.0 及以上 · 仅横屏"
          />
        </div>
      </div>

      <h2 id="what">这是什么？</h2>
      <p>
        <b>电视直播</b>（GitHub 仓库名 mytv-android）是一款 Android 电视直播应用，
        支持自定义订阅源（m3u / txt / Xtream Codes / Stalker Portal / 本地文件）、EPG 节目单、
        WebView 网页源、多屏同播（最多 9 路）、视频超分与插帧、ASR 实时字幕与字幕翻译、
        Python / PHP 服务、云同步等能力。本文档面向<b>最终用户</b>，介绍电视端应用和内置网页面板
        （<code>http://&lt;电视IP&gt;:10591</code>）的使用方法，不涉及源码与二次开发内容。
      </p>

      <h2 id="start">从哪儿开始？</h2>
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

      <h2 id="features">主要特性速览</h2>
      <ul>
        <li><b>多种订阅源</b>：m3u / txt / Xtream Codes / Stalker Portal / 本地文件，远程链接支持 FTP / SMB / WebDAV 协议；线路支持 <code>webview://</code>、<code>video://</code>、<code>javascript://</code> 特殊前缀。</li>
        <li><b>自动添加网页源</b>：为订阅源频道附加央视、央视频、卫视官网等网页线路，主源失效仍可切换观看；央视频付费频道支持配置 Cookie。</li>
        <li><b>EPG 节目单</b>：支持 XML（XMLTV）、DIYP 等多种来源格式；节目单指南页支持节目回看与预约提醒。</li>
        <li><b>远程配置面板</b>：电视启动应用后，浏览器访问 <code>http://&lt;电视IP&gt;:10591</code> 即可推送订阅源、整包改设置（改动即保存）、管理文件与备份、推 APK、看日志。</li>
        <li><b>WebView 播放器</b>：把网页当作视频源，支持切换腾讯 X5 内核。</li>
        <li><b>多屏同播</b>：最多 9 路同屏播放，可保存最多 20 套频道组合方案。</li>
        <li><b>视频超分与插帧</b>：Anime4K、AMD FSR 1、Real-ESRGAN 等多种超分路径，GPU 帧混合 / RIFE 插帧，目标帧率最高 120 FPS。</li>
        <li><b>脚本服务（Python / PHP）</b>：在电视上运行脚本（需 Android 7.0 及以上），把脚本产出的频道列表当作本机或局域网订阅源；服务在网页面板中添加与管理。</li>
        <li><b>组件下载</b>：统一下载管理 IJK / VLC 播放组件、Python / PHP 运行环境、语音识别运行库与模型、超分与插帧运行库。</li>
        <li><b>ASR 实时字幕</b>：本地语音识别，把直播语音实时转成字幕，支持 Media3 与 IJK 内核，也可选云端 Gemini 模型。</li>
        <li><b>字幕翻译</b>：把实时字幕或已有字幕轨翻译成目标语言，引擎可选腾讯翻译 / 百度翻译 / MTranServer（自托管）。</li>
        <li><b>云同步</b>：GitHub Gist / Gitee 代码片段 / WebDAV / 网络链接（仅拉取）/ 本地文件。</li>
        <li><b>加密分组与隐藏规则</b>：分组名以 <code>_数字</code> 结尾即为密码分组；支持按正则隐藏频道。</li>
        <li><b>系统集成</b>：开机自启、画中画、后台播放（听电视）、自定义启动页面、配合夏杰语音 App 语音换台。</li>
      </ul>

      <h2 id="conventions">文档约定</h2>
      <ul>
        <li>本文档以应用当前版本为准，界面文字以 App 内实际显示为准。</li>
        <li>「设置 → X → Y」指电视端应用内的路径。</li>
        <li>「面板」指应用内置的远程配置面板（<code>http://&lt;电视IP&gt;:10591</code>），详见 <a [routerLink]="'/remote-panel'">远程配置面板</a>。</li>
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
    { path: '/sources', icon: 'rss_feed', title: '订阅源', subtitle: 'm3u / Xtream / Stalker / 网页源' },
    { path: '/epg', icon: 'calendar_month', title: 'EPG 节目单', subtitle: '自定义节目单、回看与预约' },
    { path: '/rtp2httpd', icon: 'router', title: '配合 rtp2httpd', subtitle: '组播转 HTTP、FCC、回看时区' },
    { path: '/webview-player', icon: 'web', title: 'WebView 播放器', subtitle: 'webview://、X5 内核、超时' },
    { path: '/multiview', icon: 'grid_view', title: '多屏同播', subtitle: '最多 9 路同屏、方案保存' },
    { path: '/remote-panel', icon: 'settings_remote', title: '远程配置面板', subtitle: '10591 端口、推订阅、推 APK' },
    { path: '/python-services', icon: 'terminal', title: '服务（Python / PHP）', subtitle: '在电视上运行脚本源' },
    { path: '/player-settings', icon: 'tune', title: '播放器与字幕', subtitle: '内核、超分插帧、ASR、翻译' },
    { path: '/settings', icon: 'settings', title: '设置项总览', subtitle: '全部设置分类完整索引' },
    { path: '/sync', icon: 'cloud_sync', title: '云同步与备份', subtitle: 'Gist / Gitee / WebDAV / 本地' },
    { path: '/faq', icon: 'help', title: '常见问题', subtitle: '故障排查与 FAQ' },
    { path: '/build', icon: 'download', title: '下载与更新', subtitle: 'Release、应用内更新、推 APK' },
  ];
}
