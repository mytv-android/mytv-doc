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
      <p>切换：<b>设置 → 界面 → 经典选台界面</b>（将选台界面替换为经典三段式结构，默认开）。经典模式下还提供以下独立开关（均在「设置 → 界面」，仅经典模式开启时出现）：</p>
      <table>
        <thead>
          <tr><th>设置</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>显示订阅源列表</td><td>开</td><td>在经典选台界面中启用"向左查看订阅源"功能</td></tr>
          <tr><td>显示频道信息</td><td>关</td><td>在经典选台界面中显示当前频道的详细信息</td></tr>
          <tr><td>单独显示频道号</td><td>关</td><td>开启时同时显示频道号和台标；没有台标则显示频道名首字</td></tr>
          <tr><td>显示全部频道</td><td>关</td><td>是否显示当前订阅源全部频道列表</td></tr>
        </tbody>
      </table>
      <p>面板：<code>/ui</code> 提供对应的开关字段（经典选台界面 / 经典-显示订阅源列表 / 经典-显示频道信息 / 经典-单独显示频道号 / 经典-显示全部频道），<code>remoteConfig=true</code> 的项随云同步下发。</p>

      <h2>2. 跨组切换与循环</h2>
      <table>
        <thead>
          <tr><th>开关</th><th>默认</th><th>作用</th><th>位置</th></tr>
        </thead>
        <tbody>
          <tr><td>频道切换跨分组</td><td>开</td><td>启用后，上下键可在所有频道间切换；关闭则仅在当前分组内切换</td><td>设置 → 控制</td></tr>
          <tr><td>频道列表首尾循环</td><td>开</td><td>启用后，到达列表首尾时将循环切换到另一端</td><td>设置 → 控制</td></tr>
        </tbody>
      </table>
      <p>TV：设置 → 控制；面板：<code>/control</code>。两者均为 <code>Boolean</code> 开关，对应配置项 <code>iptvChannelChangeCrossGroup</code> 与 <code>iptvChannelChangeListLoop</code>。</p>

      <h2>3. 加密分组</h2>
      <p>
        开关：<b>设置 → 订阅源 → 支持加密频道组</b>（默认关），配置项 <code>iptvChannelGroupEncrypted</code>。
        开启后，若 m3u 中分组名以 <code>_数字</code> 结尾（例如 <code>成人_1234</code>），进入该分组时需输入密码，
        密码即 <code>_</code> 之后的数字部分。此类加密分组<b>默认在搜索和「全部频道」中隐藏</b>，仅在选台界面切换到该分类时才弹出密码框。
      </p>
      <p>面板 <code>/sources</code> 同名开关可远程修改；属于 <code>remoteConfig</code>，随云同步下发。</p>

      <h2>4. 收藏夹</h2>
      <ul>
        <li><b>切换收藏</b>：频道项上长按 OK。</li>
        <li><b>入口</b>：Dashboard 收藏区 / 收藏页 / 频道列表顶部「收藏」分组。</li>
        <li><b>分组</b>：收藏页内置「全部」+ 按订阅源名分组。</li>
        <li><b>清空</b>：收藏页头部「清空」按钮。</li>
        <li><b>开关</b>：<b>设置 → 界面 → 启用收藏</b>（是否显示当前订阅源频道收藏列表，默认开），配置项 <code>iptvChannelFavoriteEnable</code>。关闭后 Dashboard 收藏区与收藏页均不显示。</li>
        <li><b>备份</b>：随云同步或面板 <code>/api/configs</code> 备份 / 恢复。</li>
      </ul>

      <h2>5. 隐藏频道与分组</h2>
      <p>隐藏分为两级（均在「设置 → 订阅源」下，面板 <code>/sources</code> 同名编辑）：</p>
      <ul>
        <li>
          <b>分类隐藏（按分组）</b>：<b>设置 → 订阅源 → 分类隐藏</b>。
          TV 端进入子页面，4 列网格逐组切换可见性；未隐藏时列表头显示「共 N 个分组」，已隐藏则显示「共 N 个分组，已隐藏 M 个分组」。
          对应配置项 <code>iptvChannelGroupHiddenList</code>（<code>Set&lt;String&gt;</code>，默认空）。面板 <code>/sources</code> 用 chips 编辑「频道隐藏分组」。
        </li>
        <li>
          <b>隐藏频道规则（按频道名正则）</b>：<b>设置 → 订阅源 → 隐藏频道规则</b>。
          频道名称匹配正则规则的频道将不会在列表中出现；支持多条正则，每条独立添加 / 删除。
          添加时输入完整正则表达式（例如 <code>.*测试.*</code>），列表为空时显示「暂无隐藏规则，点击"添加"配置」。
          对应配置项 <code>iptvChannelHiddenList</code>（<code>Set&lt;String&gt;</code>，默认空）。面板 <code>/sources</code> 用 chips 编辑「频道隐藏列表」。
        </li>
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
        <li><b>最近四屏</b>：「操作屏幕」菜单中的选项，一键把当前多屏同播整体替换为最近观看的前 4 个频道（不足 4 个时按实际数量；无观看记录时提示）。</li>
        <li><b>方案</b>：最多保存 <b>20</b> 套布局（新建 / 重命名 / 复制 / 删除），按更新时间排序。</li>
      </ul>

      <h2>8. 频道别名</h2>
      <p>
        不同订阅源对同一频道常起名不一致（"CCTV-1" vs "CCTV1 综合"）。在面板首页或 <code>/sources</code> 页编辑<b>频道别名</b>，
        让多个名字映射到同一逻辑频道。配置项 <code>iptvChannelNameAlias</code>（JSON 字符串，默认值为 <code>R.raw.channel_name_alias</code> 的内容；为空时回退到内置资源），
        参与云同步，TV 端只读（<code>remoteConfig=true</code>），列表头显示「共 N 个频道，M 个别名」。
        配合 <b>设置 → 订阅源 → 相似频道合并</b>（相同频道别名将进行合并，默认开，配置项 <code>iptvSimilarChannelMerge</code>），
        相同别名的频道会合并显示。
      </p>
      <p>别名配置示例：</p>
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
        <li><b>频道图标提供</b>（配置项 <code>iptvChannelLogoProvider</code>，默认 <code>https://gitee.com/mytv-android/myTVlogo/raw/main/img/&#123;name|uppercase&#125;.png</code>）：
          按 URL 模板拼接，变量 <code>&#123;name&#125;</code> / <code>&#123;name|lowercase&#125;</code> / <code>&#123;name|uppercase&#125;</code>。
          自动追加 <code>_t=&lt;10天周期&gt;</code> 让缓存过期。TV 端只读（<code>remoteConfig=true</code>），在面板 <code>/sources</code> 编辑。</li>
      </ul>
      <p>
        <b>频道图标覆盖</b>（使用频道图标提供覆盖订阅源中定义的频道图标，默认开，配置项 <code>iptvChannelLogoOverride</code>）：
        开启后用「图标提供」覆盖订阅源中的 <code>tvg-logo</code>。两者都在
        <b>设置 → 订阅源</b> 和面板 <code>/sources</code> 编辑。
      </p>
    </div>
  `,
})
export class ChannelsPage {}
