/**
 * @파일명 mocks/stocks.js
 * @설명 주식 목업 데이터 및 메모리 상태
 * @기능
 *   - 국내/해외 목록 조회 (getKrStocks, getUsStocks)
 *   - 주요 지표 조회 (getMarketIndices)
 *   - 종목 상세/차트/뉴스 조회 (getStockDetail, getChartData, getStockNews)
 *   - 검색 (searchStocks)
 *   - 북마크 조회/추가/삭제 (getBookmarks, addBookmark, removeBookmark, isBookmarked)
 *   - 갱신 상태 조회 (getUpdateStatus)
 * @API엔드포인트
 *   - GET /api/stocks/kr/ , /us/ , /indices/ , /search/ , /bookmarks/
 *   - GET /api/stocks/:symbol/ , /:symbol/chart/ , /:symbol/news/
 * @비고
 *   marketIndices[].chart_data 는 객체 배열이 아니라 숫자 배열이다.
 *   차트·지표 시계열은 시드 고정 생성기로 만들어 새로고침해도 모양이 같다.
 */

import { paginate, clone } from './config'
import { buildCandleSeries, buildSparkline, MOCK_TODAY } from './utils/series'

// ========================================
// 국내 주식 (12종목)
// ========================================

/** @type {Array<Object>} 국내 주식 목록 (시가총액 순) */
const krStocks = [
  { code: '005930', name: '삼성전자', current_price: 87400, change_percent: 1.62, market_cap: 521_800_000_000_000 },
  { code: '000660', name: 'SK하이닉스', current_price: 241500, change_percent: 2.84, market_cap: 175_800_000_000_000 },
  { code: '373220', name: 'LG에너지솔루션', current_price: 398000, change_percent: -0.75, market_cap: 93_100_000_000_000 },
  { code: '207940', name: '삼성바이오로직스', current_price: 1043000, change_percent: 0.39, market_cap: 74_200_000_000_000 },
  { code: '005380', name: '현대차', current_price: 254500, change_percent: -1.17, market_cap: 53_300_000_000_000 },
  { code: '035420', name: 'NAVER', current_price: 214000, change_percent: 3.12, market_cap: 34_600_000_000_000 },
  { code: '000270', name: '기아', current_price: 118300, change_percent: -0.59, market_cap: 47_100_000_000_000 },
  { code: '068270', name: '셀트리온', current_price: 187600, change_percent: 1.08, market_cap: 40_800_000_000_000 },
  { code: '035720', name: '카카오', current_price: 46350, change_percent: -2.11, market_cap: 20_500_000_000_000 },
  { code: '051910', name: 'LG화학', current_price: 341500, change_percent: 0.74, market_cap: 24_100_000_000_000 },
  { code: '105560', name: 'KB금융', current_price: 92700, change_percent: 1.31, market_cap: 36_400_000_000_000 },
  { code: '055550', name: '신한지주', current_price: 61800, change_percent: 0.82, market_cap: 31_200_000_000_000 },
].map((stock, index) => ({
  ...stock,
  rank: index + 1,
  symbol: `${stock.code}.KS`,
  market: 'KR',
}))

// ========================================
// 해외 주식 (8종목)
// ========================================

