/**
 * @파일명 kakaomap.js
 * @설명 카카오맵 API 통합 스토어
 * @기능
 *   - 카카오맵 SDK 로드 및 지도 초기화
 *   - 현재 위치 기반 지도 표시
 *   - 은행 검색 (키워드, 주변, 지역별)
 *   - 출발지/목적지 경로 안내
 *   - 마커 및 인포윈도우 관리
 * @외부API
 *   - Kakao Maps SDK: 지도 표시, 장소 검색
 *   - Kakao Mobility API: 경로 안내
 * @환경변수
 *   - VITE_KAKAO_API_KEY: 카카오맵 JavaScript SDK 키
 *   - VITE_KAKAO_REST_API_KEY: 카카오 REST API 키 (경로 안내용)
 */

import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { USE_MOCK } from "@/mocks/config";
import { searchBanks } from "@/mocks/kakaomap";

export const useKakaoMapStore = defineStore("kakaomap", () => {
  // ========================================
  // 상태 (State) - 지도 관련 객체
  // ========================================
  
  /** @type {Ref<Object|null>} 카카오맵 객체 */
  const map = ref(null);
  /** @type {Ref<Object|null>} 장소 검색 서비스 객체 */
  const places = ref(null);
  /** @type {Ref<Object|null>} 인포윈도우 객체 */
  const infoWindow = ref(null);
  /** @type {Array} 현재 지도에 표시된 마커 배열 */
  const markers = reactive([]);

  // ========================================
  // 상태 (State) - 지역 선택 관련
  // ========================================
  
  /** @type {Ref<Array>} 시/도 목록 */
  const cityOptions = ref([]);
  /** @type {Ref<Array>} 시/군/구 목록 */
  const districtOptions = ref([]);
  /** @type {Ref<string|null>} 선택된 시/도 */
  const selectedCity = ref(null);
  /** @type {Ref<string|null>} 선택된 시/군/구 */
  const selectedDistrict = ref(null);
  /** @type {Ref<string>} 선택된 은행명 */
  const selectedBank = ref('');
  /** @type {Ref<Array>} 은행 목록 */
  const bankOptions = ref([]);
  /** @type {Ref<Object|null>} data.json에서 로드한 전체 데이터 */
  const allData = ref(null);

  // ========================================
  // 상태 (State) - 위치 및 경로 관련
  // ========================================
  
  /** @type {Ref<{lat: number, lng: number}|null>} 현재 위치 좌표 */
  const currentLocation = ref(null);
  /** @type {Ref<Object|null>} 경로 표시용 Polyline 객체 */
  const routePolyline = ref(null);
  /** @type {Ref<{lat: number, lng: number, name: string}|null>} 출발지 정보 */
  const originLocation = ref(null);
  /** @type {Ref<string>} 출발지 검색 키워드 */
  const originSearchKeyword = ref('');
  /** @type {Ref<Object|null>} 출발지 마커 객체 */
  const originMarker = ref(null);

  // ========================================
  // 상태 (State) - 검색 결과 관련
  // ========================================
  
  /** @type {Ref<Array>} 검색 결과 목록 */
  const searchResults = ref([]);
  /** @type {Ref<Object|null>} 선택된 장소 정보 */
  const selectedPlace = ref(null);
  /** @type {Ref<Object|null>} 현재 위치 마커 객체 */
  const currentLocationMarker = ref(null);

  // ========================================
  // 액션 (Actions) - 지도 초기화
  // ========================================

  /**
   * 카카오맵 SDK 스크립트 로드
   * @description 카카오맵 JavaScript SDK를 동적으로 로드하고 지도를 초기화합니다
   * @param {string} containerId - 지도를 표시할 DOM 요소 ID (기본값: 'map')
   * @param {Object} options - 초기화 옵션
   * @param {boolean} options.autoSearch - 자동 검색 여부
   * @param {string} options.bankName - 검색할 은행명
   * @param {boolean} options.showCurrentLocationMarker - 현재 위치 마커 표시 여부
   */
  const loadKakaoScript = (containerId = 'map', options = {}) => {
    // === 목업 모드 분기 ===
    // SDK 를 띄우지 않고, 화면은 MapPlaceholder 로 지도 자리를 대신한다.
    // 자동 검색 옵션이 있으면 목업 검색 결과만 채운다.
    if (USE_MOCK) {
      if (options.autoSearch && options.bankName) {
        searchBankNearby(options.bankName);
      }
      return;
    }

    // === 실제 SDK 로드 (카카오 API 키 설정 시) ===
    // 이미 카카오 스크립트가 로드되어 있으면 바로 초기화
    if (window.kakao && window.kakao.maps) {
      initializeMap(containerId, options);
      return;
    }
    
    const apiKey = import.meta.env.VITE_KAKAO_API_KEY;
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services`;
    script.type = 'text/javascript';
    script.onload = () => initializeMap(containerId, options);
    document.head.appendChild(script);
  };

  /**
   * 지도 초기화
   * @description 카카오맵 SDK 로드 후 지도 객체를 생성하고 현재 위치를 설정합니다
   * @param {string} containerId - 지도 컨테이너 ID
   * @param {Object} options - 지도 옵션
   */
  const initializeMap = (containerId = 'map', options = {}) => {
    if (!window.kakao || !window.kakao.maps) {
      console.error('Kakao maps script not loaded');
      return;
    }
    
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById(containerId);
      if (!mapContainer) {
        console.error('Map container not found:', containerId);
        return;
      }
      
      // 기본 위치 (강남역)
      const defaultLat = 37.49818;
      const defaultLng = 127.027386;
      
      const mapOption = {
        center: new window.kakao.maps.LatLng(defaultLat, defaultLng),
        level: options.level || 5,
      };
      
      map.value = new window.kakao.maps.Map(mapContainer, mapOption);
      infoWindow.value = new window.kakao.maps.InfoWindow({ 
        zIndex: 1,
        removable: true
      });
      places.value = new window.kakao.maps.services.Places(map.value);
      
      // 현재 위치 가져오기
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const locPosition = new window.kakao.maps.LatLng(lat, lng);
            
            // 현재 위치 좌표 저장
            currentLocation.value = { lat, lng };
            
            // 지도 중심을 현재 위치로 이동
            map.value.setCenter(locPosition);
            
            // 현재 위치 마커 표시 (옵션에 따라)
            if (options.showCurrentLocationMarker !== false) {
              displayCurrentLocationMarker(lat, lng);
            }
            
            // 자동으로 출발지를 현재 위치로 설정
            if (options.autoSetOrigin !== false) {
              setOriginToCurrentLocation();
            }
            
            // 자동 검색 옵션이 있으면 주변 은행 검색
            if (options.autoSearch && options.bankName) {
              searchBankNearby(options.bankName, lat, lng);
            }
          },
          (error) => {
            console.error('현재 위치를 가져올 수 없습니다. 기본 위치(강남역)를 사용합니다.', error);
            // 기본 위치로 출발지 설정
            currentLocation.value = { lat: defaultLat, lng: defaultLng };
            
            if (options.autoSetOrigin !== false) {
              originLocation.value = { lat: defaultLat, lng: defaultLng, name: '기본 위치 (강남역)' };
            }
            
            // 위치 권한 거부 시에도 자동 검색 실행
            if (options.autoSearch && options.bankName) {
              searchBankNearby(options.bankName, defaultLat, defaultLng);
            }
          }
        );
      } else {
        console.error('Geolocation을 지원하지 않는 브라우저입니다.');
        // Geolocation 미지원 시 기본 위치 사용
        currentLocation.value = { lat: defaultLat, lng: defaultLng };
        
        if (options.autoSetOrigin !== false) {
          originLocation.value = { lat: defaultLat, lng: defaultLng, name: '기본 위치 (강남역)' };
        }
        
        // 자동 검색 실행
        if (options.autoSearch && options.bankName) {
          searchBankNearby(options.bankName, defaultLat, defaultLng);
        }
      }
    });
  };

  // ========================================
  // 액션 (Actions) - 마커 관리
  // ========================================

  /**
   * 현재 위치 마커 표시
   * @description 현재 위치에 마커를 표시하고 역지오코딩으로 주소를 표시합니다
   * @param {number} lat - 위도
   * @param {number} lng - 경도
   */
  const displayCurrentLocationMarker = (lat, lng) => {
    // 기존 마커 제거
    if (currentLocationMarker.value) {
      currentLocationMarker.value.setMap(null);
    }
    
    const locPosition = new window.kakao.maps.LatLng(lat, lng);
    
    currentLocationMarker.value = new window.kakao.maps.Marker({
      position: locPosition,
      map: map.value
    });
    
    // 역지오코딩으로 주소 정보 가져오기
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(lng, lat, (result, status) => {
      let addressName = '';
      let roadAddressName = '';
      
      if (status === window.kakao.maps.services.Status.OK) {
        const address = result[0];
        addressName = address.address?.address_name || '';
        roadAddressName = address.road_address?.address_name || '';
      }
      
      const message = `
        <div style="padding:10px; min-width:200px;">
          <div style="font-size:14px; font-weight:bold; margin-bottom:8px; color:#4A90E2;">
            📍 현재 위치
          </div>
          ${addressName ? `
            <div style="font-size:12px; color:#666; margin-bottom:4px;">
              📍 ${addressName}
            </div>
          ` : ''}
          ${roadAddressName ? `
            <div style="font-size:11px; color:#888; margin-bottom:4px;">
              🛣️ ${roadAddressName}
            </div>
          ` : ''}
        </div>
      `;
      
      const customInfoWindow = new window.kakao.maps.InfoWindow({
        content: message,
        removable: true
      });
      customInfoWindow.open(map.value, currentLocationMarker.value);
    });
  };

  // ========================================
  // 액션 (Actions) - 데이터 로드
  // ========================================

  /**
   * data.json 데이터 로드
   * @description 시/도, 시/군/구, 은행 목록 데이터를 로드합니다
   * @param {Object} data - 로드할 데이터 객체
   */
  const loadData = (data) => {
    allData.value = data;
    cityOptions.value = data.mapInfo.map((sido) => sido.name);
    bankOptions.value = data.bankInfo || [];
  };

  /**
   * 시/군/구 옵션 업데이트
   * @description 선택된 시/도에 해당하는 시/군/구 목록을 갱신합니다
   */
  const updateDistrictOptions = () => {
    const selectedCityValue = selectedCity.value;
    if (!selectedCityValue) {
      districtOptions.value = [];
      return;
    }
    const sido = allData.value.mapInfo.find((item) => item.name === selectedCityValue);
    districtOptions.value = sido ? sido.countries : [];
  };

  // ========================================
  // 액션 (Actions) - 장소 검색
  // ========================================

  /**
   * 장소 검색 콜백 함수
   * @description 카카오 장소 검색 결과를 처리하고 마커를 표시합니다
   * @param {Array} result - 검색 결과 배열
   * @param {string} status - 검색 상태
   */
  const placesSearchCallback = (result, status) => {
    if (status !== window.kakao.maps.services.Status.OK) {
      alert('검색 결과가 없습니다.');
      return;
    }
    clearMarkers();
    infoWindow.value.close();
    
    const bounds = new window.kakao.maps.LatLngBounds();
    
    result.forEach((place) => {
      const position = new window.kakao.maps.LatLng(place.y, place.x);
      const marker = new window.kakao.maps.Marker({ position });
      marker.setMap(map.value);
      markers.push(marker);
      bounds.extend(position);
      
      // 상세 정보 HTML 구성
      const html = `
        <div style="padding:10px; min-width:200px;">
          <div style="font-size:14px; font-weight:bold; margin-bottom:8px; color:#e67e57;">
            ${place.place_name}
          </div>
          <div style="font-size:12px; color:#666; margin-bottom:4px;">
            📍 ${place.address_name}
          </div>
          ${place.road_address_name ? `
            <div style="font-size:11px; color:#888; margin-bottom:4px;">
              🛣️ ${place.road_address_name}
            </div>
          ` : ''}
          ${place.phone ? `
            <div style="font-size:11px; color:#888; margin-bottom:4px;">
              📞 ${place.phone}
            </div>
          ` : ''}
          ${place.distance ? `
            <div style="font-size:11px; color:#e67e57; font-weight:600; margin-top:6px;">
              📏 ${place.distance}m
            </div>
          ` : ''}
        </div>
      `;
      
      window.kakao.maps.event.addListener(marker, 'click', () => {
        infoWindow.value.setContent(html);
        infoWindow.value.open(map.value, marker);
        
        // 출발지가 설정되어 있으면 경로 표시 (출발지 우선, 없으면 현재 위치)
        const origin = originLocation.value || currentLocation.value;
        if (origin) {
          drawRoute(origin.lat, origin.lng, place.y, place.x);
        }
      });
    });
    
    map.value.setBounds(bounds);
  };

  /**
   * 모든 마커 제거
   * @description 지도에 표시된 모든 마커를 제거합니다
   */
  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    markers.length = 0; // 마커 배열 비우기
  };

  // ========================================
  // 액션 (Actions) - 경로 안내
  // ========================================

  /**
   * 경로 그리기
   * @description Kakao Mobility API를 사용하여 출발지에서 목적지까지 경로를 표시합니다
   * @param {number} originLat - 출발지 위도
   * @param {number} originLng - 출발지 경도
   * @param {number} destLat - 목적지 위도
   * @param {number} destLng - 목적지 경도
   */
  const drawRoute = async (originLat, originLng, destLat, destLng) => {
    try {
      // 기존 경로 제거
      if (routePolyline.value) {
        routePolyline.value.setMap(null);
      }
      
      // Kakao Mobility API 호출 (REST API KEY 사용)
      const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
      const REST_API_URL = 'https://apis-navi.kakaomobility.com/v1/directions';
      const response = await fetch(
        `${REST_API_URL}?origin=${originLng},${originLat}&destination=${destLng},${destLat}&priority=RECOMMEND`,
        {
          headers: {
            'Authorization': `KakaoAK ${REST_API_KEY}`
          }
        }
      );
      
      if (!response.ok) {
        console.error('경로 API 호출 실패:', response.status);
        return;
      }
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const path = [];
        
        // 경로의 모든 구간(section)에서 좌표 추출
        route.sections.forEach(section => {
          section.roads.forEach(road => {
            road.vertexes.forEach((vertex, index) => {
              // vertexes는 [lng, lat, lng, lat, ...] 형태
              if (index % 2 === 0) {
                const lng = vertex;
                const lat = road.vertexes[index + 1];
                path.push(new window.kakao.maps.LatLng(lat, lng));
              }
            });
          });
        });
        
        // Polyline 생성
        routePolyline.value = new window.kakao.maps.Polyline({
          path: path,
          strokeWeight: 5,
          strokeColor: '#4A90E2',
          strokeOpacity: 0.8,
          strokeStyle: 'solid'
        });
        
        // 지도에 표시
        routePolyline.value.setMap(map.value);
      }
    } catch (error) {
      console.error('경로 그리기 오류:', error);
    }
  };

  /**
   * 은행 검색 실행
   * @description 선택된 시/도, 시/군/구, 은행명으로 검색합니다
   */
  const handleSearch = () => {
    // === 목업 모드 분기 ===
    // 지도는 없지만 시/도·은행 선택과 결과 리스트는 그대로 동작한다
    if (USE_MOCK) {
      if (!selectedCity.value || !selectedBank.value) {
        alert('시/도와 은행명을 선택해주세요.');
        return;
      }
      searchResults.value = searchBanks(
        selectedCity.value,
        selectedDistrict.value,
        selectedBank.value
      );
      selectedPlace.value = null;
      return;
    }

    // === 실제 SDK 검색 (카카오 API 키 설정 시) ===
    // 지도가 초기화되지 않았으면 경고
    if (!places.value) {
      alert('지도가 아직 로딩 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    if (!selectedCity.value || !selectedBank.value) {
      alert('시/도와 은행명을 선택해주세요.');
      return;
    }
    const keyword = `${selectedCity.value} ${selectedDistrict.value ? selectedDistrict.value + ' ' : ''}${selectedBank.value} 은행`;
    places.value.keywordSearch(keyword, placesSearchCallback);
  };

  // ========================================
  // 액션 (Actions) - 출발지 관리
  // ========================================

  /**
   * 출발지를 현재 위치로 설정
   * @description GPS 현재 위치를 출발지로 설정합니다
   */
  const setOriginToCurrentLocation = () => {
    if (!currentLocation.value) {
      console.warn('현재 위치 정보가 없습니다. 위치를 가져오는 중일 수 있습니다.');
      return;
    }
    
    if (!window.kakao || !window.kakao.maps) {
      console.warn('카카오맵이 아직 로드되지 않았습니다.');
      return;
    }
    
    const { lat, lng } = currentLocation.value;
    
    // 역지오코딩으로 주소 정보 가져오기
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(lng, lat, (result, status) => {
      let placeInfo = null;
      
      if (status === window.kakao.maps.services.Status.OK) {
        const address = result[0];
        placeInfo = {
          address_name: address.address?.address_name || '',
          road_address_name: address.road_address?.address_name || '',
          phone: '',
          distance: ''
        };
      }
      
      setOrigin(lat, lng, '현재 위치', placeInfo);
    });
  };

  /**
   * 출발지 설정 (공통 함수)
   * @description 지정된 좌표를 출발지로 설정하고 마커를 표시합니다
   * @param {number} lat - 위도
   * @param {number} lng - 경도
   * @param {string} name - 출발지 이름
   * @param {Object|null} placeInfo - 장소 상세 정보
   */
  const setOrigin = (lat, lng, name, placeInfo = null) => {
    originLocation.value = { lat, lng, name };
    
    // 기존 출발지 마커 제거
    if (originMarker.value) {
      originMarker.value.setMap(null);
    }
    
    // 새 출발지 마커 생성 (빨간색 마커)
    const position = new window.kakao.maps.LatLng(lat, lng);
    
    const markerImage = new window.kakao.maps.MarkerImage(
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png',
      new window.kakao.maps.Size(50, 45),
      { offset: new window.kakao.maps.Point(15, 43) }
    );
    
    originMarker.value = new window.kakao.maps.Marker({
      position: position,
      map: map.value,
      image: markerImage
    });
    
    // 출발지 인포윈도우 (은행 인포윈도우와 동일한 스타일)
    const originInfoContent = `
      <div style="padding:10px; min-width:200px;">
        <div style="font-size:14px; font-weight:bold; margin-bottom:8px; color:#e67e57;">
          🚗 출발지: ${name}
        </div>
        ${placeInfo?.address_name ? `
          <div style="font-size:12px; color:#666; margin-bottom:4px;">
            📍 ${placeInfo.address_name}
          </div>
        ` : ''}
        ${placeInfo?.road_address_name ? `
          <div style="font-size:11px; color:#888; margin-bottom:4px;">
            🛣️ ${placeInfo.road_address_name}
          </div>
        ` : ''}
        ${placeInfo?.phone ? `
          <div style="font-size:11px; color:#888; margin-bottom:4px;">
            📞 ${placeInfo.phone}
          </div>
        ` : ''}
        ${placeInfo?.distance ? `
          <div style="font-size:11px; color:#e67e57; font-weight:600; margin-top:6px;">
            📏 ${placeInfo.distance}m
          </div>
        ` : ''}
      </div>
    `;
    const originInfo = new window.kakao.maps.InfoWindow({
      content: originInfoContent,
      removable: true
    });
    originInfo.open(map.value, originMarker.value);
  };

  /**
   * 출발지 검색
   * @description 키워드로 출발지를 검색하고 첫 번째 결과를 출발지로 설정합니다
   */
  const searchOrigin = () => {
    if (!originSearchKeyword.value.trim()) {
      alert('출발지를 입력해주세요.');
      return;
    }
    
    if (!places.value) {
      alert('지도가 아직 로딩 중입니다.');
      return;
    }
    
    places.value.keywordSearch(originSearchKeyword.value, (result, status) => {
      if (status !== window.kakao.maps.services.Status.OK) {
        alert('검색 결과가 없습니다.');
        return;
      }
      
      // 첫 번째 결과를 출발지로 설정 (장소 정보 포함)
      const place = result[0];
      setOrigin(place.y, place.x, place.place_name, {
        address_name: place.address_name,
        road_address_name: place.road_address_name,
        phone: place.phone,
        distance: place.distance
      });
      
      // 지도 중심 이동
      const position = new window.kakao.maps.LatLng(place.y, place.x);
      map.value.setCenter(position);
    });
  };

  // ========================================
  // 액션 (Actions) - 은행 검색 (ProductDetailView용)
  // ========================================

  /**
   * 특정 은행 주변 검색
   * @description 지정된 위치 주변 5km 반경 내 은행을 검색합니다
   * @param {string} bankName - 검색할 은행명
   * @param {number} lat - 중심 위도
   * @param {number} lng - 중심 경도
   */
  const searchBankNearby = (bankName, lat, lng) => {
    // === 목업 모드 분기 ===
    if (USE_MOCK) {
      searchResults.value = searchBanks(null, null, bankName);
      selectedPlace.value = null;
      return;
    }

    // === 실제 SDK 검색 (카카오 API 키 설정 시) ===
    if (!places.value) {
      console.error('Places 객체가 초기화되지 않았습니다.');
      return;
    }
    
    const location = new window.kakao.maps.LatLng(lat, lng);
    
    places.value.keywordSearch(
      `${bankName}`,
      (result, status) => {
        if (status !== window.kakao.maps.services.Status.OK) {
          searchResults.value = [];
          return;
        }
        
        displayBankMarkers(result);
      },
      {
        location: location,
        radius: 5000, // 5km 반경
        sort: window.kakao.maps.services.SortBy.DISTANCE
      }
    );
  };

  /**
   * 지역 + 은행명으로 검색
   * @description 선택된 지역 내에서 특정 은행을 검색합니다
   * @param {string} bankName - 검색할 은행명
   */
  const searchBankByRegion = (bankName) => {
    // === 목업 모드 분기 ===
    if (USE_MOCK) {
      if (!selectedCity.value) {
        alert('검색 지역을 선택해주세요.');
        return;
      }
      searchResults.value = searchBanks(selectedCity.value, selectedDistrict.value, bankName);
      selectedPlace.value = null;
      return;
    }

    // === 실제 SDK 검색 (카카오 API 키 설정 시) ===
    if (!places.value) {
      alert('지도가 아직 로딩 중입니다.');
      return;
    }

    if (!selectedCity.value) {
      alert('검색 지역을 선택해주세요.');
      return;
    }
    
    const keyword = `${selectedCity.value} ${selectedDistrict.value ? selectedDistrict.value + ' ' : ''}${bankName}`;
    
    places.value.keywordSearch(keyword, (result, status) => {
      if (status !== window.kakao.maps.services.Status.OK) {
        alert('검색 결과가 없습니다.');
        searchResults.value = [];
        return;
      }
      
      displayBankMarkers(result);
    });
  };

  /**
   * 은행 마커 표시
   * @description 검색 결과를 마커로 표시하고 클릭 이벤트를 설정합니다
   * @param {Array} results - 검색 결과 배열
   */
  const displayBankMarkers = (results) => {
    clearMarkers();
    searchResults.value = results;
    
    const bounds = new window.kakao.maps.LatLngBounds();
    
    results.forEach((place) => {
      const position = new window.kakao.maps.LatLng(place.y, place.x);
      const marker = new window.kakao.maps.Marker({ position });
      marker.setMap(map.value);
      markers.push(marker);
      bounds.extend(position);
      
      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        showBankInfoWindow(place, marker);
        selectedPlace.value = place;
        
        // 출발지가 설정되어 있으면 경로 표시
        const origin = originLocation.value || currentLocation.value;
        if (origin) {
          drawRoute(origin.lat, origin.lng, place.y, place.x);
        }
      });
    });
    
    // 출발지 마커도 bounds에 포함
    if (originLocation.value) {
      bounds.extend(new window.kakao.maps.LatLng(originLocation.value.lat, originLocation.value.lng));
    }
    
    map.value.setBounds(bounds);
  };

  /**
   * 은행 인포윈도우 표시
   * @description 은행 상세 정보를 인포윈도우로 표시합니다
   * @param {Object} place - 장소 정보
   * @param {Object} marker - 마커 객체
   */
  const showBankInfoWindow = (place, marker) => {
    const html = `
      <div style="padding:10px; min-width:200px;">
        <div style="font-size:14px; font-weight:bold; margin-bottom:8px; color:#e67e57;">
          ${place.place_name}
        </div>
        <div style="font-size:12px; color:#666; margin-bottom:4px;">
          📍 ${place.address_name}
        </div>
        ${place.road_address_name ? `
          <div style="font-size:11px; color:#888; margin-bottom:4px;">
            🛣️ ${place.road_address_name}
          </div>
        ` : ''}
        ${place.phone ? `
          <div style="font-size:11px; color:#888; margin-bottom:4px;">
            📞 ${place.phone}
          </div>
        ` : ''}
        ${place.distance ? `
          <div style="font-size:11px; color:#e67e57; font-weight:600; margin-top:6px;">
            📏 ${place.distance}m
          </div>
        ` : ''}
      </div>
    `;
    
    infoWindow.value.setContent(html);
    infoWindow.value.open(map.value, marker);
  };

  /**
   * 은행 선택
   * @description 리스트에서 은행 클릭 시 해당 마커로 이동하고 경로를 표시합니다
   * @param {Object} place - 선택된 장소 정보
   */
  const selectBank = (place) => {
    selectedPlace.value = place;

    // === 목업 모드 분기 ===
    // 지도가 없으므로 선택 상태만 남긴다 (화면은 선택된 지점 카드를 보여준다)
    if (USE_MOCK) return;

    // === 실제 SDK 동작 (카카오 API 키 설정 시) ===
    const position = new window.kakao.maps.LatLng(place.y, place.x);
    map.value.setCenter(position);
    
    // 해당 마커 찾아서 인포윈도우 열기
    const markerIndex = searchResults.value.findIndex(p => p.id === place.id);
    if (markerIndex >= 0 && markers[markerIndex]) {
      showBankInfoWindow(place, markers[markerIndex]);
    }
    
    // 경로 그리기
    const origin = originLocation.value || currentLocation.value;
    if (origin) {
      drawRoute(origin.lat, origin.lng, place.y, place.x);
    }
  };

  // ========================================
  // 액션 (Actions) - 정리
  // ========================================

  /**
   * 지도 자원 정리
   * @description 컴포넌트 언마운트 시 모든 지도 관련 자원을 정리합니다
   */
  const cleanup = () => {
    // === 목업 모드 분기 ===
    // 정리할 지도 자원이 없다. 검색 상태만 비운다
    if (USE_MOCK) {
      searchResults.value = [];
      selectedPlace.value = null;
      return;
    }

    // === 실제 SDK 정리 (카카오 API 키 설정 시) ===
    clearMarkers();
    if (originMarker.value) {
      originMarker.value.setMap(null);
      originMarker.value = null;
    }
    if (currentLocationMarker.value) {
      currentLocationMarker.value.setMap(null);
      currentLocationMarker.value = null;
    }
    if (routePolyline.value) {
      routePolyline.value.setMap(null);
      routePolyline.value = null;
    }
    searchResults.value = [];
    selectedPlace.value = null;
    originLocation.value = null;
    map.value = null;
    places.value = null;
    infoWindow.value = null;
  };

  // ========================================
  // 반환 (Export)
  // ========================================
  return {
    // 상태 - 지도 객체
    map,
    places,
    infoWindow,
    markers,
    // 상태 - 지역 선택
    cityOptions,
    districtOptions,
    bankOptions,
    selectedCity,
    selectedDistrict,
    selectedBank,
    allData,
    // 상태 - 위치/경로
    currentLocation,
    routePolyline,
    originLocation,
    originSearchKeyword,
    originMarker,
    // 상태 - 검색 결과
    searchResults,
    selectedPlace,
    currentLocationMarker,
    // 액션 - 지도 초기화
    loadKakaoScript,
    initializeMap,
    loadData,
    updateDistrictOptions,
    // 액션 - 검색
    placesSearchCallback,
    clearMarkers,
    handleSearch,
    // 액션 - 경로
    drawRoute,
    setOriginToCurrentLocation,
    setOrigin,
    searchOrigin,
    // 액션 - 은행 검색
    searchBankNearby,
    searchBankByRegion,
    displayBankMarkers,
    showBankInfoWindow,
    selectBank,
    // 액션 - 정리
    cleanup,
  };
})