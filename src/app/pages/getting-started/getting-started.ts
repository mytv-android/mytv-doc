import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';

@Component({
  selector: 'app-getting-started',
  imports: [DocPageHeader, DocCallout, RouterLink, MatCardModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="快速上手"
        lead="从安装到看上自己的频道：装 APK、同意使用须知、推送一个订阅源，全程约 5 分钟。"
      />

      <h2 id="requirements">系统要求</h2>
      <ul>
        <li>系统：Android 6.0 及以上，仅横屏（电视、电视盒子、投影仪）。</li>
        <li>个别功能要求更高：服务（Python / PHP，含各自运行环境）需 Android 7.0 及以上。</li>
        <li>网络：家庭局域网，有线连接更稳定；订阅源与节目单需要联网获取。</li>
        <li>操作：遥控器，或触屏 / 鼠标。</li>
      </ul>

      <h2 id="install">安装应用</h2>
      <ol>
        <li>
          在电脑或手机上打开
          <a href="https://github.com/mytv-android/mytv-android/releases" target="_blank" rel="noopener">GitHub Releases</a>
          下载最新 APK。一个版本有多个安装包，按 CPU 架构选择，对照表见
          <a [routerLink]="'/build'">下载与更新</a>（普通电视优先 arm64-v8a，装不上再换 armeabi-v7a 或 universal）。
        </li>
        <li>用 U 盘把 APK 拷到电视上安装；首次在电视上安装第三方应用时，按系统提示允许「安装未知应用」。</li>
        <li>安装完成后打开应用。</li>
      </ol>

      <h2 id="first-launch">首次启动</h2>
      <ol>
        <li>首次打开会显示「使用须知」（4 条声明），阅读后按「已阅读并同意」进入；选「退出应用」则直接退出。</li>
        <li>应用自动加载内置的演示订阅源和默认节目单，网络正常时几秒后进入首页。</li>
        <li>首页包含直播、全部频道、收藏、节目单、搜索、多屏同播、推送、设置、关于等入口。</li>
      </ol>
      <doc-callout kind="info" title="演示源仅供体验" icon="info">
        内置演示源只用于验证应用能正常工作，频道随时可能失效。请尽快按下文添加自己的订阅源。
      </doc-callout>

      <h2 id="add-source">添加自己的订阅源</h2>
      <p>
        订阅源是频道列表的来源（通常是 m3u 链接或文件）。推荐通过网页面板推送，比在电视上逐个字母输地址快得多。
        以下两种方式打开的是同一个面板。
      </p>

      <h3 id="add-source-tv">方式一：电视端扫码推送</h3>
      <ol>
        <li>电视端进入 <b>设置 → 订阅源 → 自定义订阅源</b>。</li>
        <li>选择「添加其他订阅源」，屏幕弹出二维码和面板地址。</li>
        <li>用手机扫码（或在电脑浏览器输入该地址）打开网页面板。</li>
        <li>在面板首页的「订阅源」卡片里填名称和链接，点「推送订阅源」，推送成功后回到电视即可看到新源。</li>
      </ol>

      <h3 id="add-source-panel">方式二：直接打开网页面板</h3>
      <ol>
        <li>确认手机 / 电脑与电视在同一局域网。</li>
        <li>
          浏览器打开 <code>http://&lt;电视IP&gt;:10591</code>。
          电视 IP 可在 <b>首页 → 关于</b> 中查看；<b>首页 → 推送</b> 页也会直接显示完整面板地址和二维码。
        </li>
        <li>在面板首页的「订阅源」卡片填名称和链接，点「推送订阅源」。</li>
      </ol>
      <p>
        面板支持远程链接（含 FTP / SMB / WebDAV）、Xtream Codes、Stalker Portal、本地文件上传等类型，
        详见 <a [routerLink]="'/sources'">订阅源</a>。
      </p>

      <h2 id="next-steps">常用下一步</h2>
      <div class="card-grid">
        @for (c of nextSteps; track c.path) {
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

      <doc-callout kind="tip" title="帮家人远程配置" icon="lightbulb">
        面板里所有设置页都是改动即保存，手机和电脑随时能改，不必守在电视前。
      </doc-callout>
    </div>
  `,
  styles: `
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
export class GettingStartedPage {
  protected readonly nextSteps = [
    { path: '/epg', icon: 'calendar_month', title: '配节目单', subtitle: '自定义 EPG、回看、刷新策略' },
    { path: '/controls', icon: 'gamepad', title: '调按键', subtitle: '遥控器按键映射与手势' },
    { path: '/remote-panel', icon: 'settings_remote', title: '面板总览', subtitle: '网页面板全部功能' },
  ];
}
