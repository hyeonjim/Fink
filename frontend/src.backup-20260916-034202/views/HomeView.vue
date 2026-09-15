<template>
  <div class="home">
    <!-- ══════════════════════════════════════════════════════════════
         Hero
         ══════════════════════════════════════════════════════════════ -->
    <section class="hero">
      <div class="hero-inner">
        <h1 class="hero-title" v-reveal>
          복잡한 금융상품 비교,<br />
          이제 나에게 맞는 것만.
        </h1>
        <p class="hero-sub" v-reveal="1">
          소득과 목표, 투자 성향을 입력하면 21개 금융기관의 예·적금 상품을
          조건에 맞춰 비교해서 적합도 순으로 정리해 드립니다.
        </p>
        <div class="hero-actions" v-reveal="2">
          <RouterLink :to="{ name: 'AnalysisView' }" class="btn-solid">
            분석 시작하기
          </RouterLink>
          <RouterLink :to="{ name: 'ProductView' }" class="btn-outline">
            상품 둘러보기
          </RouterLink>
        </div>
      </div>

      <!-- 제품 목업 -->
      <div ref="mockupRef" class="mockup-wrap">
        <div class="mockup" v-reveal="3">
          <div class="mockup-bar">
            <span class="mockup-dot"></span>
            <span class="mockup-dot"></span>
            <span class="mockup-dot"></span>
            <span class="mockup-url">fink.app / 분석 결과</span>
          </div>

          <div class="mockup-body">
            <!-- 좌측 필터 -->
            <aside class="mk-filters">
              <div class="mk-filter-group">
                <span class="mk-filter-label">상품 유형</span>
                <div class="mk-chips">
                  <span class="mk-chip is-on">예금</span>
                  <span class="mk-chip is-on">적금</span>
                </div>
              </div>
              <div class="mk-filter-group">
                <span class="mk-filter-label">가입 기간</span>
                <div class="mk-chips">
                  <span class="mk-chip">6개월</span>
                  <span class="mk-chip is-on">12개월</span>
                  <span class="mk-chip">24개월</span>
                </div>
              </div>
              <div class="mk-filter-group">
                <span class="mk-filter-label">월 납입액</span>
                <div class="mk-field">300,000원</div>
              </div>
              <div class="mk-filter-group">
                <span class="mk-filter-label">투자 성향</span>
                <div class="mk-field">안정형</div>
              </div>
            </aside>

            <!-- 우측 결과 -->
            <div class="mk-results">
              <div class="mk-results-head">
                <span class="mk-results-count">
                  조건에 맞는 상품 <strong>{{ mockProducts.length }}</strong>건
                </span>
                <span class="mk-results-sort">적합도순</span>
              </div>

              <article
                v-for="item in mockProducts"
                :key="item.name"
                class="mk-card"
              >
                <header class="mk-card-head">
                  <span class="mk-bank-badge">{{ item.bank.charAt(0) }}</span>
                  <span class="mk-card-titles">
                    <span class="mk-bank">{{ item.bank }}</span>
                    <span class="mk-name">{{ item.name }}</span>
                  </span>
                  <span class="mk-fit">
                    <span class="mk-fit-label">적합도</span>
                    <span class="mk-fit-value">{{ item.fit }}%</span>
                  </span>
                </header>

                <div class="mk-card-body">
                  <div class="mk-rate">
                    <span class="mk-rate-num">{{ item.topRate }}</span>
                    <span class="mk-rate-unit">%</span>
                    <span class="mk-rate-meta">
                      최고금리(연) · 기본 {{ item.baseRate }}%
                    </span>
                  </div>
                  <div class="mk-tags">
                    <span class="mk-tag">{{ item.term }}개월</span>
                    <span class="mk-tag">{{ item.kind }}</span>
                    <span v-if="item.mobile" class="mk-tag">모바일</span>
                  </div>
                </div>

                <footer v-if="item.sim" class="mk-sim">
                  <span class="mk-sim-label">{{ item.sim.label }}</span>
                  <span class="mk-sim-arrow">→</span>
                  <span class="mk-sim-total">{{ item.sim.total }}</span>
                  <span class="mk-sim-gain">{{ item.sim.gain }}</span>
                </footer>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════
         Process (sticky)
         ══════════════════════════════════════════════════════════════ -->
    <section class="process">
      <div class="shell process-shell">
        <div class="process-aside">
          <div class="process-sticky" v-reveal>
            <p class="eyebrow">추천 과정</p>
            <p class="section-sub">
              금리만 높은 상품이 아니라, 조건과 성향에 실제로 맞는 상품을
              찾아냅니다.
            </p>
          </div>
        </div>

        <ol class="process-steps">
          <li v-for="(step, i) in steps" :key="step.title" v-reveal class="step">
            <span class="step-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="step-text">
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-desc">{{ step.desc }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════
         Services
         ══════════════════════════════════════════════════════════════ -->
    <section class="services">
      <div class="shell">
        <header class="section-head" v-reveal>
          <p class="eyebrow">서비스</p>
        </header>

        <div class="service-grid">
          <RouterLink
            v-for="(svc, i) in services"
            :key="svc.title"
            :to="{ name: svc.route }"
            class="service"
            v-reveal="i % 3"
          >
            <span class="service-icon" v-html="svc.icon"></span>
            <h3 class="service-title">
              {{ svc.title }}
              <span v-if="svc.tag" class="service-tag">{{ svc.tag }}</span>
            </h3>
            <p class="service-desc">{{ svc.desc }}</p>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════
         Partner banks (마퀴 모션 유지)
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
const mockProducts = [
  {
    bank: '카카오뱅크',
    name: '자유적금',
    fit: 92,
    topRate: '3.80',
    baseRate: '3.30',
    term: 12,
    kind: '적금',
    mobile: true,
    sim: { label: '월 30만 × 12개월', total: '368만원', gain: '+8만원' },
  },
  {
    bank: '신한은행',
    name: '쏠편한 정기예금',
    fit: 87,
    topRate: '3.45',
    baseRate: '3.10',
    term: 12,
    kind: '예금',
    mobile: true,
    sim: { label: '1,000만원 예치', total: '1,029만원', gain: '+29만원' },
  },
  {
    bank: '국민은행',
    name: 'KB국민첫재테크적금',
    fit: 81,
    topRate: '3.25',
    baseRate: '2.80',
    term: 12,
    kind: '적금',
    mobile: false,
    sim: null,
  },
]

