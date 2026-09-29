<template>
  <div class="home">
    <!-- ══════════════════════════════════════════════════════════════
         Hero — 은은한 라벤더 그라데이션 + 추천 결과 카드 + 빠른 추천 바
         ══════════════════════════════════════════════════════════════ -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-copy">
          <h1 class="hero-title" v-reveal="1">
            <span class="kw" aria-label="주택 마련, 목돈 마련, 여행 준비">
              <span class="kw-track" aria-hidden="true">
                <span v-for="(kw, i) in keywords" :key="i">{{ kw }}</span>
              </span>
            </span>
            목표에<br />
            최적의 예금·적금을<br />
            찾아 드려요
          </h1>

          <div class="hero-actions" v-reveal="3">
            <RouterLink :to="{ name: 'AnalysisView' }" class="h-btn h-btn--soft">
              추천 받기
              <svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </RouterLink>
            <RouterLink :to="{ name: 'ProductView' }" class="h-btn h-btn--white">
              상품 비교하기
            </RouterLink>
          </div>
        </div>

        <!-- 추천 결과 카드 — 실제 추천 화면을 축약해 보여준다 -->
        <div class="rec-card" v-reveal="2">
          <div class="rec-head">
            <span class="rec-title">추천 결과</span>
            <span class="rec-chip">목돈 마련 · 12개월</span>
          </div>
          <ul class="rec-list">
            <li
              v-for="(item, i) in mockProducts"
              :key="item.name"
              class="rec-row"
              :class="{ 'is-selected': i === 0 }"
            >
              <span class="rec-logo">
                <img :src="getBankLogo(item.bank)" :alt="item.bank" />
              </span>
              <span class="rec-names">
                <span class="rec-name">{{ item.name }}</span>
                <span class="rec-bank">{{ item.bank }}</span>
              </span>
              <span class="rec-rates">
                <span class="rec-rate" :class="{ 'is-top': i === 0 }">{{ item.topRate }}%</span>
                <span class="rec-base">기본 {{ item.baseRate }}%</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 빠른 추천 바 — 히어로 아래에 겹쳐 뜬다 -->
      <div class="quick" v-reveal="4">
        <RouterLink
          v-for="q in quickFields"
          :key="q.label"
          :to="{ name: 'AnalysisView' }"
          class="qs"
        >
          <span class="qs-label">{{ q.label }}</span>
          <span class="qs-value">
            {{ q.value }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </RouterLink>
        <RouterLink :to="{ name: 'AnalysisView' }" class="h-btn h-btn--soft quick-go">
          추천 받기
          <svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </RouterLink>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════
         AI 맞춤형 예적금 추천 — 01 → 02 → 03 순서로 등장
         ══════════════════════════════════════════════════════════════ -->
    <section class="steps">
      <div class="h-shell">
        <h2 class="h-title" v-reveal><span class="accent">AI</span> 맞춤형 예적금 추천</h2>
        <ol class="step-grid">
          <li v-for="(step, i) in steps" :key="step.title" class="step-card" v-reveal="i * 5 + 1">
            <span class="step-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.desc }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════
         Services — 메뉴 8개 바로가기
         ══════════════════════════════════════════════════════════════ -->
    <section class="services">
      <div class="h-shell">
        <header class="services-head" v-reveal>
          <h2 class="h-title">금융 정보를 한눈에</h2>
          <p class="services-lead">예·적금부터 주식, 뉴스, 금·은 시세까지 한곳에서 확인하세요.</p>
        </header>

        <div class="service-grid">
          <RouterLink
            v-for="(svc, i) in services"
            :key="svc.title"
            :to="{ name: svc.route }"
            class="service"
            :class="{ 'service--featured': svc.tag }"
            v-reveal="i % 4"
          >
            <h3 class="service-title">
              {{ svc.title }}
              <span v-if="svc.tag" class="service-tag">{{ svc.tag }}</span>
            </h3>
            <p class="service-desc">{{ svc.desc }}</p>
            <span class="service-foot">
              <span class="service-go" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
              <span class="service-icon" aria-hidden="true" v-html="svc.icon"></span>
            </span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════
         Partner banks — 두 줄이 반대 방향으로 흐른다
         ══════════════════════════════════════════════════════════════ -->
    <section class="partners">
      <h2 class="partners-title" v-reveal>
        여러 금융기관의 상품을<br />
        <span>한 번에 비교하세요</span>
      </h2>

      <div class="marquee" v-reveal="3">
        <div class="marquee-track">
          <div v-for="(bank, i) in [...banks, ...banks]" :key="'a-' + i" class="partner">
            <img :src="getBankLogo(bank)" :alt="bank" />
          </div>
        </div>
        <div class="marquee-track marquee-track--rev" aria-hidden="true">
          <div v-for="(bank, i) in [...banksRev, ...banksRev]" :key="'b-' + i" class="partner">
            <img :src="getBankLogo(bank)" alt="" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { vReveal } from '@/composables/useScrollReveal'

/* 히어로 제목에서 돌아가는 목적 키워드 (마지막은 첫 항목 반복 — 끊김 없이 순환) */
const keywords = ['주택 마련', '목돈 마련', '여행 준비', '주택 마련']

/* 히어로 추천 카드 예시 데이터.
   실제 추천 화면(components/analysis/ProductCard.vue)의 구조를 따른다. */
const mockProducts = [
  { bank: '카카오뱅크', name: '자유적금', topRate: '3.80', baseRate: '3.30' },
  { bank: '신한은행', name: '쏠편한 정기예금', topRate: '3.45', baseRate: '3.10' },
  { bank: '국민은행', name: 'KB국민첫재테크적금', topRate: '3.25', baseRate: '2.80' },
]

/* 빠른 추천 바 — 누르면 AI 분석 화면으로 이동 */
const quickFields = [
  { label: '목적', value: '목돈 마련' },
  { label: '월 납입액', value: '300,000원' },
  { label: '기간', value: '12개월' },
]

const steps = [
  { title: '목적 선택', desc: '주택 마련, 목돈 마련, 여행 준비 중 하나를 골라요.' },
  { title: '금액 입력', desc: '보유 금액, 목표 금액, 월 납입액, 기간을 적어요.' },
  { title: '결과 확인', desc: '목표 달성 여부와 예금·적금 조합, 추천 상품을 확인해요.' },
]

/* 상단 메뉴와 같은 순서. 아이콘은 브랜드 투톤 일러스트(64×64). */
const services = [
  {
    route: 'ProductView',
    title: '금융상품',
    desc: '은행별·기간별 예금·적금 금리를 비교해요.',
    icon: '<svg viewBox="0 0 64 64"><rect x="6" y="40" width="34" height="11" rx="5.5" fill="#9588df"/><rect x="6" y="27" width="34" height="11" rx="5.5" fill="#bb8ec7"/><rect x="6" y="14" width="34" height="11" rx="5.5" fill="#9588df"/><circle cx="45" cy="42" r="14" fill="#1d1a2b"/><circle cx="40.5" cy="37.5" r="2.4" fill="#fff"/><circle cx="49.5" cy="46.5" r="2.4" fill="#fff"/><path d="M49.5 36.5 40.5 47.5" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>',
  },
  {
    route: 'AnalysisView',
    title: 'AI 분석',
    tag: '추천',
    desc: '목표에 딱 맞는 예금·적금 조합을 추천해 드려요.',
    icon: '<svg viewBox="0 0 64 64"><rect x="4" y="10" width="40" height="42" rx="9" fill="#bb8ec7"/><rect x="4" y="20" width="40" height="32" rx="9" fill="#9588df"/><rect x="4" y="20" width="40" height="10" fill="#9588df"/><rect x="10" y="14" width="10" height="3" rx="1.5" fill="#fff"/><rect x="10" y="27" width="22" height="3.5" rx="1.75" fill="#fff"/><rect x="10" y="34" width="16" height="3.5" rx="1.75" fill="#fff"/><rect x="10" y="41" width="12" height="3.5" rx="1.75" fill="#fff"/><circle cx="42" cy="40" r="13" fill="#1d1a2b"/><circle cx="42" cy="40" r="8.5" fill="#bb8ec7"/><path d="M51.5 49.5 58 56" stroke="#1d1a2b" stroke-width="5" stroke-linecap="round"/><path d="M53 4l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#5140b5"/></svg>',
  },
  {
    route: 'StockView',
    title: '주식',
    desc: '관심 종목의 시세와 차트를 확인해요.',
    icon: '<svg viewBox="0 0 64 64"><rect x="8" y="38" width="11" height="18" rx="3.5" fill="#bb8ec7"/><rect x="26.5" y="28" width="11" height="28" rx="3.5" fill="#9588df"/><rect x="45" y="20" width="11" height="36" rx="3.5" fill="#bb8ec7"/><path d="M8 30 22 19l10 7L52 8" stroke="#1d1a2b" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M43 8h9v9" stroke="#1d1a2b" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  {
    route: 'NewsView',
    title: '금융뉴스',
    desc: '최신 금융 뉴스를 읽고 저장해요.',
    icon: '<svg viewBox="0 0 64 64"><rect x="36" y="16" width="22" height="40" rx="8" fill="#bb8ec7"/><rect x="6" y="8" width="42" height="48" rx="10" fill="#9588df"/><rect x="14" y="16" width="16" height="13" rx="3.5" fill="#fff"/><rect x="34" y="17" width="7" height="4" rx="2" fill="#fff"/><rect x="34" y="25" width="7" height="4" rx="2" fill="#fff"/><rect x="14" y="35" width="27" height="4" rx="2" fill="#fff"/><rect x="14" y="43" width="18" height="4" rx="2" fill="#1d1a2b"/></svg>',
  },
  {
    route: 'YoutubeSearchView',
    title: '유튜브',
    desc: '금융 영상을 검색하고 저장해요.',
    icon: '<svg viewBox="0 0 64 64"><rect x="6" y="8" width="52" height="38" rx="12" fill="#bb8ec7"/><path d="M27 20.5v14a1.6 1.6 0 0 0 2.4 1.4l11.2-7a1.6 1.6 0 0 0 0-2.8l-11.2-7A1.6 1.6 0 0 0 27 20.5z" fill="#fff"/><rect x="8" y="52" width="48" height="5" rx="2.5" fill="#9588df"/><rect x="8" y="52" width="22" height="5" rx="2.5" fill="#1d1a2b"/><circle cx="30" cy="54.5" r="4.5" fill="#1d1a2b"/></svg>',
  },
  {
    route: 'MetalView',
    title: '현물',
    desc: '금·은 가격 추이를 차트로 봐요.',
    icon: '<svg viewBox="0 0 64 64"><path d="M4 56 9.5 42h17L32 56z" fill="#9588df"/><path d="M33 56 38.5 42h17L61 56z" fill="#bb8ec7"/><path d="M18 39 23.5 25h17L46 39z" fill="#9588df"/><path d="M27 30.5h7" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M13 47.5h6M42 47.5h6" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M51 6l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#1d1a2b"/></svg>',
  },
  {
    route: 'KakaoMapView',
    title: '은행찾기',
    desc: '가까운 은행 지점을 지도에서 찾아요.',
    icon: '<svg viewBox="0 0 64 64"><path d="M4 32 21 26l22 6 17-6v28l-17 6-22-6-17 6z" fill="#bb8ec7"/><path d="M21 26v28M43 32v28" stroke="#fff" stroke-width="2" stroke-opacity="0.7"/><path d="M32 4c-8.3 0-15 6.5-15 14.6C17 29 32 42 32 42s15-13 15-23.4C47 10.5 40.3 4 32 4z" fill="#1d1a2b"/><circle cx="32" cy="18.5" r="5.5" fill="#9588df"/></svg>',
  },
  {
    route: 'CommunityView',
    title: '커뮤니티',
    desc: '다른 사용자와 금융 이야기를 나눠요.',
    icon: '<svg viewBox="0 0 64 64"><rect x="4" y="8" width="38" height="28" rx="11" fill="#9588df"/><path d="M12 32 10 44l12-9z" fill="#9588df"/><rect x="22" y="24" width="38" height="26" rx="11" fill="#bb8ec7"/><path d="M50 46l3 12-12-9z" fill="#bb8ec7"/><circle cx="33" cy="37" r="2.8" fill="#fff"/><circle cx="41" cy="37" r="2.8" fill="#fff"/><circle cx="49" cy="37" r="2.8" fill="#1d1a2b"/></svg>',
  },
]

/* 제휴 금융기관.
   src/assets/banks 의 실제 파일과 1:1로 맞춘 목록.
   (제일은행.png 은 sc제일은행.png 과 동일 은행의 구버전 로고라 제외) */
const banks = [
  '국민은행', '신한은행', '하나은행', '우리은행', '농협은행',
  '기업은행', '카카오뱅크', '토스뱅크', '케이뱅크', '부산은행',
  '경남은행', '광주은행', '전북은행', '제주은행', '아이엠뱅크',
  'sc제일은행', '산업은행', '새마을금고', '수협은행', '신협은행',
  '씨티뱅크',
]
const banksRev = [...banks].reverse()

const getBankLogo = (bankName) =>
  new URL(`../assets/banks/${bankName}.png`, import.meta.url).href
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════
   홈 — 메인 리디자인
   제목 #232327 · 보조 #5e5a70 · 바이올렛 #5140b5 · 오키드/페리윙클 장식
   보더 없이 면과 그림자로 구분하고, 그라데이션은 히어로·제휴 띠에만 은은하게.
   ═══════════════════════════════════════════════════════════════════ */
.home {
  background: var(--fk-bg);
  color: var(--fk-ink);
  word-break: keep-all;
}

.h-shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.h-title {
  margin: 0;
  font-size: 40px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.035em;
  color: var(--fk-title);
}

.accent {
  color: var(--fk-violet);
}

/* 스크롤 리빌 — v-reveal 이 .reveal / .is-visible 을 붙인다 */
.reveal {
  opacity: 0;
  transform: translateY(32px);
  transition:
    opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0ms),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0ms);
}

