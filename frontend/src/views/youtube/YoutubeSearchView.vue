<template>
  <section class="youtube-search">
    <!-- Page Header -->
    <header class="n-page-header">
      <div class="n-page-header-content n-page-header-content--stack">
        <div class="header-title-area">
          <div class="n-page-header-icon youtube-icon">
            <svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="8" width="52" height="38" rx="12" fill="#bb8ec7"/><path d="M27 20.5v14a1.6 1.6 0 0 0 2.4 1.4l11.2-7a1.6 1.6 0 0 0 0-2.8l-11.2-7A1.6 1.6 0 0 0 27 20.5z" fill="#fff"/><rect x="8" y="52" width="48" height="5" rx="2.5" fill="#9588df"/><rect x="8" y="52" width="22" height="5" rx="2.5" fill="#1d1a2b"/><circle cx="30" cy="54.5" r="4.5" fill="#1d1a2b"/></svg>
          </div>
          <div class="n-page-header-text">
            <h1 class="n-page-title">YouTube</h1>
            <p class="n-page-subtitle">금융 관련 영상을 검색하고 저장하세요</p>
          </div>
        </div>
        
        <nav class="nav-tabs">
          <RouterLink class="nav-tab" :to="{ name: 'YoutubeSearchView' }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            검색
          </RouterLink>
          <RouterLink class="nav-tab" :to="{ name: 'YoutubeSavedView' }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
            저장됨
          </RouterLink>
        </nav>
      </div>
    </header>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-card">
        <form class="search-form" @submit.prevent="onSearch">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              v-model.trim="q"
              class="search-input"
              placeholder="검색어를 입력하세요 (예: 삼성전자, 주식, 금융)"
            />
          </div>
          <button class="search-btn" :disabled="loading || !q">
            <span v-if="loading" class="btn-loading">
              <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
              </svg>
              검색중...
            </span>
            <span v-else class="btn-content">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              검색
            </span>
          </button>
        </form>

        <p v-if="error" class="error-message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ error }}
        </p>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="items.length" class="results-section">
      <div class="results-header">
        <h3 class="results-title">검색 결과</h3>
        <span class="results-count">{{ items.length }}개의 영상</span>
      </div>
      <div class="video-grid">
        <VideoCard v-for="it in items" :key="it.etag" :item="it" />
      </div>
    </div>

    <!-- Featured (첫 화면) -->
    <div v-else-if="!searched && featured.length" class="results-section">
      <div class="results-header">
        <h3 class="results-title">추천 금융 영상</h3>
        <span class="results-count">{{ featured.length }}개의 영상</span>
      </div>
      <div class="video-grid">
        <VideoCard v-for="it in featured" :key="it.etag" :item="it" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="searched && !loading" class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="M10 9l5 3-5 3V9z"/>
        </svg>
      </div>
      <p class="empty-title">검색 결과가 없습니다</p>
      <span class="empty-text">다른 검색어로 시도해보세요</span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { searchVideos, fetchFeaturedVideos } from '@/stores/youtube/youtube'
import VideoCard from '@/components/youtube/VideoCard.vue'

const route = useRoute()

const q = ref('')
const items = ref([])
const featured = ref([])
const searched = ref(false)
const loading = ref(false)
const error = ref('')

async function onSearch() {
  error.value = ''
  items.value = []
  searched.value = true
  loading.value = true

  try {
    items.value = await searchVideos(q.value)
  } catch (e) {
    error.value = '검색 중 오류가 발생했어요. API Key/쿼터/네트워크를 확인하세요.'
  } finally {
    loading.value = false
  }
}

// 페이지 로드 시 query parameter에서 검색어를 가져와서 자동 검색
onMounted(async () => {
  const queryParam = route.query.q
  if (queryParam) {
    q.value = queryParam
    onSearch()
    return
  }
  // 검색어 없이 들어오면 추천 영상을 보여준다 (실패해도 검색은 그대로 쓸 수 있다)
  try {
    featured.value = await fetchFeaturedVideos()
  } catch (e) {
    featured.value = []
  }
})
</script>

<style scoped>
.youtube-search {
  min-height: calc(100vh - 200px);
  background: var(--n-page);
  padding-bottom: 120px;
}

