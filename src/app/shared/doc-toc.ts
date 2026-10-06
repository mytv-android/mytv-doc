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
import { filter } from 'rxjs/operators';

interface TocItem {
  id: string;
  text: string;
}

/**
 * 页面右侧的「本页目录」。路由切换后扫描当前页面的 h2[id]（不足 3 个时退回 h3[id]），
 * 宽屏（≥1500px）显示，窄屏隐藏。点击平滑滚动并把锚点写进地址栏。
 */
@Component({
  selector: 'doc-toc',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.toc-empty]': '!visible()' },
  template: `
    @if (visible()) {
      <nav class="toc" aria-label="本页目录">
        <div class="toc-title">本页目录</div>
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
      width: 216px;
      flex-shrink: 0;
    }
    :host(.toc-empty) {
      display: none;
    }
    .toc {
      position: sticky;
      top: 24px;
      max-height: calc(100vh - 48px);
      display: flex;
      flex-direction: column;
      padding-top: 24px;
    }
    .toc-title {
      font: var(--mat-sys-title-small);
      color: var(--mat-sys-on-surface-variant);
      margin-bottom: 8px;
      padding-left: 12px;
    }
    .toc-list {
      overflow-y: auto;
      border-left: 2px solid var(--mat-sys-outline-variant);
    }
    .toc-link {
      display: block;
      padding: 5px 12px;
      color: var(--mat-sys-on-surface-variant);
      text-decoration: none;
      cursor: pointer;
      border-left: 2px solid transparent;
      margin-left: -2px;
      line-height: 1.45;
      font: var(--mat-sys-body-medium);
    }
    .toc-link:hover {
      color: var(--mat-sys-on-surface);
    }
    .toc-link.toc-active {
      color: var(--mat-sys-primary);
      border-left-color: var(--mat-sys-primary);
      font-weight: 600;
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
