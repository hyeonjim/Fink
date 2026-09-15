/**
 * @파일명 mocks/kakaomap.js
 * @설명 은행 지점 목업 데이터
 * @기능
 *   - 지역·은행명으로 지점 검색 (searchBanks)
 * @비고
 *   카카오 로컬 API 응답 형태를 그대로 흉내 낸다.
 *   좌표(x, y)는 카카오 API 와 동일하게 문자열이며, x 가 경도·y 가 위도다.
 *   목업 모드에서는 지도 SDK 를 띄우지 않으므로 좌표는 실제로 쓰이지 않지만,
 *   백엔드 연결 시와 형태를 맞추기 위해 그대로 둔다.
 */

// ========================================
// 지점 목록 (서울 18 / 경기 5 / 부산 5)
// ========================================

/** @type {Array<Object>} 은행 지점 (카카오 로컬 API 응답 형태) */
const branches = [
  // 서울 — 주요 은행마다 3~4개 지점을 둬서 어떤 조합으로 검색해도 결과가 나오게 한다
  { id: '11001', place_name: '국민은행 강남역지점', address_name: '서울 강남구 역삼동 823', road_address_name: '서울 강남구 강남대로 390', phone: '02-538-1234', x: '127.027621', y: '37.497942', region: '서울특별시', district: '강남구', bank: '국민은행' },
  { id: '11002', place_name: '국민은행 여의도지점', address_name: '서울 영등포구 여의도동 36', road_address_name: '서울 영등포구 국제금융로 10', phone: '02-783-1100', x: '126.925417', y: '37.525104', region: '서울특별시', district: '영등포구', bank: '국민은행' },
  { id: '11003', place_name: '국민은행 홍대입구지점', address_name: '서울 마포구 서교동 357', road_address_name: '서울 마포구 양화로 160', phone: '02-334-2200', x: '126.922080', y: '37.556785', region: '서울특별시', district: '마포구', bank: '국민은행' },
  { id: '11004', place_name: '국민은행 종로지점', address_name: '서울 종로구 관철동 20', road_address_name: '서울 종로구 종로 63', phone: '02-732-3300', x: '126.987614', y: '37.569281', region: '서울특별시', district: '종로구', bank: '국민은행' },

  { id: '11011', place_name: '신한은행 테헤란로지점', address_name: '서울 강남구 역삼동 737', road_address_name: '서울 강남구 테헤란로 152', phone: '02-555-7788', x: '127.036377', y: '37.500365', region: '서울특별시', district: '강남구', bank: '신한은행' },
  { id: '11012', place_name: '신한은행 서초지점', address_name: '서울 서초구 서초동 1327', road_address_name: '서울 서초구 서초대로 320', phone: '02-3471-5500', x: '127.021892', y: '37.494851', region: '서울특별시', district: '서초구', bank: '신한은행' },
  { id: '11013', place_name: '신한은행 광화문지점', address_name: '서울 종로구 세종로 100', road_address_name: '서울 종로구 세종대로 175', phone: '02-722-8800', x: '126.976614', y: '37.571281', region: '서울특별시', district: '종로구', bank: '신한은행' },

  { id: '11021', place_name: '우리은행 서초지점', address_name: '서울 서초구 서초동 1305', road_address_name: '서울 서초구 서초대로 301', phone: '02-3474-2200', x: '127.019892', y: '37.492851', region: '서울특별시', district: '서초구', bank: '우리은행' },
  { id: '11022', place_name: '우리은행 강남중앙지점', address_name: '서울 강남구 역삼동 814', road_address_name: '서울 강남구 테헤란로 129', phone: '02-538-9900', x: '127.031377', y: '37.499365', region: '서울특별시', district: '강남구', bank: '우리은행' },
  { id: '11023', place_name: '우리은행 명동지점', address_name: '서울 중구 명동2가 53', road_address_name: '서울 중구 명동길 14', phone: '02-771-4400', x: '126.984614', y: '37.563281', region: '서울특별시', district: '중구', bank: '우리은행' },

  { id: '11031', place_name: '하나은행 여의도지점', address_name: '서울 영등포구 여의도동 23', road_address_name: '서울 영등포구 의사당대로 82', phone: '02-783-4500', x: '126.925417', y: '37.523104', region: '서울특별시', district: '영등포구', bank: '하나은행' },
  { id: '11032', place_name: '하나은행 강남역지점', address_name: '서울 강남구 역삼동 830', road_address_name: '서울 강남구 강남대로 382', phone: '02-538-6600', x: '127.026621', y: '37.496942', region: '서울특별시', district: '강남구', bank: '하나은행' },
  { id: '11033', place_name: '하나은행 을지로지점', address_name: '서울 중구 을지로1가 101', road_address_name: '서울 중구 을지로 66', phone: '02-729-1000', x: '126.986614', y: '37.566281', region: '서울특별시', district: '중구', bank: '하나은행' },

  { id: '11041', place_name: '농협은행 홍대입구지점', address_name: '서울 마포구 서교동 358', road_address_name: '서울 마포구 양화로 156', phone: '02-334-9010', x: '126.922080', y: '37.556785', region: '서울특별시', district: '마포구', bank: '농협은행' },
  { id: '11042', place_name: '농협은행 강남지점', address_name: '서울 강남구 논현동 118', road_address_name: '서울 강남구 논현로 508', phone: '02-544-7700', x: '127.032621', y: '37.504942', region: '서울특별시', district: '강남구', bank: '농협은행' },

  { id: '11051', place_name: '기업은행 종로지점', address_name: '서울 종로구 관철동 13', road_address_name: '서울 종로구 종로 51', phone: '02-732-6600', x: '126.986614', y: '37.569281', region: '서울특별시', district: '종로구', bank: '기업은행' },
  { id: '11052', place_name: '기업은행 구로디지털지점', address_name: '서울 구로구 구로동 188', road_address_name: '서울 구로구 디지털로 300', phone: '02-852-3300', x: '126.895417', y: '37.485104', region: '서울특별시', district: '구로구', bank: '기업은행' },

  // 경기
  { id: '41001', place_name: '국민은행 분당정자지점', address_name: '경기 성남시 분당구 정자동 25', road_address_name: '경기 성남시 분당구 정자일로 121', phone: '031-717-3300', x: '127.108122', y: '37.365264', region: '경기도', district: '성남시 분당구', bank: '국민은행' },
  { id: '41002', place_name: '신한은행 수원역지점', address_name: '경기 수원시 팔달구 매산로1가 18', road_address_name: '경기 수원시 팔달구 덕영대로 924', phone: '031-246-1700', x: '127.000473', y: '37.265921', region: '경기도', district: '수원시 팔달구', bank: '신한은행' },
  { id: '41003', place_name: '하나은행 일산주엽지점', address_name: '경기 고양시 일산서구 주엽동 65', road_address_name: '경기 고양시 일산서구 중앙로 1360', phone: '031-919-4400', x: '126.766283', y: '37.670514', region: '경기도', district: '고양시 일산서구', bank: '하나은행' },
  { id: '41004', place_name: '우리은행 판교지점', address_name: '경기 성남시 분당구 삼평동 681', road_address_name: '경기 성남시 분당구 판교역로 235', phone: '031-8017-2200', x: '127.111122', y: '37.394264', region: '경기도', district: '성남시 분당구', bank: '우리은행' },
  { id: '41005', place_name: '농협은행 용인기흥지점', address_name: '경기 용인시 기흥구 신갈동 12', road_address_name: '경기 용인시 기흥구 중부대로 184', phone: '031-283-5500', x: '127.113283', y: '37.275514', region: '경기도', district: '용인시 기흥구', bank: '농협은행' },

  // 부산
  { id: '26001', place_name: '부산은행 서면지점', address_name: '부산 부산진구 부전동 168', road_address_name: '부산 부산진구 중앙대로 708', phone: '051-808-2200', x: '129.058122', y: '35.157841', region: '부산광역시', district: '부산진구', bank: '부산은행' },
  { id: '26002', place_name: '국민은행 해운대지점', address_name: '부산 해운대구 우동 1394', road_address_name: '부산 해운대구 해운대로 570', phone: '051-742-5500', x: '129.163021', y: '35.163285', region: '부산광역시', district: '해운대구', bank: '국민은행' },
  { id: '26003', place_name: '농협은행 광안리지점', address_name: '부산 수영구 광안동 192', road_address_name: '부산 수영구 광안해변로 219', phone: '051-753-8800', x: '129.118472', y: '35.153106', region: '부산광역시', district: '수영구', bank: '농협은행' },
  { id: '26004', place_name: '부산은행 해운대지점', address_name: '부산 해운대구 중동 1394', road_address_name: '부산 해운대구 해운대로 620', phone: '051-746-1100', x: '129.166021', y: '35.166285', region: '부산광역시', district: '해운대구', bank: '부산은행' },
  { id: '26005', place_name: '신한은행 부산서면지점', address_name: '부산 부산진구 부전동 173', road_address_name: '부산 부산진구 중앙대로 692', phone: '051-806-3300', x: '129.057122', y: '35.155841', region: '부산광역시', district: '부산진구', bank: '신한은행' },
]

