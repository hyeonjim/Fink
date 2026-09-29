<template>
  <div class="analysis-page">
    <!-- Page Header -->
    <header class="n-page-header">
      <div class="n-page-header-content">
        <div class="n-page-header-icon">
          <svg viewBox="0 0 64 64" aria-hidden="true"><rect x="4" y="10" width="40" height="42" rx="9" fill="#bb8ec7"/><rect x="4" y="20" width="40" height="32" rx="9" fill="#9588df"/><rect x="4" y="20" width="40" height="10" fill="#9588df"/><rect x="10" y="14" width="10" height="3" rx="1.5" fill="#fff"/><rect x="10" y="27" width="22" height="3.5" rx="1.75" fill="#fff"/><rect x="10" y="34" width="16" height="3.5" rx="1.75" fill="#fff"/><rect x="10" y="41" width="12" height="3.5" rx="1.75" fill="#fff"/><circle cx="42" cy="40" r="13" fill="#1d1a2b"/><circle cx="42" cy="40" r="8.5" fill="#bb8ec7"/><path d="M51.5 49.5 58 56" stroke="#1d1a2b" stroke-width="5" stroke-linecap="round"/><path d="M53 4l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#5140b5"/></svg>
        </div>
        <div class="n-page-header-text">
          <h1 class="n-page-title">AI 금융 분석</h1>
          <p class="n-page-subtitle">나에게 맞는 금융상품을 추천받아보세요</p>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Step Indicator -->
      <div class="step-indicator">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="step-item"
          :class="{ active: currentStep >= index, completed: currentStep > index }"
        >
          <div class="step-number">{{ index + 1 }}</div>
          <span class="step-label">{{ step }}</span>
        </div>
      </div>

      <div class="analysis-card">
        <!-- Step 1: 목적 선택 -->
        <div v-if="currentStep === 0" class="step-content">
          <div class="card-header">
            <div class="card-icon card-icon--illust">
              <svg viewBox="0 0 64 64" aria-hidden="true">
                <ellipse cx="24" cy="55" rx="16" ry="4" fill="#bb8ec7"/>
                <rect x="14" y="8" width="5" height="48" rx="2.5" fill="#1d1a2b"/>
                <path d="M19 10h30l-7 9 7 9H19z" fill="#9588df"/>
                <path d="M19 10h14v18H19z" fill="#bb8ec7"/>
                <circle cx="16.5" cy="8" r="4" fill="#5140b5"/>
              </svg>
            </div>
            <div>
              <h2 class="card-title">목적을 선택하세요</h2>
              <p class="card-subtitle">어떤 목표를 위해 저축하시나요?</p>
            </div>
          </div>

          <div class="purpose-grid">
            <div 
              v-for="purpose in purposes" 
              :key="purpose.value"
              class="purpose-card"
              :class="{ selected: form.purpose === purpose.value }"
              @click="selectPurpose(purpose.value)"
            >
              <div class="purpose-icon" :style="{ background: purpose.bgColor }">
                <svg v-if="purpose.value === 'housing'" class="purpose-svg" viewBox="0 0 64 64" aria-hidden="true"><rect class="c1" x="14" y="28" width="36" height="28" rx="5" fill="#bb8ec7"/><path class="c2" d="M5.5 30.5 32 8l26.5 22.5a2.6 2.6 0 0 1-1.7 4.5H7.2a2.6 2.6 0 0 1-1.7-4.5z" fill="#9588df"/><rect class="c3" x="27" y="40" width="10" height="16" rx="3" fill="#1d1a2b"/><circle cx="32" cy="24" r="3.6" fill="#fff"/></svg>
                <svg v-else-if="purpose.value === 'savings'" class="purpose-svg" viewBox="0 0 64 64" aria-hidden="true"><rect class="c2" x="6" y="42" width="32" height="11" rx="5.5" fill="#9588df"/><rect class="c1" x="6" y="29" width="32" height="11" rx="5.5" fill="#bb8ec7"/><rect class="c2" x="6" y="16" width="32" height="11" rx="5.5" fill="#9588df"/><circle class="c3" cx="45" cy="41" r="14" fill="#1d1a2b"/><circle cx="45" cy="41" r="7.5" fill="none" stroke="#fff" stroke-width="2.6"/><path class="c3" d="M53 4l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#5140b5"/></svg>
                <svg v-else class="purpose-svg" viewBox="0 0 64 64" aria-hidden="true"><circle class="c1" cx="27" cy="38" r="20" fill="#bb8ec7"/><ellipse cx="27" cy="38" rx="8.5" ry="20" fill="none" stroke="#fff" stroke-width="2.2" stroke-opacity="0.8"/><path d="M7 38h40" stroke="#fff" stroke-width="2.2" stroke-opacity="0.8"/><path class="c3" d="M34 14 61 4 53 29 46 22 39 27 41 19z" fill="#1d1a2b"/><path class="c2" d="M41 19 61 4 46 22z" fill="#9588df"/></svg>
              </div>
              <h3 class="purpose-title">{{ purpose.label }}</h3>
              <p class="purpose-desc">{{ purpose.desc }}</p>
            </div>
          </div>

          <button class="next-btn n-action n-action--primary" :disabled="!form.purpose" @click="nextStep">
            다음 단계
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <!-- Step 2: 목적별 세부 정보 -->
        <div v-if="currentStep === 1" class="step-content">
          <div class="card-header">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <div>
              <h2 class="card-title">{{ purposeDetail.title }}</h2>
              <p class="card-subtitle">{{ purposeDetail.subtitle }}</p>
            </div>
          </div>

          <!-- 주택 목적 -->
          <div v-if="form.purpose === 'housing'" class="form-section">
            <div class="form-group">
              <label class="form-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                주거 유형
              </label>
              <div class="option-grid">
                <div 
                  v-for="type in housingTypes" 
                  :key="type.value"
                  class="option-card"
                  :class="{ selected: form.housing_type === type.value }"
                  @click="form.housing_type = type.value"
                >
                  <span class="option-emoji">{{ type.emoji }}</span>
                  <span class="option-label">{{ type.label }}</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                목표 지역
              </label>
              <input 
                type="text" 
                v-model="form.target_region" 
                class="form-input"
                placeholder="예: 서울 강남구, 경기 성남시"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18M9 21V9"/>
                </svg>
                목표 아파트 (선택)
              </label>
              <input 
                type="text" 
                v-model="form.target_apartment" 
                class="form-input"
                placeholder="예: 래미안, 힐스테이트"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                </svg>
                예상 가격
              </label>
              <div class="input-wrapper">
                <input 
                  type="number" 
                  v-model.number="displayApartmentPrice" 
                  class="form-input"
                  placeholder="예: 50000"
                />
                <span class="input-suffix">만원</span>
              </div>
              <p class="form-hint">아파트 가격을 입력하면 자동으로 목표 금액이 설정됩니다 ({{ formatCurrency(form.apartment_price) }})</p>
            </div>
          </div>

          <!-- 여행 목적 -->
          <div v-if="form.purpose === 'travel'" class="form-section">
            <!-- 나라 선택 (통화와 연동) -->
            <div class="form-group">
              <label class="form-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                </svg>
                여행 국가 선택
              </label>
              <div class="country-grid">
                <div 
                  v-for="country in travelCountries" 
                  :key="country.code"
                  class="country-card"
                  :class="{ selected: form.travel_country_code === country.code }"
                  @click="selectCountry(country)"
                >
                  <img :src="country.flag" :alt="country.name" class="country-flag-img" />
                  <span class="country-name">{{ country.name }}</span>
                  <span class="country-currency">{{ country.currencyName }}</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                세부 여행지 (선택)
              </label>
              <input 
                type="text" 
                v-model="form.travel_destination" 
                class="form-input"
                :placeholder="selectedCountryPlaceholder"
              />
            </div>

            <div class="travel-tip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <p>선택한 국가를 기반으로 관련 뉴스와 추천 여행지를 알려드립니다. 적금 완료 후 이자 포함 금액을 현지 통화로 환산해드려요!</p>
            </div>
          </div>

          <!-- 목돈 목적 -->
          <div v-if="form.purpose === 'savings'" class="form-section">
            <div class="form-group">
              <label class="form-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                세부 목적 (선택)
              </label>
              <div class="option-grid wide">
                <div 
                  v-for="detail in savingsDetails" 
                  :key="detail.value"
                  class="option-card"
                  :class="{ selected: form.savings_purpose_detail === detail.value }"
                  @click="form.savings_purpose_detail = detail.value"
                >
                  <span class="option-emoji">{{ detail.emoji }}</span>
                  <span class="option-label">{{ detail.label }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="btn-group">
            <button class="back-btn" @click="prevStep">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              이전
            </button>
            <button class="next-btn n-action n-action--primary" @click="nextStep">
              다음 단계
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Step 3: 금액 및 기간 설정 -->
        <div v-if="currentStep === 2" class="step-content">
          <div class="card-header">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
            </div>
            <div>
              <h2 class="card-title">금액 및 기간 설정</h2>
              <p class="card-subtitle">목표 달성을 위한 상세 정보를 입력하세요</p>
            </div>
          </div>

          <div class="form-section">
            <!-- 현재 보유 금액 -->
            <div class="form-group">
              <label class="form-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M2 10h20"/>
                </svg>
                현재 보유 금액
              </label>
              <div class="input-wrapper">
                <input 
                  type="number" 
                  v-model.number="displayCurrentSavings" 
                  class="form-input"
                  placeholder="예: 500"
                />
                <span class="input-suffix">만원</span>
              </div>
              <p class="form-hint">예금에 활용할 수 있는 금액을 입력하세요 ({{ formatCurrency(form.current_savings) }})</p>
            </div>

            <!-- 목표 금액 -->
            <div class="form-group">
              <label class="form-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                목표 금액
              </label>
              <div class="input-wrapper">
                <input 
                  type="number" 
                  v-model.number="displayTargetAmount" 
                  class="form-input"
                  placeholder="예: 1000"
                />
                <span class="input-suffix">만원</span>
              </div>
              <p class="form-hint">{{ formatCurrency(form.target_amount) }}</p>
            </div>

            <!-- 월 납입액 -->
            <div class="form-group">
              <label class="form-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                월 납입액
              </label>
              <div class="input-wrapper">
                <input 
                  type="number" 
                  v-model.number="displayMonthlyAmount" 
                  class="form-input"
                  placeholder="예: 50"
                />
                <span class="input-suffix">만원</span>
              </div>
              <p class="form-hint">{{ formatCurrency(form.monthly_amount) }}</p>
            </div>

            <!-- 기간 -->
            <div class="form-group">
              <label class="form-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                기간
              </label>
              <div class="period-selector">
                <div 
                  v-for="period in periodOptions" 
                  :key="period.value"
                  class="period-option"
                  :class="{ selected: form.period_months === period.value }"
                  @click="form.period_months = period.value"
                >
                  {{ period.label }}
                </div>
                <div class="period-custom">
                  <input 
                    type="number" 
                    v-model.number="form.period_months" 
                    class="form-input small"
                    placeholder="직접 입력"
                  />
                  <span class="input-suffix">개월</span>
                </div>
              </div>
            </div>

            <!-- 예상 계산 결과 미리보기 -->
            <div class="preview-card" v-if="previewCalculation">
              <h4 class="preview-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                예상 결과 미리보기
              </h4>
              <div class="preview-stats">
                <div class="preview-stat">
                  <span class="stat-label">예상 총 납입액</span>
                  <span class="stat-value">{{ formatCurrency(previewCalculation.totalSavings) }}</span>
                </div>
                <div class="preview-stat">
                  <span class="stat-label">보유금 포함 총액</span>
                  <span class="stat-value highlight">{{ formatCurrency(previewCalculation.totalWithCurrent) }}</span>
                </div>
                <div class="preview-stat" :class="{ success: previewCalculation.achievable, warning: !previewCalculation.achievable }">
                  <span class="stat-label">목표 달성 여부</span>
                  <span class="stat-value">{{ previewCalculation.achievable ? '✅ 달성 가능' : '⚠️ 부족' }}</span>
                </div>
                <div v-if="!previewCalculation.achievable" class="preview-stat warning">
                  <span class="stat-label">부족 금액</span>
                  <span class="stat-value">{{ formatCurrency(previewCalculation.shortfall) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="btn-group">
            <button class="back-btn" @click="prevStep">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              이전
            </button>
            <button class="submit-btn n-action n-action--primary" :disabled="analysisStore.loading || !isFormValid" @click="submit">
              <template v-if="analysisStore.loading">
                <div class="loading-spinner"></div>
                분석 중...
              </template>
              <template v-else>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                </svg>
                AI 분석하기
              </template>
            </button>
          </div>
        </div>
      </div>

      <!-- Info Cards -->
      <div class="info-cards">
        <div class="info-card">
          <div class="info-icon">
            <svg viewBox="0 0 64 64" role="img" aria-label="GPT">
              <path d="M50 44l6 14-15-8z" fill="#bb8ec7"/>
              <rect x="6" y="6" width="50" height="46" rx="16" fill="#9588df"/>
              <g transform="translate(13 11) scale(0.1) translate(-178 -178)" fill="#ffffff"><path d="M508.749 317.399C516.777 287.314 508.991 253.884 485.389 230.282C461.788 206.681 428.36 198.895 398.273 206.923C376.231 184.928 343.39 174.956 311.148 183.596C278.906 192.234 255.45 217.292 247.36 247.361C217.291 255.451 192.233 278.91 183.595 311.149C174.957 343.391 184.927 376.232 206.924 398.274C198.896 428.359 206.683 461.789 230.284 485.391C253.885 508.992 287.313 516.779 317.401 508.75C339.442 530.745 372.286 540.717 404.525 532.079C436.767 523.441 460.223 498.384 468.313 468.315C498.383 460.224 523.44 436.766 532.078 404.526C540.716 372.285 530.747 339.443 508.749 317.402V317.399ZM470.899 244.776C486.892 260.77 493.488 282.601 490.687 303.412L415.577 260.046C412.411 258.218 408.509 258.218 405.345 260.046L317.401 310.82V277.526C317.401 275.191 318.652 273.005 320.676 271.837L387.644 233.174C414.178 218.353 448.346 222.223 470.901 244.776H470.899ZM357.837 311.144L398.275 334.491V381.185L357.837 404.532L317.398 381.185V334.491L357.837 311.144ZM264.776 269.693C265.207 239.305 285.644 211.649 316.453 203.393C338.3 197.54 360.505 202.744 377.127 215.573L302.014 258.937C298.848 260.764 296.898 264.144 296.898 267.798V369.346L268.065 352.699C266.043 351.531 264.776 349.353 264.776 347.017V269.691V269.693ZM203.391 316.454C209.244 294.608 224.854 277.978 244.276 269.999V356.73C244.276 360.384 246.226 363.763 249.392 365.591L337.337 416.365L308.503 433.013C306.481 434.181 303.961 434.188 301.939 433.02L234.971 394.357C208.868 378.789 195.138 347.261 203.391 316.454ZM244.775 470.9C228.781 454.906 222.186 433.075 224.986 412.264L300.096 455.63C303.263 457.457 307.164 457.457 310.328 455.63L398.273 404.856V438.149C398.273 440.485 397.022 442.671 394.997 443.839L328.029 482.502C301.495 497.322 267.327 493.452 244.772 470.9H244.775ZM450.897 445.982C450.466 476.371 430.029 504.027 399.22 512.283C377.373 518.136 355.168 512.932 338.547 500.102L413.659 456.738C416.826 454.911 418.775 451.532 418.775 447.877V346.329L447.609 362.977C449.631 364.145 450.897 366.323 450.897 368.659V445.985V445.982ZM512.282 399.221C506.429 421.068 490.819 437.697 471.397 445.676V358.946C471.397 355.292 469.448 351.912 466.281 350.085L378.336 299.311L407.17 282.663C409.192 281.495 411.712 281.487 413.734 282.655L480.702 321.318C506.805 336.887 520.536 368.415 512.282 399.221Z"/></g>
            </svg>
          </div>
          <h4 class="info-title">GPT 기반 분석</h4>
          <p class="info-text">AI가 수백 개의 금융상품 중 최적의 상품을 추천합니다</p>
        </div>
        
        <div class="info-card">
          <div class="info-icon purple">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <rect x="6" y="42" width="30" height="11" rx="5.5" fill="#9588df"/>
              <rect x="6" y="29" width="30" height="11" rx="5.5" fill="#bb8ec7"/>
              <rect x="6" y="16" width="30" height="11" rx="5.5" fill="#9588df"/>
              <circle cx="45" cy="40" r="14" fill="#1d1a2b"/>
              <path d="M45 33v14M38 40h14" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>
            </svg>
          </div>
          <h4 class="info-title">예금+적금 조합</h4>
          <p class="info-text">보유금과 월 납입을 최적으로 조합해 추천합니다</p>
        </div>
        
        <div class="info-card">
          <div class="info-icon amber">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <circle cx="28" cy="36" r="22" fill="#bb8ec7"/>
              <circle cx="28" cy="36" r="14" fill="#9588df"/>
              <circle cx="28" cy="36" r="6" fill="#ffffff"/>
              <path d="M28 36 52 12" stroke="#1d1a2b" stroke-width="4" stroke-linecap="round"/>
              <path d="M46 8l2 7 7 2-6 5-8-3-1-8z" fill="#1d1a2b"/>
            </svg>
          </div>
          <h4 class="info-title">목적별 맞춤 분석</h4>
          <p class="info-text">주택, 여행, 목돈 등 목적에 맞는 조언을 제공합니다</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAnalysisStore } from '@/stores/analysis'

const router = useRouter()
const analysisStore = useAnalysisStore()

const currentStep = ref(0)
const steps = ['목적 선택', '상세 정보', '금액 설정']

const form = reactive({
  purpose: '',
  period_months: 12,
  monthly_amount: 500000,
  target_amount: 10000000,
  current_savings: 0,
  // 주택
  housing_type: '',
  target_region: '',
  target_apartment: '',
  apartment_price: null,
  // 여행
  travel_destination: '',
  travel_country_code: '',
  // 목돈
  savings_purpose_detail: '',
})

const purposes = [
  { 
    value: 'housing', 
    label: '주택', 
    emoji: '🏠', 
    desc: '내 집 마련, 전월세 자금',
    bgColor: '#dbeafe'
  },
  { 
    value: 'savings', 
    label: '목돈 마련', 
    emoji: '💰', 
    desc: '결혼, 자동차, 창업 등',
    bgColor: '#fef3c7'
  },
  { 
    value: 'travel', 
    label: '여행', 
    emoji: '✈️', 
    desc: '국내외 여행 자금',
    bgColor: 'var(--n-accent-wash)'
  },
]

const housingTypes = [
  { value: 'purchase', label: '매매', emoji: '🏢' },
  { value: 'jeonse', label: '전세', emoji: '🔑' },
  { value: 'wolse_deposit', label: '월세 보증금', emoji: '💵' },
  { value: 'wolse', label: '월세', emoji: '📅' },
]

const savingsDetails = [
  { value: '결혼', label: '결혼 자금', emoji: '💒' },
  { value: '자동차', label: '자동차 구매', emoji: '🚗' },
  { value: '창업', label: '창업 자금', emoji: '🚀' },
  { value: '교육', label: '교육/학자금', emoji: '📚' },
  { value: '비상금', label: '비상금', emoji: '🛡️' },
  { value: '기타', label: '기타', emoji: '📦' },
]

// 여행 국가 목록 (나라 선택 시 통화 자동 설정) - exchange/views.py의 currencies와 동기화
// 실제 환율 API에서 제공하는 통화만 포함 (VND, TWD 제외)
const travelCountries = [
  { code: 'JPY', name: '일본', flag: 'https://flagcdn.com/w40/jp.png', currencyName: '엔 (JPY)', placeholder: '예: 도쿄, 오사카, 후쿠오카' },
  { code: 'USD', name: '미국', flag: 'https://flagcdn.com/w40/us.png', currencyName: '달러 (USD)', placeholder: '예: 뉴욕, LA, 하와이' },
  { code: 'EUR', name: '유럽', flag: 'https://flagcdn.com/w40/eu.png', currencyName: '유로 (EUR)', placeholder: '예: 파리, 로마, 바르셀로나' },
  { code: 'CNH', name: '중국', flag: 'https://flagcdn.com/w40/cn.png', currencyName: '위안 (CNH)', placeholder: '예: 상하이, 베이징' },
  { code: 'THB', name: '태국', flag: 'https://flagcdn.com/w40/th.png', currencyName: '바트 (THB)', placeholder: '예: 방콕, 치앙마이, 푸켓' },
  { code: 'SGD', name: '싱가포르', flag: 'https://flagcdn.com/w40/sg.png', currencyName: '싱가포르 달러 (SGD)', placeholder: '예: 마리나베이, 센토사' },
  { code: 'GBP', name: '영국', flag: 'https://flagcdn.com/w40/gb.png', currencyName: '파운드 (GBP)', placeholder: '예: 런던, 에든버러, 맨체스터' },
  { code: 'HKD', name: '홍콩', flag: 'https://flagcdn.com/w40/hk.png', currencyName: '홍콩 달러 (HKD)', placeholder: '예: 빅토리아 피크, 란타우' },
]

const periodOptions = [
  { value: 6, label: '6개월' },
  { value: 12, label: '12개월' },
  { value: 24, label: '24개월' },
  { value: 36, label: '36개월' },
]

// 만원 단위 입력을 위한 computed (양방향 바인딩)
const displayCurrentSavings = computed({
  get: () => form.current_savings ? form.current_savings / 10000 : null,
  set: (val) => { form.current_savings = val ? val * 10000 : 0 }
})

const displayTargetAmount = computed({
  get: () => form.target_amount ? form.target_amount / 10000 : null,
  set: (val) => { form.target_amount = val ? val * 10000 : 0 }
})

const displayMonthlyAmount = computed({
  get: () => form.monthly_amount ? form.monthly_amount / 10000 : null,
  set: (val) => { form.monthly_amount = val ? val * 10000 : 0 }
})

const displayApartmentPrice = computed({
  get: () => form.apartment_price ? form.apartment_price / 10000 : null,
  set: (val) => { form.apartment_price = val ? val * 10000 : 0 }
})

// 선택된 국가에 따른 placeholder
const selectedCountryPlaceholder = computed(() => {
  const country = travelCountries.find(c => c.code === form.travel_country_code)
  return country ? country.placeholder : '먼저 여행 국가를 선택하세요'
})

// 선택된 국가 정보
const selectedCountry = computed(() => {
  return travelCountries.find(c => c.code === form.travel_country_code)
})

// 국가 선택 함수
const selectCountry = (country) => {
  form.travel_country_code = country.code
  // 여행지에 국가명 자동 설정 (비어있을 경우)
  if (!form.travel_destination) {
    form.travel_destination = country.name
  }
}

const purposeDetail = computed(() => {
  switch (form.purpose) {
    case 'housing':
      return { title: '주택 정보 입력', subtitle: '목표 주거지 정보를 입력하세요' }
    case 'travel':
      return { title: '여행 정보 입력', subtitle: '여행할 국가를 선택하세요' }
    case 'savings':
      return { title: '저축 목적 선택', subtitle: '세부 저축 목적을 선택하세요' }
    default:
      return { title: '상세 정보', subtitle: '' }
  }
})

const previewCalculation = computed(() => {
  if (!form.monthly_amount || !form.period_months || !form.target_amount) {
    return null
  }
  
  const totalSavings = form.monthly_amount * form.period_months
  const totalWithCurrent = totalSavings + (form.current_savings || 0)
  const achievable = totalWithCurrent >= form.target_amount
  const shortfall = Math.max(0, form.target_amount - totalWithCurrent)
  
  return {
    totalSavings,
    totalWithCurrent,
    achievable,
    shortfall,
  }
})

const isFormValid = computed(() => {
  return form.purpose && 
         form.period_months > 0 && 
         form.monthly_amount > 0 && 
         form.target_amount > 0
})

// 아파트 가격 입력 시 목표 금액 자동 설정
watch(() => form.apartment_price, (newPrice) => {
  if (newPrice && form.purpose === 'housing') {
    form.target_amount = newPrice
  }
})

const selectPurpose = (value) => {
  form.purpose = value
}

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount)
}

