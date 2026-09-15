import { onMounted, onUnmounted } from 'vue'

/**
 * v-reveal 디렉티브
 * 요소가 뷰포트에 들어오면 .is-visible 을 붙인다. 실제 등장 효과는 CSS가 담당.
 * 값으로 스태거 인덱스를 넘길 수 있다. 예) v-reveal="2" → 160ms 지연
 */
export const vReveal = {
  mounted(el, binding) {
    el.classList.add('reveal')

    const index = Number(binding.value) || 0
    if (index > 0) {
      el.style.setProperty('--reveal-delay', `${index * 80}ms`)
    }

    // IntersectionObserver 미지원 환경에서는 그냥 보이게 둔다
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (!entry.isIntersecting) return
        el.classList.add('is-visible')
        obs.unobserve(el) // 한 번만 실행 — 재진입 시 깜빡임 방지
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    )

    observer.observe(el)
    el._revealObserver = observer
  },

  unmounted(el) {
    el._revealObserver?.disconnect()
    delete el._revealObserver
  },
}

/**
 * 스크롤 패럴랙스
 * 대상 요소의 뷰포트 내 진행도(0~1)를 --parallax 로 노출한다.
 * CSS에서 transform: translate3d(0, calc(var(--parallax) * -40px), 0) 식으로 쓴다.
 *
 * @param {import('vue').Ref<HTMLElement|null>} targetRef
 */
export function useParallax(targetRef) {
  let frame = null

  const update = () => {
    frame = null
    const el = targetRef.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    const viewport = window.innerHeight

    // 요소가 화면을 지나가는 동안의 진행도. 화면 밖이면 0/1로 고정된다.
    const raw = (viewport - rect.top) / (viewport + rect.height)
    const progress = Math.min(Math.max(raw, 0), 1)

    el.style.setProperty('--parallax', progress.toFixed(4))
  }

  const onScroll = () => {
    if (frame !== null) return // rAF로 스로틀
    frame = requestAnimationFrame(update)
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
  })

  onUnmounted(() => {
    if (frame !== null) cancelAnimationFrame(frame)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })
}
