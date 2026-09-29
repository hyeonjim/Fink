<template>
  <article class="video-card">
    <div class="thumb-wrapper">
      <img v-if="thumb" :src="thumb" class="thumb" alt="thumbnail" />
      <div class="thumb-overlay">
        <RouterLink
          v-if="videoId"
          class="play-btn"
          :to="{ name: 'YoutubeVideoDetailView', params: { id: videoId } }"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </RouterLink>
      </div>
    </div>

    <div class="body">
      <h4 class="title" :title="title">{{ title }}</h4>
      <p class="channel" :title="channel">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        {{ channel }}
      </p>

      <RouterLink
        v-if="videoId"
        class="detail-link"
        :to="{ name: 'YoutubeVideoDetailView', params: { id: videoId } }"
      >
        상세보기
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </RouterLink>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  item: { type: Object, required: true },
})

// HTML 엔티티 디코딩 함수
const decodeHtmlEntities = (text) => {
  if (!text) return ''
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

const videoId = computed(() => props.item?.id?.videoId)
const title = computed(() => decodeHtmlEntities(props.item?.snippet?.title ?? ''))
const channel = computed(() => decodeHtmlEntities(props.item?.snippet?.channelTitle ?? ''))
const thumb = computed(() =>
  props.item?.snippet?.thumbnails?.medium?.url
  ?? props.item?.snippet?.thumbnails?.default?.url
  ?? ''
)
</script>

<style scoped>
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
  width: 56px;
  height: 56px;
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
  width: 28px;
  height: 28px;
  margin-left: 3px;
}

.body {
  padding: 16px;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
}

.title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--n-text);
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.channel {
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

.channel svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.detail-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding: 10px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--n-accent);
  background: var(--n-accent-wash);
  border-radius: var(--n-radius-md);
  text-decoration: none;
  text-align: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.detail-link svg {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.detail-link:hover {
  background: var(--n-accent);
  color: white;
}

.detail-link:hover svg {
  transform: translateX(3px);
}
/* ═══ F!NK 리디자인 — 영상 카드 (연한 면, hover 때 떠오름) ═══ */
.video-card { border: 0; border-radius: 24px; background: var(--fk-surface); transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s; }
.video-card:hover { transform: translateY(-6px); box-shadow: var(--fk-shadow-hover); border-color: transparent; }
.thumb-wrapper { border-radius: 0; }
.play-btn { width: 56px; height: 56px; border-radius: 50%; background: rgba(255, 255, 255, 0.28); color: #fff; }
.video-card:hover .play-btn,
.play-btn:hover { background: #fff; color: var(--fk-ink); transform: scale(1.08); }
.body { padding: 20px; gap: 10px; }
.title { min-height: 58px; font-size: 20px; font-weight: 600; line-height: 1.45; letter-spacing: -0.02em; color: var(--fk-title); }
.channel { font-size: 16px; font-weight: 500; color: var(--fk-muted); }
.detail-link { font-size: 16px; font-weight: 600; color: var(--fk-ink); border: 0; padding: 0; background: none; }
.detail-link:hover { color: var(--fk-muted); background: none; }
</style>

