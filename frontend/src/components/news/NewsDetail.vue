<template>
  <section class="news-detail-section">
    <div v-if="!newsStore.newsDetail" class="news-empty">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
          <polyline points="10 17 15 12 10 7"/>
          <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
      </div>
      <p class="empty-title">기사를 선택해주세요</p>
      <span class="empty-desc">왼쪽 목록에서 기사를 클릭하면<br>상세 내용을 확인할 수 있습니다</span>
    </div>

    <article v-else class="detail-content">
      <div class="detail-header">
        <div class="bookmark-badge" :class="{ active: newsStore.newsDetail.is_bookmarked }">
          <svg v-if="newsStore.newsDetail.is_bookmarked" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
          </svg>
        </div>
        <span class="pub-date">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {{ newsStore.newsDetail.pubDate || '발행일 정보 없음' }}
        </span>
      </div>

      <h1 class="detail-title">{{ newsStore.newsDetail.title }}</h1>

      <div class="detail-body">
        <p>{{ newsStore.newsDetail.description || '본문 내용이 없습니다.' }}</p>
      </div>

      <div class="detail-actions">
        <a
          :href="newsStore.newsDetail.link"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-secondary"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          원문 보기
        </a>

        <button class="btn btn-primary" @click="toggle">
          <svg v-if="newsStore.newsDetail.is_bookmarked" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
          </svg>
          {{ newsStore.newsDetail.is_bookmarked ? '북마크 해제' : '북마크 추가' }}
        </button>
      </div>
    </article>
  </section>
</template>

<script setup>
import { useNewsStore } from '@/stores/news'
const newsStore = useNewsStore()

const toggle = function () {
  newsStore.toggleBookmark(newsStore.newsDetail.id)
}
</script>

<style scoped>
.news-detail-section {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  border: 0;
  border-radius: 32px;
  background: var(--n-surface);
  box-shadow: 0 24px 60px rgba(29, 26, 43, 0.12);
}

.news-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  border: 0;
  border-radius: 20px;
  background: var(--n-fill);
}

.empty-icon svg {
  width: 40px;
  height: 40px;
  color: var(--n-text-muted);
}

.empty-title {
  font-weight: 700;
  margin: 0 0 8px;
  font-size: 26px;
  color: var(--n-title);
}

.empty-desc {
  line-height: 1.5;
  font-size: 18px;
  color: var(--n-fg-muted);
}

.detail-content {
  padding: 48px;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  padding: 0;
  border: 0;
  gap: 14px;
}

.bookmark-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  background: var(--n-fill);
  font-size: 16px;
  font-weight: 700;
  color: var(--n-fg-muted);
}

.bookmark-badge svg {
  width: 14px;
  height: 14px;
}

.bookmark-badge.active {
  background: var(--n-bookmark-bg);
  color: var(--n-bookmark-text);
}

.pub-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  color: var(--n-fg-muted);
}

.pub-date svg {
  width: 14px;
  height: 14px;
}

.detail-title {
  margin: 0 0 24px;
  margin-top: 44px;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.035em;
  color: var(--n-title);
}

.detail-body {
  padding: 24px;
  background: var(--n-bg-subtle);
  border-radius: var(--n-radius-lg);
  margin-bottom: 24px;
}

.detail-body p {
  white-space: pre-line;
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.8;
  color: var(--n-fg-muted);
}

.detail-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 32px;
  border: 0;
}

/* 버튼 스타일은 global.css 의 .btn 계열이 담당한다.
   <a> 태그에 .btn 을 붙이는 자리가 있어 밑줄만 지운다. */
.btn {
  text-decoration: none;
}

/* ═══ F!NK 리디자인 — 기사 상세 (흰 카드 + 그림자, 북마크 옐로) ═══ */
.bookmark-badge.active svg { color: var(--n-bookmark); }
.detail-body p :deep(b) { font-weight: 700; color: var(--n-fg); }
.detail-actions .btn { height: 60px; padding: 0 28px; border: 0; border-radius: 18px; font-size: 19px; font-weight: 700; box-shadow: none; background-image: none; }
.detail-actions .btn-secondary { background: var(--n-lilac); color: var(--n-violet-hover); }
.detail-actions .btn-secondary:hover { background: var(--n-lilac-strong); }
/* 북마크 추가/해제 — 옐로 */
.detail-actions .btn-primary { background: var(--n-bookmark-btn); color: var(--n-bookmark-text); }
.detail-actions .btn-primary:hover { background: #ffe0ab; }

@media (max-width: 768px) {
  .detail-content {
    padding: 24px;
  }

  .detail-title {
    font-size: 1.25rem;
  }

  .detail-actions {
    flex-direction: column;
  }

  .btn {
    justify-content: center;
  }
}</style>
