<template>
  <section class="saved-videos">
    <!-- Header -->
    <div class="section-header">
      <div class="header-left">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="M10 9l5 3-5 3V9z"/>
          </svg>
        </div>
        <div>
          <h3 class="section-title">저장된 비디오</h3>
          <span class="section-count">{{ videoStore.savedVideos.length }}개의 비디오</span>
        </div>
      </div>
      <button 
        class="clear-btn" 
        @click="videoStore.clearVideos" 
        :disabled="!videoStore.savedVideos.length"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
        </svg>
        전체 삭제
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="!videoStore.savedVideos.length" class="empty-state empty-state--danger">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="M10 9l5 3-5 3V9z"/>
        </svg>
      </div>
      <p class="empty-title">저장된 비디오가 없습니다</p>
      <span class="empty-text">검색에서 마음에 드는 영상을 저장해보세요</span>
      <RouterLink class="search-link" :to="{ name: 'YoutubeSearchView' }">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        비디오 검색하기
      </RouterLink>
    </div>

    <!-- Video Grid -->
    <div v-else class="video-grid">
      <article class="video-card" v-for="v in videoStore.savedVideos" :key="v.id">
        <div class="thumb-wrapper">
          <img v-if="v.thumbnail" :src="v.thumbnail" class="thumb" alt="thumbnail" />
          <div class="thumb-overlay">
            <RouterLink
              class="play-btn"
              :to="{ name: 'YoutubeVideoDetailView', params: { id: v.id } }"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </RouterLink>
          </div>
        </div>

        <div class="video-body">
          <h4 class="video-title">{{ v.title }}</h4>
          <p class="video-channel">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {{ v.channelTitle }}
          </p>

          <div class="video-actions">
            <RouterLink
              class="action-btn view-btn"
              :to="{ name: 'YoutubeVideoDetailView', params: { id: v.id } }"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              보기
            </RouterLink>

            <button class="action-btn delete-btn" @click="videoStore.removeVideo(v.id)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
              삭제
            </button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useVideoStore } from '@/stores/youtube/videos'

const videoStore = useVideoStore()
</script>

<style scoped src="../../assets/styles/youtube-saved.scoped.css"></style>

<style scoped>
.saved-videos {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.search-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--n-on-accent);
  background: var(--n-accent);
  border-radius: var(--n-radius-md);
  text-decoration: none;
  transition: all 0.2s;
}

.search-link svg {
  width: 18px;
  height: 18px;
}

/* Video Grid */
.video-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.video-card {
  background: var(--n-bg);
  border-radius: var(--n-radius-lg);
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.thumb-wrapper {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: var(--n-bg-sunken);
  transition: transform 0.3s ease;
}

.video-card:hover .thumb {
  transform: scale(1.05);
}

.thumb-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.video-card:hover .thumb-overlay {
  opacity: 1;
}

.play-btn {
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--n-danger-text);
  transition: transform 0.2s ease;
}

.play-btn:hover {
  transform: scale(1.1);
}

.play-btn svg {
  width: 24px;
  height: 24px;
  margin-left: 3px;
}

.video-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.video-title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--n-text);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-channel {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-size: 0.8125rem;
  color: var(--n-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-channel svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.video-actions {
  margin-top: auto;
  display: flex;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 1;
  padding: 10px 12px;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: var(--n-radius-md);
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.action-btn svg {
  width: 14px;
  height: 14px;
}

.view-btn {
  color: var(--n-accent);
  background: var(--n-accent-wash);
  border: none;
}

.view-btn:hover {
  background: var(--n-accent);
  color: var(--n-on-accent);
}

.delete-btn {
  color: var(--n-danger-text);
  background: var(--n-bg);
  border: 1px solid var(--n-danger-bg);
}

.delete-btn:hover {
  background: var(--n-danger-bg);
  border-color: var(--n-danger-text);
}

/* Responsive */
@media (max-width: 768px) {

  .video-grid {
    grid-template-columns: 1fr;
  }
}</style>
