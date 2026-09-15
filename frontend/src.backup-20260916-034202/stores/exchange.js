/**
 * @파일명 exchange.js
 * @설명 환율 정보 관리 스토어
 * @비고 README/포트폴리오 데모용으로 목업 데이터를 사용합니다 (mocks/exchange.js)
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { mockExchangeRates } from '../mocks/exchange'

export const useExchangeStore = defineStore('exchange', () => {
  /** @type {Ref<Array>} 환율 데이터 배열 */
  const rates = ref(mockExchangeRates)

  return {
    rates,
  }
})
