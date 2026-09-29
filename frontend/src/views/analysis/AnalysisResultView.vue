<template>
  <div class="result-page">
    <!-- Page Header -->
    <header class="n-page-header">
      <div class="n-page-header-content">
        <div class="n-page-header-icon">
          <svg class="duo" viewBox="0 0 64 64" aria-hidden="true"><rect class="i1" x="4" y="10" width="40" height="44" rx="9"/><rect class="i2" x="4" y="20" width="40" height="34" rx="9"/><rect class="i2" x="4" y="20" width="40" height="10"/><rect class="iw" x="10" y="14" width="10" height="3" rx="1.5"/><rect class="iw" x="11" y="38" width="6" height="10" rx="2"/><rect class="iw" x="20" y="32" width="6" height="16" rx="2"/><rect class="iw" x="29" y="26" width="6" height="22" rx="2"/><circle class="i3" cx="46" cy="44" r="14"/><path class="sw" d="M39.5 44.5l4.5 4.5 8.5-9"/></svg>
        </div>
        <div class="n-page-header-text">
          <h1 class="n-page-title">추천 결과</h1>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Loading State -->
      <div v-if="analysisStore.loading" class="loading-state">
        <div class="loading-card">
          <div class="loading-spinner"></div>
          <p class="loading-title">분석 결과를 불러오는 중...</p>
          <span class="loading-text">잠시만 기다려주세요</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="analysisStore.error" class="error-state">
        <div class="error-card">
          <div class="error-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p class="error-title">오류가 발생했습니다</p>
          <span class="error-text">다시 시도해주세요</span>
          <button class="retry-btn" @click="goBack">다시 분석하기</button>
        </div>
      </div>

      <!-- Result Content -->
      <template v-else-if="analysisStore.result">
        <!-- AI Summary Card -->
        <div v-if="analysisStore.result?.summary" class="summary-card">
          <div class="summary-icon">
            <svg class="duo" viewBox="0 0 64 64" aria-hidden="true"><rect class="i1" x="16" y="4" width="40" height="48" rx="9"/><rect class="i2" x="8" y="12" width="40" height="48" rx="9"/><rect class="iw" x="15" y="24" width="24" height="4" rx="2"/><rect class="iw" x="15" y="33" width="18" height="4" rx="2"/><rect class="iw" x="15" y="42" width="12" height="4" rx="2"/></svg>
          </div>
          <div class="summary-content">
            <h3 class="summary-title">AI 분석 요약</h3>
            <p class="summary-text">{{ analysisStore.result.summary }}</p>
          </div>
        </div>

        <!-- Goal Math Card -->
        <div v-if="analysisStore.result?.goal_math" class="goal-card">
          <h3 class="section-title">
            <svg class="duo" viewBox="0 0 64 64" aria-hidden="true"><ellipse class="i1" cx="24" cy="55" rx="16" ry="4"/><rect class="i3" x="14" y="8" width="5" height="48" rx="2.5"/><path class="i2" d="M19 10h30l-7 9 7 9H19z"/><path class="i1" d="M19 10h14v18H19z"/><circle class="i4" cx="16.5" cy="8" r="4"/></svg>
            목표 달성 분석
          </h3>
          <div class="goal-stats">
            <div class="goal-stat">
              <span class="stat-label">계획 총 납입액</span>
              <span class="stat-value">{{ formatCurrency(analysisStore.result.goal_math.planned_total_amount) }}</span>
            </div>
            <div class="goal-stat">
              <span class="stat-label">목표 달성 예상 기간</span>
              <span class="stat-value">{{ analysisStore.result.goal_math.months_to_goal || '-' }}개월</span>
            </div>
            <div class="goal-stat" :class="{ success: !analysisStore.result.goal_math.shortfall_amount, warning: analysisStore.result.goal_math.shortfall_amount > 0 }">
              <span class="stat-label">부족 금액</span>
              <span class="stat-value">{{ analysisStore.result.goal_math.shortfall_amount > 0 ? formatCurrency(analysisStore.result.goal_math.shortfall_amount) : '없음' }}</span>
            </div>
            <div v-if="analysisStore.result.goal_math.extra_needed_per_month > 0" class="goal-stat warning">
              <span class="stat-label">필요 추가 월납입</span>
              <span class="stat-value">{{ formatCurrency(analysisStore.result.goal_math.extra_needed_per_month) }}</span>
            </div>
          </div>
        </div>

        <!-- Strategy Card -->
        <div v-if="analysisStore.result?.strategy" class="strategy-card">
          <h3 class="section-title">
            <svg class="duo" viewBox="0 0 64 64" aria-hidden="true"><rect class="i1" x="4" y="40" width="16" height="18" rx="5"/><rect class="i2" x="24" y="28" width="16" height="30" rx="5"/><rect class="i3" x="44" y="14" width="16" height="44" rx="5"/><path class="i4" d="M12 4l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/></svg>
            추천 전략
          </h3>
          <p class="strategy-text">{{ analysisStore.result.strategy }}</p>
        </div>

        <!-- Combination Strategy (예금+적금 조합) - 달성 가능한 전략이 있을 때만 표시 -->
        <div v-if="hasAchievableStrategy && analysisStore.result?.combination_strategy && Object.keys(analysisStore.result.combination_strategy).length > 0" class="combination-card">
          <h3 class="section-title">
            <svg class="duo" viewBox="0 0 64 64" aria-hidden="true"><rect class="i1" x="4" y="12" width="46" height="34" rx="8"/><rect class="i2" x="4" y="22" width="46" height="34" rx="8"/><rect class="iw" x="11" y="44" width="16" height="4" rx="2"/><circle class="i3" cx="48" cy="22" r="12"/><path class="sw" d="M42.5 22.5l3.8 3.8 7-7.3"/></svg>
            전략별 최적 상품 추천
          </h3>

          <div class="combination-content">
            <div v-for="(strategy, index) in analysisStore.result.combination_strategy.strategies" :key="index" class="combination-item" :class="{ best: isBestStrategy(strategy) }">
              <div class="combination-header">
                <span class="combination-name">{{ strategy.strategy_name }}</span>
                <span v-if="isBestStrategy(strategy)" class="best-badge">최적</span>
                <span v-if="strategy.achievable" class="achievable-badge">달성가능</span>
              </div>
              <p class="combination-desc">{{ strategy.description }}</p>
              
              <!-- 전략별 추천 상품 표시 -->
              <div class="strategy-products">
                <!-- 예금 상품 -->
                <div v-if="strategy.best_deposit_product" class="strategy-product deposit">
                  <div class="sp-badge">예금</div>
                  <div class="sp-info">
                    <span class="sp-bank">{{ strategy.best_deposit_product.bank }}</span>
                    <span class="sp-name">{{ strategy.best_deposit_product.name }}</span>
                  </div>
                  <div class="sp-rate">{{ strategy.best_deposit_product.rate }}%</div>
                </div>
                <!-- 적금 상품 -->
                <div v-if="strategy.best_saving_product" class="strategy-product saving">
                  <div class="sp-badge">적금</div>
                  <div class="sp-info">
                    <span class="sp-bank">{{ strategy.best_saving_product.bank }}</span>
                    <span class="sp-name">{{ strategy.best_saving_product.name }}</span>
                  </div>
                  <div class="sp-rate">{{ strategy.best_saving_product.rate }}%</div>
                </div>
              </div>

              <!-- 예상 금액 (만기 기준, 세전/세후) -->
              <div class="combination-stats">
                <div class="combo-stat">
                  <span class="combo-label">만기 시 총액 (세전)</span>
                  <span class="combo-value" :class="{ achievable: strategy.achievable }">{{ formatCurrency(strategy.total_amount) }}</span>
                </div>
                <div class="combo-stat">
                  <span class="combo-label">세전 이자</span>
                  <span class="combo-value highlight">+{{ formatCurrency(strategy.total_interest) }}</span>
                </div>
                <div class="combo-stat tax-info">
                  <span class="combo-label">세후 이자 (15.4%↓)</span>
                  <span class="combo-value">+{{ formatCurrency(Math.round(strategy.total_interest * 0.846)) }}</span>
                </div>
                <div v-if="strategy.shortfall > 0" class="combo-stat shortfall">
                  <span class="combo-label">부족분</span>
                  <span class="combo-value">-{{ formatCurrency(strategy.shortfall) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ★ 대안 플랜을 전략 카드 UI로 표시 (목표 달성 불가 시) ★ -->
        <div v-if="showAlternativesAsStrategies" class="combination-card alternatives-as-strategies">
          <h3 class="section-title">
            <svg class="duo" viewBox="0 0 64 64" aria-hidden="true"><ellipse class="i1" cx="32" cy="58" rx="14" ry="3.5"/><rect class="i3" x="29.5" y="6" width="5" height="52" rx="2.5"/><path class="i2" d="M34 12h20l6 7-6 7H34z"/><path class="i1" d="M30 30H10l-6 7 6 7h20z"/></svg>
            대안 전략별 최적 상품 추천
          </h3>
          <p class="alternatives-notice">
            현재 조건({{ analysisStore.result?.goal_math?.period_months }}개월)으로는 목표 달성이 어렵습니다. 다음 대안을 고려해보세요.
          </p>

          <div class="combination-content">
            <div v-for="(plan, index) in analysisStore.result.alternative_plans" :key="index" class="combination-item" :class="{ best: isBestAlternative(plan) }">
              <div class="combination-header">
                <span class="combination-name">{{ getAlternativeTypeLabel(plan.type) }}</span>
                <span v-if="isBestAlternative(plan)" class="best-badge">최적</span>
                <span v-if="plan.achievable" class="achievable-badge">달성가능</span>
              </div>
              <p class="combination-desc">{{ plan.description }}</p>
              
              <!-- 추천 상품 표시 -->
              <div v-if="plan.recommended_product" class="strategy-products">
                <div class="strategy-product" :class="plan.recommended_product.kind">
                  <div class="sp-badge">{{ plan.recommended_product.kind === 'saving' ? '적금' : '예금' }}</div>
                  <div class="sp-info">
                    <span class="sp-bank">{{ plan.recommended_product.bank }}</span>
                    <span class="sp-name">{{ plan.recommended_product.name }}</span>
                  </div>
                  <div class="sp-rate">{{ plan.recommended_product.rate }}%</div>
                  <div class="sp-term">{{ plan.recommended_product.save_trm }}개월</div>
                </div>
              </div>

              <!-- 예상 금액 -->
              <div class="combination-stats">
                <div v-if="plan.expected_total" class="combo-stat">
                  <span class="combo-label">만기 시 총액 (세전)</span>
                  <span class="combo-value achievable">{{ formatCurrency(plan.expected_total) }}</span>
                </div>
                <div v-if="plan.expected_interest" class="combo-stat">
                  <span class="combo-label">세전 이자</span>
                  <span class="combo-value highlight">+{{ formatCurrency(plan.expected_interest) }}</span>
                </div>
                <div v-if="plan.expected_interest" class="combo-stat tax-info">
                  <span class="combo-label">세후 이자 (15.4%↓)</span>
                  <span class="combo-value">+{{ formatCurrency(Math.round(plan.expected_interest * 0.846)) }}</span>
                </div>
                <div v-if="plan.new_period_months" class="combo-stat">
                  <span class="combo-label">필요 기간</span>
                  <span class="combo-value">{{ plan.new_period_months }}개월</span>
                </div>
                <div v-if="plan.new_monthly_amount" class="combo-stat">
                  <span class="combo-label">필요 월납입액</span>
                  <span class="combo-value">{{ formatCurrency(plan.new_monthly_amount) }}</span>
                </div>
                <div v-if="plan.achievable_target" class="combo-stat">
                  <span class="combo-label">달성 가능 목표</span>
                  <span class="combo-value">{{ formatCurrency(plan.achievable_target) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Recommendations -->
        <div class="products-section">
          <div class="results-header">
            <span class="results-title">추천 상품</span>
            <span class="results-count">{{ analysisStore.result?.items?.length || 0 }}개의 상품</span>
          </div>

          <div class="product-grid">
            <ProductCard
              v-for="item in analysisStore.result?.items"
              :key="item.option_id"
              :item="item"
            />
          </div>
        </div>

        <!-- Exchange Rate Info (여행 목적) - 이자 포함 금액 환산 -->
        <div v-if="analysisStore.result?.exchange_rate_info" class="exchange-card">
          <h3 class="section-title">
            <svg class="duo" viewBox="0 0 64 64" aria-hidden="true"><circle class="i1" cx="24" cy="26" r="20"/><circle class="i2" cx="40" cy="40" r="20"/><circle class="sw" cx="40" cy="40" r="11"/><circle class="i3" cx="40" cy="40" r="4"/></svg>
            환율 환산 정보
          </h3>

          <!-- 환율 데이터가 없는 경우 -->
          <div v-if="analysisStore.result.exchange_rate_info.error_message" class="exchange-error">
            <svg class="exchange-error-icon duo" viewBox="0 0 64 64" aria-hidden="true"><circle class="i1" cx="32" cy="32" r="26"/><rect class="iw" x="29" y="17" width="6" height="20" rx="3"/><circle class="iw" cx="32" cy="45" r="3.5"/></svg>
            <p class="exchange-error-message">{{ analysisStore.result.exchange_rate_info.error_message }}</p>
            <div class="exchange-box">
              <h4 class="exchange-box-title">예상 총 적립금 (원화)</h4>
              <div class="exchange-stat big">
                <span class="exchange-label">만기 시 예상 금액</span>
                <span class="exchange-value primary">{{ formatCurrency(analysisStore.result.exchange_rate_info.total_with_interest_krw) }}</span>
              </div>
              <p class="exchange-note">※ 환율 데이터가 없어 원화로 표시됩니다</p>
            </div>
          </div>
          
          <!-- 환율 데이터가 있는 경우 -->
          <div v-else class="exchange-grid">
            <!-- 기본 환율 정보 -->
            <div class="exchange-box">
              <h4 class="exchange-box-title">현재 환율</h4>
              <div class="exchange-stat">
                <span class="exchange-label">{{ analysisStore.result.exchange_rate_info.currency_name }}</span>
                <span class="exchange-value">1 {{ analysisStore.result.exchange_rate_info.currency_code }} = {{ analysisStore.result.exchange_rate_info.exchange_rate?.toLocaleString() }}원</span>
              </div>
              <div class="exchange-stat">
                <span class="exchange-label">조회 기준일</span>
                <span class="exchange-value small">{{ analysisStore.result.exchange_rate_info.updated_at }}</span>
              </div>
            </div>

            <!-- 이자 포함 환산 금액 -->
            <div class="exchange-box highlight">
              <h4 class="exchange-box-title">적금 완료 후 예상 환전 금액</h4>
              <div class="exchange-stat">
                <span class="exchange-label">추천 전략</span>
                <span class="exchange-value">{{ analysisStore.result.exchange_rate_info.strategy_name || '최적 조합' }}</span>
              </div>
              <div class="exchange-stat">
                <span class="exchange-label">예상 원금</span>
                <span class="exchange-value">{{ formatCurrency(analysisStore.result.exchange_rate_info.total_principal) }}</span>
              </div>
              <div class="exchange-stat">
                <span class="exchange-label">예상 이자</span>
                <span class="exchange-value">
                  + {{ formatCurrency(analysisStore.result.exchange_rate_info.total_interest) }}
                  <template v-if="analysisStore.result.exchange_rate_info.deposit_rate && analysisStore.result.exchange_rate_info.saving_rate">
                    <small class="exchange-rate-note">
                      (예금 {{ analysisStore.result.exchange_rate_info.deposit_rate }}% / 적금 {{ analysisStore.result.exchange_rate_info.saving_rate }}%)
                    </small>
                  </template>
                  <template v-else-if="analysisStore.result.exchange_rate_info.deposit_rate">
                    <small class="exchange-rate-note">
                      (예금 {{ analysisStore.result.exchange_rate_info.deposit_rate }}%)
                    </small>
                  </template>
                  <template v-else-if="analysisStore.result.exchange_rate_info.saving_rate">
                    <small class="exchange-rate-note">
                      (적금 {{ analysisStore.result.exchange_rate_info.saving_rate }}%)
                    </small>
                  </template>
                </span>
              </div>
              <div class="exchange-stat">
                <span class="exchange-label">예상 총 적립금 (원금 + 이자)</span>
                <span class="exchange-value">{{ formatCurrency(analysisStore.result.exchange_rate_info.total_with_interest_krw) }}</span>
              </div>
              <div class="exchange-stat big">
                <span class="exchange-label">현지 통화 환산 ({{ analysisStore.result.exchange_rate_info.currency_code }})</span>
                <span class="exchange-value primary">{{ analysisStore.result.exchange_rate_info.total_with_interest_foreign?.toLocaleString() }} {{ analysisStore.result.exchange_rate_info.currency_code }}</span>
              </div>
              <p class="exchange-note">※ 환율 변동에 따라 실제 금액은 달라질 수 있습니다</p>
            </div>
          </div>
        </div>

        <!-- 추천 여행지 (여행 목적일 때) -->
        <div v-if="analysisStore.result?.recommended_destinations?.length > 0" class="destinations-card">
          <h3 class="section-title">
            <svg class="duo" viewBox="0 0 64 64" aria-hidden="true"><ellipse class="i1" cx="32" cy="56" rx="18" ry="5"/><path class="i2" d="M32 4c-11 0-20 8.6-20 19.5C12 38 32 56 32 56s20-18 20-32.5C52 12.6 43 4 32 4z"/><circle class="i3" cx="32" cy="23" r="8"/></svg>
            AI 추천 여행지
          </h3>
          <p class="destinations-subtitle">유튜브 인기 여행 영상에서 추출한 추천 여행지입니다</p>
          <div class="destinations-grid">
            <div 
              v-for="(dest, index) in analysisStore.result.recommended_destinations" 
              :key="index" 
              class="destination-chip"
            >
              <svg class="destination-icon duo" viewBox="0 0 64 64" aria-hidden="true"><path class="i2" d="M32 4c-11 0-20 8.6-20 19.5C12 38 32 60 32 60s20-22 20-36.5C52 12.6 43 4 32 4z"/><circle class="iw" cx="32" cy="23" r="8"/></svg>
              {{ dest }}
            </div>
          </div>
        </div>

        <!-- Related News (접을 수 있는 섹션) -->
        <details v-if="analysisStore.result?.related_news?.length > 0" class="collapsible-card" open>
          <summary class="collapsible-header">
            <h3 class="section-title">
              <svg class="duo" viewBox="0 0 64 64" aria-hidden="true"><rect class="i1" x="42" y="18" width="18" height="40" rx="7"/><rect class="i2" x="4" y="8" width="46" height="50" rx="9"/><rect class="i3" x="11" y="16" width="16" height="14" rx="3"/><rect class="iw" x="31" y="17" width="12" height="4" rx="2"/><rect class="iw" x="31" y="25" width="10" height="4" rx="2"/><rect class="iw" x="11" y="37" width="32" height="4" rx="2"/><rect class="iw" x="11" y="45" width="22" height="4" rx="2"/></svg>
              관련 뉴스
            </h3>
            <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </summary>
          <div class="news-list">
            <a v-for="(news, index) in analysisStore.result.related_news.slice(0, 5)" :key="index" :href="news.link" target="_blank" class="news-item">
              <span class="news-title" v-html="news.title"></span>
              <span class="news-date">{{ formatDate(news.pubdate) }}</span>
            </a>
          </div>
        </details>

        <!-- Related Videos (접을 수 있는 섹션) -->
        <details v-if="analysisStore.result?.related_youtube?.length > 0" class="collapsible-card" open>
          <summary class="collapsible-header">
            <h3 class="section-title">
              <svg class="duo" viewBox="0 0 64 64" aria-hidden="true"><rect class="i1" x="10" y="6" width="44" height="10" rx="5"/><rect class="i2" x="4" y="14" width="56" height="42" rx="10"/><path class="i3" d="M26 25.5v19a2 2 0 0 0 3 1.7l15.5-9.5a2 2 0 0 0 0-3.4L29 23.8a2 2 0 0 0-3 1.7z"/></svg>
              관련 유튜브 영상
            </h3>
            <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </summary>
          <div class="videos-grid">
            <a v-for="(video, index) in analysisStore.result.related_youtube.slice(0, 4)" :key="index" :href="`https://youtube.com/watch?v=${video.videoId}`" target="_blank" class="video-item">
              <img :src="video.thumbnail" :alt="video.title" class="video-thumb" />
              <div class="video-info">
                <span class="video-title">{{ video.title }}</span>
                <span class="video-channel">{{ video.channelTitle }}</span>
              </div>
            </a>
          </div>
        </details>

        <!-- AI Verdict -->
        <div v-if="analysisStore.result?.ai_verdict" class="verdict-card">
          <h3 class="section-title">
            <svg class="duo" viewBox="0 0 64 64" aria-hidden="true"><path class="i1" d="M24 14h28a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8h-2v8l-10-8H24z"/><path class="i2" d="M12 6h28a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8H22l-10 8v-8a8 8 0 0 1-8-8V14a8 8 0 0 1 8-8z"/><path class="sw" d="M16 24.5l6 6L35 17.5"/></svg>
            AI 최종 판단
          </h3>
          <p class="verdict-text">{{ analysisStore.result.ai_verdict }}</p>
        </div>

        <!-- Back Button -->
        <div class="action-area">
          <button class="back-btn" @click="goBack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            다시 분석하기
          </button>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAnalysisStore } from '@/stores/analysis'
import ProductCard from '@/components/analysis/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const analysisStore = useAnalysisStore()
const token = localStorage.getItem('token')

onMounted(() => {
  analysisStore.fetchResult(route.params.id, token)
})

// 목표 달성 가능한 전략이 있는지 확인
const hasAchievableStrategy = computed(() => {
  const strategies = analysisStore.result?.combination_strategy?.strategies || []
  return strategies.some(s => s.achievable)
})

// 대안 플랜이 있고, 달성 가능한 전략이 없는 경우
const showAlternativesAsStrategies = computed(() => {
  const altPlans = analysisStore.result?.alternative_plans || []
  return !hasAchievableStrategy.value && altPlans.length > 0
})

const goBack = () => {
  analysisStore.resetResult()
  router.push('/analysis')
}

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '-'
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount)
}

const isBestStrategy = (strategy) => {
  const best = analysisStore.result?.combination_strategy?.best_strategy
  if (!best) return false
  return strategy.strategy_name === best.strategy_name
}

// 대안 플랜 중 최적 찾기 (예상 금액이 가장 높은 것)
const isBestAlternative = (plan) => {
  const plans = analysisStore.result?.alternative_plans || []
  if (plans.length === 0) return false
  const maxTotal = Math.max(...plans.filter(p => p.expected_total).map(p => p.expected_total))
  return plan.expected_total === maxTotal
}

const getAlternativeTypeLabel = (type) => {
  const labels = {
    'extend_period': '기간 연장',
    'increase_monthly': '월납입 증가',
    'reduce_target': '목표 조정',
    'combined': '복합 전략',
  }
  return labels[type] || type
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}
</script>

<style scoped>
.result-page {
  min-height: calc(100vh - 200px);
  background: var(--n-bg);
}

/* Main Content */
.main-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 36px 28px 64px;
}

