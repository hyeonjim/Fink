/**
 * @파일명 mocks/news.js
 * @설명 금융 뉴스 목업 데이터 및 메모리 상태
 * @기능
 *   - 뉴스 목록 조회 (getNewsList)
 *   - 뉴스 상세 조회 (getNewsDetail)
 *   - 북마크 토글 (toggleBookmark)
 *   - 키워드 검색 (searchNews)
 * @API엔드포인트
 *   - GET  /api/news/ : 목록 (페이지네이션 없이 배열)
 *   - GET  /api/news/:id/ : 상세
 *   - POST /api/news/:id/bookmark/ : 북마크 토글
 * @비고
 *   pubDate 는 대문자 D 다. (AI 분석 결과의 related_news 는 pubdate 소문자이므로 혼동 주의)
 *   description 에는 검색어 강조용 <b> 태그가 섞여 들어오며 화면이 v-html 로 렌더한다.
 */

import { clone } from './config'

// ========================================
// 뉴스 저장소 (8건)
// ========================================

/** @type {Array<Object>} 뉴스 목록 (최신순) */
let newsList = [
  {
    id: 1,
    user: 1,
    title: '한국은행, 기준금리 연 2.75% 동결… "물가 흐름 지켜볼 것"',
    description:
      '한국은행 금융통화위원회가 기준금리를 현 수준인 연 2.75%로 <b>동결</b>했다. 금통위는 물가 상승률이 목표 수준에 근접했으나 대외 불확실성이 여전하다는 점을 이유로 들었다.',
    link: 'https://news.example.com/finance/20260915-base-rate',
    pubDate: '2026-09-15 09:12',
    is_bookmarked: true,
  },
  {
    id: 2,
    user: 1,
    title: '시중은행 예금금리 다시 3%대… 막차 수요 몰린다',
    description:
      '주요 시중은행의 1년 만기 정기<b>예금</b> 금리가 연 3%대를 회복했다. 기준금리 인하 기대가 후퇴하면서 은행들이 수신 경쟁에 나선 영향으로 풀이된다.',
    link: 'https://news.example.com/finance/20260914-deposit-rate',
    pubDate: '2026-09-14 16:40',
    is_bookmarked: true,
  },
  {
    id: 3,
    user: 1,
    title: '청년 대상 우대금리 적금 잇따라 출시… 최고 연 4.7%',
    description:
      '만 34세 이하 청년을 대상으로 한 고금리 <b>적금</b> 상품이 잇따라 출시되고 있다. 다만 우대금리를 모두 충족하려면 급여이체·카드실적 등 조건이 따라붙는다.',
    link: 'https://news.example.com/finance/20260913-youth-saving',
    pubDate: '2026-09-13 11:05',
    is_bookmarked: false,
  },
  {
    id: 4,
    user: 1,
    title: '코스피 3,200선 회복… 반도체주가 끌었다',
    description:
      '코스피가 외국인 순매수에 힘입어 3,200선을 회복했다. 반도체 업황 개선 기대가 이어지면서 대형 <b>주식</b> 중심의 매수세가 유입됐다.',
    link: 'https://news.example.com/market/20260912-kospi',
    pubDate: '2026-09-12 15:58',
    is_bookmarked: false,
  },
  {
    id: 5,
    user: 1,
    title: '국제 금값 온스당 2,800달러 돌파… 안전자산 선호 지속',
    description:
      '국제 <b>금</b> 가격이 온스당 2,800달러를 넘어섰다. 지정학적 불확실성과 중앙은행 매입 수요가 가격을 떠받치고 있다는 분석이다.',
    link: 'https://news.example.com/market/20260911-gold',
    pubDate: '2026-09-11 08:33',
    is_bookmarked: true,
  },
  {
    id: 6,
    user: 1,
    title: '원/달러 환율 1,340원대… 수출기업 채산성 개선',
    description:
      '원/달러 <b>환율</b>이 1,340원대에서 등락하고 있다. 달러 강세가 다소 누그러지면서 변동성은 축소되는 흐름이다.',
    link: 'https://news.example.com/market/20260910-fx',
    pubDate: '2026-09-10 13:21',
    is_bookmarked: false,
  },
  {
    id: 7,
    user: 1,
    title: '인터넷전문은행 3사, 수신 잔액 100조 돌파',
    description:
      '카카오뱅크·케이뱅크·토스뱅크의 합산 수신 잔액이 100조원을 넘어섰다. 비대면 <b>예금</b> 상품의 금리 경쟁력이 주요 요인으로 꼽힌다.',
    link: 'https://news.example.com/finance/20260909-internet-bank',
    pubDate: '2026-09-09 10:47',
    is_bookmarked: false,
  },
  {
    id: 8,
    user: 1,
    title: '"이자소득세 15.4%"… 세후 수익률 따져봐야',
    description:
      '표면 금리가 높아도 <b>이자</b>소득세 15.4%를 제하면 실수령액은 달라진다. 전문가들은 상품 비교 시 세후 기준으로 환산해볼 것을 권한다.',
    link: 'https://news.example.com/finance/20260908-tax',
    pubDate: '2026-09-08 17:19',
    is_bookmarked: false,
  },
]

// ========================================
// 조회 / 변경
// ========================================

/**
 * 뉴스 목록 조회
 * @param {'all'|'bookmark'} [mode='all'] - 보기 모드
 * @returns {Array<Object>} 뉴스 목록
 */
export const getNewsList = (mode = 'all') => {
  const source = mode === 'bookmark' ? newsList.filter((news) => news.is_bookmarked) : newsList
  return clone(source)
}

/**
 * 뉴스 상세 조회
 * @param {number|string} newsId - 뉴스 ID
 * @returns {Object|null} 뉴스 상세. 없으면 null
 */
export const getNewsDetail = (newsId) => {
  const found = newsList.find((news) => news.id === Number(newsId))
  return found ? clone(found) : null
}

/**
 * 북마크 토글
 * @param {number|string} newsId - 뉴스 ID
 * @returns {Object|null} 갱신된 뉴스 객체. 없으면 null
 */
export const toggleBookmark = (newsId) => {
  const target = newsList.find((news) => news.id === Number(newsId))
  if (!target) return null

  target.is_bookmarked = !target.is_bookmarked

  return clone(target)
}

/**
 * 키워드 검색
 * @description 백엔드는 네이버 API 로 새 뉴스를 받아오지만,
 *              목업은 보유한 뉴스를 키워드로 걸러 목록 맨 앞으로 올린다
 * @param {string} query - 검색 키워드
 * @returns {number} 검색어에 걸린 뉴스 건수
 */
export const searchNews = (query) => {
  const keyword = (query || '').trim()
  if (!keyword) return 0

  const matched = newsList.filter(
    (news) => news.title.includes(keyword) || news.description.includes(keyword)
  )

  // 검색 결과를 목록 상단으로 끌어올린다
  if (matched.length > 0) {
    const rest = newsList.filter((news) => !matched.includes(news))
    newsList = [...matched, ...rest]
  }

  return matched.length
}
