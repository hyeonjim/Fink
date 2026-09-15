<template>
  <div class="chart-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Chart } from 'chart.js/auto'

const props = defineProps({
  labels: Array,
  prices: Array,
  metal: String,
})

const canvas = ref(null)
let chart = null

// 테마 감지
const isDarkMode = () => document.documentElement.getAttribute('data-theme') === 'dark'

/* 색상 팔레트.
   금/은은 실제로 다른 자산이라 선 색은 구분하되, 채도를 낮춰
   나머지 화면의 무채색 톤과 어긋나지 않게 한다. */
const getColors = () => {
  const isGold = props.metal === 'gold'
  const dark = isDarkMode()

  const line = isGold
    ? (dark ? '#c9ab6b' : '#8a6d3b')
    : (dark ? '#a8a29e' : '#78716c')

  return {
    primary: line,
    // 영역 채움은 데이터를 읽는 데 쓰이므로 남기되 단일 톤으로 옅게 깐다
    fill: dark ? 'rgba(168, 162, 158, 0.10)' : 'rgba(120, 113, 108, 0.08)',
    gridColor: dark ? 'rgba(250, 250, 249, 0.07)' : 'rgba(41, 41, 48, 0.07)',
    textColor: dark ? '#a8a29e' : '#78716c',
    tooltipBg: dark ? '#191919' : '#ffffff',
    tooltipText: dark ? '#fafaf9' : '#292930',
    tooltipBorder: dark ? '#2a2a2a' : '#e7e5e4',
  }
}

const drawChart = () => {
  if (chart) chart.destroy()
  if (!canvas.value || !props.labels?.length || !props.prices?.length) return

  const ctx = canvas.value.getContext('2d')
  const colors = getColors()

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: [
        {
          label: props.metal === 'gold' ? 'Gold (USD/oz)' : 'Silver (USD/oz)',
          data: props.prices,
          borderColor: colors.primary,
          backgroundColor: colors.fill,
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: colors.primary,
          pointHoverBorderColor: colors.tooltipBg,
          pointHoverBorderWidth: 2,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 2000,
        easing: 'easeInOutQuart',
        onProgress: function(animation) {
          const chart = animation.chart;
          const ctx = chart.ctx;
          const chartArea = chart.chartArea;
          
          if (!chartArea) return;
          
          // 매 프레임마다 save/restore를 쌍으로 실행
          ctx.save();
          
          const progress = animation.currentStep / animation.numSteps;
          const clipWidth = chartArea.left + (chartArea.right - chartArea.left) * progress;
          
          ctx.beginPath();
          ctx.rect(chartArea.left, chartArea.top, clipWidth - chartArea.left, chartArea.bottom - chartArea.top);
          ctx.clip();
          
          // 차트 그리기 후 즉시 복원
          ctx.restore();
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            color: colors.textColor,
            font: {
              size: 12,
              weight: '500',
              family: "'Pretendard', -apple-system, sans-serif",
            },
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 16,
            boxWidth: 8,
            boxHeight: 8,
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: colors.tooltipBg,
          titleColor: colors.textColor,
          bodyColor: colors.tooltipText,
          titleFont: {
            size: 11,
            weight: '500',
            family: "'Pretendard', -apple-system, sans-serif",
          },
          bodyFont: {
            size: 15,
            weight: '600',
            family: "'Pretendard', -apple-system, sans-serif",
          },
          padding: 12,
          cornerRadius: 10,
          displayColors: false,
          borderColor: colors.tooltipBorder,
          borderWidth: 1,
          caretSize: 6,
          caretPadding: 8,
          callbacks: {
            label: function(context) {
              const value = context.parsed.y
              return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            },
            title: function(context) {
              return context[0].label || '';
            },
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: colors.textColor,
            font: {
              size: 10,
              weight: '400',
              family: "'Pretendard', -apple-system, sans-serif",
            },
            maxRotation: 0,
            maxTicksLimit: 10,
          },
          border: {
            display: false,
          }
        },
        y: {
          grid: {
            color: colors.gridColor,
            lineWidth: 1,
            drawTicks: false,
          },
          ticks: {
            color: colors.textColor,
            font: {
              size: 10,
              weight: '400',
              family: "'Pretendard', -apple-system, sans-serif",
            },
            padding: 10,
            callback: function(value) {
              return '$' + value.toLocaleString()
            }
          },
          border: {
            display: false,
            dash: [4, 4],
          }
        }
      }
    }
  })
}

let themeObserver = null

onMounted(() => {
  drawChart()
  // 테마 변경 감지
  themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'data-theme') {
        drawChart()
      }
    })
  })
  themeObserver.observe(document.documentElement, { attributes: true })
})

onUnmounted(() => {
  if (chart) chart.destroy()
  if (themeObserver) themeObserver.disconnect()
})

watch(() => [props.labels, props.prices, props.metal], drawChart, { deep: true })
</script>

<style scoped>
/* 바깥 .chart-wrapper 가 이미 카드(보더+라운드)라 여기서는 캔버스 영역만 잡는다 */
.chart-container {
  position: relative;
  width: 100%;
  height: 400px;
  background: transparent;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