/* Loading State */
.loading-state {
  display: flex;
  justify-content: center;
  padding: 64px 0;
}

.loading-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 52px 44px;
  background: var(--n-bg);
  border-radius: var(--n-radius-xl);
  border: 1px solid var(--n-border);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--n-border);
  border-top-color: var(--n-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 24px;
}

.loading-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--n-text);
  margin: 0 0 10px;
}

.loading-text {
  font-size: 16px;
  color: var(--n-text-muted);
}

/* Error State */
.error-state {
  display: flex;
  justify-content: center;
  padding: 64px 0;
}

.error-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 52px 44px;
  background: var(--n-bg);
  border-radius: var(--n-radius-xl);
  border: 1px solid var(--n-border);
  text-align: center;
}

.error-icon {
  width: 64px;
  height: 64px;
  background: var(--n-danger-bg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.error-icon svg {
  width: 32px;
  height: 32px;
  color: var(--n-danger-text);
}

.error-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--n-text);
  margin: 0 0 10px;
}

.error-text {
  font-size: 16px;
  color: var(--n-text-muted);
  margin-bottom: 24px;
}

.retry-btn {
  padding: 16px 28px;
  font-size: 16px;
  font-weight: 600;
  color: var(--n-on-accent);
  background: var(--n-accent);
  border: none;
  border-radius: var(--n-radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

/* Section Title */
.section-title {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 24px;
  font-weight: 700;
  color: var(--n-violet-hover);
  margin: 0 0 20px;
}

.section-title svg {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

/* 2톤 일러스트 아이콘 — AI 분석 화면의 목적 아이콘과 같은 팔레트 */
.duo .i1 { fill: var(--n-orchid); }
.duo .i2 { fill: var(--n-periwinkle); }
.duo .i3 { fill: var(--n-fg); }
.duo .i4 { fill: var(--n-violet); }
.duo .iw { fill: var(--n-on-accent); }
.duo .sw {
  fill: none;
  stroke: var(--n-on-accent);
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Summary Card — 아래 카드들과 같은 흰 면 + 그림자 */
.summary-card {
  display: flex;
  gap: 24px;
  padding: 28px;
  background: #f0eff7;
  border-radius: var(--n-radius-xl);
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.08);
  margin-bottom: 28px;
  position: relative;
}

.summary-icon {
  width: 56px;
  height: 56px;
  background: var(--n-lilac);
  border-radius: var(--n-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.summary-icon svg {
  width: 32px;
  height: 32px;
}

.summary-content {
  flex: 1;
}

.summary-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--n-violet-hover);
  margin: 14px 0;
}

.summary-text {
  font-size: 20px;
  color: var(--n-text-body);
  line-height: 1.6;
  margin: 30px auto;
  font-weight: 500;
}

/* Goal Card */
.goal-card {
  background: var(--n-bg);
  border-radius: var(--n-radius-xl);
  padding: 28px;
  margin-bottom: 28px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.08);
}

.goal-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.goal-stat {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  background: #f3f3f3;
  border-radius: var(--n-radius-md);
}

.goal-stat.success {
  background: #f3f3f3;
}

.goal-stat.warning {
  background: var(--n-warn-bg);
}

.stat-label {
  font-size: 16px;
  color: var(--n-text);
  font-weight: 500;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--n-text);
}

.goal-stat.success .stat-value {
  color: #323533;
}

.goal-stat.warning .stat-value {
  color: var(--n-warn-text);
}

/* Strategy Card */
.strategy-card {
  background: var(--n-bg);
  border-radius: var(--n-radius-xl);
  padding: 28px;
  margin-bottom: 28px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.08);
}

