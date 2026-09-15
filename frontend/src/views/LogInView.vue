<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Left Side - Branding -->
      <div class="auth-branding">
        <div class="branding-content">
          <div class="branding-logo">F!NK</div>
          <h1 class="branding-title">
            당신의 금융을<br>
            더 스마트하게
          </h1>
          <p class="branding-description">
            AI 기반 맞춤 금융상품 추천으로<br>
            현명한 금융 생활을 시작하세요.
          </p>

          <div class="branding-features">
            <div class="feature-item">
              <div class="feature-check">✓</div>
              <span>21개 금융기관 상품 비교</span>
            </div>
            <div class="feature-item">
              <div class="feature-check">✓</div>
              <span>AI 맞춤 추천</span>
            </div>
            <div class="feature-item">
              <div class="feature-check">✓</div>
              <span>실시간 뉴스 &amp; 시세</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Form -->
      <div class="auth-form-section">
        <div class="auth-form-container">
          <div class="auth-header">
            <h2 class="auth-title">로그인</h2>
            <p class="auth-subtitle">F!NK에 오신 것을 환영합니다</p>
          </div>

          <form @submit.prevent="logIn" class="auth-form">
            <div class="input-group">
              <label class="input-label" for="username">아이디</label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input 
                  type="text" 
                  id="username" 
                  v-model.trim="username"
                  class="input input-with-icon"
                  placeholder="아이디를 입력하세요"
                  required
                />
              </div>
            </div>
            
            <div class="input-group">
              <label class="input-label" for="password">비밀번호</label>
              <div class="input-wrapper">
                <!-- 자물쇠 아이콘 -->
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>

                <!-- input -->
                <input
                  :type="passwordVisible ? 'text' : 'password'"
                  id="password"
                  v-model.trim="password"
                  class="input input-with-icon input-with-toggle"
                  placeholder="비밀번호를 입력하세요"
                  required
                />

                <!-- 👁️ 보기/숨기기 버튼 -->
                <button
                  type="button"
                  class="password-toggle"
                  @click="passwordVisible = !passwordVisible"
                  aria-label="비밀번호 보기"
                >
                  <svg
                    v-if="!passwordVisible"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>

                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a21.77 21.77 0 015.17-5.94"/>
                    <path d="M1 1l22 22"/>
                    <path d="M9.53 9.53A3.5 3.5 0 0012 15.5a3.5 3.5 0 002.47-5.97"/>
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg btn-block">
              로그인
            </button>
          </form>

          <div class="auth-divider">
            <span>또는</span>
          </div>

          <div class="auth-footer">
            <p>아직 계정이 없으신가요?</p>
            <RouterLink :to="{ name: 'SignUpView' }" class="auth-link">
              회원가입 하기 <span class="arrow">→</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAccountStore } from '@/stores/accounts'

const username = ref('')
const password = ref('')
const accountStore = useAccountStore()
const passwordVisible = ref(false) 

const logIn = () => {
  const payload = {
    username: username.value,
    password: password.value,
  }
  accountStore.logIn(payload)
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════
   Auth (Login) — 무채색. HomeView 의 카드/보더 언어를 따른다.
   ═══════════════════════════════════════════════════════════════════ */
.auth-page {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  background: var(--n-bg-subtle);
}

.auth-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1040px;
  width: 100%;
  background: var(--n-bg);
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-md);
  overflow: hidden;
}

/* ── 좌측 브랜딩 — 그라데이션 대신 단색 잉크 패널 ──────────────── */
.auth-branding {
  position: relative;
  background: var(--n-ink);
  padding: 64px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-right: 1px solid var(--n-border);
}

.branding-content {
  position: relative;
}

.branding-logo {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.035em;
  color: var(--n-ink-text);
  margin-bottom: 36px;
}

.branding-title {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.03em;
  color: var(--n-ink-text);
  margin-bottom: 18px;
}

.branding-description {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--n-ink-text);
  opacity: 0.72;
  margin-bottom: 40px;
}

.branding-features {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9375rem;
  color: var(--n-ink-text);
  opacity: 0.9;
}

.feature-check {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: var(--n-radius-sm);
  background: rgba(41, 41, 48, 0.08);
  font-size: 0.75rem;
  color: var(--n-accent);
}

/* ── 우측 폼 ─────────────────────────────────────────────────────── */
.auth-form-section {
  padding: 64px 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--n-bg);
}

.auth-form-container {
  width: 100%;
  max-width: 380px;
}

.auth-header {
  margin-bottom: 36px;
}

.auth-title {
  font-size: 1.625rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--n-text);
  margin-bottom: 8px;
}

.auth-subtitle {
  color: var(--n-text-muted);
  font-size: 0.9375rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 입력폼(.input-group/.input-label/.input-wrapper/.input-icon/.input)은
   global.css 의 7번 섹션이 담당한다. 회원가입·프로필수정과 똑같은 55줄이
   이 파일에 복사돼 있던 것을 지웠다. */

/* 버튼의 색·상태는 global.css 가 담당한다. 폼 안에서의 높이만 남긴다. */
.auth-form :deep(.btn-primary) {
  height: 46px;
}

.auth-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 28px 0;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--n-border);
}

.auth-divider span {
  font-size: 0.8125rem;
  color: var(--n-text-muted);
}

.auth-footer {
  text-align: center;
}

.auth-footer p {
  color: var(--n-text-muted);
  font-size: 0.9375rem;
  margin-bottom: 8px;
}

.auth-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--n-accent);
  text-decoration: none;
  transition: color 0.18s ease;
}

.auth-link:hover {
  color: var(--n-accent-hover);
}

.auth-link .arrow {
  transition: transform 0.18s ease;
}

.auth-link:hover .arrow {
  transform: translateX(3px);
}

/* 비밀번호 보기 버튼 */
.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--n-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.18s ease;
}

.password-toggle svg {
  width: 18px;
  height: 18px;
}

.password-toggle:hover {
  color: var(--n-text);
}

.input-with-toggle {
  padding-right: 44px;
}

/* ═══════════════════════════════════════════════════════════════════
   Responsive
   ═══════════════════════════════════════════════════════════════════ */
@media (max-width: 900px) {
  .auth-container {
    grid-template-columns: 1fr;
    max-width: 460px;
  }

  .auth-branding {
    display: none;
  }

  .auth-form-section {
    padding: 48px 32px;
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: 32px 16px;
  }

  .auth-form-section {
    padding: 36px 24px;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   Dark mode — --n-* 토큰이 대부분 처리한다. 예외만 남긴다.
   ═══════════════════════════════════════════════════════════════════ */
[data-theme='dark'] .feature-check {
  background: rgba(250, 250, 249, 0.08);
}
</style>