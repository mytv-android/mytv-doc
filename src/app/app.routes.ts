import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.HomePage),
    title: '首页 · 电视直播 使用文档',
  },
  {
    path: 'getting-started',
    loadComponent: () =>
      import('./pages/getting-started/getting-started').then(
        (m) => m.GettingStartedPage,
      ),
    title: '快速上手 · 电视直播 使用文档',
  },
  {
    path: 'controls',
    loadComponent: () =>
      import('./pages/controls/controls').then((m) => m.ControlsPage),
    title: '遥控器与触屏操作 · 电视直播 使用文档',
  },
  {
    path: 'live-screen',
    loadComponent: () =>
      import('./pages/live-screen/live-screen').then((m) => m.LiveScreenPage),
    title: '直播主界面 · 电视直播 使用文档',
  },
  {
    path: 'channels',
    loadComponent: () =>
      import('./pages/channels/channels').then((m) => m.ChannelsPage),
    title: '频道、收藏与搜索 · 电视直播 使用文档',
  },
  {
    path: 'sources',
    loadComponent: () =>
      import('./pages/sources/sources').then((m) => m.SourcesPage),
    title: '订阅源（IPTV / 混合源）· 电视直播 使用文档',
  },
  {
    path: 'epg',
    loadComponent: () => import('./pages/epg/epg').then((m) => m.EpgPage),
    title: 'EPG 节目单 · 电视直播 使用文档',
  },
  {
    path: 'webview-player',
    loadComponent: () =>
      import('./pages/webview-player/webview-player').then(
        (m) => m.WebviewPlayerPage,
      ),
    title: 'WebView 播放器 · 电视直播 使用文档',
  },
  {
    path: 'remote-panel',
    loadComponent: () =>
      import('./pages/remote-panel/remote-panel').then(
        (m) => m.RemotePanelPage,
      ),
    title: '远程配置面板（10591）· 电视直播 使用文档',
  },
  {
    path: 'player-settings',
    loadComponent: () =>
      import('./pages/player-settings/player-settings').then(
        (m) => m.PlayerSettingsPage,
      ),
    title: '播放器与字幕设置 · 电视直播 使用文档',
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings-overview/settings-overview').then(
        (m) => m.SettingsOverviewPage,
      ),
    title: '设置项总览 · 电视直播 使用文档',
  },
  {
    path: 'sync',
    loadComponent: () => import('./pages/sync/sync').then((m) => m.SyncPage),
    title: '云同步与备份 · 电视直播 使用文档',
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq').then((m) => m.FaqPage),
    title: '常见问题 · 电视直播 使用文档',
  },
  {
    path: 'build',
    loadComponent: () => import('./pages/build/build').then((m) => m.BuildPage),
    title: '下载与更新 · 电视直播 使用文档',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found').then((m) => m.NotFoundPage),
    title: '页面不存在 · 电视直播 使用文档',
  },
];
