<template>
  <div class="chatbot-wrapper">
    <!-- 플로팅 버튼 -->
    <Transition name="bounce">
      <button
        v-if="!chatbotStore.isOpen"
        class="chatbot-fab-group"
        @click="openChatbot"
        title="AI 챗봇"
      >
        <span class="chatbot-fab">
          <img src="@/assets/chatbot-hand.webp" alt="" class="chatbot-fab-img" />
          <span class="fab-badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
        </span>
        <span class="chatbot-fab-label">챗봇 핑프</span>
      </button>
    </Transition>

    <!-- 채팅 창 -->
    <Transition name="slide-up">
      <div v-if="chatbotStore.isOpen" class="chatbot-window">
        <!-- 헤더 -->
        <div class="chatbot-header">
          <div class="header-info">
            <div class="bot-avatar">
              <img src="@/assets/chatbot-hand.webp" alt="" />
            </div>
            <div class="bot-info">
              <span class="bot-name">AI 핑프</span>
            </div>
          </div>
          <div class="header-actions">
            <button class="header-btn" @click="chatbotStore.clearMessages" title="대화 초기화">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </button>
            <button class="header-btn close-btn" @click="chatbotStore.closeChat" title="닫기">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 메시지 영역 -->
        <div class="chatbot-messages" ref="messagesContainer">
          <TransitionGroup name="message">
            <div 
              v-for="msg in chatbotStore.messages" 
              :key="msg.id"
              :class="['message', msg.type === 'user' ? 'message-user' : 'message-bot']"
            >
              <div class="message-content">
                <div class="message-bubble" v-html="formatMessage(msg.content)"></div>
                
                <!-- 추가 데이터 표시 (상품, 지도 링크 등) -->
                <div v-if="msg.data" class="message-extras">
                  <!-- 금융 상품 카드 -->
                  <template v-if="msg.data.type === 'product_search' && msg.data.products">
                    <div class="product-cards">
                      <div v-if="msg.data.products.best_saving" class="product-card">
                        <span class="product-type">적금 추천</span>
                        <span class="product-bank">{{ msg.data.products.best_saving.bank }}</span>
                        <span class="product-name">{{ msg.data.products.best_saving.name }}</span>
                        <span class="product-rate">최고 {{ msg.data.products.best_saving.max_rate }}%</span>
                      </div>
                      <div v-if="msg.data.products.best_deposit" class="product-card">
                        <span class="product-type">예금 추천</span>
                        <span class="product-bank">{{ msg.data.products.best_deposit.bank }}</span>
                        <span class="product-name">{{ msg.data.products.best_deposit.name }}</span>
                        <span class="product-rate">최고 {{ msg.data.products.best_deposit.max_rate }}%</span>
                      </div>
                    </div>
                    <router-link to="/products" class="action-btn" @click="chatbotStore.closeChat">
                      상품 더보기 →
                    </router-link>
                  </template>

                  <!-- 은행 위치 액션 -->
                  <template v-if="msg.data.type === 'bank_location'">
                    <!-- 지도 표시 -->
                    <div v-if="msg.data.show_map && msg.data.bank_info" class="bank-map-container">
                      <div class="bank-info-card">
                        <div class="bank-icon">🏦</div>
                        <div class="bank-details">
                          <span class="bank-name-label">{{ msg.data.bank_info.place_name }}</span>
                          <span class="bank-address">{{ msg.data.bank_info.road_address || msg.data.bank_info.address }}</span>
                          <span v-if="msg.data.bank_info.phone" class="bank-phone">📞 {{ msg.data.bank_info.phone }}</span>
                        </div>
                      </div>
                      <a 
                        :href="msg.data.bank_info.place_url || `https://map.kakao.com/link/map/${msg.data.bank_info.place_name},${msg.data.bank_info.lat},${msg.data.bank_info.lng}`" 
                        target="_blank" 
                        class="action-btn map-btn"
                      >
                        📍 카카오맵에서 보기
                      </a>
                    </div>
                    <!-- 위치 요청 버튼 -->
                    <button 
                      v-else-if="msg.data.need_location" 
                      class="action-btn location-btn"
                      @click="requestLocation(msg.data.bank_name)"
                    >
                      📍 내 위치로 가까운 지점 찾기
                    </button>
                    <!-- 기존 지도로 이동 링크 -->
                    <router-link 
                      v-else
                      :to="{ name: 'KakaoMapView', query: { bank: msg.data.bank_name } }" 
                      class="action-btn map-btn"
                      @click="chatbotStore.closeChat"
                    >
                      🗺️ 지도에서 찾기
                    </router-link>
                  </template>

                  <!-- 뉴스 카드 -->
                  <template v-if="(msg.data.type === 'news_search' || msg.data.type === 'investment_advice') && msg.data.news?.length">
                    <div class="news-cards">
                      <a 
                        v-for="(news, idx) in msg.data.news.slice(0, 3)" 
                        :key="idx"
                        :href="news.link"
                        target="_blank"
                        class="news-card"
                      >
                        <span class="news-title">{{ truncateText(news.title, 50) }}</span>
                        <span class="news-desc">{{ truncateText(news.description, 60) }}</span>
                      </a>
                    </div>
                  </template>

                  <!-- 투자 조언 유튜브 -->
                  <template v-if="msg.data.type === 'investment_advice' && msg.data.youtube_videos?.length">
                    <div class="youtube-cards">
                      <a 
                        v-for="video in msg.data.youtube_videos.slice(0, 2)" 
                        :key="video.video_id"
                        :href="video.url"
                        target="_blank"
                        class="youtube-card"
                      >
                        <img :src="video.thumbnail" :alt="video.title" class="youtube-thumb"/>
                        <span class="youtube-title">{{ truncateText(video.title, 40) }}</span>
                      </a>
                    </div>
                  </template>

                  <!-- 여행 유튜브 영상 -->
                  <template v-if="msg.data.type === 'travel_budget' && msg.data.youtube_videos?.length">
                    <div class="youtube-cards">
                      <a 
                        v-for="video in msg.data.youtube_videos.slice(0, 3)" 
                        :key="video.video_id"
                        :href="video.url"
                        target="_blank"
                        class="youtube-card"
                      >
                        <img :src="video.thumbnail" :alt="video.title" class="youtube-thumb"/>
                        <span class="youtube-title">{{ truncateText(video.title, 40) }}</span>
                      </a>
                    </div>
                    <router-link to="/analysis" class="action-btn" @click="chatbotStore.closeChat">
                      ✨ AI 분석으로 여행 계획 세우기
                    </router-link>
                  </template>

                  <!-- 종목 여론 분석 -->
                  <template v-if="msg.data.type === 'stock_sentiment'">
                    <div class="sentiment-analysis">
                      <div class="sentiment-header">
                        <span class="stock-name">{{ msg.data.stock_name }}</span>
                        <span 
                          class="recommendation-badge"
                          :class="{
                            'buy': msg.data.recommendation === '매수',
                            'sell': msg.data.recommendation === '매도',
                            'hold': msg.data.recommendation === '보유'
                          }"
                        >
                          {{ msg.data.recommendation }}
                        </span>
                      </div>
                      <div class="sentiment-stats">
                        <span class="stat-item">📊 분석 댓글: {{ msg.data.comments_count }}개</span>
                        <span class="stat-item">🎯 신뢰도: {{ msg.data.confidence }}%</span>
                      </div>
                      <div class="sentiment-summary">
                        <p>{{ msg.data.analysis }}</p>
                      </div>
                    </div>
                  </template>

                  <!-- 종목 여론 관련 뉴스 -->
                  <template v-if="msg.data.type === 'stock_sentiment' && msg.data.news?.length">
                    <div class="news-cards">
                      <a 
                        v-for="news in msg.data.news.slice(0, 3)" 
                        :key="news.link"
                        :href="news.link"
                        target="_blank"
                        class="news-card"
                      >
                        <span class="news-title">{{ truncateText(news.title, 50) }}</span>
                        <span class="news-desc">{{ truncateText(news.description, 60) }}</span>
                      </a>
                    </div>
                  </template>

                  <!-- 종목 여론 관련 유튜브 -->
                  <template v-if="msg.data.type === 'stock_sentiment' && msg.data.youtube_videos?.length">
                    <div class="youtube-cards">
                      <a 
                        v-for="video in msg.data.youtube_videos.slice(0, 3)" 
                        :key="video.video_id"
                        :href="video.url"
                        target="_blank"
                        class="youtube-card"
                      >
                        <img :src="video.thumbnail" :alt="video.title" class="youtube-thumb"/>
                        <span class="youtube-title">{{ truncateText(video.title, 40) }}</span>
                      </a>
                    </div>
                  </template>
                </div>

                <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
              </div>
            </div>
          </TransitionGroup>

          <!-- 로딩 표시 -->
          <div v-if="chatbotStore.isLoading" class="message message-bot">
            <div class="message-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 추천 질문 -->
        <div v-if="chatbotStore.messages.length <= 1 && chatbotStore.suggestions.length > 0" class="suggestions-area">
          <div class="suggestions-scroll">
            <button 
              v-for="(cat, idx) in chatbotStore.suggestions" 
              :key="idx"
              class="suggestion-chip"
              @click="sendSuggestion(cat.questions[0])"
            >
              {{ cat.questions[0] }}
            </button>
          </div>
        </div>

        <!-- 입력 영역 -->
        <div class="chatbot-input">
          <input 
            v-model="inputMessage"
            type="text"
            placeholder="메시지를 입력하세요..."
            @keyup.enter="sendMessage"
            :disabled="chatbotStore.isLoading"
          />
          <button 
            class="send-btn" 
            @click="sendMessage"
            :disabled="!inputMessage.trim() || chatbotStore.isLoading"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
