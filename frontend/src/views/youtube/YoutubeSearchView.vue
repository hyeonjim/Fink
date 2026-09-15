<template>
  <section class="youtube-search">
    <!-- Page Header -->
    <header class="n-page-header">
      <div class="n-page-header-content n-page-header-content--stack">
        <div class="header-title-area">
          <div class="n-page-header-icon youtube-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z"/>
            </svg>
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
        <h3 class="search-title">
          비디오 검색
        </h3>
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

    <!-- Empty State -->
    <div v-else-if="!loading && q" class="empty-state">
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
import { searchVideos } from '@/stores/youtube/youtube'
import VideoCard from '@/components/youtube/VideoCard.vue'

const route = useRoute()

const q = ref('')
const items = ref([])
const loading = ref(false)
const error = ref('')

async function onSearch() {
  error.value = ''
  items.value = []
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
onMounted(() => {
  const queryParam = route.query.q
  if (queryParam) {
    q.value = queryParam
    onSearch()
  }
})
</script>

<style scoped>
.youtube-search {
  min-height: calc(100vh - 200px);
  background: var(--n-bg);
  padding-bottom: 60px;
}

/* Page Header — 공용 규칙은 global.css 의 .n-page-header* 를 쓴다.
   이 화면 고유 구조(제목줄+탭이 세로로 쌓이는 것, 유튜브 로고 색)만 남긴다. */
.header-title-area {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 유튜브 로고는 플랫폼을 식별하는 브랜드 마크라 빨강을 유지한다.
   타일 크기·보더는 .n-page-header-icon 이 처리한다. */
.youtube-icon svg {
  color: var(--n-danger-text);
}

/* Nav Tabs */
.nav-tabs {
  display: flex;
  gap: 8px;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 14px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--n-accent);
  background: var(--n-bg);
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-sm);
  text-decoration: none;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}

.nav-tab svg {
  width: 16px;
  height: 16px;
}

.nav-tab:hover {
  color: var(--n-accent-hover);
  border-color: var(--n-border-strong);
  background: var(--n-accent-wash);
}

.nav-tab.router-link-active {
  color: var(--n-accent);
  background: var(--n-bg);
}

/* Search Section */
.search-section {
  max-width: 1400px;
  margin: 32px auto 0;
  padding: 0 24px;
}

.search-card {
  background: var(--n-bg);
  border-radius: var(--n-radius-xl);
  padding: 24px;
  border: 1px solid var(--n-border);
}

.search-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--n-text);
  margin: 0 0 16px;
}

.search-title svg {
  width: 20px;
  height: 20px;
  color: var(--n-accent);
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
  left: 16px;
  width: 20px;
  height: 20px;
  color: var(--n-text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  font-size: 0.9375rem;
  border: 2px solid var(--n-border);
  border-radius: var(--n-radius-md);
  background: var(--n-bg-subtle);
  transition: all 0.2s;
}

.search-input::placeholder {
  color: var(--n-text-muted);
}

.search-input:focus {
  outline: none;
  border-color: var(--n-accent);
  background: var(--n-bg);
  box-shadow: 0 0 0 4px var(--n-accent-wash);
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: white;
  background: var(--n-accent);
  border: none;
  border-radius: var(--n-radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.search-btn:hover:not(:disabled) {
  box-shadow: none;
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
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
  max-width: 1400px;
  margin: 32px auto 0;
  padding: 0 24px;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.results-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--n-text);
  margin: 0;
}

.results-count {
  font-size: 0.875rem;
  color: var(--n-text-muted);
}

.video-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
  background: var(--n-accent-wash);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.empty-icon svg {
  width: 40px;
  height: 40px;
  color: var(--n-accent);
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--n-text);
  margin: 0 0 8px;
}

.empty-text {
  font-size: 0.9375rem;
  color: var(--n-text-muted);
}

/* Responsive */
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