.strategy-text {
  font-size: 16px;
  color: var(--n-text-body);
  line-height: 1.7;
  margin: 0;
}

/* Combination Card */
.combination-card {
  background: var(--n-bg);
  border-radius: var(--n-radius-xl);
  padding: 28px;
  margin-bottom: 28px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.08);
}

/* 대안 전략 카드 스타일 */
.combination-card.alternatives-as-strategies {
  background: var(--n-accent-wash);
  border: 1px solid var(--n-accent);
}

.alternatives-notice {
  font-size: 16px;
  color: var(--n-accent);
  background: var(--n-accent-wash);
  padding: 16px 20px;
  border-radius: var(--n-radius-md);
  margin-bottom: 24px;
  border-left: 4px solid var(--n-accent);
}

/* 상품 기간 표시 */
.sp-term {
  font-size: 16px;
  color: var(--n-text-muted);
  background: var(--n-bg-sunken);
  padding: 8px 12px;
  border-radius: var(--n-radius-sm);
  margin-left: auto;
}

/* 추천 상품 요약 (예금 + 적금) */

.combination-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.combination-item {
  padding: 24px;
  border: 2px solid var(--n-border);
  border-radius: var(--n-radius-lg);
  transition: all 0.2s;
}

.combination-item.best {
  border-color: var(--n-accent);
  background: var(--n-accent-wash);
}

