<template>
  <div class="map-placeholder">
    <!-- 검색 전 -->
    <div v-if="!results.length" class="placeholder-empty">
      <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      <p class="placeholder-title">지도는 데모 모드에서 표시되지 않습니다</p>
      <p class="placeholder-text">
        왼쪽에서 지역과 은행을 선택하면<br />
        해당 지점 목록을 확인할 수 있습니다.
      </p>
    </div>

    <!-- 검색 결과 -->
    <div v-else class="placeholder-results">
      <div class="results-header">
        <h3 class="results-title">검색 결과</h3>
        <span class="results-count">{{ results.length }}곳</span>
      </div>

      <ul class="results-list">
        <li
          v-for="place in results"
          :key="place.id"
          class="result-item"
          :class="{ selected: selected && selected.id === place.id }"
          @click="$emit('select', place)"
        >
          <span v-if="logoOf(place.place_name)" class="result-logo">
            <img :src="logoOf(place.place_name)" :alt="bankOf(place.place_name)" />
          </span>
          <div class="result-main">
            <span class="result-name">{{ place.place_name }}</span>
            <span v-if="place.distance" class="result-distance">
              {{ formatDistance(place.distance) }}
            </span>
          </div>
          <span class="result-address">
            {{ place.road_address_name || place.address_name }}
          </span>
          <span v-if="place.phone" class="result-phone">{{ place.phone }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
/**
 * @파일명 MapPlaceholder.vue
 * @설명 목업 모드에서 카카오맵 자리를 대신하는 컴포넌트
 * @기능
 *   - 검색 전 안내 문구 표시
 *   - 검색 결과 지점 목록 표시 및 선택
 * @비고
 *   목업 모드에서는 카카오 SDK 를 로드하지 않아 지도가 뜨지 않는다.
 *   지도 대신 검색 결과를 리스트로 보여주어 화면 흐름은 그대로 유지한다.
 */

defineProps({
  /** @type {Array} 검색된 지점 목록 */
  results: {
    type: Array,
    default: () => [],
  },
  /** @type {Object|null} 선택된 지점 */
  selected: {
    type: Object,
    default: null,
  },
})

defineEmits(['select'])

/**
 * 은행 로고 — src/assets/banks 의 이미지를 지점명 앞 은행 이름으로 찾는다.
 * (예: "국민은행 강남역지점" → 국민은행.png)
 */
const bankLogos = import.meta.glob('@/assets/banks/*.png', { eager: true, import: 'default' })
const logoByName = Object.fromEntries(
  Object.entries(bankLogos).map(([path, src]) => [path.split('/').pop().replace('.png', ''), src])
)
const bankOf = (placeName = '') => placeName.split(' ')[0]
const logoOf = (placeName) => logoByName[bankOf(placeName)] || null

/**
 * 거리 표기 변환
 * @param {string|number} distance - 거리 (m)
 * @returns {string} 1km 미만은 m, 이상은 km 로 표기
 */
const formatDistance = (distance) => {
  const meters = Number(distance)
  if (!meters) return ''

  return meters < 1000 ? `${meters}m` : `${(meters / 1000).toFixed(1)}km`
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════
   지도 플레이스홀더 — 무채색. 그림자 없이 보더로만 구분한다.
   ═══════════════════════════════════════════════════════════════════ */
.map-placeholder {
  width: 100%;
  min-height: 0;
  height: auto;
  border: 0;
  border-radius: 0;
  background: transparent;
  overflow: visible;
}

/* ── 검색 전 ──────────────────────────────────────────────────────── */
.placeholder-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 32px 24px;
  text-align: center;
  min-height: 380px;
  border-radius: 32px;
  background: var(--n-fill);
}

.placeholder-icon {
  width: 44px;
  height: 44px;
  margin-bottom: 18px;
  color: var(--n-border-strong);
}

.placeholder-title {
  margin-bottom: 10px;
  letter-spacing: -0.01em;
  font-size: 22px;
  font-weight: 600;
  color: var(--n-title);
}

.placeholder-text {
  line-height: 1.65;
  font-size: 18px;
  color: var(--n-fg-muted);
}

/* ── 검색 결과 ────────────────────────────────────────────────────── */
.placeholder-results {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 500px;
  padding: 0;
  gap: 16px;
}

.results-header {
  display: flex;
  align-items: center;
  padding: 0;
  border: 0;
  background: none;
  gap: 10px;
  justify-content: flex-start;
}

.results-title {
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--n-title);
}

.results-count {
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--n-lilac);
  font-size: 16px;
  font-weight: 700;
  color: var(--n-violet);
}

.results-list {
  flex: 1;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 8px;
}

.result-item {
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: 16px;
  row-gap: 4px;
  align-items: center;
  padding: 16px 20px 16px 16px;
  border: 0;
  border-radius: 20px;
  background: var(--n-fill);
  transition: background-color 0.2s, transform 0.2s;
}

.result-item:hover {
  background: var(--n-fill);
  transform: translateX(4px);
}

.result-item.selected {
  background: var(--n-fill-strong);
  border: 0;
}

.result-main {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.result-name {
  letter-spacing: -0.01em;
  font-size: 20px;
  font-weight: 600;
  color: var(--n-fg);
}

.result-distance {
  flex-shrink: 0;
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--n-fill-strong);
  font-size: 16px;
  font-weight: 700;
  color: var(--n-fg);
}

.result-address {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--n-text-body);
}

.result-phone {
  font-size: 0.75rem;
  color: var(--n-text-muted);
}

/* ═══ F!NK 리디자인 — 결과 목록 (연한 면 타일 + 은행 로고, 보더 없음) ═══ */
.result-logo {
  grid-row: span 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 48px;
  padding: 6px 10px;
  box-sizing: border-box;
  border-radius: 14px;
  background: #ffffff;
}
.result-logo img { width: 100%; height: 100%; object-fit: contain; }
.result-item.selected .result-distance { background: var(--n-surface); }
.result-address,
.result-phone { font-size: 16px; color: var(--n-fg-muted); }
</style>
