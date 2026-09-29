<template>
  <form class="comment-create" @submit.prevent="submit">
    <div class="create-header">
      <div class="avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      <div class="input-wrapper">
        <input 
          v-model.trim="content" 
          class="comment-input" 
          placeholder="댓글을 입력하세요..." 
        />
      </div>
      <button class="btn-submit" type="submit" :disabled="!content">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit'])
const content = ref('')

const submit = () => {
  // ✅ 부모로 댓글 내용 전달
  emit('submit', content.value)
  content.value = ''
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════
   댓글 작성 — 무채색.
   ═══════════════════════════════════════════════════════════════════ */
.comment-create {
  margin-top: 12px;
  padding: 16px;
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-md);
  background: var(--n-bg);
}

.create-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: var(--n-radius-md);
  background: var(--n-accent);
}

.avatar svg {
  width: 19px;
  height: 19px;
  color: var(--n-on-accent);
}

.input-wrapper {
  flex: 1;
}

.comment-input {
  width: 100%;
  padding: 11px 14px;
  font-size: 0.9375rem;
  color: var(--n-text);
  border: 1px solid var(--n-border);
  border-radius: var(--n-radius-sm);
  background: var(--n-bg);
  box-sizing: border-box;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.comment-input:hover:not(:focus) {
  border-color: var(--n-border-strong);
}

.comment-input:focus {
  outline: none;
  border-color: var(--n-accent);
  box-shadow: 0 0 0 3px var(--n-accent-wash);
}

.comment-input::placeholder {
  color: var(--n-text-muted);
}

.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border: 1px solid var(--n-accent);
  border-radius: var(--n-radius-sm);
  background: var(--n-accent);
  cursor: pointer;
  transition: background-color 0.18s ease, border-color 0.18s ease;
}

.btn-submit svg {
  width: 19px;
  height: 19px;
  color: var(--n-on-accent);
}

.btn-submit:hover:not(:disabled) {
  background: var(--n-accent-hover);
  border-color: var(--n-accent-hover);
}

.btn-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
