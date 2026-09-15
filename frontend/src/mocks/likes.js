/**
 * @파일명 mocks/likes.js
 * @설명 관심상품(좋아요) 목업 조회
 * @기능
 *   - 관심상품 목록 조회 (getLikeList)
 * @API엔드포인트
 *   - GET /api/products/likes/me/ : 내 관심상품 목록
 * @비고
 *   백엔드는 목록에 fin_prdt_cd/product_type 만 주고 프론트가 상세를 N+1 로 다시 조회하지만,
 *   목업은 처음부터 은행명·상품명·options 까지 채워서 돌려준다.
 *   options 가 없으면 마이페이지 관심목록의 금리 블록이 빈 채로 보인다.
 *   좋아요 상태 자체는 mocks/likesState.js 가 소유한다 (순환 참조 회피).
 */

import { mockDeposits, mockSavings } from './products'
import { getLikedEntries } from './likesState'
import { clone } from './config'

/**
 * 관심상품 목록 조회
 * @description 등록된 키에 상품 정보(은행명·상품명·options)를 합쳐 반환한다
 * @returns {Array<Object>} 관심상품 목록 (최근 등록 순)
 */
export const getLikeList = () =>
  getLikedEntries()
    .map((entry, index) => {
      const list = entry.product_type === 'saving' ? mockSavings : mockDeposits
      const product = list.find((item) => item.fin_prdt_cd === entry.fin_prdt_cd)

      if (!product) return null

      return {
        id: index + 1,
        fin_prdt_cd: entry.fin_prdt_cd,
        product_type: entry.product_type,
        created_at: entry.created_at,
        kor_co_nm: product.kor_co_nm,
        fin_prdt_nm: product.fin_prdt_nm,
        // ProductListItem 이 금리·기간을 렌더하려면 options 가 필요하다
        options: clone(product.options),
      }
    })
    .filter(Boolean)