const submit = () => {
  const payload = {
    purpose: form.purpose,
    period_months: form.period_months,
    monthly_amount: form.monthly_amount,
    target_amount: form.target_amount,
    current_savings: form.current_savings || 0,
  }
  
  // 목적별 추가 필드
  if (form.purpose === 'housing') {
    payload.housing_type = form.housing_type
    payload.target_region = form.target_region
    payload.target_apartment = form.target_apartment
    payload.apartment_price = form.apartment_price
  } else if (form.purpose === 'travel') {
    payload.travel_destination = form.travel_destination
    payload.travel_country_code = form.travel_country_code
  } else if (form.purpose === 'savings') {
    payload.savings_purpose_detail = form.savings_purpose_detail
  }
  
  analysisStore.createAnalysis(payload)
}
</script>

<style scoped>
.analysis-page {
  min-height: calc(100vh - 200px);
  margin-bottom: 200px;
  background: var(--n-page);
}

/* Main Content */
.main-content {
  margin: 0 auto;
  max-width: 960px;
  padding: 64px 24px 120px;
}

/* Step Indicator */
.step-indicator {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 0 0 40px;
  align-items: center;
}

.step-item {
  display: flex;
  align-items: center;
  transition: all 0.3s;
  gap: 12px;
  opacity: 1;
}