const steps = [
  {
    title: '정보 입력',
    desc: '나이, 소득, 목표 금액, 투자 성향을 입력합니다. 3분이면 충분합니다.',
  },
  {
    title: 'AI 분석',
    desc: '21개 금융기관의 예·적금 상품을 입력한 조건과 하나씩 대조합니다.',
  },
  {
    title: '맞춤 추천',
    desc: '적합도 순으로 정렬된 상품과 만기 실수령액을 함께 확인합니다.',
  },
]

const services = [
  {
    route: 'ProductView',
    title: '금융상품 비교',
    desc: '예·적금 상품의 금리와 조건을 한 화면에서 비교합니다.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h12M3 18h6"/></svg>',
  },
  {
    route: 'AnalysisView',
    title: 'AI 맞춤 추천',
    tag: '추천',
    desc: '조건과 성향을 반영해 적합도 순으로 상품을 제안합니다.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1m0-12.8l-2.1 2.1m-8.6 8.6l-2.1 2.1"/><circle cx="12" cy="12" r="3.5"/></svg>',
  },
  {
    route: 'StockView',
    title: '주식 시세',
    desc: '관심 종목의 시세와 추이를 차트로 확인합니다.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="15 7 21 7 21 13"/></svg>',
  },
  {
    route: 'NewsView',
    title: '금융 뉴스',
    desc: '시장 흐름을 읽을 수 있는 최신 뉴스를 모았습니다.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h6M7 13h10M7 16h10"/></svg>',
  },
  {
    route: 'MetalView',
    title: '현물 시세',
    desc: '금·은 등 현물 가격의 실시간 추이를 확인합니다.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h5M9.5 14.5h5"/></svg>',
  },
  {
    route: 'KakaoMapView',
    title: '주변 은행 찾기',
    desc: '가까운 영업점과 ATM 위치를 지도에서 찾습니다.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-5.2 7-10a7 7 0 10-14 0c0 4.8 7 10 7 10z"/><circle cx="12" cy="11" r="2.5"/></svg>',
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
   ═══════════════════════════════════════════════════════════════════ */
.home {
  background: var(--n-bg);
  color: var(--n-text-body);
}

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

.section-sub {
  margin: 16px 0 0;
  font-size: 1rem;
  line-height: 1.65;
  color: var(--n-text-muted);
}

.section-head {
  max-width: 640px;
  margin-bottom: 56px;
}

/* 스크롤 리빌 — v-reveal 이 .reveal / .is-visible 을 붙인다 */
.reveal {
  opacity: 0;
  transform: translateY(44px) scale(0.97);
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
.btn-solid,
.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 22px;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}

.btn-solid {
  background: var(--n-accent);
  color: #ffffff;
}

.btn-solid:hover {
  background: var(--n-accent-hover);
  border-color: var(--n-accent-hover);
}

.btn-outline {
  background: transparent;
  color: var(--n-text);
  border: 1px solid var(--n-border-strong);
}

.btn-outline:hover {
  background: var(--n-bg-subtle);
  border-color: var(--n-text-muted);
}

/* ═══════════════════════════════════════════════════════════════════
   Hero
   ═══════════════════════════════════════════════════════════════════ */
.hero {
  padding: 120px 24px 0;
  text-align: center;
  background: var(--n-bg);
  overflow: hidden;
}

.hero-inner {
  max-width: 720px;
  margin: 0 auto;
}

.hero-title {
  margin: 0;
  font-size: 40px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.035em;
  color: var(--n-text);
}

.hero-sub {
  max-width: 560px;
  margin: 24px auto 0;
  font-size: 1.0625rem;
  line-height: 1.7;
  color: var(--n-text-muted);
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 36px;
}

/* ── 제품 목업 ───────────────────────────────────────────────────── */
.mockup-wrap {
  max-width: 1040px;
  margin: 72px auto -60px;
  padding-inline: 24px;
  /* useParallax 가 --parallax(0~1)를 갱신한다 */
  transform: translate3d(0, calc(var(--parallax, 0) * -48px), 0);
  will-change: transform;
}

.mockup {
  border: 1px solid var(--n-border);
  border-radius: 12px;
  background: var(--n-bg);
  box-shadow: 0 24px 60px -32px rgba(28, 25, 23, 0.28);
  overflow: hidden;
  text-align: left;
}

.mockup-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--n-border);
  background: var(--n-bg-subtle);
}

