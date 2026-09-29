<template>
  <div v-if="exchangeStore.rates.length" class="exchange-ticker">
    <span class="ticker-badge">환율</span>
    <div class="ticker-wrapper">
      <div
        v-for="(rate, index) in exchangeStore.rates"
        :key="rate.cur_unit"
        class="ticker-item"
        :class="{ active: index === currentIndex, prev: index === prevIndex }"
      >
        <span class="ticker-name">{{ rate.cur_unit }}</span>
        <span class="ticker-rate">{{ formatRate(rate.deal_bas_r) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 상단바의 환율 알약.
 * 3초마다 다음 통화가 아래에서 올라오고, 이전 통화는 위로 빠져나간다.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useExchangeStore } from '@/stores/exchange'

const exchangeStore = useExchangeStore()

const currentIndex = ref(0)
const prevIndex = ref(-1)
let timer = null

const formatRate = (rate) => {
  if (!rate) return '-'
  return parseFloat(rate.replace(/,/g, '')).toLocaleString('ko-KR', { maximumFractionDigits: 2 })
}

// 매 틱마다 개수를 확인하므로 환율을 나중에 불러와도 그때부터 돈다
onMounted(() => {
  timer = setInterval(() => {
    const count = exchangeStore.rates.length
    if (!count) return
    prevIndex.value = currentIndex.value
    currentIndex.value = (currentIndex.value + 1) % count
  }, 3000)
})

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
/* 알약 폭은 내용에 맞추고, 항목이 absolute 라 폭을 못 잡는 래퍼에만
   가장 긴 조합(JPY(100) + 1,752.10) 기준 폭을 준다 */
.exchange-ticker {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  min-width: 0;
  height: 36px;
  padding: 0 16px 0 5px;
  gap: 8px;
  border-radius: 999px;
  background: #fcf1ff;
  box-shadow: 0 6px 18px rgba(49, 32, 110, 0.22), 0 2px 4px rgba(49, 32, 110, 0.16);
}

.ticker-badge {
  flex-shrink: 0;
  padding: 3px 12px;
  border-radius: 999px;
  background: #ffffff;
  font-size: 16px;
  font-weight: 700;
  color: #484554;
  letter-spacing: 0;
}

.ticker-wrapper {
  position: relative;
  height: 100%;
  flex: none;
  width: 156px;
}

/* 대기 중인 항목: 아래에 숨어서 순서를 기다린다 */
.ticker-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.42s cubic-bezier(0.22, 1, 0.36, 1), transform 0.42s cubic-bezier(0.22, 1, 0.36, 1);
}

/* 현재 표시 중: 제자리에서 보임 */
.ticker-item.active {
  opacity: 1;
  transform: translateY(0);
}

/* 방금 밀려난 항목: 위로 빠져나간다 */
.ticker-item.prev {
  opacity: 0;
  transform: translateY(-16px);
}

.ticker-name,
.ticker-rate {
  flex: none;
  white-space: nowrap;
  font-size: 16px;
}

.ticker-name {
  letter-spacing: 0.01em;
  font-weight: 500;
  color: #5140b5;
}

.ticker-rate {
  text-align: right;
  font-weight: 600;
  color: #1d1a2b;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 1240px) {
  .exchange-ticker { display: none; }
}

/* 상단 메뉴가 햄버거로 접히면 자리가 생겨 배지 없이 다시 보인다 */
@media (max-width: 1024px) {
  .exchange-ticker {
    display: flex;
    max-width: 170px;
  }

  .ticker-badge {
    display: none;
  }
}
</style>
