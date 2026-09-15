/**
 * @파일명 mocks/analysis.js
 * @설명 AI 금융 분석 결과 목업 데이터
 * @기능
 *   - 분석 결과 조회 (getAnalysisResult)
 * @API엔드포인트
 *   - POST /api/v1/analysis/ : 분석 생성 → { analysis_id }
 *   - GET  /api/v1/analysis/:id/result/ : 분석 결과
 * @비고
 *   시나리오 — 목표 3,000만원 / 24개월 / 보유 500만원 / 월 100만원 / 예금 3.5% / 적금 3.8%
 *   아래 수치는 단리 공식으로 실제 계산한 값이다. 임의로 고치면 화면에서 앞뒤가 맞지 않게 된다.
 *     · 예금 이자 = 원금 × 금리 × (개월/12)
 *     · 적금 이자 = 월납입 × (금리/12) × n(n+1)/2
 *     · 세후 = 세전 × (1 - 0.154)
 *
 *   주의할 키:
 *     · 유튜브는 related_videos 가 아니라 related_youtube 다 (화면이 읽는 키)
 *     · 뉴스 날짜는 pubdate 소문자다 (뉴스 메뉴의 pubDate 와 다름)
 *     · detail.max_limit 은 toLocaleString 대상이라 숫자여야 한다
 *     · strategies 중 achievable: true 가 하나라도 있으면 alternative_plans 는 화면에 뜨지 않는다
 */

import { clone } from './config'
import { MOCK_VIDEOS } from './youtube'

// ========================================
// 시나리오 상수
// ========================================

const TARGET_AMOUNT = 30000000
const PERIOD_MONTHS = 24
const CURRENT_SAVINGS = 5000000
const MONTHLY_AMOUNT = 1000000
const DEPOSIT_RATE = 3.5
const SAVING_RATE = 3.8
const TAX_RATE = 0.154

// ========================================
// 추천 상품 (전략에 붙는 요약 형태)
// ========================================

/** @type {Object} 추천 예금 */
const recommendedDeposit = {
  option_id: 2,
  product_id: 2,
  fin_prdt_cd: 'DP-SH-0102',
  bank: '신한은행',
  name: '쏠편한 정기예금',
  rate: DEPOSIT_RATE,
  save_trm: '24',
}

/** @type {Object} 추천 적금 */
const recommendedSaving = {
  option_id: 303,
  product_id: 103,
  fin_prdt_cd: 'SV-SH-0203',
  bank: '신한은행',
  name: '신한 청년처음적금',
  rate: SAVING_RATE,
  save_trm: '24',
}

// ========================================
// 전략별 이자 계산 결과
// ========================================

/** 전략 1 — 예금 파트 (보유금 500만원, 24개월) */
const depositLeg = {
  principal: 5000000,
  interest_before_tax: 350000,
  interest: 350000,
  interest_after_tax: 296100,
  tax_amount: 53900,
  total: 5350000,
  total_after_tax: 5296100,
  rate: DEPOSIT_RATE,
  months: PERIOD_MONTHS,
  is_after_tax: true,
}

/** 전략 1 — 적금 파트 (월 100만원, 24개월) */
const savingLeg = {
  principal: 24000000,
  interest_before_tax: 950000,
  interest: 950000,
  interest_after_tax: 803700,
  tax_amount: 146300,
  total: 24950000,
  total_after_tax: 24803700,
  rate: SAVING_RATE,
  months: PERIOD_MONTHS,
  monthly_payment: MONTHLY_AMOUNT,
  is_after_tax: true,
}

/** 전략 2 — 전액 적금 (보유금을 24개월로 나눠 월 1,208,333원) */
const savingOnlyLeg = {
  principal: 29000000,
  interest_before_tax: 1147917,
  interest: 1147917,
  interest_after_tax: 971138,
  tax_amount: 176779,
  total: 30147917,
  total_after_tax: 29971138,
  rate: SAVING_RATE,
  months: PERIOD_MONTHS,
  monthly_payment: 1208333,
  is_after_tax: true,
}

// ========================================
// 전략 목록
// ========================================

