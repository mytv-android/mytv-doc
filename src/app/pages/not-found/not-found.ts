import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocPageHeader } from '../../shared/doc-page-header';

@Component({
  selector: 'app-not-found',
  imports: [DocPageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <doc-page-header title="页面不存在" lead="您访问的地址不存在，请从左侧导航选择文档章节。" />
    </div>
  `,
})
export class NotFoundPage {}