.mockup-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--n-border-strong);
}

.mockup-url {
  margin-left: 12px;
  font-size: 0.75rem;
  color: var(--n-text-muted);
}

.mockup-body {
  display: grid;
  grid-template-columns: 220px 1fr;
  background: var(--n-bg-sunken);
}

/* 목업 - 필터 */
.mk-filters {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 22px 20px;
  border-right: 1px solid var(--n-border);
  background: var(--n-bg);
}

.mk-filter-label {
  display: block;
  margin-bottom: 9px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--n-text-muted);
}

.mk-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.mk-chip {
  padding: 5px 10px;
  border: 1px solid var(--n-border);
  border-radius: 6px;
  font-size: 0.75rem;
  color: var(--n-text-muted);
}

.mk-chip.is-on {
  border-color: var(--n-accent);
  background: var(--n-accent-wash);
  color: var(--n-accent);
}

.mk-field {
  padding: 9px 11px;
  border: 1px solid var(--n-border);
  border-radius: 6px;
  font-size: 0.8125rem;
  color: var(--n-text-body);
}

/* 목업 - 결과 */
.mk-results {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 22px 20px;
}

.mk-results-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 2px;
}

.mk-results-count {
  font-size: 0.8125rem;
  color: var(--n-text-muted);
}

.mk-results-count strong {
  font-weight: 600;
  color: var(--n-text);
}

.mk-results-sort {
  font-size: 0.75rem;
  color: var(--n-text-muted);
}

.mk-card {
  padding: 15px 16px;
  border: 1px solid var(--n-border);
  border-radius: 10px;
  background: var(--n-bg);
}

.mk-card-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mk-bank-badge {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 7px;
  background: var(--n-bg-sunken);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--n-text-body);
}

.mk-card-titles {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.mk-bank {
  font-size: 0.6875rem;
  color: var(--n-text-muted);
}

.mk-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--n-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mk-fit {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
  margin-left: auto;
  padding-left: 10px;
}

.mk-fit-label {
  font-size: 0.625rem;
  color: var(--n-text-muted);
}

.mk-fit-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--n-accent);
}

.mk-card-body {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
}

.mk-rate {
  display: flex;
  align-items: baseline;
  gap: 3px;
}

.mk-rate-num {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--n-text);
}

