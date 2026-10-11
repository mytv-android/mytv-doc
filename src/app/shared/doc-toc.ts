import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';

interface TocItem {
  id: string;
  text: string;
}

/**
 * 页面右侧的「本页目录」。路由切换后扫描当前页面的 h2[id]（不足 3 个时退回 h3[id]），
 * 宽屏显示，窄屏隐藏。点击平滑滚动并把锚点写进地址栏。
 */
@Component({
  selector: 'doc-toc',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.toc-empty]': '!visible()' },
  template: `
    @if (visible()) {
      <nav class="toc" aria-label="本页目录">
        <div class="toc-header">
          <mat-icon class="toc-icon">format_list_bulleted</mat-icon>
          <span class="toc-title">本页目录</span>
        </div>
        <div class="toc-list">
          @for (item of items(); track item.id) {
            <a
              class="toc-link"
              [class.toc-active]="activeId() === item.id"
              (click)="go(item.id, $event)"
              >{{ item.text }}</a
            >
          }
        </div>
      </nav>
    }
  `,
  styles: `
    :host {
      width: 220px;
      flex-shrink: 0;
    }
    :host(.toc-empty) {
      display: none;
    }
    .toc {
      position: sticky;
      top: 84px;
      max-height: calc(100vh - 100px);
      display: flex;
      flex-direction: column;
      padding: 16px 12px;
      border-radius: 16px;
      background: var(--mat-sys-surface-container-low);
      border: 1px solid var(--mat-sys-outline-variant);
    }
    .toc-header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--mat-sys-outline-variant);

      .toc-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        color: var(--mat-sys-primary);
      }
      .toc-title {
        font: var(--mat-sys-label-medium);
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--mat-sys-on-surface-variant);
      }
    }
    .toc-list {
      overflow-y: auto;
      max-height: calc(100vh - 170px);
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding-right: 4px;
    }
    .toc-link {
      display: block;
      padding: 6px 10px;
      color: var(--mat-sys-on-surface-variant);
      text-decoration: none;
      cursor: pointer;
      border-radius: 8px;
      line-height: 1.45;
      font: var(--mat-sys-body-medium);
      font-size: 13px;
      transition: all 0.15s cubic-bezier(0.2, 0, 0, 1);

      &:hover {
        color: var(--mat-sys-on-surface);
        background: var(--mat-sys-surface-container-high);
      }
      &.toc-active {
        color: var(--mat-sys-primary);
        background: color-mix(in srgb, var(--mat-sys-primary-container) 55%, transparent);
        font-weight: 600;
      }
    }
    @media (max-width: 1299px) {
      :host {
        display: none;
      }
    }
  `,
})
export class DocToc implements OnInit {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  readonly items = signal<TocItem[]>([]);
  readonly activeId = signal('');
  readonly visible = computed(() => this.items().length >= 3);

  private headings: HTMLElement[] = [];
  private scrollEl: HTMLElement | null = null;
  private readonly onScroll = () => this.updateActive();

  ngOnInit() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.scheduleScan());
    this.scheduleScan();
    this.destroyRef.onDestroy(() => {
      this.scrollEl?.removeEventListener('scroll', this.onScroll);
    });
  }

  go(id: string, event: Event) {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
    this.activeId.set(id);
  }

  private scheduleScan() {
    // 等懒加载页面组件渲染完再扫描标题
    setTimeout(() => this.scan(), 60);
  }

  private scan() {
    const root = document.querySelector('.doc-page');
    let nodes: HTMLElement[] = [];
    if (root) {
      const h2 = Array.from(root.querySelectorAll<HTMLElement>('h2[id]'));
      const h3 = Array.from(root.querySelectorAll<HTMLElement>('h3[id]'));
      nodes = h2.length >= 3 ? h2 : h3;
    }
    this.headings = nodes;
    this.items.set(
      nodes.map((el) => ({ id: el.id, text: (el.textContent ?? '').trim() })),
    );
    this.attachScrollListener();
    this.updateActive();
  }

  private attachScrollListener() {
    const el = document.querySelector<HTMLElement>('.app-content');
    if (el && el !== this.scrollEl) {
      this.scrollEl?.removeEventListener('scroll', this.onScroll);
      el.addEventListener('scroll', this.onScroll, { passive: true });
      this.scrollEl = el;
    }
  }

  private updateActive() {
    if (!this.headings.length) {
      this.activeId.set('');
      return;
    }
    let current = '';
    for (const el of this.headings) {
      if (el.getBoundingClientRect().top <= 120) {
        current = el.id;
      } else {
        break;
      }
    }
    this.activeId.set(current || this.headings[0].id);
  }
}
