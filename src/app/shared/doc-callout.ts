import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'doc-callout',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="callout" [class.callout-warn]="kind() === 'warn'">
      <mat-icon>{{ icon() }}</mat-icon>
      <div>
        @if (title()) {
          <div class="callout-title">{{ title() }}</div>
        }
        <div class="callout-body"><ng-content /></div>
      </div>
    </div>
  `,
})
export class DocCallout {
  readonly kind = input<'info' | 'warn' | 'tip'>('info');
  readonly title = input<string>();
  readonly icon = input<string>('info');
}
