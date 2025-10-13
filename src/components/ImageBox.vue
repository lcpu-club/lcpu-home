<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, useTemplateRef, nextTick } from 'vue'

interface Props {
  src: string
  alt?: string
  caption?: string
  width?: string
  height?: string
}

const props = defineProps<Props>()

const imageBoxRef = useTemplateRef('imageBoxRef')
const actualSrc = ref(props.src)
const actualAlt = ref(props.alt || '')
const imgElementAlt = ref('')

onMounted(async () => {
  // Wait for next tick to ensure slot content is fully rendered
  await nextTick()

  // Try to get the actual img element from slot to ensure we have the correct src and caption
  if (imageBoxRef.value) {
    const imgElement = imageBoxRef.value.querySelector('img')
    if (imgElement) {
      actualSrc.value = imgElement.src || props.src
      actualAlt.value = imgElement.alt || props.alt || ''
      // Always use img's alt attribute as caption if it exists
      if (imgElement.alt) {
        imgElementAlt.value = imgElement.alt
      }
    }
  }
})

// Computed property for caption to ensure reactivity
const displayCaption = computed(() => {
  return imgElementAlt.value || props.caption || ''
})

onUnmounted(() => {
  // Ensure body scroll is restored when component is unmounted
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleEscKey)
})

const isZoomed = ref(false)
const scale = ref(1)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const position = ref({ x: 0, y: 0 })

const imageStyle = computed(() => {
  if (!isZoomed.value) return {}
  return {
    transform: `translate(${position.value.x}px, ${position.value.y}px) scale(${scale.value})`,
    cursor: isDragging.value ? 'grabbing' : 'grab',
  }
})

function openZoom(event: Event) {
  // Check if the ImageBox is inside a link, make it work as a normal link if so
  const target = event.target as Element
  const imageBoxElement = target.closest('.image-box')
  const linkElement = imageBoxElement?.closest('a')

  if (linkElement) {
    return
  }

  // Otherwise, open zoom functionality
  event.preventDefault()
  event.stopPropagation()

  isZoomed.value = true
  scale.value = 1
  position.value = { x: 0, y: 0 }
  document.body.style.overflow = 'hidden'
  // Add keyboard listener for ESC key
  document.addEventListener('keydown', handleEscKey)
}

function closeZoom() {
  isZoomed.value = false
  scale.value = 1
  position.value = { x: 0, y: 0 }
  document.body.style.overflow = ''
  // Remove keyboard listener
  document.removeEventListener('keydown', handleEscKey)
}

function handleEscKey(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeZoom()
  }
}

// using wheel event for zooming
function handleWheel(event: WheelEvent) {
  event.preventDefault()
  const delta = event.deltaY > 0 ? -0.1 : 0.1
  scale.value = Math.max(0.5, Math.min(5, scale.value + delta))
}

// close zoom when clicking outside the image
function handleMouseDown(event: MouseEvent) {
  if (event.button !== 0) return
  isDragging.value = true
  dragStart.value = {
    x: event.clientX - position.value.x,
    y: event.clientY - position.value.y,
  }
}

function handleMouseMove(event: MouseEvent) {
  if (!isDragging.value) return
  position.value = {
    x: event.clientX - dragStart.value.x,
    y: event.clientY - dragStart.value.y,
  }
}

function handleMouseUp() {
  isDragging.value = false
}

function handleBackdropClick(event: MouseEvent | TouchEvent) {
  if (event.target === event.currentTarget) {
    closeZoom()
  }
}

// Touch event handlers for mobile
let touchStartDistance = 0
let touchStartScale = 1

function handleTouchStart(event: TouchEvent) {
  if (event.touches.length === 2) {
    // Pinch zoom gesture
    const touch1 = event.touches[0]
    const touch2 = event.touches[1]
    touchStartDistance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    )
    touchStartScale = scale.value
  } else if (event.touches.length === 1) {
    // Single touch for dragging
    isDragging.value = true
    const touch = event.touches[0]
    dragStart.value = {
      x: touch.clientX - position.value.x,
      y: touch.clientY - position.value.y,
    }
  }
}

