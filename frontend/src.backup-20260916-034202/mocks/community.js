/**
 * @파일명 mocks/community.js
 * @설명 커뮤니티 게시판 목업 데이터 및 메모리 CRUD
 * @기능
 *   - 게시글 목록/상세/생성/수정/삭제
 *   - 댓글 목록/생성/수정/삭제
 *   - 게시글/댓글 좋아요 토글
 * @API엔드포인트
 *   - GET  /api/v1/articles/ : 목록 (페이지네이션)
 *   - POST /api/v1/articles/ : 생성
 *   - GET  /api/v1/articles/:id/ : 상세
 *   - GET  /api/v1/articles/:id/comments/ : 댓글 목록
 * @비고
 *   목록 응답은 DRF 기본형(count/next/previous)이 아니라
 *   { results, total_pages, current_page, total_count } 형태다.
 *   메모리 상태이므로 새로고침하면 초기 데이터로 되돌아간다.
 */

import { paginate, clone } from './config'
import { DEMO_ACCOUNT } from './accounts'

/** @type {number} 목록 페이지당 게시글 수 (백엔드와 동일) */
const PAGE_SIZE = 10

// ========================================
// 초기 게시글 (11건 → 2페이지)
// ========================================

/** @type {Array<Object>} 게시글 저장소 (최신순) */
let articles = [
  {
    id: 11,
    title: '청년처음적금 우대금리 다 채우신 분 계신가요',
    content:
      '만 34세 이하 조건은 자동으로 충족되는데 급여이체 조건이 애매해서요.\n프리랜서라 매달 들어오는 금액이 일정하지 않은데, 이것도 급여이체로 인정되는지 아시는 분 있을까요?\n지점에 물어보니 담당자마다 답이 달라서 헷갈립니다.',
    views: 142,
    author_nickname: '적금러',
    created_at: '2026-09-14T21:12:00+09:00',
    updated_at: '2026-09-14T21:12:00+09:00',
    likes_count: 8,
    is_liked: false,
  },
  {
    id: 10,
    title: '예금 vs 적금, 목돈 있으면 무조건 예금인가요?',
    content:
      '2년 안에 3천만원 모으는 게 목표입니다. 지금 500만원 정도 있어요.\n예금에 한 번에 넣는 것보다 적금이 금리가 높던데, 그러면 적금이 유리한 거 아닌가 싶다가도\n적금은 원금이 매달 조금씩 쌓이니까 이자가 붙는 기간이 짧아지잖아요.\n\nAI 분석 돌려보니까 병행이 낫다고 나오던데 실제로 해보신 분 의견 궁금합니다.',
    views: 318,
    author_nickname: '목돈모으기',
    created_at: '2026-09-13T18:40:00+09:00',
    updated_at: '2026-09-13T18:40:00+09:00',
    likes_count: 21,
    is_liked: false,
  },
  {
    id: 9,
    title: '인터넷은행 예금 금리가 시중은행보다 높은 이유',
    content:
      '지점 운영비가 없어서 그만큼 금리로 돌려준다는 얘기를 들었는데,\n그러면 왜 모든 은행이 비대면 전용 상품을 안 만드는 걸까요?\n아시는 분 설명 좀 부탁드립니다.',
    views: 256,
    author_nickname: '금융초보',
    created_at: '2026-09-12T11:05:00+09:00',
    updated_at: '2026-09-12T11:05:00+09:00',
    likes_count: 14,
    is_liked: false,
  },
  {
    id: 8,
    title: '26주적금 완주 후기',
    content:
      '작년에 시작해서 지난달 만기 받았습니다.\n매주 금액이 늘어나는 구조라 후반부에 부담이 컸는데,\n오히려 그게 동기부여가 돼서 끝까지 갔네요.\n\n이자 자체는 크지 않지만 습관 만들기엔 좋았습니다.',
    views: 489,
    author_nickname: '완주했다',
    created_at: '2026-09-10T09:28:00+09:00',
    updated_at: '2026-09-10T09:28:00+09:00',
    likes_count: 37,
    is_liked: false,
  },
  {
    id: 7,
    title: '이자소득세 15.4% 계산이 헷갈립니다',
    content:
      '세전 이자가 100만원이면 세후로 84만 6천원 받는 게 맞나요?\n분석 결과 화면에 세전/세후가 같이 나오던데 그 차이가 딱 15.4%더라고요.',
    views: 203,
    author_nickname: '세금어려워',
    created_at: '2026-09-08T14:52:00+09:00',
    updated_at: '2026-09-08T14:52:00+09:00',
    likes_count: 11,
    is_liked: false,
  },
  {
    id: 6,
    title: '금 시세 지금 들어가도 될까요',
    content:
      '현물 메뉴에서 1년치 차트 보니까 계속 우상향이던데,\n지금 고점인 것 같아서 망설여집니다. 다들 어떻게 보시나요?',
    views: 671,
    author_nickname: '금은방',
    created_at: '2026-09-06T20:17:00+09:00',
    updated_at: '2026-09-06T20:17:00+09:00',
    likes_count: 19,
    is_liked: false,
  },
  {
    id: 5,
    title: '자유적립식이랑 정액적립식 차이',
    content:
      '자유적립식은 아무 때나 넣어도 되고, 정액적립식은 매달 같은 금액을 넣어야 하는 걸로 이해했습니다.\n금리는 정액식이 조금 높은 경우가 많던데 맞나요?',
    views: 155,
    author_nickname: '적립식',
    created_at: '2026-09-04T13:03:00+09:00',
    updated_at: '2026-09-04T13:03:00+09:00',
    likes_count: 6,
    is_liked: false,
  },
  {
    id: 4,
    title: '주거래은행 바꾸신 분 있나요',
    content:
      '10년 넘게 한 은행만 쓰다가 우대금리 때문에 옮길까 고민 중입니다.\n자동이체 다 옮기는 게 번거로울 것 같은데 해보신 분 계신가요?',
    views: 284,
    author_nickname: '이사중',
    created_at: '2026-09-02T17:45:00+09:00',
    updated_at: '2026-09-02T17:45:00+09:00',
    likes_count: 9,
    is_liked: false,
  },
  {
    id: 3,
    title: '만기 후 이율이 왜 이렇게 낮은가요',
    content:
      '기본이율의 50%만 적용된다고 하는데, 만기 알림을 놓치면 손해가 크겠네요.\n다들 만기 관리 어떻게 하시나요?',
    views: 197,
    author_nickname: '만기알림',
    created_at: '2026-08-30T10:22:00+09:00',
    updated_at: '2026-08-30T10:22:00+09:00',
    likes_count: 12,
    is_liked: false,
  },
  {
    id: 2,
    title: '월 100만원씩 2년이면 얼마나 모이나요',
    content:
      '단순 계산으로는 2400만원인데 이자까지 하면 얼마나 될지 궁금합니다.\n금리 3.8% 기준으로요.',
    views: 412,
    author_nickname: '계산기',
    created_at: '2026-08-27T22:08:00+09:00',
    updated_at: '2026-08-27T22:08:00+09:00',
    likes_count: 16,
    is_liked: false,
  },
  {
    id: 1,
    title: 'F!NK 커뮤니티 이용 안내',
    content:
      '금융 상품과 투자에 대한 정보를 자유롭게 나누는 공간입니다.\n\n- 특정 상품의 가입을 권유하거나 수익을 보장하는 글은 삼가주세요.\n- 개인정보(계좌번호, 연락처 등)는 올리지 말아주세요.\n- 여기에 올라오는 글은 투자 권유가 아니며, 투자 판단의 책임은 본인에게 있습니다.',
    views: 1024,
    author_nickname: '운영자',
    created_at: '2026-08-25T09:00:00+09:00',
    updated_at: '2026-08-25T09:00:00+09:00',
    likes_count: 42,
    is_liked: false,
  },
]

