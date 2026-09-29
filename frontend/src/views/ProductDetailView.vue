<template>
  <div class="product-detail-page">
    <!-- Hero — 상품 제목 영역 (메인 히어로와 같은 그라데이션) -->
    <section class="detail-hero">
      <div class="container">
        <!-- Back Button -->
        <RouterLink :to="{ name: 'ProductView' }" class="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          상품 목록으로
        </RouterLink>

        <!-- Header Card -->
        <div v-if="product" class="product-header-card">
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
          
          <div class="product-title-area">
            <div class="product-badge-row">
              <span class="product-type-badge" :class="route.params.type">{{ route.params.type === 'saving' ? '적금' : '예금' }}</span>
              <span class="product-bank-chip">{{ product.kor_co_nm }}</span>
            </div>
            <h1 class="product-title">{{ product.fin_prdt_nm }}</h1>
          </div>

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
      </div>
    </section>

    <div class="container">
      <div v-if="product" class="product-detail-container">
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
   상품 상세 — 제목 영역은 메인 히어로 그라데이션, 본문 카드는
   흰 면 + 그림자. 보더를 쓰지 않는다.
   ═══════════════════════════════════════════════════════════════════ */
.product-detail-page {
  min-height: calc(100vh - 72px);
  background: var(--fk-bg);
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 24px 120px;
}

/* ── Hero ─────────────────────────────────────────────────────── */
.detail-hero {
  background: var(--fk-hero);
}

.detail-hero .container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 40px;
  padding-bottom: 30px;
}

.back-link {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 44px;
  margin-left: -14px;
  padding: 0 14px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--fk-muted);
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
}

.back-link:hover {
  background: rgba(255, 255, 255, 0.7);
  color: var(--fk-ink);
}

.back-link svg {
  width: 20px;
  height: 20px;
}

.product-header-card {
  display: flex;
  align-items: center;
  gap: 28px;
}

.product-bank-info {
  flex-shrink: 0;
}

.bank-logo-large {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 132px;
  height: 96px;
  padding: 20px 18px;
  box-sizing: border-box;
  border-radius: 28px;
  background: #ffffff;   /* 로고 이미지가 흰 바탕 전제 */
  box-shadow: 0 18px 40px rgba(49, 32, 110, 0.12);
}

.bank-logo-img-large {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-title-area {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-badge-row {
  display: flex;
  gap: 6px;
}

.product-type-badge {
  padding: 4px 12px;
  border-radius: 999px;
  background: #ffffff;
  font-size: 16px;
  font-weight: 700;
  color: var(--fk-violet);
}

.product-type-badge.saving {
  color: #8a5aa0;
}

.product-bank-chip {
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  font-weight: 600;
  color: var(--fk-muted);
}

.product-title {
  margin: 0;
  font-size: 36px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.035em;
  color: var(--fk-title);
}

/* ── 관심상품 / 은행 위치 ─────────────────────────────────────── */
.action-buttons {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.like-btn,
.map-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 56px;
  padding: 0 22px;
  border: 0;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.like-btn:hover,
.map-btn:hover {
  transform: translateY(-2px);
}

.like-btn svg,
.map-btn svg {
  width: 20px;
  height: 20px;
}

/* 관심등록 전 — 흰 버튼, 좋아요 레드 하트 */
.like-btn {
  background: #ffffff;
  color: var(--fk-like-hover);
}

/* 관심상품 — 좋아요 레드 */
.like-btn.liked {
  background: var(--fk-like);
  color: #ffffff;
}

.like-btn.liked:hover {
  background: var(--fk-like-hover);
}

.like-count {
  padding: 2px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  font-size: 16px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.like-btn:not(.liked) .like-count {
  background: #fdecee;
}

.map-btn {
  background: #ffffff;
  color: var(--fk-violet-hover);
}

.map-btn:hover {
  background: var(--fk-lilac);
}

/* ── 본문 카드 ─────────────────────────────────────────────────── */
.product-detail-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.details-card,
.options-card {
  padding: 40px;
  border-radius: 28px;
  background: var(--fk-card);
  box-shadow: var(--fk-shadow);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 24px;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--fk-title);
}

.card-title svg {
  width: 44px;
  height: 44px;
  padding: 11px;
  box-sizing: border-box;
  border-radius: 14px;
  background: var(--fk-surface);
  color: var(--fk-ink);
}

/* 상세정보 — 연한 면 타일 */
.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 24px;
  border-radius: 20px;
  background: var(--fk-surface);
}

.detail-full {
  grid-column: 1 / -1;
}

.detail-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--fk-muted);
}

.detail-value {
  font-size: 18px;
  font-weight: 500;
  line-height: 1.7;
  color: var(--fk-ink);
  white-space: pre-line;
}

/* 금리 옵션 표 — 머리행만 면, 행은 hover 때 면 */
.options-table-wrapper {
  overflow-x: auto;
}

.options-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 4px;
  text-align: center;
}

.options-table th {
  padding: 14px 24px;
  background: var(--fk-surface);
  font-size: 16px;
  font-weight: 600;
  color: var(--fk-muted);
}

.options-table th:first-child { border-radius: 16px 0 0 16px; }
.options-table th:last-child { border-radius: 0 16px 16px 0; }

.options-table td {
  padding: 18px 24px;
  font-size: 18px;
  font-weight: 500;
  color: var(--fk-muted);
  font-variant-numeric: tabular-nums;
  transition: background-color 0.2s;
}

.options-table tbody tr:hover td {
  background: var(--fk-surface);
}

.options-table td:first-child { border-radius: 16px 0 0 16px; }
.options-table td:last-child { border-radius: 0 16px 16px 0; }

.term-value {
  font-size: 22px;
  font-weight: 600;
  color: var(--fk-ink);
}

.term-unit {
  margin-left: 2px;
  font-size: 16px;
  color: var(--fk-muted);
}

.rate-cell {
  font-size: 20px;
  font-weight: 600;
  color: var(--fk-ink);
}

.rate-cell.rate-max {
  font-size: 22px;
  font-weight: 800;
  color: var(--fk-red);
}

/* ── 로딩 ─────────────────────────────────────────────────────── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 80px 0;
  font-size: 18px;
  color: var(--fk-muted);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--fk-lilac);
  border-top-color: var(--fk-violet);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ═══════════════════════════════════════════════════════════════════
   Responsive
   ═══════════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .product-header-card {
    flex-wrap: wrap;
    gap: 20px;
  }

  .product-title {
    font-size: 30px;
  }

  .action-buttons {
    flex-direction: row;
    width: 100%;
  }

  .like-btn,
  .map-btn {
    flex: 1;
  }

  .details-card,
  .options-card {
    padding: 24px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
