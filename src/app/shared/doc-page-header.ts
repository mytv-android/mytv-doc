import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'doc-page-header',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="doc-header">
      @if (badge()) {
        <div class="header-badge">
          <mat-icon class="badge-icon">{{ badgeIcon() || 'menu_book' }}</mat-icon>
          <span>{{ badge() }}</span>
        </div>
      }
      <h1>{{ title() }}</h1>
      @if (lead()) {
        <p class="page-lead">{{ lead() }}</p>
      }
      <div class="header-divider"></div>
    </header>
  `,
  styles: `
    .doc-header {
      margin-bottom: 24px;
    }
    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 20px;
      background: var(--mat-sys-secondary-container);
      color: var(--mat-sys-on-secondary-container);
      font: var(--mat-sys-label-medium);
      font-weight: 600;
      letter-spacing: 0.02em;
      margin-bottom: 8px;

      .badge-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }
    h1 {
      font: var(--mat-sys-headline-large);
      font-size: 2.25rem;
      font-weight: 700;
      letter-spacing: -0.025em;
      line-height: 1.25;
      margin: 4px 0 12px;
      color: var(--mat-sys-on-surface);
    }
    .page-lead {
      font: var(--mat-sys-body-large);
      font-size: 1.05rem;
      line-height: 1.7;
      color: var(--mat-sys-on-surface-variant);
      margin: 0;
      max-width: 820px;
    }
    .header-divider {
      height: 1px;
      background: linear-gradient(90deg, var(--mat-sys-outline-variant) 0%, transparent 100%);
      margin-top: 20px;
    }
  `,
})
export class DocPageHeader {
  readonly title = input.required<string>();
  readonly lead = input<string>();
  readonly badge = input<string>();
  readonly badgeIcon = input<string>();
}