/** @type {Array<Object>} 해외 주식 목록 (시가총액 순) */
const usStocks = [
  { symbol: 'NVDA', name: 'NVIDIA Corporation', current_price: 184.32, change_percent: 2.47, market_cap: 4_490_000_000_000, sector: 'Technology' },
  { symbol: 'AAPL', name: 'Apple Inc.', current_price: 241.85, change_percent: 0.68, market_cap: 3_670_000_000_000, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', current_price: 462.10, change_percent: -0.42, market_cap: 3_440_000_000_000, sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', current_price: 218.74, change_percent: 1.15, market_cap: 2_660_000_000_000, sector: 'Communication Services' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.', current_price: 231.06, change_percent: 0.93, market_cap: 2_450_000_000_000, sector: 'Consumer Cyclical' },
  { symbol: 'META', name: 'Meta Platforms, Inc.', current_price: 648.20, change_percent: -1.28, market_cap: 1_640_000_000_000, sector: 'Communication Services' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', current_price: 407.55, change_percent: 3.41, market_cap: 1_310_000_000_000, sector: 'Consumer Cyclical' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', current_price: 276.90, change_percent: 0.31, market_cap: 771_000_000_000, sector: 'Financial Services' },
].map((stock, index) => ({
  ...stock,
  rank: index + 1,
  code: stock.symbol,
  market: 'US',
}))

// ========================================
// 주요 지표 (8종)
// ========================================

/** 지표 기본값 — chart_data 는 숫자 배열이어야 한다 */
const indexSeeds = [
  { symbol: 'NASDAQ', name: '나스닥', current_price: 21847.32, change_percent: 0.87, decimals: 2, seed: 101 },
  { symbol: 'S&P500', name: 'S&P 500', current_price: 6412.85, change_percent: 0.54, decimals: 2, seed: 102 },
  { symbol: 'DOW', name: '다우존스', current_price: 46218.40, change_percent: -0.21, decimals: 2, seed: 103 },
  { symbol: 'KOSPI', name: '코스피', current_price: 3204.67, change_percent: 1.34, decimals: 2, seed: 104 },
  { symbol: 'KOSDAQ', name: '코스닥', current_price: 842.19, change_percent: 1.02, decimals: 2, seed: 105 },
  { symbol: 'USD/KRW', name: '원/달러', current_price: 1342.50, change_percent: -0.28, decimals: 2, seed: 106 },
  { symbol: 'GOLD', name: '금', current_price: 2814.60, change_percent: 0.62, decimals: 2, seed: 107 },
  { symbol: 'BTC', name: '비트코인', current_price: 98470.00, change_percent: 2.15, decimals: 2, seed: 108 },
]

/** @type {Array<Object>} 주요 지표 목록 */
const marketIndices = indexSeeds.map((item) => {
  const previous = item.current_price / (1 + item.change_percent / 100)

  return {
    symbol: item.symbol,
    name: item.name,
    current_price: item.current_price,
    change: Number((item.current_price - previous).toFixed(item.decimals)),
    change_percent: item.change_percent,
    // 숫자 배열 (객체 배열 아님)
    chart_data: buildSparkline({
      seed: item.seed,
      end: item.current_price,
      changePercent: item.change_percent,
      count: 20,
      decimals: item.decimals,
    }),
  }
})

// ========================================
// 종목 상세 (실물 2종목 + 나머지는 목록에서 합성)
// ========================================

/** @type {Object<string, Object>} 상세 정보가 준비된 종목 */
const detailOverrides = {
  '005930.KS': {
    currency: 'KRW',
    exchange: 'KSE',
    previous_close: 86000,
    open_price: 86300,
    day_high: 87900,
    day_low: 86100,
    volume: 14_382_910,
    avg_volume: 12_940_000,
    fifty_two_week_high: 92700,
    fifty_two_week_low: 51800,
    pe_ratio: 14.28,
    eps: 6120,
    dividend_yield: 1.67,
    beta: 1.04,
    sector: 'Technology',
    industry: 'Semiconductors',
    description:
      '삼성전자는 반도체, 디스플레이, 스마트폰, 가전을 아우르는 글로벌 종합 전자 기업입니다. DS 부문에서 메모리 반도체와 파운드리를, DX 부문에서 모바일과 생활가전 사업을 운영하고 있습니다.',
    website: 'https://www.samsung.com/sec/',
  },
  AAPL: {
    currency: 'USD',
    exchange: 'NASDAQ',
    previous_close: 240.21,
    open_price: 240.80,
    day_high: 242.94,
    day_low: 239.55,
    volume: 48_217_300,
    avg_volume: 52_140_000,
    fifty_two_week_high: 260.10,
    fifty_two_week_low: 169.21,
    pe_ratio: 36.42,
    eps: 6.64,
    dividend_yield: 0.42,
    beta: 1.21,
    sector: 'Technology',
    industry: 'Consumer Electronics',
    description:
      'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company also offers a range of services including the App Store, iCloud, Apple Music, and Apple Pay.',
    website: 'https://www.apple.com',
  },
}

// ========================================
// 북마크 (메모리 상태)
// ========================================

/** @type {Array<{symbol: string, bookmarked_at: string}>} 북마크 목록 */
let bookmarks = [
  { symbol: '005930.KS', bookmarked_at: '2026-09-10T11:20:00+09:00' },
  { symbol: 'NVDA', bookmarked_at: '2026-09-07T20:05:00+09:00' },
]

// ========================================
// 내부 헬퍼
// ========================================

/** 전체 종목을 하나의 배열로 */
const allStocks = () => [...krStocks, ...usStocks]

/** symbol 로 종목 찾기 */
const findStock = (symbol) =>
  allStocks().find(
    (stock) => stock.symbol.toUpperCase() === String(symbol).toUpperCase()
  ) || null

/** 문자열을 난수 시드로 변환 */
const seedFrom = (text) =>
  String(text)
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) * 977

