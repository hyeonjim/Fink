<template>
  <div class="product-card" :class="{ selected: isSelected }">
    <!-- Card Header -->
    <div class="card-header">
      <div class="bank-badge">
        <img
          v-if="bankLogoSrc"
          :src="bankLogoSrc"
          :alt="d.bank"
          class="bank-logo-img"
          loading="lazy"
        />
        <span v-else class="bank-initial">{{ d.bank?.charAt(0) || 'B' }}</span>
      </div>
      <div class="header-content">
        <span class="bank-name">{{ d.bank }}</span>
        <h4 class="product-name">{{ d.name }}</h4>
      </div>
      <div class="fit-badge" :class="scoreClass">
        <span class="fit-label">적합도</span>
        <span class="fit-value">{{ (item.fit_score * 100).toFixed(0) }}%</span>
      </div>
    </div>

    <!-- Rate Display -->
    <div class="rate-display">
      <div class="rate-main">
        <span class="rate-number">{{ d.intr_rate2 }}</span>
        <span class="rate-unit">%</span>
      </div>
      <div class="rate-info">
        <span class="rate-type">최고금리 (연)</span>
        <span class="rate-base">기본 {{ d.intr_rate }}%</span>
      </div>
    </div>

    <!-- Quick Info -->
    <div class="quick-info">
      <div class="info-chip">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        {{ d.save_trm }}개월
      </div>
      <div class="info-chip" :class="item.kind">
        {{ item.kind === 'deposit' ? '예금' : '적금' }}
      </div>
      <div v-if="joinWayTags.includes('스마트폰')" class="info-chip mobile">
        모바일
      </div>
    </div>

    <!-- Simulation (적금) - 사용자 월납입액 기준 만기 시 이자 -->
    <div v-if="item.kind === 'saving' && interestSimulation" class="simulation-box">
      <div class="sim-header">
        <span class="sim-title">월 {{ formatCompact(interestSimulation.monthlyDeposit) }} × {{ interestSimulation.months }}개월</span>
      </div>
      <div class="sim-row">
        <div class="sim-item">
          <span class="sim-label">총 납입액</span>
          <span class="sim-value">{{ formatCompact(interestSimulation.principal) }}</span>
        </div>
        <div class="sim-arrow">→</div>
        <div class="sim-item highlight">
          <span class="sim-label">만기수령(세전)</span>
          <span class="sim-value">{{ formatCompact(interestSimulation.total) }}</span>
        </div>
        <div class="sim-interest">+{{ formatCompact(interestSimulation.interest) }}</div>
      </div>
      <div class="sim-tax-row">
        <span class="sim-tax-label">세후(15.4%↓)</span>
        <span class="sim-tax-value">{{ formatCompact(interestSimulation.totalAfterTax) }}</span>
        <span class="sim-tax-interest">+{{ formatCompact(interestSimulation.interestAfterTax) }}</span>
      </div>
    </div>

    <!-- Simulation (예금) - 보유금 기준 만기 시 이자 -->
    <div v-if="item.kind === 'deposit' && depositSimulation" class="simulation-box deposit">
      <div class="sim-header">
        <span class="sim-title">{{ depositSimulation.months }}개월 예치</span>
      </div>
      <div class="sim-row">
        <div class="sim-item">
          <span class="sim-label">예치금</span>
          <span class="sim-value">{{ formatCompact(depositSimulation.principal) }}</span>
        </div>
        <div class="sim-arrow">→</div>
        <div class="sim-item highlight">
          <span class="sim-label">만기수령(세전)</span>
          <span class="sim-value">{{ formatCompact(depositSimulation.total) }}</span>
        </div>
        <div class="sim-interest">+{{ formatCompact(depositSimulation.interest) }}</div>
      </div>
      <div class="sim-tax-row">
        <span class="sim-tax-label">세후(15.4%↓)</span>
        <span class="sim-tax-value">{{ formatCompact(depositSimulation.totalAfterTax) }}</span>
        <span class="sim-tax-interest">+{{ formatCompact(depositSimulation.interestAfterTax) }}</span>
      </div>
    </div>

    <!-- AI Reason -->
    <div class="reason-box">
      <p class="reason-text">"{{ item.reason }}"</p>
    </div>

    <!-- Actions -->
    <div class="card-actions">
      <button class="action-btn like" :class="{ active: isLiked }" @click.stop="handleLike">
        <svg viewBox="0 0 24 24" :fill="isLiked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      <button class="action-btn select" :class="{ active: isSelected }" @click.stop="handleSelect">
        <svg v-if="!isSelected" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        {{ isSelected ? '선택됨' : '선택' }}
      </button>
      <button class="action-btn detail" @click.stop="toggleDetail">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="1"/>
          <circle cx="19" cy="12" r="1"/>
          <circle cx="5" cy="12" r="1"/>
        </svg>
      </button>
    </div>

    <!-- Expandable Details -->
    <div v-if="showDetail" class="detail-panel">
      <div class="detail-section">
        <h5 class="detail-title">가입 방법</h5>
        <div class="detail-tags">
          <span v-for="tag in joinWayTags" :key="tag" class="detail-tag">{{ tag }}</span>
        </div>
      </div>
      <div class="detail-section">
        <h5 class="detail-title">우대 조건</h5>
        <p class="detail-text">{{ d.spcl_cnd || '우대 조건 정보가 없습니다.' }}</p>
      </div>
      <div v-if="d.max_limit" class="detail-section">
        <h5 class="detail-title">가입 한도</h5>
        <p class="detail-text">{{ d.max_limit.toLocaleString() }}원</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useLikeStore } from '@/stores/like'