.reveal.is-visible {
  opacity: 1;
  transform: none;
}

/* ── 버튼 ─────────────────────────────────────────────────────── */
.h-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 60px;
  padding: 0 28px;
  border-radius: 18px;
  font-size: 19px;
  font-weight: 700;
  white-space: nowrap;
  text-decoration: none;
  transition: background-color 0.2s, transform 0.2s;
}

.h-btn:hover {
  transform: translateY(-2px);
}

.h-btn .arr {
  width: 22px;
  height: 22px;
  transition: transform 0.2s;
}

.h-btn:hover .arr {
  transform: translateX(4px);
}

.h-btn--soft {
  background: #9082dd;
  color: #ffffff;
}

.h-btn--soft:hover {
  background: var(--fk-violet);
  color: #ffffff;
}

.h-btn--white {
  background: #ffffff;
  color: var(--fk-violet-hover);
}

.h-btn--white:hover {
  background: var(--fk-lilac);
  color: var(--fk-violet-hover);
}

/* ── Hero ─────────────────────────────────────────────────────── */
.hero {
  padding: 0 0 72px;
  background: var(--fk-hero);
}

.hero-inner {
  max-width: 1200px;
  min-height: 600px;
  margin: 0 auto;
  padding: 84px 24px 96px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  gap: 48px;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero-title {
  margin: 24px 0 0;
  font-size: 40px;
  font-weight: 800;
  line-height: 1.45;
  letter-spacing: -0.04em;
  color: var(--fk-title);
}

/* 돌아가는 목적 키워드 */
.kw {
  display: inline-flex;
  height: 1.2em;
  margin-top: 0.125em;
  padding: 0 0.2em;
  overflow: hidden;
  vertical-align: top;
  border-radius: 0.26em;
  background: var(--fk-lilac-2);
  color: var(--fk-violet);
}

.kw-track {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  animation: kw 7.5s cubic-bezier(0.7, 0, 0.2, 1) 1.4s infinite;
}

.kw-track span {
  height: 1.2em;
  white-space: nowrap;
}

@keyframes kw {
  0%, 26% { transform: translateY(0); }
  33%, 59% { transform: translateY(-1.2em); }
  66%, 92% { transform: translateY(-2.4em); }
  100% { transform: translateY(-3.6em); }
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 106px;
}

/* 추천 결과 카드 */
.rec-card {
  flex-shrink: 0;
  align-self: flex-start;
  width: 400px;
  padding: 24px;
  box-sizing: border-box;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 30px 60px rgba(49, 32, 110, 0.18);
  color: #1d1a2b;
}

.rec-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rec-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.rec-chip {
  padding: 5px 12px;
  border-radius: 999px;
  background: #efe9f8;
  font-size: 16px;
  font-weight: 600;
  color: #4a3aa8;
}

.rec-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.rec-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 18px;
}