/** @type {Object} 예금 + 적금 병행 (권장) */
const strategyCombined = {
  strategy_name: '예금 + 적금 병행',
  strategy_type: 'deposit_and_saving',
  description:
    '보유하신 500만원은 24개월 예금에 한 번에 넣고, 매달 들어오는 100만원은 적금으로 쌓는 방식입니다. 예금은 첫 달부터 전액이 이자를 받기 때문에 같은 금리라도 적금보다 이자가 많이 붙습니다.',
  deposit: depositLeg,
  saving: savingLeg,
  // 화면이 total_interest 에 0.846 을 곱해 세후를 직접 계산하므로 여기는 세전 값이다
  total_amount: 30300000,
  total_interest: 1300000,
  // 달성 여부와 부족액은 백엔드와 같이 세후 기준으로 판정한다 (세후 30,099,800원)
  achievable: true,
  shortfall: 0,
  uses_deposit: true,
  uses_saving: true,
  deposit_term: PERIOD_MONTHS,
  saving_term: PERIOD_MONTHS,
  best_deposit_product: recommendedDeposit,
  best_saving_product: recommendedSaving,
}

/** @type {Object} 전액 적금 (비교용) */
const strategySavingOnly = {
  strategy_name: '전액 적금 (보유금 분할)',
  strategy_type: 'saving_only_split',
  description:
    '보유금 500만원을 24개월로 나눠 월 납입액에 더하는 방식입니다. 적금 금리(3.8%)가 예금(3.5%)보다 높지만, 나중에 넣는 돈일수록 이자가 붙는 기간이 짧아져 실제 수령액은 병행보다 적습니다.',
  deposit: null,
  saving: savingOnlyLeg,
  // 세전 값 (화면이 0.846 을 곱해 세후를 계산한다)
  total_amount: 30147917,
  total_interest: 1147917,
  // 세후로는 29,971,138원이라 목표 3,000만원에 28,862원 모자란다
  achievable: false,
  shortfall: 28862,
  uses_deposit: false,
  uses_saving: true,
  saving_term: PERIOD_MONTHS,
  extra_monthly_from_savings: 208333,
  best_saving_product: recommendedSaving,
}

// ========================================
// 추천 상품 상세 (items)
// ========================================

/**
 * 추천 상품 항목 생성
 * @param {Object} config - 항목 구성값
 * @returns {Object} items 배열의 한 항목
 */
const buildItem = ({
  kind,
  optionId,
  productId,
  finPrdtCd,
  bank,
  name,
  joinWay,
  joinMember,
  spclCnd,
  etcNote,
  saveTrm,
  intrRate,
  intrRate2,
  rsrvType,
  maxLimit,
  fitScore,
  goalAchievement,
  conditionDifficulty,
  reason,
  plan,
}) => ({
  kind,
  option_id: optionId,
  product_id: productId,
  fit_score: fitScore,
  goal_achievement: goalAchievement,
  condition_difficulty: conditionDifficulty,
  reason,
  detail: {
    kind,
    option_id: optionId,
    product_id: productId,
    fin_prdt_cd: finPrdtCd,
    bank,
    name,
    join_way: joinWay,
    join_member: joinMember,
    join_deny: '1',
    spcl_cnd: spclCnd,
    etc_note: etcNote,
    save_trm: saveTrm,
    intr_rate: intrRate,
    intr_rate2: intrRate2,
    intr_rate_type_nm: '단리',
    rsrv_type: rsrvType,
    // toLocaleString 대상이므로 숫자여야 한다
    max_limit: maxLimit,
  },
  plan,
})

