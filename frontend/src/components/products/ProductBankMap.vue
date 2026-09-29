<template>
  <div class="product-bank-map">
    <!-- Header -->
    <div class="map-header">
      <div class="header-left">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div class="header-text">
          <h3>{{ bankName }} 위치 찾기</h3>
          <p>가까운 지점을 검색해보세요</p>
        </div>
      </div>
      <button class="close-btn" @click="$emit('close')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
    
    <div class="map-content">
      <!-- Search Sidebar -->
      <div class="search-sidebar">
        <!-- Origin Section -->
        <div class="input-section">
          <label class="input-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            출발지
          </label>
          <div class="origin-row">
            <input 
              type="text" 
              v-model="kakaoMapStore.originSearchKeyword" 
              placeholder="출발지 검색"
              @keyup.enter="searchOriginAndRefresh"
              class="input-field"
            />
            <button class="btn-origin-search" @click="searchOriginAndRefresh">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>
          <button class="btn-current-location" @click="setCurrentAndRefresh">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="3 11 22 2 13 21 11 13 3 11"/>
            </svg>
            현재 위치로 설정
          </button>
          <div v-if="kakaoMapStore.originLocation" class="origin-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {{ kakaoMapStore.originLocation.name }}
          </div>
        </div>

        <div class="section-divider"></div>

        <!-- Region Filters -->
        <div class="input-section">
          <label class="input-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            지역 선택
          </label>
          
          <div class="select-wrapper">
            <select v-model="kakaoMapStore.selectedCity" @change="onCityChange" class="select-field">
              <option value="">광역시/도 선택</option>
              <option v-for="city in kakaoMapStore.cityOptions" :key="city" :value="city">{{ city }}</option>
            </select>
            <svg class="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>

          <div class="select-wrapper">
            <select v-model="kakaoMapStore.selectedDistrict" class="select-field">
              <option value="">시/군/구 선택</option>
              <option v-for="district in kakaoMapStore.districtOptions" :key="district" :value="district">{{ district }}</option>
            </select>
            <svg class="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>

        <!-- Search Button -->
        <button class="btn-search" @click="searchByRegion">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          {{ bankName }} 찾기
        </button>

        <!-- Search Results -->
        <div class="results-section" v-if="kakaoMapStore.searchResults.length">
          <div class="results-header">
            <span class="results-title">검색 결과</span>
            <span class="results-count">{{ kakaoMapStore.searchResults.length }}개</span>
          </div>
          <ul class="results-list">
            <li 
              v-for="(place, index) in kakaoMapStore.searchResults" 
              :key="index"
              @click="kakaoMapStore.selectBank(place)"
              :class="{ selected: kakaoMapStore.selectedPlace?.id === place.id }"
              class="result-item"
            >
              <div class="result-info">
                <div class="place-name">{{ place.place_name }}</div>
                <div class="place-address">{{ place.address_name }}</div>
              </div>
              <div class="place-distance" v-if="place.distance">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {{ formatDistance(place.distance) }}
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Map Area — 데모 모드에서는 지도 대신 안내를 보여준다
           (지점 목록은 왼쪽 사이드바에 이미 표시된다) -->
      <div v-if="USE_MOCK" class="map-wrapper map-demo">
        <svg class="demo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <p class="demo-title">지도는 데모 모드에서 표시되지 않습니다</p>
        <p class="demo-text">지역을 선택하면 왼쪽에 지점 목록이 나타납니다.</p>
      </div>
      <div v-else class="map-wrapper">
        <div id="product-bank-map" class="map-area"></div>
        <div class="map-overlay">
          <span class="overlay-badge">Kakao Map</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useKakaoMapStore } from '@/stores/kakaomap'
import { USE_MOCK } from '@/mocks/config'

const props = defineProps({
  bankName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

const kakaoMapStore = useKakaoMapStore()

// 거리 포맷팅
const formatDistance = (distance) => {
  const d = parseInt(distance)
  if (d >= 1000) {
    return (d / 1000).toFixed(1) + 'km'
  }
  return d + 'm'
}

// 시/도 선택 시 시/군/구 옵션 업데이트
const onCityChange = () => {
  kakaoMapStore.updateDistrictOptions()
}

// 출발지 검색 후 은행 재검색
const searchOriginAndRefresh = () => {
  kakaoMapStore.searchOrigin()
  setTimeout(() => {
    if (kakaoMapStore.originLocation) {
      kakaoMapStore.searchBankNearby(
        props.bankName,
        kakaoMapStore.originLocation.lat,
        kakaoMapStore.originLocation.lng
      )
    }
  }, 500)
}

// 현재 위치로 설정 후 은행 재검색
const setCurrentAndRefresh = () => {
  // 현재 위치가 이미 있으면 바로 사용
  if (kakaoMapStore.currentLocation) {
    kakaoMapStore.setOriginToCurrentLocation()
    kakaoMapStore.searchBankNearby(
      props.bankName,
      kakaoMapStore.currentLocation.lat,
      kakaoMapStore.currentLocation.lng
    )
  } else {
    // 현재 위치를 새로 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          kakaoMapStore.currentLocation = { lat, lng }
          kakaoMapStore.setOriginToCurrentLocation()
          kakaoMapStore.searchBankNearby(props.bankName, lat, lng)
        },
        (error) => {
          console.error('현재 위치를 가져올 수 없습니다:', error)
          alert('현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.')
        }
      )
    } else {
      alert('이 브라우저에서는 위치 서비스를 지원하지 않습니다.')
    }
  }
}

