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
        lead="使用中最常遇到的问题，按场景分组，每条给出排查步骤。"
      />

      <h2 id="playback">播放问题</h2>

      <h3 id="lag">换台、切线卡顿或一直缓冲？</h3>
      <ol>
        <li>换内核：<b>设置 → 播放器 → 视频播放器内核</b>，在 Media3 / IjkPlayer / VLC 之间切换试（IJK、VLC 需先在 <b>设置 → 组件下载</b> 里安装）。</li>
        <li>调大缓冲：<b>设置 → 播放器 → 播放缓冲</b> 调到 3–5 秒。</li>
        <li>检查网络：优先有线连接；只有晚间高峰卡，多半是订阅源或宽带出口的问题。</li>
        <li>换线路或换源：直播中按左 / 右键切换线路；整个源都慢就换订阅源。</li>
        <li>运营商组播 / RTSP 源（经 rtp2httpd 转成 HTTP）：卡顿多半出在服务端或上行带宽，先在服务端的 <code>/status</code> 页看是否为「慢客户端」，见 <a [routerLink]="'/rtp2httpd'">配合 rtp2httpd 使用</a>。</li>
      </ol>

      <h3 id="black-screen">黑屏但有声音？</h3>
      <ol>
        <li>换播放器内核（<b>设置 → 播放器 → 视频播放器内核</b>）。</li>
        <li>切渲染方式（<b>设置 → 播放器 → 渲染方式</b>，SurfaceView 与 TextureView 互换）。</li>
        <li>打开 <b>设置 → 播放器 → 强制软解</b>。</li>
        <li>仍黑屏：该线路的编码设备不支持，换线路。</li>
      </ol>

      <h3 id="enhancement-crash">开启超分或插帧后花屏、闪退？</h3>
      <p>该功能的设置页本身有提示：相关模式涉及底层调用，不兼容的设备可能导致应用退出。处理：</p>
      <ol>
        <li>回 <b>设置 → 播放器 → 视频增强与插帧</b>，把视频超分、视频插帧都关回「关闭」。</li>
        <li>想继续尝试：一次只开一项；插帧目标帧率先选 30；「AI 超分执行后端」在 NNAPI 与 CPU 之间切换。</li>
        <li>Real-ESRGAN、RIFE 等路径需先在 <b>设置 → 组件下载</b> 安装对应运行库。</li>
      </ol>

      <h3 id="webview-stuck">webview:// 频道一直加载？</h3>
      <ol>
        <li>切 X5 内核：<b>设置 → WebView → WebView 内核</b> 选腾讯 X5（仅 armv7 / arm64，首次使用需联网初始化下载；也可直接安装文件名带 x5offline 的安装包）。</li>
        <li>调大 <b>设置 → WebView → 加载超时</b>。</li>
        <li>央视频付费频道：先配置央视频 Cookie（见下一条）。</li>
        <li>使用 DRM 加密的站点无法播放，放弃这条线路。</li>
      </ol>

      <h3 id="yangshipin-vip">央视频付费频道黑屏或无法播放？</h3>
      <ol>
        <li>在电脑浏览器登录央视频网页版，复制登录后的全部 Cookie。</li>
        <li>打开网页面板，在首页「网页源央视频 Cookie」卡片粘贴并推送（面板的 订阅源 页也有同一配置项）。</li>
        <li>回电视重新打开央视频频道。Cookie 过期后需重新推送。</li>
      </ol>
      <p>电视端 <b>设置 → 订阅源 → 网页源央视频Cookie</b> 也能直接粘贴编辑（多行输入），不过 Cookie 很长，从电脑复制后在面板粘贴最省事。</p>

      <h3 id="kernel-not-downloaded">IJK / VLC 内核显示「未下载」？</h3>
      <p>
        IJK、VLC 是在线下发组件。到 <b>设置 → 组件下载</b> 找到对应组件下载安装，再回
        <b>设置 → 播放器 → 视频播放器内核</b> 切换。组件下载页还统一管理 Python 运行环境、语音识别运行库与模型、超分与插帧运行库等。
      </p>

      <h3 id="asr-model-download">ASR 实时字幕模型下载慢或失败？</h3>
      <ol>
        <li>模型在 <b>设置 → 组件下载</b> 的「语音识别模型」分组里统一管理，标注「云端」的模型无需下载；识别前还需先安装「语音识别运行库」。</li>
        <li>下载失败直接重试，网络差时换个时段或网络环境。</li>
        <li>仍不行：在电脑上下载好模型文件，用面板的「文件」页上传到电视，再在面板 播放器 页的「ASR 语音识别」卡片里把识别模型填为该模型目录路径（改完记得点卡片内的「保存」）。</li>
      </ol>

      <h2 id="sources-epg">订阅源与节目单</h2>

      <h3 id="epg-missing">EPG 节目单不显示？</h3>
      <ol>
        <li>检查 m3u 中的 <code>tvg-id</code> 是否与节目单数据中的频道 ID 一致。</li>
        <li>确认节目单地址可访问：用手机 / 电脑浏览器打开，能正常下载到文件才算可用。</li>
        <li>打开 <b>设置 → 节目单 → 加载全部节目单</b>（该选项自带警告：可能引起内存溢出、加载变慢，小内存设备慎用）。</li>
        <li>在 <b>设置 → 节目单 → 自定义节目单</b> 中对对应节目单执行清除缓存，或用 <b>设置 → 通用 → 清除缓存</b> 全清后重启应用。</li>
      </ol>

      <h3 id="demo-source">内置演示源失效了？</h3>
      <p>
        演示源仅供首次体验，可用性不作保证。按 <a [routerLink]="'/getting-started'">快速上手</a> 或
        <a [routerLink]="'/sources'">订阅源</a> 换成自己的订阅源即可。
      </p>

      <h2 id="panel">网页面板</h2>

      <h3 id="panel-unreachable">10591 面板打不开？</h3>
      <ol>
        <li>确认手机 / 电脑与电视在同一局域网（访客 Wi-Fi 通常相互隔离）。</li>
        <li>核对地址：电视端 <b>首页 → 推送</b> 页会显示完整面板地址和二维码，端口被占用时会自动改用随机端口，以该页显示为准；电视 IP 也可在 <b>首页 → 关于</b> 中查看。</li>
        <li>关闭路由器的 AP 隔离（客户端隔离）功能。</li>
        <li>确认应用正在运行：面板由应用内置服务提供，应用退出或被系统清理后面板即不可访问。</li>
      </ol>

      <h2 id="sync-backup">同步与备份</h2>

      <h3 id="cloud-sync-fail">云同步失败？</h3>
      <ol>
        <li>GitHub Gist：确认 Token 未过期，且勾选了 gist 权限。</li>
        <li>Gitee 代码片段：同样检查 Token 的权限与有效期。</li>
        <li>WebDAV：坚果云等需要使用「应用密码」而不是账号登录密码，同时核对服务器地址与用户名。</li>
        <li>网络链接：只支持拉取，不能推送，推送必然失败。</li>
      </ol>
      <p>凭据在电视端 <b>设置 → 云同步</b> 或面板的 云同步 页配置，详见 <a [routerLink]="'/sync'">云同步与备份</a>。</p>

      <h3 id="sync-device-settings">同步成功，但另一台设备上没生效？</h3>
      <p>与设备硬件相关的设置不参与云同步，需要在每台设备上单独设置，包括：</p>
      <ul>
        <li>视频播放器内核、强制软解、软解仅用于音频、Media3 隧道解码。</li>
        <li>视频超分与插帧（开关、模式、目标帧率、AI 后端）。</li>
        <li>WebView 内核、替换系统 WebView。</li>
        <li>实时字幕（ASR）与字幕翻译的全部设置（含各家密钥）。</li>
        <li>焦点优化、最近观看记录。</li>
      </ul>

      <h2 id="others">其他</h2>

      <h3 id="touch-crash">触摸设备上某些场景闪退？</h3>
      <p>
        关闭 <b>设置 → 界面 → 焦点优化</b>。首次启动时如果是用触摸点击「已阅读并同意」，应用会自动关闭焦点优化来规避这类闪退。
      </p>

      <h3 id="report-bug">如何提交 bug？</h3>
      <p>
        前往
        <a href="https://github.com/mytv-android/mytv-android/issues" target="_blank" rel="noopener">GitHub Issues</a>
        提交，附上：
      </p>
      <ul>
        <li>应用版本（<b>首页 → 关于</b> 里查看版本号）。</li>
        <li>设备型号与系统版本。</li>
        <li>复现步骤。</li>
        <li>日志：面板的「日志」页可查看应用日志，「调试」页可导出 logcat 下载系统日志。</li>
      </ul>
    </div>
  `,
})
export class FaqPage {}
