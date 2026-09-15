/**
 * @파일명 mocks/accounts.js
 * @설명 데모 계정 목업 데이터
 * @기능
 *   - 데모 계정 정보 (DEMO_ACCOUNT)
 *   - 목업 인증 토큰 (MOCK_TOKEN)
 * @비고
 *   백엔드 없이 로그인이 필요한 화면(AI 분석, 마이페이지)을 열람하기 위한 계정.
 *   비밀번호는 검사하지 않으며, 아이디만 일치하면 통과한다.
 */

/** @type {{username: string, nickname: string}} 데모 계정 */
export const DEMO_ACCOUNT = {
  username: 'admin',
  nickname: '데모 사용자',
}

/** @type {string} 목업 인증 토큰. 실제 토큰과 구분되도록 접두사를 붙였다 */
export const MOCK_TOKEN = 'mock-demo-token-fink'