// 지역 선택으로 검색
const searchByRegion = () => {
  kakaoMapStore.searchBankByRegion(props.bankName)
}

onMounted(() => {
  fetch('/data.json')
    .then((response) => response.json())
    .then((data) => kakaoMapStore.loadData(data))

  kakaoMapStore.loadKakaoScript('product-bank-map', {
    level: 5,
    autoSearch: true,
    bankName: props.bankName,
    showCurrentLocationMarker: false,
    autoSetOrigin: true
  })
})

onUnmounted(() => {
  kakaoMapStore.cleanup()
})
</script>

<style scoped>
.product-bank-map {
  margin-top: 20px;
  border-radius: var(--n-radius-xl);
  overflow: hidden;
  background: var(--n-bg);
  border: 1px solid var(--n-accent-wash);
}

/* Header */
.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: var(--n-accent);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--n-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon svg {
  width: 22px;
  height: 22px;
  color: var(--n-on-accent);
}

.header-text h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--n-on-accent);
  margin: 0 0 2px;
}

.header-text p {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: var(--n-radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn svg {
  width: 18px;
  height: 18px;
  color: var(--n-on-accent);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* Content */
.map-content {
  display: flex;
  height: 480px;
}

/* Search Sidebar */
.search-sidebar {
  width: 300px;
  padding: 20px;
  overflow-y: auto;
  border-right: 1px solid var(--n-border);
  background: var(--n-bg-subtle);
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--n-text);
}

.input-label svg {
  width: 14px;
  height: 14px;
  color: var(--n-accent);
}

.input-field {
  width: 100%;
  padding: 10px 12px;
  font-size: 0.8125rem;
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-md);
  background: var(--n-bg);
  transition: all 0.2s;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: var(--n-accent);
  box-shadow: 0 0 0 3px var(--n-accent-wash);
}

.origin-row {
  display: flex;
  gap: 8px;
}

.origin-row .input-field {
  flex: 1;
}

.btn-origin-search {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--n-info-text);
  border: none;
  border-radius: var(--n-radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-origin-search svg {
  width: 16px;
  height: 16px;
  color: var(--n-on-accent);
}

.btn-origin-search:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-current-location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--n-accent);
  background: var(--n-accent-wash);
  border: 1px solid var(--n-accent);
  border-radius: var(--n-radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-current-location svg {
  width: 12px;
  height: 12px;
}

.btn-current-location:hover {
  background: var(--n-accent-wash);
}

.origin-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--n-ok-text);
  background: var(--n-ok-bg);
  border-radius: var(--n-radius-sm);
}

.origin-badge svg {
  width: 14px;
  height: 14px;
}

.section-divider {
  height: 1px;
  background: var(--n-border);
  margin: 16px 0;
}

.select-wrapper {
  position: relative;
}

.select-field {
  width: 100%;
  padding: 10px 36px 10px 12px;
  font-size: 0.8125rem;
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-md);
  background: var(--n-bg);
  appearance: none;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;
}

.select-field:focus {
  outline: none;
  border-color: var(--n-accent);
  box-shadow: 0 0 0 3px var(--n-accent-wash);
}

.select-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: var(--n-text-muted);
  pointer-events: none;
}

.btn-search {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--n-on-accent);
  background: var(--n-accent);
  border: none;
  border-radius: var(--n-radius-md);
  cursor: pointer;
  margin-top: 16px;
  transition: all 0.2s;
}

.btn-search svg {
  width: 16px;
  height: 16px;
}

.btn-search:hover {
  box-shadow: none;
}

/* Results */
.results-section {
  margin-top: 16px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.results-title {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--n-text);
}

.results-count {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--n-accent);
  background: var(--n-accent-wash);
  padding: 4px 10px;
  border-radius: var(--n-radius-md);
}

.results-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 180px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--n-bg);
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.result-item:hover {
  border-color: var(--n-accent);
}

.result-item.selected {
  background: var(--n-accent-wash);
  border-color: var(--n-accent);
}

.result-info {
  flex: 1;
  min-width: 0;
}

.place-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--n-text);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.place-address {
  font-size: 0.6875rem;
  color: var(--n-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.place-distance {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--n-accent);
  flex-shrink: 0;
  margin-left: 8px;
}

.place-distance svg {
  width: 12px;
  height: 12px;
}

/* Map Wrapper */
.map-wrapper {
  flex: 1;
  position: relative;
}

.map-area {
  width: 100%;
  height: 100%;
}

/* 데모 모드 안내 — 지도 자리를 채우되 장식은 두지 않는다 */
.map-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 24px;
  text-align: center;
  background: var(--n-bg-subtle);
}

.demo-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
  color: var(--n-border-strong);
}

.demo-title {
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--n-text);
}

.demo-text {
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--n-text-muted);
}

.map-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
}

.overlay-badge {
  padding: 6px 12px;
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--n-on-accent);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  border-radius: var(--n-radius-sm);
}
/* Responsive */
@media (max-width: 768px) {
  .map-content {
    flex-direction: column;
    height: auto;
  }

  .search-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--n-border);
  }

  .map-wrapper {
    height: 350px;
  }
}
</style>
