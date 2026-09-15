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
          {{ newsStore.newsDetail.is_bookmarked ? '북마크됨' : '미저장' }}
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
  background: var(--n-bg);
  border-radius: var(--n-radius-xl);
  border: 1px solid var(--n-border);
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
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
  background: var(--n-bg-sunken);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.empty-icon svg {
  width: 40px;
  height: 40px;
  color: var(--n-text-muted);
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--n-text);
  margin: 0 0 8px;
}

.empty-desc {
  font-size: 0.9375rem;
  color: var(--n-text-muted);
  line-height: 1.5;
}

.detail-content {
  padding: 32px;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.bookmark-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--n-text-muted);
  background: var(--n-bg-sunken);
  border-radius: var(--n-radius-xl);
}

.bookmark-badge svg {
  width: 14px;
  height: 14px;
}

.bookmark-badge.active {
  color: var(--n-accent);
  background: var(--n-accent-wash);
}

.pub-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: var(--n-text-muted);
}

.pub-date svg {
  width: 14px;
  height: 14px;
}

.detail-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--n-text);
  line-height: 1.4;
  margin: 0 0 24px;
}

.detail-body {
  padding: 24px;
  background: var(--n-bg-subtle);
  border-radius: var(--n-radius-lg);
  margin-bottom: 24px;
}

.detail-body p {
  font-size: 1rem;
  color: var(--n-text-body);
  line-height: 1.8;
  white-space: pre-line;
  margin: 0;
}

.detail-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 버튼 스타일은 global.css 의 .btn 계열이 담당한다.
   <a> 태그에 .btn 을 붙이는 자리가 있어 밑줄만 지운다. */
.btn {
  text-decoration: none;
}

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
