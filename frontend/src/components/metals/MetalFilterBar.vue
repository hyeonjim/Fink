<template>
  <div class="filter-bar">
    <div class="filter-card">
      <!-- Date Range -->
      <div class="filter-group">
        <label class="filter-label">기간 설정</label>
        <div class="date-inputs">
          <div class="date-input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <input type="date" v-model="start" class="date-input" />
          </div>
          <span class="date-separator">~</span>
          <div class="date-input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <input type="date" v-model="end" class="date-input" />
          </div>
        </div>
      </div>

      <!-- Date Buttons -->
      <div class="filter-group">
        <div class="action-buttons">
          <button class="btn btn-primary" @click="applyDates">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            조회
          </button>
          <button class="btn btn-secondary" @click="store.resetDates">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            전체
          </button>
        </div>
      </div>

      <!-- Metal Toggle -->
      <div class="filter-group">
        <label class="filter-label">귀금속 선택</label>
        <div class="metal-toggle">
          <button
            class="metal-btn metal-btn-gold"
            :class="{ active: store.metal === 'gold' }"
            @click="store.setMetal('gold')"
          >
            <span class="metal-icon gold">Au</span>
            금
          </button>
          <button
            class="metal-btn"
            :class="{ active: store.metal === 'silver' }"
            @click="store.setMetal('silver')"
          >
            <span class="metal-icon silver">Ag</span>
            은
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMetalsStore } from '@/stores/metals'

const store = useMetalsStore()

const start = ref(store.startDate)
const end = ref(store.endDate)

const applyDates = () => {
  store.setDates(start.value, end.value)
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════
   현물 필터 바 — 무채색.
   금/은은 실제로 다른 자산이라 구분은 남기되, 채도를 낮춰 절제한다.
   ═══════════════════════════════════════════════════════════════════ */
.filter-bar {
  margin-bottom: 0;
  position: relative;
  z-index: 2;
  margin-top: -48px;
}

.filter-card {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 24px;
  padding: 28px;
  border: 0;
  border-radius: 28px;
  background: var(--n-surface);
  box-shadow: var(--n-shadow-float);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--n-fg-muted);
}

/* ── 날짜 입력 ───────────────────────────────────────────────────── */
.date-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  pointer-events: none;
  left: 20px;
  width: 20px;
  height: 20px;
  color: var(--n-fg-muted);
}

.date-input {
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
  height: 60px;
  padding: 0 20px 0 50px;
  border: 0;
  border-radius: 18px;
  background: var(--n-fill);
  font-size: 16px;
  font-weight: 600;
  color: var(--n-fg);
  font-variant-numeric: tabular-nums;
}

.date-input:hover:not(:focus) {
  background: var(--n-lilac);
}

.date-input:focus {
  outline: none;
  background: var(--n-lilac);
  box-shadow: 0 0 0 3px var(--n-lilac-strong);
}

.date-separator {
  font-size: 20px;
  font-weight: 600;
  color: var(--n-fg-muted);
}

/* ── 버튼 ────────────────────────────────────────────────────────── */
.action-buttons {
  display: flex;
  gap: 10px;
}

/* 버튼의 색·테두리·상태는 global.css 의 .btn/.btn-primary/.btn-secondary 가
   담당한다. 여기에는 이 필터바 높이(40px)에 맞추는 치수만 남긴다. */
.btn {
  height: 60px;
  padding: 0 28px;
  gap: 10px;
  border: 0;
  border-radius: 18px;
  font-size: 18px;
  font-weight: 700;
  box-shadow: none;
  background-image: none;
}

.btn svg {
  width: 20px;
  height: 20px;
}

/* ── 금/은 토글 ──────────────────────────────────────────────────── */
.metal-toggle {
  display: flex;
  gap: 4px;
  padding: 5px;
  border-radius: 18px;
  background: var(--n-fill);
}

.metal-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--n-text-body);
  background: transparent;
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-sm);
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}

.metal-btn:hover {
  border-color: var(--n-border-strong);
}

.metal-btn.active,
.metal-btn.metal-btn-gold.active {
  background: var(--n-bg-sunken);
  border-color: var(--n-text-muted);
  color: var(--n-text);
  font-weight: 600;
}

.metal-btn.metal-btn-gold {
  border-color: var(--n-border);
  background: transparent;
  color: var(--n-text-body);
}

.metal-btn.metal-btn-gold:hover {
  border-color: var(--n-border-strong);
}

/* 원소기호 칩 — 금/은의 실제 톤만 아주 옅게 남긴다 */
.metal-icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 16px;
  font-weight: 800;
}

.metal-icon.gold {
  background: #f1e3b8;
  color: #6b5314;
}

.metal-icon.silver {
  background: #e6e4ec;
  color: #4a4758;
}
/* ═══ F!NK 리디자인 — 필터 카드 (헤더에 겹쳐 뜸) ═══ */
.filter-group:last-child { margin-left: auto; }
.btn-primary { background: var(--n-violet); color: var(--n-on-accent); }
.btn-primary:hover { background: var(--n-violet-hover); }
.btn-secondary { background: var(--n-lilac); color: var(--n-violet-hover); }
.btn-secondary:hover { background: var(--n-lilac-strong); }

/* 금/은 토글 — 선택되면 금·은색 면 (무채색에 가까운 톤) */
.metal-btn,
.metal-btn.metal-btn-gold { height: 50px; padding: 0 20px 0 10px; gap: 10px; border: 0; border-radius: 14px; background: transparent; font-size: 20px; font-weight: 600; color: var(--n-fg-muted); }
.metal-btn:hover,
.metal-btn.metal-btn-gold:hover { color: var(--n-fg); }
.metal-btn.metal-btn-gold.active { background: var(--n-gold-btn); color: #1d1a2b; }
.metal-btn.active:not(.metal-btn-gold) { background: var(--n-silver-btn); color: #1d1a2b; }

@media (max-width: 768px) {
  .filter-card {
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
    padding: 18px;
  }

  .date-inputs {
    flex-direction: column;
    align-items: stretch;
  }

  .date-separator {
    text-align: center;
  }

  .action-buttons,
  .metal-toggle {
    width: 100%;
  }

  .btn,
  .metal-btn {
    flex: 1;
    justify-content: center;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   Dark mode — 토큰이 대부분 처리한다. 금 칩만 어두운 톤으로 보정.
   ═══════════════════════════════════════════════════════════════════ */
[data-theme='dark'] .metal-icon.gold {
  background: #3a3118;
  color: #d8c08a;
}
</style>