/**
 * @컴포넌트 ChatBot.vue
 * @설명 AI 챗봇 플로팅 컴포넌트
 * 
 * @기능
 *   - 플로팅 버튼으로 챗봇 열기/닫기
 *   - 다양한 메시지 타입 렌더링 (텍스트, 상품 카드, 뉴스, 유튜브, 지도)
 *   - 의도별 응답 처리 (은행 위치, 상품 검색, 뉴스, 투자 조언, 여행 등)
 *   - 위치 기반 서비스 (은행 찾기)
 *   - 추천 질문 표시
 * 
 * @메시지타입
 *   - general_chat: 일반 대화
 *   - product_search: 금융 상품 검색 결과
 *   - bank_location: 은행 위치 (카카오맵 연동)
 *   - news_search: 뉴스 검색 결과
 *   - investment_advice: 투자 조언 (뉴스/유튜브 포함)
 *   - travel_budget: 여행 예산 정보
 *   - stock_sentiment: 종목 여론 분석
 * 
 * @스토어 useChatbotStore - 채팅 상태 및 메시지 관리
 */

import { ref, watch, nextTick, onMounted } from 'vue'
import { useChatbotStore } from '@/stores/chatbot'

const chatbotStore = useChatbotStore()
const inputMessage = ref('')
const messagesContainer = ref(null)
const unreadCount = ref(0)

