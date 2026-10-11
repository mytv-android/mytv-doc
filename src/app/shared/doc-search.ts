import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import type { SearchIndexEntry } from './search-index';

interface SearchResult {
  path: string;
  title: string;
  anchor: string;
  section: string;
  snippet: string;
}

@Component({
  selector: 'doc-search',
  imports: [
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="search-trigger-btn"
      type="button"
      (click)="open($event)"
      aria-label="搜索文档"
      matTooltip="搜索文档（Ctrl+K 或 /）"
    >
      <mat-icon class="search-trigger-icon">search</mat-icon>
      <span class="search-trigger-text">搜索文档与设置...</span>
      <kbd class="search-trigger-kbd">Ctrl K</kbd>
    </button>

    <ng-template #panel>
      <div class="search-panel" (click)="$event.stopPropagation()">
        <div class="search-input-row">
          <mat-icon class="search-icon">search</mat-icon>
          <input
            #inputEl
            type="text"
            [ngModel]="query()"
            (ngModelChange)="query.set($event); onQuery()"
            (keydown)="onKeydown($event)"
            placeholder="搜索设置项、功能、关键词..."
            autocomplete="off"
            spellcheck="false"
          />
          @if (query()) {
            <button
              mat-icon-button
              type="button"
              (click)="clear()"
              aria-label="清空"
              class="clear-btn"
            >
              <mat-icon>close</mat-icon>
            </button>
          } @else {
            <kbd class="input-esc-kbd">Esc</kbd>
          }
        </div>

        @if (query().trim()) {
          <div class="search-results">
            @if (results().length === 0) {
              <div class="no-results">
                <mat-icon class="no-results-icon">search_off</mat-icon>
                <div>未找到「{{ query() }}」相关内容</div>
              </div>
            } @else {
              @for (r of results(); track r.path + '#' + r.section; let i = $index) {
                <a
                  class="result-item"
                  [class.active]="i === activeIndex()"
                  (click)="go(r)"
                  href="javascript:void(0)"
                >
                  <div class="result-title">
                    <span class="result-page">{{ r.title }}</span>
                    <span class="result-section">{{ r.section }}</span>
                  </div>
                  <div class="result-snippet">{{ r.snippet }}</div>
                </a>
              }
            }
          </div>
        } @else {
          <div class="search-hint">
            <mat-icon class="hint-icon">lightbulb</mat-icon>
            <span>输入关键词搜索全部文档，如「竖屏」「缓冲」「UA」「回看」「加密分组」</span>
          </div>
        }

        <div class="search-footer">
          <span class="footer-hint"><kbd>↑</kbd><kbd>↓</kbd> 切换</span>
          <span class="footer-hint"><kbd>↵</kbd> 跳转</span>
          <span class="footer-hint"><kbd>Esc</kbd> 关闭</span>
        </div>
      </div>
    </ng-template>
  `,
  styles: `
    .search-trigger-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      height: 38px;
      padding: 0 12px;
      border-radius: 20px;
      border: 1px solid var(--mat-sys-outline-variant);
      background: var(--mat-sys-surface-container-high);
      color: var(--mat-sys-on-surface-variant);
      cursor: pointer;
      font: var(--mat-sys-body-medium);
      transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);

      &:hover {
        background: var(--mat-sys-surface-container-highest);
        border-color: var(--mat-sys-primary);
        color: var(--mat-sys-on-surface);
      }

      .search-trigger-icon {
        font-size: 19px;
        width: 19px;
        height: 19px;
        color: var(--mat-sys-primary);
      }

      .search-trigger-text {
        font-size: 13px;
        letter-spacing: 0.01em;
      }

      .search-trigger-kbd {
        font-size: 11px;
        padding: 1px 6px;
        border-radius: 4px;
        background: var(--mat-sys-surface);
        border: 1px solid var(--mat-sys-outline-variant);
        color: var(--mat-sys-on-surface-variant);
      }

      @media (max-width: 639px) {
        padding: 0 8px;
        width: 38px;
        justify-content: center;

        .search-trigger-text,
        .search-trigger-kbd {
          display: none;
        }
      }
    }
  `,
})
export class DocSearch {
  private overlay = inject(Overlay);
  private router = inject(Router);
  private hostRef = inject(ElementRef);
  private vcr = inject(ViewContainerRef);

  readonly query = signal('');
  readonly results = signal<SearchResult[]>([]);
  readonly activeIndex = signal(0);

  private overlayRef: OverlayRef | null = null;
  private searchIndex: SearchIndexEntry[] | null = null;

  private async ensureIndex(): Promise<SearchIndexEntry[]> {
    if (!this.searchIndex) {
      this.searchIndex = (await import('./search-index')).SEARCH_INDEX;
    }
    return this.searchIndex;
  }

  readonly panelTpl = viewChild.required<TemplateRef<unknown>>('panel');
  readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  open(event: Event) {
    event.stopPropagation();
    if (this.overlayRef) {
      this.close();
      return;
    }
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .top('72px');
    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'doc-search-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });
    this.overlayRef.attach(new TemplatePortal(this.panelTpl(), this.vcr));
    this.overlayRef.backdropClick().subscribe(() => this.close());
    this.ensureIndex();
    setTimeout(() => this.inputEl()?.nativeElement.focus(), 50);
  }

  close() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
      this.query.set('');
      this.results.set([]);
      this.activeIndex.set(0);
    }
  }

  clear() {
    this.query.set('');
    this.results.set([]);
    this.activeIndex.set(0);
    this.inputEl()?.nativeElement.focus();
  }

  async onQuery() {
    const index = await this.ensureIndex();
    const q = this.query().trim().toLowerCase();
    if (!q) {
      this.results.set([]);
      this.activeIndex.set(0);
      return;
    }
    const terms = q.split(/\s+/).filter(Boolean);
    const matched: { entry: SearchIndexEntry; score: number }[] = [];
    for (const entry of index) {
      const hay = (
        entry.title +
        ' ' +
        entry.section +
        ' ' +
        entry.keywords
      ).toLowerCase();
      let score = 0;
      let allMatch = true;
      for (const t of terms) {
        if (hay.includes(t)) {
          score += t.length;
          if (entry.section.toLowerCase().includes(t)) score += 50;
          if (entry.title.toLowerCase().includes(t)) score += 30;
        } else {
          allMatch = false;
          break;
        }
      }
      if (allMatch) {
        matched.push({ entry, score });
      }
    }
    matched.sort((a, b) => b.score - a.score);
    const top = matched.slice(0, 20).map((m) => {
      const e = m.entry;
      const snippet = this.makeSnippet(e.keywords, terms[0]);
      return {
        path: e.path,
        title: e.title,
        anchor: e.anchor,
        section: e.section,
        snippet,
      };
    });
    this.results.set(top);
    this.activeIndex.set(0);
  }

  private makeSnippet(keywords: string, term: string): string {
    const lower = keywords.toLowerCase();
    const idx = lower.indexOf(term);
    if (idx < 0) {
      return keywords.slice(0, 80);
    }
    const start = Math.max(0, idx - 30);
    const end = Math.min(keywords.length, idx + term.length + 50);
    return (
      (start > 0 ? '…' : '') +
      keywords.slice(start, end) +
      (end < keywords.length ? '…' : '')
    );
  }

  onKeydown(event: KeyboardEvent) {
    const results = this.results();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (results.length) {
        this.activeIndex.update((i) => (i + 1) % results.length);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (results.length) {
        this.activeIndex.update(
          (i) => (i - 1 + results.length) % results.length,
        );
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (results.length) {
        this.go(results[this.activeIndex()]);
      }
    } else if (event.key === 'Escape') {
      this.close();
    }
  }

  go(r: SearchResult) {
    const url = r.anchor ? `${r.path}${r.anchor}` : r.path;
    this.close();
    this.router.navigateByUrl(url);
  }

  @HostListener('document:keydown', ['$event'])
  onGlobalKeydown(event: KeyboardEvent) {
    const isHotkey =
      (event.key === '/' && !this.isTypingTarget(event)) ||
      ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k');

    if (isHotkey) {
      event.preventDefault();
      this.open(event as unknown as Event);
    } else if (event.key === 'Escape' && this.overlayRef) {
      this.close();
    }
  }

  private isTypingTarget(event: KeyboardEvent): boolean {
    const el = event.target as HTMLElement | null;
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || el.isContentEditable;
  }
}