.combination-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.combination-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--n-text);
}

.best-badge {
  padding: 8px 14px;
  background: var(--n-accent);
  color: var(--n-on-accent);
  font-size: 16px;
  font-weight: 600;
  border-radius: var(--n-radius-xl);
}

.achievable-badge {
  padding: 8px 14px;
  background: var(--n-ok-bg);
  color: var(--n-ok-text);
  font-size: 16px;
  font-weight: 600;
  border-radius: var(--n-radius-xl);
}

.combination-desc {
  font-size: 16px;
  color: var(--n-text-muted);
  margin: 0 0 16px;
}

/* 전략별 추천 상품 */
.strategy-products {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.strategy-product {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  background: var(--n-bg);
  border-radius: var(--n-radius-md);
  border: 1px solid var(--n-border);
  flex: 1;
  min-width: 180px;
}

.sp-badge {
  padding: 7px 12px;
  border-radius: var(--n-radius-sm);
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}

.strategy-product.deposit .sp-badge {
  background: var(--n-info-bg);
  color: var(--n-info-text);
}

.strategy-product.saving .sp-badge {
  background: var(--n-ok-bg);
  color: var(--n-ok-text);
}

.sp-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sp-bank {
  font-size: 16px;
  color: var(--n-text-muted);
}

.sp-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--n-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sp-rate {
  font-size: 22px;
  font-weight: 800;
  color: var(--n-text-body);
  flex-shrink: 0;
}

.combination-stats {
  display: flex;
  gap: 28px;
  flex-wrap: wrap;
}

.combo-stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.combo-stat.shortfall {
  color: var(--n-danger-text);
}

.combo-label {
  font-size: 16px;
  color: var(--n-text-muted);
}

.combo-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--n-text);
}