/**
 * 챗봇 창 열기
 * - 인사말 초기화
 * - 추천 질문 로드
 * - 읽지 않은 메시지 카운트 초기화
 */
const openChatbot = () => {
  chatbotStore.openChat()
  chatbotStore.initGreeting()
  chatbotStore.fetchSuggestions()
  unreadCount.value = 0
}

/**
 * 메시지 전송
 * - 입력된 메시지를 스토어로 전달
 * - 입력창 초기화
 */
const sendMessage = () => {
  if (!inputMessage.value.trim()) return
  chatbotStore.sendMessage(inputMessage.value)
  inputMessage.value = ''
}

/**
 * 추천 질문 클릭 시 자동 전송
 * @param {string} question - 추천 질문 텍스트
 */
const sendSuggestion = (question) => {
  chatbotStore.sendMessage(question)
}

/**
 * 사용자 위치 요청 및 은행 검색
 * - Geolocation API 사용
 * - 위치 권한 거부 시 안내 메시지 표시
 * @param {string} bankName - 검색할 은행명
 */
const requestLocation = (bankName) => {
  if (!navigator.geolocation) {
    chatbotStore.addMessage({
      type: 'bot',
      content: '이 브라우저는 위치 서비스를 지원하지 않습니다. 😢',
    })
    return
  }

  chatbotStore.addMessage({
    type: 'bot',
    content: '📍 위치를 확인하고 있어요...',
  })

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords
      // 위치 정보와 함께 은행 검색 요청
      await chatbotStore.searchBankWithLocation(bankName, latitude, longitude)
    },
    (error) => {
      let errorMsg = '위치 정보를 가져올 수 없어요. 😢'
      if (error.code === error.PERMISSION_DENIED) {
        errorMsg = '위치 권한이 거부되었어요. 브라우저 설정에서 위치 권한을 허용해 주세요. 🔐'
      }
      chatbotStore.addMessage({
        type: 'bot',
        content: errorMsg,
      })
    },
    { enableHighAccuracy: true, timeout: 10000 }
  )
}

