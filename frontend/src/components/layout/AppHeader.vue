<template>
  <header class="navbar">
    <div class="navbar-container">
      <RouterLink :to="{ name: 'home' }" class="navbar-brand">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="7" fill="currentColor" />
            <path d="M8.5 17V7.8c0-.5.4-.9.9-.9h5.3" stroke="#fff" stroke-width="2" stroke-linecap="round" />
            <path d="M8.5 12.2h4.6" stroke="#fff" stroke-width="2" stroke-linecap="round" />
            <circle cx="16.1" cy="16.4" r="1.35" fill="#fff" />
          </svg>
        </span>
        <span class="brand-text">F!NK</span>
      </RouterLink>

      <nav class="navbar-menu">
        <RouterLink v-for="item in MENU" :key="item.name" :to="{ name: item.name }" class="navbar-link">
          {{ item.label }}
        </RouterLink>
      </nav>

      <ExchangeTicker />

      <div class="navbar-actions">
        <template v-if="!accountStore.isLogin">
          <RouterLink :to="{ name: 'LogInView' }" class="btn btn-ghost btn-sm">로그인</RouterLink>
          <RouterLink :to="{ name: 'SignUpView' }" class="btn btn-primary btn-sm">회원가입</RouterLink>
        </template>
        <template v-else>
          <RouterLink :to="{ name: 'ProfileView' }" class="user-menu">
            <span class="user-avatar">{{ accountStore.nickname?.charAt(0) || 'U' }}</span>
            <span class="user-name">{{ accountStore.nickname }}</span>
          </RouterLink>
          <button class="logout-btn" title="로그아웃" @click="accountStore.logOut">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <path d="M16 17l5-5-5-5M21 12H9"/>
            </svg>
            <span class="logout-text">로그아웃</span>
          </button>
        </template>
      </div>

      <div class="navbar-settings">
        <button class="settings-btn" :title="themeLabel" @click="themeStore.toggleTheme">
          <ThemeIcon :dark="themeStore.isDark" />
        </button>
      </div>

      <!-- 1024px 이하에서만 보인다 -->
      <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
        <svg v-if="!mobileMenuOpen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <Transition name="slide-down">
      <div v-if="mobileMenuOpen" class="mobile-menu">
        <RouterLink
          v-for="item in MENU"
          :key="item.name"
          :to="{ name: item.name }"
          class="mobile-link"
          @click="closeMenu"
        >
          {{ item.label }}
        </RouterLink>
        <div class="mobile-divider"></div>
        <div class="mobile-settings">
          <button class="mobile-settings-btn" @click="themeStore.toggleTheme">
            <ThemeIcon :dark="themeStore.isDark" />
            {{ themeLabel }}
          </button>
        </div>
        <div class="mobile-divider"></div>
        <template v-if="!accountStore.isLogin">
          <RouterLink :to="{ name: 'LogInView' }" class="mobile-link" @click="closeMenu">로그인</RouterLink>
          <RouterLink :to="{ name: 'SignUpView' }" class="mobile-link" @click="closeMenu">회원가입</RouterLink>
        </template>
        <template v-else>
          <RouterLink :to="{ name: 'ProfileView' }" class="mobile-link" @click="closeMenu">마이페이지</RouterLink>
          <button class="mobile-link" @click="accountStore.logOut(); closeMenu()">로그아웃</button>
        </template>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAccountStore } from '@/stores/accounts'
import { useThemeStore } from '@/stores/theme'
import ExchangeTicker from './ExchangeTicker.vue'
import ThemeIcon from './ThemeIcon.vue'

// 상단 메뉴 순서는 바꾸지 않는다. 모바일 메뉴도 같은 순서를 쓴다.
const MENU = [
  { name: 'ProductView', label: '금융상품' },
  { name: 'AnalysisView', label: 'AI 분석' },
  { name: 'StockView', label: '주식' },
  { name: 'NewsView', label: '금융뉴스' },
  { name: 'YoutubeSearchView', label: '유튜브' },
  { name: 'MetalView', label: '현물' },
  { name: 'KakaoMapView', label: '은행찾기' },
  { name: 'CommunityView', label: '커뮤니티' },
]

const accountStore = useAccountStore()
const themeStore = useThemeStore()

const mobileMenuOpen = ref(false)
const closeMenu = () => { mobileMenuOpen.value = false }
const themeLabel = computed(() => (themeStore.isDark ? '라이트 모드' : '다크 모드'))
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════
   상단바 — 88px, 메뉴 22px/600, 보더 없음
   ═══════════════════════════════════════════════════════════════════ */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--n-page);
}

/* 넓은 화면에서도 로고·버튼이 화면 끝에 붙지 않게 최대 폭을 두고 가운데 정렬 */
.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88px;
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 48px;
  gap: 20px;
}

