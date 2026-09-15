/**
 * @파일명 mocks/products.js
 * @설명 예금/적금 상품 목업 데이터
 * @기능
 *   - 예금 상품 목록 (mockDeposits)
 *   - 적금 상품 목록 (mockSavings)
 *   - 상품 상세 조회 (getProductDetail)
 * @API엔드포인트
 *   - GET /api/products/deposits/ : 예금 목록
 *   - GET /api/products/savings/ : 적금 목록
 *   - GET /api/products/:type/:fin_prdt_cd/ : 상품 상세
 * @비고
 *   kor_co_nm 은 금융감독원 표기를 그대로 써야 은행 로고가 매칭된다.
 *   (components/products/ProductListItem.vue 의 BANK_FILE_MAP 참고)
 */

import { clone } from './config'
import { isLiked, getLikesCount } from './likesState'

// ========================================
// 옵션 생성 헬퍼
// ========================================

/** 옵션 id 자동 증가용 카운터 */
let optionSeq = 1

/**
 * 기간별 금리 옵션 3개(6/12/24개월) 생성
 * @param {number} base - 12개월 기준 기본금리
 * @param {number} prefer - 12개월 기준 최고금리
 * @param {'S'|'F'|null} rsrvType - 적립 유형 (적금만 사용)
 * @param {number|null} maxLimit - 최고 한도 (원). toLocaleString 대상이므로 숫자여야 한다
 * @returns {Array<Object>} 옵션 배열
 */
const buildOptions = (base, prefer, rsrvType = null, maxLimit = null) => {
  // 기간이 길수록 금리가 소폭 높아지는 형태
  const spread = [
    { save_trm: '6', gap: -0.25 },
    { save_trm: '12', gap: 0 },
    { save_trm: '24', gap: 0.2 },
  ]

  return spread.map(({ save_trm, gap }) => ({
    id: optionSeq++,
    save_trm,
    intr_rate: Number((base + gap).toFixed(2)),
    intr_rate2: Number((prefer + gap).toFixed(2)),
    intr_rate_type_nm: '단리',
    rsrv_type: rsrvType,
    max_limit: maxLimit,
  }))
}

// ========================================
// 예금 상품 (6건)
// ========================================

/** @type {Array<Object>} 예금 상품 목록 */
export const mockDeposits = [
  {
    id: 1,
    fin_prdt_cd: 'DP-KB-0101',
    kor_co_nm: '국민은행',
    fin_prdt_nm: 'KB Star 정기예금',
    join_deny: '1',
    join_member: '실명의 개인 또는 개인사업자',
    join_way: '인터넷,스마트폰,영업점',
    spcl_cnd: '① 급여이체 실적 보유 시 연 0.20%p\n② 자동이체 3건 이상 등록 시 연 0.10%p\n③ 마케팅 동의 시 연 0.05%p',
    etc_note: '만기 후 이율은 기본이율의 50%가 적용됩니다.',
    options: buildOptions(3.05, 3.45, null, 500000000),
  },
  {
    id: 2,
    fin_prdt_cd: 'DP-SH-0102',
    kor_co_nm: '신한은행',
    fin_prdt_nm: '쏠편한 정기예금',
    join_deny: '1',
    join_member: '개인 및 개인사업자',
    join_way: '인터넷,스마트폰',
    spcl_cnd: '① 첫 거래 고객 연 0.20%p\n② 신한 마이데이터 가입 시 연 0.10%p',
    etc_note: '비대면 전용 상품으로 영업점 가입은 불가합니다.',
    options: buildOptions(3.10, 3.50, null, 300000000),
  },
  {
    id: 3,
    fin_prdt_cd: 'DP-KAKAO-0103',
    kor_co_nm: '주식회사 카카오뱅크',
    fin_prdt_nm: '카카오뱅크 정기예금',
    join_deny: '1',
    join_member: '만 17세 이상 실명의 개인',
    join_way: '스마트폰',
    spcl_cnd: '별도의 우대조건 없이 누구나 동일한 금리가 적용됩니다.',
    etc_note: '1인당 최대 10계좌까지 가입할 수 있습니다.',
    options: buildOptions(3.20, 3.20, null, 1000000000),
  },
  {
    id: 4,
    fin_prdt_cd: 'DP-IBK-0104',
    kor_co_nm: '중소기업은행',
    fin_prdt_nm: 'IBK 첫만남 정기예금',
    join_deny: '1',
    join_member: '실명의 개인',
    join_way: '인터넷,스마트폰,영업점',
    spcl_cnd: '① 최근 1년간 거래 이력이 없는 고객 연 0.30%p\n② 만기까지 예치 시 연 0.10%p',
    etc_note: '중도 해지 시 우대금리가 적용되지 않습니다.',
    options: buildOptions(2.95, 3.35, null, 200000000),
  },
  {
    id: 5,
    fin_prdt_cd: 'DP-TOSS-0105',
    kor_co_nm: '토스뱅크 주식회사',
    fin_prdt_nm: '토스뱅크 먼저 이자 받는 예금',
    join_deny: '1',
    join_member: '만 19세 이상 실명의 개인',
    join_way: '스마트폰',
    spcl_cnd: '가입 즉시 이자를 먼저 지급하며 별도 우대조건은 없습니다.',
    etc_note: '가입 시점에 이자를 선지급하는 구조의 상품입니다.',
    options: buildOptions(3.15, 3.15, null, 100000000),
  },
  {
    id: 6,
    fin_prdt_cd: 'DP-NH-0106',
    kor_co_nm: '농협은행주식회사',
    fin_prdt_nm: 'NH왈츠회전예금 II',
    join_deny: '1',
    join_member: '개인 및 개인사업자',
    join_way: '인터넷,스마트폰,영업점',
    spcl_cnd: '① 농협 카드 결제 실적 보유 시 연 0.15%p\n② 공과금 자동이체 시 연 0.10%p',
    etc_note: '회전 주기마다 시장금리에 따라 적용금리가 재산정됩니다.',
    options: buildOptions(3.00, 3.30, null, 300000000),
  },
]

