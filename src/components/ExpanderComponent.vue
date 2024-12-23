<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref, watch } from 'vue'

const contentWrapperRef = ref<HTMLDivElement>()
const contentDesiredSizeWrapperRef = ref<HTMLDivElement>()

const content = ref(0)
const collapsed = ref(false)

function toggleCollapsed() {
  collapsed.value = !collapsed.value
  if (collapsed.value) {
    contentWrapperRef.value!.style.height = '0'
  } else {
    contentWrapperRef.value!.style.height = `${content.value}px`
  }
}

onMounted(() => {
  if (!contentWrapperRef.value || !contentDesiredSizeWrapperRef.value) return

  watch(content, (newSize) => {
    if (!collapsed.value) contentWrapperRef.value!.style.height = `${newSize}px`
  })

  content.value = contentDesiredSizeWrapperRef.value!.scrollHeight

  const observer = new ResizeObserver(() => {
    content.value = contentDesiredSizeWrapperRef.value!.scrollHeight
  })

  observer.observe(contentDesiredSizeWrapperRef.value)
})
</script>

<template>
  <div overflow-clip>
    <div flex="~ items-center">
      <slot name="header"></slot>
      <button
        @click="toggleCollapsed"
        rounded-unset
        transition-all
        duration-200
        border-unset
        bg-transparent
        cursor-pointer
      >
        <ChevronRightIcon
          :class="['h-5 w-5 transition-all duration-300', collapsed ? 'rotate-0' : 'rotate-90']"
          class="color-black dark:color-white"
        />
      </button>
    </div>

    <div ref="contentWrapperRef" transition-all duration-300 h-0>
      <div ref="contentDesiredSizeWrapperRef">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
