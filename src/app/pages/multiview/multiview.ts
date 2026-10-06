import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageHeader } from '../../shared/doc-page-header';
import { DocCallout } from '../../shared/doc-callout';

@Component({
  selector: 'app-multiview',
  imports: [DocPageHeader, DocCallout, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header
        title="多屏同播"
        lead="一块屏幕同时播放最多 9 路直播，每路独立控制。本页说明布局规则、单屏操作、移动屏幕与可复用的频道方案。"
      />

      <h2 id="what">这是什么</h2>
      <p>
        多屏同播把屏幕分成最多 <b>9</b> 格，每格（每屏）独立播放一路直播，适合同时盯多个频道——比如多场球赛、多个新闻台。
      </p>
      <p>入口：<b>首页 → 多屏同播</b>；也可在 <b>设置 → 通用 → 启动页面</b> 设为开机直达。</p>
      <ul>
        <li>屏幕按数量自适应网格排布，每屏按 16:9 独立解码播放；</li>
        <li>每屏<b>默认静音</b>，想听哪路就对哪路单独取消静音；</li>
        <li>某一路播放出错时，自动切换到下一条线路；</li>
        <li>同一频道不能重复添加（提示「已存在该频道」）；</li>
        <li>加满 9 屏后再添加会提示「超出最大添加频道数：9」。</li>
      </ul>

      <h2 id="actions">单屏操作</h2>
      <p>方向键聚焦某一屏，按 <b>OK</b> 弹出「操作屏幕 N」菜单（N 为屏幕序号）：</p>
      <table>
        <thead>
          <tr><th>菜单项</th><th>作用</th></tr>
        </thead>
        <tbody>
          <tr><td>添加</td><td>从频道列表选一个频道，新增一屏（已满 9 屏时不可用）</td></tr>
          <tr><td>搜索</td><td>搜索频道并新增一屏（同上）</td></tr>
          <tr><td>切换</td><td>更换本屏播放的频道</td></tr>
          <tr><td>删除</td><td>移除本屏；至少保留一屏</td></tr>
          <tr><td>放大 / 缩小</td><td>放大后本屏占主画面、其余屏环绕小窗（一大多小）；再选缩小还原均分</td></tr>
          <tr><td>切换线路</td><td>为本屏频道切换下一条线路</td></tr>
          <tr><td>回看</td><td>打开本屏频道的节目单，选已播节目回看（需线路支持）</td></tr>
          <tr><td>暂停 / 播放</td><td>暂停或恢复本屏画面</td></tr>
          <tr><td>静音 / 取消静音</td><td>只控制本屏声音，各屏互不影响</td></tr>
          <tr><td>保存方案 / 保存并命名</td><td>把当前频道组合存为方案，见下文「方案」</td></tr>
          <tr><td>方案列表</td><td>打开已保存的方案</td></tr>
          <tr><td>最近四屏</td><td>一键铺屏，见下文「最近四屏」</td></tr>
          <tr><td>刷新</td><td>重新加载本屏播放</td></tr>
        </tbody>
      </table>

      <h3 id="recent-four">最近四屏</h3>
      <p>
        菜单中的「最近四屏」把当前所有屏幕替换为<b>最近观看的前 4 个频道</b>，一键铺屏；
        观看记录不足 4 个时按实际数量铺，完全没有记录时提示「暂无最近观看记录」。
      </p>

      <h2 id="move">移动屏幕</h2>
      <p>
        聚焦某一屏<b>长按 OK</b>，弹出「移动屏幕 N」：再选目标屏幕，两屏<b>交换位置</b>。
        用来调整哪一路占主画面，或把常看的摆到顺手的位置。
      </p>

      <h2 id="schemes">方案</h2>
      <p>方案 = 当前所有屏幕的频道组合，存下来可随时一键恢复。</p>
      <ul>
        <li><b>保存方案</b>：快速保存。正在使用某个方案时覆盖原方案，否则以「方案 + 时间」自动命名新建；</li>
        <li><b>保存并命名</b>：弹出输入框，自定义名称保存；</li>
        <li><b>方案列表</b>：OK 应用方案（所有屏幕整体替换为方案中的频道组合）；<b>长按</b>某个方案可<b>重命名 / 复制为新建 / 删除</b>；「新建方案」回到单屏初始状态重新搭配；</li>
        <li>最多保存 <b>20</b> 个方案，按最近使用时间排序，每个方案标注屏数。</li>
      </ul>

      <doc-callout kind="warn" title="性能提示" icon="warning">
        9 路同时解码对设备性能要求高。低配设备建议少开几路，或到
        <a [routerLink]="'/player-settings'">播放器设置</a>
        中降低负载（如关闭超分与插帧、减小播放缓冲）。
      </doc-callout>
    </div>
  `,
})
export class MultiViewPage {}
