
<script setup>
import { ref, computed } from 'vue'

const showCircle = ref(false)
const animationPhase = ref(0)
const circleRef = ref(null)

// 使用计算属性动态计算样式
const circleStyle = computed(() => {
  if (animationPhase.value === 0) {
    return { backgroundColor: '#ff0000' } // 纯红
  } else {
    // 红色到蓝色的渐变 (phase 1-2)
    const progress = (animationPhase.value - 1) * 100
    return {
      background: `linear-gradient(to right, #ff0000 ${progress}%, #0000ff ${progress}%)`,
      transform: 'scale(20)' // 保持全屏状态
    }
  }
})

const startAnimation = () => {
  animationPhase.value = 0
  showCircle.value = true
}

const beforeEnter = (el) => {
  // 初始状态：缩放为0
  el.style.transform = 'scale(0)'
  el.style.backgroundColor = '#ff0000'
}

const enter = (el, done) => {
  // 第一阶段：红色放大到全屏
  el.style.transition = 'transform 1s ease-in'
  requestAnimationFrame(() => {
    el.style.transform = 'scale(20)'
  })

  setTimeout(done, 1000) // 与动画时间匹配
}

const afterEnter = () => {
  if (animationPhase.value === 0) {
    // 开始颜色渐变
    animationPhase.value = 1
    startColorTransition()
  }
}

const leave = (el, done) => {
  // 第三阶段：蓝色缩小
  el.style.transition = 'transform 1s ease-out, background 0s' // 停止颜色过渡
  requestAnimationFrame(() => {
    el.style.transform = 'scale(0)'
  })

  setTimeout(done, 1000)
}

const afterLeave = () => {
  animationPhase.value = 0
}

// 颜色渐变动画
const startColorTransition = () => {
  const duration = 1000 // 1秒
  const startTime = performance.now()

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    animationPhase.value = 1 + progress // 1-2之间

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      // 颜色过渡完成，开始缩小
      animationPhase.value = 2
      showCircle.value = false // 触发leave动画
    }
  }

  requestAnimationFrame(animate)
}
</script>

<template>
  <div class="container">
    <button @click="startAnimation">播放动画</button>

    <transition
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
        @leave="leave"
        @after-leave="afterLeave"
        :css="false"
    >
      <div
          v-if="showCircle"
          ref="circle"
          class="circle"
          :style="circleStyle"
      ></div>
    </transition>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  transform-origin: center;
  transform: translate(-50%, -50%) scale(0);
  will-change: transform, background; /* 优化性能 */
}

button {
  position: relative;
  z-index: 10;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
}
</style>