import { useAccountStore } from '@/stores/accounts'
import { useAnalysisStore } from '@/stores/analysis'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  monthlyAmount: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['product-selected'])

const d = props.item.detail
const plan = props.item.plan

/**
 * ✅ 폴더 전체를 "한 번에 import" 하는 Vite 방식
 * - src/assets/banks/ 폴더에 있는 png들을 자동으로 가져옴
 * - key는 "/src/assets/banks/파일명.png" 형태로 만들어짐
 */
const bankLogos = import.meta.glob('@/assets/banks/*.png', {
  eager: true,
  import: 'default',
})

/**
 * ✅ 은행명(bank) -> 로고 파일명 매핑
 * - ProductListItem.vue 의 BANK_FILE_MAP 과 동일한 키 형식을 쓴다
 */
const BANK_FILE_MAP = {
  // 시중은행
  국민은행: '국민은행.png',
  신한은행: '신한은행.png',
  우리은행: '우리은행.png',
  농협은행주식회사: '농협은행.png',
  중소기업은행: '기업은행.png',
  한국산업은행: '산업은행.png',
  '주식회사 하나은행': '하나은행.png',
  씨티뱅크: '씨티뱅크.png',
  한국씨티은행: 'citi.png',

  // 인터넷은행
  '주식회사 카카오뱅크': '카카오뱅크.png',
  '주식회사 케이뱅크': '케이뱅크.png',
  '토스뱅크 주식회사': '토스뱅크.png',

  // 지방은행
  부산은행: '부산은행.png',
  경남은행: '경남은행.png',
  아이엠뱅크: '아이엠뱅크.png',
  광주은행: '광주은행.png',
  제주은행: '제주은행.png',
  전북은행: '전북은행.png',
  수협은행: '수협은행.png',
  한국스탠다드차타드은행: 'sc제일은행.png',
}

/**
 * ✅ 은행명으로 로고 src 찾기
 * - 매핑이 없으면 null → 이니셜 배지로 폴백
 */
const bankLogoSrc = computed(() => {
  const name = (d?.bank || '').trim()
  if (!name) return null

  const fileName = BANK_FILE_MAP[name]
  if (!fileName) return null

  return (
    bankLogos[`/src/assets/banks/${fileName}`] ||
    bankLogos[`@/assets/banks/${fileName}`] ||
    null
  )
})

