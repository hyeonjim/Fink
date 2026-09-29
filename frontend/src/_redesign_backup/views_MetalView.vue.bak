<template>
  <div class="metal-page">
    <!-- Page Header -->
    <header class="n-page-header">
      <div class="n-page-header-content">
        <div class="n-page-header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 3v18h18"/>
            <path d="M7 15l4-4 3 3 5-6"/>
          </svg>
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
   현물 시세 — 무채색.
   ═══════════════════════════════════════════════════════════════════ */
.metal-page {
  min-height: calc(100vh - 200px);
  background: var(--n-bg);
}

/* ── 본문 ────────────────────────────────────────────────────────── */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px 72px;
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
  border: 2px solid var(--n-border);
  border-top-color: var(--n-text-muted);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

/* ── 차트 ────────────────────────────────────────────────────────── */
.chart-wrapper {
  margin-top: 20px;
  padding: 22px;
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-md);
  background: var(--n-bg);
  box-shadow: none;
}

/* ═══════════════════════════════════════════════════════════════════
   Responsive
   ═══════════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .main-content {
    padding: 24px 16px 56px;
  }

  .chart-wrapper {
    padding: 16px;
  }
}
</style>
