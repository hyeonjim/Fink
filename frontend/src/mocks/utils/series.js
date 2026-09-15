/**
 * @파일명 mocks/utils/series.js
 * @설명 목업용 시계열 생성기
 * @기능
 *   - 시드 고정 난수 (createRandom)
 *   - 일별 가격 시계열 생성 (buildPriceSeries)
 *   - OHLCV 캔들 시계열 생성 (buildCandleSeries)
 *   - 미니차트용 종가 배열 생성 (buildSparkline)
 * @비고
 *   난수 시드를 고정했기 때문에 새로고침해도 차트 모양이 동일하다.
 *   금/은 시세, 주식 차트, 주요 지표 미니차트가 모두 이 파일을 공유한다.
 */

// ========================================
// 기준 시각
// ========================================

/** @type {string} 목업 데이터의 기준일. 모든 시계열이 이 날짜에서 역산된다 */
export const MOCK_TODAY = '2026-09-15'

// ========================================
// 시드 고정 난수
// ========================================

/**
 * 선형 합동 생성기(LCG) 기반 난수 함수 생성
 * @description Math.random 과 달리 시드가 같으면 항상 같은 수열을 낸다
 * @param {number} seed - 시드 값
 * @returns {() => number} 0 이상 1 미만의 난수를 반환하는 함수
 */
export const createRandom = (seed) => {
  let state = seed % 4294967296
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

/**
 * 영업일(월~금) 날짜 배열 생성
 * @param {number} count - 필요한 영업일 수
 * @param {string} [endDate=MOCK_TODAY] - 마지막 날짜 (YYYY-MM-DD)
 * @returns {Array<Date>} 과거 → 현재 순서의 Date 배열
 */
const buildBusinessDays = (count, endDate = MOCK_TODAY) => {
  const days = []
  const cursor = new Date(`${endDate}T00:00:00`)

  while (days.length < count) {
    const day = cursor.getDay()
    // 주말 제외
    if (day !== 0 && day !== 6) {
      days.unshift(new Date(cursor))
    }
    cursor.setDate(cursor.getDate() - 1)
  }

  return days
}

/** 날짜를 YYYY-MM-DD 로 포맷 */
const toDateString = (date) => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

// ========================================
// 시계열 생성
// ========================================

/**
 * 일별 가격 시계열 생성 (금/은 시세용)
 * @param {Object} config - 생성 옵션
 * @param {number} config.seed - 난수 시드
 * @param {number} config.start - 시작 가격
 * @param {number} config.drift - 일간 평균 상승률 (예: 0.0004)
 * @param {number} config.volatility - 일간 변동폭 (예: 0.012)
 * @param {number} config.count - 생성할 영업일 수
 * @param {number} [config.decimals=2] - 반올림 자릿수
 * @returns {Array<{date: string, price: number}>} 과거 → 현재 순서의 시계열
 */
export const buildPriceSeries = ({ seed, start, drift, volatility, count, decimals = 2 }) => {
  const random = createRandom(seed)
  const days = buildBusinessDays(count)
  const factor = 10 ** decimals

  let price = start

  return days.map((date) => {
    price = price * (1 + drift + (random() - 0.5) * volatility)
    return {
      date: toDateString(date),
      price: Math.round(price * factor) / factor,
    }
  })
}

/**
 * OHLCV 캔들 시계열 생성 (주식 차트용)
 * @param {Object} config - 생성 옵션
 * @param {number} config.seed - 난수 시드
 * @param {number} config.start - 시작 가격
 * @param {number} config.drift - 구간별 평균 상승률
 * @param {number} config.volatility - 구간별 변동폭
 * @param {number} config.count - 생성할 캔들 수
 * @param {number} [config.decimals=0] - 가격 반올림 자릿수 (국내 주식은 0, 해외는 2)
 * @returns {Array<{date: string, open: number, high: number, low: number, close: number, volume: number}>}
 */
export const buildCandleSeries = ({ seed, start, drift, volatility, count, decimals = 0 }) => {
  const random = createRandom(seed)
  const days = buildBusinessDays(count)
  const factor = 10 ** decimals
  const round = (value) => Math.round(value * factor) / factor

  let close = start

  return days.map((date) => {
    const open = close
    close = open * (1 + drift + (random() - 0.5) * volatility)

    const high = Math.max(open, close) * (1 + random() * volatility * 0.4)
    const low = Math.min(open, close) * (1 - random() * volatility * 0.4)

    return {
      date: new Date(`${toDateString(date)}T09:00:00`).toISOString(),
      open: round(open),
      high: round(high),
      low: round(low),
      close: round(close),
      volume: Math.round(1_000_000 + random() * 9_000_000),
    }
  })
}

/**
 * 미니차트용 종가 배열 생성 (주요 지표 카드용)
 * @description marketIndices[].chart_data 는 객체 배열이 아니라 숫자 배열이다
 * @param {Object} config - 생성 옵션
 * @param {number} config.seed - 난수 시드
 * @param {number} config.end - 마지막(현재) 값
 * @param {number} config.changePercent - 구간 전체 등락률 (%)
 * @param {number} [config.count=20] - 포인트 수
 * @param {number} [config.decimals=2] - 반올림 자릿수
 * @returns {Array<number>} 종가 배열
 */
export const buildSparkline = ({ seed, end, changePercent, count = 20, decimals = 2 }) => {
  const random = createRandom(seed)
  const factor = 10 ** decimals

  // 마지막 값이 end 가 되도록 시작값을 역산한다
  const start = end / (1 + changePercent / 100)
  const step = (end - start) / (count - 1)
  const noise = Math.abs(end - start) * 0.35 || end * 0.004

  return Array.from({ length: count }, (_, index) => {
    // 마지막 포인트는 현재가와 정확히 일치시킨다
    if (index === count - 1) return Math.round(end * factor) / factor

    const value = start + step * index + (random() - 0.5) * noise
    return Math.round(value * factor) / factor
  })
}
