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
   상품 카드 — 연한 면(--n-fill) 위에 흰 타일을 올린다.
   보더 없이 hover 때 살짝 떠오르며 그림자가 생긴다.
   ═══════════════════════════════════════════════════════════════════ */
.product-card {
  display: flex;
  flex-direction: column;
  padding: 28px;
  border-radius: 28px;
  background: var(--n-fill);
  /* 카드 가장자리를 살짝 띄우는 옅은 그림자 */
  box-shadow: 0 2px 4px rgba(29, 26, 43, 0.06), 0 12px 28px rgba(49, 32, 110, 0.11);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--n-shadow-hover);
}

.product-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.product-type-badge {
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--n-surface);
  font-size: 16px;
  font-weight: 700;
  color: var(--n-violet);
}

.product-type-badge.saving {
  color: #8a5aa0;
}

.product-bank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 124px;
  height: 52px;
  padding: 8px 14px;
  box-sizing: border-box;
  border-radius: 16px;
  background: #ffffff;   /* 로고 이미지가 흰 바탕 전제라 다크모드에서도 흰 타일 유지 */
}

.product-card-body {
  flex: 1;
  padding: 0;
}

.product-name {
  margin: 30px 0 40px;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.03em;
  color: var(--n-title);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 기본금리 / 최고금리 — 흰 타일 두 개 */
.product-rates {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 16px;
}

.rate-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 12px;
  border-radius: 20px;
  background: var(--n-surface);
  white-space: nowrap;
}

.rate-label {
  font-size: 16px;
  font-weight: 500;
  color: var(--n-fg-muted);
}

.rate-value {
  display: flex;
  align-items: center;
  height: 42px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: var(--n-fg);
}

/* 최고금리 — 금리 강조 레드 */
.rate-max .rate-value {
  font-size: 26px;
  font-weight: 800;
  color: var(--n-red);
}

.product-terms {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.term-badge {
  padding: 5px 12px;
  border-radius: 999px;
  background: var(--n-surface);
  font-size: 16px;
  font-weight: 600;
  color: var(--n-fg-muted);
}

.product-card-footer {
  margin-top: 24px;
}

/* 상세정보 — 오른쪽 원형 화살표 버튼, 카드 hover 때 바이올렛 */
.detail-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 600;
  color: var(--n-fg);
  text-decoration: none;
}

.detail-link svg {
  width: 44px;
  height: 44px;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 50%;
  background: var(--n-surface);
  color: var(--n-fg);
  transition: background-color 0.25s, color 0.25s;
}

.product-card:hover .detail-link svg {
  background: var(--n-violet);
  color: var(--n-on-accent);
}

/* 은행 로고 */
.bank-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.bank-logo-img.logo-large {
  transform: scale(1.3);
}
</style>
