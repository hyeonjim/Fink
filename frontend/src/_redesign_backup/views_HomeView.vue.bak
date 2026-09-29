<template>
  <div class="home">
    <!-- ══════════════════════════════════════════════════════════════
         Hero — 화면 폭 전체 라벤더
         ══════════════════════════════════════════════════════════════ -->
    <section class="hero">
      <div class="hero-panel">
        <div class="hero-copy">
          <h1 class="hero-title" v-reveal="1">
            목표 금액과 기간을 정하면,<br />
            최적의 예금과 적금을 골라 드립니다.
          </h1>
          <p class="hero-sub" v-reveal="2">
            주택, 목돈 마련, 여행 가운데 목적을 고르고 보유 금액과 월 납입액을
            입력하세요. 목표를 채울 수 있는 예금·적금 조합과 세후 만기 금액을
            보여 드립니다.
          </p>
          <div class="hero-actions" v-reveal="3">
            <RouterLink :to="{ name: 'AnalysisView' }" class="h-btn h-btn--solid">
              추천 받기
            </RouterLink>
            <RouterLink :to="{ name: 'ProductView' }" class="h-btn h-btn--line">
              상품 비교하기
            </RouterLink>
          </div>
        </div>

        <!-- 제품 목업 — 실제 추천 결과 화면을 축약해 보여준다 -->
        <div ref="mockupRef" class="mockup-wrap">
          <div class="mockup" v-reveal="2">
            <header class="mk-head">
              <span class="mk-title">추천 결과</span>
            </header>

            <div class="mk-conds">
              <span v-for="cond in mockConditions" :key="cond" class="mk-cond">
                {{ cond }}
              </span>
            </div>

            <ul class="mk-list">
              <li
                v-for="(item, i) in mockProducts"
                :key="item.name"
                class="mk-row"
                :class="{ 'is-selected': i === 0 }"
              >
                <div class="mk-row-main">
                  <span class="mk-badge">{{ item.bank.charAt(0) }}</span>
                  <span class="mk-titles">
                    <span class="mk-name">{{ item.name }}</span>
                    <span class="mk-meta">
                      {{ item.bank }} · 적합도
                      <strong>{{ item.fit }}%</strong>
                    </span>
                  </span>
                  <span class="mk-rate">
                    <span class="mk-rate-num">{{ item.topRate }}%</span>
                    <span class="mk-rate-meta">기본 {{ item.baseRate }}%</span>
                  </span>
                </div>

                <div v-if="i === 0 && item.sim" class="mk-sim">
                  <span>{{ item.sim.label }}</span>
                  <span class="mk-sim-total">
                    세후 만기 {{ item.sim.total }}
                    <em>{{ item.sim.gain }}</em>
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════
         Process — 단계 카드를 가로로 늘어놓고 01 → 02 → 03 순서로 등장시킨다
         ══════════════════════════════════════════════════════════════ -->
    <section class="process">
      <div class="h-shell">
        <h2 class="h-title h-title--on-band process-title" v-reveal>
          단계별 AI 분석
        </h2>

        <!-- v-reveal 인덱스 1당 80ms 지연.
             카드는 i * 4(320ms 간격), 화살표는 그 사이(i * 4 + 2)에 나타나
             카드 → 화살표 → 카드 순으로 이어진다. -->
        <ol class="process-steps">
          <template v-for="(step, i) in steps" :key="step.title">
            <li v-reveal="i * 4" class="step">
              <span class="step-num">{{ String(i + 1).padStart(2, '0') }}</span>
              <div class="step-text">
                <h3 class="step-title">{{ step.title }}</h3>
                <p class="step-desc">{{ step.desc }}</p>
              </div>
            </li>
            <li
              v-if="i < steps.length - 1"
              v-reveal="i * 4 + 2"
              class="step-arrow"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 12h16M14 6l6 6-6 6" />
              </svg>
            </li>
          </template>
        </ol>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════
         Services
         ══════════════════════════════════════════════════════════════ -->
    <section class="services">
      <div class="h-shell">
        <header class="services-head" v-reveal>
          <h2 class="h-title">금융 정보를 한눈에</h2>
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
            <span class="service-icon" v-html="svc.icon"></span>
            <h3 class="service-title">
              {{ svc.title }}
              <span v-if="svc.tag" class="service-tag">{{ svc.tag }}</span>
            </h3>
            <p class="service-desc">{{ svc.desc }}</p>
            <span class="service-more">
              바로가기
              <span class="service-arrow" aria-hidden="true">→</span>
            </span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════
         Partner banks (마퀴 모션 유지 — 이번 리디자인 대상 아님)
         ══════════════════════════════════════════════════════════════ -->
    <section class="partners">
      <div class="shell">
        <header class="section-head" v-reveal>
          <p class="eyebrow">제휴 금융기관</p>
          <h2 class="section-title">{{ banks.length }}개 금융기관의 상품을 비교합니다</h2>
        </header>
      </div>

      <div class="marquee">
        <div class="marquee-track">
          <div class="partner" v-for="bank in banks" :key="bank">
            <img :src="getBankLogo(bank)" :alt="bank" class="partner-img" />
          </div>
          <div class="partner" v-for="bank in banks" :key="bank + '-dup'" aria-hidden="true">
            <img :src="getBankLogo(bank)" alt="" class="partner-img" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { vReveal, useParallax } from '@/composables/useScrollReveal'