.step-item.active {
  opacity: 1;
}

.step-number {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--n-lilac);
  font-size: 18px;
  font-weight: 800;
  width: 44px;
  height: 44px;
  color: var(--n-violet);
}

.step-item.active .step-number {
  background: var(--n-accent);
  color: var(--n-on-accent);
}

.step-item.completed .step-number {
  background: #22c55e;
  color: var(--n-on-accent);
}

.step-label {
  font-size: 22px;
  font-weight: 600;
  color: var(--n-fg-muted);
}

/* Analysis Card */
.analysis-card {
  position: relative;
  padding: 48px;
  border-radius: 32px;
  background: var(--n-surface);
  box-shadow: var(--n-shadow);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 36px;
  padding-bottom: 0;
  border-bottom: 0;
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: var(--n-lilac);
  width: 64px;
  height: 64px;
  color: var(--n-violet);
}

.card-title {
  margin: 0 0 4px;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--n-title);
}

.card-subtitle {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: var(--n-fg-muted);
}

/* Purpose Grid */
.purpose-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 36px;
}

.purpose-card {
  text-align: center;
  cursor: pointer;
  padding: 32px 24px 28px;
  border: 0;
  border-radius: 28px;
  background: var(--n-fill);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.25s, box-shadow 0.25s;
  position: relative;
}

