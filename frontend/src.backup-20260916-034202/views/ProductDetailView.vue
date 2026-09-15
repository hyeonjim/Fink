<template>
  <div class="product-detail-page">
    <div class="container">
      <!-- Back Button -->
      <RouterLink :to="{ name: 'ProductView' }" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5"/>
          <path d="M12 19l-7-7 7-7"/>
        </svg>
        상품 목록으로
      </RouterLink>

      <div v-if="product" class="product-detail-container">
        <!-- Header Card -->
        <div class="product-header-card">
          <div class="product-bank-info">
            <div class="bank-logo-large">
              <img
                v-if="bankLogoSrc"
                :src="bankLogoSrc"
                :alt="product.kor_co_nm"
                class="bank-logo-img-large"
                loading="lazy"
              />
            </div>
          </div>
          
          <h1 class="product-title">{{ product.fin_prdt_nm }}</h1>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button
              @click="toggleLike"
              class="like-btn"
              :class="{ liked: likeStore.liked }"
              type="button"
            >
              <svg v-if="!likeStore.liked" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span>{{ likeStore.liked ? '관심상품' : '관심등록' }}</span>
              <span class="like-count">{{ likeStore.likesCount ?? 0 }}</span>
            </button>

            <button
              v-if="likeStore.liked && product"
              @click="toggleMap"
              class="map-btn"
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {{ showMap ? '지도 닫기' : '은행 위치 찾기' }}
            </button>
          </div>
        </div>

        <!-- Details Card — 헤더 카드 밖 독립 카드로 분리 -->
        <div class="details-card">
          <h2 class="card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <path d="M14 2v6h6"/>
              <path d="M16 13H8"/>
              <path d="M16 17H8"/>
              <path d="M10 9H8"/>
            </svg>
            상품 상세정보
          </h2>

          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">가입 대상</span>
              <span class="detail-value">{{ product.join_member || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">가입 방법</span>
              <span class="detail-value">{{ product.join_way || '-' }}</span>
            </div>
            <div class="detail-item detail-full">
              <span class="detail-label">우대조건</span>
              <span class="detail-value">{{ product.spcl_cnd || '-' }}</span>
            </div>
            <div class="detail-item detail-full">
              <span class="detail-label">기타 사항</span>
              <span class="detail-value">{{ product.etc_note || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- Map Section -->
        <ProductBankMap
          v-if="showMap && product"
          :bank-name="product.kor_co_nm"
          @close="showMap = false"
        />

        <!-- Rate Options Card -->
        <div v-if="options.length" class="options-card">
          <h2 class="card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M16 8l-4 4-4-4"/>
              <path d="M8 16l4-4 4 4"/>
            </svg>
            금리 옵션
          </h2>
          
          <div class="options-table-wrapper">
            <table class="options-table">
              <thead>
                <tr>
                  <th>가입기간</th>
                  <th>금리유형</th>
                  <th>기본금리</th>
                  <th>최고금리</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="option in options" :key="option.id">
                  <td>
                    <span class="term-value">{{ option.save_trm }}</span>
                    <span class="term-unit">개월</span>
                  </td>
                  <td>{{ option.intr_rate_type_nm }}</td>
                  <td class="rate-cell">{{ option.intr_rate }}%</td>
                  <td class="rate-cell rate-max">{{ option.intr_rate2 }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- Loading State -->
      <div v-else class="loading-state">
        <div class="loading-spinner"></div>
        <p>상품 정보를 불러오는 중...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { useLikeStore } from '@/stores/like'
import { useAccountStore } from '@/stores/accounts'
import ProductBankMap from '@/components/products/ProductBankMap.vue'
import { USE_MOCK, delay } from '@/mocks/config'
import { getProductDetail } from '@/mocks/products'


/* banks 폴더 png 전체 import */
const bankLogos = import.meta.glob('@/assets/banks/*.png', {
  eager: true,
  import: 'default',
})

/* 은행명 → 파일명 매핑 */
const BANK_FILE_MAP = {
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

/* 상세페이지용 은행 로고 src */
const bankLogoSrc = computed(() => {
  if (!product.value?.kor_co_nm) return null

  const name = product.value.kor_co_nm.trim()
  const fileName = BANK_FILE_MAP[name]
  
  if (!fileName) return null

  return (
    bankLogos[`/src/assets/banks/${fileName}`] ||
    bankLogos[`@/assets/banks/${fileName}`] ||
    null
  )
})


const store = useProductStore()
const likeStore = useLikeStore()
const accountStore = useAccountStore()
const route = useRoute()

const product = ref(null)
const options = ref([])
const showMap = ref(false)

const toggleLike = function () {
  const payload = {
    fin_prdt_cd: route.params.fin_prdt_cd,
    product_type: route.params.type,
  }

  likeStore.toggleLike(payload)
    .then(() => {})
    .catch((err) => {
      console.error('좋아요 처리 실패:', err)
      alert('좋아요 처리에 실패했습니다.')
    })
}

const toggleMap = () => {
  showMap.value = !showMap.value
}

watch(() => likeStore.liked, (newVal) => {
  if (!newVal) showMap.value = false
})

onMounted(() => {
  // === 목업 모드 분기 ===
  // 이 화면은 스토어를 거치지 않고 뷰에서 직접 axios 를 호출하므로 여기서 분기한다
  if (USE_MOCK) {
    delay(getProductDetail(route.params.type, route.params.fin_prdt_cd))
      .then((data) => {
        if (!data) {
          console.error('상품 정보 로드 실패: 해당 상품을 찾을 수 없습니다.')
          return
        }

        product.value = data
        options.value = data.options
        likeStore.liked = data.is_liked ?? false
        likeStore.likesCount = data.likes_count ?? 0
      })
    return
  }

  // === 실제 API 호출 (백엔드 연결 시) ===
  axios({
    method: 'get',
    url: `${store.API_URL}/api/products/${route.params.type}/${route.params.fin_prdt_cd}/`,
    headers: accountStore.token ? { Authorization: `Token ${accountStore.token}` } : {},
  })
    .then((res) => {
      product.value = res.data
      options.value = res.data.options
      likeStore.liked = res.data.is_liked ?? res.data.liked ?? false
      likeStore.likesCount = res.data.likes_count ?? 0
    })
    .catch((err) => console.error('상품 정보 로드 실패:', err))
})
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════
   상품 상세 — 무채색. 그림자 대신 보더로 카드를 구분한다.
   ═══════════════════════════════════════════════════════════════════ */
.product-detail-page {
  min-height: calc(100vh - 72px);
  padding: 48px 24px 80px;
  background: var(--n-bg);
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

/* ── 뒤로가기 ────────────────────────────────────────────────────── */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--n-text-muted);
  text-decoration: none;
  transition: color 0.18s ease;
}

.back-link:hover {
  color: var(--n-text);
}

.back-link svg {
  width: 17px;
  height: 17px;
  transition: transform 0.18s ease;
}

.back-link:hover svg {
  transform: translateX(-3px);
}

/* ── 헤더 카드 ───────────────────────────────────────────────────── */
.product-header-card {
  margin-bottom: 20px;
  padding: 28px;
  border: 1px solid var(--n-border);
  border-radius: 12px;
  background: var(--n-bg);
  box-shadow: none;
}

.product-badge-row {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
}

.product-type-badge,
.product-join-badge {
  padding: 4px 11px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--n-border);
  border-radius: 6px;
  background: var(--n-bg-subtle);
  color: var(--n-text-body);
}

.product-type-badge.saving {
  border-color: var(--n-accent-wash);
  background: var(--n-accent-wash);
  color: var(--n-accent);
}

.product-bank-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.bank-logo-large {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 30px;
}

.bank-name-large {
  font-size: 1rem;
  font-weight: 500;
  color: var(--n-text-muted);
}

.product-title {
  margin: 18px 0 40px;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.025em;
  color: var(--n-text);
}

/* ── 액션 버튼 ───────────────────────────────────────────────────── */
.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.like-btn,
.map-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 18px;
  font-size: 0.9375rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}

.like-btn {
  background: transparent;
  color: var(--n-text);
  border: 1px solid var(--n-border-strong);
}

.like-btn:hover {
  background: var(--n-bg-subtle);
  border-color: var(--n-text-muted);
}

.like-btn.liked {
  background: var(--n-accent);
  border-color: var(--n-accent);
  color: #fff;
}

.like-btn.liked:hover {
  background: var(--n-accent-hover);
  border-color: var(--n-accent-hover);
}

.like-btn svg {
  width: 17px;
  height: 17px;
}

.like-count {
  padding: 1px 7px;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.22);
}

.like-btn:not(.liked) .like-count {
  background: var(--n-bg-sunken);
  color: var(--n-text-muted);
}

.map-btn {
  background: transparent;
  color: var(--n-text);
  border: 1px solid var(--n-border-strong);
}

.map-btn:hover {
  background: var(--n-bg-subtle);
  border-color: var(--n-text-muted);
}

.map-btn svg {
  width: 17px;
  height: 17px;
}

/* ── 카드 ────────────────────────────────────────────────────────
   헤더·상세·금리옵션 세 카드가 같은 규격으로 균등하게 쌓인다. */
.details-card,
.options-card {
  margin-bottom: 20px;
  padding: 28px;
  border: 1px solid var(--n-border);
  border-radius: 12px;
  background: var(--n-bg);
  box-shadow: none;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 20px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--n-text);
}

.card-title svg {
  width: 18px;
  height: 18px;
  color: var(--n-text-muted);
}

/* ── 금리 옵션 표 ────────────────────────────────────────────────── */
.options-table-wrapper {
  overflow-x: auto;
  border: 1px solid var(--n-border);
  border-radius: 10px;
}

.options-table {
  width: 100%;
  border-collapse: collapse;
}

.options-table th {
  padding: 12px 14px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--n-text-muted);
  text-align: left;
  white-space: nowrap;
  background: var(--n-bg-subtle);
  border-bottom: 1px solid var(--n-border);
}

