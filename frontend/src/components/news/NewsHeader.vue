<template>
  <header class="n-page-header">
    <div class="n-page-header-content n-page-header-content--split">
      <div class="header-title-area">
        <div class="n-page-header-icon">
          <svg viewBox="0 0 64 64" aria-hidden="true"><rect x="36" y="16" width="22" height="40" rx="8" fill="#bb8ec7"/><rect x="6" y="8" width="42" height="48" rx="10" fill="#9588df"/><rect x="14" y="16" width="16" height="13" rx="3.5" fill="#fff"/><rect x="34" y="17" width="7" height="4" rx="2" fill="#fff"/><rect x="34" y="25" width="7" height="4" rx="2" fill="#fff"/><rect x="14" y="35" width="27" height="4" rx="2" fill="#fff"/><rect x="14" y="43" width="18" height="4" rx="2" fill="#1d1a2b"/></svg>
        </div>
        <div class="n-page-header-text">
          <h1 class="n-page-title">뉴스</h1>
          <p class="n-page-subtitle">최신 뉴스를 확인하세요</p>
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
   뉴스 헤더 — 공용 규칙은 global.css 의 .n-page-header* 를 쓴다.
   이 화면만 제목 영역과 검색·탭 영역을 양끝에 배치한다.
   ═══════════════════════════════════════════════════════════════════ */
.header-title-area {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 22px;
  width: 480px;
  flex-wrap: nowrap;
  position: absolute;
  right: 0;
  bottom: -36px;
}

/* ── 검색 ────────────────────────────────────────────────────────── */
.search-box {
  display: flex;
  align-items: center;
  gap: 0;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
  align-self: stretch;
  height: 52px;
  padding: 0 6px 0 20px;
  border: 0;
  border-radius: 20px;
  background: var(--n-surface);
  box-shadow: 0 18px 40px rgba(49, 32, 110, 0.10);
}

.search-box:focus-within {
  box-shadow: 0 18px 40px rgba(49, 32, 110, 0.10), 0 0 0 3px var(--n-lilac-strong);
}

.search-icon {
  width: 16px;
  height: 16px;
  margin-left: 10px;
  color: var(--n-text-muted);
  flex-shrink: 0;
}
/* 입력칸이 고정 폭(230px)이라 버튼 오른쪽에 빈칸이 남던 문제 → 남는 폭을 입력칸이 채운다 */

.search-box input {
  padding: 8px 10px;
  background: transparent;
  border: none;
  outline: none;
  flex: 1;
  width: auto;
  min-width: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--n-fg);
}

.search-box input::placeholder {
  color: var(--n-fg-faint);
  font-weight: 500;
}

.search-btn {
  cursor: pointer;
  transition: background-color 0.18s ease, border-color 0.18s ease;
  flex-shrink: 0;
  height: 40px;
  padding: 0 20px;
  border: 0;
  border-radius: 12px;
  background: var(--n-violet);
  color: var(--n-on-accent);
  font-size: 16px;
  font-weight: 600;
}

.search-btn:hover {
  background: var(--n-violet-hover);
}

/* ── 필터 탭 ─────────────────────────────────────────────────────── */
.filter-tabs {
  display: flex;
  padding: 5px;
  gap: 4px;
  border: 0;
  border-radius: 16px;
  background: var(--n-surface);
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
  height: 34px;
  padding: 0 20px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  font-size: 16px;
  font-weight: 600;
  color: var(--n-fg-muted);
}

.filter-tab svg {
  width: 15px;
  height: 15px;
}

.filter-tab:hover {
  background: transparent;
  color: var(--n-fg);
}

.filter-tab.active {
  background: var(--n-orchid);
  color: var(--n-on-accent);
}
/* 헤더 높이·제목 위치를 다른 페이지와 똑같이 두기 위해,
   검색·탭은 높이 계산에서 빼고(absolute) 헤더 오른쪽 아래에 붙인다 */
.n-page-header-content--split { position: relative; }

/* 좁은 화면에서는 제목과 겹치지 않게 다시 흐름 안으로 */
@media (max-width: 1100px) {
  .header-controls { position: static; width: 100%; margin-top: 8px; }
}

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
