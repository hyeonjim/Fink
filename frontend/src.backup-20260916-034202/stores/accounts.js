/**
 * @파일명 accounts.js
 * @설명 사용자 인증 및 계정 관리 스토어
 * @기능
 *   - 회원가입 (signUp)
 *   - 로그인/로그아웃 (logIn, logOut)
 *   - 회원탈퇴 (deleteUser)
 *   - 닉네임 변경 (updateNickname)
 *   - 비밀번호 변경 (changePassword)
 * @API엔드포인트
 *   - POST /accounts/signup/ : 회원가입
 *   - POST /accounts/login/ : 로그인
 *   - POST /accounts/logout/ : 로그아웃
 *   - DELETE /accounts/delete/ : 회원탈퇴
 *   - PATCH /accounts/update/ : 닉네임 수정
 *   - POST /accounts/password/change/ : 비밀번호 변경
 */

import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
import { useNewsStore } from "@/stores/news"
import { USE_MOCK, delay } from "@/mocks/config"
import { DEMO_ACCOUNT, MOCK_TOKEN } from "@/mocks/accounts"


export const useAccountStore = defineStore('account', () => {
  // ========================================
  // 상태 (State)
  // ========================================
  
  /** @type {string} 백엔드 API 기본 URL */
  const API_URL = 'http://127.0.0.1:8000'
  
  /** @type {Ref<string|null>} 인증 토큰 (로그인 시 발급) */
  const token = ref(null)
  
  /** @type {Ref<string|null>} 사용자 닉네임 */
  const nickname = ref(null)
  
  /** @type {Router} Vue Router 인스턴스 */
  const router = useRouter()

  // ========================================
  // 계산된 속성 (Getters)
  // ========================================
  
  /**
   * 로그인 여부 확인
   * @returns {boolean} 로그인 상태
   */
  const isLogin = computed(() => {
    return token.value ? true : false
  })

  // ========================================
  // 액션 (Actions)
  // ========================================

  /**
   * 사용자 정보 조회
   * @description 로그인된 사용자의 닉네임 정보를 가져옵니다
   * @returns {Promise} API 응답 Promise
   */
  const getUserInfo = function () {
    // === 목업 모드 분기 ===
    if (USE_MOCK) {
      return delay(null).then(() => {
        // 데모에서 변경한 닉네임이 있으면 그대로 둔다
        nickname.value = nickname.value || DEMO_ACCOUNT.nickname
      })
    }

    // === 실제 API 호출 (백엔드 연결 시) ===
    return axios({
      method: 'get',
      url: `${API_URL}/accounts/user/`,
      headers: {
        Authorization: `Token ${token.value}`
      }
    })
    .then(res => {
      nickname.value = res.data.nickname
    })
  }

  /**
   * 회원가입
   * @description 새 사용자를 등록하고 자동으로 로그인 처리합니다
   * @param {Object} payload - 회원가입 정보
   * @param {string} payload.username - 아이디
   * @param {string} payload.nickname - 닉네임
   * @param {string} payload.password1 - 비밀번호
   * @param {string} payload.password2 - 비밀번호 확인
   */
  const signUp = function (payload) {
    const username = payload.username
    const nickname = payload.nickname
    const password1 = payload.password1
    const password2 = payload.password2

    // === 목업 모드 분기 ===
    if (USE_MOCK) {
      alert(
        `데모 모드에서는 회원가입을 사용할 수 없습니다.\n아이디 "${DEMO_ACCOUNT.username}" 으로 로그인해주세요. (비밀번호는 아무 값이나 입력)`
      )
      router.push({ name: 'LogInView' })
      return
    }

    // === 실제 API 호출 (백엔드 연결 시) ===
    axios({
      method: 'post',
      url: `${API_URL}/accounts/signup/`,
      data: {
        username,
        nickname,
        password1,
        password2,
      }
    })
    .then(res => {
      // 회원가입 성공 시 자동 로그인
      const password = password1
      logIn({ username, password })
    })
    .catch(err => {
      console.error('회원가입 실패:', err)
    })
  }

  /**
   * 로그인
   * @description 사용자 인증 후 토큰을 저장하고 환율 정보를 불러옵니다
   * @param {Object} payload - 로그인 정보
   * @param {string} payload.username - 아이디
   * @param {string} payload.password - 비밀번호
   */
  const logIn = function (payload) {
    const username = payload.username
    const password = payload.password

    // === 목업 모드 분기 ===
    if (USE_MOCK) {
      // 비밀번호는 검사하지 않는다. 아이디만 데모 계정과 일치하면 통과
      if (username !== DEMO_ACCOUNT.username) {
        alert(
          `데모 모드입니다.\n아이디 "${DEMO_ACCOUNT.username}" 으로 로그인해주세요. (비밀번호는 아무 값이나 입력)`
        )
        return
      }

      return delay(null).then(() => {
        token.value = MOCK_TOKEN
        nickname.value = DEMO_ACCOUNT.nickname

        router.push({ name: 'home' })
      })
    }

    // === 실제 API 호출 (백엔드 연결 시) ===
    axios({
      method: 'post',
      url: `${API_URL}/accounts/login/`,
      data: {
        username,
        password,
      }
    })
    .then(async (res) => { 
      // 토큰 저장 및 사용자 정보 조회
      token.value = res.data.key
      await getUserInfo()

      router.push({ name: 'home' })
    })
    .catch(err => {
      console.error('로그인 실패:', err)
    })
  }

  /**
   * 로그아웃
   * @description 서버에 로그아웃 요청 후 로컬 상태를 초기화합니다
   */
  const logOut = function () {
    /** 로그아웃 후 프론트 상태 정리 (목업/실제 공통) */
    const clearSession = () => {
      // 상태 초기화
      token.value = null
      nickname.value = null

      // 다른 store들 초기화 (뉴스 store 초기화)
      const newsStore = useNewsStore()
      newsStore.clearAllData()

      // 로컬 스토리지에서 news store 데이터 제거
      localStorage.removeItem('news')

      router.push({ name: 'home' })
    }

    // === 목업 모드 분기 ===
    if (USE_MOCK) {
      return delay(null).then(clearSession)
    }

    // === 실제 API 호출 (백엔드 연결 시) ===
    axios({
      method: 'post',
      url: `${API_URL}/accounts/logout/`
    })
    .then((res) => {
      clearSession()
    })
    .catch((err) => {
      console.error('로그아웃 실패:', err)
    })
  }

  /**
   * 회원탈퇴
   * @description 확인 후 계정을 영구 삭제합니다
   */
  const deleteUser = function () {
    // === 목업 모드 분기 ===
    if (USE_MOCK) {
      alert('데모 모드에서는 회원탈퇴를 사용할 수 없습니다.')
      return
    }

    // 사용자 실수 방지용 확인창
    const ok = window.confirm('정말 회원탈퇴 하시겠습니까?\n삭제 후 복구할 수 없습니다.')

    // 취소 시 아무 것도 안 함
    if (!ok) return

    // === 실제 API 호출 (백엔드 연결 시) ===
    axios({
      method: 'delete',
      url: `${API_URL}/accounts/delete/`,
      headers: {
        Authorization: `Token ${token.value}`,
      }
    })
    .then(() => {
      // 탈퇴 성공 시 프론트 상태 정리
      token.value = null
      nickname.value = null

      alert('계정이 삭제되었습니다.')
      router.push({ name: 'home' })
    })
    .catch(err => {
      console.error('회원탈퇴 실패:', err)
      alert('회원탈퇴에 실패했습니다.')
    })
  }

  /**
   * 닉네임 변경
   * @description 사용자의 닉네임을 수정합니다
   * @param {string} newNickname - 새 닉네임
   */
  const updateNickname = async function (newNickname) {
    if (!token.value) {
      alert('로그인이 필요합니다.')
      router.push({ name: 'LogInView' })
      return
    }

    // === 목업 모드 분기 ===
    // 데모에서도 닉네임 변경은 즉시 반영해 준다 (persist 되어 새로고침 후에도 유지)
    if (USE_MOCK) {
      await delay(null)
      nickname.value = newNickname
      alert('닉네임이 수정되었습니다.')
      return
    }

    // === 실제 API 호출 (백엔드 연결 시) ===
    try {
      await axios({
        method: 'patch',
        url: `${API_URL}/accounts/update/`,
        data: { nickname: newNickname },
        headers: { Authorization: `Token ${token.value}` },
      })

      // 수정 후 내 정보 갱신
      await getUserInfo()
      alert('닉네임이 수정되었습니다.')
    } catch (err) {
      console.error('닉네임 수정 실패:', err)
      alert('닉네임 수정에 실패했습니다.')
    }
  }

  /**
   * 비밀번호 변경
   * @description 비밀번호 변경 후 재로그인을 요구합니다
   * @param {Object} payload - 비밀번호 변경 정보
   * @param {string} payload.old_password - 현재 비밀번호
   * @param {string} payload.new_password1 - 새 비밀번호
   * @param {string} payload.new_password2 - 새 비밀번호 확인
   */
  const changePassword = async function (payload) {
    if (!token.value) {
      alert('로그인이 필요합니다.')
      router.push({ name: 'LogInView' })
      return
    }

    const { old_password, new_password1, new_password2 } = payload

    // === 목업 모드 분기 ===
    if (USE_MOCK) {
      alert('데모 모드에서는 비밀번호를 변경할 수 없습니다.')
      return
    }

    // === 실제 API 호출 (백엔드 연결 시) ===
    try {
      await axios({
        method: 'post',
        url: `${API_URL}/accounts/password/change/`,
        data: { old_password, new_password1, new_password2 },
        headers: { Authorization: `Token ${token.value}` },
      })

      alert('비밀번호가 변경되었습니다. 다시 로그인해주세요.')

      // 보안상 토큰/닉네임 제거 후 로그인 화면으로
      token.value = null
      nickname.value = null
      router.push({ name: 'LogInView' })
    } catch (err) {
      console.error('비밀번호 변경 실패:', err)
      const msg = err?.response?.data
      if (msg) alert(`비밀번호 변경 실패: ${JSON.stringify(msg)}`)
      else alert('비밀번호 변경에 실패했습니다.')
    }
  }

  // ========================================
  // 반환 (Export)
  // ========================================
  return { 
    // 상태
    API_URL, 
    token, 
    nickname,
    // 계산된 속성
    isLogin, 
    // 액션
    signUp, 
    logIn, 
    logOut, 
    getUserInfo,
    updateNickname, 
    changePassword, 
    deleteUser,
  }

}, { persist: true })  // Pinia persist 플러그인: 새로고침 시에도 로그인 상태 유지