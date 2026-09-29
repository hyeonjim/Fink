<template>
  <section class="comments-section">
    <div class="comments-header">
      <div class="header-left">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        </div>
        <h3>댓글 <span class="count">{{ comments.length }}</span></h3>
      </div>
      <div class="sort-buttons">
        <button 
          class="sort-btn" 
          :class="{ active: sortType === 'latest' }" 
          type="button" 
          @click="changeSortType('latest')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <polyline points="19 12 12 19 5 12"/>
          </svg>
          최신순
        </button>
        <button 
          class="sort-btn" 
          :class="{ active: sortType === 'likes' }" 
          type="button" 
          @click="changeSortType('likes')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          좋아요순
        </button>
      </div>
    </div>

    <ul v-if="comments.length" class="comments-list">
      <li v-for="c in sortedComments" :key="c.id" class="comment-item">
        <!-- 수정 모드 -->
        <template v-if="editingId === c.id">
          <div class="edit-mode">
            <input 
              v-model.trim="editContent" 
              class="edit-input" 
              placeholder="댓글 수정" 
            />
            <div class="edit-actions">
              <button class="btn-save" type="button" @click="onSaveEdit(c.id)" :disabled="!editContent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                저장
              </button>
              <button class="btn-cancel" type="button" @click="cancelEdit">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                취소
              </button>
            </div>
          </div>
        </template>

        <!-- 보기 모드 -->
        <template v-else>
          <div class="comment-main">
            <div class="comment-avatar">
              {{ (c.author_nickname ?? '익').charAt(0) }}
            </div>
            <div class="comment-body">
              <div class="comment-meta">
                <strong class="author">{{ c.author_nickname ?? '익명' }}</strong>
                <span class="date">{{ formatDate(c.created_at) }}</span>
              </div>
              <div class="comment-content">{{ c.content }}</div>
              <div class="comment-footer">
                <button 
                  class="like-btn" 
                  :class="{ liked: c.is_liked }" 
                  type="button" 
                  @click="onToggleCommentLike(c.id)"
                >
                  <svg viewBox="0 0 24 24" :fill="c.is_liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                  <span>{{ c.likes_count ?? 0 }}</span>
                </button>
              </div>
            </div>
          </div>

          <div v-if="isAuthor(c)" class="comment-actions">
            <button class="action-btn edit" type="button" @click="startEdit(c)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="action-btn delete" type="button" @click="onDelete(c.id)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </button>
          </div>
        </template>
      </li>
    </ul>

    <div v-else class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
      <p>아직 댓글이 없습니다.<br>첫 댓글을 작성해보세요!</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAccountStore } from '@/stores/accounts'

const props = defineProps({
  comments: { type: Array, default: () => [] },
})

const emit = defineEmits(['delete', 'update', 'toggle-like'])

const accountStore = useAccountStore()

// 정렬 타입
const sortType = ref('latest')

// 정렬된 댓글 목록
const sortedComments = computed(() => {
  const commentsCopy = [...props.comments]
  if (sortType.value === 'latest') {
    return commentsCopy.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  } else if (sortType.value === 'likes') {
    return commentsCopy.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
  }
  return commentsCopy
})

// 정렬 타입 변경
const changeSortType = (type) => {
  sortType.value = type
}

// 수정 모드 상태
const editingId = ref(null)
const editContent = ref('')

// 현재 로그인 유저가 댓글 작성자인지 확인
const isAuthor = (comment) => {
  if (!accountStore.nickname) return false
  return accountStore.nickname === comment.author_nickname
}

// 수정 시작
const startEdit = (comment) => {
  editingId.value = comment.id
  editContent.value = comment.content
}

// 수정 취소
const cancelEdit = () => {
  editingId.value = null
  editContent.value = ''
}

// 수정 저장
const onSaveEdit = (id) => {
  emit('update', { id, content: editContent.value })
  cancelEdit()
}

// 삭제
const onDelete = (id) => {
  const ok = window.confirm('댓글을 삭제할까요?')
  if (!ok) return
  emit('delete', id)
}

const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

// ✅ 댓글 좋아요 토글 요청 (로그인 체크 없음)
const onToggleCommentLike = (commentId) => {
  emit('toggle-like', commentId)
}

