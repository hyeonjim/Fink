<template>
  <div class="result-page">
    <!-- Page Header -->
    <header class="n-page-header">
      <div class="n-page-header-content">
        <div class="n-page-header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <div class="n-page-header-text">
          <h1 class="n-page-title">추천 결과</h1>
          <p class="n-page-subtitle">AI가 분석한 맞춤 금융상품입니다</p>
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div class="summary-content">
            <h3 class="summary-title">AI 분석 요약</h3>
            <p class="summary-text">{{ analysisStore.result.summary }}</p>
          </div>
        </div>

        <!-- Goal Math Card -->
        <div v-if="analysisStore.result?.goal_math" class="goal-card">
          <h3 class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
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
              <span class="stat-value">{{ analysisStore.result.goal_math.shortfall_amount > 0 ? formatCurrency(analysisStore.result.goal_math.shortfall_amount) : '없음 ✅' }}</span>
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            추천 전략
          </h3>
          <p class="strategy-text">{{ analysisStore.result.strategy }}</p>
        </div>

        <!-- Combination Strategy (예금+적금 조합) - 달성 가능한 전략이 있을 때만 표시 -->
        <div v-if="hasAchievableStrategy && analysisStore.result?.combination_strategy && Object.keys(analysisStore.result.combination_strategy).length > 0" class="combination-card">
          <h3 class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M2 10h20"/>
            </svg>
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            대안 전략별 최적 상품 추천
          </h3>
          <p class="alternatives-notice">
            ⚠️ 현재 조건({{ analysisStore.result?.goal_math?.period_months }}개월)으로는 목표 달성이 어렵습니다. 다음 대안을 고려해보세요.
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
            <h3 class="results-title">추천 상품</h3>
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
            💱 환율 환산 정보
          </h3>
          
          <!-- 환율 데이터가 없는 경우 -->
          <div v-if="analysisStore.result.exchange_rate_info.error_message" class="exchange-error">
            <div class="exchange-error-icon">⚠️</div>
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
              <h4 class="exchange-box-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                적금 완료 후 예상 환전 금액
              </h4>
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
                <span class="exchange-value highlight-text">
                  + {{ formatCurrency(analysisStore.result.exchange_rate_info.total_interest) }}
                  <template v-if="analysisStore.result.exchange_rate_info.deposit_rate && analysisStore.result.exchange_rate_info.saving_rate">
                    <br>
                    <small style="font-size: 0.85em; opacity: 0.8;">
                      (예금 {{ analysisStore.result.exchange_rate_info.deposit_rate }}% / 적금 {{ analysisStore.result.exchange_rate_info.saving_rate }}%)
                    </small>
                  </template>
                  <template v-else-if="analysisStore.result.exchange_rate_info.deposit_rate">
                    <br>
                    <small style="font-size: 0.85em; opacity: 0.8;">
                      (예금 {{ analysisStore.result.exchange_rate_info.deposit_rate }}%)
                    </small>
                  </template>
                  <template v-else-if="analysisStore.result.exchange_rate_info.saving_rate">
                    <br>
                    <small style="font-size: 0.85em; opacity: 0.8;">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            🗺️ AI 추천 여행지
          </h3>
          <p class="destinations-subtitle">유튜브 인기 여행 영상에서 추출한 추천 여행지입니다</p>
          <div class="destinations-grid">
            <div 
              v-for="(dest, index) in analysisStore.result.recommended_destinations" 
              :key="index" 
              class="destination-chip"
            >
              <span class="destination-icon">📍</span>
              {{ dest }}
            </div>
          </div>
        </div>

        <!-- Related News (접을 수 있는 섹션) -->
        <details v-if="analysisStore.result?.related_news?.length > 0" class="collapsible-card" open>
          <summary class="collapsible-header">
            <h3 class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              📰 관련 뉴스
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2"/>
              </svg>
              🎬 관련 유튜브 영상
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            🤖 AI 최종 판단
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
    'extend_period': '📅 기간 연장',
    'increase_monthly': '💰 월납입 증가',
    'reduce_target': '🎯 목표 조정',
    'combined': '🔄 복합 전략',
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
  padding: 32px 24px 60px;
}

