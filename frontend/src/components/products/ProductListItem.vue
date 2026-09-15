<template>
  <article class="product-card">
    <div class="product-card-header">
      <div class="product-type-badge" :class="type">
        {{ type === "deposit" ? "예금" : "적금" }}
      </div>

      <div class="product-bank">
        <img
          v-if="bankLogoSrc"
          :src="bankLogoSrc"
          :alt="product.kor_co_nm"
          class="bank-logo-img"
          :class="bankLogoClass"
          loading="lazy"
        />
      </div>
    </div>

    <div class="product-card-body">
      <h3 class="product-name">{{ product.fin_prdt_nm }}</h3>

      <div v-if="product.options && product.options.length > 0" class="product-rates">
        <div class="rate-item">
          <span class="rate-label">기본금리</span>
          <span class="rate-value">{{ getMaxBasicRate }}%</span>
        </div>
        <div class="rate-item rate-max">
          <span class="rate-label">최고금리</span>
          <span class="rate-value">{{ getMaxPreferRate }}%</span>
        </div>
      </div>

      <div class="product-terms">
        <span v-for="term in uniqueTerms.slice(0, 4)" :key="term" class="term-badge">
          {{ term }}개월
        </span>
        <span v-if="uniqueTerms.length > 4" class="term-badge term-more">
          +{{ uniqueTerms.length - 4 }}
        </span>
      </div>
    </div>

    <div class="product-card-footer">
      <RouterLink
        :to="{ name: 'ProductDetailView', params: { type, fin_prdt_cd: product.fin_prdt_cd } }"
        class="detail-link"
      >
        상세정보
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      </RouterLink>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue"

/**
 * ✅ 폴더 전체를 "한 번에 import" 하는 Vite 방식
 * - src/assets/banks/ 폴더에 있는 png들을 자동으로 가져옴
 * - key는 "/src/assets/banks/파일명.png" 형태로 만들어짐
 */
const bankLogos = import.meta.glob("@/assets/banks/*.png", {
  eager: true,
  import: "default",
})

const props = defineProps({
  product: Object,
  type: String,
})

/**
 * ✅ 은행명(kor_co_nm) -> 로고 파일명 매핑
 * - 여기 파일명은 src/assets/banks/ 안의 실제 파일명과 동일해야 함
 * - 예: src/assets/banks/kb.png
 */
const BANK_FILE_MAP = {
  // 시중은행
  국민은행: "국민은행.png",
  신한은행: "신한은행.png",
  우리은행: "우리은행.png",
  농협은행주식회사: "농협은행.png",
  중소기업은행: "기업은행.png",
  한국산업은행: "산업은행.png",
  '주식회사 하나은행': "하나은행.png",
  씨티뱅크: "씨티뱅크.png",
  한국씨티은행: "citi.png",

  // 인터넷은행
  '주식회사 카카오뱅크': "카카오뱅크.png",
  '주식회사 케이뱅크': "케이뱅크.png",
  '토스뱅크 주식회사': "토스뱅크.png",

  // 지방은행
  부산은행: "부산은행.png",
  경남은행: "경남은행.png",
  아이엠뱅크: "아이엠뱅크.png",
  광주은행: "광주은행.png",
  제주은행: "제주은행.png",
  전북은행: "전북은행.png",
  수협은행: "수협은행.png",
  한국스탠다드차타드은행: "sc제일은행.png",
}
const bankLogoClass = computed(() => {
  const name = props.product?.kor_co_nm || ""

  // 로고를 크게 보여주고 싶은 은행 목록
  const largeLogoBanks = [
    "경남은행",
    "토스뱅크 주식회사",
  ]

  return largeLogoBanks.some((bank) => name.includes(bank))
    ? "logo-large"
    : ""
})


/**
 * ✅ 현재 상품 은행명으로 로고 src 찾기
 * - 로고 없으면 null -> 기본 아이콘 노출
 */
const bankLogoSrc = computed(() => {
  const name = (props.product?.kor_co_nm || "").trim()
  if (!name) return null

  const fileName = BANK_FILE_MAP[name]
  if (!fileName) return null

  return (
    bankLogos[`/src/assets/banks/${fileName}`] ||
    bankLogos[`@/assets/banks/${fileName}`] ||
    null
  )
})