const mockupRef = ref(null)
useParallax(mockupRef)

/* 히어로 목업용 예시 데이터.
   실제 추천 화면(components/analysis/ProductCard.vue)의 구조를 따른다. */
const mockConditions = ['목돈 마련', '12개월', '월 30만원']

const mockProducts = [
  {
    bank: '카카오뱅크',
    name: '자유적금',
    fit: 92,
    topRate: '3.80',
    baseRate: '3.30',
    // 30만 × 78회차 × 3.8% ÷ 12 = 74,100원(세전) → 15.4% 공제 후 62,688원
    sim: { label: '월 30만 × 12개월', total: '366만원', gain: '+6.3만원' },
  },
  {
    bank: '신한은행',
    name: '쏠편한 정기예금',
    fit: 87,
    topRate: '3.45',
    baseRate: '3.10',
    sim: null,
  },
  {
    bank: '국민은행',
    name: 'KB국민첫재테크적금',
    fit: 81,
    topRate: '3.25',
    baseRate: '2.80',
    sim: null,
  },
]

const steps = [
  { title: '목적 선택', desc: '주택, 목돈 마련, 여행 중 하나를 고릅니다.' },
  { title: '금액 입력', desc: '보유 금액, 목표 금액, 월 납입액, 기간을 적습니다.' },
  { title: '결과 확인', desc: '목표 달성 여부와 예금·적금 조합, 추천 상품을 봅니다.' },
]