</script>

<style scoped>
.comments-section {
  background: var(--n-bg);
  border-radius: var(--n-radius-xl);
  padding: 24px;
  border: 1px solid var(--n-border);
  margin-top: 16px;
}

.comments-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--n-border);
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 40px;
  height: 40px;
  color: var(--n-accent);
  border-radius: var(--n-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon svg {
  width: 20px;
  height: 20px;
  color: #616064;
}

.comments-header h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--n-text);
  margin: 0;
}

.comments-header .count {
  color: #929294;
  margin-left: 4px;
}

/* Sort Buttons */
.sort-buttons {
  display: flex;
  gap: 8px;
}

.sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--n-text-muted);
  background: var(--n-bg);
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.sort-btn svg {
  width: 14px;
  height: 14px;
}

.sort-btn:hover {
  background: var(--n-bg-subtle);
  border-color: var(--n-border-strong);
  color: var(--n-text-body);
}

.sort-btn.active {
  color: rgb(97, 96, 99);
  background: #e7e8e9;
  border-color: transparent;
}

/* Comments List */
.comments-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: var(--n-bg-subtle);
  border-radius: var(--n-radius-md);
  transition: background 0.2s;
}

.comment-item:hover {
  background: var(--n-bg-sunken);
}

.comment-main {
  display: flex;
  gap: 12px;
  flex: 1;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  background: var(--n-accent);
  border-radius: var(--n-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--n-on-accent);
  flex-shrink: 0;
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.author {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--n-text);
}

.date {
  font-size: 0.75rem;
  color: var(--n-text-muted);
}

.comment-content {
  font-size: 0.9375rem;
  color: var(--n-text-body);
  line-height: 1.6;
  white-space: pre-wrap;
}

.comment-footer {
  margin-top: 10px;
}

.like-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--n-text-muted);
  background: var(--n-bg);
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-xl);
  cursor: pointer;
  transition: all 0.2s;
}

.like-btn svg {
  width: 14px;
  height: 14px;
}

.like-btn:hover {
  background: var(--n-danger-bg);
  border-color: var(--n-danger-bg);
  color: var(--n-danger-text);
}

.like-btn.liked {
  background: var(--n-danger-bg);
  border-color: var(--n-danger-bg);
  color: var(--n-danger-text);
}

/* Comment Actions */
.comment-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--n-bg);
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn svg {
  width: 14px;
  height: 14px;
  color: var(--n-text-muted);
}

.action-btn.edit:hover {
  background: var(--n-ok-bg);
  border-color: var(--n-ok-bg);
}

.action-btn.edit:hover svg {
  color: var(--n-ok-text);
}

.action-btn.delete:hover {
  background: var(--n-danger-bg);
  border-color: var(--n-danger-bg);
}

.action-btn.delete:hover svg {
  color: var(--n-danger-text);
}

/* Edit Mode */
.edit-mode {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.edit-input {
  width: 100%;
  padding: 12px 14px;
  font-size: 0.9375rem;
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-md);
  background: var(--n-bg);
  transition: all 0.2s;
  box-sizing: border-box;
}

.edit-input:focus {
  outline: none;
  border-color: var(--n-accent);
  box-shadow: 0 0 0 3px var(--n-accent-wash);
}

.edit-actions {
  display: flex;
  gap: 8px;
}

.btn-save,
.btn-cancel {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: var(--n-radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save svg,
.btn-cancel svg {
  width: 14px;
  height: 14px;
}

.btn-save {
  color: var(--n-on-accent);
  background: var(--n-accent);
  border: none;
}

.btn-save:hover {
  box-shadow: none;
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-cancel {
  color: var(--n-text-body);
  background: var(--n-bg);
  border: 1px solid var(--n-border);
}

.btn-cancel:hover {
  background: var(--n-bg-sunken);
}

/* Empty State */
.empty-state {
  padding: 40px 20px;
  text-align: center;
}

.empty-state svg {
  width: 48px;
  height: 48px;
  color: var(--n-border-strong);
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 0.9375rem;
  color: var(--n-text-muted);
  line-height: 1.6;
  margin: 0;
}</style>
