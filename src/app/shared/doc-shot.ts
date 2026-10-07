import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * 文档配图：一张截图 + 可选说明。图片放在 public/screenshots/ 下，
 * src 用相对路径（如 screenshots/panel-home.png），带上标注红框的版本直接另存一份。
 */
@Component({
  selector: 'doc-shot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="shot">
      <img [src]="src()" [alt]="alt()" />
      @if (caption()) {
        <figcaption>{{ caption() }}</figcaption>
      }
    </figure>
  `,
  styles: `
    .shot {
      margin: 16px 0 24px;
    }
    img {
      display: block;
      max-width: 100%;
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 12px;
      background: var(--mat-sys-surface-container);
    }
    figcaption {
      margin-top: 8px;
      font: var(--mat-sys-body-small);
      color: var(--mat-sys-on-surface-variant);
    }
  `,
})
export class DocShot {
  readonly src = input.required<string>();
  readonly alt = input<string>('');
  readonly caption = input<string>();
}