// ========================================
// 적금 상품 (6건)
// ========================================

/** @type {Array<Object>} 적금 상품 목록 */
export const mockSavings = [
  {
    id: 101,
    fin_prdt_cd: 'SV-KB-0201',
    kor_co_nm: '국민은행',
    fin_prdt_nm: 'KB 특★한 적금',
    join_deny: '1',
    join_member: '실명의 개인',
    join_way: '인터넷,스마트폰',
    spcl_cnd: '① 급여이체 시 연 0.50%p\n② KB카드 월 30만원 이상 사용 시 연 0.30%p\n③ 주택청약 보유 시 연 0.20%p',
    etc_note: '월 납입한도는 50만원이며 자유적립식으로 운용됩니다.',
    options: buildOptions(3.30, 4.30, 'F', 500000),
  },
  {
    id: 102,
    fin_prdt_cd: 'SV-KAKAO-0202',
    kor_co_nm: '주식회사 카카오뱅크',
    fin_prdt_nm: '카카오뱅크 26주적금',
    join_deny: '1',
    join_member: '만 17세 이상 실명의 개인',
    join_way: '스마트폰',
    spcl_cnd: '26주 동안 매주 납입에 성공하면 연 0.50%p 우대금리가 제공됩니다.',
    etc_note: '매주 납입 금액이 자동으로 증액되는 챌린지형 적금입니다.',
    options: buildOptions(3.50, 4.00, 'S', 300000),
  },
  {
    id: 103,
    fin_prdt_cd: 'SV-SH-0203',
    kor_co_nm: '신한은행',
    fin_prdt_nm: '신한 청년처음적금',
    join_deny: '2',
    join_member: '만 19세 ~ 만 34세 실명의 개인',
    join_way: '인터넷,스마트폰,영업점',
    spcl_cnd: '① 만 34세 이하 연 0.70%p\n② 첫 거래 고객 연 0.30%p\n③ 급여이체 시 연 0.30%p',
    etc_note: '청년 대상 상품으로 가입 시 연령 확인이 필요합니다.',
    options: buildOptions(3.40, 4.70, 'S', 500000),
  },
  {
    id: 104,
    fin_prdt_cd: 'SV-WOORI-0204',
    kor_co_nm: '우리은행',
    fin_prdt_nm: 'WON 적금',
    join_deny: '1',
    join_member: '실명의 개인',
    join_way: '인터넷,스마트폰',
    spcl_cnd: '① 우리WON뱅킹 로그인 월 5회 이상 시 연 0.20%p\n② 자동이체 등록 시 연 0.30%p',
    etc_note: '비대면 채널 전용 상품입니다.',
    options: buildOptions(3.25, 3.95, 'F', 500000),
  },
  {
    id: 105,
    fin_prdt_cd: 'SV-HANA-0205',
    kor_co_nm: '주식회사 하나은행',
    fin_prdt_nm: '하나 달달 하나 적금',
    join_deny: '1',
    join_member: '실명의 개인',
    join_way: '인터넷,스마트폰,영업점',
    spcl_cnd: '① 하나카드 실적 보유 시 연 0.40%p\n② 마케팅 동의 시 연 0.10%p',
    etc_note: '매월 일정액을 납입하는 정액적립식 상품입니다.',
    options: buildOptions(3.35, 3.85, 'S', 300000),
  },
  {
    id: 106,
    fin_prdt_cd: 'SV-KBANK-0206',
    kor_co_nm: '주식회사 케이뱅크',
    fin_prdt_nm: '코드K 자유적금',
    join_deny: '1',
    join_member: '만 17세 이상 실명의 개인',
    join_way: '스마트폰',
    spcl_cnd: '별도 우대조건 없이 가입 시점의 금리가 만기까지 적용됩니다.',
    etc_note: '자유적립식으로 납입 시기와 금액을 자유롭게 정할 수 있습니다.',
    options: buildOptions(3.45, 3.60, 'F', 3000000),
  },
]

// ========================================
// 조회 함수
// ========================================

/**
 * 상품 상세 조회
 * @description 목록 항목에 상세 전용 필드(is_liked, likes_count)를 얹어 반환한다
 * @param {'deposit'|'saving'} type - 상품 타입
 * @param {string} finPrdtCd - 상품 코드
 * @returns {Object|null} 상품 상세. 없으면 null
 */
export const getProductDetail = (type, finPrdtCd) => {
  const list = type === 'saving' ? mockSavings : mockDeposits
  const found = list.find((product) => product.fin_prdt_cd === finPrdtCd)

  if (!found) return null

  return {
    ...clone(found),
    // 좋아요 상태는 mocks/likes.js 의 메모리 상태를 따른다
    is_liked: isLiked(type, finPrdtCd),
    likes_count: getLikesCount(type, finPrdtCd),
  }
}