.purpose-card:hover {
  transform: translateY(-4px);
  background: var(--n-fill-strong);
}

.purpose-card.selected {
  background: var(--n-lilac);
  box-shadow: inset 0 0 0 2px var(--n-periwinkle), 0 16px 36px rgba(81, 64, 181, 0.14);
}

.purpose-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  border-radius: 26px;
  background: var(--n-surface) !important;
  margin-bottom: 20px;
  width: 88px;
  height: 88px;
}

.purpose-title {
  margin: 0 0 4px;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--n-title);
}

.purpose-desc {
  margin: 0;
  margin-top: 8px;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.6;
  color: var(--n-fg-muted);
}

/* Option Grid */
.option-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.option-grid.wide {
  grid-template-columns: repeat(3, 1fr);
}

.option-card {
  padding: 16px 12px;
  border: 2px solid var(--n-border);
  border-radius: var(--n-radius-md);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.option-card:hover {
  border-color: var(--n-accent);
}

.option-card.selected {
  border-color: var(--n-accent);
  background: var(--n-accent-wash);
}

.option-emoji {
  display: block;
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.option-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--n-text-body);
}

/* Form */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--n-fg);
}

.form-label svg {
  width: 18px;
  height: 18px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 14px 60px 14px 16px;
  transition: all 0.2s;
  border: 0;
  border-radius: 18px;
  background: var(--n-fill);
  font-size: 20px;
  font-weight: 600;
  height: 60px;
  color: var(--n-fg);
}

