<template>
  <div class="products-page">
    <!-- Page Header -->
    <header class="n-page-header">
      <div class="n-page-header-content">
        <div class="n-page-header-icon">
          <svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="40" width="34" height="11" rx="5.5" fill="#9588df"/><rect x="6" y="27" width="34" height="11" rx="5.5" fill="#bb8ec7"/><rect x="6" y="14" width="34" height="11" rx="5.5" fill="#9588df"/><circle cx="45" cy="42" r="14" fill="#1d1a2b"/><circle cx="40.5" cy="37.5" r="2.4" fill="#fff"/><circle cx="49.5" cy="46.5" r="2.4" fill="#fff"/><path d="M49.5 36.5 40.5 47.5" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>
        </div>
        <div class="n-page-header-text">
          <h1 class="n-page-title">금융상품</h1>
          <p class="n-page-subtitle">다양한 예금·적금 상품을 비교하고 나에게 맞는 상품을 찾아보세요</p>
        </div>
      </div>
    </header>

    <!-- Filter Zone — 탭과 필터를 옅은 면으로 묶어 상단 블록을 만든다 -->
    <div class="filter-zone">
      <div class="filter-zone-inner">

      <!-- Tab Navigation -->
      <div class="tabs-container">
        <div class="tabs tabs-pill">
          <button
            :class="['tab', { active: active === 'deposits' }]"
            @click="active = 'deposits'"
          >
            <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 21h18M4 21V9l8-6 8 6v12M9 21v-6h6v6"/>
              <line x1="9" y1="12" x2="9" y2="12.01"/>
              <line x1="15" y1="12" x2="15" y2="12.01"/>
            </svg>
            예금
          </button>
          <button
            :class="['tab', { active: active === 'savings' }]"
            @click="active = 'savings'"
          >
            <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.5-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z"/>
              <path d="M2 9v1c0 1.1.9 2 2 2h1"/>
              <circle cx="16" cy="11" r="1"/>
            </svg>
            적금
          </button>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="filter-card">
        <div class="filter-grid">
          <!-- Bank Filter -->
          <div class="filter-group">
            <label class="filter-label">
              <svg class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 21h18"/>
                <path d="M3 10h18"/>
                <path d="M5 6l7-3 7 3"/>
                <path d="M4 10v11"/>
                <path d="M20 10v11"/>
                <path d="M8 14v3"/>
                <path d="M12 14v3"/>
                <path d="M16 14v3"/>
              </svg>
              은행
            </label>
            <select v-model="selectedBank" class="filter-select">
              <option value="">전체 은행</option>
              <option v-for="bank in bankOptions" :key="bank" :value="bank">
                {{ bank }}
              </option>
            </select>
          </div>

          <!-- Term Filter -->
          <div class="filter-group">
            <label class="filter-label">
              <svg class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              기간
            </label>
            <select v-model.number="selectedTerm" class="filter-select">
              <option :value="0">전체 기간</option>
              <option v-for="term in termOptions" :key="term" :value="term">
                {{ term }}개월
              </option>
            </select>
          </div>

          <!-- Search -->
          <div class="filter-group filter-group-search">
            <label class="filter-label">
              <svg class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              검색
            </label>
            <div class="search-input-wrapper">
              <input 
                v-model.trim="keyword" 
                type="text" 
                class="filter-input"
                placeholder="은행명, 상품명으로 검색" 
              />
              <button v-if="keyword" @click="keyword = ''" class="search-clear">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Reset Button -->
          <div class="filter-group filter-group-reset">
            <button @click="resetFilter" class="btn btn-secondary">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 4v6h6"/>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
              </svg>
              초기화
            </button>
          </div>
        </div>

        <!-- Active Filters -->
        <div v-if="hasActiveFilters" class="active-filters">
          <span class="active-filters-label">적용된 필터:</span>
          <span v-if="selectedBank" class="filter-tag">
            {{ selectedBank }}
            <button @click="selectedBank = ''" class="filter-tag-remove">×</button>
          </span>
          <span v-if="selectedTerm !== 0" class="filter-tag">
            {{ selectedTerm }}개월
            <button @click="selectedTerm = 0" class="filter-tag-remove">×</button>
          </span>
          <span v-if="keyword" class="filter-tag">
            "{{ keyword }}"
            <button @click="keyword = ''" class="filter-tag-remove">×</button>
          </span>
        </div>
      </div>

      </div>
    </div>

    <div class="container">

      <!-- Results Info -->
      <div class="results-info">
        <span class="results-count">
          총 <strong>{{ filteredItems.length }}</strong>개 상품
        </span>
      </div>

      <!-- Product List -->
      <ProductList 
        v-if="active === 'deposits'" 
        :items="filteredItems" 
        type="deposit" 
      />
      <ProductList 
        v-else 
        :items="filteredItems" 
        type="saving" 
      />

      <!-- Empty State -->
      <div v-if="filteredItems.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <h3 class="empty-title">검색 결과가 없습니다</h3>
        <p class="empty-description">다른 조건으로 검색해 보세요</p>
        <button @click="resetFilter" class="btn btn-primary">필터 초기화</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useProductStore } from '@/stores/products'