.combo-value.highlight {
  color: var(--n-text);
}

.combo-value.achievable {
  color: var(--n-ok-text);
}

.combo-stat.shortfall .combo-value {
  color: var(--n-danger-text);
}

/* Products Section */
.products-section {
  margin-bottom: 28px;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 64px;
  margin-bottom: 30px;
}

.results-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--n-text);
  margin: 0;
}

.results-count {
  font-size: 16px;
  color: var(--n-text-muted);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

/* Exchange Card — 색은 현지 통화 환산 금액에만 쓴다 */
.exchange-card {
  background: var(--n-fill);
  border-radius: var(--n-radius-xl);
  padding: 28px;
  margin-bottom: 28px;
}

.exchange-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 20px;
}

.exchange-box {
  background: var(--n-surface);
  border-radius: var(--n-radius-lg);
  padding: 24px;
}

.exchange-box.highlight {
  border: 1px solid var(--n-lilac-strong);
}

.exchange-box-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--n-text);
  margin: 0 0 20px;
}

.exchange-stat {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.exchange-stat:last-child {
  margin-bottom: 0;
}

.exchange-stat.big {
  padding: 16px;
  background: var(--n-lilac);
  border-radius: var(--n-radius-md);
}

.exchange-label {
  font-size: 16px;
  color: var(--n-text-muted);
}

.exchange-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--n-text);
}

