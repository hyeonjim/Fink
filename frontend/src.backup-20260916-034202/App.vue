<template>
  <div class="app">
    <!-- Navigation -->
    <header class="navbar">
      <div class="navbar-container">
        <!-- Logo -->
        <RouterLink :to="{ name: 'home' }" class="navbar-brand">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="7" fill="currentColor" />
              <path
                d="M8.5 17V7.8c0-.5.4-.9.9-.9h5.3"
                stroke="#fff"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path d="M8.5 12.2h4.6" stroke="#fff" stroke-width="2" stroke-linecap="round" />
              <circle cx="16.1" cy="16.4" r="1.35" fill="#fff" />
            </svg>
          </span>
          <span class="brand-text">F!NK</span>
        </RouterLink>
        <!-- Main Navigation -->
        <nav class="navbar-menu">
          <RouterLink :to="{ name: 'ProductView' }" class="navbar-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            금융상품
          </RouterLink>
          <RouterLink :to="{ name: 'AnalysisView' }" class="navbar-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            AI 분석
          </RouterLink>
          <RouterLink :to="{ name: 'StockView' }" class="navbar-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
              <polyline points="16 7 22 7 22 13"/>
            </svg>
            주식
          </RouterLink>
          <RouterLink :to="{ name: 'NewsView' }" class="navbar-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
            </svg>
            금융뉴스
          </RouterLink>
          <RouterLink :to="{ name: 'YoutubeSearchView' }" class="navbar-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            유튜브
          </RouterLink>
          <RouterLink :to="{ name: 'MetalView' }" class="navbar-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            현물
          </RouterLink>

          <RouterLink :to="{ name: 'KakaoMapView' }" class="navbar-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            은행찾기
          </RouterLink>
          <RouterLink :to="{ name: 'CommunityView' }" class="navbar-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
            </svg>
            커뮤니티
          </RouterLink>
        </nav>

                <!-- Exchange Rate Ticker -->
        <div v-if="exchangeStore.rates.length > 0" class="exchange-ticker">
          <span class="ticker-badge">환율</span>
          <div class="ticker-wrapper">
            <div
              v-for="(rate, index) in exchangeStore.rates"
              :key="rate.cur_unit"
              class="ticker-item"
              :class="{ active: index === currentRateIndex, prev: index === prevRateIndex }"
            >
              <span class="ticker-name">{{ rate.cur_unit }}</span>
              <span class="ticker-rate">{{ formatRate(rate.deal_bas_r) }}</span>
            </div>
          </div>
        </div>

        <!-- User Actions -->
        <div class="navbar-actions">
          <template v-if="!accountStore.isLogin">
            <RouterLink :to="{ name: 'LogInView' }" class="btn btn-ghost btn-sm">
              로그인
            </RouterLink>
            <RouterLink :to="{ name: 'SignUpView' }" class="btn btn-primary btn-sm">
              회원가입
            </RouterLink>
          </template>
          <template v-else>
            <RouterLink :to="{ name: 'ProfileView' }" class="user-menu">
              <span class="user-avatar">
                {{ accountStore.nickname?.charAt(0) || 'U' }}
              </span>
              <span class="user-meta">
                <span class="user-name">{{ accountStore.nickname }}</span>
              </span>
            </RouterLink>
            <button @click="accountStore.logOut" class="logout-btn" title="로그아웃">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <path d="M16 17l5-5-5-5M21 12H9"/>
              </svg>
              <span class="logout-text">로그아웃</span>
            </button>
          </template>
        </div>

        <!-- Theme Toggle Button (우측 끝) -->
        <div class="navbar-settings">
          <button class="settings-btn" @click="themeStore.toggleTheme" :title="themeStore.isDark ? '라이트 모드' : '다크 모드'">
            <svg v-if="themeStore.isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
          <svg v-if="!mobileMenuOpen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <Transition name="slide-down">
        <div v-if="mobileMenuOpen" class="mobile-menu">
          <RouterLink :to="{ name: 'ProductView' }" class="mobile-link" @click="mobileMenuOpen = false">금융상품</RouterLink>
          <RouterLink :to="{ name: 'AnalysisView' }" class="mobile-link" @click="mobileMenuOpen = false">AI 분석</RouterLink>
          <RouterLink :to="{ name: 'NewsView' }" class="mobile-link" @click="mobileMenuOpen = false">금융뉴스</RouterLink>
          <RouterLink :to="{ name: 'YoutubeSearchView' }" class="mobile-link" @click="mobileMenuOpen = false">유튜브</RouterLink>
          <RouterLink :to="{ name: 'MetalView' }" class="mobile-link" @click="mobileMenuOpen = false">현물</RouterLink>
          <RouterLink :to="{ name: 'StockView' }" class="mobile-link" @click="mobileMenuOpen = false">주식</RouterLink>
          <RouterLink :to="{ name: 'KakaoMapView' }" class="mobile-link" @click="mobileMenuOpen = false">은행찾기</RouterLink>
          <RouterLink :to="{ name: 'CommunityView' }" class="mobile-link" @click="mobileMenuOpen = false">커뮤니티</RouterLink>
          <div class="mobile-divider"></div>
          <!-- Mobile Theme Toggle -->
          <div class="mobile-settings">
            <button class="mobile-settings-btn" @click="themeStore.toggleTheme">
              <svg v-if="themeStore.isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
              {{ themeStore.isDark ? '라이트 모드' : '다크 모드' }}
            </button>
          </div>
          <div class="mobile-divider"></div>
          <template v-if="!accountStore.isLogin">
            <RouterLink :to="{ name: 'LogInView' }" class="mobile-link" @click="mobileMenuOpen = false">로그인</RouterLink>
            <RouterLink :to="{ name: 'SignUpView' }" class="mobile-link" @click="mobileMenuOpen = false">회원가입</RouterLink>
          </template>
          <template v-else>
            <RouterLink :to="{ name: 'ProfileView' }" class="mobile-link" @click="mobileMenuOpen = false">마이페이지</RouterLink>
            <button class="mobile-link" @click="accountStore.logOut(); mobileMenuOpen = false">로그아웃</button>
          </template>
        </div>
      </Transition>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <span class="footer-logo">F!NK</span>
            <p class="footer-tagline">AI 기반 스마트 자산관리 플랫폼</p>
          </div>
          <div class="footer-links">
            <a href="#">이용약관</a>
            <a href="#">개인정보처리방침</a>
            <a href="#">고객센터</a>
          </div>
          <p class="footer-copyright">© 2025 F!NK. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <!-- AI 챗봇 -->
    <ChatBot />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAccountStore } from './stores/accounts'