/* Loading State */
.loading-state {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.loading-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 40px;
  background: var(--n-bg);
  border-radius: 20px;
  border: 1px solid var(--n-border);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--n-border);
  border-top-color: var(--n-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--n-text);
  margin: 0 0 6px;
}

.loading-text {
  font-size: 0.875rem;
  color: var(--n-text-muted);
}

/* Error State */
.error-state {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.error-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 40px;
  background: var(--n-bg);
  border-radius: 20px;
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
  margin-bottom: 20px;
}

.error-icon svg {
  width: 32px;
  height: 32px;
  color: var(--n-danger-text);
}

.error-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--n-text);
  margin: 0 0 6px;
}

.error-text {
  font-size: 0.875rem;
  color: var(--n-text-muted);
  margin-bottom: 20px;
}

.retry-btn {
  padding: 12px 24px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background: var(--n-accent);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  box-shadow: none;
}

/* Section Title */
.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--n-text);
  margin: 0 0 16px;
}

.section-title svg {
  width: 22px;
  height: 22px;
  color: var(--n-accent);
}

/* Summary Card */
.summary-card {
  display: flex;
  gap: 20px;
  padding: 24px;
  background: var(--n-accent-wash) 0%, var(--n-accent-wash) 100%;
  border-radius: 20px;
  margin-bottom: 24px;
  margin-top: -40px;
  position: relative;
}

.summary-icon {
  width: 48px;
  height: 48px;
  background: var(--n-bg);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.summary-icon svg {
  width: 24px;
  height: 24px;
  color: var(--n-accent);
}

.summary-content {
  flex: 1;
}

.summary-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--n-accent);
  margin: 0 0 8px;
}

.summary-text {
  font-size: 0.9375rem;
  color: #581c87;
  line-height: 1.6;
  margin: 0;
}

/* Goal Card */
.goal-card {
  background: var(--n-bg);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.goal-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.goal-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  background: var(--n-bg-subtle);
  border-radius: 12px;
}

.goal-stat.success {
  background: var(--n-ok-bg);
}

.goal-stat.warning {
  background: var(--n-warn-bg);
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--n-text-muted);
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--n-text);
}

.goal-stat.success .stat-value {
  color: #22c55e;
}

.goal-stat.warning .stat-value {
  color: var(--n-warn-text);
}

/* Strategy Card */
.strategy-card {
  background: var(--n-bg);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.strategy-text {
  font-size: 0.9375rem;
  color: var(--n-text-body);
  line-height: 1.7;
  margin: 0;
}

/* Combination Card */
.combination-card {
  background: var(--n-bg);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

/* 대안 전략 카드 스타일 */
.combination-card.alternatives-as-strategies {
  background: var(--n-accent-wash);
  border: 1px solid var(--n-accent);
}

.alternatives-notice {
  font-size: 0.875rem;
  color: var(--n-accent);
  background: var(--n-accent-wash);
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  border-left: 4px solid var(--n-accent);
}

/* 상품 기간 표시 */
.sp-term {
  font-size: 0.75rem;
  color: var(--n-text-muted);
  background: var(--n-bg-sunken);
  padding: 4px 8px;
  border-radius: 6px;
  margin-left: auto;
}

/* 추천 상품 요약 (예금 + 적금) */
.recommended-products-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--n-accent-wash) 0%, var(--n-accent-wash) 100%;
  border-radius: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.recommended-product {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--n-bg);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  flex: 1;
  min-width: 200px;
  max-width: 300px;
}

.recommended-product.deposit {
  border-left: 4px solid var(--n-info-text);
}

.recommended-product.saving {
  border-left: 4px solid var(--n-ok-text);
}

.rp-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.recommended-product.deposit .rp-badge {
  background: var(--n-info-bg);
  color: var(--n-info-text);
}

.recommended-product.saving .rp-badge {
  background: var(--n-ok-bg);
  color: var(--n-ok-text);
}

.rp-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rp-bank {
  font-size: 0.6875rem;
  color: var(--n-text-muted);
}

.rp-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--n-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rp-rate {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.rp-rate-value {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--n-accent);
}

.rp-rate-label {
  font-size: 0.625rem;
  color: var(--n-text-muted);
}

.rp-plus {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--n-accent);
  flex-shrink: 0;
}