.exchange-value.small {
  font-size: 16px;
  font-weight: 600;
}

.exchange-value.primary {
  font-size: 26px;
  color: var(--n-violet);
}

.exchange-rate-note {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: var(--n-text-muted);
}

.exchange-note {
  font-size: 16px;
  color: var(--n-text-muted);
  margin: 12px 0 0;
}

/* Exchange Error Message */
.exchange-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px;
  text-align: center;
}

.exchange-error-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
}

.exchange-error-message {
  font-size: 18px;
  font-weight: 600;
  color: var(--n-danger-text);
  margin: 0 0 24px;
}

.exchange-error .exchange-box {
  width: 100%;
  max-width: 400px;
  margin-top: 12px;
}

/* Destinations Card */
.destinations-card {
  background: var(--n-accent-wash) 0%, var(--n-accent-wash) 100%;
  border-radius: var(--n-radius-xl);
  padding: 28px;
  margin-bottom: 28px;
}

.destinations-subtitle {
  font-size: 16px;
  color: var(--n-text);
  margin: -8px 0 20px;
}

.destinations-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.destination-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  background: var(--n-bg);
  border-radius: var(--n-radius-xl);
  font-size: 16px;
  font-weight: 600;
  color: var(--n-text);
  border: 1px solid var(--n-border);
}

