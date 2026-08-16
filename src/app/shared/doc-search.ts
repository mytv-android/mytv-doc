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
import { SearchIndexEntry, SEARCH_INDEX } from './search-index';

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
      mat-icon-button
      type="button"
      (click)="open($event)"
      aria-label="搜索文档"
      matTooltip="搜索文档（按 / 键）"
    >
      <mat-icon>search</mat-icon>
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
            placeholder="搜索设置项、功能、关键词…"
            autocomplete="off"
            spellcheck="false"
          />
          <button
            mat-icon-button
            type="button"
            (click)="clear()"
            aria-label="清空"
            class="clear-btn"
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>

        @if (query().trim()) {
          <div class="search-results">
            @if (results().length === 0) {
              <div class="no-results">未找到「{{ query() }}」相关内容</div>
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
            输入关键词搜索全部文档，如「缓冲」「UA」「回看」「加密分组」。
          </div>
        }
      </div>
    </ng-template>
  `,
  styles: `
    .search-panel {
      width: 460px;
      max-width: 90vw;
      background: var(--mat-sys-surface-container-high);
      border-radius: 12px;
      box-shadow: var(--mat-sys-level3);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .search-input-row {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      gap: 8px;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }
    .search-icon {
      color: var(--mat-sys-on-surface-variant);
    }
    .search-input-row input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font: var(--mat-sys-body-large);
      color: var(--mat-sys-on-surface);
    }
    .clear-btn {
      flex-shrink: 0;
    }
    .search-results {
      max-height: 360px;
      overflow-y: auto;
      padding: 4px;
    }
    .result-item {
      display: block;
      padding: 8px 12px;
      border-radius: 8px;
      text-decoration: none;
      color: var(--mat-sys-on-surface);
      cursor: pointer;
    }
    .result-item.active {
      background: var(--mat-sys-secondary-container);
      color: var(--mat-sys-on-secondary-container);
    }
    .result-title {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 2px;
    }
    .result-page {
      font: var(--mat-sys-label-large);
      font-weight: 600;
      color: var(--mat-sys-primary);
      flex-shrink: 0;
    }
    .result-item.active .result-page {
      color: var(--mat-sys-on-secondary-container);
    }
    .result-section {
      font: var(--mat-sys-body-medium);
      color: var(--mat-sys-on-surface);
      font-weight: 500;
    }
    .result-snippet {
      font: var(--mat-sys-body-small);
      color: var(--mat-sys-on-surface-variant);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .no-results {
      padding: 24px;
      text-align: center;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-medium);
    }
    .search-hint {
      padding: 20px 16px;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-medium);
      text-align: center;
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
      .flexibleConnectedTo(this.hostRef)
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
          offsetY: 4,
        },
      ]);
    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });
    this.overlayRef.attach(new TemplatePortal(this.panelTpl(), this.vcr));
    this.overlayRef.backdropClick().subscribe(() => this.close());
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

  onQuery() {
    const q = this.query().trim().toLowerCase();
    if (!q) {
      this.results.set([]);
      this.activeIndex.set(0);
      return;
    }
    const terms = q.split(/\s+/).filter(Boolean);
    const matched: { entry: SearchIndexEntry; score: number }[] = [];
    for (const entry of SEARCH_INDEX) {
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
    if (event.key === '/' && !this.isTypingTarget(event)) {
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
