<template>
  <div class="stock-page">
    <!-- Page Header -->
    <header class="n-page-header">
      <div class="n-page-header-content">
        <div class="n-page-header-icon">
          <svg viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="38" width="11" height="18" rx="3.5" fill="#bb8ec7"/><rect x="26.5" y="28" width="11" height="28" rx="3.5" fill="#9588df"/><rect x="45" y="20" width="11" height="36" rx="3.5" fill="#bb8ec7"/><path d="M8 30 22 19l10 7L52 8" stroke="#1d1a2b" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M43 8h9v9" stroke="#1d1a2b" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="n-page-header-text">
          <h1 class="n-page-title">주식</h1>
          <p class="n-page-subtitle">관심 종목의 시세와 추이를 확인하세요</p>
        </div>
      </div>
    </header>

    <main class="stock-container">
      <div class="stock-layout">
        <!-- Left Sidebar - Stock List -->
        <aside class="stock-sidebar">

      <!-- Search Box -->
      <div class="sidebar-search">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="종목명, 심볼 검색"
            @input="handleSearch"
            @focus="showSearchResults = true"
          />
        </div>
        <!-- Search Results Dropdown -->
        <div v-if="showSearchResults && searchResults.length > 0" class="search-dropdown">
          <div 
            v-for="result in searchResults" 
            :key="result.symbol"
            class="search-result"
            @click="selectStock(result.symbol)"
          >
            <span class="result-symbol">{{ result.symbol }}</span>
            <span class="result-name">{{ result.name }}</span>
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button 
          :class="['filter-tab', { active: store.selectedMarket === 'BOOKMARK' }]"
          @click="store.setMarket('BOOKMARK')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
          </svg>
          북마크
        </button>
        <button 
          :class="['filter-tab', { active: store.selectedMarket === 'KR' }]"
          @click="store.setMarket('KR')"
        >
          국내
        </button>
        <button 
          :class="['filter-tab', { active: store.selectedMarket === 'US' }]"
          @click="store.setMarket('US')"
        >
          해외
        </button>
      </div>

      <!-- Refresh Bar -->
      <div class="refresh-bar">
        <span class="update-info">
          <template v-if="store.selectedMarket === 'BOOKMARK'">
            {{ store.bookmarkRefreshTime ? formatLastUpdated(store.bookmarkRefreshTime) : '갱신하여 최신 가격 확인' }}
          </template>
          <template v-else>
            {{ formatLastUpdated(store.updateStatus[store.selectedMarket]?.last_updated) }}
          </template>
        </span>
        <button 
          class="refresh-btn"
          :disabled="store.refreshLoading || store.bookmarkRefreshLoading"
          @click="store.selectedMarket === 'BOOKMARK' ? handleBookmarkRefresh() : handleRefresh()"
        >
          <svg v-if="store.refreshLoading || store.bookmarkRefreshLoading" class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          {{ (store.refreshLoading || store.bookmarkRefreshLoading) ? '갱신 중...' : '갱신' }}
        </button>
      </div>

      <!-- Stock List -->
      <div class="stock-list">
        <div v-if="store.listLoading" class="list-loading">
          <div class="spinner"></div>
        </div>

        <div 
          v-else
          v-for="(stock, index) in store.filteredStocks"
          :key="stock.symbol"
          :class="['stock-item', { active: selectedSymbol === stock.symbol }]"
          @click="selectStock(stock.symbol)"
        >
          <div class="stock-rank">{{ (store.currentPage - 1) * store.perPage + index + 1 }}</div>
          <div class="stock-info">
            <span class="stock-name">{{ stock.name }}</span>
            <span class="stock-symbol">{{ stock.code || stock.symbol.replace('.KS', '').replace('.KQ', '') }}</span>
          </div>
          <div class="stock-price-info">
            <span class="stock-price">{{ formatListPrice(stock.current_price, stock.market) }}</span>
            <span :class="['stock-change', getChangeClass(stock.change_percent)]">
              {{ formatChangePercent(stock.change_percent) }}
            </span>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="store.totalPages > 1" class="pagination">
          <button 
            :disabled="store.currentPage <= 1"
            class="page-btn"
            @click="changePage(store.currentPage - 1)"
          >
            ‹
          </button>
          <span class="page-info">{{ store.currentPage }} / {{ store.totalPages }}</span>
          <button 
            :disabled="store.currentPage >= store.totalPages"
            class="page-btn"
            @click="changePage(store.currentPage + 1)"
          >
            ›
          </button>
        </div>
      </div>
    </aside>

        <!-- Main Content -->
        <section class="stock-main">
      <!-- No Stock Selected -->
      <div v-if="!store.hasSelectedStock && !store.loading" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
            <polyline points="16 7 22 7 22 13"/>
          </svg>
        </div>
        <h2>종목을 선택해주세요</h2>
        <p>왼쪽 목록에서 종목을 선택하면<br/>상세 정보를 확인할 수 있어요</p>
      </div>

      <!-- Stock Detail -->
      <div v-else-if="store.hasSelectedStock" class="stock-detail">
        <!-- Header -->
        <header class="detail-header">
          <div class="header-left">
            <div class="header-title-row">
              <h1 class="detail-name">{{ store.selectedStock.name }}</h1>
              <!-- 북마크 버튼 -->
              <button 
                v-if="isLoggedIn"
                class="bookmark-btn"
                :class="{ active: isCurrentStockBookmarked }"
                :disabled="bookmarkLoading"
                @click="toggleBookmark"
              >
                <svg v-if="bookmarkLoading" class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32"/>
                </svg>
                <svg v-else-if="isCurrentStockBookmarked" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              </button>
            </div>
            <div class="detail-meta">
              <span class="detail-symbol">{{ store.selectedStock.symbol }}</span>
              <span v-if="store.selectedStock.exchange" class="detail-exchange">{{ store.selectedStock.exchange }}</span>
            </div>
          </div>
          <div class="header-right">
            <div class="detail-price">{{ formatDetailPrice(store.selectedStock.current_price, store.selectedStock.currency) }}</div>
            <div :class="['detail-change', getChangeClass(store.selectedStock.change)]">
              {{ formatChange(store.selectedStock.change) }}
              ({{ formatChangePercent(store.selectedStock.change_percent) }})
            </div>
          </div>
        </header>

        <!-- Chart Section -->
        <section class="chart-section">
          <div class="chart-tabs">
            <button 
              v-for="period in periods" 
              :key="period.value"
              :class="['chart-tab', { active: store.chartPeriod === period.value }]"
              @click="changePeriod(period.value)"
            >
              {{ period.label }}
            </button>
          </div>

          <div v-if="store.chartLoading" class="chart-loading">
            <div class="spinner"></div>
          </div>
          
          <div v-else-if="store.hasChartData" class="chart-container">
            <StockChart :data="store.chartData.data" :currency="store.selectedStock.currency" />
          </div>

          <div v-else class="chart-empty">
            차트 데이터가 없습니다
          </div>
        </section>

        <!-- Stats Grid -->
        <section class="stats-section">
          <h3 class="section-title">종목 정보</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-label">시가</span>
              <span class="stat-value">{{ formatDetailPrice(store.selectedStock.open_price, store.selectedStock.currency) }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">고가</span>
              <span class="stat-value up">{{ formatDetailPrice(store.selectedStock.day_high, store.selectedStock.currency) }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">저가</span>
              <span class="stat-value down">{{ formatDetailPrice(store.selectedStock.day_low, store.selectedStock.currency) }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">전일 종가</span>
              <span class="stat-value">{{ formatDetailPrice(store.selectedStock.previous_close, store.selectedStock.currency) }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">거래량</span>
              <span class="stat-value">{{ formatVolume(store.selectedStock.volume) }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">시가총액</span>
              <span class="stat-value">{{ formatMarketCap(store.selectedStock.market_cap) }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">52주 최고</span>
              <span class="stat-value up">{{ formatDetailPrice(store.selectedStock.fifty_two_week_high, store.selectedStock.currency) }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">52주 최저</span>
              <span class="stat-value down">{{ formatDetailPrice(store.selectedStock.fifty_two_week_low, store.selectedStock.currency) }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">PER</span>
              <span class="stat-value">{{ store.selectedStock.pe_ratio?.toFixed(2) || '-' }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">EPS</span>
              <span class="stat-value">{{ store.selectedStock.eps?.toFixed(2) || '-' }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">배당수익률</span>
              <span class="stat-value">{{ store.selectedStock.dividend_yield ? (store.selectedStock.dividend_yield * 100).toFixed(2) + '%' : '-' }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">베타</span>
              <span class="stat-value">{{ store.selectedStock.beta?.toFixed(2) || '-' }}</span>
            </div>
          </div>
        </section>

        <!-- Company Info -->
        <section v-if="store.selectedStock.description" class="info-section">
          <div class="section-header">
            <h3 class="section-title">기업 소개</h3>
            <button 
              v-if="!store.translatedDescription && !store.translating"
              class="translate-btn"
              @click="handleTranslate"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 8l4 4-4 4"/>
                <path d="M12 4h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7"/>
                <path d="M3 12h12"/>
              </svg>
              한글로 번역
            </button>
            <span v-if="store.translating" class="translating-text">
              <div class="spinner small"></div>
              번역 중...
            </span>
          </div>
          <p class="company-desc">{{ store.translatedDescription || store.selectedStock.description }}</p>
          <div class="company-meta">
            <span v-if="store.selectedStock.sector" class="meta-tag">{{ store.selectedStock.sector }}</span>
            <span v-if="store.selectedStock.industry" class="meta-tag">{{ store.selectedStock.industry }}</span>
          </div>
        </section>

        <!-- News -->
        <section class="news-section">
          <h3 class="section-title">관련 뉴스</h3>
          <div v-if="store.stockNews.length > 0" class="news-list">
            <a 
              v-for="(news, idx) in store.stockNews" 
              :key="idx"
              :href="news.link"
              target="_blank"
              class="news-item"
            >
              <div class="news-content">
                <span class="news-title">{{ news.title }}</span>
                <span v-if="news.description" class="news-desc">{{ news.description }}</span>
              </div>
              <div class="news-meta">
                <span v-if="news.publisher" class="news-publisher">{{ news.publisher }}</span>
                <span v-if="news.published_date" class="news-date">{{ formatNewsDate(news.published_date) }}</span>
              </div>
            </a>
          </div>
          <div v-else class="news-empty">
            관련 뉴스가 없습니다
          </div>
        </section>
      </div>

      <!-- Loading -->
      <div v-else class="loading-state">
        <div class="spinner large"></div>
      </div>
    </section>

    <!-- Right Sidebar - Market Info -->
    <aside class="market-sidebar">
      <h3 class="sidebar-title">주요 지표</h3>
      
      <!-- Market Indices -->
      <div class="market-section">
        <div v-if="store.indicesLoading" class="market-loading">
          <div class="spinner small"></div>
        </div>
        <div v-else-if="store.marketIndices.length > 0" class="indices-list">
          <div 
            v-for="index in store.marketIndices" 
            :key="index.symbol"
            class="index-card"
          >
            <div class="index-header">
              <span class="index-name">{{ index.name }}</span>
              <span :class="['index-change', getChangeClass(index.change)]">
                {{ formatChangePercent(index.change_percent) }}
              </span>
            </div>
            <div class="index-price">{{ formatIndexPrice(index.current_price, index.name) }}</div>
            <!-- Mini Chart -->
            <div v-if="index.chart_data?.length > 0" class="mini-chart">
              <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                <polyline
                  :points="getMiniChartPoints(index.chart_data)"
                  fill="none"
                  :stroke="index.change >= 0 ? '#d6364a' : '#3b5ba5'"
                  stroke-width="1.5"
                />
              </svg>
            </div>
          </div>
        </div>
        <div v-else class="market-empty">
          데이터를 불러오는 중...
        </div>
      </div>
    </aside>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStocksStore } from '@/stores/stocks'
import { useAccountStore } from '@/stores/accounts'
import StockChart from '@/components/stocks/StockChart.vue'

const store = useStocksStore()
const accountStore = useAccountStore()

const searchQuery = ref('')
const showSearchResults = ref(false)
const searchTimeout = ref(null)
const selectedSymbol = ref(null)
const bookmarkLoading = ref(false)
const isCurrentStockBookmarked = ref(false)

const searchResults = computed(() => store.searchResults)
const isLoggedIn = computed(() => !!accountStore.token)

const periods = [
  { label: '1일', value: '1d' },
  { label: '1주', value: '5d' },
  { label: '1개월', value: '1mo' },
  { label: '3개월', value: '3mo' },
  { label: '1년', value: '1y' },
]

onMounted(async () => {
  // 갱신 상태 조회
  await store.fetchUpdateStatus()
  
  // 현재 마켓에 따라 데이터 로드 (페이지네이션 정보 포함)
  if (store.selectedMarket === 'KR') {
    await store.fetchKrStocks(1, store.perPage)
  } else if (store.selectedMarket === 'US') {
    await store.fetchUsStocks(1, store.perPage)
  } else if (store.selectedMarket === 'BOOKMARK') {
    await store.fetchBookmarkedStocks()
  }
  
  store.fetchMarketIndices()  // 주요 지표 로드
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 종목 변경 시 번역 초기화 및 북마크 상태 확인
watch(() => store.selectedStock?.symbol, async (newSymbol) => {
  store.translatedDescription = null
  if (newSymbol && isLoggedIn.value) {
    isCurrentStockBookmarked.value = await store.checkBookmark(newSymbol)
  } else {
    isCurrentStockBookmarked.value = false
  }
})

const handleSearch = () => {
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    if (searchQuery.value.trim()) {
      store.searchStocks(searchQuery.value)
      showSearchResults.value = true
    } else {
      store.clearSearchResults()
      showSearchResults.value = false
    }
  }, 300)
}

const selectStock = (symbol) => {
  selectedSymbol.value = symbol
  store.fetchStockDetail(symbol)
  showSearchResults.value = false
  searchQuery.value = ''
  store.clearSearchResults()
}

const changePeriod = (period) => {
  store.setChartPeriod(period)
}

const handleClickOutside = (e) => {
  if (!e.target.closest('.sidebar-search')) {
    showSearchResults.value = false
  }
}

const handleTranslate = () => {
  if (store.selectedStock?.description) {
    store.translateDescription(store.selectedStock.description)
  }
}

const changePage = (page) => {
  store.changePage(page)
}

// 북마크 토글 핸들러
const toggleBookmark = async () => {
  if (!store.selectedStock || bookmarkLoading.value) return
  
  bookmarkLoading.value = true
  try {
    if (isCurrentStockBookmarked.value) {
      const success = await store.removeBookmark(store.selectedStock.symbol)
      if (success) {
        isCurrentStockBookmarked.value = false
      }
    } else {
      const success = await store.addBookmark(
        store.selectedStock.symbol,
        store.selectedStock.name
      )
      if (success) {
        isCurrentStockBookmarked.value = true
      }
    }
  } finally {
    bookmarkLoading.value = false
  }
}

// 데이터 갱신 핸들러
const handleRefresh = async () => {
  const result = await store.refreshStocks(store.selectedMarket)
  if (result.success) {
    alert(result.message)
  } else {
    alert(result.message)
  }
}

// 북마크 갱신 핸들러
const handleBookmarkRefresh = async () => {
  const result = await store.refreshBookmarkedStocks()
  if (result.success) {
    alert(result.message)
  } else {
    alert(result.message || '북마크 갱신에 실패했습니다.')
  }
}

// 마지막 갱신 시간 포맷
const formatLastUpdated = (dateStr) => {
  if (!dateStr) return '갱신 필요'
  
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (minutes < 1) return '방금 갱신'
    if (minutes < 60) return `${minutes}분 전 갱신`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}시간 전 갱신`
    
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }) + ' 갱신'
  } catch {
    return '갱신 필요'
  }
}

// 마켓 변경 감지 (setMarket에서 이미 데이터를 로드하므로 여기서는 불필요)
// watch(() => store.selectedMarket, (newMarket) => {
//   // setMarket 내부에서 이미 데이터를 로드함
// })

const getChangeClass = (change) => {
  if (change > 0) return 'up'
  if (change < 0) return 'down'
  return ''
}

const formatListPrice = (price, market) => {
  if (!price) return '-'
  const numPrice = Number(price)
  if (market === 'US') {
    return '$' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(numPrice)
  }
  return new Intl.NumberFormat('ko-KR').format(numPrice) + '원'
}

const formatPrice = (price, market) => {
  if (!price) return '-'
  if (market === 'KR') {
    return new Intl.NumberFormat('ko-KR').format(price) + '원'
  }
  return '$' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price)
}

const formatDetailPrice = (price, currency) => {
  if (!price) return '-'
  if (currency === 'KRW') {
    return new Intl.NumberFormat('ko-KR').format(price) + '원'
  }
  return '$' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price)
}

const formatChange = (change) => {
  if (!change) return '-'
  const prefix = change > 0 ? '+' : ''
  return prefix + change.toFixed(2)
}

const formatChangePercent = (percent) => {
  if (percent === null || percent === undefined) return '-'
  const numPercent = Number(percent)
  const prefix = numPercent > 0 ? '+' : ''
  return prefix + numPercent.toFixed(2) + '%'
}

const formatVolume = (volume) => {
  if (!volume) return '-'
  if (volume >= 100000000) return (volume / 100000000).toFixed(1) + '억'
  if (volume >= 10000) return (volume / 10000).toFixed(1) + '만'
  return new Intl.NumberFormat().format(volume)
}

const formatMarketCap = (cap) => {
  if (!cap) return '-'
  if (cap >= 1000000000000) return (cap / 1000000000000).toFixed(1) + '조'
  if (cap >= 100000000) return (cap / 100000000).toFixed(1) + '억'
  if (cap >= 1000000) return (cap / 1000000).toFixed(1) + 'M'
  return new Intl.NumberFormat().format(cap)
}

const formatRate = (rate) => {
  if (!rate) return '-'
  return parseFloat(rate.replace(/,/g, '')).toLocaleString('ko-KR', { maximumFractionDigits: 2 })
}

// 지표별 가격 포맷
const formatIndexPrice = (price, name) => {
  if (!price) return '-'
  // 환율인 경우
  if (name.includes('환율') || name.includes('USD') || name.includes('EUR') || name.includes('JPY')) {
    return new Intl.NumberFormat('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price) + '원'
  }
  // 주가 지수
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price)
}

// 미니 차트 포인트 계산
const getMiniChartPoints = (chartData) => {
  if (!chartData || chartData.length === 0) return ''
  
  // 숫자 배열이거나 객체 배열인 경우 모두 처리
  const prices = chartData.map(d => {
    if (typeof d === 'number') return d
    return d.close || d.price || 0
  })
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1
  
  return prices.map((price, i) => {
    const x = (i / (prices.length - 1)) * 100
    const y = 30 - ((price - min) / range) * 28  // 반전: 낮은 값이 아래
    return `${x},${y}`
  }).join(' ')
}

const formatNewsDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return '방금 전'
    if (hours < 24) return `${hours}시간 전`
    
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}일 전`
    
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════
   Page Layout
   ═══════════════════════════════════════════════════════════════ */
.stock-page {
  min-height: 100vh;
  background: var(--n-page);
}

.filter-tabs {
  display: flex;
  margin: 0;
  gap: 4px;
  border: 0;
  background: var(--n-surface);
  padding: 5px;
  border-radius: 16px;
}

.filter-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  height: 44px;
  border: 0;
  background: transparent;
  color: var(--n-fg-muted);
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
}

.filter-tab svg {
  width: 14px;
  height: 14px;
}

.filter-tab:hover {
  color: var(--n-fg);
  background: transparent;
}

.filter-tab.active {
  box-shadow: none;
  background: var(--n-violet);
  color: var(--n-on-accent);
}

/* ═══════════════════════════════════════════════════════════════
   Main Container
   ═══════════════════════════════════════════════════════════════ */

.stock-layout {
  display: grid;
  margin: 0 auto;
  max-width: 1200px;
  grid-template-columns: 340px minmax(0, 1fr) 256px;
  gap: 24px;
}

/* ═══════════════════════════════════════════════════════════════
   Left Sidebar - Stock List
   ═══════════════════════════════════════════════════════════════ */
.stock-sidebar {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 200px);
  position: sticky;
  top: 96px;
  overflow: hidden;
  gap: 14px;
  border: 0;
  background: var(--n-fill);
  padding: 18px;
  border-radius: 28px;
}

/* Sidebar Search */
.sidebar-search {
  position: relative;
  background: transparent;
  border-bottom: 0;
  padding: 0;
}

.sidebar-search .search-box {
  display: flex;
  align-items: center;
  gap: 0;
  transition: all 0.2s;
  height: 56px;
  padding: 0 18px;
  border: 0;
  border-radius: 16px;
  background: var(--n-surface);
}

.sidebar-search .search-box:focus-within {
  background: var(--n-bg);
  box-shadow: 0 0 0 3px var(--n-lilac-strong);
}

.sidebar-search .search-icon {
  width: 18px;
  height: 18px;
  color: var(--n-text-muted);
  margin-left: 12px;
}

.sidebar-search .search-box input {
  flex: 1;
  padding: 10px 12px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 18px;
  font-weight: 600;
  color: var(--n-fg);
}

.sidebar-search .search-box input::placeholder {
  color: var(--n-fg-faint);
  font-weight: 500;
}

.sidebar-search .search-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 14px;
  right: 14px;
  background: var(--n-bg);
  z-index: 100;
  max-height: 280px;
  overflow-y: auto;
  border: 0;
  border-radius: 16px;
  box-shadow: var(--n-shadow);
}

.search-result {
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition: background 0.15s;
  border-bottom: 0;
  font-size: 16px;
}

.search-result:last-child {
  border-bottom: none;
}

.search-result:hover {
  background: #f9f9fb;
}

.result-symbol {
  font-weight: 600;
  color: var(--n-accent);
  font-size: 13px;
}

.result-name {
  color: var(--n-text-muted);
  font-size: 12px;
}

/* Refresh Bar */
.refresh-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0;
  background: transparent;
  padding: 0 4px;
}

.update-info {
  color: var(--n-fg-muted);
  font-size: 16px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s;
  height: 40px;
  border: 0;
  background: var(--n-surface);
  color: var(--n-violet-hover);
  padding: 0 14px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
}

.refresh-btn:hover:not(:disabled) {
  color: var(--n-accent);
  background: var(--n-lilac);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-btn svg {
  width: 14px;
  height: 14px;
}

.refresh-btn svg.spin {
  animation: spin 1s linear infinite;
}

/* Stock List */
.stock-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: var(--n-surface);
}

.list-loading {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.stock-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.15s;
  gap: 12px;
  border: 0;
  padding: 12px;
  border-radius: 18px;
}

.stock-item.active {
  border-left: 0;
  box-shadow: 0 10px 24px rgba(29, 26, 43, 0.08);
}

.stock-rank {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background: var(--n-surface);
  color: var(--n-fg-muted);
  border-radius: 50%;
  font-size: 16px;
  font-weight: 700;
}

.stock-item.active .stock-rank {
  background: var(--n-violet);
  color: var(--n-on-accent);
}

.stock-info {
  flex: 1;
  min-width: 0;
}

.stock-name {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 1px;
  color: var(--n-fg);
  font-size: 18px;
  font-weight: 600;
}

.stock-symbol {
  color: var(--n-fg-muted);
  font-size: 16px;
}

.stock-price-info {
  text-align: right;
  flex-shrink: 0;
}

.stock-price {
  display: block;
  margin-bottom: 1px;
  color: var(--n-fg);
  font-size: 18px;
  font-weight: 700;
}

.stock-change.up { color: var(--n-danger-text); }
.stock-change.down { color: var(--n-accent); }

/* Pagination
   목록 아래 페이지 이동 — 네모 흰 띠 대신 둥근 흰 카드 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: sticky;
  bottom: 0;
  margin-top: 8px;
  padding: 8px;
  border: 0;
  border-radius: 16px;
  background: var(--n-surface);
}

.page-btn {
  width: 32px;
  height: 32px;
  font-size: 16px;
  color: var(--n-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  border: 0;
  border-radius: 12px;
  background: var(--n-fill);
}

.page-btn:hover:not(:disabled) {
  background: var(--n-accent);
  color: var(--n-on-accent);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  min-width: 60px;
  text-align: center;
  font-size: 16px;
  color: var(--n-fg-muted);
}

/* ═══════════════════════════════════════════════════════════════
   Main Content
   ═══════════════════════════════════════════════════════════════ */
.stock-main {
  overflow-y: auto;
  background: transparent;
  min-height: calc(100vh - 200px);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: var(--n-text-muted);
  text-align: center;
  padding: 40px;
  background: var(--n-bg);
  border-radius: var(--n-radius-xl);
  border: 1px solid var(--n-border);
}

.empty-icon {
  width: 100px;
  height: 100px;
  /* 그라데이션을 지우다 만 흔적으로 "var(--n-accent-wash) 0%, ... 100%" 라는
     문법이 깨진 값이 들어 있어 배경이 아예 적용되지 않았다. */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  border: 0;
  border-radius: 20px;
  background: var(--n-fill);
}

.empty-icon svg {
  width: 48px;
  height: 48px;
  color: var(--n-accent);
}

.empty-state h2 {
  font-weight: 700;
  margin: 0 0 10px;
  font-size: 26px;
  color: var(--n-title);
}

.empty-state p {
  line-height: 1.6;
  margin: 0;
  font-size: 18px;
  color: var(--n-fg-muted);
}

/* Stock Detail */
.stock-detail {
  background: var(--n-bg);
  border-radius: var(--n-radius-xl);
  padding: 28px;
  border: 1px solid var(--n-border);
  gap: 40px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 28px;
  padding: 0;
  border: 0;
  background: none;
  align-items: flex-end;
}

.header-title-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.detail-name {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.035em;
  color: var(--n-title);
}

/* Bookmark Button */
.bookmark-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 12px;
  background: var(--n-fill);
  color: var(--n-fg-faint);
}

.bookmark-btn svg {
  width: 16px;
  height: 18px;
  color: var(--n-text-muted);
}

.bookmark-btn:hover:not(:disabled) {
  background: var(--n-bookmark-bg);
  color: var(--n-bookmark);
}

.bookmark-btn:hover:not(:disabled) svg {
  color: var(--n-accent);
}

.bookmark-btn.active {
  box-shadow: none;
  background: #fdf3d3;
  color: var(--n-bookmark);
  border: 0;
}

.bookmark-btn.active svg {
  color: var(--n-bookmark);
}

.bookmark-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.bookmark-btn svg.spin {
  animation: spin 1s linear infinite;
}

.detail-meta {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.detail-symbol,
.detail-exchange {
  padding: 5px 12px;
  background: var(--n-bg-subtle);
  border-radius: var(--n-radius-sm);
  font-size: 12px;
  color: var(--n-text-muted);
}

.detail-symbol {
  color: var(--n-accent);
  font-weight: 700;
}

.header-right {
  text-align: right;
}

.detail-price {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--n-fg);
}

.detail-change {
  margin-top: 6px;
  font-size: 18px;
  font-weight: 700;
}

.detail-change.up { color: var(--n-danger-text); }
.detail-change.down { color: var(--n-accent); }

/* Chart Section */
.chart-section {
  margin-top: 24px;
  padding: 24px;
  border: 0;
  border-radius: 28px;
  background: var(--n-fill);
}

.chart-tabs {
  display: flex;
  margin-bottom: 20px;
  gap: 4px;
  border: 0;
}

.chart-tab {
  cursor: pointer;
  transition: all 0.2s;
  height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  font-size: 16px;
  font-weight: 600;
  color: var(--n-fg-muted);
}

.chart-tab:hover {
  color: var(--n-fg);
  background: transparent;
}

.chart-tab.active {
  background: var(--n-surface);
  color: var(--n-violet-hover);
  box-shadow: 0 6px 16px rgba(29, 26, 43, 0.08);
}

.chart-container {
  height: 320px;
  background: transparent;
  border: 0;
}

.chart-loading,
.chart-empty {
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--n-text-muted);
  font-size: 14px;
}

/* Stats Section */
.stats-section {
  background: var(--n-bg-subtle);
  border-radius: var(--n-radius-xl);
  padding: 24px;
  margin-top: 20px;
}

.section-title {
  margin: 0 0 20px;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--n-title);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.stat-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 16px 18px;
  border: 0;
  border-radius: 20px;
  background: var(--n-fill);
}

.stat-label {
  display: block;
  margin-bottom: 6px;
  font-size: 16px;
  color: var(--n-fg-muted);
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--n-fg);
  font-variant-numeric: tabular-nums;
}

.stat-value.up { color: var(--n-danger-text); }
.stat-value.down { color: #7052f5; }

/* Info Section */
.info-section {
  margin-top: 20px;
  padding: 28px;
  border: 0;
  border-radius: 28px;
  background: var(--n-fill);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header .section-title {
  margin: 0;
}

.translate-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
  height: 44px;
  padding: 0 20px;
  border: 0;
  border-radius: 12px;
  background: var(--n-surface);
  color: var(--n-violet-hover);
  font-size: 16px;
  font-weight: 700;
}

.translate-btn:hover {
  background: var(--n-lilac);
}

.translate-btn svg {
  width: 16px;
  height: 16px;
}

.translating-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--n-accent);
}

.company-desc {
  margin: 0 0 18px;
  background: var(--n-bg);
  padding: 20px;
  border-radius: var(--n-radius-md);
  font-size: 18px;
  line-height: 1.75;
  color: var(--n-fg-muted);
}

.company-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.meta-tag {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 5px 14px;
  border: 0;
  border-radius: 999px;
  background: var(--n-surface);
  font-size: 16px;
  font-weight: 600;
  color: var(--n-violet-hover);
}

/* News Section */
.news-section {
  background: var(--n-bg-subtle);
  border-radius: var(--n-radius-xl);
  padding: 24px;
  margin-top: 20px;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.news-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 18px 22px;
  border: 0;
  border-radius: 20px;
  background: var(--n-fill);
  transition: background-color 0.2s, transform 0.2s;
}

.news-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  background: var(--n-lilac);
  transform: translateX(4px);
}