.combination-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.combination-item {
  padding: 20px;
  border: 2px solid var(--n-border);
  border-radius: 16px;
  transition: all 0.2s;
}

.combination-item.best {
  border-color: var(--n-accent);
  background: var(--n-accent-wash);
}

.combination-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.combination-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--n-text);
}

.best-badge {
  padding: 4px 10px;
  background: var(--n-accent);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 20px;
}

.achievable-badge {
  padding: 4px 10px;
  background: var(--n-ok-bg);
  color: var(--n-ok-text);
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 20px;
}

.combination-desc {
  font-size: 0.875rem;
  color: var(--n-text-muted);
  margin: 0 0 12px;
}

/* 전략별 추천 상품 */
.strategy-products {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.strategy-product {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--n-bg);
  border-radius: 10px;
  border: 1px solid var(--n-border);
  flex: 1;
  min-width: 180px;
}

.sp-badge {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.6875rem;
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
  gap: 1px;
}

.sp-bank {
  font-size: 0.625rem;
  color: var(--n-text-muted);
}

.sp-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--n-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sp-rate {
  font-size: 1rem;
  font-weight: 800;
  color: var(--n-accent);
  flex-shrink: 0;
}

.combination-stats {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.combo-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.combo-stat.shortfall {
  color: var(--n-danger-text);
}

.combo-label {
  font-size: 0.75rem;
  color: var(--n-text-muted);
}

.combo-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--n-text);
}

.combo-value.highlight {
  color: var(--n-accent);
}

.combo-value.achievable {
  color: var(--n-ok-text);
}

.combo-stat.shortfall .combo-value {
  color: var(--n-danger-text);
}

/* Alternatives Card */
.alternatives-card {
  background: var(--n-bg);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.alternatives-subtitle {
  font-size: 0.875rem;
  color: var(--n-text-muted);
  margin: -8px 0 16px;
}

.alternatives-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.alternative-item {
  padding: 20px;
  background: var(--n-bg-subtle);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.2s;
}

.alternative-item.has-product {
  background: var(--n-accent-wash);
  border: 1px solid #e9e4f5;
}

.alternative-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.alt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.alt-type {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  background: var(--n-bg);
}

.alt-type.extend_period { 
  color: var(--n-info-text); 
  background: var(--n-info-bg);
}
.alt-type.extend_period::before { content: '📅'; }

.alt-type.increase_monthly { 
  color: var(--n-warn-text);
  background: var(--n-warn-bg);
}
.alt-type.increase_monthly::before { content: '💰'; }

.alt-type.reduce_target { 
  color: var(--n-ok-text);
  background: #ecfdf5;
}
.alt-type.reduce_target::before { content: '🎯'; }

.alt-type.combined { 
  color: var(--n-accent);
  background: var(--n-accent-wash);
}
.alt-type.combined::before { content: '🔄'; }

.alt-desc {
  font-size: 0.9375rem;
  color: var(--n-text-body);
  margin: 0;
  line-height: 1.5;
}

.alt-achievable {
  font-size: 0.75rem;
  color: #22c55e;
  font-weight: 600;
  padding: 2px 8px;
  background: var(--n-ok-bg);
  border-radius: 10px;
}

/* 예상 금액 정보 */
.alt-expected {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  background: var(--n-bg);
  border-radius: 8px;
  border: 1px solid var(--n-border);
}

.alt-expected-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alt-expected-label {
  font-size: 0.75rem;
  color: var(--n-text-muted);
}

.alt-expected-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--n-text);
}

.alt-expected-row.interest .alt-expected-value {
  color: #22c55e;
}

/* 추천 상품 정보 */
.alt-product {
  padding: 12px;
  background: var(--n-bg);
  border-radius: 10px;
  border: 1px solid var(--n-border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alt-product-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.alt-product-badge {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.alt-product-badge.saving {
  background: var(--n-ok-bg);
  color: var(--n-ok-text);
}

.alt-product-badge.deposit {
  background: var(--n-info-bg);
  color: var(--n-info-text);
}

.alt-product-term {
  font-size: 0.75rem;
  color: var(--n-text-muted);
  background: var(--n-bg-sunken);
  padding: 2px 6px;
  border-radius: 4px;
}

.alt-product-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.alt-product-bank {
  font-size: 0.6875rem;
  color: var(--n-text-muted);
}

.alt-product-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--n-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.alt-product-rate {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px dashed var(--n-border);
}

.alt-product-rate .rate-label {
  font-size: 0.6875rem;
  color: var(--n-text-muted);
}

.alt-product-rate .rate-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--n-accent);
}

/* Products Section */
.products-section {
  margin-bottom: 24px;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.results-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--n-text);
  margin: 0;
}

