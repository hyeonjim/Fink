/**
 * @파일명 mocks/chatbot.js
 * @설명 AI 챗봇(핑프) 목업 응답
 * @기능
 *   - 추천 질문 조회 (getSuggestions)
 *   - 메시지 응답 생성 (getReply)
 *   - 위치 기반 은행 검색 (searchBankWithLocation)
 * @API엔드포인트
 *   - GET  /api/chatbot/suggestions/ : 추천 질문
 *   - POST /api/chatbot/ : 대화
 *   - POST /api/chatbot/bank-search/ : 위치 기반 은행 검색
 * @비고
 *   실제로는 GPT 가 의도를 분류하지만, 목업은 키워드 매칭으로 intent 를 고른다.
 *   응답 형태(type 별 필드)는 백엔드와 동일하게 맞춰야 화면이 제대로 렌더된다.
 */

import { mockDeposits, mockSavings } from './products'
import { MOCK_VIDEOS } from './youtube'
import { findNearestBank } from './kakaomap'

// ========================================
// 추천 질문
// ========================================

/** @type {Array<{category: string, questions: Array<string>}>} 추천 질문 목록 */
const suggestions = [
  {
    category: '금융상품',
    questions: ['금리 높은 적금 추천해줘', '예금이랑 적금 뭐가 나아?', '청년 적금 알려줘'],
  },
  {
    category: '은행찾기',
    questions: ['가까운 국민은행 어디야?', '신한은행 지점 찾아줘', '근처 하나은행 알려줘'],
  },
  {
    category: '금융뉴스',
    questions: ['오늘 금리 뉴스 알려줘', '예금 관련 뉴스 보여줘', '요즘 환율 어때?'],
  },
  {
    category: '투자조언',
    questions: ['목돈 모으는 방법 알려줘', '주식 처음인데 뭐부터 해?', '금 투자 어떻게 생각해?'],
  },
]

/**
 * 추천 질문 조회
 * @returns {{suggestions: Array<Object>}} 추천 질문 목록
 */
export const getSuggestions = () => ({ suggestions })

// ========================================
// 응답 조각
// ========================================

/** 상품 목록에서 최고금리 기준 요약 형태로 변환 */
const toProductSummary = (product) => {
  const best = product.options.reduce((acc, option) =>
    Number(option.intr_rate2) > Number(acc.intr_rate2) ? option : acc
  )

  return {
    bank: product.kor_co_nm,
    name: product.fin_prdt_nm,
    term: best.save_trm,
    max_rate: best.intr_rate2,
    base_rate: best.intr_rate,
    fin_prdt_cd: product.fin_prdt_cd,
  }
}

/** 최고금리 순으로 정렬된 요약 목록 */
const rankByRate = (products) =>
  products.map(toProductSummary).sort((a, b) => b.max_rate - a.max_rate)

/** 챗봇 응답용 뉴스 (분석 결과와 별개로 관리) */
const chatNews = [
  {
    title: '한국은행, 기준금리 연 2.75% 동결… "물가 흐름 지켜볼 것"',
    link: 'https://news.example.com/finance/20260915-base-rate',
    description: '금통위가 기준금리를 현 수준으로 유지하기로 했다.',
  },
  {
    title: '시중은행 예금금리 다시 3%대… 막차 수요 몰린다',
    link: 'https://news.example.com/finance/20260914-deposit-rate',
    description: '주요 시중은행의 1년 만기 정기예금 금리가 연 3%대를 회복했다.',
  },
  {
    title: '청년 대상 우대금리 적금 잇따라 출시… 최고 연 4.7%',
    link: 'https://news.example.com/finance/20260913-youth-saving',
    description: '만 34세 이하 청년 대상 고금리 적금 상품이 잇따라 출시되고 있다.',
  },
]

/** 챗봇 응답용 유튜브 영상 (MOCK_VIDEOS 를 챗봇 응답 형태로 변환) */
const toChatVideo = (video) => ({
  video_id: video.videoId,
  title: video.title,
  thumbnail: video.thumbnail,
  channel: video.channelTitle,
  url: `https://www.youtube.com/watch?v=${video.videoId}`,
})

/** 은행 정보 응답 형태로 변환 */
const toBankInfo = (place) => ({
  found: true,
  place_name: place.place_name,
  address: place.address_name,
  road_address: place.road_address_name,
  phone: place.phone,
  distance: place.distance,
  lat: Number(place.y),
  lng: Number(place.x),
  place_url: place.place_url,
  all_results: [],
})

// ========================================
// 의도 분류
// ========================================

/** @type {Array<{intent: string, keywords: Array<string>}>} 키워드 기반 의도 규칙 */
const intentRules = [
  { intent: 'bank_location', keywords: ['은행 어디', '지점', '가까운', '근처', '찾아줘', '위치'] },
  { intent: 'news_search', keywords: ['뉴스', '기사', '소식', '환율', '기준금리'] },
  { intent: 'product_search', keywords: ['적금', '예금', '상품', '금리', '추천'] },
  { intent: 'investment_advice', keywords: ['투자', '주식', '목돈', '모으', '자산', '금 투자'] },
]

