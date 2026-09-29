<template>
  <div class="kakao-map-page">
    <!-- Header Section -->
    <header class="n-page-header">
      <div class="n-page-header-content">
        <div class="n-page-header-icon">
          <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M4 32 21 26l22 6 17-6v28l-17 6-22-6-17 6z" fill="#bb8ec7"/><path d="M21 26v28M43 32v28" stroke="#fff" stroke-width="2" stroke-opacity="0.7"/><path d="M32 4c-8.3 0-15 6.5-15 14.6C17 29 32 42 32 42s15-13 15-23.4C47 10.5 40.3 4 32 4z" fill="#1d1a2b"/><circle cx="32" cy="18.5" r="5.5" fill="#9588df"/></svg>
        </div>
        <div class="n-page-header-text">
          <h1 class="n-page-title">은행 찾기</h1>
          <p class="n-page-subtitle">가까운 은행 지점을 검색해보세요</p>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="main-container">
      <!-- Search Sidebar -->
      <aside class="search-sidebar">
        <div class="search-card">
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
                @keyup.enter="kakaoMapStore.searchOrigin"
                class="input-field"
              />
              <button class="btn-origin-search" @click="kakaoMapStore.searchOrigin">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </div>
            <button class="btn-current-location" @click="kakaoMapStore.setOriginToCurrentLocation">
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

          <!-- Location Filters -->
          <div class="input-section">
            <label class="input-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              지역 선택
            </label>
            
            <div class="select-wrapper">
              <select v-model="kakaoMapStore.selectedCity" class="select-field">
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

          <div class="section-divider"></div>

          <!-- Bank Selection -->
          <div class="input-section">
            <label class="input-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
              </svg>
              은행 선택
            </label>
            
            <div class="select-wrapper">
              <select v-model="kakaoMapStore.selectedBank" class="select-field">
                <option value="">은행을 선택하세요</option>
                <option v-for="bank in kakaoMapStore.bankOptions" :key="bank" :value="bank">{{ bank }}</option>
              </select>
              <svg class="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>

          <!-- Search Button -->
          <button class="btn-search n-action n-action--primary" @click="kakaoMapStore.handleSearch">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            은행 찾기
          </button>
        </div>

        <!-- Info Card -->
        <div class="info-card">
          <div class="info-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>
          <div class="info-text">
            <p>지도를 클릭하면 해당 위치의 상세 정보를 확인할 수 있습니다.</p>
          </div>
        </div>
      </aside>

      <!-- Map Container — 데모 모드에서는 지도 대신 결과 목록을 보여준다 -->
      <MapPlaceholder
        v-if="USE_MOCK"
        :results="kakaoMapStore.searchResults"
        :selected="kakaoMapStore.selectedPlace"
        @select="kakaoMapStore.selectBank"
      />
      <div v-else class="map-wrapper">
        <div id="map"></div>
        <div class="map-overlay">
          <span class="overlay-badge">Kakao Map</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useKakaoMapStore } from '@/stores/kakaomap';
import { USE_MOCK } from '@/mocks/config';
import MapPlaceholder from '@/components/kakaomap/MapPlaceholder.vue';

const kakaoMapStore = useKakaoMapStore();

// 시/도 선택 시 시/군/구 옵션 업데이트
watch(() => kakaoMapStore.selectedCity, () => {
  kakaoMapStore.updateDistrictOptions();
});

onMounted(() => {
  // data.json 로드
  fetch("/data.json")
    .then((response) => response.json())
    .then((data) => kakaoMapStore.loadData(data));

  // 카카오 API 키 로드
  kakaoMapStore.loadKakaoScript();
});
</script>

<style scoped>
.kakao-map-page {
  min-height: 100vh;
  background: var(--n-page);
}

/* Main Container */
.main-container {
  margin: 0 auto;
  display: flex;
  gap: 24px;
  min-height: calc(100vh - 140px);
  max-width: 1200px;
  padding: 48px 24px 120px;
  align-items: flex-start;
}

/* Search Sidebar */
.search-sidebar {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 360px;
}

.search-card {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 28px;
  border: 0;
  border-radius: 28px;
  background: var(--n-surface);
  box-shadow: 0 24px 60px rgba(29, 26, 43, 0.12);
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--n-fg);
}

