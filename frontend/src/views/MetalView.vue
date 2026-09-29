<template>
  <div class="metal-page">
    <!-- Page Header -->
    <header class="n-page-header">
      <div class="n-page-header-content">
        <div class="n-page-header-icon">
          <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M4 56 9.5 42h17L32 56z" fill="#9588df"/><path d="M33 56 38.5 42h17L61 56z" fill="#bb8ec7"/><path d="M18 39 23.5 25h17L46 39z" fill="#9588df"/><path d="M27 30.5h7" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M13 47.5h6M42 47.5h6" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M51 6l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#1d1a2b"/></svg>
        </div>
        <div class="n-page-header-text">
          <h1 class="n-page-title">금 · 은 가격 추이 차트</h1>
          <p class="n-page-subtitle">귀금속 시세를 한눈에 확인하세요</p>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <MetalFilterBar />

      <!-- Loading State -->
      <div v-if="store.loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>데이터를 불러오는 중...</p>
      </div>

      <!-- Error / Empty State -->
      <MetalEmptyState
        v-else-if="store.errorMessage || store.isEmpty"
        :message="store.errorMessage"
      />

      <!-- Chart -->
      <div v-else class="chart-wrapper">
        <MetalChart
          :labels="store.labels"
          :prices="store.priceValues"
          :metal="store.metal"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMetalsStore } from '@/stores/metals'

import MetalFilterBar from '@/components/metals/MetalFilterBar.vue'
import MetalChart from '@/components/metals/MetalChart.vue'
import MetalEmptyState from '@/components/metals/MetalEmptyState.vue'

const store = useMetalsStore()

onMounted(() => {
  store.loadPrices()   // 최초 전체 조회
})
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════
   현물 시세 — 메인 톤. 필터 카드가 헤더에 겹쳐 뜨고, 차트는 흰 카드.
   ═══════════════════════════════════════════════════════════════════ */
.metal-page {
  min-height: calc(100vh - 200px);
  background: var(--n-page);
}

/* 필터 카드가 겹쳐 뜰 자리 */
.n-page-header {
  padding-bottom: 104px;
}

/* ── 본문 ────────────────────────────────────────────────────────── */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 120px;
}

/* ── 로딩 ────────────────────────────────────────────────────────── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  color: var(--n-text-muted);
}

.loading-spinner {
  width: 30px;
  height: 30px;
  margin-bottom: 16px;
  border: 3px solid var(--n-lilac);
  border-top-color: var(--n-violet);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

/* ── 차트 ────────────────────────────────────────────────────────── */
.chart-wrapper {
  margin-top: 32px;
  padding: 32px;
  border-radius: 28px;
  background: var(--n-surface);
  box-shadow: var(--n-shadow);
}

/* ═══════════════════════════════════════════════════════════════════
   Responsive
   ═══════════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .main-content {
    padding: 0 16px 56px;
  }

  .chart-wrapper {
    padding: 16px;
  }
}
</style>