.form-input.small {
  width: 120px;
  padding: 10px 40px 10px 12px;
}

.form-input::placeholder {
  color: var(--n-fg-faint);
  font-weight: 500;
}

.form-input:focus {
  outline: none;
  background: var(--n-lilac);
  box-shadow: 0 0 0 3px var(--n-lilac-strong);
}

.input-suffix {
  position: absolute;
  right: 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--n-fg-muted);
}

.form-hint {
  margin: 4px 0 0;
  font-size: 16px;
  color: var(--n-fg-muted);
}

/* Period Selector */
.period-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.period-option {
  cursor: pointer;
  transition: all 0.2s;
  height: 52px;
  padding: 0 22px;
  display: inline-flex;
  align-items: center;
  border: 0;
  border-radius: 16px;
  background: var(--n-fill);
  font-size: 18px;
  font-weight: 600;
  color: var(--n-fg-muted);
}

.period-option:hover {
  color: var(--n-fg);
  background: var(--n-fill-strong);
}

.period-option.selected {
  background: var(--n-violet);
  color: var(--n-on-accent);
}

.period-custom {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.period-custom .input-suffix {
  position: static;
}

/* Preview Card */
.preview-card {
  margin-top: 8px;
  padding: 28px;
  border-radius: 24px;
  background: var(--n-fill);
}

.preview-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  margin: 0 0 16px;
  font-size: 20px;
  color: var(--n-title);
}