/* position:relative + left 로 옮겨야 레이아웃 폭은 그대로 두고 보이는 위치만
   왼쪽으로 간다. margin-left 를 쓰면 space-between 이라 뒤 요소까지 딸려 온다. */
.navbar-brand {
  position: relative;
  left: -20px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 10px;
}

.brand-mark {
  display: block;
  width: 40px;
  height: 40px;
  color: var(--n-orchid);
}

.brand-mark svg {
  display: block;
  width: 100%;
  height: 100%;
}

.brand-text {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.035em;
  color: var(--n-orchid);
}

/* ── 메뉴 ─────────────────────────────────────────────────────────── */
.navbar-menu {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  gap: 20px;
}

.navbar-link {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--n-fg-muted);
  transition: color 0.2s, background-color 0.2s;
}

.navbar-link:hover {
  color: var(--n-fg);
  background: var(--n-fill);
}

/* 활성 표시 — 둥근 연보라 배경만 (막대·점 없음) */
.navbar-link.router-link-active {
  color: var(--n-violet-hover);
  background: var(--n-lilac);
}

/* ── 로그인·회원가입 / 프로필·로그아웃 ───────────────────────────── */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* global.css 의 .btn 을 네비바 버튼 높이(44px)에 맞춘다 */
.navbar-actions .btn {
  height: 44px;
  padding: 0 20px;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 600;
}

.navbar-actions .btn-ghost {
  background: transparent;
  border: 0;
  color: var(--n-fg);
}

.navbar-actions .btn-ghost:hover {
  background: var(--n-fill);
}

.navbar-actions .btn-primary {
  background: #9082dd;
  border: 0;
  color: var(--n-on-accent);
  font-weight: 700;
}

.navbar-actions .btn-primary:hover {
  background: var(--n-violet);
}

.user-menu {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 16px 0 6px;
  gap: 10px;
  border-radius: 12px;
  background: var(--n-fill);
  transition: background-color 0.18s ease;
}

.user-menu:hover {
  background: var(--n-lilac);
}

.user-avatar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--n-orchid);
  color: var(--n-on-accent);
  font-size: 16px;
  font-weight: 700;
}

.user-name {
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.15;
  color: var(--n-fg);
}

/* 로그아웃 — 아이콘 버튼. 넓을 때만 텍스트가 붙는다. */
.logout-btn {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 16px;
  gap: 8px;
  border-radius: 12px;
  color: var(--n-fg-muted);
  font-size: 17px;
  font-weight: 600;
  transition: background-color 0.18s ease, color 0.18s ease;
}

.logout-btn svg {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.logout-btn:hover {
  background: var(--n-fill);
  color: var(--n-fg);
}

/* ── 테마 전환 (우측 끝) ──────────────────────────────────────────── */
.navbar-settings {
  display: flex;
  align-items: center;
  gap: 6px;
}

.settings-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--n-fill);
  color: var(--n-fg);
  transition: background-color 0.18s ease, color 0.18s ease;
}

.settings-btn:hover {
  background: #ece8f4;
}

.settings-btn svg {
  width: 22px;
  height: 22px;
}

/* ── 모바일 메뉴 ──────────────────────────────────────────────────── */
.mobile-menu-btn {
  display: none;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: var(--n-radius-sm);
  color: var(--n-text-muted);
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

.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 16px;
  background: var(--n-bg);
  border-top: 1px solid var(--n-border);
}

.mobile-link {
  display: block;
  width: 100%;
  padding: 14px 16px;
  font-size: 1rem;
  font-weight: 500;
  text-align: left;
  color: var(--n-text-body);
  border-radius: var(--n-radius-sm);
  transition: background-color 0.2s ease, color 0.2s ease;
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
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-sm);
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

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ═══════════════════════════════════════════════════════════════════
   반응형
   ═══════════════════════════════════════════════════════════════════ */
/* 메뉴 간격 20px + 배경 여백까지 한 줄에 들어가려면 약 1690px 가 필요하다 */
@media (max-width: 1690px) {
  .navbar-menu { gap: 14px; }
  .navbar-link { padding: 8px 14px; }
}

@media (max-width: 1440px) {
  .navbar-container { padding: 0 24px; gap: 16px; }
  .navbar-menu { gap: 8px; }
  .navbar-link { font-size: 19px; padding: 6px 12px; }
}

@media (max-width: 1240px) {
  .navbar-actions { margin-left: auto; }
}

@media (max-width: 1200px) {
  .logout-text { display: none; }
  .logout-btn { padding: 0 10px; }
}

@media (max-width: 1024px) {
  .navbar-menu,
  .navbar-actions {
    display: none;
  }

  /* 테마 버튼은 햄버거 바로 왼쪽에 붙는다 */
  .navbar-settings {
    margin-left: auto;
  }

  .mobile-menu-btn,
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
}
</style>
