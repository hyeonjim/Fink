<template>
  <section class="news-list-section">
    <div class="list-header">
      <h3 class="list-title">기사 목록</h3>
      <span class="list-count">{{ newsStore.newsList.length }}개</span>
    </div>

    <div class="news-list">
      <div v-if="!newsStore.newsList.length" class="news-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
        </svg>
        <p>아직 저장된 기사가 없습니다.</p>
        <span>검색을 통해 뉴스를 찾아보세요</span>
      </div>

      <article
        v-for="n in newsStore.newsList"
        :key="n.id"
        class="news-item"
        :class="{ selected: newsStore.newsDetail && newsStore.newsDetail.id === n.id }"
        @click="openDetail(n.id)"
      >
        <button 
          class="bookmark-btn"
          :class="{ active: n.is_bookmarked }"
          @click.stop="toggleBookmark(n.id)"
          type="button"
        >
          <svg v-if="n.is_bookmarked" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
          </svg>
        </button>
        <span class="news-title">{{ n.title }}</span>
        <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </article>
    </div>
  </section>
</template>

<script setup>
import { useNewsStore } from '@/stores/news'
import { useAccountStore } from '@/stores/accounts'

const newsStore = useNewsStore()
const accountStore = useAccountStore()

const openDetail = (id) => {
  newsStore.getNewsDetail(id)
}

const toggleBookmark = (id) => {
  if (!accountStore.isLogin) {
    alert('로그인이 필요합니다.')
    return
  }
  newsStore.toggleBookmark(id)
}
</script>

<style scoped>
.news-list-section {
  background: var(--n-bg);
  border-radius: var(--n-radius-xl);
  border: 1px solid var(--n-border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--n-bg-sunken);
}

.list-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--n-text);
  margin: 0;
}

.list-count {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--n-accent);
  background: var(--n-accent-wash);
  padding: 4px 10px;
  border-radius: var(--n-radius-xl);
}

.news-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.news-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.news-empty svg {
  width: 48px;
  height: 48px;
  color: var(--n-border-strong);
  margin-bottom: 16px;
}

.news-empty p {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--n-text-body);
  margin: 0 0 4px;
}

.news-empty span {
  font-size: 0.8125rem;
  color: var(--n-text-muted);
}

.news-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: var(--n-radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.news-item:hover {
  background: var(--n-bg-subtle);
}

.news-item.selected {
  background: var(--n-accent-wash);
}

.bookmark-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bookmark-btn svg {
  width: 18px;
  height: 18px;
  color: var(--n-border-strong);
  transition: color 0.2s;
}

.bookmark-btn:hover svg {
  color: var(--n-accent);
}

.bookmark-btn.active svg {
  color: var(--n-accent);
}

.news-title {
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--n-text-body);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-item.selected .news-title {
  color: var(--n-text);
  font-weight: 600;
}

.chevron {
  width: 16px;
  height: 16px;
  color: var(--n-border-strong);
  flex-shrink: 0;
}

.news-item.selected .chevron {
  color: var(--n-accent);
}</style>
