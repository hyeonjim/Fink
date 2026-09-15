<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Left Side - Branding -->
      <div class="auth-branding">
        <div class="branding-content">
          <div class="branding-logo">F!NK</div>
          <h1 class="branding-title">
            스마트한 금융,<br>
            지금 시작하세요
          </h1>
          <p class="branding-description">
            회원가입 후 AI 맞춤 추천을 받고<br>
            나에게 딱 맞는 금융상품을 찾아보세요.
          </p>
          
          <div class="branding-features">
            <div class="feature-item">
              <div class="feature-check">✓</div>
              <span>무료 가입, 무료 이용</span>
            </div>
            <div class="feature-item">
              <div class="feature-check">✓</div>
              <span>1분 만에 가입 완료</span>
            </div>
            <div class="feature-item">
              <div class="feature-check">✓</div>
              <span>개인정보 안전 보호</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Form -->
      <div class="auth-form-section">
        <div class="auth-form-container">
          <div class="auth-header">
            <h2 class="auth-title">회원가입</h2>
            <p class="auth-subtitle">F!NK 멤버가 되어 모든 혜택을 누리세요</p>
          </div>

          <form @submit.prevent="signUp" class="auth-form">
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
              <label class="input-label" for="nickname">닉네임</label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                <input 
                  type="text" 
                  id="nickname" 
                  v-model.trim="nickname"
                  class="input input-with-icon"
                  placeholder="사용할 닉네임을 입력하세요"
                  required
                />
              </div>
            </div>
            
            <div class="input-group">
              <label class="input-label" for="password1">비밀번호</label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>

                <input
                  :type="password1Visible ? 'text' : 'password'"
                  id="password1"
                  v-model.trim="password1"
                  class="input input-with-icon input-with-toggle"
                  placeholder="비밀번호를 입력하세요"
                  required
                />

                <!-- 👁️ -->
                <button
                  type="button"
                  class="password-toggle"
                  @click="password1Visible = !password1Visible"
                  aria-label="비밀번호 보기"
                >
                  <svg v-if="!password1Visible" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7"/>
                    <path d="M1 1l22 22"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="input-group">
              <label class="input-label" for="password2">비밀번호 확인</label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>

                <input
                  :type="password2Visible ? 'text' : 'password'"
                  id="password2"
                  v-model.trim="password2"
                  class="input input-with-icon input-with-toggle"
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />

                <!-- 👁️ -->
                <button
                  type="button"
                  class="password-toggle"
                  @click="password2Visible = !password2Visible"
                  aria-label="비밀번호 보기"
                >
                  <svg v-if="!password2Visible" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7"/>
                    <path d="M1 1l22 22"/>
                  </svg>
                </button>
              </div>
            </div>


            <button type="submit" class="btn btn-primary btn-lg btn-block">
              가입하기
            </button>
          </form>

          <div class="auth-divider">
            <span>또는</span>
          </div>

          <div class="auth-footer">
            <p>이미 계정이 있으신가요?</p>
            <RouterLink :to="{ name: 'LogInView' }" class="auth-link">
              로그인 하기 <span class="arrow">→</span>
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
const nickname = ref('')
const password1 = ref('')
const password2 = ref('')

const password1Visible = ref(false)
const password2Visible = ref(false)

const accountStore = useAccountStore()

const signUp = function () {
  const payload = {
    username: username.value,
    nickname: nickname.value,
    password1: password1.value,
    password2: password2.value,
  }
  accountStore.signUp(payload)
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
  border-radius: 14px;
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
  border-radius: 6px;
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

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--n-text-muted);
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--n-text-muted);
  pointer-events: none;
}

input.input-with-icon,
.input.input-with-icon {
  padding-left: 42px;
}

.input {
  width: 100%;
  padding: 12px 14px;
  font-size: 0.9375rem;
  color: var(--n-text);
  background: var(--n-bg);
  border: 1px solid var(--n-border);
  border-radius: 8px;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
  outline: none;
}

.input:hover:not(:focus) {
  border-color: var(--n-border-strong);
}

.input:focus {
  border-color: var(--n-accent);
  box-shadow: 0 0 0 3px var(--n-accent-wash);
}

.input::placeholder {
  color: var(--n-text-muted);
}

/* 전역 .btn-primary 가 그라데이션이라 이 화면에서만 무채색으로 덮는다 */
.auth-form :deep(.btn-primary) {
  height: 46px;
  padding: 0 20px;
  border-radius: 8px;
  background: var(--n-accent);
  background-image: none;
  border: 1px solid var(--n-accent);
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 500;
  box-shadow: none;
  transition: background-color 0.18s ease, border-color 0.18s ease;
}

.auth-form :deep(.btn-primary:hover) {
  background: var(--n-accent-hover);
  border-color: var(--n-accent-hover);
  transform: none;
  box-shadow: none;
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