// ========================================
// 초기 댓글
// ========================================

/** @type {Array<Object>} 댓글 저장소 (article_id 로 묶인다) */
let comments = [
  {
    id: 1,
    article_id: 11,
    content: '저는 프리랜서인데 같은 계좌로 매달 입금되면 인정해주더라고요. 지점마다 다를 수 있으니 콜센터에 문의해보세요.',
    author_nickname: '프리랜서',
    created_at: '2026-09-14T22:30:00+09:00',
    updated_at: '2026-09-14T22:30:00+09:00',
    likes_count: 5,
    is_liked: false,
  },
  {
    id: 2,
    article_id: 11,
    content: '급여이체 인정 기준은 상품설명서에 적혀 있습니다. 보통 월 50만원 이상 + 3개월 연속이 조건이에요.',
    author_nickname: '금융초보',
    created_at: '2026-09-15T08:14:00+09:00',
    updated_at: '2026-09-15T08:14:00+09:00',
    likes_count: 8,
    is_liked: false,
  },
  {
    id: 3,
    article_id: 11,
    content: '저도 같은 고민이었는데 결국 자동이체 조건으로 우대 채웠습니다.',
    author_nickname: '적립식',
    created_at: '2026-09-15T10:02:00+09:00',
    updated_at: '2026-09-15T10:02:00+09:00',
    likes_count: 2,
    is_liked: false,
  },
  {
    id: 4,
    article_id: 11,
    content: '콜센터 답변도 상담원마다 다른 경우가 있어서, 녹취되는 채널로 확인받아두시는 게 안전합니다.',
    author_nickname: '만기알림',
    created_at: '2026-09-15T11:41:00+09:00',
    updated_at: '2026-09-15T11:41:00+09:00',
    likes_count: 3,
    is_liked: false,
  },
  {
    id: 5,
    article_id: 10,
    content:
      '적금은 첫 달 넣은 돈만 24개월치 이자를 받고, 마지막 달 돈은 한 달치만 받습니다. 그래서 표면 금리가 같아도 실수령 이자는 예금이 큽니다.',
    author_nickname: '계산기',
    created_at: '2026-09-13T20:15:00+09:00',
    updated_at: '2026-09-13T20:15:00+09:00',
    likes_count: 24,
    is_liked: false,
  },
  {
    id: 6,
    article_id: 10,
    content: '보유 목돈은 예금, 매달 들어오는 돈은 적금. 이렇게 나누는 게 일반적인 것 같아요.',
    author_nickname: '목돈모으기',
    created_at: '2026-09-13T21:48:00+09:00',
    updated_at: '2026-09-13T21:48:00+09:00',
    likes_count: 11,
    is_liked: false,
  },
  {
    id: 7,
    article_id: 8,
    content: '완주 축하드립니다. 후반부 부담이 크다는 말 공감해요.',
    author_nickname: '적금러',
    created_at: '2026-09-10T12:33:00+09:00',
    updated_at: '2026-09-10T12:33:00+09:00',
    likes_count: 4,
    is_liked: false,
  },
]