.results-count {
  font-size: 0.875rem;
  color: var(--n-text-muted);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* Exchange Card */
.exchange-card {
  background: #f2f2f8;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
}

.exchange-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.exchange-box {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 20px;
}

.exchange-box.highlight {
  background: var(--n-bg);
  border: 2px solid var(--n-info-text);
}

.exchange-box-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--n-info-text);
  margin: 0 0 16px;
}

.exchange-box-title svg {
  width: 18px;
  height: 18px;
}

.exchange-content {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.exchange-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.exchange-stat:last-child {
  margin-bottom: 0;
}

.exchange-stat.big {
  padding: 12px;
  background: var(--n-info-bg);
  border-radius: 10px;
}

.exchange-stat.highlight {
  padding: 12px 20px;
  background: var(--n-bg);
  border-radius: 12px;
}

.exchange-label {
  font-size: 0.8125rem;
  color: var(--n-info-text);
}

.exchange-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e3a8a;
}

.exchange-value.small {
  font-size: 0.9375rem;
  font-weight: 600;
}

.exchange-value.highlight-text {
  color: var(--n-ok-text);
}

.exchange-value.primary {
  font-size: 1.5rem;
  color: var(--n-info-text);
}

.exchange-note {
  font-size: 0.75rem;
  color: #64748b;
  margin: 8px 0 0;
}

/* Exchange Error Message */
.exchange-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  text-align: center;
}

.exchange-error-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.exchange-error-message {
  font-size: 1rem;
  font-weight: 600;
  color: var(--n-danger-text);
  margin: 0 0 20px;
}

.exchange-error .exchange-box {
  width: 100%;
  max-width: 400px;
  margin-top: 8px;
}

/* Destinations Card */
.destinations-card {
  background: var(--n-accent-wash) 0%, var(--n-accent-wash) 100%;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
}

.destinations-subtitle {
  font-size: 0.875rem;
  color: var(--n-accent);
  margin: -8px 0 16px;
}

.destinations-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.destination-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: var(--n-bg);
  border-radius: 20px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--n-accent);
  border: 1px solid var(--n-border);
}

.destination-icon {
  font-size: 1rem;
}

/* Collapsible Card (접을 수 있는 섹션) */
.collapsible-card {
  background: var(--n-bg);
  border-radius: 20px;
  padding: 0;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.collapsible-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
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
  padding: 0 24px 24px;
}

/* News List (collapsible 내부에서 사용) */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--n-bg-subtle);
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s;
}

.news-item:hover {
  background: var(--n-accent-wash);
}

.news-title {
  font-size: 0.9375rem;
  color: var(--n-text);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.news-date {
  font-size: 0.75rem;
  color: var(--n-text-muted);
  margin-left: 16px;
  flex-shrink: 0;
}

/* Videos Grid (collapsible 내부에서 사용) */
.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.video-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  border-radius: 10px;
}

.video-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.video-title {
  font-size: 0.8125rem;
  color: var(--n-text);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-channel {
  font-size: 0.75rem;
  color: var(--n-text-muted);
}

/* Verdict Card */
.verdict-card {
  background: var(--n-warn-bg);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
}

.verdict-text {
  font-size: 0.9375rem;
  color: var(--n-warn-text);
  line-height: 1.7;
  margin: 0;
}

/* Action Area */
.action-area {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--n-accent);
  background: var(--n-bg);
  border: 2px solid var(--n-border);
  border-radius: 14px;
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
    padding: 24px 16px 40px;
  }

  .summary-card {
    flex-direction: column;
    gap: 16px;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }

  .goal-stats {
    grid-template-columns: 1fr;
  }

  .exchange-content {
    flex-direction: column;
    gap: 16px;
  }

  .combination-stats {
    flex-direction: column;
    gap: 12px;
  }
}</style>