.preview-title svg {
  width: 18px;
  height: 18px;
}

.preview-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.preview-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 16px;
  color: var(--n-fg-muted);
}

.stat-value {
  font-weight: 700;
  font-size: 20px;
  color: var(--n-fg);
  font-variant-numeric: tabular-nums;
}

.stat-value.highlight {
  color: var(--n-violet);
}

.preview-stat.success .stat-value {
  color: #22c55e;
}

.preview-stat.warning .stat-value {
  color: var(--n-warn-text);
}

/* Country Grid for Travel */
.country-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.country-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 12px;
  border: 2px solid var(--n-border);
  border-radius: var(--n-radius-md);
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.country-card:hover {
  border-color: var(--n-accent);
  transform: translateY(-2px);
}

.country-card.selected {
  border-color: var(--n-accent);
  background: var(--n-accent-wash);
}

.country-flag-img {
  width: 40px;
  height: 30px;
  object-fit: cover;
  border-radius: var(--n-radius-sm);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.country-name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--n-text);
}

.country-currency {
  font-size: 16px;
  color: var(--n-fg-muted);
}

/* Travel Tip */
.travel-tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 8px;
  padding: 18px 20px;
  border-radius: 20px;
  background: var(--n-bookmark-bg);
}

.travel-tip svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.travel-tip p {
  margin: 0;
  line-height: 1.5;
  font-size: 16px;
  color: var(--n-bookmark-text);
}