// ========================================
// 검색
// ========================================

/**
 * 은행 지점 검색
 * @description 지역과 은행명으로 거른다. 걸리는 지점이 없으면 은행명만으로 다시 찾는다
 * @param {string|null} city - 시/도 (예: '서울특별시')
 * @param {string|null} district - 시/군/구 (예: '강남구')
 * @param {string|null} bank - 은행명 (예: '국민은행')
 * @returns {Array<Object>} 카카오 로컬 API 형태의 지점 배열 (distance 포함)
 */
export const searchBanks = (city = null, district = null, bank = null) => {
  const matches = (branch) => {
    if (city && !branch.region.includes(city) && !city.includes(branch.region)) return false
    if (district && !branch.district.includes(district)) return false
    if (bank && !branch.bank.includes(bank) && !bank.includes(branch.bank)) return false
    return true
  }

  let found = branches.filter(matches)

  // 지역까지 맞는 지점이 없으면 은행명만으로 다시 찾는다 (빈 화면 방지)
  if (found.length === 0 && bank) {
    found = branches.filter((branch) => branch.bank.includes(bank) || bank.includes(branch.bank))
  }

  // 그래도 없으면 전체를 보여준다
  if (found.length === 0) {
    found = branches
  }

  return found.map((branch, index) => ({
    id: branch.id,
    place_name: branch.place_name,
    address_name: branch.address_name,
    road_address_name: branch.road_address_name,
    phone: branch.phone,
    // 카카오 API 는 거리를 문자열(m)로 준다
    distance: String(320 + index * 480),
    x: branch.x,
    y: branch.y,
    place_url: `https://place.map.kakao.com/${branch.id}`,
    category_group_code: 'BK9',
    category_name: '금융,보험 > 금융서비스 > 은행',
  }))
}

/**
 * 단일 지점 조회 (챗봇 은행 찾기용)
 * @param {string} bankName - 은행명
 * @returns {Object|null} 가장 가까운 지점 하나. 없으면 null
 */
export const findNearestBank = (bankName) => {
  const results = searchBanks(null, null, bankName)
  return results[0] || null
}
