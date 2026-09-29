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
  height: 100%;
  min-height: 500px;
  background: var(--n-bg-subtle);
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-xl);
  overflow: hidden;
}

/* ── 검색 전 ──────────────────────────────────────────────────────── */
.placeholder-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 500px;
  padding: 32px 24px;
  text-align: center;
}

.placeholder-icon {
  width: 44px;
  height: 44px;
  margin-bottom: 18px;
  color: var(--n-border-strong);
}

.placeholder-title {
  margin-bottom: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--n-text);
}

.placeholder-text {
  font-size: 0.8125rem;
  line-height: 1.65;
  color: var(--n-text-muted);
}

/* ── 검색 결과 ────────────────────────────────────────────────────── */
.placeholder-results {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 500px;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid var(--n-border);
  background: var(--n-bg);
}

.results-title {
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--n-text);
}

.results-count {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--n-text-muted);
}

.results-list {
  flex: 1;
  overflow-y: auto;
  list-style: none;
  padding: 8px;
  margin: 0;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 14px 16px;
  border: 1px solid transparent;
  border-radius: var(--n-radius-md);
  cursor: pointer;
  transition: background-color 0.18s ease, border-color 0.18s ease;
}

.result-item:hover {
  background: var(--n-bg);
  border-color: var(--n-border);
}

.result-item.selected {
  background: var(--n-accent-wash);
  border-color: var(--n-accent);
}

.result-main {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.result-name {
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--n-text);
}

.result-distance {
  flex-shrink: 0;
  font-size: 0.75rem;
  color: var(--n-text-muted);
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
</style>