.input-field {
  width: 100%;
  padding: 12px 14px;
  font-size: 0.875rem;
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-md);
  background: var(--n-bg-subtle);
  transition: all 0.2s;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: var(--n-accent);
  background: var(--n-bg);
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
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 56px;
  height: 56px;
  border: 0;
  border-radius: 16px;
  background: var(--n-violet);
  color: var(--n-on-accent);
}

.btn-origin-search svg {
  width: 18px;
  height: 18px;
  color: var(--n-on-accent);
}

.btn-origin-search:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  background: var(--n-violet-hover);
}

.btn-current-location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s;
  height: 52px;
  border: 0;
  border-radius: 16px;
  background: var(--n-lilac);
  color: var(--n-violet-hover);
  font-size: 18px;
  font-weight: 700;
}

.btn-current-location svg {
  width: 14px;
  height: 14px;
}

.btn-current-location:hover {
  background: var(--n-lilac-strong);
  color: var(--n-violet-hover);
}

.origin-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  height: 36px;
  padding: 0 14px 0 10px;
  border: 0;
  border-radius: 999px;
  background: var(--n-lilac);
  font-size: 16px;
  font-weight: 600;
  color: var(--n-violet-hover);
}

.origin-badge svg {
  width: 16px;
  height: 16px;
}

.section-divider {
  height: 1px;
  background: var(--n-border);
  margin: 16px 0;
  display: none;
}

.select-wrapper {
  position: relative;
}

.select-field {
  width: 100%;
  padding: 12px 40px 12px 14px;
  font-size: 0.875rem;
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-md);
  background: var(--n-bg-subtle);
  appearance: none;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;
}

.select-field:focus {
  outline: none;
  border-color: var(--n-accent);
  background: var(--n-bg);
  box-shadow: 0 0 0 3px var(--n-accent-wash);
}

.select-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  pointer-events: none;
  right: 18px;
  color: var(--n-fg-muted);
}

/* 검색 — 모양은 global.css 의 .n-action 이 담당한다 */
.btn-search {
  display: flex;
  gap: 8px;
  width: 100%;
  padding: 14px;
  margin-top: 20px;
  transition: all 0.2s;
}

.btn-search svg {
  width: 18px;
  height: 18px;
}

/* Info Card */
.info-card {
  display: flex;
  padding: 18px 20px;
  gap: 14px;
  border: 0;
  border-radius: 24px;
  background: var(--n-fill);
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: var(--n-surface);
  color: var(--n-violet);
}

.info-icon svg {
  width: 18px;
  height: 18px;
  color: var(--n-warn-text);
}

.info-text p {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: var(--n-fg-muted);
}

/* 데모 모드 플레이스홀더도 지도와 같은 자리를 차지하게 한다 */
.map-placeholder {
  flex: 1;
}

/* Map Wrapper */
.map-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
  border-radius: 32px;
  min-height: 380px;
}

#map {
  width: 100%;
  height: 100%;
  min-height: 500px;
}

.map-overlay {
  position: absolute;
  top: 16px;
  right: 16px;
}

.overlay-badge {
  height: 36px;
  display: inline-flex;
  align-items: center;
  padding: 0 14px;
  border-radius: 999px;
  background: var(--n-surface);
  color: var(--n-violet-hover);
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(49, 32, 110, 0.10);
}

/* ═══════════════════════════════════════════════════════════════════
   F!NK 리디자인 — 흰 검색 카드(그림자) + 연한 면 입력, 바이올렛 버튼
   ═══════════════════════════════════════════════════════════════════ */
.input-label svg { width: 20px; height: 20px; color: var(--n-violet); }
.input-field,
.select-field { height: 56px; padding: 0 18px; border: 0; border-radius: 16px; background: var(--n-fill); font-size: 18px; font-weight: 600; color: var(--n-fg); }
.input-field:focus,
.select-field:focus { background: var(--n-lilac); box-shadow: 0 0 0 3px var(--n-lilac-strong); }
.input-field::placeholder { color: var(--n-fg-faint); font-weight: 500; }

/* Responsive */
@media (max-width: 900px) {
  .main-container {
    flex-direction: column;
  }

  .search-sidebar {
    width: 100%;
  }

  .map-wrapper {
    min-height: 400px;
  }
}
</style>
