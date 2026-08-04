import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocPageHeader } from '../../shared/doc-page-header';

@Component({
  selector: 'app-channels',
  imports: [DocPageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="频道、收藏与搜索"
        lead="频道列表、跨组切换、加密分组、收藏夹、隐藏规则与搜索的完整说明。"
      />

      <h2>1. 频道列表</h2>
      <p>
        主界面按 <b>OK 键</b>（或单击屏幕）打开频道列表。列表上方是<b>分组条形</b>（来源于 m3u 的 <code>group-title</code>，支持 <code>;</code> 分多组），
        下方是<b>频道网格</b>。界面有两种形态：
      </p>
      <ul>
        <li><b>经典选台界面</b>（默认开）：三段式结构，左侧订阅源列表 + 中间分组 + 右侧频道网格。</li>
        <li><b>现代面板</b>：分组条 + 频道网格两栏。</li>
      </ul>
      <p>切换：<b>设置 → 界面 → 经典选台界面</b>。经典模式下还提供以下独立开关：</p>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>显示订阅源列表</td><td>开</td><td>经典模式左栏显示订阅源</td></tr>
          <tr><td>显示频道信息</td><td>关</td><td>经典模式显示当前频道详细信息</td></tr>
          <tr><td>单独显示频道号</td><td>关</td><td>无台标时显示频道名首字</td></tr>
          <tr><td>显示全部频道</td><td>关</td><td>是否显示当前订阅源全部频道列表</td></tr>
          <tr><td>节目单常显</td><td>关</td><td>经典模式始终显示节目单</td></tr>
        </tbody>
      </table>

      <h2>2. 跨组切换与循环</h2>
      <table>
        <thead>
          <tr><th>开关</th><th>默认</th><th>作用</th></tr>
        </thead>
        <tbody>
          <tr><td>频道切换跨分组</td><td>开</td><td>上下键跨分组连续换台；关闭则仅在当前分组内切换</td></tr>
          <tr><td>频道列表首尾循环</td><td>开</td><td>到达列表首尾后跳到另一端</td></tr>
        </tbody>
      </table>
      <p>TV：设置 → 控制；面板：<code>/control</code>。</p>

      <h2>3. 加密分组</h2>
      <p>
        在 <b>设置 → 订阅源 → 支持加密频道组</b>（默认关）开启后，
        若 m3u 中分组名以 <code>_数字</code> 结尾（例如 <code>成人_1234</code>），进入该分组时需输入密码，
        密码即 <code>_</code> 后的数字部分。加密分组在搜索中也会被隐藏。
      </p>

      <h2>4. 收藏夹</h2>
      <ul>
        <li><b>切换收藏</b>：频道项上长按 OK。</li>
        <li><b>入口</b>：Dashboard 收藏区 / 收藏页 / 频道列表顶部「收藏」分组。</li>
        <li><b>分组</b>：收藏页内置「全部」+ 按订阅源名分组。</li>
        <li><b>清空</b>：收藏页头部「清空」按钮。</li>
        <li><b>开关</b>：<b>设置 → 界面 → 启用收藏</b>（默认开）。</li>
        <li><b>备份</b>：随云同步或面板 <code>/api/configs</code> 备份 / 恢复。</li>
      </ul>

      <h2>5. 隐藏频道与分组</h2>
      <p>隐藏分为两级：</p>
      <ul>
        <li><b>分类隐藏（按分组）</b>：<b>设置 → 订阅源 → 分类隐藏</b>，4 列网格逐组切换可见性。面板 <code>/sources</code> 用 chips 编辑。</li>
        <li><b>隐藏频道规则（按频道名正则）</b>：<b>设置 → 订阅源 → 隐藏频道规则</b>。命中的频道不会出现在列表 / 搜索中。支持多条正则。面板 <code>/sources</code> 用 chips 编辑。</li>
      </ul>

      <h2>6. 搜索</h2>
      <p>入口：Dashboard 搜索模块 / 主界面长按 OK → 搜索。</p>
      <ul>
        <li><b>输入</b>：上方文本框（关键词...），下方屏幕键盘（A–Z + 0–9 + 退格 + 清空）。</li>
        <li><b>算法</b>：
          <ul>
            <li>输入含非 ASCII（中文）→ 直接 <code>contains</code> 匹配频道名。</li>
            <li>输入 ASCII → 把频道名转<b>拼音首字母</b>后匹配。</li>
          </ul>
        </li>
        <li><b>防抖</b>：200ms。</li>
        <li><b>加密分组</b>与<b>隐藏规则</b>命中的频道不出现在搜索结果中。</li>
      </ul>

      <h2>7. 多屏同播（MultiView）</h2>
      <ul>
        <li>入口：Dashboard 导航「多屏同播」。</li>
        <li>最多 <b>9</b> 路同屏播放；超出会提示「超出最大添加频道数：9」。</li>
        <li>每路支持：添加 / 搜索添加 / 切换频道 / 删除 / 放大 / 缩小 / 暂停 / 播放 / 静音 / 切换线路 / 回看 / 移动屏幕。</li>
        <li><b>方案</b>：最多保存 <b>20</b> 套布局（新建 / 重命名 / 复制 / 删除），按更新时间排序。</li>
      </ul>

      <h2>8. 频道别名</h2>
      <p>
        不同订阅源对同一频道常起名不一致（"CCTV-1" vs "CCTV1 综合"）。在面板首页或 <code>/sources</code> 页编辑<b>频道别名</b>，
        让多个名字映射到同一逻辑频道。配合 <b>设置 → 订阅源 → 相似频道合并</b>（默认开），
        相同别名的频道会合并显示。
      </p>
      <p>别名文件示例：</p>
      <pre><code>&#123;
  "__suffix": ["高清", "超清", "HD"],
  "CCTV1": ["CCTV-1", "CCTV 1", "央视一套"],
  "湖南卫视": ["湖南台", "湖南台高清"]
&#125;</code></pre>
      <ul>
        <li><code>__suffix</code>：归一化时剥离的后缀。</li>
        <li>其他键：标准名 → 别名数组。</li>
      </ul>

      <h2>9. 频道图标</h2>
      <p>
        频道图标有两个来源：
      </p>
      <ul>
        <li>m3u 中的 <code>tvg-logo</code> 字段。</li>
        <li><b>频道图标提供</b>（默认 <code>https://gitee.com/mytv-android/myTVlogo/raw/main/img/&#123;name|uppercase&#125;.png</code>）：
          按 URL 模板拼接，变量 <code>&#123;name&#125;</code> / <code>&#123;name|lowercase&#125;</code> / <code>&#123;name|uppercase&#125;</code>。
          自动追加 <code>_t=&lt;10天周期&gt;</code> 让缓存过期。</li>
      </ul>
      <p>
        <b>频道图标覆盖</b>（默认开）：用「图标提供」覆盖订阅源中的 <code>tvg-logo</code>。两者都在
        <b>设置 → 订阅源</b> 和面板 <code>/sources</code> 编辑。
      </p>
    </div>
  `,
})
export class ChannelsPage {}
