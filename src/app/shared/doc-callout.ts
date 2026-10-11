import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'doc-callout',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="callout" [class]="'callout-' + kind()" role="note">
      <div class="callout-icon-badge">
        <mat-icon>{{ resolvedIcon() }}</mat-icon>
      </div>
      <div class="callout-content">
        @if (title()) {
          <div class="callout-title">{{ title() }}</div>
        }
        <div class="callout-body"><ng-content /></div>
      </div>
    </aside>
  `,
  styles: `
    .callout {
      display: flex;
      gap: 16px;
      padding: 16px 20px;
      margin: 20px 0;
      border-radius: 16px;
      border: 1px solid var(--mat-sys-outline-variant);
      background-color: var(--mat-sys-surface-container-low);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      transition: transform 0.15s ease, box-shadow 0.15s ease;

      &:hover {
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
      }
    }

    .callout-icon-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      flex-shrink: 0;
      background: var(--mat-sys-surface-container-highest);
      color: var(--mat-sys-primary);

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .callout-content {
      flex: 1;
      min-width: 0;
    }

    .callout-title {
      font: var(--mat-sys-title-small);
      font-weight: 600;
      margin-bottom: 4px;
      color: var(--mat-sys-on-surface);
      letter-spacing: 0.01em;
    }

    .callout-body {
      font: var(--mat-sys-body-medium);
      line-height: 1.65;
      color: var(--mat-sys-on-surface-variant);

      p:last-child {
        margin-bottom: 0;
      }
    }

    .callout-tip {
      border-color: color-mix(in srgb, var(--mat-sys-tertiary) 35%, transparent);
      background-color: color-mix(in srgb, var(--mat-sys-tertiary-container) 35%, var(--mat-sys-surface));

      .callout-icon-badge {
        background: var(--mat-sys-tertiary-container);
        color: var(--mat-sys-on-tertiary-container);
      }

      .callout-title {
        color: var(--mat-sys-on-tertiary-container);
      }
    }

    .callout-info {
      border-color: color-mix(in srgb, var(--mat-sys-primary) 35%, transparent);
      background-color: color-mix(in srgb, var(--mat-sys-primary-container) 35%, var(--mat-sys-surface));

      .callout-icon-badge {
        background: var(--mat-sys-primary-container);
        color: var(--mat-sys-on-primary-container);
      }

      .callout-title {
        color: var(--mat-sys-on-primary-container);
      }
    }

    .callout-warn {
      border-color: color-mix(in srgb, var(--mat-sys-error) 45%, transparent);
      background-color: color-mix(in srgb, var(--mat-sys-error-container) 35%, var(--mat-sys-surface));

      .callout-icon-badge {
        background: var(--mat-sys-error-container);
        color: var(--mat-sys-on-error-container);
      }

      .callout-title {
        color: var(--mat-sys-on-error-container);
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