// ========================================
// 내부 헬퍼
// ========================================

/** 다음 게시글 id (기존 최댓값 + 1) */
const nextArticleId = () => Math.max(0, ...articles.map((a) => a.id)) + 1

/** 다음 댓글 id */
const nextCommentId = () => Math.max(0, ...comments.map((c) => c.id)) + 1

/** 게시글의 댓글 수 */
const countComments = (articleId) => comments.filter((c) => c.article_id === articleId).length

/** 댓글 객체에서 내부 필드(article_id) 제거 */
const toCommentResponse = ({ article_id, ...rest }) => clone(rest)

// ========================================
// 게시글
// ========================================

/**
 * 게시글 목록 조회
 * @param {number} [page=1] - 페이지 번호
 * @returns {{results: Array, total_pages: number, current_page: number, total_count: number}}
 */
export const getArticles = (page = 1) => {
  const { items, total_pages, current_page, total_count } = paginate(articles, page, PAGE_SIZE)

  return {
    results: items.map((article) => ({
      id: article.id,
      title: article.title,
      author_nickname: article.author_nickname,
      views: article.views,
      created_at: article.created_at,
      comments_count: countComments(article.id),
    })),
    total_pages,
    current_page,
    total_count,
  }
}

/**
 * 게시글 상세 조회
 * @description 조회수를 1 증가시킨다
 * @param {number|string} id - 게시글 ID
 * @returns {Object|null} 게시글 상세. 없으면 null
 */