// ========================================
// 목록 조회
// ========================================

/**
 * 국내 주식 목록 조회
 * @param {number} [page=1] - 페이지 번호
 * @param {number} [size=20] - 페이지 크기
 * @returns {Object} 페이지네이션이 적용된 목록 응답
 */
export const getKrStocks = (page = 1, size = 20) => {
  const { items, total_pages, current_page, total_count } = paginate(krStocks, page, size)

  return {
    market: 'KR',
    count: items.length,
    total_count,
    page: current_page,
    total_pages,
    stocks: clone(items),
    last_updated: `${MOCK_TODAY}T15:30:00+09:00`,
  }
}

/**
 * 해외 주식 목록 조회
 * @param {number} [page=1] - 페이지 번호
 * @param {number} [size=20] - 페이지 크기
 * @returns {Object} 페이지네이션이 적용된 목록 응답
 */
export const getUsStocks = (page = 1, size = 20) => {
  const { items, total_pages, current_page, total_count } = paginate(usStocks, page, size)

  return {
    market: 'US',
    count: items.length,
    total_count,
    page: current_page,
    total_pages,
    stocks: clone(items),
    last_updated: `${MOCK_TODAY}T06:00:00+09:00`,
  }
}

/**
 * 주요 지표 조회
 * @returns {{indices: Array<Object>}} 지표 목록
 */
export const getMarketIndices = () => ({ indices: clone(marketIndices) })

/**
 * 데이터 갱신 상태 조회
 * @returns {Object} 시장별 갱신 상태
 */
export const getUpdateStatus = () => ({
  KR: {
    last_updated: `${MOCK_TODAY}T15:30:00+09:00`,
    can_update: false,
    stock_count: krStocks.length,
  },
  US: {
    last_updated: `${MOCK_TODAY}T06:00:00+09:00`,
    can_update: false,
    stock_count: usStocks.length,
  },
})

// ========================================
// 종목 상세 / 차트 / 뉴스
// ========================================

/**
 * 종목 상세 조회
 * @description 상세 정보가 준비되지 않은 종목은 목록 데이터로 합성한다
 * @param {string} symbol - 종목 심볼
 * @returns {Object|null} 종목 상세. 없으면 null
 */