.news-item:hover .news-title {
  color: var(--n-fg);
}

.news-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.news-title {
  line-height: 1.5;
  transition: color 0.15s;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 18px;
  font-weight: 600;
  color: var(--n-fg);
}

.news-desc {
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 16px;
  color: var(--n-fg-muted);
}

.news-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 4px;
}

.news-publisher {
  font-size: 16px;
  font-weight: 600;
  color: var(--n-violet);
}

.news-date {
  font-size: 16px;
  color: var(--n-fg-muted);
}

.news-empty {
  padding: 48px;
  text-align: center;
  color: var(--n-text-muted);
  font-size: 15px;
  background: var(--n-bg);
  border-radius: var(--n-radius-md);
}

/* ═══════════════════════════════════════════════════════════════
   Right Sidebar
   ═══════════════════════════════════════════════════════════════ */
.market-sidebar {
  height: calc(100vh - 200px);
  position: sticky;
  top: 96px;
  overflow-y: auto;
  padding: 20px;
  border: 0;
  border-radius: 28px;
  background: var(--n-fill);
}

.sidebar-title {
  margin: 0 0 20px;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--n-title);
}

.market-section {
  margin-bottom: 24px;
}

.market-empty {
  display: flex;
  justify-content: center;
  padding: 24px;
  color: var(--n-text-muted);
  font-size: 13px;
}