const getMaxBasicRate = computed(() => {
  if (!props.product.options || props.product.options.length === 0) return "-"
  const rates = props.product.options.map((opt) => Number(opt.intr_rate) || 0)
  return Math.max(...rates).toFixed(2)
})

const getMaxPreferRate = computed(() => {
  if (!props.product.options || props.product.options.length === 0) return "-"
  const rates = props.product.options.map((opt) => Number(opt.intr_rate2) || 0)
  return Math.max(...rates).toFixed(2)
})

const uniqueTerms = computed(() => {
  if (!props.product.options) return []
  const terms = props.product.options.map((opt) => Number(opt.save_trm)).filter((t) => !isNaN(t))
  return [...new Set(terms)].sort((a, b) => a - b)
})
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════
   상품 카드 — 무채색. 그림자 대신 보더, hover 는 보더 변화로 절제.
   ═══════════════════════════════════════════════════════════════════ */
.product-card {
  display: flex;
  flex-direction: column;
  background: var(--n-bg);
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-md);
  overflow: hidden;
  transition: border-color 0.18s ease;
}

.product-card:hover {
  border-color: var(--n-border-strong);
}

.product-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 72px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--n-border);
}

.product-type-badge {
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-sm);
  background: #efeff8;
  color: #54599c;
}

/* 예금/적금 구분은 색 대신 굵기·배경 농도의 차이로만 준다 */
.product-type-badge.saving {
  background: var(--n-accent-wash);
  border-color: var(--n-accent-wash);
  color: #8e75bd;
}

.product-bank {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bank-name {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--n-text-muted);
}

.product-card-body {
  flex: 1;
  padding: 20px;
}

.product-name {
  margin-bottom: 18px;
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.45;
  letter-spacing: -0.015em;
  color: var(--n-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 보더 중첩을 걷어내고 하나의 면 위에 두 값을 나란히 둔다.
   구분은 가운데 세로선 하나로만 준다. */
.product-rates {
  display: flex;
  gap: 0;
  margin-bottom: 16px;
  background: #f7f7f8;
  border-radius: var(--n-radius-md);
  overflow: hidden;
}

/* 라벨은 위쪽 기준으로 맞추고, 값은 남는 공간에서 세로 중앙 정렬한다.
   두 칸의 폰트 크기가 달라도(기본금리 1.125rem / 최고금리 1.625rem)
   라벨 위치와 값 중심이 각각 일치한다. */
.rate-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 12px;
  text-align: center;
  white-space: nowrap;
}

/* 두 값 사이 구분선 — 보더 박스가 아니라 선 하나 */
.rate-item + .rate-item {
  border-left: 1px solid var(--n-border);
}

.rate-label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--n-text-muted);
}

.rate-value {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: var(--n-text-body);
}

/* 최고금리 — 시선이 먼저 가는 자리.
   글자색·크기로만 강조한다. 보더나 배경을 겹치면 오히려 뭉개진다. */
.rate-max .rate-value {
  font-size: 1.625rem;
  font-weight: 700;
  color: #df4b4b;
}

.product-terms {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.term-badge {
  padding: 4px 9px;
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--n-text-muted);
  background: var(--n-bg-subtle);
  border-radius: var(--n-radius-sm);
}

.term-more {
  color: var(--n-text-muted);
}

.product-card-footer {
  padding: 14px 20px;
  border-top: 1px solid var(--n-border);
}

.detail-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #353536;
  text-decoration: none;
  transition: color 0.18s ease;
}

.detail-link:hover {
  color: var(--n-accent-hover);
}

.detail-link svg {
  width: 15px;
  height: 15px;
  transition: transform 0.18s ease;
}

.detail-link:hover svg {
  transform: translateX(3px);
}

/* 은행 로고 — 흰 배경 전제 이미지라 다크모드에서도 밝은 타일을 유지한다 */
.bank-logo-img {
  width: 80px;
  height: 32px;
  object-fit: contain;
}

.bank-logo-img.logo-large {
  width: 100px;
  height: 75px;
}

/* ═══════════════════════════════════════════════════════════════════
   Dark mode — 토큰이 대부분 처리한다. 예외만 남긴다.
   ═══════════════════════════════════════════════════════════════════ */
[data-theme='dark'] .bank-logo-img {
  padding: 2px 4px;
  border-radius: var(--n-radius-sm);
  background: #f5f5f4;
}
</style>
