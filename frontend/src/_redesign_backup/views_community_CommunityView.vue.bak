<template>
  <div class="community-page">
    <!-- Page Header -->
    <header class="n-page-header">
      <div class="n-page-header-content">
        <div class="n-page-header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
          </svg>
        </div>
        <div class="n-page-header-text">
          <h1 class="n-page-title">커뮤니티</h1>
          <p class="n-page-subtitle">다양한 이야기를 나눠보세요</p>
        </div>
        <RouterLink class="create-btn" :to="{ name: 'CreateView' }">
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
  background: var(--n-bg);
}

.create-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 18px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #fff;
  background: var(--n-accent);
  border-radius: var(--n-radius-sm);
  text-decoration: none;
  transition: background-color 0.18s ease, border-color 0.18s ease;
  flex-shrink: 0;
}

.create-btn:hover {
  background: var(--n-accent-hover);
  border-color: var(--n-accent-hover);
}

.create-btn svg {
  width: 18px;
  height: 18px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 48px 24px;
}

/* Board */
.board-section {
  margin-bottom: 24px;
}

.board-card {
  background: var(--n-bg);
  border-radius: var(--n-radius-xl);
  border: 1px solid var(--n-border);
  overflow: hidden;
}

.board-header {
  display: grid;
  grid-template-columns: 1fr 140px 140px 80px;
  align-items: center;
  padding: 16px 24px;
  background: var(--n-bg-subtle);
  border-bottom: 2px solid var(--n-border);
  font-size: 1rem;
  font-weight: 700;
  color: var(--n-text-body);
}

.board-body {
  max-height: 600px;
  overflow-y: auto;
}

.board-row {
  display: grid;
  grid-template-columns: 1fr 140px 140px 80px;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--n-bg-sunken);
  transition: background 0.2s;
}

.board-row:last-child {
  border-bottom: none;
}

.board-row:hover {
  background: var(--n-bg-subtle);
}

.board-row.notice {
  background: var(--n-accent-wash);
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
  font-size: 20px;
  font-weight: 500;
  color: var(--n-text);
  transition: color 0.2s;
}

.article-link:hover .article-title {
  color: var(--n-accent);
}

.comment-count {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--n-accent);
  background: var(--n-accent-wash);
  padding: 3px 8px;
  border-radius: var(--n-radius-md);
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
  color: var(--n-text-body);
}

.col-date {
  color: var(--n-text-muted);
}

.col-views {
  font-weight: 600;
  color: var(--n-text-muted);
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
  font-size: 1rem;
  font-weight: 600;
  color: var(--n-text-body);
  margin: 0 0 4px;
}

.empty-state span {
  font-size: 0.875rem;
  color: var(--n-text-muted);
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
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--n-text-body);
  background: var(--n-bg);
  border: 2px solid var(--n-border);
  border-radius: var(--n-radius-md);
  cursor: pointer;
  transition: all 0.2s;
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
  background: var(--n-accent);
  border-color: transparent;
  color: white;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Responsive */
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