.rec-row.is-selected {
  background: #f3f3f5;
}

.rec-logo {
  flex-shrink: 0;
  width: 72px;
  height: 44px;
  padding: 6px 8px;
  box-sizing: border-box;
  border-radius: 14px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rec-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.rec-names {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rec-name {
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rec-bank,
.rec-base {
  font-size: 16px;
  font-weight: 500;
  color: #5e5a70;
  white-space: nowrap;
}

.rec-rates {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.rec-rate {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.rec-rate.is-top {
  color: var(--fk-red);
}

/* 빠른 추천 바 */
.quick {
  position: relative;
  z-index: 2;
  max-width: 1104px;
  margin: -56px auto 0;
  padding: 14px;
  box-sizing: border-box;
  display: flex;
  gap: 10px;
  border-radius: 28px;
  background: var(--fk-card);
  box-shadow: 0 24px 60px rgba(49, 32, 110, 0.16);
}

.qs {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 22px;
  border-radius: 20px;
  background: var(--fk-surface);
  text-decoration: none;
  transition: background-color 0.2s;
}

.qs:hover {
  background: var(--fk-lilac);
}

.qs-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--fk-muted);
}

.qs-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 22px;
  font-weight: 700;
  color: var(--fk-ink);
}

.qs-value svg {
  width: 22px;
  height: 22px;
  color: var(--fk-muted);
}

.quick-go {
  height: auto;
  padding: 0 34px;
  border-radius: 20px;
  font-size: 24px;
  font-weight: 700;
}

/* ── AI 맞춤형 예적금 추천 ─────────────────────────────────────── */
.steps {
  padding: 140px 0;
  background: var(--fk-surface);
}

.step-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  margin: 56px 0 0;
  padding: 0;
  list-style: none;
}

.step-card {
  display: flex;
  flex-direction: column;
  padding: 40px 36px 44px;
  border-radius: 32px;
  background: var(--fk-card);
}

/* 왼쪽에서 밀려 들어오며 등장 (v-reveal 의 is-visible 이 붙을 때) */
.step-card.reveal {
  opacity: 0;
  transform: translateX(-64px);
  transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0ms),
              transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0ms);
}

