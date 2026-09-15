/**
 * @파일명 mocks/config.js
 * @설명 목업 모드 스위치 및 공통 헬퍼
 * @기능
 *   - 목업 모드 플래그 (USE_MOCK)
 *   - 네트워크 지연 시뮬레이션 (delay)
 *   - 배열 페이지네이션 (paginate)
 * @비고
 *   백엔드 없이 포트폴리오/README 데모를 돌리기 위한 스위치.
 *   .env 없이도 기본 ON 이며, VITE_USE_MOCK=false 일 때만 실제 API 를 호출한다.
 */

// ========================================
// 목업 모드 플래그
// ========================================

/** @type {boolean} 목업 모드 여부. .env 가 없어도 기본 ON */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

// ========================================
// 공통 헬퍼
// ========================================

/**
 * 네트워크 지연 시뮬레이션
 * @description 로딩 스피너가 한 프레임이라도 보이도록 약간의 지연을 준다
 * @param {*} value - 지연 후 resolve 할 값
 * @param {number} [ms=250] - 지연 시간 (ms)
 * @returns {Promise<*>} 지연 후 value 로 resolve 되는 Promise
 */
export const delay = (value, ms = 250) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

/**
 * 배열 페이지네이션
 * @description 백엔드의 커스텀 페이지네이션 응답 형태에 맞춘 결과를 만든다
 * @param {Array} list - 전체 목록
 * @param {number} [page=1] - 요청 페이지 (1부터)
 * @param {number} [size=10] - 페이지당 항목 수
 * @returns {{items: Array, total_pages: number, current_page: number, total_count: number}}
 */
export const paginate = (list, page = 1, size = 10) => {
  const total_count = list.length
  const total_pages = Math.max(1, Math.ceil(total_count / size))
  const current_page = Math.min(Math.max(1, Number(page) || 1), total_pages)
  const start = (current_page - 1) * size

  return {
    items: list.slice(start, start + size),
    total_pages,
    current_page,
    total_count,
  }
}

/**
 * 깊은 복사
 * @description 목업 상수를 화면이 직접 변형하지 못하도록 사본을 넘긴다
 * @param {*} value - 복사할 값
 * @returns {*} 복사본
 */
export const clone = (value) => JSON.parse(JSON.stringify(value))