export const getArticleDetail = (id) => {
  const target = articles.find((article) => article.id === Number(id))
  if (!target) return null

  target.views += 1

  return {
    ...clone(target),
    comment_set: comments
      .filter((comment) => comment.article_id === target.id)
      .map(toCommentResponse),
    comments_count: countComments(target.id),
  }
}

/**
 * 게시글 생성
 * @param {{title: string, content: string}} payload - 게시글 데이터
 * @returns {Object} 생성된 게시글
 */
export const createArticle = (payload) => {
  const created = {
    id: nextArticleId(),
    title: payload.title,
    content: payload.content,
    views: 0,
    author_nickname: DEMO_ACCOUNT.nickname,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    likes_count: 0,
    is_liked: false,
  }

  articles = [created, ...articles]

  return clone(created)
}

/**
 * 게시글 수정
 * @param {number|string} id - 게시글 ID
 * @param {Object} payload - 수정할 필드
 * @returns {Object|null} 수정된 게시글
 */
export const updateArticle = (id, payload) => {
  const target = articles.find((article) => article.id === Number(id))
  if (!target) return null

  Object.assign(target, payload, { updated_at: new Date().toISOString() })

  return {
    ...clone(target),
    comment_set: comments
      .filter((comment) => comment.article_id === target.id)
      .map(toCommentResponse),
    comments_count: countComments(target.id),
  }
}

/**
 * 게시글 삭제
 * @param {number|string} id - 게시글 ID
 */
export const deleteArticle = (id) => {
  articles = articles.filter((article) => article.id !== Number(id))
  comments = comments.filter((comment) => comment.article_id !== Number(id))
}

/**
 * 게시글 좋아요 토글
 * @param {number|string} id - 게시글 ID
 * @returns {{liked: boolean, likes_count: number}} 토글 결과
 */
export const toggleArticleLike = (id) => {
  const target = articles.find((article) => article.id === Number(id))
  if (!target) return { liked: false, likes_count: 0 }

  target.is_liked = !target.is_liked
  target.likes_count += target.is_liked ? 1 : -1

  return { liked: target.is_liked, likes_count: target.likes_count }
}

// ========================================
// 댓글
// ========================================

/**
 * 댓글 목록 조회
 * @param {number|string} articleId - 게시글 ID
 * @returns {Array<Object>} 댓글 목록 (등록 순)
 */
export const getComments = (articleId) =>
  comments.filter((comment) => comment.article_id === Number(articleId)).map(toCommentResponse)

/**
 * 댓글 생성
 * @param {number|string} articleId - 게시글 ID
 * @param {string} content - 댓글 내용
 * @returns {Object} 생성된 댓글
 */
export const createComment = (articleId, content) => {
  const created = {
    id: nextCommentId(),
    article_id: Number(articleId),
    content,
    author_nickname: DEMO_ACCOUNT.nickname,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    likes_count: 0,
    is_liked: false,
  }

  comments = [...comments, created]

  return toCommentResponse(created)
}

/**
 * 댓글 수정
 * @param {number|string} commentId - 댓글 ID
 * @param {string} content - 수정할 내용
 * @returns {Object|null} 수정된 댓글
 */
export const updateComment = (commentId, content) => {
  const target = comments.find((comment) => comment.id === Number(commentId))
  if (!target) return null

  target.content = content
  target.updated_at = new Date().toISOString()

  return toCommentResponse(target)
}

/**
 * 댓글 삭제
 * @param {number|string} commentId - 댓글 ID
 */
export const deleteComment = (commentId) => {
  comments = comments.filter((comment) => comment.id !== Number(commentId))
}

/**
 * 댓글 좋아요 토글
 * @param {number|string} commentId - 댓글 ID
 * @returns {{liked: boolean, likes_count: number}} 토글 결과
 */
export const toggleCommentLike = (commentId) => {
  const target = comments.find((comment) => comment.id === Number(commentId))
  if (!target) return { liked: false, likes_count: 0 }

  target.is_liked = !target.is_liked
  target.likes_count += target.is_liked ? 1 : -1

  return { liked: target.is_liked, likes_count: target.likes_count }
}
