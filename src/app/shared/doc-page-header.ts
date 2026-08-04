import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'doc-page-header',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="doc-header">
      <h1>{{ title() }}</h1>
      @if (lead()) {
        <p class="page-lead">{{ lead() }}</p>
      }
    </header>
  `,
  styles: `
    .doc-header {
      margin-bottom: 16px;
    }
    h1 {
      font: var(--mat-sys-headline-large);
      margin: 0 0 8px;
    }
    .page-lead {
      font: var(--mat-sys-body-large);
      color: var(--mat-sys-on-surface-variant);
      margin: 0;
    }
  `,
})
export class DocPageHeader {
  readonly title = input.required<string>();
  readonly lead = input<string>();
}