.options-table td {
  padding: 13px 14px;
  font-size: 0.9375rem;
  color: var(--n-text-body);
  border-bottom: 1px solid var(--n-border);
}

.options-table tr:last-child td {
  border-bottom: none;
}

.term-value {
  font-size: 1rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--n-text);
}

.term-unit {
  font-size: 0.875rem;
  color: var(--n-text-muted);
}

.rate-cell {
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--n-text);
}

.rate-cell.rate-max {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--n-accent);
}

/* ── 상세 정보 그리드 ────────────────────────────────────────────── */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-full {
  grid-column: span 2;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--n-text-muted);
}

.detail-value {
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--n-text-body);
}

/* ── 로딩 ────────────────────────────────────────────────────────── */
.loading-state {
  text-align: center;
  padding: 80px 24px;
  color: var(--n-text-muted);
}

.loading-spinner {
  width: 30px;
  height: 30px;
  margin: 0 auto 16px;
  border: 2px solid var(--n-border);
  border-top-color: var(--n-text-muted);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   Responsive
   ═══════════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .product-detail-page {
    padding: 32px 16px 64px;
  }

  .product-header-card,
  .details-card,
  .options-card {
    padding: 22px;
  }

  .product-title {
    font-size: 1.25rem;
    margin-bottom: 28px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-full {
    grid-column: span 1;
  }

  .action-buttons {
    flex-direction: column;
  }

  .like-btn,
  .map-btn {
    justify-content: center;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   Dark mode — 은행 로고는 흰 배경 전제 이미지라 타일을 밝게 유지한다.
   ═══════════════════════════════════════════════════════════════════ */
[data-theme='dark'] .bank-logo-img-large {
  padding: 2px 5px;
  border-radius: 6px;
  background: #f5f5f4;
}
</style>