.step-card.reveal.is-visible {
  opacity: 1;
  transform: none;
}

.step-num {
  font-size: 46px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--fk-violet);
}

.step-title {
  margin: 28px 0 0;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--fk-title);
}

.step-desc {
  margin: 12px 0 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.7;
  color: var(--fk-muted);
}

/* ── Services ─────────────────────────────────────────────────── */
.services {
  padding: 140px 0 160px;
  background: var(--fk-bg);
}

.services-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
}

.services-lead {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.6;
  color: var(--fk-muted);
  text-align: right;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin-top: 56px;
}

.service {
  height: 300px;
  padding: 28px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-radius: 28px;
  background: var(--fk-surface);
  color: var(--fk-ink);
  text-decoration: none;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s;
}

.service:hover {
  transform: translateY(-8px);
  box-shadow: 0 28px 56px rgba(49, 32, 110, 0.12);
  color: var(--fk-ink);
}

.service--featured {
  background: var(--fk-lilac);
}

.service-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--fk-title);
}

.service-tag {
  padding: 6px 12px;
  border-radius: 999px;
  background: #cf5c75;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0;
  color: #ffffff;
}

.service-desc {
  margin: 15px 0 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.6;
  color: var(--fk-muted);
}

.service-foot {
  margin-top: auto;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.service-go {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f3f1f8;
  color: #1d1a2b;
  transition: background-color 0.25s, color 0.25s;
}

.service--featured .service-go {
  background: #ffffff;
}

.service:hover .service-go {
  background: var(--fk-violet);
  color: #ffffff;
}

.service-go svg {
  width: 20px;
  height: 20px;
}

.service-icon {
  display: block;
  width: 84px;
  height: 84px;
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.service-icon :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

.service:hover .service-icon {
  transform: translateY(-6px) rotate(-6deg) scale(1.06);
}

/* ── Partners ─────────────────────────────────────────────────── */
.partners {
  padding: 140px 0;
  overflow: hidden;
  background-color: #1d1a2b;
  background-image:
    radial-gradient(640px circle at 18% 0%, rgba(187, 142, 199, 0.42), rgba(187, 142, 199, 0) 70%),
    radial-gradient(720px circle at 85% 100%, rgba(149, 136, 223, 0.45), rgba(149, 136, 223, 0) 70%),
    linear-gradient(160deg, #2a2540 0%, #1d1a2b 55%, #251f3d 100%);
}

.partners-title {
  margin: 0;
  font-size: 50px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.035em;
  color: #ffffff;
  text-align: center;
}

.partners-title span {
  color: #d9c6f2;
}

.marquee {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 144px;
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 60s linear infinite;
}

.marquee-track--rev {
  animation-duration: 66s;
  animation-direction: reverse;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  to { transform: translateX(-50%); }
}

.partner {
  flex-shrink: 0;
  width: 184px;
  height: 92px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 22px;
  background: #ffffff;
}

.partner img {
  width: 132px;
  height: 44px;
  object-fit: contain;
}

/* ═══════════════════════════════════════════════════════════════════
   Motion 줄이기
   ═══════════════════════════════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  .kw-track,
  .marquee-track {
    animation: none;
  }

  .reveal,
  .step-card.reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   Responsive
   ═══════════════════════════════════════════════════════════════════ */
@media (max-width: 1100px) {
  .hero-inner {
    flex-direction: column;
    min-height: 0;
  }

  .rec-card {
    align-self: stretch;
    width: auto;
    max-width: 480px;
  }

  .quick {
    margin: -40px 24px 0;
    flex-wrap: wrap;
  }

  .qs {
    flex-basis: calc(50% - 5px);
  }

  .quick-go {
    flex-basis: 100%;
    height: 60px;
  }

  .service-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .hero-inner {
    padding: 48px 20px 80px;
  }

  .hero-title {
    font-size: 34px;
  }

  .hero-actions {
    flex-wrap: wrap;
  }

  .h-title {
    font-size: 32px;
  }

  .steps,
  .services,
  .partners {
    padding: 80px 0;
  }

  .step-grid {
    grid-template-columns: 1fr;
  }

  .services-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .services-lead {
    text-align: left;
  }

  .service-grid {
    grid-template-columns: 1fr;
  }

  .service {
    height: auto;
    min-height: 220px;
  }

  .partners-title {
    font-size: 34px;
  }

  .marquee {
    margin-top: 64px;
  }

  .qs {
    flex-basis: 100%;
  }
}
</style>