/** @type {Array<Object>} 추천 상품 4건 (적금 2 + 예금 2) */
const items = [
  buildItem({
    kind: 'saving',
    optionId: 303,
    productId: 103,
    finPrdtCd: 'SV-SH-0203',
    bank: '신한은행',
    name: '신한 청년처음적금',
    joinWay: '인터넷,스마트폰,영업점',
    joinMember: '만 19세 ~ 만 34세 실명의 개인',
    spclCnd: '① 만 34세 이하 연 0.70%p\n② 첫 거래 고객 연 0.30%p\n③ 급여이체 시 연 0.30%p',
    etcNote: '청년 대상 상품으로 가입 시 연령 확인이 필요합니다.',
    saveTrm: 24,
    intrRate: 3.6,
    intrRate2: 4.9,
    rsrvType: 'S',
    maxLimit: 500000,
    fitScore: 0.94,
    goalAchievement: 0.98,
    conditionDifficulty: 0.4,
    reason:
      '24개월 기준 최고금리가 가장 높고, 월 납입 한도 50만원이 두 계좌면 목표 월 납입액 100만원을 채울 수 있습니다. 우대조건 중 연령 요건은 자동 충족되며 급여이체만 추가로 맞추면 됩니다.',
    plan: {
      type: 'monthly',
      term_months: 24,
      required_monthly_amount: 1000000,
      extra_needed_per_month: 0,
      planned_total_amount: 29000000,
      shortfall_amount: 0,
      message: '월 100만원을 24개월간 납입하면 목표 금액에 도달합니다.',
    },
  }),
  buildItem({
    kind: 'saving',
    optionId: 306,
    productId: 106,
    finPrdtCd: 'SV-KBANK-0206',
    bank: '주식회사 케이뱅크',
    name: '코드K 자유적금',
    joinWay: '스마트폰',
    joinMember: '만 17세 이상 실명의 개인',
    spclCnd: '별도 우대조건 없이 가입 시점의 금리가 만기까지 적용됩니다.',
    etcNote: '자유적립식으로 납입 시기와 금액을 자유롭게 정할 수 있습니다.',
    saveTrm: 24,
    intrRate: 3.65,
    intrRate2: 3.8,
    rsrvType: 'F',
    maxLimit: 3000000,
    fitScore: 0.87,
    goalAchievement: 0.95,
    conditionDifficulty: 0.05,
    reason:
      '우대조건을 채우지 않아도 연 3.80%가 그대로 적용되고, 월 한도가 300만원이라 한 계좌로 월 100만원을 소화할 수 있습니다. 납입액이 매달 달라질 수 있다면 이쪽이 편합니다.',
    plan: {
      type: 'monthly',
      term_months: 24,
      required_monthly_amount: 1000000,
      extra_needed_per_month: 0,
      planned_total_amount: 29000000,
      shortfall_amount: 0,
      message: '자유적립식이라 여유가 있는 달에 더 넣어 기간을 앞당길 수 있습니다.',
    },
  }),
  buildItem({
    kind: 'deposit',
    optionId: 2,
    productId: 2,
    finPrdtCd: 'DP-SH-0102',
    bank: '신한은행',
    name: '쏠편한 정기예금',
    joinWay: '인터넷,스마트폰',
    joinMember: '개인 및 개인사업자',
    spclCnd: '① 첫 거래 고객 연 0.20%p\n② 신한 마이데이터 가입 시 연 0.10%p',
    etcNote: '비대면 전용 상품으로 영업점 가입은 불가합니다.',
    saveTrm: 24,
    intrRate: 3.3,
    intrRate2: 3.7,
    rsrvType: null,
    maxLimit: 300000000,
    fitScore: 0.91,
    goalAchievement: 0.96,
    conditionDifficulty: 0.2,
    reason:
      '보유하신 500만원을 24개월간 예치하기에 적합합니다. 적금 상품과 같은 은행이라 우대조건을 함께 채우기 쉽고, 첫 거래 우대까지 받으면 연 3.70%가 적용됩니다.',
    plan: {
      type: 'lump_sum',
      term_months: 24,
      required_lump_sum: 5000000,
      message: '보유 자금 500만원을 24개월 예치하면 세후 약 29만원의 이자가 붙습니다.',
    },
  }),
  buildItem({
    kind: 'deposit',
    optionId: 3,
    productId: 3,
    finPrdtCd: 'DP-KAKAO-0103',
    bank: '주식회사 카카오뱅크',
    name: '카카오뱅크 정기예금',
    joinWay: '스마트폰',
    joinMember: '만 17세 이상 실명의 개인',
    spclCnd: '별도의 우대조건 없이 누구나 동일한 금리가 적용됩니다.',
    etcNote: '1인당 최대 10계좌까지 가입할 수 있습니다.',
    saveTrm: 24,
    intrRate: 3.4,
    intrRate2: 3.4,
    rsrvType: null,
    maxLimit: 1000000000,
    fitScore: 0.83,
    goalAchievement: 0.94,
    conditionDifficulty: 0.0,
    reason:
      '우대조건이 아예 없어 가입 즉시 연 3.40%가 확정됩니다. 조건 관리가 번거롭다면 금리는 조금 낮아도 이쪽이 실수령액을 예측하기 쉽습니다.',
    plan: {
      type: 'lump_sum',
      term_months: 24,
      required_lump_sum: 5000000,
      message: '조건 없이 확정 금리를 받고 싶을 때 선택할 수 있는 대안입니다.',
    },
  }),
]