.destination-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* Collapsible Card (접을 수 있는 섹션) */
.collapsible-card {
  background: var(--n-bg);
  border-radius: var(--n-radius-xl);
  padding: 0;
  margin-bottom: 28px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.collapsible-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px;
  cursor: pointer;
  user-select: none;
}

.collapsible-header::-webkit-details-marker {
  display: none;
}

.collapsible-header .section-title {
  margin: 0;
}

.collapsible-header .chevron {
  width: 20px;
  height: 20px;
  color: var(--n-text-muted);
  transition: transform 0.2s;
}

.collapsible-card[open] .collapsible-header .chevron {
  transform: rotate(180deg);
}

.collapsible-card .news-list,
.collapsible-card .videos-grid {
  padding: 0 28px 28px;
}

/* News List (collapsible 내부에서 사용) */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.news-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--n-bg-subtle);
  border-radius: var(--n-radius-md);
  text-decoration: none;
  transition: all 0.2s;
}

.news-item:hover {
  background: var(--n-accent-wash);
}

.news-title {
  font-size: 16px;
  color: var(--n-text);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.news-date {
  font-size: 16px;
  color: var(--n-text-muted);
  margin-left: 20px;
  flex-shrink: 0;
}

/* Videos Grid (collapsible 내부에서 사용) */
.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.video-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-decoration: none;
  transition: all 0.2s;
}