export const getStockDetail = (symbol) => {
  const stock = findStock(symbol)
  if (!stock) return null

  const override = detailOverrides[stock.symbol]
  const isKr = stock.market === 'KR'
  const decimals = isKr ? 0 : 2
  const round = (value) => Number(value.toFixed(decimals))

  // 상세 데이터가 없는 종목은 현재가와 등락률에서 역산한다
  const previousClose = override?.previous_close ?? round(stock.current_price / (1 + stock.change_percent / 100))

  return {
    symbol: stock.symbol,
    name: stock.name,
    currency: override?.currency ?? (isKr ? 'KRW' : 'USD'),
    exchange: override?.exchange ?? (isKr ? 'KSE' : 'NASDAQ'),
    market_cap: stock.market_cap,
    current_price: stock.current_price,
    previous_close: previousClose,
    open_price: override?.open_price ?? round(previousClose * 1.002),
    day_high: override?.day_high ?? round(Math.max(stock.current_price, previousClose) * 1.008),
    day_low: override?.day_low ?? round(Math.min(stock.current_price, previousClose) * 0.992),
    volume: override?.volume ?? 3_200_000 + (seedFrom(stock.symbol) % 9_000_000),
    avg_volume: override?.avg_volume ?? 4_100_000 + (seedFrom(stock.name) % 7_000_000),
    fifty_two_week_high: override?.fifty_two_week_high ?? round(stock.current_price * 1.24),
    fifty_two_week_low: override?.fifty_two_week_low ?? round(stock.current_price * 0.68),
    pe_ratio: override?.pe_ratio ?? Number((11 + (seedFrom(stock.symbol) % 2400) / 100).toFixed(2)),
    eps: override?.eps ?? round(stock.current_price / 16),
    dividend_yield: override?.dividend_yield ?? Number(((seedFrom(stock.name) % 280) / 100).toFixed(2)),
    beta: override?.beta ?? Number((0.7 + (seedFrom(stock.symbol) % 90) / 100).toFixed(2)),
    sector: override?.sector ?? stock.sector ?? '기타',
    industry: override?.industry ?? '기타',
    description:
      override?.description ??
      `${stock.name}의 기업 개요입니다. 포트폴리오 데모용 목업 데이터이며 실제 기업 정보가 아닙니다.`,
    website: override?.website ?? 'https://example.com',
    logo_url: null,
    change: round(stock.current_price - previousClose),
    change_percent: stock.change_percent,
  }
}

/** 기간별 캔들 개수 */
const PERIOD_POINTS = {
  '1d': 78,
  '5d': 130,
  '1mo': 22,
  '3mo': 65,
  '6mo': 130,
  '1y': 250,
}

/**
 * 차트 데이터 조회
 * @param {string} symbol - 종목 심볼
 * @param {string} [period='1mo'] - 조회 기간
 * @param {string} [interval='1d'] - 캔들 간격
 * @returns {Object|null} 차트 데이터. 없으면 null
 */
export const getChartData = (symbol, period = '1mo', interval = '1d') => {
  const stock = findStock(symbol)
  if (!stock) return null

  const count = PERIOD_POINTS[period] || 22
  const isKr = stock.market === 'KR'
  const decimals = isKr ? 0 : 2
  const factor = 10 ** decimals

  // 기간이 길수록 변동 폭도 커지도록 구간당 변동성을 조정한다
  const volatility = (isKr ? 0.018 : 0.024) * (count <= 30 ? 0.7 : 1)

  const raw = buildCandleSeries({
    seed: seedFrom(stock.symbol) + count,
    start: stock.current_price,
    drift: 0.0009,
    volatility,
    count,
    decimals,
  })

  // 생성된 마지막 종가가 현재가와 맞도록 전체를 비례 보정한다.
  // (시작값을 역산하는 방식은 난수 누적 탓에 끝부분이 급등·급락처럼 보인다)
  const scale = stock.current_price / raw[raw.length - 1].close
  const adjust = (value) => Math.round(value * scale * factor) / factor

  const data = raw.map((candle) => ({
    ...candle,
    open: adjust(candle.open),
    high: adjust(candle.high),
    low: adjust(candle.low),
    close: adjust(candle.close),
  }))

  // 반올림 오차를 없애고 마지막 종가를 현재가와 정확히 일치시킨다
  const lastCandle = data[data.length - 1]
  lastCandle.close = stock.current_price
  lastCandle.high = Math.max(lastCandle.high, stock.current_price)
  lastCandle.low = Math.min(lastCandle.low, stock.current_price)

  return { symbol: stock.symbol, period, interval, data }
}

/**
 * 종목 뉴스 조회
 * @param {string} symbol - 종목 심볼
 * @returns {{news: Array<Object>}} 뉴스 목록 (3건)
 */
