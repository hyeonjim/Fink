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

<style scoped src="../assets/styles/auth.scoped.css"></style>