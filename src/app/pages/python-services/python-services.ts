import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';

@Component({
  selector: 'app-python-services',
  imports: [DocPageHeader, DocCallout, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="服务（Python / PHP）"
        lead="在电视上运行脚本，把脚本提供的本地订阅地址（例如央视频直播源）当作订阅源使用。运行环境按需下载，不占安装包体积。"
      />

      <h2 id="what">这是什么</h2>
      <p>
        「服务」让你在电视上运行一段脚本（多数是直播源服务脚本，例如央视频的 ysp-live），
        脚本在电视上对外提供一个订阅地址，像普通订阅源一样添加使用即可，
        也可以分享给同一局域网里的其他设备（APTV、电脑播放器等）。
      </p>
      <p>支持两种脚本语言，添加服务时二选一：</p>
      <table>
        <thead>
          <tr><th></th><th>Python 服务</th><th>PHP 服务</th></tr>
        </thead>
        <tbody>
          <tr><td>脚本形态</td><td>独立运行的服务脚本，自己监听端口、常驻后台</td><td>单文件 Web 脚本，有请求时才执行一次并返回结果</td></tr>
          <tr><td>运行环境</td><td>CPython 3.11 + 标准库，约 7 MB</td><td>PHP 8.4，含 curl、openssl、json 等常用扩展</td></tr>
          <tr><td>默认端口</td><td>8767</td><td>8768</td></tr>
          <tr><td>典型脚本</td><td><code>ysp-live.py</code></td><td><code>ysp.php</code> 等单文件脚本</td></tr>
        </tbody>
      </table>
      <p>
        两种服务都要先下载对应的运行环境（按需下载，不含在安装包中），且需要
        <b>Android 7.0 及以上</b>；Android 6.0 设备没有此功能，其余功能不受影响。
      </p>

      <h2 id="install-runtime">第一步：下载运行环境</h2>
      <ol>
        <li>电视端：<b>设置 → 组件下载</b>，找到 <b>Python 运行环境</b> 或 <b>PHP 运行环境</b>，按 OK 开始下载；也可以在网页面板的「服务」页下载。</li>
        <li>等待状态从「下载中 → 校验中 → 解压中」变为<b>已安装</b>。</li>
        <li>（可选）在面板「服务」页点<b>运行自检</b>，确认版本、证书与端口绑定都正常。</li>
      </ol>
      <doc-callout kind="info" title="运行环境可随时删除" icon="info">
        在「组件下载」中长按已安装的运行环境可删除；删除不会动已添加的服务，重新下载后即可继续使用。
      </doc-callout>

      <h2 id="add">第二步：添加服务（网页面板）</h2>
      <p>
        服务的添加与编辑都在网页面板完成（打开方式见
        <a [routerLink]="'/remote-panel'">远程配置面板</a>）：
      </p>
      <ol>
        <li>面板 <b>服务</b> 页 → 右上角 <b>添加服务</b>。</li>
        <li>
          选择 <b>脚本语言</b>（Python 或 PHP）。注意：<b>保存后不能再改语言</b>，选错了删掉重新添加。
        </li>
        <li>填写 <b>服务名称</b>（如「央视频直播」）与 <b>端口</b>（Python 默认 8767、PHP 默认 8768，一般不用改）。</li>
        <li>
          <b>代码来源</b>三选一：
          <ul>
            <li><b>远程链接</b>：填脚本地址即可，保存时设备会自动拉取一次，之后按更新间隔自动更新；</li>
            <li>
              <b>本地上传 / 直接填写</b>：点 <b>选择脚本文件</b> 挑电脑 / 手机上的
              <code>.py</code> / <code>.php</code> 文件，或把代码整段粘贴进代码框；
              保存时推送到电视，由应用存成电视上的脚本文件。与订阅源的「直接粘贴内容」是同一套做法；
            </li>
            <li><b>电视本地路径</b>：填设备上已有的脚本路径（也可在「文件」页上传后用「使用」按钮填入）。</li>
          </ul>
        </li>
        <li>设置 <b>自动更新间隔</b>（小时，0 = 不自动更新，默认 24；仅远程链接来源有效）。</li>
        <li>按需打开 <b>局域网共享</b>（允许同一局域网的其他设备访问）与 <b>启用</b>，保存。</li>
      </ol>
      <p>
        <b>启用</b>的服务在每次打开应用时都会自动运行：运行环境已装好就直接拉起；
        如果启动时还没下载运行环境，装好之后（设置 → 组件下载，或面板「服务」页下载）会自动补拉起，不用重启应用。
        上次异常退出导致闪退的服务会被跳过并在列表里标出异常，修正脚本后手动启动即可。
      </p>
      <p>
        保存后服务会按启用状态立即启动。列表每 3 秒自动刷新状态，每行可以直接启停、复制地址，更多操作（立即更新脚本、查看日志、编辑、删除）在行尾的 ⋮ 菜单里。
      </p>
      <p>
        编辑已保存的 Python 服务时可点 <b>检查代码</b>，对脚本做静态检查（语法错误、缺失的第三方依赖等），排查启动失败时很有用。
      </p>

      <h3 id="advanced">高级选项</h3>
      <p>添加 / 编辑服务时展开「高级选项」：</p>
      <table>
        <thead>
          <tr><th>选项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><b>拉取脚本 User-Agent</b></td>
            <td>下载远程脚本时使用的 UA。个别站点会拒绝空 UA，拉不下来时填一个浏览器 UA 再试。</td>
          </tr>
          <tr>
            <td><b>代理</b></td>
            <td>
              <code>http://主机:端口</code> 或 <code>socks5://主机:端口</code>，支持带账号密码。
              既用于下载脚本；Python 服务里也会同时作为脚本自身网络请求的代理。
            </td>
          </tr>
          <tr>
            <td><b>附加启动参数</b>（仅 Python）</td>
            <td>追加给脚本的启动参数，例如参考脚本的 <code>--no-4k</code>。</td>
          </tr>
          <tr>
            <td><b>环境变量</b>（仅 Python）</td>
            <td>每行一条 <code>KEY=VALUE</code>，脚本读取环境变量即可拿到（如 TOKEN）。</td>
          </tr>
          <tr>
            <td><b>脚本退出后自动重启</b>（仅 Python）</td>
            <td>
              脚本异常退出后自动拉起；连续多次启动即退出会停止重试并提示。
              PHP 脚本按请求执行、不存在“退出”，所以没有这三项。
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="address">第三步：添加为订阅源</h2>
      <p>服务运行后，列表里每个服务会显示两个地址（都有复制按钮）：</p>
      <table>
        <thead>
          <tr><th>地址</th><th>用途</th></tr>
        </thead>
        <tbody>
          <tr><td><code>http://127.0.0.1:&lt;端口&gt;/all.m3u</code></td><td><b>电视本机</b>使用</td></tr>
          <tr><td><code>http://&lt;电视IP&gt;:&lt;端口&gt;/all.m3u</code></td><td>局域网内其他设备使用；需开启<b>局域网共享</b></td></tr>
        </tbody>
      </table>
      <ul>
        <li>
          最省事的做法：服务行的 ⋮ 菜单 → <b>一键添加订阅</b>，自动把本机地址添加为订阅源（重复添加会提示已存在）。
        </li>
        <li><code>all.m3u</code> 是这类脚本的约定路径；个别脚本使用其他路径时，以脚本作者的说明为准。</li>
        <li>
          修改<b>局域网共享</b>后服务会自动重启生效。Python 脚本通过环境变量 <code>MYTV_BIND</code>
          获知该监听本机还是局域网（脚本不读它就按脚本自己的默认）；PHP 服务的监听范围由应用直接控制，无需脚本配合。
        </li>
      </ul>

      <h2 id="tv-manage">电视端的管理入口</h2>
      <p>
        电视端 <b>设置 → 服务</b> 能看到与面板一致的服务列表：每行显示名称、地址与运行状态，
        按 OK 启动 / 停止，<b>长按删除</b>（脚本与日志一并删除）；「Python / PHP 运行环境」那一行点按跳转到「组件下载」。
        添加服务、编辑服务与查看日志请用网页面板。
      </p>

      <h2 id="auto-update">脚本自动更新</h2>
      <p>
        远程链接来源的脚本会按「自动更新间隔」在后台自动拉取：内容有变化就替换并重启服务，拉取失败保留现有脚本并显示错误；
        本地上传 / 直接填写与电视本地路径来源的脚本，由应用在启动和更新时按内容变化同步。
        服务行的 ⋮ 菜单里还有 <b>立即更新脚本</b>，可以随时强制同步一次。
      </p>

      <h2 id="log">日志与排查</h2>
      <ul>
        <li>⋮ 菜单 → <b>查看日志</b>：实时查看脚本输出与报错（打开期间每 3 秒自动刷新）。</li>
        <li>状态含义：<b>运行中</b>（正常提供服务）、<b>启动中</b>（已启动还没就绪）、<b>异常</b>（看行内错误信息与日志）、<b>已停止</b>。</li>
        <li>
          常见失败：提示「请先下载运行环境」→ 去 <b>组件下载</b>；端口被占用 → 给服务换个端口；
          远程脚本拉不下来 → 检查电视网络，或在高级选项里填 UA / 代理；
          Python 脚本报缺少模块 → 见下方「已知限制」。
        </li>
        <li>Python 脚本崩溃如果导致应用闪退，下次启动时会自动跳过该服务的自动启动并显示异常，修正脚本后手动启动即可。</li>
      </ul>

      <h2 id="limits">已知限制</h2>
      <ul>
        <li>需要 <b>Android 7.0 及以上</b>。</li>
        <li>
          <b>Python：只能运行纯 Python 脚本</b>。没有 pip，第三方依赖必须是纯 Python 包并手工放入依赖目录（可用面板「文件」页上传）；
          多进程、加载系统动态库等能力在 Android 上不可用或受限。
        </li>
        <li>
          <b>PHP：单文件、按请求执行</b>，可用扩展以运行环境内置的为准（curl、openssl、json 等已包含）；
          请求逐个处理，不适合执行时间很长的脚本。
        </li>
        <li>单个服务的日志超过 2 MB 会自动截断重写，避免长期运行写满存储。</li>
        <li>多个 Python 服务共用同一个解释器，代理与环境变量是所有 Python 服务共用的。</li>
      </ul>

      <doc-callout kind="warn" title="只添加可信来源的脚本" icon="warning">
        服务会原样执行你添加的脚本，等同于在电视上装了一个程序。请只加载<b>可信来源</b>的脚本（优先 HTTPS 链接）；
        网页面板本身没有密码，不要在不可信的网络里开放它，具体见
        <a [routerLink]="'/remote-panel'">远程配置面板</a>的安全说明。
      </doc-callout>
    </div>
  `,
})
export class PythonServicesPage {}