// 메시지 포맷팅 (줄바꿈 처리)
const formatMessage = (content) => {
  return content?.replace(/\n/g, '<br>') || ''
}

// 시간 포맷팅
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

// 텍스트 자르기
const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// 메시지 추가 시 스크롤
watch(() => chatbotStore.messages.length, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
})

onMounted(() => {
  chatbotStore.fetchSuggestions()
})
</script>

<style scoped>
.chatbot-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
}

/* 플로팅 버튼 그룹 — 아이콘 타일 + 라벨을 함께 감싸는 버튼 */
.chatbot-fab-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

/* 말풍선 모양 — 꼬리(오른쪽 아래 모서리)가 화면 구석을 가리킨다 */
.chatbot-fab {
  width: 104px;
  height: 104px;
  border-radius: 50% 50% 14px 50%;
  background: var(--n-chatbot-bg);
  border: 1px solid var(--n-border);
  display: flex;
  align-items: center;
  justify-content: center;
  /* 떠 있는 버튼이라 중성 그림자로 바닥에서 띄운다 */
  box-shadow: 0 12px 32px -12px rgba(28, 25, 23, 0.45);
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.chatbot-fab-img {
  width: 76px;
  height: 76px;
  object-fit: contain;
  transform-origin: 50% 90%;
  transition: transform 0.25s ease;
}

/* 호버 시 버튼이 살짝 뜨고 손이 인사하듯 기운다 */
.chatbot-fab-group:hover .chatbot-fab {
  transform: translateY(-3px);
  box-shadow: 0 16px 36px -12px rgba(28, 25, 23, 0.5);
}

.chatbot-fab-group:hover .chatbot-fab-img {
  transform: rotate(-14deg);
}

.chatbot-fab-group:focus-visible .chatbot-fab {
  outline: 2px solid var(--n-accent);
  outline-offset: 3px;
}

/* 라벨 — 배경·테두리 없이 텍스트만 */
.chatbot-fab-label {
  margin-top: 10px;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #4a4658;
  text-shadow: 0 2px 6px rgba(49, 32, 110, 0.22);
  white-space: nowrap;
}

.fab-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: var(--n-accent);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  min-width: 19px;
  height: 19px;
  padding: 0 5px;
  border-radius: var(--n-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--n-bg);
}