import { useExchangeStore } from './stores/exchange'
import { useThemeStore } from './stores/theme'
import ChatBot from './components/ChatBot.vue'

const router = useRouter()
const accountStore = useAccountStore()
const exchangeStore = useExchangeStore()
const themeStore = useThemeStore()

const mobileMenuOpen = ref(false)
const currentRateIndex = ref(0)
const prevRateIndex = ref(-1)

let tickerInterval = null

// 환율 포맷팅
const formatRate = (rate) => {
  if (!rate) return '-'
  const numRate = parseFloat(rate.replace(/,/g, ''))
  return numRate.toLocaleString('ko-KR', { maximumFractionDigits: 2 })
}

// 3초마다 환율 자동 전환 (아래에서 위로 올라오며 교체)
const startTicker = () => {
  if (exchangeStore.rates.length === 0) return
  tickerInterval = setInterval(() => {
    prevRateIndex.value = currentRateIndex.value
    currentRateIndex.value = (currentRateIndex.value + 1) % exchangeStore.rates.length
  }, 3000)
}

onMounted(() => {
  if (exchangeStore.rates.length > 0) {
    startTicker()
  }
})

onUnmounted(() => {
  if (tickerInterval) clearInterval(tickerInterval)
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--n-bg);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Navbar - Glassmorphism Style
   ═══════════════════════════════════════════════════════════════════════════ */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--n-bg);
  border-bottom: 1px solid var(--n-border);
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
  /* position:relative + left 로 이동시켜야 레이아웃 폭(공간 자체)은 그대로 유지되고
     시각적 위치만 왼쪽으로 옮겨진다. margin-left를 쓰면 space-between 컨테이너라
     뒤따르는 메뉴/티커/버튼까지 같이 딸려와 전체가 밀린 것처럼 보인다. */
  position: relative;
  left: -20px;
  text-decoration: none;
  /* global.css 의 .navbar-brand 가 그라데이션 텍스트(-webkit-text-fill-color:
     transparent)를 걸어두기 때문에 여기서 되돌려야 color 가 실제로 먹는다. */
  background: none;
  -webkit-text-fill-color: currentColor;
}

