import { ChangeDetectionStrategy, Component, HostListener, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * 文档配图：高质感截图卡片 + 响应式双态预览 + 图说。
 * 支持点击大图全屏查看（Lightbox），针对移动端竖屏与电脑宽屏自适应缩放。
 */
@Component({
  selector: 'doc-shot',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="shot" [class.portrait]="portrait()">
      <div class="img-wrapper" (click)="openPreview()" role="button" tabindex="0" [attr.aria-label]="'查看大图: ' + (alt() || caption() || '')" (keydown.enter)="openPreview()">
        <img [src]="src()" [alt]="alt()" loading="lazy" />
        <div class="zoom-badge" title="点击查看大图">
          <mat-icon>zoom_in</mat-icon>
        </div>
      </div>
      @if (caption()) {
        <figcaption>
          <mat-icon class="caption-icon">photo_camera</mat-icon>
          <span class="caption-text">{{ caption() }}</span>
        </figcaption>
      }
    </figure>

    @if (previewOpen()) {
      <div class="lightbox-backdrop" (click)="closePreview()">
        <div class="lightbox-card" (click)="$event.stopPropagation()">
          <button class="lightbox-close-btn" (click)="closePreview()" aria-label="关闭预览" mat-icon-button>
            <mat-icon>close</mat-icon>
          </button>
          <img [src]="src()" [alt]="alt()" class="lightbox-img" />
          @if (caption()) {
            <div class="lightbox-caption">{{ caption() }}</div>
          }
        </div>
      </div>
    }
  `,
  styles: `
    .shot {
      margin: 20px 0 28px;

      &.portrait {
        max-width: 380px;
      }
    }

    .img-wrapper {
      position: relative;
      display: inline-block;
      max-width: 100%;
      cursor: zoom-in;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--mat-sys-outline-variant);
      background: var(--mat-sys-surface-container);
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03);
      transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1), border-color 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 28px -4px rgba(0, 0, 0, 0.12), 0 3px 10px -1px rgba(0, 0, 0, 0.06);
        border-color: var(--mat-sys-primary);

        .zoom-badge {
          opacity: 1;
          transform: scale(1);
        }
      }
    }

    img {
      display: block;
      max-width: 100%;
      height: auto;
    }

    .zoom-badge {
      position: absolute;
      right: 12px;
      bottom: 12px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--mat-sys-surface) 85%, transparent);
      backdrop-filter: blur(8px);
      color: var(--mat-sys-on-surface);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: scale(0.85);
      transition: opacity 0.2s ease, transform 0.2s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    figcaption {
      display: inline-flex;
      align-items: flex-start;
      gap: 6px;
      margin-top: 10px;
      padding: 4px 12px;
      border-radius: 20px;
      background: var(--mat-sys-surface-container);
      border: 1px solid var(--mat-sys-outline-variant);
      font: var(--mat-sys-body-small);
      color: var(--mat-sys-on-surface-variant);
      line-height: 1.5;

      .caption-icon {
        font-size: 15px;
        width: 15px;
        height: 15px;
        margin-top: 2px;
        color: var(--mat-sys-primary);
        flex-shrink: 0;
      }

      .caption-text {
        flex: 1;
      }
    }

    // Lightbox modal
    .lightbox-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      animation: fadeIn 0.2s cubic-bezier(0.2, 0, 0, 1);
    }

    .lightbox-card {
      position: relative;
      max-width: 92vw;
      max-height: 92vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--mat-sys-surface-container-high);
      border-radius: 20px;
      border: 1px solid var(--mat-sys-outline-variant);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
      overflow: hidden;
      animation: zoomIn 0.2s cubic-bezier(0.2, 0, 0, 1);
    }

    .lightbox-img {
      max-width: 100%;
      max-height: calc(85vh - 50px);
      object-fit: contain;
      display: block;
    }

    .lightbox-close-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: color-mix(in srgb, var(--mat-sys-surface) 80%, transparent);
      backdrop-filter: blur(8px);
      color: var(--mat-sys-on-surface);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.15s;

      &:hover {
        background: var(--mat-sys-surface-container-highest);
      }
    }

    .lightbox-caption {
      width: 100%;
      padding: 12px 20px;
      box-sizing: border-box;
      font: var(--mat-sys-body-medium);
      color: var(--mat-sys-on-surface);
      background: var(--mat-sys-surface-container);
      border-top: 1px solid var(--mat-sys-outline-variant);
      text-align: center;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes zoomIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `,
})
export class DocShot {
  readonly src = input.required<string>();
  readonly alt = input<string>('');
  readonly caption = input<string>();
  readonly portrait = input<boolean>(false);

  protected readonly previewOpen = signal(false);

  openPreview() {
    this.previewOpen.set(true);
  }

  closePreview() {
    this.previewOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.previewOpen()) {
      this.closePreview();
    }
  }
}