/** 메시지에서 은행명 추출 */
const extractBankName = (message) => {
  const banks = [
    '국민은행', '신한은행', '우리은행', '하나은행', '농협은행',
    '기업은행', '부산은행', '카카오뱅크', '케이뱅크', '토스뱅크',
  ]

  // '국민' 처럼 줄여 말해도 잡는다
  return (
    banks.find((bank) => message.includes(bank)) ||
    banks.find((bank) => message.includes(bank.replace('은행', ''))) ||
    null
  )
}

/**
 * 의도 분류
 * @param {string} message - 사용자 메시지
 * @returns {string} intent 이름
 */
const classify = (message) => {
  const found = intentRules.find((rule) =>
    rule.keywords.some((keyword) => message.includes(keyword))
  )

  return found ? found.intent : 'fallback'
}

// ========================================
// 응답 생성
// ========================================

/**
 * 챗봇 응답 생성
 * @param {string} message - 사용자 메시지
 * @returns {Object} 화면이 렌더할 수 있는 응답 객체
 */
export const getReply = (message) => {
  const text = (message || '').trim()
  const intent = classify(text)

  // ── 은행 찾기 ──────────────────────────────────────────────
  if (intent === 'bank_location') {
    const bankName = extractBankName(text) || '국민은행'
    const place = findNearestBank(bankName)

    if (!place) {
      return {
        type: 'bank_location',
        intent,
        bank_name: bankName,
        message: `${bankName} 지점을 찾지 못했어요. 은행찾기 메뉴에서 지역을 선택해 검색해보세요.`,
        found: false,
      }
    }

    return {
      type: 'bank_location',
      intent,
      bank_name: bankName,
      message: `가장 가까운 ${bankName} 지점을 찾았어요.`,
      bank_info: toBankInfo(place),
      show_map: true,
      map_center: { lat: Number(place.y), lng: Number(place.x) },
    }
  }

  // ── 뉴스 검색 ──────────────────────────────────────────────
  if (intent === 'news_search') {
    return {
      type: 'news_search',
      intent,
      message: '최근 금융 뉴스를 모아왔어요.',
      news: chatNews,
    }
  }

  // ── 상품 추천 ──────────────────────────────────────────────
  if (intent === 'product_search') {
    const savings = rankByRate(mockSavings)
    const deposits = rankByRate(mockDeposits)

    return {
      type: 'product_search',
      intent,
      message:
        '조건 없이 받을 수 있는 금리 기준으로 정리했어요. 우대조건을 채울 수 있다면 최고금리 상품이 더 유리합니다.',
      products: {
        best_saving: savings[0],
        best_deposit: deposits[0],
        savings: savings.slice(0, 3),
        deposits: deposits.slice(0, 3),
      },
      action: { type: 'view_products', link: '/products' },
    }
  }

  // ── 투자 조언 ──────────────────────────────────────────────
  if (intent === 'investment_advice') {
    return {
      type: 'investment_advice',
      intent,
      message:
        '목돈을 모으실 때는 이미 갖고 계신 돈과 매달 새로 생기는 돈을 나눠서 보시는 게 좋습니다. 보유한 목돈은 예금에, 매달 들어오는 돈은 적금에 넣으면 같은 금리라도 이자가 더 붙어요. AI 분석 메뉴에서 실제 숫자로 비교해볼 수 있습니다.',
      news: chatNews.slice(0, 2),
      youtube_videos: MOCK_VIDEOS.slice(4, 6).map(toChatVideo),
    }
  }

  // ── 그 외 ─────────────────────────────────────────────────
  return {
    type: 'fallback',
    intent,
    message:
      '아직 잘 모르는 질문이에요. 이런 걸 물어보시면 도와드릴 수 있어요.\n\n• 금리 높은 적금 추천해줘\n• 가까운 국민은행 어디야?\n• 오늘 금리 뉴스 알려줘\n• 목돈 모으는 방법 알려줘',
  }
}

/**
 * 위치 기반 은행 검색
 * @param {string} bankName - 은행명
 * @returns {Object} 은행 위치 응답
 */
export const searchBankWithLocation = (bankName) => {
  const place = findNearestBank(bankName)

  if (!place) {
    return {
      type: 'bank_location',
      bank_name: bankName,
      message: `${bankName} 지점을 찾지 못했어요.`,
      found: false,
    }
  }

  return {
    type: 'bank_location',
    bank_name: bankName,
    message: `현재 위치에서 가장 가까운 ${bankName} 지점이에요.`,
    bank_info: toBankInfo(place),
    show_map: true,
    map_center: { lat: Number(place.y), lng: Number(place.x) },
  }
}