/* Page Header — 공용 규칙은 global.css 의 .n-page-header* 를 쓴다.
   이 화면 고유 구조(제목줄+탭이 세로로 쌓이는 것, 유튜브 로고 색)만 남긴다. */
.header-title-area {
  display: flex;
  align-items: center;
  gap: 28px;
}

/* Nav Tabs */
.nav-tabs {
  display: flex;
  gap: 8px;
}

.nav-tab {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
  height: 52px;
  padding: 0 24px;
  gap: 8px;
  border: 0;
  border-radius: 16px;
  background: var(--n-surface);
  color: var(--n-fg-muted);
  font-size: 20px;
  font-weight: 600;
}

.nav-tab.router-link-active {
  color: var(--gray-700);
  background: #eae3f1;
}

/* Search Section */
.search-section {
  padding: 0 24px;
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: -48px auto 0;
}

.search-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 32px;
  border: 0;
  border-radius: 28px;
  background: var(--n-surface);
  box-shadow: var(--n-shadow-float);
}

.search-form {
  display: flex;
  gap: 12px;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  pointer-events: none;
  left: 22px;
  width: 22px;
  height: 22px;
  color: var(--n-fg-muted);
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  transition: all 0.2s;
  height: 64px;
  padding-left: 56px;
  border: 0;
  border-radius: 20px;
  background: var(--n-fill);
  font-size: 20px;
  font-weight: 600;
  color: var(--n-fg);
}

.search-input::placeholder {
  color: var(--n-fg-faint);
  font-weight: 500;
}

.search-input:focus {
  outline: none;
  background: var(--n-lilac);
  box-shadow: 0 0 0 3px var(--n-lilac-strong);
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  height: 64px;
  padding: 0 36px;
  border: 0;
  border-radius: 20px;
  background: var(--n-violet);
  color: var(--n-on-accent);
  font-size: 19px;
  font-weight: 700;
}

.search-btn:hover:not(:disabled) {
  background: var(--n-violet-hover);
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-content,
.btn-loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-content svg,
.btn-loading svg {
  width: 18px;
  height: 18px;
}

.spinner {
  animation: spin 1s linear infinite;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0 0;
  padding: 12px 16px;
  background: var(--n-danger-bg);
  border-radius: var(--n-radius-md);
  color: var(--n-danger-text);
  font-size: 0.875rem;
}

.error-message svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* Results Section */
.results-section {
  padding: 0 24px;
  max-width: 1200px;
  margin: 56px auto 0;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 24px;
  border: 0;
  padding: 0;
}

.results-title {
  margin: 0;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--n-title);
}

.results-count {
  font-size: 18px;
  color: var(--n-fg-muted);
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 24px;
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
  color: var(--n-accent);
}

.empty-title {
  font-weight: 600;
  margin: 0 0 8px;
  font-size: 26px;
  color: var(--n-title);
}

.empty-text {
  font-size: 18px;
  color: var(--n-fg-muted);
}
/* ═══════════════════════════════════════════════════════════════════
   F!NK 리디자인 — 헤더 아래 탭, 검색 카드는 헤더에 겹쳐 뜬다.
   ═══════════════════════════════════════════════════════════════════ */
.n-page-header { padding-bottom: 100px; }
.n-page-header-content--stack { gap: 28px; }

/* 유튜브 로고는 플랫폼을 식별하는 브랜드 마크라 빨강을 유지한다.
   타일 크기·보더는 .n-page-header-icon 이 처리한다. */
.youtube-icon svg { color: inherit; }
.nav-tab svg { width: 20px; height: 20px; }
.nav-tab:hover { background: var(--n-surface); color: var(--n-fg); }
.nav-tab.router-link-exact-active { background: var(--n-violet); color: var(--n-on-accent); }

@media (max-width: 768px) {
  .search-section {
    padding: 0 16px;
  }

  .search-form {
    flex-direction: column;
  }

  .search-btn {
    width: 100%;
  }

  .results-section {
    padding: 0 16px;
  }

  .video-grid {
    grid-template-columns: 1fr;
  }
}</style>
