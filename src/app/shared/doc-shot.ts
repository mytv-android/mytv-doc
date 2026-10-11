import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  TemplateRef,
  ViewContainerRef,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * 文档配图：按设备统一画框（电视 12 圆角；手机竖屏单图与左右对照图 20 圆角）+ 图下一行图说。
 * 支持点击大图全屏查看（Lightbox）：挂到 CDK 浮层容器（body 下），盖住顶栏与侧边导航。
 */
@Component({
  selector: 'doc-shot',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="shot" [class.portrait]="portrait()" [class.pair]="pair()">
      <div class="img-wrapper" (click)="openPreview()" role="button" tabindex="0" [attr.aria-label]="'查看大图: ' + (alt() || caption() || '')" (keydown.enter)="openPreview()">
        <img [src]="src()" [alt]="alt()" loading="lazy" />
      </div>
      @if (caption()) {
        <figcaption>{{ caption() }}</figcaption>
      }
    </figure>

    <ng-template #lightbox>
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
    </ng-template>
  `,
  styles: `
    .shot {
      margin: 20px 0 28px;

      &.portrait {
        max-width: 380px;
      }

      &.pair {
        max-width: 760px;
      }
    }

    .img-wrapper {
      display: inline-block;
      max-width: 100%;
      vertical-align: top;
      cursor: zoom-in;
      border-radius: var(--mytv-radius-card);
      overflow: hidden;
      background: var(--mat-sys-surface-container);
      box-shadow:
        0 1px 0 var(--mytv-divider),
        0 6px 18px color-mix(in srgb, var(--mat-sys-shadow) 14%, transparent);

      &:focus-visible {
        outline: var(--mytv-focus-ring-width) solid var(--mytv-focus-ring);
        outline-offset: 2px;
      }
    }

    .portrait .img-wrapper,
    .pair .img-wrapper {
      border-radius: var(--mytv-radius-hero);
    }

    img {
      display: block;
      max-width: 100%;
      height: auto;
    }

    figcaption {
      margin-top: 8px;
      font: var(--mat-sys-body-medium);
      color: var(--mat-sys-on-surface-variant);
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

  /** 手机竖屏的左右对照拼图（screenshots/portrait-pair-*）：按手机画框，宽度放两台手机 */
  protected readonly pair = computed(() => !this.portrait() && this.src().includes('portrait-pair-'));

  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);
  private readonly lightboxTpl = viewChild.required<TemplateRef<unknown>>('lightbox');
  private overlayRef: OverlayRef | null = null;

  constructor() {
    // 离开页面时一并关掉大图
    inject(DestroyRef).onDestroy(() => this.closePreview());
  }

  openPreview() {
    if (this.overlayRef) return;
    this.overlayRef = this.overlay.create();
    this.overlayRef.attach(new TemplatePortal(this.lightboxTpl(), this.vcr));
  }

  closePreview() {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closePreview();
  }
}