// ========================================
// 대안 플랜
// ========================================
// 주의: strategies 에 achievable: true 가 있으면 화면에 표시되지 않는다.
//       목표 미달 시나리오로 바꿀 때를 대비해 형태를 맞춰 둔다.

/** @type {Array<Object>} 목표 미달 시 제안할 대안 */
const alternativePlans = [
  {
    type: 'extend_period',
    description: '기간을 30개월로 6개월 늘리면 월 납입액을 그대로 두고도 목표를 넘어섭니다.',
    new_period_months: 30,
    monthly_amount: MONTHLY_AMOUNT,
    expected_total: 36259375,
    expected_interest: 1259375,
    achievable: true,
    recommended_product: { kind: 'saving', ...recommendedSaving, save_trm: '30' },
    max_allowed_period: 36,
    original_period: PERIOD_MONTHS,
  },
  {
    type: 'increase_monthly',
    description: '월 납입액을 110만원으로 올리면 24개월 안에 여유 있게 목표에 도달합니다.',
    new_monthly_amount: 1100000,
    period_months: PERIOD_MONTHS,
    expected_total: 32504800,
    expected_interest: 1204800,
    achievable: true,
    recommended_product: { kind: 'saving', ...recommendedSaving },
    max_allowed_period: 36,
    original_period: PERIOD_MONTHS,
  },
  {
    type: 'reduce_target',
    description: '목표를 2,700만원으로 낮추면 현재 계획만으로 충분히 달성할 수 있습니다.',
    achievable_target: 27000000,
    original_target: TARGET_AMOUNT,
    reduction_rate: 0.1,
    period_months: PERIOD_MONTHS,
    achievable: true,
    recommended_product: { kind: 'saving', ...recommendedSaving },
    max_allowed_period: 36,
    original_period: PERIOD_MONTHS,
  },
]

// ========================================
// 결과 본문
// ========================================

