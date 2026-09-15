/**
 * @파일명 mocks/likesState.js
 * @설명 관심상품(좋아요) 메모리 상태
 * @기능
 *   - 관심 등록 여부 조회 (isLiked)
 *   - 상품별 좋아요 수 조회 (getLikesCount)
 *   - 관심상품 토글 (toggleLike)
 *   - 등록된 키 목록 조회 (getLikedEntries)
 * @비고
 *   products.js 와 likes.js 가 모두 참조하므로, 순환 참조를 피하려고 상태만 따로 뺐다.
 *   이 모듈은 어떤 목업 데이터도 import 하지 않는다. 새로고침 시 초기값으로 돌아간다.
 */

// ========================================
// 메모리 상태
// ========================================

/**
 * 관심 등록된 상품 키 목록 (`${product_type}:${fin_prdt_cd}` 형태, 최근 등록 순)
 * @type {Array<string>}
 */
let likedKeys = [
  'saving:SV-SH-0203',
  'saving:SV-KAKAO-0202',
  'deposit:DP-KAKAO-0103',
  'deposit:DP-KB-0101',
]

/** @type {Map<string, string>} 키별 등록 시각 (ISO 문자열) */
const likedAt = new Map([
  ['saving:SV-SH-0203', '2026-09-12T10:24:00+09:00'],
  ['saving:SV-KAKAO-0202', '2026-09-10T21:03:00+09:00'],
  ['deposit:DP-KAKAO-0103', '2026-09-08T14:47:00+09:00'],
  ['deposit:DP-KB-0101', '2026-09-03T09:15:00+09:00'],
])

/** @type {Map<string, number>} 상품별 좋아요 수 (토글 시 ±1) */
const counts = new Map()

// ========================================
// 내부 헬퍼
// ========================================

/** 키 조합 */
const toKey = (productType, finPrdtCd) => `${productType}:${finPrdtCd}`

// ========================================
// 조회 / 변경
// ========================================

/**
 * 상품별 좋아요 수 조회
 * @param {'deposit'|'saving'} productType - 상품 타입
 * @param {string} finPrdtCd - 상품 코드
 * @returns {number} 좋아요 수
 */
export const getLikesCount = (productType, finPrdtCd) => {
  const key = toKey(productType, finPrdtCd)

  if (!counts.has(key)) {
    // 상품 코드 길이로 고정값을 만든다 (새로고침해도 동일)
    counts.set(key, 12 + (finPrdtCd.length % 7) * 3)
  }

  return counts.get(key)
}

/**
 * 관심 등록 여부
 * @param {'deposit'|'saving'} productType - 상품 타입
 * @param {string} finPrdtCd - 상품 코드
 * @returns {boolean} 등록 여부
 */
export const isLiked = (productType, finPrdtCd) =>
  likedKeys.includes(toKey(productType, finPrdtCd))

/**
 * 관심 등록된 항목 목록
 * @returns {Array<{product_type: string, fin_prdt_cd: string, created_at: string}>} 최근 등록 순
 */
export const getLikedEntries = () =>
  likedKeys.map((key) => {
    const [product_type, fin_prdt_cd] = key.split(':')
    return {
      product_type,
      fin_prdt_cd,
      created_at: likedAt.get(key) || new Date().toISOString(),
    }
  })

/**
 * 관심상품 토글
 * @param {'deposit'|'saving'} productType - 상품 타입
 * @param {string} finPrdtCd - 상품 코드
 * @returns {{liked: boolean, likes_count: number}} 토글 결과
 */
export const toggleLike = (productType, finPrdtCd) => {
  const key = toKey(productType, finPrdtCd)
  const count = getLikesCount(productType, finPrdtCd)

  if (likedKeys.includes(key)) {
    likedKeys = likedKeys.filter((item) => item !== key)
    counts.set(key, Math.max(0, count - 1))
    return { liked: false, likes_count: counts.get(key) }
  }

  likedKeys = [key, ...likedKeys]
  likedAt.set(key, new Date().toISOString())
  counts.set(key, count + 1)

  return { liked: true, likes_count: counts.get(key) }
}