/* Buttons */
.btn-group {
  display: flex;
  gap: 12px;
  margin-top: 36px;
  justify-content: flex-end;
}

/* 다음·분석하기 — 모양은 global.css 의 .n-action 이 담당한다 */
.next-btn, .submit-btn {
  display: flex;
  flex: 0 0 auto;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  height: 60px;
  padding: 0 24px;
  border: 0;
  border-radius: 18px;
  background: var(--n-lilac);
  color: var(--n-violet-hover);
  font-size: 19px;
  font-weight: 700;
  margin-right: auto;
}

.back-btn svg {
  width: 18px;
  height: 18px;
}

.back-btn:hover {
  background: var(--n-lilac-strong);
  color: var(--n-violet-hover);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Info Cards */
.info-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 32px;
}

.info-card {
  text-align: center;
  padding: 32px 28px;
  border-radius: 28px;
  background: var(--n-surface);
  box-shadow: 0 18px 44px rgba(49, 32, 110, 0.10);
}

.info-icon {
  width: 48px;
  height: 48px;
  background: var(--n-info-bg);
  border-radius: var(--n-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
}

.info-icon svg {
  width: 24px;
  height: 24px;
  color: var(--n-info-text);
}

.info-icon.purple {
  background: var(--n-accent-wash);
}

.info-icon.purple svg {
  color: var(--n-accent);
}

.info-icon.amber {
  background: var(--n-warn-bg);
}

.info-icon.amber svg {
  color: var(--n-warn-text);
}

.info-title {
  margin: 0 0 6px;
  margin-top: 20px;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--n-title);
}