function handleTouchMove(event: TouchEvent) {
  if (event.touches.length === 2) {
    // Pinch zoom
    const touch1 = event.touches[0]
    const touch2 = event.touches[1]
    const currentDistance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    )
    const scaleChange = currentDistance / touchStartDistance
    scale.value = Math.max(0.5, Math.min(5, touchStartScale * scaleChange))
  } else if (event.touches.length === 1 && isDragging.value) {
    // Single touch drag
    const touch = event.touches[0]
    position.value = {
      x: touch.clientX - dragStart.value.x,
      y: touch.clientY - dragStart.value.y,
    }
  }
}

function handleTouchEnd() {
  isDragging.value = false
  touchStartDistance = 0
}
</script>

<template>
  <div class="image-box-wrapper" m-y-4>
    <div class="image-box" @click="openZoom" ref="imageBoxRef">
      <slot />
    </div>

    <!-- Caption below the image -->
    <div
      v-if="displayCaption"
      class="image-caption"
      text-center text-sm mt-2 px-3
      text-gray-600 dark:text-gray-400
      leading-relaxed
      italic
    >
      {{ displayCaption }}
    </div>

    <Teleport to="body">
      <Transition name="zoom">
        <div
          v-if="isZoomed"
          class="image-overlay"
          fixed inset-0 z-9999 flex items-center justify-center
          @click="handleBackdropClick"
          @wheel="handleWheel"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseUp"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <!-- Backdrop with blur -->
          <div
            class="backdrop"
            absolute inset-0 bg-black bg-op-40 dark:bg-op-70 backdrop-blur-xl
            @click="closeZoom"
          ></div>

          <!-- Image container -->
          <div
            class="image-container"
            relative z-1 max-w-90vw max-h-90vh pointer-events-none
          >
            <img
              :src="actualSrc"
              :alt="actualAlt"
              class="zoomed-image"
              max-w-full max-h-90vh select-none pointer-events-auto
              :style="imageStyle"
              transition-transform
              duration-200
              @dragstart.prevent
            />
          </div>

          <!-- Close button and hint -->
          <button
            @click.stop="closeZoom"
            class="close-btn"
            absolute top-4 right-4 md:top-8 md:right-8 z-2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors cursor-pointer border-none shadow-xl
            title="关闭 (ESC)"
          >
            <span text-xl md:text-2xl>×</span>
          </button>

          <!-- Hint text for mobile -->
          <div
            class="hint-text"
            absolute bottom-4 left="50%"
            style="transform: translateX(-50%)"
            z-2 text-white text-sm text-center bg-black bg-op-50 px-4 py-2 rounded-full md:hidden
          >
            点击背景或按钮关闭
          </div>

        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.zoom-enter-active,
.zoom-leave-active {
  transition: opacity 0.3s ease;
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
}

.zoom-enter-active .backdrop,
.zoom-leave-active .backdrop {
  transition: backdrop-filter 0.3s ease;
}

.zoom-enter-from .backdrop,
.zoom-leave-to .backdrop {
  backdrop-filter: blur(0px);
}

.zoom-enter-active .image-container,
.zoom-leave-active .image-container {
  transition: transform 0.3s ease;
}

.zoom-enter-from .image-container,
.zoom-leave-to .image-container {
  transform: scale(0.95);
}

.control-btn,
.close-btn {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.zoomed-image {
  transition-property: transform;
  will-change: transform;
}

.image-box {
  cursor: pointer;
}

.image-box :deep(img) {
  border-radius: 0.5rem;
  transition: all 0.3s;
  width: 100%;
  height: auto;
}

.image-box :deep(img):hover {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  transform: scale(1.01);
}
</style>