.brand-mark {
  display: block;
  width: 38px;
  height: 38px;
  color: #bb8ec7;
}

.brand-mark svg {
  display: block;
  width: 100%;
  height: 100%;
}

.brand-text {
  font-size: 40px;
  font-weight: 700;
  letter-spacing: -0.035em;
  color: #bb8ec7;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 2px;
}

.navbar-link {
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--n-text-muted);
  border-radius: 8px;
  text-decoration: none;
  transition: color 0.18s ease, background-color 0.18s ease;
}

/* 하단 인디케이터 — 가운데에서 양쪽으로 펼쳐진다 */
.navbar-link::after {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 2px;
  height: 2px;
  border-radius: 1px;
  background: var(--n-accent);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}

.navbar-link:hover {
  color: var(--n-text);
  background: var(--n-bg-sunken);
}

.navbar-link:hover::after {
  transform: scaleX(1);
}

.navbar-link.router-link-active {
  color: var(--n-accent);
  font-weight: 600;
}

.navbar-link.router-link-active::after {
  transform: scaleX(1);
}

/* 메뉴가 8개라 아이콘까지 두면 밀도가 높다. 마크업은 유지하고 표시만 끈다. */
.nav-icon {
  display: none;
}

/* Exchange Rate Ticker */
.exchange-ticker {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 180px;
  height: 34px;
  margin: 0 16px;
  overflow: hidden;
  background: var(--n-bg-sunken);
  border-radius: 17px;
  padding: 0 16px;
  border: 1px solid var(--n-border);
}

.ticker-badge {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--n-accent);
  padding: 2px 9px;
  border-radius: 999px;
  background: #fdfdfd;
}

.ticker-wrapper {
  position: relative;
  flex: 1;
  height: 100%;
}

/* 대기 중인 항목: 아래에 숨어서 순서를 기다린다 */
.ticker-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 7px;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.42s cubic-bezier(0.22, 1, 0.36, 1), transform 0.42s cubic-bezier(0.22, 1, 0.36, 1);
}

/* 현재 표시 중: 제자리에서 보임 */
.ticker-item.active {
  opacity: 1;
  transform: translateY(0);
}

/* 방금 밀려난 항목: 위로 빠져나간다 */
.ticker-item.prev {
  opacity: 0;
  transform: translateY(-16px);
}

.ticker-name {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--n-text-muted);
  flex-shrink: 0;
  width: 52px;
  letter-spacing: 0.01em;
}

.ticker-rate {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--n-text);
  flex: 1;
  text-align: right;
}


/* Settings Buttons — 네비바 우측 끝 */
.navbar-settings {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 12px;
}

.settings-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: transparent;
  border: 1px solid var(--n-border);
  color: var(--n-text-muted);
  cursor: pointer;
  transition: background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease;
}

.settings-btn:hover {
  background: var(--n-bg-sunken);
  border-color: var(--n-border-strong);
  color: var(--n-text);
}

.settings-btn svg {
  width: 18px;
  height: 18px;
}

.settings-btn.lang-btn {
  font-size: 0.8125rem;
  font-weight: 700;
}

.lang-text {
  line-height: 1;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 전역 .btn-primary / .btn-ghost 는 그라데이션이라 네비바 안에서만 무채색으로 덮는다.
   (다른 페이지의 버튼은 그대로 둔다) */
.navbar-actions :deep(.btn) {
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: none;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.navbar-actions :deep(.btn-ghost) {
  color: var(--n-text-muted);
  background: transparent;
}

.navbar-actions :deep(.btn-ghost:hover) {
  color: var(--n-text);
  background: var(--n-bg-subtle);
  transform: none;
}

.navbar-actions :deep(.btn-primary) {
  background: var(--n-accent);
  background-image: none;
  border: 1px solid var(--n-accent);
  color: #fff;
}

.navbar-actions :deep(.btn-primary:hover) {
  background: var(--n-accent-hover);
  border-color: var(--n-accent-hover);
  transform: none;
  box-shadow: none;
}

.navbar-actions :deep(.btn-primary::before) {
  display: none;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 4px 12px 4px 4px;
  background: transparent;
  border-radius: 9px;
  text-decoration: none;
  transition: background-color 0.18s ease, border-color 0.18s ease;
  border: 1px solid var(--n-border);
}

.user-menu:hover {
  background: var(--n-bg-sunken);
  border-color: var(--n-border-strong);
}

.user-meta {
  display: flex;
  flex-direction: column;
  gap: 1px;
  line-height: 1.15;
}

.user-label {
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--n-text-muted);
}

.user-avatar {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 7px;
  background: var(--n-accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 600;
}

.user-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--n-text);
  max-width: 96px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 로그아웃 — 아이콘 버튼. 넓을 때만 텍스트가 붙는다. */
.logout-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 12px;
  border: 1px solid var(--n-border);
  border-radius: 9px;
  background: transparent;
  color: var(--n-text-muted);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease;
}

