<script setup lang="ts">
import { HomeIcon, Bars3BottomLeftIcon } from '@heroicons/vue/24/outline';

defineProps<{
  toggleSidebarFn: ((collapse?: boolean) => void) | undefined;
}>();
</script>

<template>
  <div lg:hidden fixed top-0 left-0 right-0 backdrop-blur-xl class="bg-white/80 dark:bg-[#121212]/80" h-14
    flex="~ items-center">
    <div w-full flex="~ items-center" max-w-800px m-x-auto>
      <button cursor-pointer @click="toggleSidebarFn?.()" p-0 border-none bg-transparent m-l-3 h-12 w-12
        flex="~ items-center justify-center">
        <Bars3BottomLeftIcon class="w-6 h-6 text-black dark:text-white" />
      </button>
      <a href='/' p-0 border-none bg-transparent h-12 w-12 flex=" ~ items-center justify-center">
        <HomeIcon class="w-6 h-6 text-black dark:text-white" />
      </a>
    </div>
  </div>
</template>