const likeStore = useLikeStore()
const accountStore = useAccountStore()
const analysisStore = useAnalysisStore()

const isLiked = ref(false)
const isSelected = ref(false)
const showDetail = ref(false)

// 상품 타입 결정 (deposit/saving)
const productType = computed(() => {
  return props.item.kind === 'deposit' ? 'deposit' : 'saving'
})

// 이자 시뮬레이션 계산 (적금용) - 사용자 월납입액 기준으로 만기 시 이자 계산
const interestSimulation = computed(() => {
  if (props.item.kind !== 'saving' || !d?.intr_rate2 || !d?.save_trm) {
    return null
  }
  
  // ★ 사용자가 입력한 월납입액 사용 (analysisStore에서 가져옴)
  let monthlyDeposit = props.monthlyAmount
  if (!monthlyDeposit) {
    // store에서 월납입액 가져오기
    monthlyDeposit = analysisStore.result?.goal_math?.monthly_amount || 0
  }
  if (!monthlyDeposit) {
    monthlyDeposit = 500000 // 기본값 50만원
  }
  
  // ★ 상품의 만기 기간 사용 (사용자 목표기간이 아님)
  const months = parseInt(d.save_trm)
  const rate = parseFloat(d.intr_rate2) / 100
  
  // ★ 만기까지 납입 시 원금과 이자 (세전)
  const principal = monthlyDeposit * months
  const interest = Math.round(monthlyDeposit * (months * (months + 1) / 2) * (rate / 12))
  const total = principal + interest
  
  // ★ 세후 이자 (15.4% 공제)
  const TAX_RATE = 0.154
  const interestAfterTax = Math.round(interest * (1 - TAX_RATE))
  const totalAfterTax = principal + interestAfterTax
  
  return { monthlyDeposit, months, rate: d.intr_rate2, principal, interest, total, interestAfterTax, totalAfterTax }
})

// 이자 시뮬레이션 계산 (예금용) - 사용자 보유금 기준으로 만기 시 이자 계산
const depositSimulation = computed(() => {
  if (props.item.kind !== 'deposit' || !d?.intr_rate2 || !d?.save_trm) {
    return null
  }
  
  // ★ 사용자의 현재 보유금 사용 (analysisStore에서 가져옴)
  let principal = analysisStore.result?.goal_math?.current_savings || 0
  if (!principal) {
    principal = 5000000 // 기본값 500만원
  }
  
  const months = parseInt(d.save_trm)
  const rate = parseFloat(d.intr_rate2) / 100
  
  // 예금 이자 (단리, 세전)
  const interest = Math.round(principal * rate * (months / 12))
  const total = principal + interest
  
  // ★ 세후 이자 (15.4% 공제)
  const TAX_RATE = 0.154
  const interestAfterTax = Math.round(interest * (1 - TAX_RATE))
  const totalAfterTax = principal + interestAfterTax
  
  return { principal, months, rate: d.intr_rate2, interest, total, interestAfterTax, totalAfterTax }
})

onMounted(() => {
  checkLikeStatus()
  checkSelectedStatus()
})

const checkLikeStatus = () => {
  if (accountStore.token && d?.fin_prdt_cd) {
    const found = likeStore.likes.find(
      (like) => like.fin_prdt_cd === d.fin_prdt_cd && like.product_type === productType.value
    )
    isLiked.value = !!found
  }
}

const checkSelectedStatus = () => {
  if (d?.fin_prdt_cd) {
    isSelected.value = analysisStore.isProductSelected(d.fin_prdt_cd, productType.value)
  }
}

const handleLike = async () => {
  if (!accountStore.token) {
    alert('로그인이 필요합니다.')
    return
  }
  
  try {
    await likeStore.toggleLike({
      fin_prdt_cd: d.fin_prdt_cd,
      product_type: productType.value,
    })
    isLiked.value = !isLiked.value
  } catch (err) {
    console.error('좋아요 토글 실패:', err)
  }
}