.logout-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.logout-btn:hover {
  background: var(--n-bg-sunken);
  border-color: var(--n-border-strong);
  color: var(--n-text);
}

@media (max-width: 1200px) {
  .logout-text {
    display: none;
  }

  .logout-btn {
    padding: 0 10px;
  }
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--n-text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.mobile-menu-btn:hover {
  background: var(--n-bg-subtle);
  color: var(--n-text);
}

.mobile-menu-btn svg {
  width: 24px;
  height: 24px;
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 16px;
  background: var(--n-bg);
  border-top: 1px solid var(--n-border);
}

.mobile-link {
  display: block;
  padding: 14px 16px;
  font-size: 1rem;
  font-weight: 500;
  color: var(--n-text-body);
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.2s ease, color 0.2s ease;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  width: 100%;
}

.mobile-link:hover,
.mobile-link.router-link-active {
  background: var(--n-bg-subtle);
  color: var(--n-text);
}

.mobile-divider {
  height: 1px;
  background: var(--n-border);
  margin: 12px 0;
}

/* Mobile Settings */
.mobile-settings {
  display: flex;
  gap: 10px;
  padding: 8px 0;
}

.mobile-settings-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--n-text-body);
  background: transparent;
  border: 1px solid var(--n-border);
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.mobile-settings-btn svg {
  width: 18px;
  height: 18px;
}

.mobile-settings-btn:hover {
  background: var(--n-bg-subtle);
  color: var(--n-text);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main Content
   ═══════════════════════════════════════════════════════════════════════════ */
.main-content {
  flex: 1;
  width: 100%;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Footer - Modern Style (70% 축소)
   ═══════════════════════════════════════════════════════════════════════════ */
.footer {
  background: var(--n-bg-subtle);
  border-top: 1px solid var(--n-border);
  padding: 40px 24px;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
}

.footer-brand {
  margin-bottom: 20px;
}

.footer-logo {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--n-text);
  letter-spacing: -0.03em;
}

.footer-tagline {
  color: var(--n-text-muted);
  font-size: 0.8125rem;
  margin-top: 6px;
  letter-spacing: -0.01em;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;
}

.footer-links a {
  color: var(--n-text-muted);
  font-size: 0.8125rem;
  text-decoration: none;
  transition: color 0.2s ease;
  padding: 3px 0;
}

.footer-links a:hover {
  color: var(--n-text);
}

.footer-copyright {
  color: var(--n-text-muted);
  font-size: 0.75rem;
  letter-spacing: -0.01em;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Transitions
   ═══════════════════════════════════════════════════════════════════════════ */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Responsive Design
   ═══════════════════════════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  .navbar-menu {
    display: none;
  }

  .exchange-ticker {
    display: flex;
    max-width: 170px;
    min-width: 0;
    overflow: hidden;
  }

  .ticker-badge {
    display: none;
  }

  .navbar-actions {
    display: none;
  }

  /* 테마 버튼은 햄버거 바로 왼쪽에 붙는다. */
  .navbar-settings {
    margin-left: auto;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .mobile-menu {
    display: flex;
  }
}

@media (max-width: 768px) {
  .navbar-container {
    height: 64px;
    padding: 0 16px;
  }

  .brand-mark {
    width: 26px;
    height: 26px;
  }

  .footer {
    padding: 48px 16px 32px;
  }

  .footer-links {
    flex-wrap: wrap;
    gap: 20px;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   Dark Mode Styles

   네비바·푸터는 --n-* 토큰을 쓰고 있고 이 토큰들은 global.css 의
   [data-theme="dark"] 블록에서 이미 뒤집힌다. 따라서 여기에는
   토큰으로 처리되지 않는 예외만 남긴다.
   ═══════════════════════════════════════════════════════════════════════════ */
[data-theme="dark"] .btn-primary {
  color: #fff;
}
</style>