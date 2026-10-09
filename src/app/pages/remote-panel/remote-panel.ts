import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';
import { DocShot } from '../../shared/doc-shot';

@Component({
  selector: 'app-remote-panel',
  imports: [DocPageHeader, DocCallout, DocShot, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="远程配置面板"
        lead="电视内置的网页后台：用手机或电脑的浏览器就能给电视推订阅源、改设置、传文件、看日志、装 APK，省去在电视上打字的麻烦。"
      />

      <h2 id="what">这是什么</h2>
      <p>
        应用运行时会在电视上开启一个网页服务（端口 <b>10591</b>），同一局域网内的手机、电脑用浏览器打开就能管理电视上的几乎所有配置。
        本文档里简称「<b>面板</b>」。
      </p>

      <h2 id="open">怎么打开</h2>
      <ol>
        <li>电视上打开 <b>首页 → 推送</b>，屏幕中央会显示<b>二维码和地址</b>（形如 <code>http://192.168.1.5:10591</code>）。</li>
        <li>手机扫码，或在电脑浏览器手动输入这个地址。</li>
      </ol>
      <ul>
        <li>手机 / 电脑必须和电视在<b>同一局域网</b>。</li>
        <li>10591 被其他程序占用时会自动改用随机端口——以推送页上显示的地址为准。</li>
        <li>面板由应用的前台服务承载（通知栏可见「远程遥控服务正在后台运行」），应用被清理后面板就打不开了。</li>
        <li>设置里各编辑框左下角「扫码编辑」弹出的二维码、设置 → 服务 →「在网页面板中配置」弹出的二维码，扫开也是这个面板。</li>
      </ul>

      <doc-callout kind="warn" title="面板没有密码，注意使用环境" icon="warning">
        面板没有任何登录验证，<b>同一局域网内的任何人都能改你的配置</b>。请只在家中等可信网络使用；
        不要把 10591 端口映射到公网，也不要在公共 Wi-Fi（酒店、商场）下使用。
      </doc-callout>

      <h2 id="basics">面板本身</h2>
      <ul>
        <li><b>语言</b>：中文 / English / 阿拉伯语，默认跟随浏览器；点右上角地球图标切换（阿拉伯语会自动改为从右到左排版）。</li>
        <li><b>明暗外观</b>：右上角太阳 / 月亮图标切换，只影响面板自己，与电视端的<a [routerLink]="'/settings'">主题</a>无关。</li>
        <li>
          <b>改动即保存</b>：设置页里的开关、下拉、输入框改完立即生效推送到电视，不需要找保存按钮。
          仅有的例外是播放器页里的「实时字幕 ASR」和「字幕翻译」两张卡片，改完要按卡片里的「保存」。
        </li>
        <li>浏览器标签页切回面板时会自动重新拉取最新配置；保存失败会提示「保存失败，请刷新页面后重试」。</li>
      </ul>

      <h2 id="home-cards">首页：快捷操作</h2>
      <p>面板打开后的首页不是状态页，而是一排<b>快捷操作卡片</b>，最常用的推送都在这里：</p>
      <doc-shot
        src="screenshots/panel-home.png"
        alt="网页面板首页：若干快捷操作卡片"
        caption="网页面板首页。左侧「关于应用」只读；右侧卡片从「订阅源」「自定义节目单」一路往下是「播放器全局设置」「云同步」「安装 APK」。"
      />
      <table>
        <thead>
          <tr><th>卡片</th><th>能做什么</th></tr>
        </thead>
        <tbody>
          <tr><td><b>关于应用</b></td><td>查看应用版本与设备名称（只读）。</td></tr>
          <tr>
            <td><b>订阅源</b></td>
            <td>
              快速推送一条订阅源到电视：支持远程地址（含 FTP / SMB / WebDAV 及账号密码）、Xtream、Stalker、
              设备上的文件路径、直接从电脑选文件上传。详见<a [routerLink]="'/sources'">订阅源</a>。
            </td>
          </tr>
          <tr><td><b>网页源央视频 Cookie</b></td><td>粘贴网页版央视频登录后的 Cookie，用于收看付费频道。</td></tr>
          <tr><td><b>频道图标提供</b></td><td>台标图片地址模板，见<a [routerLink]="'/channels'">频道 · 收藏 · 搜索</a>。</td></tr>
          <tr><td><b>频道别名</b></td><td>编辑频道名归一化别名表（JSON），见<a [routerLink]="'/channels'">频道 · 收藏 · 搜索</a>。</td></tr>
          <tr><td><b>自定义节目单</b></td><td>推送一条节目单（EPG）地址到电视，见<a [routerLink]="'/epg'">EPG 节目单</a>。</td></tr>
          <tr><td><b>播放器全局设置</b></td><td>推送全局 UA 与自定义请求头，见<a [routerLink]="'/player-settings'">播放器与字幕</a>。</td></tr>
          <tr><td><b>云同步</b></td><td>配置云同步服务商与凭据，见<a [routerLink]="'/sync'">云同步与备份</a>。</td></tr>
          <tr>
            <td><b>安装 APK</b></td>
            <td>选择电脑上的 APK 上传到电视，电视端弹窗确认后即开始安装——给电视装 / 升级应用最方便的方式。</td>
          </tr>
        </tbody>
      </table>

      <h2 id="pages">各设置页一览</h2>
      <doc-shot
        src="screenshots/panel-ui.png"
        alt="网页面板界面页"
        caption="面板的设置页都是这个样式：一行一项，开关直接拨，改完即保存——以「界面」页为例。"
      />
      <p>侧边栏的其余页面与电视端「设置」里的分类一一对应，细节在手册的对应章节，这里只列面板特有的操作：</p>
      <table>
        <thead>
          <tr><th>面板页</th><th>对应手册</th><th>面板特有的能力</th></tr>
        </thead>
        <tbody>
          <tr><td>通用</td><td><a [routerLink]="'/settings'">设置项总览</a></td><td>—</td></tr>
          <tr><td>订阅源</td><td><a [routerLink]="'/sources'">订阅源</a></td><td>从电脑 / 手机选文件上传成源、在线读写文件源内容</td></tr>
          <tr><td>服务</td><td><a [routerLink]="'/python-services'">服务（Python / PHP）</a></td><td>选择脚本文件上传、检查代码、运行自检</td></tr>
          <tr><td>节目单</td><td><a [routerLink]="'/epg'">EPG 节目单</a></td><td>—</td></tr>
          <tr><td>界面</td><td><a [routerLink]="'/live-screen'">直播主界面</a></td><td>—</td></tr>
          <tr><td>主题</td><td><a [routerLink]="'/settings'">设置项总览</a></td><td>—</td></tr>
          <tr><td>控制</td><td><a [routerLink]="'/controls'">遥控器与触屏</a></td><td>—（见下方说明）</td></tr>
          <tr><td>播放器</td><td><a [routerLink]="'/player-settings'">播放器与字幕</a></td><td>—</td></tr>
          <tr><td>WebView</td><td><a [routerLink]="'/webview-player'">WebView 播放器</a></td><td>—</td></tr>
          <tr><td>网络</td><td><a [routerLink]="'/settings'">设置项总览</a></td><td>—</td></tr>
          <tr><td>更新</td><td><a [routerLink]="'/build'">下载与更新</a></td><td>—（注意：不能在这里推 APK）</td></tr>
          <tr><td>云同步</td><td><a [routerLink]="'/sync'">云同步与备份</a></td><td>导入 / 导出 JSON</td></tr>
        </tbody>
      </table>

      <h3 id="control-page">「控制」页不是遥控器模拟器</h3>
      <p>
        面板的「控制」页用来<b>修改电视遥控器的按键行为</b>（每个方向键、确认键、长按分别触发什么），
        不是用手机当遥控器。按键映射的说明见<a [routerLink]="'/controls'">遥控器与触屏</a>。
      </p>

      <h3 id="update-page">「更新」页不能推 APK</h3>
      <p>
        「更新」页只改更新策略（稳定 / 预览 / 开发通道、强提醒）。想把 APK 文件推到电视安装，用面板<b>首页</b>的「安装 APK」卡片，
        详见<a [routerLink]="'/build'">下载与更新</a>。
      </p>

      <h2 id="file">文件页：管理电视上的文件</h2>
      <ul>
        <li>浏览电视端应用专属目录（文件目录 / 缓存目录），支持新建文件夹、上传、重命名、删除，点目录名进入、面包屑返回。</li>
        <li>点某个文件的<b>使用</b>按钮，会把它的路径带回首页的订阅源表单（自动切为「文件」类型），推送即成源；给「服务」页添加本地脚本时同样用它拿路径。</li>
        <li>典型用途：上传本地 m3u 订阅、上传 Python / PHP 脚本、清理缓存目录。</li>
      </ul>

      <h2 id="backup">备份管理页：电视端本地快照</h2>
      <p>
        「备份管理」把电视上的全部设置与数据打成一个本地快照，可创建、恢复、删除；
        恢复会覆盖当前数据且需要重启应用才完全生效。电视端 设置 → 通用 → 备份管理 管理的是同一批快照。它和「云同步」是两回事（快照只存在这台电视上），区别与用法见
        <a [routerLink]="'/sync'">云同步与备份</a>。
      </p>

      <h2 id="log-debug">日志与调试页</h2>
      <ul>
        <li><b>日志</b>：按时间倒序查看应用日志，可按级别（INFO / WARN / ERROR / DEBUG）筛选与分页，提交问题时从这里找线索。</li>
        <li><b>调试</b>：开关「显示性能信息 / 显示播放器信息 / 显示布局网格」，以及<b>导出 logcat</b>（下载电视的系统日志文件）。</li>
      </ul>

      <h2 id="panel-only">仍需在面板完成的操作</h2>
      <p>
        以前在电视端只读、只能来面板改的设置——全局 UA、自定义请求头、自定义 DNS、代理与代理规则、正则解码配置、Media3 隧道解码、
        频道别名、频道图标提供、网页源央视频 Cookie、云同步凭据、翻译与 Gemini 密钥，以及添加订阅源 / 节目单 / 服务、自定义主题、备份管理等——
        现在电视端都能直接操作。电视端编辑框左下角的「扫码编辑」仍可切到面板，两种方式并存，面板保存后电视端立即生效。
      </p>
      <p>下面这些涉及文件传输或面板专属页面，仍只能在面板完成：</p>
      <ul>
        <li>安装 APK：首页「安装 APK」卡片，从电脑上传 APK 推送安装</li>
        <li>文件页：浏览、上传、重命名、删除电视上的文件</li>
        <li>订阅源：「本地上传」从电脑 / 手机选文件推送，查看 / 修改本地文件源的内容</li>
        <li>服务：选择脚本文件上传、检查代码、运行自检</li>
        <li>调试：导出 Logcat</li>
        <li>云同步：导入 / 导出应用数据（JSON）</li>
        <li>日志：按级别筛选、分页查看</li>
      </ul>
    </div>
  `,
})
export class RemotePanelPage {}
