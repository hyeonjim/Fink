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
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  gap: 16px;
  border: 0;
  border-radius: 28px;
  background: var(--n-fill);
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  border: 0;
}

.list-title {
  margin: 0;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--n-title);
}

.list-count {
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--n-surface);
  font-size: 16px;
  font-weight: 700;
  color: var(--n-fg);
}

.news-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 0 4px 4px 0;
  min-height: 0;
  overflow-y: auto;
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
  font-weight: 600;
  margin: 0 0 4px;
  font-size: 18px;
  color: var(--n-fg);
}

.news-empty span {
  font-size: 16px;
  color: var(--n-fg-muted);
}

.news-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 14px 14px 14px 12px;
  gap: 12px;
  border: 0;
  border-radius: 18px;
  background: var(--n-surface);
  transition: background-color 0.2s, transform 0.2s;
}

.news-item:hover {
  background: var(--n-surface);
  transform: translateX(4px);
}

.news-item.selected {
  background: var(--n-fill-strong);
  border: 0;
}

.bookmark-btn {
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 12px;
  background: var(--n-fill);
  color: var(--n-fg-faint);
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
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--n-fg);
}

.news-item.selected .news-title {
  font-weight: 600;
  color: var(--n-fg);
}

.chevron {
  width: 16px;
  height: 16px;
  color: var(--n-border-strong);
  flex-shrink: 0;
}

.news-item.selected .chevron {
  color: var(--n-accent);
}
/* 목록을 세로 flex 로 만들어 gap 이 실제로 적용되게 하고,
   고정 높이 안에서 항목이 눌려 겹치지 않도록 줄어들지 않게 + 넘치면 스크롤 */
.news-list > * { flex-shrink: 0; }
.news-item.selected .bookmark-btn:not(.active) { background: var(--n-surface); }
.bookmark-btn.active { background: var(--n-bookmark-bg); }
.bookmark-btn:hover svg,
.bookmark-btn.active svg { color: var(--n-bookmark); }
.chevron,
.news-item.selected .chevron { color: var(--n-fg-faint); }
</style>

