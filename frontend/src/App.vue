<template>
  <div class="app">
    <AppHeader />
    <main class="main-content">
      <RouterView />
    </main>
    <AppFooter />
    <ChatBot />
  </div>
</template>

<script setup>
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import ChatBot from './components/ChatBot.vue'
</script>

<style scoped>
/* 푸터가 짧은 화면에서도 바닥에 붙도록 세로 flex (AppFooter 의 margin-top: auto) */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--n-canvas);
}

.main-content {
  flex: 1;
  width: 100%;
}
</style>