.info-text {
  margin: 0;
  margin-top: 10px;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.6;
  color: var(--n-fg-muted);
}

/* 단계 표시 — 버튼과 같은 바이올렛 계열 */
.step-item + .step-item::before {
  content: '';
  width: 56px;
  height: 3px;
  margin-right: 4px;
  border-radius: 2px;
  background: var(--n-lilac-strong);
}
.step-item.active .step-number,
.step-item.completed .step-number { background: var(--n-violet); color: var(--n-on-accent); }
.step-item.active .step-label { color: var(--n-fg); }

/* 분석 카드 */
.card-icon svg { width: 30px; height: 30px; color: var(--n-violet); }

/* 목적 카드 — 선택되면 연보라 면 + 얇은 안쪽 링 + 체크 배지 */
.purpose-card.selected::after {
  content: '';
  position: absolute;
  top: 18px; right: 18px;
  width: 30px; height: 30px;
  border-radius: 50%;
  background: var(--n-violet) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12.5l4.5 4.5L19 7.5'/%3E%3C/svg%3E") center / 16px no-repeat;
}
.purpose-svg { width: 58px; height: 58px; transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); }
.purpose-card:hover .purpose-svg { transform: translateY(-4px) rotate(-5deg) scale(1.05); }
.purpose-card.selected .purpose-title { color: var(--n-violet-hover); }

/* 선택 타일 (주거 유형·세부 목적·국가) */
.option-card,
.country-card {
  border: 0;
  border-radius: 20px;
  background: var(--n-fill);
}
.option-card:hover,
.country-card:hover { background: var(--n-fill-strong); }
.option-card.selected,
.country-card.selected {
  background: var(--n-lilac);
  box-shadow: inset 0 0 0 2px var(--n-periwinkle);
}
.option-label,
.country-name { font-size: 18px; font-weight: 600; color: var(--n-fg); }

/* 입력 */
.form-label svg { color: var(--n-violet); }
.preview-title svg { color: var(--n-violet); }
.travel-tip svg { color: #b58a1c; }

/* 버튼 */
.step-content > .next-btn { margin-left: auto; }

/* 안내 카드 — 흰 카드 + 그림자로 선명하게
   안내 카드 아이콘 — 주택 아이콘과 같은 투톤 일러스트를 연한 면 타일에 */
.info-icon,
.info-icon.purple,
.info-icon.amber {
  color: var(--n-violet);
  width: 72px;
  height: 72px;
  border-radius: 22px;
  background: var(--n-fill);
}
.info-icon svg,
.info-icon.purple svg,
.info-icon.amber svg { color: var(--n-violet); width: 46px; height: 46px; }
/* 목적 선택 헤더 아이콘 */
.card-icon--illust { background: var(--n-fill); }
.card-icon--illust svg { width: 40px; height: 40px; }

@media (max-width: 768px) {
  .main-content {
    padding: 24px 16px 40px;
  }

  .analysis-card {
    padding: 24px;
    border-radius: var(--n-radius-xl);
  }

  .purpose-grid {
    grid-template-columns: 1fr;
  }

  .option-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .option-grid.wide {
    grid-template-columns: repeat(2, 1fr);
  }

  .info-cards {
    grid-template-columns: 1fr;
  }

  .step-indicator {
    gap: 12px;
  }

  .step-label {
    display: none;
  }

  .preview-stats {
    grid-template-columns: 1fr;
  }
}</style>