/* 채팅 창 */
.chatbot-window {
  width: 380px;
  height: 560px;
  background: var(--n-bg);
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-md);
  box-shadow: 0 24px 60px -24px rgba(28, 25, 23, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 헤더 */
.chatbot-header {
  padding: 14px 16px;
  background: var(--n-bg);
  border-bottom: 1px solid var(--n-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 플로팅 버튼과 같은 말풍선 모양으로 맞춘다 */
.bot-avatar {
  width: 40px;
  height: 40px;
  background: var(--n-chatbot-bg);
  border: 1px solid var(--n-border);
  border-radius: 50% 50% 6px 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bot-avatar img {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.bot-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.bot-name {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--n-text);
}

.bot-status {
  font-size: 11px;
  color: var(--n-text-muted);
  display: flex;
  align-items: center;
  gap: 5px;
}

.header-actions {
  display: flex;
  gap: 4px;
}

.header-btn {
  width: 30px;
  height: 30px;
  border-radius: var(--n-radius-sm);
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.18s ease, color 0.18s ease;
  color: var(--n-text-muted);
}

.header-btn:hover {
  background: var(--n-bg-sunken);
  color: var(--n-text);
}

.header-btn svg {
  width: 16px;
  height: 16px;
  color: currentColor;
}

/* 메시지 영역 */
.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  /* 아주 옅은 톤으로 채팅창과 카드가 구분되도록 */
  background: #eeeaf8;
}

.message {
  display: flex;
  max-width: 85%;
}

.message-user {
  align-self: flex-end;
}

.message-bot {
  align-self: flex-start;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: var(--n-radius-md);
  font-size: 16px;
  line-height: 1.55;
  word-break: break-word;
}

.message-user .message-bubble {
  background: var(--n-accent);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.message-bot .message-bubble {
  background: var(--n-bg);
  color: var(--n-text-body);
  box-shadow: 0 1px 2px rgba(28, 25, 23, 0.06);
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 10.5px;
  color: var(--n-text-muted);
  padding: 0 4px;
}

.message-user .message-time {
  text-align: right;
}

/* 추가 데이터 */
.message-extras {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-card {
  background: var(--n-bg);
  border: 1px solid var(--n-border);
  padding: 11px 12px;
  border-radius: var(--n-radius-md);
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.product-type {
  font-size: 10.5px;
  color: var(--n-text-muted);
  font-weight: 500;
}

.product-bank {
  font-size: 11.5px;
  color: var(--n-text-muted);
}

.product-name {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--n-text);
}

.product-rate {
  font-size: 14px;
  font-weight: 600;
  color: var(--n-accent);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 9px 14px;
  background: var(--n-accent);
  color: #fff;
  border: 1px solid var(--n-accent);
  border-radius: var(--n-radius-sm);
  font-size: 12.5px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.18s ease, border-color 0.18s ease;
}

.action-btn:hover {
  background: var(--n-accent-hover);
  border-color: var(--n-accent-hover);
}

/* 지도/위치 버튼도 같은 톤으로 (기존 초록·파랑 제거) */
.map-btn,
.location-btn {
  background: transparent;
  border-color: var(--n-border-strong);
  color: var(--n-text-body);
}

.map-btn:hover,
.location-btn:hover {
  background: var(--n-bg-sunken);
  border-color: var(--n-text-muted);
  color: var(--n-text);
}

/* 은행 정보 카드 */
.bank-map-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bank-info-card {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 12px;
  background: var(--n-bg);
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-md);
}

.bank-icon {
  font-size: 20px;
  line-height: 1.2;
}

.bank-details {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.bank-name-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--n-text);
}

.bank-address {
  font-size: 11.5px;
  color: var(--n-text-muted);
}

.bank-phone {
  font-size: 11.5px;
  color: var(--n-text-muted);
}

/* 뉴스 카드 */
.news-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.news-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  background: var(--n-bg);
  border: 1px solid var(--n-border);
  border-left: 2px solid var(--n-accent);
  border-radius: var(--n-radius-md);
  text-decoration: none;
  transition: background-color 0.18s ease, border-color 0.18s ease;
}

.news-card:hover {
  background: var(--n-bg-sunken);
  border-color: var(--n-border-strong);
  border-left-color: var(--n-accent);
}

.news-title {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--n-text);
  line-height: 1.35;
}

.news-desc {
  font-size: 11px;
  color: var(--n-text-muted);
  line-height: 1.35;
}

/* 유튜브 카드 */
.youtube-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.youtube-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background: var(--n-bg);
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-md);
  text-decoration: none;
  transition: background-color 0.18s ease, border-color 0.18s ease;
}

.youtube-card:hover {
  background: var(--n-bg-sunken);
  border-color: var(--n-border-strong);
}

.youtube-thumb {
  width: 58px;
  height: 43px;
  border-radius: var(--n-radius-sm);
  object-fit: cover;
}

.youtube-title {
  font-size: 11.5px;
  color: var(--n-text);
  line-height: 1.35;
}

/* 타이핑 인디케이터 */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 14px;
  background: var(--n-bg);
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-md);
  border-bottom-left-radius: 4px;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: var(--n-text-muted);
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: 0s; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

/* 추천 질문 */
.suggestions-area {
  padding: 10px 14px;
  background: var(--n-bg);
  border-top: 1px solid var(--n-border);
}

.suggestions-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.suggestions-scroll::-webkit-scrollbar {
  height: 4px;
}

