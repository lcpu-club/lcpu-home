<script setup lang="ts">
import { HomeIcon, Bars3BottomLeftIcon } from '@heroicons/vue/24/outline';

defineProps<{
  toggleSidebarFn: ((collapse?: boolean) => void) | undefined;
}>();
</script>

<template>
  <div lg:hidden fixed top-0 left-0 right-0 backdrop-blur-xl h-14 p-x-6>
    <div w-full flex="~ items-center gap-4" max-w-800px m-x-auto>
      <button cursor-pointer @click="toggleSidebarFn?.()" p-0 border-none bg-transparent h-14
        flex="~ items-center justify-center">
        <Bars3BottomLeftIcon class="w-6 h-6 text-black dark:text-white" />
      </button>
      <a href='/' p-0 border-none bg-transparent h-14 flex=" ~ items-center justify-center">
        <HomeIcon class="w-6 h-6 text-black dark:text-white" />
      </a>
    </div>
  </div>
</template>
