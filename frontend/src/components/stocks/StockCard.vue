<template>
  <div class="stock-card" @click="$emit('click')">
    <div class="card-header">
      <div class="stock-info">
        <span class="stock-symbol">{{ stock.symbol }}</span>
        <span class="stock-name">{{ stock.name }}</span>
      </div>
      <span :class="['market-badge', stock.market.toLowerCase()]">
        {{ stock.market === 'KR' ? '🇰🇷' : '🇺🇸' }}
      </span>
    </div>

    <div class="card-body">
      <div class="price-section">
        <span class="current-price">
          {{ formatPrice(stock.current_price, stock.market) }}
        </span>
        <div v-if="stock.change !== null" :class="['price-change', changeClass]">
          <svg v-if="stock.change > 0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 14l5-5 5 5H7z"/>
          </svg>
          <svg v-else-if="stock.change < 0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5H7z"/>
          </svg>
          <span>{{ formatChange(stock.change, stock.market) }} ({{ formatPercent(stock.change_percent) }})</span>
        </div>
        <div v-else class="price-change neutral">
          <span>데이터 로딩 중...</span>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <span class="view-detail">상세보기 →</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stock: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const changeClass = computed(() => {
  if (props.stock.change > 0) return 'positive'
  if (props.stock.change < 0) return 'negative'
  return 'neutral'
})

const formatPrice = (price, market) => {
  if (price === null || price === undefined) return '-'
  
  if (market === 'KR') {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(price)
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

const formatChange = (change, market) => {
  if (change === null || change === undefined) return '-'
  
  const prefix = change > 0 ? '+' : ''
  
  if (market === 'KR') {
    return prefix + new Intl.NumberFormat('ko-KR', {
      maximumFractionDigits: 0
    }).format(change)
  }
  
  return prefix + new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(change)
}

const formatPercent = (percent) => {
  if (percent === null || percent === undefined) return '-'
  const prefix = percent > 0 ? '+' : ''
  return `${prefix}${percent.toFixed(2)}%`
}
</script>

<style scoped>
.stock-card {
  background: var(--n-bg);
  border-radius: var(--n-radius-lg);
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--n-bg-sunken);
}

.stock-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
  border-color: var(--n-accent);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.stock-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stock-symbol {
  font-size: 18px;
  font-weight: 700;
  color: var(--n-text);
}

.stock-name {
  font-size: 13px;
  color: var(--n-text-muted);
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.market-badge {
  font-size: 20px;
  padding: 4px;
}

.card-body {
  margin-bottom: 16px;
}

.price-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.current-price {
  font-size: 24px;
  font-weight: 700;
  color: var(--n-text);
}

.price-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
}

.price-change svg {
  width: 16px;
  height: 16px;
}

.price-change.positive {
  color: var(--n-ok-text);
}

.price-change.negative {
  color: var(--n-danger-text);
}

.price-change.neutral {
  color: var(--n-text-muted);
}

.card-footer {
  border-top: 1px solid var(--n-bg-sunken);
  padding-top: 12px;
}

.view-detail {
  font-size: 13px;
  color: var(--n-accent);
  font-weight: 500;
}
</style>
