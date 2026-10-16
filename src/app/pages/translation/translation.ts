import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';
import { DocShot } from '../../shared/doc-shot';

@Component({
  selector: 'app-translation',
  imports: [DocPageHeader, DocCallout, DocShot, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="字幕翻译教程"
        lead="把实时字幕（ASR）或视频自带字幕轨翻译成目标语言。本页从选引擎、申请凭据，到电视端与网页面板的配置、排查，一步步走完。"
      />

      <h2 id="how">译文从哪来</h2>
      <p>字幕翻译会用在两种场景，同一时间只会有一种在跑：</p>
      <ul>
        <li>
          <b>字幕轨翻译</b>：播放源自带字幕轨（内嵌或外挂）时，选中该字幕轨，
          每句字幕被翻译后叠在原文<b>上方</b>。
        </li>
        <li>
          <b>实时字幕翻译</b>：源没有字幕轨时，先开启实时字幕（ASR），
          识别出的整句被翻译，显示在原文<b>下方</b>（原文在上、译文在下）。
        </li>
      </ul>
      <p>
        源一旦带可用的字幕轨，实时字幕会自动让位，所以「有字幕轨还想看 ASR 译文」做不到——
        两者二选一。翻译引擎选好就生效，播放时没有单独的「翻译」开关。
      </p>
      <doc-callout kind="info" title="只支持 Media3 与 IJK 内核" icon="info">
        字幕轨翻译依赖播放器把字幕<b>文本</b>交给 App；ASR 实时字幕本身也只支持 Media3 与 IJK。
        VLC 内核的字幕由 VLC 自己渲染到字幕层，App 拿不到文本，两种翻译都不会有译文。
        要用翻译请把 <b>设置 → 播放器 → 视频播放器内核</b> 切到 Media3 或 IJK。
      </doc-callout>

      <h2 id="choose">先选一个引擎</h2>
      <p>
        六种引擎做的都是一句话一句话的通用文本翻译，日常看剧差别不大，先按「手上有什么」选：
      </p>
      <table>
        <thead>
          <tr><th>引擎</th><th>要准备什么</th><th>费用</th><th>网络要求</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><b>谷歌翻译</b></td>
            <td>什么都不用申请</td>
            <td>免费（接口没有官方配额，被限流时会时好时坏）</td>
            <td>设备能直接访问 Google，大陆网络需自备代理</td>
          </tr>
          <tr>
            <td><b>MTranServer</b><br/>（自托管）</td>
            <td>一台常开的机器（NAS、软路由、小主机）和它的局域网地址</td>
            <td>免费，吃自己的机器</td>
            <td>局域网内可达即可，不用外网</td>
          </tr>
          <tr>
            <td><b>腾讯翻译</b></td>
            <td>腾讯云账号，SecretId + SecretKey</td>
            <td>文本翻译每月 500 万字符免费，超出按量计费</td>
            <td>能访问腾讯云</td>
          </tr>
          <tr>
            <td><b>百度翻译</b></td>
            <td>百度智能云账号，API Key + Secret Key</td>
            <td>开通后有免费额度，超出按量计费</td>
            <td>能访问百度智能云</td>
          </tr>
          <tr>
            <td><b>有道翻译</b></td>
            <td>有道智云账号，应用ID + 应用密钥</td>
            <td>新用户赠体验金，之后按量付费</td>
            <td>能访问有道智云</td>
          </tr>
          <tr>
            <td><b>微软翻译</b></td>
            <td>Azure 账号，密钥 + 区域</td>
            <td>免费层（F0）每月 200 万字符</td>
            <td>能访问 Azure</td>
          </tr>
        </tbody>
      </table>
      <p>
        拿不准就按这个顺序试：<b>有代理先试谷歌</b>（零配置）；<b>家里有 NAS / 软路由就上 MTranServer</b>
        （一次部署，长用最省心，字幕也不出局域网）；都没有再从云平台里挑一个申请凭据。
      </p>
      <doc-callout kind="info" title="免费额度以各家控制台为准" icon="info">
        各平台的免费额度、实名要求与计费方式会调整，本页只写要点与申请路径；
        具体额度、价格以对应平台控制台与定价页当前显示的为准。
      </doc-callout>

      <h2 id="setup-tv">电视端配置</h2>
      <ol>
        <li>打开 <b>设置 → 播放器 → 字幕翻译</b>。</li>
        <li>选中 <b>翻译引擎</b>（子页里选），未配置时不翻译；选中的条目右侧打勾。</li>
        <li>选完引擎后，这一页会多出该引擎需要的凭据行，逐项填好，填对的项末尾显示「已配置」。</li>
        <li>设好 <b>目标语言</b> 与 <b>译文大小</b>，设置即完成。</li>
      </ol>
      <table>
        <thead>
          <tr><th>设置项</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>翻译引擎</td>
            <td>未配置（默认，不翻译）/ 谷歌翻译 / MTranServer / 腾讯翻译 / 百度翻译 / 有道翻译 / 微软翻译。</td>
          </tr>
          <tr>
            <td>目标语言</td>
            <td>
              默认 English，共 16 种：英 / 中 / 日 / 韩 / 法 / 德 / 西 / 俄 / 葡 / 意 / 泰 / 越 / 印尼 / 马来 / 阿 / 粤语。
              源语言不用选，引擎自动识别。
            </td>
          </tr>
          <tr>
            <td>译文大小</td>
            <td>译文相对原文字幕的字号比例，×0.5 ～ ×2.0（步进 0.1），默认 ×1.0。</td>
          </tr>
        </tbody>
      </table>

      <h2 id="setup-panel">用面板配置（推荐）</h2>
      <p>
        密钥一长串，遥控器上输入很费劲。打开
        <a [routerLink]="'/remote-panel'">远程配置面板</a> 的 <b>播放器</b> 页，
        在「字幕翻译」卡片里填一样的内容，电脑键盘敲完最快。
      </p>
      <doc-callout kind="tip" title="面板上这两张卡片要手动保存" icon="save">
        播放器页多数选项改动即保存，但 <b>ASR 语音识别</b> 和 <b>字幕翻译</b> 两张卡片各有自己的
        「保存」按钮——改完引擎、凭据、目标语言，记得点卡片内的「保存」再离开。
      </doc-callout>
      <doc-shot
        src="screenshots/panel-player-translation.png"
        alt="网页面板播放器页：字幕翻译卡片"
        caption="面板 → 播放器页下半部分的「字幕翻译」卡片：引擎、凭据、目标语言、译文大小都在这里，改完点卡片内的「保存」。"
      />

      <h2 id="keys">各引擎的申请与配置</h2>
      <p>按你选的引擎对号入座，从头走一遍即可。</p>

      <h3 id="key-google">谷歌翻译（不用申请）</h3>
      <p>
        引擎选「谷歌翻译」就能用，不需要任何凭据。它走的是公开的免费翻译接口，
        <b>设备必须能直接访问 Google</b>：大陆网络环境下要在路由器或电视上配好代理，否则一直不会有译文，
        而且不会有任何报错提示。这个接口没有官方配额，被限流时会时好时坏。
      </p>

      <h3 id="key-mtranserver">MTranServer（自托管）</h3>
      <p>
        <a href="https://github.com/xxnuo/MTranServer" target="_blank" rel="noopener">MTranServer</a>
        是一个跑在自己机器上的开源离线翻译服务，用的是 Mozilla Firefox Translations 的模型，
        <b>不需要显卡</b>，NAS、软路由、小主机都能带：部署一次，翻译全在局域网里完成，
        <b>不花钱、不依赖外网</b>，单句通常几十毫秒返回，官方说明内存占用在 1 GB 以内。
      </p>
      <ol>
        <li>
          在一台常开的设备上按项目 README 的 Docker 方式部署：拉取镜像
          <code>xxnuo/mtranserver:latest</code>（amd64 / arm64 都有）后用 compose 拉起，
          服务默认监听 <code>8989</code> 端口。
        </li>
        <li>
          部署完先验证：用手机或电脑浏览器访问 <code>http://192.168.1.100:8989</code>
          （换成你那台机器的 IP）看有没有响应。
        </li>
        <li>
          电视端 <b>设置 → 播放器 → 字幕翻译 → 翻译引擎</b> 选「MTranServer（自托管）」，
          在 <b>服务器地址</b> 填 <code>http://192.168.1.100:8989</code>（也可以只填 <code>192.168.1.100:8989</code>，
          没写协议时按 http 处理）。
        </li>
        <li>
          给服务器设了访问令牌（<code>MT_API_TOKEN</code>）的话，把同一个令牌填到 <b>API Token</b>；没设就留空。
        </li>
      </ol>
      <p>
        语言方面：MTranServer 支持 59 种语言，模型以英语为中枢，其余语言之间经英语中转；
        翻译目标选简体中文、繁体中文都没问题，但<b>不支持粤语</b>——目标语言选粤语时会退化为繁体中文。
      </p>
      <doc-callout kind="tip" title="为什么推荐自托管" icon="speed">
        云引擎每翻一句都要出一次公网请求，跟不跟得上语速全看网络；MTranServer 在局域网里，
        延迟通常在几十毫秒，直播这种一句话接一句话的场景最稳，长时间开着也不产生费用。
      </doc-callout>

      <h3 id="key-tencent">腾讯翻译</h3>
      <ol>
        <li>
          登录腾讯云后，先在
          <a href="https://console.cloud.tencent.com/tmt" target="_blank" rel="noopener">机器翻译控制台</a>
          开通服务——开通即送当月免费额度（文本翻译每月 500 万字符，仅当月有效）。
        </li>
        <li>
          打开<a href="https://console.cloud.tencent.com/cam/capi" target="_blank" rel="noopener">访问管理 → API 密钥管理</a>，
          新建一对密钥，得到 <b>SecretId</b> 与 <b>SecretKey</b>
          （SecretKey 只在创建时显示一次，先复制下来）。
        </li>
        <li>把两个值填到字幕翻译子页的「腾讯云 SecretId」「腾讯云 SecretKey」，两项都显示「已配置」即完成。</li>
      </ol>
      <p>
        用的是腾讯云账号的通用 API 密钥，不是别处的口令。免费额度用完后<b>后付费默认是关闭的</b>，
        想接着用得在机器翻译控制台的「系统设置」里自行开启；用子账号的密钥时，
        还要给该子账号授予机器翻译相关权限（策略名以控制台里显示的为准）。
      </p>

      <h3 id="key-baidu">百度翻译</h3>
      <p>
        注意：应用里的「百度翻译」走的是<b>百度智能云</b>的机器翻译接口，凭据是 <b>API Key + Secret Key</b>，
        不是翻译开放平台（fanyi-api）的 APP ID + 密钥，两边的凭据不通用。
      </p>
      <ol>
        <li>
          登录百度智能云，进入控制台的
          <a href="https://ai.baidu.com/ai-doc/REFERENCE/Ck3dwjhhu" target="_blank" rel="noopener">机器翻译</a>
          产品，首次使用先按页面提示开通服务、领取免费资源。
        </li>
        <li>在该产品的<b>应用列表</b>里创建应用，接口权限勾上机器翻译。</li>
        <li>
          应用创建后，列表里能看到 <b>AppID、API Key、Secret Key</b> 三项，只记后两项。
        </li>
        <li>
          填到子页对应项：<b>百度翻译 API Key</b> 填 API Key，<b>百度翻译 密钥</b> 填 Secret Key（AppID 用不到）。
          App 会用这两个值自动换取访问令牌（有效期 30 天，会自动续），不用手动填令牌。
        </li>
      </ol>

      <h3 id="key-youdao">有道翻译</h3>
      <ol>
        <li>打开 <a href="https://ai.youdao.com" target="_blank" rel="noopener">有道智云</a>，注册并登录。</li>
        <li>
          在控制台<b>创建应用</b>，服务选<b>文本翻译</b>；创建后在<b>应用总览</b>里能看到
          <b>应用ID（APP key）</b> 与 <b>应用密钥</b>。
        </li>
        <li>分别填到子页的「有道翻译 应用ID」「有道翻译 应用密钥」。</li>
      </ol>
      <p>新用户注册会赠送体验金，用完后按翻译字符量计费。</p>

      <h3 id="key-microsoft">微软翻译</h3>
      <ol>
        <li>
          登录
          <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation" target="_blank" rel="noopener">Azure 门户</a>，
          按「翻译」资源向导创建实例。
        </li>
        <li>
          定价层选 <b>F0（免费层，每月 200 万字符）</b>；创建完成后进入资源页面，
          在「密钥和终结点」里复制 <b>密钥</b> 和 <b>区域</b>（如 <code>eastasia</code>）。
        </li>
        <li>
          密钥填到「微软翻译 密钥」；区域填到「微软翻译 区域」。
          创建的是<b>区域资源</b>就必须填对应区域；全局资源（Global）可以不填。
        </li>
      </ol>

      <h2 id="limits">已知限制</h2>
      <ul>
        <li>
          <b>只翻整句</b>：流式识别中不断变化的半句不翻，等这句话稳定了才发出去，
          译文会比原文晚一拍出现。
        </li>
        <li>
          <b>每秒最多一次请求</b>：App 内置节流，同一时刻只有一个翻译请求在飞。
          对话密集、语速快时译文会滞后，个别短句可能轮不到翻译——这是保护各家接口配额的机制，
          换更快的引擎（如自建 MTranServer）能缓解，但节流本身仍在。
        </li>
        <li>
          <b>相同句子只翻一次</b>：按「原文 + 目标语言」缓存，重复台词不重复请求；
          换台或重新播放后缓存清空。
        </li>
        <li>
          <b>引擎、凭据与目标语言不参与云同步</b>：这几项只存在本机，
          换设备要重新配，详见 <a [routerLink]="'/sync'">云同步与备份</a>。
        </li>
        <li>
          <b>云端模型自带翻译</b>：实时字幕选的是云端模型（<b>Gemini Live Translate</b> /
          <b>通义千问实时同传</b> / <b>Soniox 实时翻译</b>）时，识别与翻译一体，不再调用上面选的引擎
          （也正因如此，没有译文时先确认引擎没被云端模型接管）。
        </li>
        <li>
          <b>Beta 状态</b>：翻译失败不会在画面上报错，只写进应用日志，表现就是「这一句没有译文」。
        </li>
      </ul>

      <h2 id="troubleshoot">没有译文？按这个顺序查</h2>
      <table>
        <thead>
          <tr><th>现象</th><th>先查什么</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>一直没有任何译文</td>
            <td>
              字幕翻译子页里「翻译引擎」是不是还停在「未配置」；在面板上改的是不是忘了点卡片内的「保存」；
              内核是不是 VLC（换成 Media3 / IJK）。
            </td>
          </tr>
          <tr>
            <td>凭据显示「未配置」</td>
            <td>对应项没填或没填完，两项以上凭据的引擎要求都填齐；复制时注意别把空格带进去。</td>
          </tr>
          <tr>
            <td>有原文、没译文（有字幕轨的片源）</td>
            <td>
              播放中确认选中的是文本字幕轨；位图字幕（PGS 这类画出来的字幕）没有文本，翻不了，
              换一条文本字幕轨再试。
            </td>
          </tr>
          <tr>
            <td>有原文、没译文（靠 ASR 的源）</td>
            <td>
              实时字幕本身有没有出字（ASR 没识别出内容自然也没得翻）；
              源是不是带字幕轨（带了的话 ASR 会让位）。ASR 的准备见
              <a [routerLink]="'/player-settings'" fragment="asr">播放器与字幕</a>。
            </td>
          </tr>
          <tr>
            <td>选了谷歌，什么都没发生</td>
            <td>设备访问不了 Google。大陆网络下没有代理会一直静默失败，先保证电视能直连 Google。</td>
          </tr>
          <tr>
            <td>腾讯 / 百度 / 有道 / 微软 没反应</td>
            <td>
              凭据与服务对不上：腾讯要用云账号的 API 密钥并已开通机器翻译；百度要用百度智能云的
              API Key + Secret Key（不是翻译开放平台的 APP ID）；微软要填资源所在的区域。
              错误只写日志、画面上没有提示。
            </td>
          </tr>
          <tr>
            <td>MTranServer 连不上</td>
            <td>电视上确认地址和端口写对、和服务在同一局域网；换台设备用浏览器打开同一地址验证服务是否在跑。</td>
          </tr>
          <tr>
            <td>译文时有时无</td>
            <td>每秒一次的节流遇上密集对话的正常表现；把引擎换成局域网内的 MTranServer 会明显好转。</td>
          </tr>
          <tr>
            <td>换台后头几句没有译文</td>
            <td>缓存随换台清空，重新请求需要一点时间，属正常现象。</td>
          </tr>
        </tbody>
      </table>
      <p>
        更多应用日志查看方式见 <a [routerLink]="'/faq'">常见问题</a>；
        电视端设置与面板的对应关系见 <a [routerLink]="'/settings'">设置项总览</a>。
      </p>

      <h2 id="privacy">费用与隐私</h2>
      <ul>
        <li>
          <b>计费方式</b>：云引擎按翻译的字符数计费，字幕只在有字幕时才产生请求，
          长时间挂着直播会持续消耗免费额度；各家额度与单价见对应平台定价页。
        </li>
        <li>
          <b>字幕会出网</b>：用云引擎时，每句字幕的文本都会发送到对应平台，按平台自己的隐私政策处理。
          不想让字幕离开家里网络就用 MTranServer，识别与翻译全在本机与局域网内完成。
        </li>
      </ul>
    </div>
  `,
})
export class TranslationPage {}