/** @type {Object} 분석 결과 전체 */
const analysisResult = {
  summary:
    '보유하신 500만원과 매달 100만원으로 24개월 뒤 3,000만원을 모으는 계획입니다. 보유금은 예금에, 매달 들어오는 돈은 적금에 나눠 넣으면 세금을 떼고도 약 3,010만원이 되어 목표를 넘어섭니다. 한쪽에만 몰아넣는 것보다 약 13만원 유리합니다.',

  strategy:
    '핵심은 "이자가 붙는 기간"입니다. 예금은 맡긴 첫날부터 전액에 이자가 붙지만, 적금은 마지막 달에 넣은 돈에 한 달치 이자만 붙습니다. 그래서 적금 금리(3.8%)가 예금(3.5%)보다 높아도, 이미 갖고 있는 목돈은 예금에 넣는 편이 유리합니다. 매달 새로 생기는 돈은 예금에 넣을 방법이 없으니 적금으로 받는 것이 자연스럽습니다.',

  goal_math: {
    period_months: PERIOD_MONTHS,
    target_amount: TARGET_AMOUNT,
    monthly_amount: MONTHLY_AMOUNT,
    current_savings: CURRENT_SAVINGS,

    planned_total_amount: 29000000,

    deposit_interest: 350000,
    saving_interest: 950000,
    total_interest: 1300000,

    deposit_interest_after_tax: 296100,
    saving_interest_after_tax: 803700,
    total_interest_after_tax: 1099800,

    tax_amount: 200200,
    tax_rate: TAX_RATE,

    total_with_interest: 30300000,
    total_with_interest_after_tax: 30099800,
    saving_only_total: 24950000,

    months_to_goal: 24,
    required_monthly_amount: 995976,
    extra_needed_per_month: 0,

    achievable_in_period: true,
    achievable_after_tax: true,

    shortfall_amount: 0,
    shortfall_after_tax: 0,

    deposit_rate: DEPOSIT_RATE,
    saving_rate: SAVING_RATE,
  },

  combination_strategy: {
    strategies: [strategyCombined, strategySavingOnly],
    best_strategy: strategyCombined,
    analysis: {
      current_savings: CURRENT_SAVINGS,
      monthly_amount: MONTHLY_AMOUNT,
      target_amount: TARGET_AMOUNT,
      period_months: PERIOD_MONTHS,
      deposit_rate: DEPOSIT_RATE,
      saving_rate: SAVING_RATE,
    },
    recommended_deposit: recommendedDeposit,
    recommended_saving: recommendedSaving,
  },

  alternative_plans: alternativePlans,

  items,

  exchange_rate_info: {
    currency_code: 'JPY',
    currency_name: '일본 엔',
    exchange_rate: 9.1845,
    target_krw: TARGET_AMOUNT,
    target_foreign: 3266645,
    updated_at: '20260915',

    strategy_name: strategyCombined.strategy_name,
    strategy_type: strategyCombined.strategy_type,

    deposit_principal: 5000000,
    deposit_interest: 296100,
    deposit_rate: DEPOSIT_RATE,
    deposit_term: PERIOD_MONTHS,

    saving_principal: 24000000,
    saving_interest: 803700,
    saving_rate: SAVING_RATE,
    saving_term: PERIOD_MONTHS,

    total_principal: 29000000,
    total_interest: 1099800,
    total_with_interest_krw: 30099800,
    total_with_interest_foreign: 3277101,
  },

  recommended_destinations: ['도쿄', '오사카', '후쿠오카', '삿포로', '교토'],

  // 주의: 이 키는 pubdate 소문자다 (뉴스 메뉴의 pubDate 와 다름)
  related_news: [
    {
      title: '시중은행 예금금리 다시 3%대… 막차 수요 몰린다',
      link: 'https://news.example.com/finance/20260914-deposit-rate',
      description:
        '주요 시중은행의 1년 만기 정기예금 금리가 연 3%대를 회복했다. 기준금리 인하 기대가 후퇴하면서 은행들이 수신 경쟁에 나선 영향으로 풀이된다.',
      pubdate: '2026-09-14 16:40',
    },
    {
      title: '청년 대상 우대금리 적금 잇따라 출시… 최고 연 4.7%',
      link: 'https://news.example.com/finance/20260913-youth-saving',
      description:
        '만 34세 이하 청년을 대상으로 한 고금리 적금 상품이 잇따라 출시되고 있다. 다만 우대금리를 모두 충족하려면 급여이체·카드실적 등 조건이 따라붙는다.',
      pubdate: '2026-09-13 11:05',
    },
    {
      title: '"이자소득세 15.4%"… 세후 수익률 따져봐야',
      link: 'https://news.example.com/finance/20260908-tax',
      description:
        '표면 금리가 높아도 이자소득세 15.4%를 제하면 실수령액은 달라진다. 전문가들은 상품 비교 시 세후 기준으로 환산해볼 것을 권한다.',
      pubdate: '2026-09-08 17:19',
    },
  ],

  // 주의: related_videos 가 아니라 related_youtube 다 (화면이 읽는 키)
  related_youtube: MOCK_VIDEOS.slice(0, 3).map((video) => ({
    title: video.title,
    videoId: video.videoId,
    thumbnail: video.thumbnail,
    channelTitle: video.channelTitle,
  })),

  ai_verdict:
    '지금 계획대로면 24개월 뒤 목표를 달성합니다. 다만 세후 기준으로 약 10만원 여유밖에 없어, 중간에 한 달이라도 납입을 거르면 목표에 미치지 못합니다. 적금 우대조건 중 급여이체 항목을 먼저 확보해두시고, 여유가 생기는 달에는 자유적립식 상품으로 조금씩 더 넣어두는 편을 권합니다.',

  created_at: '2026-09-15T14:22:00+09:00',
}

// ========================================
// 조회
// ========================================

/** @type {number} 목업 분석 ID. createAnalysis 가 항상 이 값을 돌려준다 */
export const MOCK_ANALYSIS_ID = 1

/**
 * 분석 결과 조회
 * @description 목업은 결과가 한 건뿐이라 analysisId 와 무관하게 같은 결과를 반환한다
 * @returns {Object} 분석 결과
 */
export const getAnalysisResult = () => clone(analysisResult)
