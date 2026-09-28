<template>
  <section class="saved-layout">
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
            <h1 class="n-page-title">저장된 콘텐츠</h1>
            <p class="n-page-subtitle">저장한 비디오와 채널을 관리하세요</p>
          </div>
        </div>

        <!-- Search Box -->
        <div class="search-box">
          <form class="search-form" @submit.prevent="onSearch">
            <div class="search-input-wrapper">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                v-model.trim="q"
                class="search-input"
                placeholder="비디오 검색 (검색 페이지로 이동)"
              />
            </div>
            <button class="search-btn" type="submit" :disabled="!q">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              검색
            </button>
          </form>
        </div>

        <!-- Nav Tabs -->
        <nav class="nav-tabs">
          <RouterLink class="nav-tab" :to="{ name: 'YoutubeSavedView' }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M10 9l5 3-5 3V9z"/>
            </svg>
            비디오
          </RouterLink>
          <RouterLink class="nav-tab" :to="{ name: 'YoutubeChannelsView' }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
            채널
          </RouterLink>
        </nav>
      </div>
    </header>

    <!-- Content Area -->
    <main class="content">
      <RouterView />
    </main>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'

const router = useRouter()
const q = ref('')

const onSearch = () => {
  if (!q.value.trim()) return
  
  // 검색어를 가지고 검색 페이지로 이동
  router.push({
    name: 'YoutubeSearchView',
    query: { q: q.value }
  })
  
  // 검색어 초기화
  q.value = ''
}
</script>

<style scoped>
.saved-layout {
  min-height: calc(100vh - 200px);
  background: var(--n-bg);
}

/* Page Header — 공용 규칙은 global.css 의 .n-page-header* 를 쓴다. */
.header-title-area {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 유튜브 로고는 플랫폼을 식별하는 브랜드 마크라 빨강을 유지한다. */
.youtube-icon svg {
  color: var(--n-danger-text);
}

/* Search Box */
.search-box {
  width: 100%;
}

.search-form {
  display: flex;
  gap: 10px;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: var(--n-text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 14px 12px 44px;
  font-size: 0.9375rem;
  border: none;
  border-radius: var(--n-radius-md);
  background: rgba(255, 255, 255, 0.95);
  transition: all 0.2s;
}

.search-input::placeholder {
  color: var(--n-text-muted);
}

.search-input:focus {
  outline: none;
  background: var(--n-bg);
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.3);
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--n-danger-text);
  background: var(--n-bg);
  border: none;
  border-radius: var(--n-radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.search-btn svg {
  width: 18px;
  height: 18px;
}

.search-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
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
  font-size: 18px;
  font-weight: 500;
  color: var(--n-text-muted);
  background: transparent;
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
  color: var(--n-text);
  border-color: var(--n-border-strong);
}

.nav-tab.router-link-active {
  color: var(--n-accent);
  background: #eae3f1;
  border-color: var(--n-accent);
}

/* Content */
.content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px 60px;
  min-height: 300px;
}

/* Responsive */
@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
  }

  .search-btn {
    width: 100%;
    justify-content: center;
  }

  .content {
    padding: 24px 16px 40px;
  }
}
</style>
