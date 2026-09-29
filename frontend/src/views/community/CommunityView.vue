<template>
  <div class="community-page">
    <!-- Page Header -->
    <header class="n-page-header">
      <div class="n-page-header-content">
        <div class="n-page-header-icon">
          <svg viewBox="0 0 64 64" aria-hidden="true"><rect x="4" y="8" width="38" height="28" rx="11" fill="#9588df"/><path d="M12 32 10 44l12-9z" fill="#9588df"/><rect x="22" y="24" width="38" height="26" rx="11" fill="#bb8ec7"/><path d="M50 46l3 12-12-9z" fill="#bb8ec7"/><circle cx="33" cy="37" r="2.8" fill="#fff"/><circle cx="41" cy="37" r="2.8" fill="#fff"/><circle cx="49" cy="37" r="2.8" fill="#1d1a2b"/></svg>
        </div>
        <div class="n-page-header-text">
          <h1 class="n-page-title">커뮤니티</h1>
          <p class="n-page-subtitle">다양한 이야기를 나눠보세요</p>
        </div>
        <RouterLink class="create-btn n-action n-action--primary" :to="{ name: 'CreateView' }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          글 작성하기
        </RouterLink>
      </div>
    </header>

    <div class="container">

      <!-- Board -->
      <section class="board-section">
        <div class="board-card">
          <!-- Board Header -->
          <div class="board-header">
            <div class="col-title">제목</div>
            <div class="col-author">작성자</div>
            <div class="col-date">작성일</div>
            <div class="col-views">조회</div>
          </div>

          <!-- Board Body -->
          <div class="board-body">
            <article
              v-for="article in store.articles"
              :key="article.id"
              class="board-row"
              :class="{ notice: article.is_notice }"
            >
              <div class="col-title">
                <RouterLink
                  class="article-link"
                  :to="{ name: 'DetailView', params: { id: article.id } }"
                >
                  <span class="article-title">{{ article.title }}</span>
                </RouterLink>

                <span v-if="article.comments_count" class="comment-count">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                  {{ article.comments_count }}
                </span>

                <span v-if="article.has_image" class="attach-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </span>
              </div>

              <div class="col-author">
                {{ article.author_nickname ?? article.author }}
              </div>

              <div class="col-date">
                {{ formatDate(article.created_at) }}
              </div>

              <div class="col-views">
                {{ article.views }}
              </div>
            </article>

            <!-- Empty State -->
            <div v-if="!store.articles.length" class="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <path d="M14 2v6h6"/>
                <path d="M16 13H8"/>
                <path d="M16 17H8"/>
                <path d="M10 9H8"/>
              </svg>
              <p>아직 게시글이 없습니다</p>
              <span>첫 번째 글을 작성해보세요!</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Pagination -->
      <footer class="pagination">
        <button 
          class="page-btn" 
          :disabled="page <= 1" 
          @click="go(page - 1)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <button
          v-for="p in totalPages"
          :key="p"
          class="page-num"
          :class="{ active: p === page }"
          @click="go(p)"
        >
          {{ p }}
        </button>

        <button 
          class="page-btn" 
          :disabled="page >= totalPages" 
          @click="go(page + 1)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useCommunityStore } from '@/stores/community'

const store = useCommunityStore()

const page = ref(1)
const totalPages = computed(() => store.totalPages ?? 10)

const fetchArticles = () => {
  store.getArticles(page.value)
}

onMounted(() => {
  fetchArticles()
})

const go = (p) => {
  page.value = p
  fetchArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}
</script>

<style scoped>
.community-page {
  min-height: calc(100vh - 72px);
  background: var(--n-page);
}

/* 글쓰기 — 모양은 global.css 의 .n-action 이 담당한다 */
.create-btn {
  flex-shrink: 0;
  transition: background-color 0.18s ease, border-color 0.18s ease;
}

.container {
  margin: 0 auto;
  max-width: 1200px;
  padding: 48px 24px 120px;
}