export const getStockNews = (symbol) => {
  const stock = findStock(symbol)
  if (!stock) return { news: [] }

  const templates = [
    { title: `${stock.name}, 3분기 실적 시장 기대치 상회`, publisher: 'F!NK 마켓', date: '2026-09-14T08:30:00+09:00' },
    { title: `증권가 "${stock.name}, 목표주가 상향" 리포트 잇따라`, publisher: 'F!NK 리서치', date: '2026-09-12T14:10:00+09:00' },
    { title: `${stock.name} 주가 변동성 확대… 외국인 수급 주목`, publisher: 'F!NK 마켓', date: '2026-09-10T17:45:00+09:00' },
  ]

  return {
    news: templates.map((item, index) => ({
      title: item.title,
      link: `https://news.example.com/stocks/${stock.symbol.toLowerCase()}-${index + 1}`,
      publisher: item.publisher,
      published_date: item.date,
      thumbnail: null,
    })),
  }
}

// ========================================
// 검색
// ========================================

/**
 * 종목 검색
 * @param {string} query - 검색어 (종목명 또는 심볼)
 * @returns {{results: Array<Object>}} 검색 결과 (최대 10건)
 */
export const searchStocks = (query) => {
  const keyword = (query || '').trim().toLowerCase()
  if (!keyword) return { results: [] }

  const results = allStocks()
    .filter(
      (stock) =>
        stock.name.toLowerCase().includes(keyword) ||
        stock.symbol.toLowerCase().includes(keyword) ||
        stock.code.toLowerCase().includes(keyword)
    )
    .slice(0, 10)
    .map((stock) => ({
      symbol: stock.symbol,
      code: stock.code,
      name: stock.name,
      exchange: stock.market === 'KR' ? 'KSE' : 'NASDAQ',
      type: 'EQUITY',
      market: stock.market,
    }))

  return { results }
}

// ========================================
// 북마크
// ========================================

/**
 * 북마크 목록 조회
 * @returns {{count: number, stocks: Array<Object>}} 북마크한 종목 목록
 */
export const getBookmarks = () => {
  const stocks = bookmarks
    .map((bookmark) => {
      const stock = findStock(bookmark.symbol)
      if (!stock) return null

      return {
        symbol: stock.symbol,
        code: stock.code,
        name: stock.name,
        current_price: stock.current_price,
        change_percent: stock.change_percent,
        market: stock.market,
        bookmarked_at: bookmark.bookmarked_at,
      }
    })
    .filter(Boolean)

  return { count: stocks.length, stocks }
}

/**
 * 북마크 여부 확인
 * @param {string} symbol - 종목 심볼
 * @returns {boolean} 북마크 여부
 */
export const isBookmarked = (symbol) =>
  bookmarks.some((bookmark) => bookmark.symbol.toUpperCase() === String(symbol).toUpperCase())

/**
 * 북마크 추가
 * @param {string} symbol - 종목 심볼
 * @returns {boolean} 추가 성공 여부 (존재하지 않는 종목이면 false)
 */
export const addBookmark = (symbol) => {
  const stock = findStock(symbol)
  if (!stock) return false
  if (isBookmarked(stock.symbol)) return true

  bookmarks = [{ symbol: stock.symbol, bookmarked_at: new Date().toISOString() }, ...bookmarks]
  return true
}

/**
 * 북마크 삭제
 * @param {string} symbol - 종목 심볼
 * @returns {boolean} 항상 true
 */
export const removeBookmark = (symbol) => {
  bookmarks = bookmarks.filter(
    (bookmark) => bookmark.symbol.toUpperCase() !== String(symbol).toUpperCase()
  )
  return true
}

// ========================================
// 기업설명 번역
// ========================================

/** @type {Object<string, string>} 영문 기업설명의 한국어 번역 */
const translations = {
  [detailOverrides.AAPL.description]:
    'Apple Inc.는 전 세계에 스마트폰, 개인용 컴퓨터, 태블릿, 웨어러블 기기와 액세서리를 설계·제조·판매합니다. 또한 App Store, iCloud, Apple Music, Apple Pay를 비롯한 다양한 서비스를 제공하고 있습니다.',
}

/**
 * 기업설명 번역
 * @description 준비된 번역문이 없으면 원문을 그대로 돌려준다
 * @param {string} text - 번역할 원문
 * @returns {string|null} 번역문
 */
export const translateDescription = (text) => {
  if (!text) return null
  return translations[text] || text
}