/* 상단 메뉴와 같은 순서로 둔다 */
const services = [
  {
    route: 'ProductView',
    title: '금융상품',
    desc: '은행별·기간별로 예금·적금 금리를 비교합니다.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h12M3 18h6"/></svg>',
  },
  {
    route: 'AnalysisView',
    title: 'AI 분석',
    tag: '추천',
    desc: '목표에 맞는 예금·적금 조합을 추천합니다.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1m0-12.8l-2.1 2.1m-8.6 8.6l-2.1 2.1"/><circle cx="12" cy="12" r="3.5"/></svg>',
  },
  {
    route: 'StockView',
    title: '주식',
    desc: '관심 종목의 시세와 차트를 봅니다.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="15 7 21 7 21 13"/></svg>',
  },
  {
    route: 'NewsView',
    title: '금융뉴스',
    desc: '최신 금융 뉴스를 읽고 저장합니다.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h6M7 13h10M7 16h10"/></svg>',
  },
  {
    route: 'YoutubeSearchView',
    title: '유튜브',
    desc: '금융 영상을 검색하고 저장합니다.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10.5 9.5v5l4-2.5z"/></svg>',
  },
  {
    route: 'MetalView',
    title: '현물',
    desc: '금·은 가격 추이를 차트로 봅니다.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h5M9.5 14.5h5"/></svg>',
  },
  {
    route: 'KakaoMapView',
    title: '은행찾기',
    desc: '가까운 은행 지점을 지도에서 찾습니다.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-5.2 7-10a7 7 0 10-14 0c0 4.8 7 10 7 10z"/><circle cx="12" cy="11" r="2.5"/></svg>',
  },
  {
    route: 'CommunityView',
    title: '커뮤니티',
    desc: '다른 사용자와 금융 이야기를 나눕니다.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 15a2 2 0 01-2 2H8l-4 4V5a2 2 0 012-2h12a2 2 0 012 2z"/></svg>',
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

const getBankLogo = (bankName) =>
  new URL(`../assets/banks/${bankName}.png`, import.meta.url).href
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════
   Base
   본문 글자는 16px 아래로 내리지 않는다.
   ═══════════════════════════════════════════════════════════════════ */
.home {
  background: var(--n-canvas);
  color: var(--n-copy);
  /* 한글이 음절 중간에서 줄바꿈되지 않도록 어절 단위로 끊는다 */
  word-break: keep-all;
}

.h-shell {
  max-width: 1200px;
  margin: 0 auto;
  padding-inline: 32px;
}

.h-kicker {
  margin: 0 0 16px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--n-brand-strong);
}

.h-title {
  margin: 0;
  font-size: clamp(2rem, 3.4vw, 2.75rem);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.035em;
  color: var(--n-heading);
}

.h-title--on-band {
  color: var(--n-band-text);
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

/* ═══════════════════════════════════════════════════════════════════
   Buttons
   ═══════════════════════════════════════════════════════════════════ */
.h-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  padding: 0 28px;
  border: 1px solid transparent;
  border-radius: var(--n-radius-md);
  font-size: 1.0625rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}

.h-btn--solid {
  background: var(--n-cta);
  color: var(--n-on-cta);
}

.h-btn--solid:hover {
  background: var(--n-cta-hover);
}

.h-btn--line {
  border-color: var(--n-brand-panel-text);
  color: var(--n-brand-panel-text);
}

.h-btn--line:hover {
  background: var(--n-brand-panel-line);
}

/* ═══════════════════════════════════════════════════════════════════
   Hero
   ═══════════════════════════════════════════════════════════════════ */
/* 카드로 감싸지 않고 화면 폭 전체를 라벤더로 채운다 */
.hero {
  background: var(--n-brand-panel);
  color: var(--n-brand-panel-text);
}

.hero-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  align-items: center;
  gap: 64px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 112px 32px 120px;
}

.hero-kicker {
  margin: 0 0 20px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--n-brand-panel-muted);
}

.hero-title {
  margin: 0;
  font-size: clamp(2.25rem, 3.4vw, 2.875rem);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.04em;
  color: var(--n-brand-panel-text);
}

.hero-sub {
  max-width: 760px;
  margin: 28px 0 0;
  font-size: 22px;
  line-height: 1.7;
  color: var(--n-brand-panel-muted);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 40px;
}

/* ── 제품 목업 ───────────────────────────────────────────────────── */
.mockup-wrap {
  /* useParallax 가 --parallax(0~1)를 갱신한다 */
  transform: translate3d(0, calc(var(--parallax, 0) * -24px), 0);
  will-change: transform;
}

.mockup {
  padding: 28px;
  border-radius: var(--n-radius-lg);
  background: var(--n-surface);
  box-shadow: var(--n-shadow-lg);
}

.mk-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.mk-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--n-heading);
}

.mk-conds {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}

.mk-cond {
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--n-brand-tint);
  font-size: 1rem;
  font-weight: 500;
  color: var(--n-brand-strong);
}

.mk-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

.mk-row {
  padding: 16px;
  border-radius: var(--n-radius-md);
}

.mk-row + .mk-row {
  border-top: 1px solid var(--n-line);
  border-radius: 0;
}

.mk-row.is-selected {
  background: var(--n-brand-tint);
}

/* 선택된 행 바로 아래 행은 구분선이 배경과 겹쳐 보이므로 뺀다 */
.mk-row.is-selected + .mk-row {
  border-top-color: transparent;
}