import ProductList from '@/components/products/ProductList.vue'

const store = useProductStore()
const active = ref('deposits')

// 필터 상태
const selectedBank = ref('')
const selectedTerm = ref(0)
const keyword = ref('')

onMounted(() => {
  store.getDeposits()
  store.getSavings()
})

// 현재 탭 원본 목록
const currentItems = computed(() => {
  return active.value === 'deposits' ? store.deposits : store.savings
})

/** 옵션에서 기간 뽑기 */
const getTerm = (opt) => {
  const n = Number(opt?.save_trm)
  return Number.isNaN(n) ? null : n
}

// 은행 옵션(중복 제거)
const bankOptions = computed(() => {
  const banks = currentItems.value.map(item => item.kor_co_nm).filter(Boolean)
  return [...new Set(banks)]
})

// 기간 옵션(중복 제거)
const termOptions = computed(() => {
  const terms = currentItems.value
    .flatMap(item => (item.options ?? []).map(getTerm))
    .filter(n => n !== null)
  return [...new Set(terms)].sort((a, b) => a - b)
})

// 필터링 결과
const filteredItems = computed(() => {
  let result = currentItems.value

  if (selectedBank.value) {
    result = result.filter(item => item.kor_co_nm === selectedBank.value)
  }

  if (selectedTerm.value !== 0) {
    result = result.filter(item =>
      (item.options ?? []).some(opt => getTerm(opt) === selectedTerm.value)
    )
  }

  if (keyword.value) {
    const k = keyword.value.toLowerCase()
    result = result.filter(item => {
      const productName = (item.fin_prdt_nm || '').toLowerCase()
      const companyName = (item.kor_co_nm || '').toLowerCase()
      return productName.includes(k) || companyName.includes(k)
    })
  }

  return result
})

const hasActiveFilters = computed(() => {
  return selectedBank.value || selectedTerm.value !== 0 || keyword.value
})

const resetFilter = () => {
  selectedBank.value = ''
  selectedTerm.value = 0
  keyword.value = ''
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════
   금융상품 목록 — 메인 톤. 필터 카드가 헤더에 겹쳐 뜨고,
   보더 대신 면(--n-fill)과 그림자로 영역을 나눈다.
   ═══════════════════════════════════════════════════════════════════ */
.products-page {
  min-height: calc(100vh - 72px);
  background: var(--n-page);
}

/* 필터 카드가 겹쳐 뜰 자리만큼 헤더 아래 여백을 더 준다 */
.n-page-header {
  padding-bottom: 104px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px 120px;
}

/* ── 필터 카드 (헤더에 겹쳐 뜸) ─────────────────────────────── */
.filter-zone {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: -48px auto 0;
  padding: 0 24px;
}

.filter-zone-inner {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 28px;
  border-radius: 28px;
  background: var(--n-surface);
  box-shadow: var(--n-shadow-float);
}

/* ── 탭 (예금/적금) ─────────────────────────────────────────── */
.tabs-container {
  display: flex;
}

.tabs-pill {
  display: inline-flex;
  gap: 6px;
  padding: 6px;
  border-radius: 20px;
  background: var(--n-fill);
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 28px;
  border: 0;
  border-radius: 15px;
  background: transparent;
  color: var(--n-fg-muted);
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.tab:hover:not(.active) {
  color: var(--n-fg);
  background: var(--n-surface);
}

.tab.active {
  background: var(--n-orchid);
  color: var(--n-on-accent);
}

.tab-icon {
  width: 22px;
  height: 22px;
}

/* ── 필터 입력 ────────────────────────────────────────────────
   라벨과 값을 한 타일에 묶는다 (메인 빠른 추천 바와 같은 모양). */
.filter-card {
  padding: 0;
}

.filter-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr auto;
  gap: 12px;
  align-items: stretch;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 22px;
  border-radius: 20px;
  background: var(--n-fill);
  transition: background-color 0.2s;
}

.filter-group:hover,
.filter-group:focus-within {
  background: var(--n-lilac);
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 600;
  color: var(--n-fg-muted);
}

.filter-icon {
  width: 18px;
  height: 18px;
}

.filter-select,
.filter-input {
  width: 100%;
  height: 28px;
  padding: 0;
  border: 0;
  background: transparent;
  outline: none;
  font-size: 18px;
  font-weight: 600;
  color: var(--n-fg);
}

.filter-select {
  cursor: pointer;
}

.filter-input {
  font-weight: 600;
}

.filter-input::placeholder {
  color: var(--n-fg-faint);
  font-weight: 500;
}

.search-input-wrapper {
  position: relative;
}

.search-clear {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--n-surface);
  cursor: pointer;
}