const handleSelect = () => {
  if (!accountStore.token) {
    alert('로그인이 필요합니다.')
    return
  }
  
  const productData = {
    fin_prdt_cd: d.fin_prdt_cd,
    product_type: productType.value,
    name: d.name,
    bank: d.bank,
    intr_rate: d.intr_rate,
    intr_rate2: d.intr_rate2,
    save_trm: d.save_trm,
    simulation: interestSimulation.value,
    selected_at: new Date().toISOString(),
  }
  
  if (isSelected.value) {
    analysisStore.removeSelectedProduct(d.fin_prdt_cd, productType.value)
  } else {
    analysisStore.addSelectedProduct(productData)
  }
  
  isSelected.value = !isSelected.value
  emit('product-selected', { product: productData, selected: isSelected.value })
}

const toggleDetail = () => {
  showDetail.value = !showDetail.value
}

const formatCurrency = (value) => {
  if (!value) return '0원'
  return value.toLocaleString() + '원'
}

const formatCompact = (value) => {
  if (!value) return '0'
  if (value >= 100000000) {
    return (value / 100000000).toFixed(1) + '억'
  } else if (value >= 10000) {
    return (value / 10000).toFixed(0) + '만원'
  }
  return value.toLocaleString() + '원'
}

const joinWayTags = computed(() =>
  d?.join_way?.split(',').map(v => v.trim()) || []
)

const scoreClass = computed(() => {
  const score = props.item.fit_score * 100
  if (score >= 80) return 'excellent'
  if (score >= 60) return 'good'
  return 'normal'
})
</script>

<style scoped>
.product-card {
  background: var(--n-bg);
  border-radius: var(--n-radius-lg);
  padding: 24px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.product-card:hover {
  box-shadow: none;
}

.product-card.selected {
  border-color: var(--n-accent);
}

/* Header */
.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.bank-badge {
  width: 40px;
  height: 40px;
  background: var(--n-bg);
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

/* 로고가 없는 은행은 accent 배경 + 이니셜로 폴백한다 */
.bank-badge:has(.bank-initial) {
  background: var(--n-accent);
  border-color: var(--n-accent);
}

.bank-initial {
  color: var(--n-on-accent);
  font-size: 18px;
  font-weight: 700;
}

.bank-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

/* 은행 로고 — 흰 배경 전제 이미지라 다크모드에서도 밝은 타일을 유지한다 */
[data-theme='dark'] .bank-logo-img {
  background: #f5f5f4;
}

.header-content {
  flex: 1;
  min-width: 0;
}

.bank-name {
  font-size: 16px;
  color: var(--n-text-muted);
  font-weight: 500;
}

.product-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--n-text);
  margin: 6px 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fit-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 14px;
  border-radius: var(--n-radius-md);
  flex-shrink: 0;
}

.fit-badge.excellent {
  background: #f6f6f8;
}

.fit-badge.good {
  background: var(--n-warn-bg);
}

.fit-badge.normal {
  background: var(--n-bg-sunken);
}

.fit-label {
  font-size: 16px;
  color: var(--n-text);
}

.fit-badge.excellent .fit-value {
  color: var(--n-ok-text);
}

.fit-badge.good .fit-value {
  color: var(--n-warn-text);
}

.fit-badge.normal .fit-value {
  color: var(--n-text-muted);
}

.fit-value {
  font-size: 18px;
  font-weight: 800;
}

/* Rate Display */
.rate-display {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background: var(--n-accent-wash) 0%, var(--n-accent-wash) 100%;
  border-radius: var(--n-radius-md);
  margin-bottom: 16px;
}

.rate-main {
  display: flex;
  align-items: baseline;
}

.rate-number {
  font-size: 34px;
  font-weight: 800;
  color: #da5252;
  line-height: 1;
}

.rate-unit {
  font-size: 18px;
  font-weight: 700;
  color: #da5252;
  margin-left: 6px;
}

