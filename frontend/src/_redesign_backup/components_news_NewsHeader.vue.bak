<template>
  <header class="n-page-header">
    <div class="n-page-header-content n-page-header-content--split">
      <div class="header-title-area">
        <div class="n-page-header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
          </svg>
        </div>
        <div class="n-page-header-text">
          <h1 class="n-page-title">뉴스</h1>
          <p class="n-page-subtitle">시장 흐름을 읽을 수 있는 최신 뉴스를 확인하세요</p>
        </div>
      </div>

      <div class="header-controls">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            v-model.trim="query"
            type="text"
            placeholder="뉴스 검색어를 입력하세요"
            @keyup.enter="onFetch"
          />
          <button class="search-btn" @click="onFetch">
            검색
          </button>
        </div>

        <div class="filter-tabs">
          <button
            class="filter-tab"
            :class="{ active: route.name === 'NewsView' }"
            @click="goAll"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            전체
          </button>

          <button
            class="filter-tab"
            :class="{ active: route.name === 'NewsBookmarkView' }"
            @click="goBookmark"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
            북마크
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNewsStore } from '@/stores/news'

const router = useRouter()
const route = useRoute()
const newsStore = useNewsStore()

const query = ref('')

const onFetch = function () {
  if (!query.value) {
    alert('검색어를 입력하세요.')
    return
  }
  newsStore.fetchNews(query.value)
}

const goAll = function () {
  router.push({ name: 'NewsView' })
}

const goBookmark = function () {
  router.push({ name: 'NewsBookmarkView' })
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════
   뉴스 헤더 — 무채색. 색 바 대신 옅은 배경 + 아래 경계선.
   ═══════════════════════════════════════════════════════════════════ */
/* 공용 규칙은 global.css 의 .n-page-header* 를 쓴다.
   이 화면만 제목 영역과 검색·탭 영역을 양끝에 배치한다. */
.header-title-area {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* ── 검색 ────────────────────────────────────────────────────────── */
.search-box {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 3px;
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-sm);
  background: var(--n-bg);
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.search-box:focus-within {
  border-color: var(--n-accent);
  box-shadow: 0 0 0 3px var(--n-accent-wash);
}

.search-icon {
  width: 16px;
  height: 16px;
  margin-left: 10px;
  color: var(--n-text-muted);
  flex-shrink: 0;
}

.search-box input {
  width: 230px;
  padding: 8px 10px;
  font-size: 0.875rem;
  color: var(--n-text);
  background: transparent;
  border: none;
  outline: none;
}

.search-box input::placeholder {
  color: var(--n-text-muted);
}

.search-btn {
  padding: 7px 14px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fff;
  background: var(--n-accent);
  border: 1px solid var(--n-accent);
  border-radius: var(--n-radius-sm);
  cursor: pointer;
  transition: background-color 0.18s ease, border-color 0.18s ease;
}

.search-btn:hover {
  background: var(--n-accent-hover);
  border-color: var(--n-accent-hover);
}

/* ── 필터 탭 ─────────────────────────────────────────────────────── */
.filter-tabs {
  display: flex;
  gap: 6px;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--n-text-muted);
  background: transparent;
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-sm);
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}

.filter-tab svg {
  width: 15px;
  height: 15px;
}

.filter-tab:hover {
  color: var(--n-text);
  border-color: var(--n-border-strong);
}

.filter-tab.active {
  color: var(--n-accent);
  background: var(--n-accent-wash);
  border-color: var(--n-accent);
}

/* ═══════════════════════════════════════════════════════════════════
   Responsive
   ═══════════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .n-page-header-content--split {
    flex-direction: column;
    align-items: stretch;
  }

  .header-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box input {
    width: 100%;
  }

  .filter-tab {
    flex: 1;
    justify-content: center;
  }
}
</style>