.market-loading {
  display: flex;
  justify-content: center;
  padding: 24px;
}

/* Indices Cards */
.indices-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.index-card {
  transition: all 0.15s;
  padding: 16px;
  border-radius: 20px;
  background: var(--n-surface);
}

.index-card:hover {
  background: var(--n-surface);
  box-shadow: 0 10px 24px rgba(29, 26, 43, 0.08);
}

.index-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.index-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--n-fg);
}

.index-change {
  font-size: 16px;
  font-weight: 700;
}

.index-change.up {
  color: var(--n-danger-text);
}

.index-change.down {
  color: var(--n-accent);
}

.index-price {
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--n-fg);
}

.mini-chart {
  height: 30px;
  overflow: hidden;
}

.mini-chart svg {
  width: 100%;
  height: 100%;
}

/* ═══════════════════════════════════════════════════════════════
   Spinner
   ═══════════════════════════════════════════════════════════════ */
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--n-border);
  border-top-color: var(--n-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner.large {
  width: 36px;
  height: 36px;
  border-width: 4px;
}

.spinner.small {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
/* ═══════════════════════════════════════════════════════════════════
   F!NK 리디자인 — 메인 톤 적용
   보더 대신 연한 면(--n-fill)과 그림자, 선택 상태는 바이올렛.
   북마크는 옐로, 상승 레드 / 하락 블루.
   ═══════════════════════════════════════════════════════════════════ */
.stock-container { padding: 48px 24px 120px; }

/* 왼쪽 목록 */
.stock-item:hover { background: var(--n-lilac); }
.stock-item.active { background: var(--n-surface); }
.stock-change { font-size: 16px; font-weight: 600; }
.stock-change.up,
.detail-change.up,
.stat-value.up,
.index-change.up { color: var(--n-red); }
.stock-change.down,
.detail-change.down,
.stat-value.down,
.index-change.down { color: var(--n-blue); }

/* 가운데 상세 */
.detail-exchange,
.detail-symbol { padding: 4px 12px; border: 0; border-radius: 999px; background: var(--n-fill); font-size: 16px; font-weight: 600; color: var(--n-fg-muted); }

/* 오른쪽 주요 지표 */

@media (max-width: 1200px) {
  .stock-layout {
    grid-template-columns: 320px 1fr;
  }

  .market-sidebar {
    display: none;
  }
}

@media (max-width: 900px) {
  .stock-layout {
    grid-template-columns: 1fr;
  }

  .stock-sidebar {
    position: relative;
    top: 0;
    height: auto;
    max-height: 350px;
  }

  .stock-main {
    min-height: auto;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .search-box input {
    width: 100%;
  }

  .filter-tabs {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .stock-container {
    padding: 16px;
  }

  .stock-sidebar {
    max-height: 300px;
  }

  .stock-item {
    padding: 10px 12px;
  }

  .stock-detail {
    padding: 16px;
  }

  .detail-name {
    font-size: 20px;
  }

  .detail-price {
    font-size: 26px;
  }

  .chart-section,
  .stats-section,
  .info-section,
  .news-section {
    border-radius: var(--n-radius-md);
    padding: 16px;
  }
}</style>
