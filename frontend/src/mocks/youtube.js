/**
 * @파일명 mocks/youtube.js
 * @설명 유튜브 목업 데이터
 * @기능
 *   - 영상 목록 상수 (MOCK_VIDEOS) — 분석·챗봇 목업이 함께 쓰는 단일 소스
 *   - 영상 검색 (searchVideos)
 *   - 영상 상세 조회 (fetchVideoDetail)
 * @API엔드포인트
 *   - GET https://www.googleapis.com/youtube/v3/search
 *   - GET https://www.googleapis.com/youtube/v3/videos
 * @비고
 *   YouTube Data API 응답 형태를 그대로 흉내 낸다.
 *   검색 결과 목록의 :key 가 etag 이므로 etag 는 반드시 있어야 한다.
 *   videoId 는 여기서만 정의하고 다른 목업이 import 한다 — 값이 어긋나면 상세 조회가 실패한다.
 *   썸네일은 외부 CDN 대신 SVG data URI 로 직접 만든다.
 *   (실제 유튜브 CDN 은 존재하지 않는 ID 에 회색 플레이스홀더를 주기 때문)
 */

// ========================================
// 썸네일 생성
// ========================================

/** @type {Array<string>} 썸네일 배경색. 무채색 계열에서 명도만 달리한다 */
const THUMB_TONES = ['#3f3f46', '#52525b', '#44403c', '#57534e', '#4b5563', '#374151']

/**
 * SVG data URI 썸네일 생성
 * @description 외부 요청 없이 화면에 바로 뜨는 정적 이미지를 만든다
 * @param {string} label - 썸네일에 넣을 짧은 문구
 * @param {number} index - 배경색 선택용 인덱스
 * @param {number} [width=320] - 이미지 너비
 * @returns {string} data URI
 */
