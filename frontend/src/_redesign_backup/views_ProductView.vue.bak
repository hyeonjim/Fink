<template>
  <div class="products-page">
    <!-- Page Header -->
    <header class="n-page-header">
      <div class="n-page-header-content">
        <div class="n-page-header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 7v10M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 1.1-3 2.3c0 1.2 1.2 1.9 3 2.2s3 1 3 2.3-1.3 2.2-3 2.2-3-.9-3-2.2"/>
          </svg>
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
   금융상품 목록 — 무채색. HomeView 의 카드/보더 언어를 따른다.
   ═══════════════════════════════════════════════════════════════════ */
.products-page {
  min-height: calc(100vh - 72px);
  background: var(--n-bg);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 28px 24px 72px;
}

/* ── 필터 존 ─────────────────────────────────────────────────────
   탭과 필터를 옅은 면으로 묶어 상단 블록을 만든다.
   흰 상품 목록 영역과 갈라져 층위가 생긴다. */


.filter-zone-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 24px 20px;
}

/* ── 탭 ──────────────────────────────────────────────────────────── */
.tabs-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tabs-pill {
  display: inline-flex;
  gap: 40px;
  padding: 4px;
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  font-size: 24px;
  font-weight: 500;
  color: var(--n-text-muted);
  background: #f1f0f0;
  border: none;
  border-radius: var(--n-radius-sm);
  cursor: pointer;
  transition: background-color 0.18s ease, color 0.18s ease;
}

.tab:hover:not(.active) {
  color: var(--n-text);
  background: var(--n-bg);
}

.tab.active {
  background: var(--n-accent);
  color: var(--n-on-accent);
  border: 1px solid transparent;
  box-shadow: none;
  font-weight: 600;
}

.tab-icon {
  width: 16px;
  height: 16px;
}

/* ── 필터 ────────────────────────────────────────────────────────
   존 위에 카드를 또 띄우지 않는다. 입력 필드만 흰 면으로 떠오른다. */
.filter-card {
  padding: 0;
}

.filter-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr auto;
  gap: 14px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--n-text-muted);
}

.filter-icon {
  width: 14px;
  height: 14px;
  color: var(--n-text-muted);
}

.filter-select,
.filter-input {
  width: 100%;
  padding: 10px 12px;
  font-size: 0.9375rem;
  color: var(--n-text);
  background: var(--n-bg);
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-sm);
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.filter-select:hover:not(:focus),
.filter-input:hover:not(:focus) {
  border-color: var(--n-border-strong);
}

.filter-select:focus,
.filter-input:focus {
  border-color: var(--n-accent);
  box-shadow: 0 0 0 3px var(--n-accent-wash);
}

.filter-input::placeholder {
  color: var(--n-text-muted);
}

.search-input-wrapper {
  position: relative;
}

.search-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: var(--n-bg-sunken);
  border: none;
  border-radius: var(--n-radius-sm);
  cursor: pointer;
  transition: background-color 0.18s ease;
}

.search-clear:hover {
  background: var(--n-border);
}

.search-clear svg {
  width: 12px;
  height: 12px;
  color: var(--n-text-muted);
}

.filter-group-reset {
  justify-content: flex-end;
}

/* 전역 .btn-secondary 가 옛 팔레트라 이 화면에서만 무채색으로 덮는다 */
.filter-group-reset :deep(.btn-secondary) {
  height: 40px;
  padding: 0 18px;
  border-radius: var(--n-radius-sm);
  border: 1px solid var(--n-border-strong);
  background: transparent;
  color: var(--n-text);
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.18s ease, border-color 0.18s ease;
}

.filter-group-reset :deep(.btn-secondary:hover) {
  background: var(--n-bg-subtle);
  border-color: var(--n-text-muted);
  transform: none;
}

.btn-icon {
  width: 15px;
  height: 15px;
}

/* ── 적용된 필터 ─────────────────────────────────────────────────── */
.active-filters {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--n-border);
  flex-wrap: wrap;
}

.active-filters-label {
  font-size: 0.8125rem;
  color: var(--n-text-muted);
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--n-text-body);
  background: var(--n-bg);
  border-radius: var(--n-radius-sm);
}

.filter-tag-remove {
  width: 16px;
  height: 16px;
  padding: 0;
  background: transparent;
  border: none;
  color: var(--n-text-muted);
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  transition: color 0.18s ease;
}

.filter-tag-remove:hover {
  color: var(--n-text);
}

/* ── 결과 수 ─────────────────────────────────────────────────────── */
.results-info {
  margin-bottom: 16px;
}

.results-count {
  font-size: 0.875rem;
  color: var(--n-text-muted);
}

.results-count strong {
  color: var(--n-text);
  font-weight: 600;
}

/* ── 빈 상태 ─────────────────────────────────────────────────────── */
.empty-state {
  text-align: center;
  padding: 80px 24px;
}

.empty-icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  margin: 0 auto 20px;
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-md);
  background: var(--n-bg-subtle);
}

.empty-icon svg {
  width: 26px;
  height: 26px;
  color: var(--n-text-muted);
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--n-text);
  margin-bottom: 8px;
}

.empty-description {
  font-size: 0.9375rem;
  color: var(--n-text-muted);
  margin-bottom: 24px;
}

.empty-state :deep(.btn-primary) {
  height: 40px;
  padding: 0 18px;
  border-radius: var(--n-radius-sm);
  background: var(--n-accent);
  background-image: none;
  border: 1px solid var(--n-accent);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: none;
}

.empty-state :deep(.btn-primary:hover) {
  background: var(--n-accent-hover);
  border-color: var(--n-accent-hover);
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

  .filter-group-search {
    grid-column: span 2;
  }

  .filter-group-reset {
    grid-column: span 2;
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .container {
    padding: 24px 16px 56px;
  }

  .filter-zone-inner {
    padding: 20px 16px 16px;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .filter-group-search,
  .filter-group-reset {
    grid-column: span 1;
  }

  .tab {
    padding: 9px 18px;
    font-size: 0.875rem;
  }
}
</style>