.mk-rate-unit {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--n-text);
}

.mk-rate-meta {
  margin-left: 8px;
  font-size: 0.6875rem;
  color: var(--n-text-muted);
}

.mk-tags {
  display: flex;
  gap: 5px;
}

.mk-tag {
  padding: 3px 8px;
  border: 1px solid var(--n-border);
  border-radius: 5px;
  font-size: 0.6875rem;
  color: var(--n-text-muted);
}

.mk-sim {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding-top: 11px;
  border-top: 1px solid var(--n-border);
  font-size: 0.75rem;
  color: var(--n-text-muted);
}

.mk-sim-arrow {
  color: var(--n-border-strong);
}

.mk-sim-total {
  font-weight: 600;
  color: var(--n-text);
}

.mk-sim-gain {
  margin-left: auto;
  color: var(--n-accent);
}

/* ═══════════════════════════════════════════════════════════════════
   Process (sticky)
   ═══════════════════════════════════════════════════════════════════ */
.process {
  padding: 160px 0 120px;
  background: var(--n-bg);
}

.process-shell {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.process-sticky {
  max-width: 640px;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.step {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 28px;
  border: 1px solid var(--n-border);
  border-radius: 12px;
  background: var(--n-bg);
}

.step-num {
  flex-shrink: 0;
  font-size: 0.8125rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--n-text-muted);
}

.step-title {
  margin: 0 0 8px;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--n-text);
}

.step-desc {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--n-text-muted);
}

/* ═══════════════════════════════════════════════════════════════════
   Services
   ═══════════════════════════════════════════════════════════════════ */
.services {
  padding: 120px 0;
  background: var(--n-bg-subtle);
  border-top: 1px solid var(--n-border);
  border-bottom: 1px solid var(--n-border);
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.service {
  display: block;
  padding: 28px;
  border: 1px solid var(--n-border);
  border-radius: 12px;
  background: var(--n-bg);
  text-decoration: none;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease;
}

.service:hover {
  border-color: var(--n-border-strong);
}

.service-icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  margin-bottom: 18px;
  color: var(--n-text-muted);
}

.service-icon :deep(svg) {
  width: 22px;
  height: 22px;
}

.service:hover .service-icon {
  color: var(--n-accent);
}

.service-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 8px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--n-text);
}

.service-tag {
  padding: 2px 7px;
  border-radius: 4px;
  background: var(--n-accent-wash);
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--n-accent);
}

.service-desc {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--n-text-muted);
}

/* ═══════════════════════════════════════════════════════════════════
   Partners — 마퀴 모션 유지
   ═══════════════════════════════════════════════════════════════════ */
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
  border-radius: 12px;
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
@media (max-width: 1024px) {
  .process-steps {
    grid-template-columns: repeat(2, 1fr);
  }

  .service-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 860px) {
  /* 목업이 좁아지면 필터를 접고 결과만 보여준다 */
  .mockup-body {
    grid-template-columns: 1fr;
  }

  .mk-filters {
    display: none;
  }
}

@media (max-width: 768px) {
  .hero {
    padding-top: 88px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
    max-width: 280px;
    margin-inline: auto;
  }

  .mockup-wrap {
    margin-top: 56px;
    /* 모바일에서는 패럴랙스를 끈다 */
    transform: none;
  }

  .process {
    padding: 100px 0 80px;
  }

  .services,
  .partners {
    padding: 80px 0;
  }

  .service-grid {
    grid-template-columns: 1fr;
  }

  .process-steps {
    grid-template-columns: 1fr;
  }

  .step {
    gap: 10px;
    padding: 24px;
  }

  .mk-card-body {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .cta-box {
    padding: 56px 24px;
  }

  .cta {
    padding-bottom: 80px;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   Dark mode
   토큰이 대부분 처리하므로 예외만 보정한다.
   ═══════════════════════════════════════════════════════════════════ */
[data-theme='dark'] .mockup {
  box-shadow: 0 24px 60px -32px rgba(0, 0, 0, 0.7);
}

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

[data-theme='dark'] .cta-box {
  border: 1px solid var(--n-border);
}

[data-theme='dark'] .btn-on-ink {
  background: var(--n-text);
  border-color: var(--n-text);
  color: var(--n-ink);
}

[data-theme='dark'] .btn-on-ink:hover {
  background: var(--n-text-body);
  border-color: var(--n-text-body);
}
</style>
