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

<style scoped src="../assets/styles/auth.scoped.css"></style>