.mk-row-main {
  display: flex;
  align-items: center;
  gap: 14px;
}

.mk-badge {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: var(--n-radius-md);
  background: var(--n-brand-tint);
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--n-brand-strong);
}

.mk-row.is-selected .mk-badge {
  background: var(--n-surface);
}

.mk-titles {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.mk-name {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--n-heading);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mk-meta {
  font-size: 1rem;
  color: var(--n-copy-muted);
  white-space: nowrap;
}

.mk-meta strong {
  font-weight: 600;
  color: var(--n-brand-strong);
}

.mk-rate {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}

.mk-rate-num {
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: var(--n-heading);
}

.mk-rate-meta {
  font-size: 1rem;
  color: var(--n-copy-muted);
}

.mk-sim {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--n-brand-panel-line);
  font-size: 1rem;
  color: var(--n-copy-muted);
}

.mk-sim-total {
  font-weight: 600;
  color: var(--n-heading);
}

.mk-sim-total em {
  margin-left: 6px;
  font-style: normal;
  color: var(--n-brand-strong);
}

/* ═══════════════════════════════════════════════════════════════════
   Process — 라벤더 그레이 띠
   ═══════════════════════════════════════════════════════════════════ */
.process {
  padding: 140px 0;
  background: var(--n-band);
}

.process-title {
  margin-bottom: 64px;
}

.process-steps {
  display: grid;
  /* 카드 · 화살표 · 카드 · 화살표 · 카드 */
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.step-arrow {
  display: grid;
  place-items: center;
  color: var(--n-brand-strong);
}

.step-arrow svg {
  width: 28px;
  height: 28px;
}

/* 단계 카드 — 테두리 없이 그림자로 띠 배경에서 띄운다 */
.step {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 36px 32px;
  border-radius: var(--n-radius-lg);
  background: var(--n-surface);
  box-shadow: var(--n-shadow-md);
}

@media (prefers-reduced-motion: reduce) {
  .step {
    transition: none;
  }
}

.step-num {
  font-size: 1.125rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--n-brand-strong);
}

.step-title {
  margin: 0 0 12px;
  font-size: 1.625rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--n-band-text);
}

.step-desc {
  margin: 0;
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--n-band-muted);
}

/* ═══════════════════════════════════════════════════════════════════
   Services
   ═══════════════════════════════════════════════════════════════════ */
.services {
  padding: 140px 0;
  background: var(--n-canvas);
}

.services-head {
  margin-bottom: 56px;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.service {
  display: flex;
  flex-direction: column;
  padding: 28px;
  border: 1px solid var(--n-line);
  border-radius: var(--n-radius-lg);
  background: var(--n-surface);
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.service:hover {
  border-color: var(--n-brand-strong);
}

.service--featured {
  border-color: transparent;
  background: var(--n-brand-panel);
}

.service--featured:hover {
  border-color: var(--n-brand-panel-text);
}

.service-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin-bottom: 28px;
  border-radius: var(--n-radius-md);
  background: var(--n-brand-soft);
  color: var(--n-brand-strong);
}

.service--featured .service-icon {
  background: var(--n-surface);
}

.service-icon :deep(svg) {
  width: 26px;
  height: 26px;
}

.service-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 10px;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--n-heading);
}

.service--featured .service-title {
  color: var(--n-brand-panel-text);
}

.service-tag {
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--n-cta);
  font-size: 1rem;
  font-weight: 600;
  color: var(--n-on-cta);
}

.service-desc {
  flex: 1;
  margin: 0;
  font-size: 1.0625rem;
  line-height: 1.65;
  color: var(--n-copy-muted);
}

.service--featured .service-desc {
  color: var(--n-brand-panel-muted);
}

.service-more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 28px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--n-heading);
}

.service--featured .service-more {
  color: var(--n-brand-panel-text);
}

.service-arrow {
  transition: transform 0.2s ease;
}

.service:hover .service-arrow {
  transform: translateX(4px);
}