.rate-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rate-type {
  font-size: 16px;
  color: #da5252;
  font-weight: 600;
}

.rate-base {
  font-size: 16px;
  color: var(--n-text-muted);
}

/* Quick Info */
.quick-info {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.info-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  background: #f3f3f3;
  border-radius: var(--n-radius-sm);
  font-size: 16px;
  font-weight: 600;
  color: var(--n-text-body);
}

.info-chip svg {
  width: 12px;
  height: 12px;
}

.info-chip.deposit {
  background: var(--n-info-bg);
  color: var(--n-info-text);
}

.info-chip.saving {
  background: var(--n-ok-bg);
  color: var(--n-ok-text);
}

.info-chip.mobile {
  background: var(--n-warn-bg);
  color: var(--n-warn-text);
}

/* Simulation Box */
.simulation-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #f9f9fa;
  border-radius: var(--n-radius-md);
  margin-bottom: 16px;
}

.simulation-box.deposit {
  background: #f9f9fa;
}

.sim-header {
  display: flex;
  justify-content: center;
}

.sim-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--n-text);
  background: var(--n-bg);
  padding: 6px 12px;
  border-radius: var(--n-radius-sm);
}

.simulation-box.deposit .sim-title {
  color: var(--n-text);
}

.sim-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sim-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.sim-label {
  font-size: 16px;
  color: var(--n-text-muted);
}

.sim-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--n-text);
}

.sim-item.highlight .sim-value {
  color: var(--n-ok-text);
}

.simulation-box.deposit .sim-item.highlight .sim-value {
  color: var(--n-info-text);
}

.sim-arrow {
  color: var(--n-text-muted);
  font-size: 18px;
  font-weight: 500;
}

.sim-interest {
  padding: 8px 12px;
  background: var(--n-bg);
  border-radius: var(--n-radius-sm);
  font-size: 18px;
  font-weight: 700;
  color: #da5252;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.simulation-box.deposit .sim-interest {
  color: #db4343;
}

/* 세후 이자 표시 */
.sim-tax-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 10px;
  border-top: 1px dashed var(--n-border-strong);
  margin-top: 10px;
}

.sim-tax-label {
  font-size: 16px;
  color: var(--n-text-muted);
}

.sim-tax-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--n-text-body);
}

.sim-tax-interest {
  font-size: 16px;
  font-weight: 600;
  color: var(--n-text-muted);
  background: var(--n-bg-sunken);
  padding: 6px 10px;
  border-radius: var(--n-radius-sm);
}

/* Reason Box */
.reason-box {
  padding: 16px;
  background: #f9f9fa;
  border-radius: var(--n-radius-md);
  margin-bottom: 16px;
}

.reason-text {
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
  font-style: italic;
}

/* Actions */
.card-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px;
  border-radius: var(--n-radius-md);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn.like {
  width: 40px;
  background: var(--n-bg-sunken);
  color: var(--n-text-muted);
}

.action-btn.like:hover {
  background: var(--n-accent-wash);
  color: var(--n-accent);
}

.action-btn.like.active {
  background: var(--n-accent-wash);
  color: #d46363;
}

.action-btn.select {
  flex: 1;
  background: #e0e0e0;
  color: var(--n-on-accent);
}

.action-btn.select.active {
  background: #bba7eb;
}

.action-btn.detail {
  width: 40px;
  background: var(--n-bg-sunken);
  color: var(--n-text-muted);
}

.action-btn.detail:hover {
  background: var(--n-border);
}

/* Detail Panel */
.detail-panel {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--n-border);
}

.detail-section {
  margin-bottom: 16px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--n-text-muted);
  margin: 0 0 10px;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.detail-tag {
  padding: 8px 12px;
  background: var(--n-bg-sunken);
  border-radius: var(--n-radius-sm);
  font-size: 16px;
  color: var(--n-text-body);
}

.detail-text {
  font-size: 16px;
  color: var(--n-text-body);
  line-height: 1.5;
  margin: 0;
}</style>
