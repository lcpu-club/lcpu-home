<script setup lang="ts">
import { HomeIcon, Bars3BottomLeftIcon } from '@heroicons/vue/24/outline'

defineProps<{
  toggleSidebarFn: ((collapse?: boolean) => void) | undefined
  title: string
  showTitle: boolean
}>()
</script>

<template>
  <div
    lg:hidden
    fixed
    top-0
    left-0
    right-0
    backdrop-blur-xl
    class="bg-white/80 dark:bg-[#121212]/80"
    h-14
    flex="~ items-center"
    z-500
  >
    <div
      flex="~ items-center"
      w-full
      class="max-w-[calc(800px+3rem)]"
      m-x-auto
      p-x-6
      gap-6
      box-border
    >
      <button
        title="打开侧边栏"
        cursor-pointer
        @click="toggleSidebarFn?.()"
        p-0
        border-none
        bg-transparent
      >
        <Bars3BottomLeftIcon class="w-6 h-6 text-black dark:text-white" />
      </button>
      <a href="/" title="返回主页" p-0 border-none bg-transparent>
        <HomeIcon class="w-6 h-6 text-black dark:text-white" />
      </a>
      <span
        block
        text-lg
        text-ellipsis
        overflow-hidden
        text-nowrap
        font-bold
        transition-all
        duration-200
        translate-y-2
        opacity-0
        :class="{ 'opacity-100 translate-y-0!': showTitle }"
        >{{ title }}</span
      >
    </div>
  </div>
</template>