/* ═══════════════════════════════════════════════════════════════════
   Partners — 마퀴 모션 유지 (리디자인 대상 아님, 기존 스타일 그대로)
   ═══════════════════════════════════════════════════════════════════ */
.shell {
  max-width: 1120px;
  margin: 0 auto;
  padding-inline: 24px;
}

.eyebrow {
  margin: 0 0 16px;
  font-size: clamp(1.5rem, 2.6vw, 2rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.3;
  color: var(--n-text);
}

.section-title {
  margin: 0;
  font-size: 35px;
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.25;
  color: var(--n-text);
}

.section-head {
  max-width: 640px;
  margin-bottom: 56px;
}

.partners {
  padding: 170px 0;
  background: var(--n-bg);
  overflow: hidden;
}

.marquee {
  overflow: hidden;
  /* 양끝 페이드 */
  -webkit-mask-image: linear-gradient(
    90deg,
    transparent,
    #000 8%,
    #000 92%,
    transparent
  );
  mask-image: linear-gradient(
    90deg,
    transparent,
    #000 8%,
    #000 92%,
    transparent
  );
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 30s linear infinite;
}

/* gap 대신 아이템 margin 을 써서 두 벌의 폭이 정확히 같아지도록 한다.
   (트랙에 gap 이 있으면 translateX(-50%) 지점에서 이음새가 튄다) */
.partner {
  flex-shrink: 0;
  margin-right: 40px;
}

.partner-img {
  display: block;
  width: 152px;
  height: 82px;
  padding: 12px 20px;
  object-fit: contain;
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-md);
  /* 은행 로고는 흰 배경을 전제로 만들어진 이미지라 다크모드에서도 흰색을
     유지한다. 토큰(--n-bg)을 쓰면 로고가 어두운 배경에 묻힌다. */
  background: #fff;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.partner-img:hover {
  transform: scale(1.03);
  border-color: var(--n-border-strong);
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   Responsive
   ═══════════════════════════════════════════════════════════════════ */
@media (max-width: 1100px) {
  .hero-panel {
    grid-template-columns: minmax(0, 1fr);
    gap: 56px;
    padding: 88px 32px 96px;
  }

  .hero-sub {
    max-width: 640px;
  }

  .mockup-wrap {
    max-width: 640px;
  }

  .service-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .h-shell {
    padding-inline: 20px;
  }

  .hero-panel {
    padding: 56px 20px 64px;
  }

  .hero-title {
    font-size: 1.875rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .h-btn {
    width: 100%;
  }

  .mockup-wrap {
    /* 모바일에서는 패럴랙스를 끈다 */
    transform: none;
  }

  .mockup {
    padding: 20px 16px;
  }

  .mk-row {
    padding: 14px 10px;
  }

  .mk-badge {
    width: 38px;
    height: 38px;
  }

  .mk-sim {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .process {
    padding: 88px 0;
  }

  .process-title {
    margin-bottom: 40px;
  }

  .process-steps {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }

  /* 세로로 쌓이면 화살표도 아래를 향한다 */
  .step-arrow svg {
    transform: rotate(90deg);
  }

  .step {
    gap: 12px;
    padding: 28px 24px;
  }

  .step-title {
    font-size: 1.375rem;
  }

  .services {
    padding: 88px 0;
  }

  .services-head {
    margin-bottom: 40px;
  }

  .service-grid {
    grid-template-columns: 1fr;
  }

  .service {
    padding: 28px 24px;
  }

  .partners {
    padding: 80px 0;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   Dark mode
   토큰이 대부분 처리하므로 예외만 보정한다.
   ═══════════════════════════════════════════════════════════════════ */

/* 은행 로고는 대부분 흰 배경을 전제로 제작된 이미지라
   다크모드에서도 타일 배경을 밝게 유지한다.
   배경이 밝으므로 테두리도 어두운 톤 대신 밝은 톤에 맞춘다. */
[data-theme='dark'] .partner-img {
  background: #f5f5f4;
  border-color: #e7e5e4;
}

[data-theme='dark'] .partner-img:hover {
  border-color: #d6d3d1;
}
</style>
