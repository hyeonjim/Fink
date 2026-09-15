/**
 * @파일명 chatbot.js
 * @설명 AI 챗봇 (핑프) 스토어
 * @기능
 *   - 챗봇 UI 토글/열기/닫기
 *   - 메시지 전송 및 관리
 *   - 추천 질문 로드
 *   - 위치 기반 은행 검색
 * @API엔드포인트
 *   - GET /api/chatbot/suggestions/ : 추천 질문 목록
 *   - POST /api/chatbot/ : 챗봇 메시지 전송
 *   - POST /api/chatbot/bank-search/ : 위치 기반 은행 검색
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { USE_MOCK, delay } from '@/mocks/config'
import * as mockChatbot from '@/mocks/chatbot'

export const useChatbotStore = defineStore('chatbot', () => {
  // ========================================
  // 상태 (State)
  // ========================================
  
  /** @type {string} 백엔드 API 기본 URL */
  const API_URL = 'http://127.0.0.1:8000'
  
  /** @type {Ref<boolean>} 챗봇 창 열림 상태 */
  const isOpen = ref(false)
  
  /** @type {Ref<Array>} 채팅 메시지 목록 */
  const messages = ref([])
  
  /** @type {Ref<boolean>} AI 응답 대기 중 상태 */
  const isLoading = ref(false)
  
  /** @type {Ref<Array>} 추천 질문 목록 */
  const suggestions = ref([])
  
  // ========================================
  // 액션 (Actions) - UI 제어
  // ========================================
  
  /**
   * 챗봇 창 토글
   * @description 챗봇 창 열림/닫힘 상태를 전환합니다
   */
  const toggleChat = () => {
    isOpen.value = !isOpen.value
  }
  
  /**
   * 챗봇 창 열기
   */
  const openChat = () => {
    isOpen.value = true
  }
  
  /**
   * 챗봇 창 닫기
   */
  const closeChat = () => {
    isOpen.value = false
  }
  
  // ========================================
  // 액션 (Actions) - API 통신
  // ========================================
  
  /**
   * 추천 질문 가져오기
   * @description 챗봇에서 보여줄 추천 질문 목록을 로드합니다
   */
  const fetchSuggestions = async () => {
    try {
      // === 목업 모드 분기 ===
      if (USE_MOCK) {
        suggestions.value = mockChatbot.getSuggestions().suggestions
        return
      }

      // === 실제 API 호출 (백엔드 연결 시) ===
      const response = await axios.get(`${API_URL}/api/chatbot/suggestions/`)
      suggestions.value = response.data.suggestions
    } catch (error) {
      console.error('추천 질문 로드 실패:', error)
    }
  }
  
  /**
   * 메시지 전송
   * @description 사용자 메시지를 전송하고 AI 응답을 받습니다
   * @param {string} message - 사용자 입력 메시지
   * @param {Object|null} location - 위치 정보 (선택)
   */
  const sendMessage = async (message, location = null) => {
    if (!message.trim() || isLoading.value) return
    
    // 사용자 메시지 추가
    messages.value.push({
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    })
    
    isLoading.value = true
    
    try {
      // === 목업 모드 분기 ===
      // AI 가 생각하는 시간을 흉내 내려고 지연을 조금 길게 준다
      if (USE_MOCK) {
        const data = await delay(mockChatbot.getReply(message), 700)

        messages.value.push({
          id: Date.now() + 1,
          type: 'bot',
          content: data.message,
          data,
          intent: data.intent,
          timestamp: new Date()
        })
        return
      }

      // === 실제 API 호출 (백엔드 연결 시) ===
      const requestData = { message: message }

      // 위치 정보가 있으면 추가
      if (location) {
        requestData.location = location
      }

      const response = await axios.post(`${API_URL}/api/chatbot/`, requestData)
      
      // AI 응답 추가
      messages.value.push({
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.message,
        data: response.data,
        intent: response.data.intent,
        timestamp: new Date()
      })
      
    } catch (error) {
      console.error('챗봇 오류:', error)
      messages.value.push({
        id: Date.now() + 1,
        type: 'bot',
        content: '죄송합니다. 일시적인 오류가 발생했어요. 다시 시도해 주세요. 🙏',
        error: true,
        timestamp: new Date()
      })
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * 위치 정보로 은행 검색
   * @description 현재 위치 근처의 특정 은행을 검색합니다
   * @param {string} bankName - 은행명
   * @param {number} lat - 위도
   * @param {number} lng - 경도
   */
  const searchBankWithLocation = async (bankName, lat, lng) => {
    // 위치 확인 메시지 삭제 (마지막 메시지)
    if (messages.value.length > 0 && messages.value[messages.value.length - 1].content.includes('위치를 확인')) {
      messages.value.pop()
    }
    
    isLoading.value = true
    
    try {
      // === 목업 모드 분기 ===
      if (USE_MOCK) {
        const data = await delay(mockChatbot.searchBankWithLocation(bankName), 500)

        messages.value.push({
          id: Date.now() + 1,
          type: 'bot',
          content: data.message,
          data,
          timestamp: new Date()
        })
        return
      }

      // === 실제 API 호출 (백엔드 연결 시) ===
      const response = await axios.post(`${API_URL}/api/chatbot/bank-search/`, {
        bank_name: bankName,
        lat: lat,
        lng: lng
      })
      
      messages.value.push({
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.message,
        data: response.data,
        timestamp: new Date()
      })
      
    } catch (error) {
      console.error('은행 검색 오류:', error)
      messages.value.push({
        id: Date.now() + 1,
        type: 'bot',
        content: '은행 검색 중 오류가 발생했어요. 다시 시도해 주세요. 🙏',
        error: true,
        timestamp: new Date()
      })
    } finally {
      isLoading.value = false
    }
  }
  
  // ========================================
  // 액션 (Actions) - 메시지 관리
  // ========================================
  
  /**
   * 채팅 내역 초기화
   * @description 모든 채팅 메시지를 삭제합니다
   */
  const clearMessages = () => {
    messages.value = []
  }
  
  /**
   * 메시지 직접 추가
   * @description 시스템 메시지 등을 직접 추가할 때 사용합니다
   * @param {Object} msg - 메시지 객체
   */
  const addMessage = (msg) => {
    messages.value.push({
      id: Date.now() + Math.random(),
      type: msg.type,
      content: msg.content,
      data: msg.data || null,
      timestamp: new Date()
    })
  }
  
  /**
   * 초기 인사 메시지 표시
   * @description 첫 방문 시 환영 메시지를 표시합니다
   */
  const initGreeting = () => {
    if (messages.value.length === 0) {
      messages.value.push({
        id: Date.now(),
        type: 'bot',
        content: '안녕하세요! 👋 저는 핑프, F!NK AI 챗봇이에요.\n\n무엇이든 물어보세요!\n• 금융 상품 추천\n• 가까운 은행 찾기\n• 뉴스 검색\n• 투자 조언\n• 여행 예산 상담',
        timestamp: new Date()
      })
    }
  }

  // ========================================
  // 반환 (Export)
  // ========================================
  return {
    // 상태
    isOpen,
    messages,
    isLoading,
    suggestions,
    // UI 제어
    toggleChat,
    openChat,
    closeChat,
    // API 통신
    fetchSuggestions,
    sendMessage,
    searchBankWithLocation,
    // 메시지 관리
    clearMessages,
    addMessage,
    initGreeting
  }
})
