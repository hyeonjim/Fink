/**
 * @파일명 mocks/metals.js
 * @설명 금/은 현물 시세 목업 데이터
 * @기능
 *   - 기간별 시세 조회 (getMetalPrices)
 * @API엔드포인트
 *   - GET /api/metals/?metal=gold|silver&start=&end= : 시세 배열
 * @비고
 *   응답은 페이지네이션 없이 [{ date, price }] 배열이다.
 *   시계열은 시드 고정 생성기로 만들어 새로고침해도 차트 모양이 같다.
 */

import { buildPriceSeries } from './utils/series'

// ========================================
// 시계열 (약 6개월치 영업일)
// ========================================

/** @type {number} 생성할 영업일 수 */
const POINT_COUNT = 120

/** @type {Array<{date: string, price: number}>} 금 시세 (원/g) */
const goldSeries = buildPriceSeries({
  seed: 20260915,
  start: 118400,
  drift: 0.0009,
  volatility: 0.012,
  count: POINT_COUNT,
  decimals: 0,
})

/** @type {Array<{date: string, price: number}>} 은 시세 (원/g) */
const silverSeries = buildPriceSeries({
  seed: 47110815,
  start: 1420,
  drift: 0.0011,
  volatility: 0.022,
  count: POINT_COUNT,
  decimals: 1,
})

// ========================================
// 조회
// ========================================

/**
 * 금속 시세 조회
 * @param {'gold'|'silver'} [metal='gold'] - 금속 종류
 * @param {string|null} [start=null] - 시작일 (YYYY-MM-DD)
 * @param {string|null} [end=null] - 종료일 (YYYY-MM-DD)
 * @returns {Array<{date: string, price: number}>} 기간에 해당하는 시세 배열
 */
export const getMetalPrices = (metal = 'gold', start = null, end = null) => {
  const series = metal === 'silver' ? silverSeries : goldSeries

  return series
    .filter((item) => {
      if (start && item.date < start) return false
      if (end && item.date > end) return false
      return true
    })
    .map((item) => ({ ...item }))
}
