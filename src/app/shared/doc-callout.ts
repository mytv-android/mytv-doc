import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'doc-callout',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="callout" [class]="'callout-' + kind()" role="note">
      <mat-icon class="callout-icon">{{ resolvedIcon() }}</mat-icon>
      <div class="callout-content">
        @if (title()) {
          <div class="callout-title">{{ title() }}</div>
        }
        <div class="callout-body"><ng-content /></div>
      </div>
    </aside>
  `,
  styles: `
    // 低饱和色调底：提示 = secondaryContainer、注意 = tertiaryContainer、警告 = errorContainer，约 55%；
    // 注意的图标用 tertiary，警告的图标用 error 并加 3px 左侧色条，浅色主题下两者也能一眼分开
    .callout {
      --callout-container: var(--mat-sys-secondary-container);
      --callout-on-container: var(--mat-sys-on-secondary-container);
      --callout-icon: var(--callout-on-container);
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      margin: 20px 0;
      border-radius: var(--mytv-radius-card);
      background-color: color-mix(in srgb, var(--callout-container) 55%, transparent);
    }

    .callout-info {
      --callout-container: var(--mat-sys-tertiary-container);
      --callout-on-container: var(--mat-sys-on-tertiary-container);
      --callout-icon: var(--mat-sys-tertiary);
    }

    .callout-warn {
      --callout-container: var(--mat-sys-error-container);
      --callout-on-container: var(--mat-sys-on-error-container);
      --callout-icon: var(--mat-sys-error);
      box-shadow: inset 3px 0 0 var(--mat-sys-error);
    }

    .callout-icon {
      flex-shrink: 0;
      font-size: 22px;
      width: 22px;
      height: 22px;
      color: var(--callout-icon);
    }

    .callout-content {
      flex: 1;
      min-width: 0;
    }

    .callout-title {
      font: var(--mat-sys-title-small);
      margin-bottom: 2px;
      color: var(--callout-on-container);
    }

    .callout-body {
      font: var(--mat-sys-body-medium);
      line-height: 1.65;
      color: var(--mat-sys-on-surface-variant);

      p:last-child {
        margin-bottom: 0;
      }
    }
  `,
})
export class DocCallout {
  readonly kind = input<'info' | 'warn' | 'tip'>('info');
  readonly title = input<string>();
  readonly icon = input<string>();

  protected readonly resolvedIcon = computed(() => {
    if (this.icon()) return this.icon()!;
    switch (this.kind()) {
      case 'tip': return 'lightbulb';
      case 'warn': return 'warning_amber';
      case 'info':
      default: return 'info';
    }
  });
}