.video-item:hover {
  transform: translateY(-2px);
}

.video-thumb {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: var(--n-radius-md);
}

.video-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.video-title {
  font-size: 16px;
  color: var(--n-text);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-channel {
  font-size: 16px;
  color: var(--n-text-muted);
}

/* Verdict Card */
.verdict-card {
  background: #f0eff7;
  border-radius: var(--n-radius-xl);
  padding: 28px;
  margin: 88px auto;
}

.verdict-text {
  font-size: 20px;
  color: var(--n-text);
  line-height: 1.7;
  margin: 0;
  font-weight: 500;
}

/* Action Area */
.action-area {
  display: flex;
  justify-content: center;
  margin-top: 44px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 18px 32px;
  font-size: 16px;
  font-weight: 600;
  color: var(--n-accent);
  background: var(--n-bg);
  border: 2px solid var(--n-border);
  border-radius: var(--n-radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn svg {
  width: 20px;
  height: 20px;
}

.back-btn:hover {
  border-color: var(--n-accent);
  background: var(--n-accent-wash);
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    padding: 28px 20px 44px;
  }

  .summary-card {
    flex-direction: column;
    gap: 20px;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }

  .goal-stats {
    grid-template-columns: 1fr;
  }

  .combination-stats {
    flex-direction: column;
    gap: 16px;
  }
}</style>
