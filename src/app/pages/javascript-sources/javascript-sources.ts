import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';

@Component({
  selector: 'app-javascript-sources',
  imports: [DocPageHeader, DocCallout, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="JavaScript 脚本源"
        lead="内置 QuickJS 引擎：直接在播放列表中通过 JavaScript 脚本动态计算实时播放地址、鉴权 Token、防盗链请求头与动态 M3U8 列表，无需架设外部服务。"
      />

      <h2 id="what">这是什么</h2>
      <p>
        很多网络直播流出于版权与防盗链考虑，并不提供长期固定的播放地址，而是需要时效 Token、动态签名计算、登录鉴权或防盗链请求头（Headers）。
        传统做法通常是在路由器或 NAS 上搭建 Python / PHP 服务进行转发代理。
      </p>
      <p>
        <b>电视直播</b>内置了基于 <b>QuickJS</b> 的轻量级原生 JavaScript 引擎（<code>JSEngine</code>），
        无需安装任何 Python / PHP 运行环境或额外组件（Android 6.0 及以上原生即开即用）：
      </p>
      <ul>
        <li><b>本地毫秒级执行</b>：换台时在电视本地微秒至毫秒级运行脚本，直出真实流地址，体验与普通直播源无异；</li>
        <li><b>原生支持防盗链头</b>：脚本返回的 <code>User-Agent</code>、<code>Referer</code>、<code>Origin</code> 等请求头会自动透传给底层播放器与 CDN 分片请求；</li>
        <li><b>支持动态 M3U8 生成</b>：若直播流返回动态 M3U8 文本，内置轻量服务会自动流式接管并实时刷新分片列表；</li>
        <li><b>兼容 KU9 规范</b>：全面兼容已有 KU9 规范的 JavaScript 脚本生态。</li>
      </ul>

      <h2 id="syntax">播放列表中的写法</h2>
      <p>在 <code>.m3u</code> 或 <code>.txt</code> 播放列表中，有两种声明使用 JavaScript 脚本源的方式：</p>

      <h3 id="syntax-line">1. 线路直接指定（javascript:// 前缀）</h3>
      <p>格式为 <code>javascript://脚本地址?参数</code>。问号前为脚本的下载地址（支持 HTTP/HTTPS 远程链接与 <code>file://</code> 本地路径），问号后为传给脚本的参数。</p>
      <pre><code># M3U 写法
#EXTINF:-1 group-title="央视频道",CCTV-1 综合
javascript://https://example.com/live.js?id=cctv1
#EXTINF:-1 group-title="卫视频道",湖南卫视
javascript://https://example.com/live.js?id=hunantv&quality=1080p

# TXT 写法
CCTV-1,javascript://https://example.com/live.js?id=cctv1
湖南卫视,javascript://https://example.com/live.js?id=hunantv&quality=1080p</code></pre>
      <doc-callout kind="tip" title="使用本地脚本文件" icon="folder">
        也可以将脚本放在设备本地存储中（可通过<a [routerLink]="'/remote-panel'">远程配置面板</a>的「文件」页上传到电视应用目录），然后使用本地协议路径：<br />
        <code>javascript://file:///data/user/0/com.github.mytv.android/files/scripts/live.js?id=cctv1</code>
      </doc-callout>

      <h3 id="syntax-group">2. 分组批量绑定（SCRIPT / JS 参数）</h3>
      <p>
        如果整个分组或同一个源的很多频道都使用同一份解析脚本，无需逐行重复写脚本地址，直接在分组声明中指定 <code>SCRIPT=</code>（或历史别名 <code>JS=</code>）：
      </p>
      <pre><code># TXT 分组写法（强烈推荐，简洁清晰）
央视频道,#genre#,SCRIPT=https://example.com/live.js?id=
CCTV-1 综合,cctv1
CCTV-2 财经,cctv2
CCTV-13 新闻,cctv13

# M3U 分组写法
#EXTM3U
#EXTKU9OPT:SCRIPT=https://example.com/live.js?id=
#EXTINF:-1 group-title="央视频道",CCTV-1 综合
cctv1</code></pre>
      <p>
        应用解析时会自动把 <code>SCRIPT</code> 声明的前缀与频道线路内容拼接，并将该线路自动设为 JavaScript 脚本线路。
      </p>

      <h2 id="script-spec">脚本编写规范与入口</h2>
      <p>脚本内必须导出一个全局 <code>main</code> 函数作为入口：</p>
      <pre><code>function main(item) &#123;
    // 业务解析逻辑
    return url;
&#125;</code></pre>

      <h3 id="script-params">参数传递机制</h3>
      <p>引擎在执行前会自动检测脚本风格并注入参数：</p>
      <ul>
        <li>
          <b>KU9 兼容模式</b>（推荐）：当脚本中包含 <code>ku9.</code>、<code>require("jsencrypt")</code>、<code>console.log</code> 或 <code>function main(item)</code> 时自动启用。
          此时传入的 <code>item</code> 是一个增强代理对象：
          <ul>
            <li><code>item.id</code>：直接读取 URL 参数中的 <code>id</code> 字段值；</li>
            <li><code>item.params</code> 或 <code>item.Params</code>：解析好的键值对字典（例如 <code>&#123; id: "cctv1", quality: "1080p" &#125;</code>）；</li>
            <li><code>item.raw</code>：<code>?</code> 后面的完整原始参数字符串；</li>
            <li><code>item.url</code>：默认回退为原始参数；</li>
            <li>在做字符串拼接时（如 <code>"http://..." + item</code>），<code>item</code> 会自动隐式转换为原始参数串。</li>
          </ul>
        </li>
        <li>
          <b>mytv 原生模式</b>：当函数签名为 <code>function main(data)</code> 时，直接传入 <code>?</code> 后面的原始字符串。
        </li>
        <li>
          全局上下文中亦同时挂载了 <code>globalThis.item</code> 与 <code>globalThis.data</code>。
        </li>
      </ul>

      <h2 id="returns">返回值类型</h2>
      <p><code>main()</code> 函数执行完成后，支持返回以下四种结果：</p>

      <h3 id="return-string">1. 直接返回播放链接（字符串）</h3>
      <p>适合无需额外防盗链请求头的公开流：</p>
      <pre><code>function main(item) &#123;
    const playUrl = "https://live-cdn.example.com/" + item.id + "/index.m3u8";
    return playUrl;
&#125;</code></pre>

      <h3 id="return-object">2. 返回播放链接与请求头对象（推荐）</h3>
      <p>
        多数带防盗链的直播源需要校验 <code>User-Agent</code>、<code>Referer</code> 或 <code>Origin</code>。返回包含 <code>headers</code> 的对象，播放器在请求视频索引与所有分片切片时均会自动带上这些请求头：
      </p>
      <pre><code>function main(item) &#123;
    return &#123;
        url: "https://live-cdn.example.com/" + item.id + "/index.m3u8",
        headers: &#123;
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            "Referer": "https://example.com/",
            "Origin": "https://example.com"
        &#125;
    &#125;;
&#125;</code></pre>

      <h3 id="return-m3u8">3. 返回动态 M3U8 播放列表文本（m3u8 字段）</h3>
      <p>
        若上游接口返回的是动态生成的切片列表文本，可以直接返回 <code>m3u8</code> 字段（或者返回的字符串以 <code>#EXTM3U</code> 开头）：
      </p>
      <pre><code>function main(item) &#123;
    const m3u8Text = mytv.fetch("https://api.example.com/get_playlist?id=" + item.id);
    return &#123;
        m3u8: m3u8Text,
        headers: &#123;
            "Referer": "https://example.com/"
        &#125;
    &#125;;
&#125;</code></pre>
      <p>
        此时，应用内置的轻量 HTTP 服务会自动代理接管该流，播放器轮询刷新切片列表时会实时触发脚本重新执行，而 CDN 分片请求则直接带上配置的 headers 发往真实源站。
      </p>

      <h3 id="return-error">4. 返回错误信息（error 字段）</h3>
      <pre><code>function main(item) &#123;
    if (!item.id) &#123;
        return &#123; error: "缺少频道 ID 参数" &#125;;
    &#125;
&#125;</code></pre>
      <p>播放器会中止播放并在电视屏幕上给出明确错误提示。</p>

      <h2 id="apis">内置 API 与全局对象</h2>
      <p>
        环境内注入了全局桥接对象 <b><code>mytv</code></b> 与 <b><code>ku9</code></b>（两者完全等价），无需引入第三方库即可直接使用底层原生的高性能 API：
      </p>

      <h3 id="api-modules">第三方库支持（require）</h3>
      <table>
        <thead>
          <tr><th>模块名</th><th>说明</th><th>典型用法</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>crypto</code></td>
            <td>内置完整的 <b>CryptoJS</b> 库</td>
            <td><code>const CryptoJS = require("crypto");<br />const hash = CryptoJS.HmacSHA256(data, key).toString();</code></td>
          </tr>
          <tr>
            <td><code>jsencrypt</code></td>
            <td>内置 <b>JSEncrypt</b> RSA 非对称加密库</td>
            <td><code>const JSEncrypt = require("jsencrypt");<br />const js = new JSEncrypt();<br />js.setPublicKey(pubKey);<br />const enc = js.encrypt(token);</code></td>
          </tr>
        </tbody>
      </table>

      <h3 id="api-methods">全局方法速查表</h3>
      <table>
        <thead>
          <tr><th>分类</th><th>方法名</th><th>功能说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td rowspan="4"><b>网络请求</b></td>
            <td><code>mytv.fetch(url)</code></td>
            <td>快速发起 HTTP GET 请求，直接返回响应体文本内容。</td>
          </tr>
          <tr>
            <td><code>mytv.get(url, headers)</code></td>
            <td>发送带请求头的 GET 请求。<code>headers</code> 支持对象、换行文本或数组。</td>
          </tr>
          <tr>
            <td><code>mytv.post(url, headers, body)</code></td>
            <td>发送 POST 请求，传入 URL、请求头与请求体字符串。</td>
          </tr>
          <tr>
            <td><code>mytv.request(url, method, headers, body, redirect)</code></td>
            <td>完整 HTTP 请求，返回 <code>&#123; code, body, headers, headersText &#125;</code> 响应对象。</td>
          </tr>
          <tr>
            <td rowspan="5"><b>加解密与哈希</b></td>
            <td><code>mytv.md5(text)</code><br /><code>mytv.sha1 / sha256 / sha512</code></td>
            <td>原生哈希计算，返回小写十六进制字符串。</td>
          </tr>
          <tr>
            <td><code>mytv.rsaEncrypt(data, pubKeyPem)</code><br /><code>mytv.rsaDecrypt(data, privKeyPem)</code></td>
            <td>原生 RSA 加密与解密，支持 PEM 格式公钥与私钥。</td>
          </tr>
          <tr>
            <td><code>mytv.rsaSign(data, privKeyPem, digest)</code><br /><code>mytv.rsaVerify(...)</code></td>
            <td>原生 RSA 签名与验签，摘要算法默认 SHA-256。</td>
          </tr>
          <tr>
            <td><code>mytv.opensslEncrypt(data, type, key, outType, iv)</code><br /><code>mytv.opensslDecrypt(...)</code></td>
            <td>原生 OpenSSL 对称加解密（AES-128-CBC、AES-256-CBC、DES 等）。</td>
          </tr>
          <tr>
            <td><code>mytv.rc4Encrypt(...)</code> / <code>rc4Decrypt(...)</code></td>
            <td>RC4 流加密与解密。</td>
          </tr>
          <tr>
            <td rowspan="4"><b>编码与解析</b></td>
            <td><code>mytv.encodeBase64(str)</code><br /><code>mytv.decodeBase64(str)</code></td>
            <td>原生 Base64 编码与解码。</td>
          </tr>
          <tr>
            <td><code>mytv.getQuery(url, key)</code></td>
            <td>快速获取 URL 中指定 Query 参数的值。</td>
          </tr>
          <tr>
            <td><code>mytv.uri(url)</code></td>
            <td>将 URL 解析为 URI 对象，包含 <code>FullPath</code>、<code>Query</code>、<code>Params</code> 等字段。</td>
          </tr>
          <tr>
            <td><code>parseItems(str)</code></td>
            <td>将类似 <code>k1=v1&k2=v2</code> 的字符串解析为键值对对象。</td>
          </tr>
          <tr>
            <td rowspan="3"><b>本地存储与文件</b></td>
            <td><code>mytv.setCache(key, value, ttlMillis)</code></td>
            <td>存储本地缓存，支持毫秒级过期时间 TTL，避免每次换台都重复请求上游登录接口。</td>
          </tr>
          <tr>
            <td><code>mytv.getCache(key)</code></td>
            <td>读取未过期的本地缓存数据，失效或不存在时返回 null。</td>
          </tr>
          <tr>
            <td><code>mytv.readFile(path)</code><br /><code>mytv.writeFile(path, content)</code><br /><code>mytv.fileExists(path)</code></td>
            <td>读写电视设备本地文件。</td>
          </tr>
          <tr>
            <td rowspan="2"><b>时间转换</b></td>
            <td><code>mytv.toTimestamp(str, format, timezone)</code></td>
            <td>根据日期格式解析时间戳（秒）。</td>
          </tr>
          <tr>
            <td><code>mytv.formatDateTime(str, inFmt, outFmt, daysOffset, inTz, outTz)</code></td>
            <td>跨时区或偏移天数格式化时间文本。</td>
          </tr>
          <tr>
            <td><b>调试日志</b></td>
            <td><code>console.log(...)</code> 或 <code>mytv.log(...)</code></td>
            <td>将日志输出到应用的系统运行日志，可在网页面板「日志」页实时筛选查看。</td>
          </tr>
        </tbody>
      </table>

      <h2 id="examples">完整示例</h2>

      <h3 id="example-basic">示例 1：标准动态 Token 拼接</h3>
      <p>最简单的防盗链场景：通过 API 请求获取时效 Token 后组装播放地址。</p>
      <pre><code>function main(item) &#123;
    const channelId = item.id;
    if (!channelId) &#123;
        return &#123; error: "缺少频道 ID" &#125;;
    &#125;

    // 1. 请求鉴权接口获取 Token
    const authRes = mytv.fetch("https://api.example.com/auth?channel=" + channelId);
    const authData = JSON.parse(authRes);
    const token = authData.token;

    // 2. 组装真实播放流与防盗链 Header
    return &#123;
        url: "https://live.example.com/" + channelId + "/index.m3u8?token=" + token,
        headers: &#123;
            "User-Agent": "okhttp/4.9.0",
            "Referer": "https://example.com/live"
        &#125;
    &#125;;
&#125;</code></pre>

      <h3 id="example-cached">示例 2：利用缓存避免频繁鉴权</h3>
      <p>利用 <code>mytv.getCache</code> 和 <code>mytv.setCache</code> 对有效期较长的 Token（如 1 小时）进行复用：</p>
      <pre><code>function main(item) &#123;
    const channelId = item.id;
    const cacheKey = "stream_token_" + channelId;

    // 1. 先尝试从缓存读取
    let token = mytv.getCache(cacheKey);

    if (!token) &#123;
        // 2. 缓存失效或首次访问，请求新 Token
        const resp = mytv.fetch("https://api.example.com/get_token?channel=" + channelId);
        const data = JSON.parse(resp);
        token = data.token;
        // 写入缓存，有效期 50 分钟（3000000 毫秒）
        mytv.setCache(cacheKey, token, 3000000);
    &#125;

    return &#123;
        url: "https://cdn.example.com/" + channelId + ".m3u8?sign=" + token,
        headers: &#123;
            "Referer": "https://cdn.example.com"
        &#125;
    &#125;;
&#125;</code></pre>

      <h3 id="example-crypto">示例 3：带签名与哈希的请求</h3>
      <p>演示如何使用内置的 <code>require("crypto")</code> 或 <code>mytv.md5</code> 进行参数签名：</p>
      <pre><code>function main(item) &#123;
    const CryptoJS = require("crypto");
    const timestamp = Math.floor(Date.now() / 1000);
    const secret = "mytv_secret_key";
    
    // 计算 MD5 或 SHA256 签名
    const sign = CryptoJS.MD5(item.id + timestamp + secret).toString();

    const playUrl = "https://live.example.com/" + item.id + ".m3u8?t=" + timestamp + "&s=" + sign;
    return &#123;
        url: playUrl,
        headers: &#123;
            "User-Agent": "Mozilla/5.0",
            "X-Requested-With": "com.example.app"
        &#125;
    &#125;;
&#125;</code></pre>

      <h2 id="transform-js">订阅源转换脚本（transformJs）</h2>
      <p>
        除了在单条线路上执行 <code>javascript://</code> 外，应用还支持对整个订阅源进行批量过滤与转换：
      </p>
      <p>
        在订阅源的进阶配置中填入 <b>订阅源转换脚本</b>（<code>transformJs</code>）。当应用拉取或刷新该订阅源时，会把解析出的全量频道列表数组（<code>channelList</code>）传入脚本的 <code>main(channelList)</code> 函数。
      </p>
      <pre><code>// 订阅源转换脚本示例
function main(channelList) &#123;
    // 过滤掉包含“购物”或“测试”的频道
    return channelList.filter(function(channel) &#123;
        return !channel.name.includes("购物") && !channel.name.includes("测试");
    &#125;).map(function(channel) &#123;
        // 批量修改某些频道的分组或名称
        if (channel.name.startsWith("CCTV")) &#123;
            channel.groupName = "央视专区";
        &#125;
        return channel;
    &#125;);
&#125;</code></pre>
      <p>脚本处理完成后返回新的频道列表，应用将以转换后的结果构建界面与选台菜单。</p>

      <h2 id="debugging">开发与调试技巧</h2>
      <ul>
        <li>
          <b>查看打印日志</b>：在脚本中加入 <code>console.log("参数:", item.raw)</code>，然后在<a [routerLink]="'/remote-panel'">远程配置面板</a>的「日志」页面搜索 <code>JSLog</code>，即可实时观察脚本运行状态和捕获的异常信息；
        </li>
        <li>
          <b>语法兼容</b>：QuickJS 完整支持现代 ES2020 / ES2023 标准语法（包括可选链 <code>?.</code>、空值合并 <code>??</code>、解构赋值、箭头函数与 <code>Promise</code> 等）；
        </li>
        <li>
          <b>错误排查</b>：如果脚本抛出未捕获异常或语法错误，播放器会触发重试或切换至下一条备用线路。
        </li>
      </ul>
    </div>
  `,
})
export class JavascriptSourcesPage {}
