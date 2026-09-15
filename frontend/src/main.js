/**
 * @파일명 main.js
 * @설명 Vue 애플리케이션 진입점 (Entry Point)
 * @기능
 *   - Vue 앱 인스턴스 생성
 *   - Pinia 상태 관리 설정
 *   - Vue Router 설정
 *   - 전역 스타일 및 폰트 적용
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import { USE_MOCK } from './mocks/config'

// F!NK 디자인 시스템 - 전역 CSS
import './assets/styles/global.css'

// Pretendard 폰트 (한글 최적화 웹폰트)
import "pretendard/dist/web/variable/pretendardvariable.css"

// ========================================
// 목업 모드 — 낡은 persist 데이터 정리
// ========================================

/**
 * persist 스토어에 남아 있는 이전 데이터가 목업을 덮어쓰는 것을 막는다.
 * 스키마 버전이 바뀌면 캐시성 스토어만 비우고, 사용자 데이터는 보존한다.
 *   - 보존: account(로그인 상태), video/channel(유튜브 저장함), theme(테마)
 */
const MOCK_SCHEMA_VERSION = 'fink-mock-v1'

if (USE_MOCK && localStorage.getItem('__fink_schema') !== MOCK_SCHEMA_VERSION) {
  ;['products', 'stocks', 'metals', 'analysis', 'news'].forEach((key) => {
    localStorage.removeItem(key)
  })
  localStorage.setItem('__fink_schema', MOCK_SCHEMA_VERSION)
}

// ========================================
// 앱 초기화
// ========================================

// Vue 앱 인스턴스 생성
const app = createApp(App)

// Pinia 상태 관리 설정
const pinia = createPinia()

// Pinia persist 플러그인 적용 (새로고침 시에도 상태 유지)
pinia.use(piniaPluginPersistedstate)

// 플러그인 등록
app.use(pinia)   // Pinia 상태 관리
app.use(router)  // Vue Router

// DOM에 앱 마운트
app.mount('#app')