const buildThumbnail = (label, index, width = 320) => {
  const height = Math.round((width * 9) / 16)
  const tone = THUMB_TONES[index % THUMB_TONES.length]
  const fontSize = Math.round(width / 13)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 320 180">
  <rect width="320" height="180" fill="${tone}"/>
  <rect x="0" y="152" width="320" height="28" fill="rgba(0,0,0,0.25)"/>
  <circle cx="160" cy="80" r="26" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="2"/>
  <path d="M153 68 L175 80 L153 92 Z" fill="rgba(255,255,255,0.75)"/>
  <text x="160" y="170" fill="rgba(255,255,255,0.8)" font-size="14" font-family="sans-serif" text-anchor="middle">${label}</text>
</svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

// ========================================
// 영상 목록 (8건)
// ========================================

/**
 * 영상 기본 정보
 * @description 썸네일은 videoId 로 자동 생성되며, 분석·챗봇 목업도 이 배열을 참조한다
 * @type {Array<{videoId: string, title: string, channelTitle: string, channelId: string, description: string, publishedAt: string}>}
 */
export const MOCK_VIDEOS = [
  {
    videoId: 'fink-demo-001',
    title: '예금과 적금, 뭐가 다른가요? 5분 정리',
    channelTitle: 'F!NK 금융상식',
    channelId: 'UC-fink-basic',
    description:
      '예금은 목돈을 한 번에 맡기고, 적금은 매달 조금씩 넣는 상품입니다. 같은 금리라도 실제로 받는 이자가 왜 다른지 계산 과정을 짚어봅니다.',
    publishedAt: '2026-09-10T09:00:00Z',
  },
  {
    videoId: 'fink-demo-002',
    title: '적금 이자 계산법 완전정복 (단리 공식)',
    channelTitle: 'F!NK 금융상식',
    channelId: 'UC-fink-basic',
    description:
      '적금 이자가 생각보다 적게 나오는 이유를 공식으로 설명합니다. 월 납입액 × (금리/12) × n(n+1)/2 가 어디서 나온 식인지 알아봅니다.',
    publishedAt: '2026-09-07T09:00:00Z',
  },
  {
    videoId: 'fink-demo-003',
    title: '우대금리 조건 다 채우는 현실적인 방법',
    channelTitle: 'F!NK 실전편',
    channelId: 'UC-fink-practice',
    description:
      '급여이체, 카드실적, 자동이체. 우대조건을 실제로 어떻게 맞추는지, 어떤 조건은 포기해도 되는지 정리했습니다.',
    publishedAt: '2026-09-04T09:00:00Z',
  },
  {
    videoId: 'fink-demo-004',
    title: '이자소득세 15.4%, 세후 수익률 계산하기',
    channelTitle: 'F!NK 금융상식',
    channelId: 'UC-fink-basic',
    description:
      '표면 금리만 보면 안 되는 이유. 세전과 세후가 얼마나 차이나는지, 상품 비교할 때 어떤 기준으로 봐야 하는지 알려드립니다.',
    publishedAt: '2026-09-01T09:00:00Z',
  },
  {
    videoId: 'fink-demo-005',
    title: '목돈 모으기, 예금 적금 어떻게 나눌까',
    channelTitle: 'F!NK 실전편',
    channelId: 'UC-fink-practice',
    description:
      '보유한 목돈과 매달 들어오는 돈을 어떤 비율로 나눌지, 실제 숫자를 넣어 비교해봅니다.',
    publishedAt: '2026-08-28T09:00:00Z',
  },
  {
    videoId: 'fink-demo-006',
    title: '인터넷은행 vs 시중은행, 어디가 유리할까',
    channelTitle: 'F!NK 실전편',
    channelId: 'UC-fink-practice',
    description:
      '금리 차이가 나는 구조적인 이유와, 금리 말고도 따져봐야 할 것들을 짚어봅니다.',
    publishedAt: '2026-08-24T09:00:00Z',
  },
  {
    videoId: 'fink-demo-007',
    title: '주식 초보가 가장 많이 하는 실수 5가지',
    channelTitle: 'F!NK 투자노트',
    channelId: 'UC-fink-invest',
    description:
      '처음 주식을 시작할 때 흔히 저지르는 실수와, 그것을 피하는 방법을 정리했습니다.',
    publishedAt: '2026-08-20T09:00:00Z',
  },
  {
    videoId: 'fink-demo-008',
    title: '금 투자, 지금 들어가도 될까?',
    channelTitle: 'F!NK 투자노트',
    channelId: 'UC-fink-invest',
    description:
      '금값이 오를 때 사야 할지 내릴 때 사야 할지. 현물 투자의 기본 개념부터 살펴봅니다.',
    publishedAt: '2026-08-16T09:00:00Z',
  },
].map((video, index) => ({
  ...video,
  thumbnail: buildThumbnail(video.channelTitle, index, 320),
  thumbnailSmall: buildThumbnail(video.channelTitle, index, 120),
  thumbnailLarge: buildThumbnail(video.channelTitle, index, 480),
}))

// ========================================
// 응답 변환
// ========================================

/**
 * 검색 결과 항목(YouTube API search 응답) 형태로 변환
 * @param {Object} video - MOCK_VIDEOS 의 항목
 * @returns {Object} search API 응답 형태의 항목
 */
const toSearchItem = (video) => ({
  kind: 'youtube#searchResult',
  // 목록의 :key 로 쓰이므로 반드시 있어야 한다
  etag: `etag-${video.videoId}`,
  id: {
    kind: 'youtube#video',
    videoId: video.videoId,
  },
  snippet: {
    publishedAt: video.publishedAt,
    channelId: video.channelId,
    title: video.title,
    description: video.description,
    channelTitle: video.channelTitle,
    thumbnails: {
      default: { url: video.thumbnailSmall, width: 120, height: 68 },
      medium: { url: video.thumbnail, width: 320, height: 180 },
      high: { url: video.thumbnailLarge, width: 480, height: 270 },
    },
  },
})

// ========================================
// 조회
// ========================================

/**
 * 영상 검색
 * @description 검색어가 제목·설명에 걸리면 해당 영상만, 걸리는 게 없으면 전체를 돌려준다
 * @param {string} query - 검색 키워드
 * @returns {Array<Object>} search API 응답 형태의 항목 배열 (최대 12건)
 */
export const searchVideos = (query) => {
  const keyword = (query || '').trim().toLowerCase()

  const matched = keyword
    ? MOCK_VIDEOS.filter(
        (video) =>
          video.title.toLowerCase().includes(keyword) ||
          video.description.toLowerCase().includes(keyword) ||
          video.channelTitle.toLowerCase().includes(keyword)
      )
    : MOCK_VIDEOS

  // 검색 결과가 없으면 빈 화면 대신 전체 목록을 보여준다
  const source = matched.length > 0 ? matched : MOCK_VIDEOS

  return source.slice(0, 12).map(toSearchItem)
}

/**
 * 영상 상세 조회
 * @param {string} videoId - 영상 ID
 * @returns {Object|null} videos API 응답 형태의 항목. 없으면 목록의 첫 영상
 */
export const fetchVideoDetail = (videoId) => {
  const video =
    MOCK_VIDEOS.find((item) => item.videoId === videoId) || MOCK_VIDEOS[0] || null

  if (!video) return null

  return {
    kind: 'youtube#video',
    etag: `etag-detail-${video.videoId}`,
    id: video.videoId,
    snippet: {
      publishedAt: video.publishedAt,
      channelId: video.channelId,
      title: video.title,
      description: video.description,
      channelTitle: video.channelTitle,
      thumbnails: {
        default: { url: video.thumbnailSmall, width: 120, height: 68 },
        medium: { url: video.thumbnail, width: 320, height: 180 },
        high: { url: video.thumbnailLarge, width: 480, height: 270 },
      },
    },
    contentDetails: { duration: 'PT8M42S', definition: 'hd' },
    statistics: { viewCount: '48213', likeCount: '1204', commentCount: '86' },
  }
}
