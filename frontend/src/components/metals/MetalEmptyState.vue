<template>
  <div class="empty-wrap">
    <div class="empty-state empty-state--warn">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      </div>
      <p class="empty-title">데이터가 없습니다</p>
      <span class="empty-text">{{ message || '조건에 해당하는 데이터가 없습니다.' }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: String,
})
</script>

<style scoped>
/* 빈 상태 자체의 모양은 global.css 22번 섹션이 담당한다.
   여기에는 이 컴포넌트를 가운데에 놓는 배치만 남긴다. */
.empty-wrap {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.empty-state {
  max-width: 400px;
  padding: 60px 40px;
}</style>