.search-clear svg {
  width: 14px;
  height: 14px;
  color: var(--n-fg-muted);
}

/* 초기화 — 필터 타일과 같은 높이의 연보라 버튼 */
.filter-group-reset {
  padding: 0;
  background: none;
}

.filter-group-reset:hover,
.filter-group-reset:focus-within {
  background: none;
}

.filter-group-reset :deep(.btn-secondary) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 100%;
  min-height: 60px;
  padding: 0 28px;
  border: 0;
  border-radius: 20px;
  background: var(--n-lilac);
  color: var(--n-violet-hover);
  font-size: 19px;
  font-weight: 700;
  transition: background-color 0.2s;
}

.filter-group-reset :deep(.btn-secondary:hover) {
  background: var(--n-lilac-strong);
  transform: none;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

/* ── 적용된 필터 ─────────────────────────────────────────────── */
.active-filters {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.active-filters-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--n-fg-muted);
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 36px;
  padding: 0 6px 0 14px;
  border-radius: 999px;
  background: var(--n-lilac);
  font-size: 16px;
  font-weight: 600;
  color: var(--n-violet-hover);
}

.filter-tag-remove {
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-tag-remove:hover {
  background: var(--n-lilac-strong);
}

/* ── 결과 수 ─────────────────────────────────────────────────── */
.results-info {
  margin-bottom: 20px;
}

.results-count {
  font-size: 20px;
  font-weight: 500;
  color: var(--n-fg-muted);
}

.results-count strong {
  font-weight: 700;
  color: var(--n-fg);
}

/* ── 빈 상태 ─────────────────────────────────────────────────── */
.empty-state {
  text-align: center;
  padding: 80px 24px;
}

.empty-icon {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  border-radius: 20px;
  background: var(--n-fill);
}

.empty-icon svg {
  width: 28px;
  height: 28px;
  color: var(--n-fg-muted);
}

.empty-title {
  margin-bottom: 8px;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--n-title);
}

.empty-description {
  margin-bottom: 24px;
  font-size: 18px;
  color: var(--n-fg-muted);
}

.empty-state :deep(.btn-primary) {
  height: 52px;
  padding: 0 24px;
  border: 0;
  border-radius: 16px;
  background: var(--n-violet);
  background-image: none;
  color: var(--n-on-accent);
  font-size: 18px;
  font-weight: 700;
  box-shadow: none;
}

.empty-state :deep(.btn-primary:hover) {
  background: var(--n-violet-hover);
  transform: none;
  box-shadow: none;
}

/* ═══════════════════════════════════════════════════════════════════
   Responsive
   ═══════════════════════════════════════════════════════════════════ */
@media (max-width: 900px) {
  .filter-grid {
    grid-template-columns: 1fr 1fr;
  }

  .filter-group-search,
  .filter-group-reset {
    grid-column: span 2;
  }
}

@media (max-width: 600px) {
  .container {
    padding: 32px 16px 72px;
  }

  .filter-zone {
    padding: 0 16px;
  }

  .filter-zone-inner {
    padding: 20px;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .filter-group-search,
  .filter-group-reset {
    grid-column: span 1;
  }

  .tab {
    height: 44px;
    padding: 0 18px;
    font-size: 17px;
  }
}
</style>
