import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';

@Component({
  selector: 'app-settings-overview',
  imports: [DocPageHeader, DocCallout, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="设置项总览"
        lead="整本手册的「设置地图」：16 个设置分类各管什么、去哪一页看详细说明；通用、组件下载、主题、更新、网络、权限、调试、日志这 8 类的条目直接在本页查。"
      />

      <h2 id="entries">在哪里改设置</h2>
      <p>电视端有两个入口，进入的是同一套设置：</p>
      <ul>
        <li><b>首页 → 设置</b>：图标网格，16 个一级分类一字排开；</li>
        <li><b>直播界面 → 快捷设置 → 设置</b>：直播画面里按菜单键（或长按 OK）打开快捷设置，再进设置，看完返回直接回到直播。</li>
      </ul>
      <p>
        少数条目在电视端是<b>只读</b>的（右侧带跳转图标），例如频道别名、全局 UA、云同步凭据——它们要在
        <b>远程配置面板</b>（下称面板，用浏览器打开 http://电视IP:10591）里修改，面板改动即保存、立即推送到电视端。
        面板的用法见 <a [routerLink]="'/remote-panel'">远程配置面板</a>。
      </p>

      <h2 id="categories">分类速查</h2>
      <table>
        <thead>
          <tr><th>分类</th><th>里面有什么</th><th>详细文档</th></tr>
        </thead>
        <tbody>
          <tr><td>通用</td><td>界面语言、开机自启、启动页面、画中画、后台播放、清除缓存、恢复初始化</td><td>本页「通用」</td></tr>
          <tr><td>订阅源</td><td>订阅源管理、缓存时间、隐藏与加密分组、频道别名与合并、台标、网页源</td><td><a [routerLink]="'/sources'">订阅源</a></td></tr>
          <tr><td>服务</td><td>Python / PHP 服务的启停、运行状态与运行环境</td><td><a [routerLink]="'/python-services'">服务（Python / PHP）</a></td></tr>
          <tr><td>节目单</td><td>节目单（EPG）开关、节目单来源管理、刷新时间</td><td><a [routerLink]="'/epg'">节目单</a></td></tr>
          <tr><td>界面</td><td>选台界面样式、台标、频道预览、界面缩放、字幕样式</td><td><a [routerLink]="'/live-screen'">直播主界面</a></td></tr>
          <tr><td>主题</td><td>颜色模式、配色方案、内置主题包</td><td>本页「主题」</td></tr>
          <tr><td>控制</td><td>数字选台、换台行为、遥控器按键自定义</td><td><a [routerLink]="'/controls'">遥控器与触屏操作</a></td></tr>
          <tr><td>播放器</td><td>播放内核、解码、缓冲、超分插帧、实时字幕与翻译</td><td><a [routerLink]="'/player-settings'">播放器与字幕设置</a></td></tr>
          <tr><td>组件下载</td><td>Python 运行环境、播放内核、AI 组件等在线组件的下载管理</td><td>本页「组件下载」</td></tr>
          <tr><td>WebView</td><td>网页播放的内核、加载超时、网页缩放、UA</td><td><a [routerLink]="'/webview-player'">WebView 播放器</a></td></tr>
          <tr><td>更新</td><td>更新通道、更新强提醒</td><td>本页「更新」</td></tr>
          <tr><td>网络</td><td>HTTP 请求重试次数与间隔</td><td>本页「网络」</td></tr>
          <tr><td>云同步</td><td>服务商选择、凭据、拉取与推送、系统备份</td><td><a [routerLink]="'/sync'">云同步与备份</a></td></tr>
          <tr><td>权限</td><td>安装未知应用、读取外部存储</td><td>本页「权限」</td></tr>
          <tr><td>调试</td><td>性能浮窗、播放器信息、布局网格、解码器信息</td><td>本页「调试」</td></tr>
          <tr><td>日志</td><td>应用运行日志实时列表</td><td>本页「日志」</td></tr>
        </tbody>
      </table>
      <p>多屏同播没有设置项，它的用法见 <a [routerLink]="'/multiview'">多屏同播</a>。</p>

      <h2 id="general">通用</h2>
      <table>
        <thead>
          <tr><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>语言</td>
            <td>应用界面语言，可选 中文（默认）/ English / عربي。进入子页点选后立即生效并自动返回，<b>无需重启</b>。</td>
          </tr>
          <tr>
            <td>开机自启</td>
            <td>设备开机后自动启动应用，默认关。界面提示「请确保当前设备支持该功能」——部分电视和盒子会拦截自启，开了没反应属设备限制。</td>
          </tr>
          <tr>
            <td>启动页面</td>
            <td>打开应用后首先进入的页面，可选 首页（默认）/ 直播 / 节目单 / 全部频道 / 收藏 / 搜索 / 多屏同播。设为「直播」可开机直接看，此时返回键直接退出应用。</td>
          </tr>
          <tr>
            <td>画中画</td>
            <td>按主页键退回桌面时，以小窗继续播放，默认关。与「后台播放」互斥：打开一个会自动关闭另一个。</td>
          </tr>
          <tr>
            <td>后台播放</td>
            <td>切到后台后继续播放音频（听电视），默认关；通知栏提供上一个频道 / 播放暂停 / 下一个频道按钮。与「画中画」互斥。</td>
          </tr>
          <tr>
            <td>清除缓存</td>
            <td>清除应用全部缓存，条目右侧实时显示当前占用（约 xx）。清除后提示「缓存已清除」，不影响设置与收藏。</td>
          </tr>
          <tr>
            <td>恢复初始化</td>
            <td>清空本机全部设置与数据（订阅源、收藏、观看记录等一并清除），恢复到首次安装状态。点击立即生效，<b>不可撤销</b>，慎用。</td>
          </tr>
        </tbody>
      </table>
      <p>
        面板的「通用」页除上述开关外，还有电视端没有的「缓存写入外部存储」：把缓存目录改到外部存储，需授予存储权限并重启生效。
      </p>

      <h2 id="components">组件下载</h2>
      <p>
        <b>设置 → 组件下载</b> 统一管理所有需要在线下载的组件。每行显示名称、用途和状态
        （未下载 / 下载中 / 校验中 / 解压中 / 已安装 / 下载失败）；按 <b>OK 开始下载</b>，已安装的组件
        <b>长按 OK 删除</b>（删除后要用得重新下载）。
      </p>
      <table>
        <thead>
          <tr><th>组件</th><th>用途</th></tr>
        </thead>
        <tbody>
          <tr><td>Python 运行环境</td><td>CPython 3.11 + 标准库，按设备 ABI 下载（约 7MB），运行 Python 服务的前提；需要 Android 7.0 及以上。详见 <a [routerLink]="'/python-services'">服务（Python / PHP）</a></td></tr>
          <tr><td>PHP 运行环境</td><td>PHP 8.4 + 常用扩展（curl/openssl/json 等），按设备 ABI 下载，运行 PHP 服务的前提</td></tr>
          <tr><td>语音识别运行库（sherpa-onnx）</td><td>实时字幕（ASR）的识别引擎；此处只提供下载，删除在实时字幕设置或模型处管理</td></tr>
          <tr><td>AI Lite ONNX运行库 + AI 模型</td><td>AI Lite 实时超分所需的运行库与模型，两项合并下载、合并显示进度</td></tr>
          <tr><td>RIFE 补帧运行库</td><td>RIFE Vulkan 实时插帧，在「播放器 → 视频增强与插帧」中选用</td></tr>
          <tr><td>Real-ESRGAN 超分运行库</td><td>Real-ESRGAN Vulkan 实时超分辨率</td></tr>
          <tr><td>VLC播放组件</td><td>VLC 播放内核；下载后「播放器 → 视频播放器内核」才能选 VLC</td></tr>
          <tr><td>IJK播放组件</td><td>IJK 播放内核；下载后才能选 IjkPlayer</td></tr>
          <tr><td>语音识别模型</td><td>按 云端 / 中文 / 英文 / 多语言 / 其他语言 分组；标注「云端」的模型无需下载，本地模型点击下载、长按删除</td></tr>
        </tbody>
      </table>
      <p>这些组件分别在 <a [routerLink]="'/python-services'">服务</a> 和 <a [routerLink]="'/player-settings'">播放器与字幕设置</a> 中使用。</p>

      <h2 id="theme">主题</h2>
      <table>
        <thead>
          <tr><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>颜色模式</td><td>浅色 / 深色 / 跟随系统（默认）</td></tr>
          <tr>
            <td>配色方案</td>
            <td>各项界面元素的配色来源：内置颜色（默认）/ 基于背景颜色 / 朴素颜色。Android 12 及以上，「内置颜色」跟随系统主题色。</td>
          </tr>
          <tr>
            <td>主题选择</td>
            <td>多组内置主题卡片，点击应用整套背景与配色，并按背景图自动生成主题色。</td>
          </tr>
          <tr>
            <td>恢复默认</td>
            <td>页面顶部的「恢复默认」按钮，清除当前主题，回到默认外观。</td>
          </tr>
        </tbody>
      </table>
      <p>
        面板的「主题」页除颜色模式与配色方案外，还能自定义<b>背景、贴图和贴图透明度</b>（支持网络图片或电视本地文件），
        适合把全家福、风景照设为背景。
      </p>

      <h2 id="update">更新</h2>
      <table>
        <thead>
          <tr><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>更新通道</td>
            <td>接收哪个通道的版本更新：稳定版本（默认）/ 预览版本 / 开发版本。切换后立即检查一次该通道的新版本。</td>
          </tr>
          <tr>
            <td>更新强提醒</td>
            <td>默认关。开 = 只要还有新版本，每次启动都全屏提醒，忽略只跳过这一次；关 = 仅消息提示，同一版本只提示一次。</td>
          </tr>
        </tbody>
      </table>
      <p>各通道的区别、更新页面的使用，见 <a [routerLink]="'/build'">下载与更新</a>。</p>

      <h2 id="network">网络</h2>
      <table>
        <thead>
          <tr><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>HTTP请求重试次数</td>
            <td>获取订阅源、节目单失败时的重试次数，默认 10；可选 1～10、15、20、30、40、50。</td>
          </tr>
          <tr>
            <td>HTTP请求重试间隔时间</td>
            <td>每次重试之间的间隔，默认 1 秒；可选 0 / 1 / 2 / 3 / 5 / 10 / 15 / 20 / 30 秒。</td>
          </tr>
        </tbody>
      </table>
      <p>
        两项都只影响订阅源与节目单数据的获取；源地址不稳定、经常加载失败时可适当调大重试次数。
        面板的「网络」页另有「启用 IPv6」开关。
      </p>

      <h2 id="permissions">权限</h2>
      <p>
        只有两项。点击条目跳转到系统授权界面，条目右侧图标显示当前是否已授权。
        面板没有对应页面，只能在电视端操作。
      </p>
      <table>
        <thead>
          <tr><th>权限</th><th>用途</th></tr>
        </thead>
        <tbody>
          <tr><td>安装未知应用</td><td>应用内更新、面板推送 APK 到电视安装时需要</td></tr>
          <tr><td>读取外部存储/管理全部文件</td><td>读取本地订阅源文件、本地云同步文件、语音识别模型等存储内容时需要</td></tr>
        </tbody>
      </table>
      <p>开机自启、画中画、后台播放不在这里——它们都在「通用」。</p>

      <h2 id="debug">调试</h2>
      <p>排查问题时使用，正常观看保持关闭即可。</p>
      <table>
        <thead>
          <tr><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>显示性能信息</td>
            <td>默认关。开启后所有界面（含直播）左上角浮窗显示 FPS（含近 15 秒柱状图）、帧时间、Jank 卡顿数、内存占用。</td>
          </tr>
          <tr>
            <td>显示播放器信息</td>
            <td>默认关。显示当前播放的编码、解码器、采样率等详细信息；直播界面按 INFO 键效果相同。</td>
          </tr>
          <tr>
            <td>显示布局网格</td>
            <td>默认关。在界面上叠加布局网格线。</td>
          </tr>
          <tr>
            <td>解码器信息</td>
            <td>子页查看系统全部解码器的能力：软解/硬解、各分辨率与码率的支持情况。选超分、插帧方案前可先看这里。</td>
          </tr>
        </tbody>
      </table>
      <p>面板的「调试」页除上述开关外，还能<b>导出 Logcat</b>：把电视端系统日志下载为 txt 文件，反馈问题时一并附上。</p>

      <h2 id="log">日志</h2>
      <p>
        <b>设置 → 日志</b> 显示应用运行日志的实时列表：按时间倒序、每秒自动刷新，每条包含级别、标签、内容与时间。
        只读，没有设置项。
      </p>
      <p>
        面板的「日志」页更适合细看：可按级别（ALL / INFO / ERROR / WARN / DEBUG）筛选、分页查看、手动刷新。
        注意面板「调试」页导出的 logcat 是系统日志，和这里的应用内日志不是同一份。
      </p>

      <h2 id="reset">改错了怎么办</h2>
      <p>
        <b>设置 → 通用 → 恢复初始化</b> 一键清空全部设置与数据，回到首次安装状态；只想还原外观，用
        <b>设置 → 主题 → 恢复默认</b> 单独重置主题。
      </p>
      <doc-callout kind="warn" title="恢复初始化不可撤销" icon="warning">
        动手前先留好后路：用 <a [routerLink]="'/sync'">云同步</a> 把配置推送到云端，或在面板的「备份管理」页建一个本地快照。
        这样就算误清空，随时能把配置拉回来。
      </doc-callout>
    </div>
  `,
})
export class SettingsOverviewPage {}
