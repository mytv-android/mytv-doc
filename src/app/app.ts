import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map } from 'rxjs/operators';

export interface NavEntry {
  path: string;
  label: string;
  icon: string;
  group: '使用' | '功能' | '设置' | '其他';
}

export const NAV_ENTRIES: NavEntry[] = [
  { path: '/home', label: '首页', icon: 'home', group: '使用' },
  { path: '/getting-started', label: '快速上手', icon: 'rocket_launch', group: '使用' },
  { path: '/controls', label: '遥控器与触屏', icon: 'gamepad', group: '使用' },
  { path: '/live-screen', label: '直播主界面', icon: 'live_tv', group: '使用' },

  { path: '/channels', label: '频道 · 收藏 · 搜索', icon: 'list', group: '功能' },
  { path: '/sources', label: '订阅源（IPTV）', icon: 'rss_feed', group: '功能' },
  { path: '/epg', label: 'EPG 节目单', icon: 'calendar_month', group: '功能' },
  { path: '/webview-player', label: 'WebView 播放器', icon: 'web', group: '功能' },
  { path: '/remote-panel', label: '远程配置面板', icon: 'settings_remote', group: '功能' },
  { path: '/sync', label: '云同步与备份', icon: 'cloud_sync', group: '功能' },

  { path: '/player-settings', label: '播放器与字幕', icon: 'tune', group: '设置' },
  { path: '/settings', label: '设置项总览', icon: 'settings', group: '设置' },

  { path: '/faq', label: '常见问题', icon: 'help', group: '其他' },
  { path: '/build', label: '下载与更新', icon: 'download', group: '其他' },
];

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private breakpointObserver = inject(BreakpointObserver);

  protected readonly isHandset = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(map((r) => r.matches)),
    { initialValue: false },
  );

  protected readonly sidenavOpened = signal(true);
  protected readonly isDark = signal(false);

  protected readonly groups = computed(() => {
    const order: NavEntry['group'][] = ['使用', '功能', '设置', '其他'];
    return order.map((g) => ({
      name: g,
      entries: NAV_ENTRIES.filter((e) => e.group === g),
    }));
  });

  constructor() {
    const saved = localStorage.getItem('mytv-doc-theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    this.setDark(saved ? saved === 'dark' : !!prefersDark);
  }

  toggleSidenav() {
    this.sidenavOpened.update((v) => !v);
  }

  toggleTheme() {
    this.setDark(!this.isDark());
  }

  private setDark(dark: boolean) {
    this.isDark.set(dark);
    document.body.classList.toggle('dark-theme', dark);
    localStorage.setItem('mytv-doc-theme', dark ? 'dark' : 'light');
  }
}