.suggestions-scroll::-webkit-scrollbar-thumb {
  background: var(--n-border-strong);
  border-radius: 2px;
}

.suggestion-chip {
  flex-shrink: 0;
  padding: 7px 12px;
  background: transparent;
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-sm);
  font-size: 11.5px;
  color: var(--n-text-muted);
  cursor: pointer;
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
  white-space: nowrap;
}

.suggestion-chip:hover {
  background: var(--n-bg-sunken);
  border-color: var(--n-accent);
  color: var(--n-accent);
}

/* 입력 영역 */
.chatbot-input {
  padding: 12px 14px;
  background: var(--n-bg);
  border-top: 1px solid var(--n-border);
  display: flex;
  gap: 8px;
}

.chatbot-input input {
  flex: 1;
  padding: 10px 13px;
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-sm);
  font-size: 16px;
  background: var(--n-bg);
  color: var(--n-text);
  outline: none;
  transition: border-color 0.18s ease;
}

.chatbot-input input:focus {
  border-color: var(--n-accent);
}

.chatbot-input input::placeholder {
  color: var(--n-text-muted);
}

.send-btn {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: var(--n-radius-sm);
  border: 1px solid var(--n-accent);
  background: var(--n-accent);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.18s ease, border-color 0.18s ease;
}

.send-btn:hover:not(:disabled) {
  background: var(--n-accent-hover);
  border-color: var(--n-accent-hover);
}

.send-btn:disabled {
  background: var(--n-accent);
  border-color: var(--n-border);
  cursor: not-allowed;
}

.send-btn svg {
  width: 18px;
  height: 18px;
  color: #fff;
}

.send-btn:disabled svg {
  color: #e7e7e7;
}

/* 애니메이션 */
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}

@keyframes bounce-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.slide-up-enter-active {
  animation: slide-up 0.3s ease-out;
}

.slide-up-leave-active {
  animation: slide-up 0.2s ease-in reverse;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.message-enter-active {
  animation: message-in 0.3s ease-out;
}

@keyframes message-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 반응형 */
@media (max-width: 480px) {
  .chatbot-wrapper {
    bottom: 16px;
    right: 16px;
  }

  .chatbot-window {
    width: calc(100vw - 32px);
    height: calc(100vh - 100px);
    max-height: 600px;
  }
}

/* 다크 모드 — 챗봇 전체가 --n-* 토큰을 쓰고 이 토큰은 global.css 에서
   이미 뒤집히므로 별도 오버라이드가 필요 없다. */

/* 종목 여론 분석 스타일 */
.sentiment-analysis {
  background: var(--n-bg);
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-md);
  padding: 14px;
  margin-top: 12px;
}

.sentiment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.stock-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--n-text);
}

/* 매수/매도는 의미가 있는 색이라 구분은 유지하되 그라데이션은 걷어낸다 */
.recommendation-badge {
  padding: 4px 10px;
  border-radius: var(--n-radius-sm);
  font-size: 11.5px;
  font-weight: 600;
  border: 1px solid transparent;
}

.recommendation-badge.buy {
  background: var(--n-danger-bg);
  border-color: var(--n-danger-bg);
  color: var(--n-danger-text);
}

.recommendation-badge.sell {
  background: var(--n-info-bg);
  border-color: var(--n-info-bg);
  color: var(--n-info-text);
}

.recommendation-badge.hold {
  background: var(--n-bg-sunken);
  border-color: var(--n-border);
  color: var(--n-text-body);
}

.sentiment-stats {
  display: flex;
  gap: 14px;
  margin-bottom: 10px;
}

.stat-item {
  font-size: 11.5px;
  color: var(--n-text-muted);
}

.sentiment-summary {
  background: var(--n-bg);
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-sm);
  padding: 11px;
}

.sentiment-summary p {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--n-text-body);
}

[data-theme="dark"] .recommendation-badge.buy {
  background: rgba(185, 28, 28, 0.15);
  border-color: rgba(248, 113, 113, 0.3);
  color: var(--n-danger-bg);
}

[data-theme="dark"] .recommendation-badge.sell {
  background: rgba(29, 78, 216, 0.15);
  border-color: rgba(96, 165, 250, 0.3);
  color: #93c5fd;
}
</style>