/* Board */
.board-section {
  margin-bottom: 32px;
}

.board-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  border: 0;
  border-radius: 28px;
  background: var(--n-surface);
  box-shadow: var(--n-shadow);
}

.board-header {
  display: grid;
  align-items: center;
  grid-template-columns: minmax(0, 1fr) 160px 160px 100px;
  padding: 16px 24px;
  border: 0;
  border-radius: 18px;
  background: var(--n-fill);
  font-size: 16px;
  font-weight: 600;
  color: var(--n-fg-muted);
}

.board-body {
  max-height: none;
  overflow: visible;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.board-row {
  display: grid;
  align-items: center;
  transition: background 0.2s;
  grid-template-columns: minmax(0, 1fr) 160px 160px 100px;
  padding: 20px 24px;
  border: 0;
  border-radius: 18px;
}

.board-row:last-child {
  border-bottom: none;
}

.board-row:hover {
  background: var(--n-fill);
}

.board-row.notice {
  background: var(--n-lilac);
}

.col-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.article-link {
  text-decoration: none;
}

.article-title {
  transition: color 0.2s;
  font-size: 20px;
  font-weight: 500;
  color: var(--n-fg);
}

.article-link:hover .article-title {
  color: var(--n-fg-muted);
  text-decoration: underline;
}

.comment-count {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  gap: 4px;
  border-radius: 999px;
  background: var(--n-lilac);
  font-size: 16px;
  font-weight: 700;
  color: var(--n-violet);
}

.comment-count svg {
  width: 12px;
  height: 12px;
}

.attach-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.attach-badge svg {
  width: 16px;
  height: 16px;
  color: var(--n-text-muted);
}

.col-author {
  font-size: 18px;
  color: var(--n-fg);
}

.col-date {
  font-size: 18px;
  color: var(--n-fg-muted);
  font-variant-numeric: tabular-nums;
}

.col-views {
  font-size: 18px;
  font-weight: 600;
  color: var(--n-fg-muted);
  font-variant-numeric: tabular-nums;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 24px;
  text-align: center;
}

.empty-state svg {
  width: 48px;
  height: 48px;
  color: var(--n-border-strong);
  margin-bottom: 16px;
}

.empty-state p {
  font-weight: 600;
  margin: 0 0 4px;
  font-size: 20px;
  color: var(--n-fg);
}

.empty-state span {
  font-size: 16px;
  color: var(--n-fg-muted);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.page-btn,
.page-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 44px;
  height: 44px;
  border: 0;
  border-radius: 12px;
  background: var(--n-fill);
  color: var(--n-fg);
  font-size: 18px;
  font-weight: 700;
}

.page-btn svg {
  width: 18px;
  height: 18px;
}

.page-btn:hover:not(:disabled),
.page-num:hover {
  border-color: var(--n-accent);
  color: var(--n-accent);
}

.page-num.active {
  color: var(--n-on-accent);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  color: var(--n-fg-faint);
}
/* ═══════════════════════════════════════════════════════════════════
   F!NK 리디자인 — 게시판 (흰 카드 + 그림자, 행 구분은 hover 면)
   페이지 번호는 그레이 계열.
   ═══════════════════════════════════════════════════════════════════ */
.board-header .col-author,
.board-header .col-date,
.board-header .col-views,
.board-row .col-author,
.board-row .col-date,
.board-row .col-views { text-align: center; }
.page-num:hover,
.page-btn:hover:not(:disabled) { background: var(--n-fill-strong); }
.page-num.active { background: #6b6975; }

@media (max-width: 768px) {
  .create-btn {
    width: 100%;
    justify-content: center;
  }

  .container {
    padding: 32px 16px;
  }

  .board-header {
    display: none;
  }

  .board-row {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 20px;
  }

  .col-author,
  .col-date,
  .col-views {
    display: inline-block;
    font-size: 0.75rem;
  }

  .col-title {
    flex-wrap: wrap;
  }
}</style>
