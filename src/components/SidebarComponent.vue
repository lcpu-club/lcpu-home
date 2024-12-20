<script setup lang="ts">
import { ref } from 'vue';
import AutoDarkImage from '@/components/AutoDarkImage.vue';
import LcpuLight from '@/assets/lcpu-light.svg';
import LcpuDark from '@/assets/lcpu-dark.svg';

const sidebarCollapsed = ref(true);
const toggleSidebar = (collapse?: boolean) => {
  if (collapse === undefined) {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  } else {
    sidebarCollapsed.value = collapse;
  }
}

defineExpose({ toggleSidebar });
</script>

<template>
  <div w-screen lg:w-unset box-border fixed lg:position-unset h-full z-999 transition-all duration-300
    @click="toggleSidebar(true)" pointer-events-none lg:pointer-events-unset
    :class="{ 'backdrop-brightness-40 pointer-events-unset': !sidebarCollapsed }">
    <div @click.stop h-full box-border p-x-6 p-y-12 md:p-x-12 bg-gray-100 dark:bg-dark-800 transition-all duration-300
      overflow-auto class="w-80% max-w-400px lg:w-full lg:max-w-unset -translate-x-100% lg:translate-x-0"
      :class="{ 'translate-x-0!': !sidebarCollapsed }" shadow-xl>
      <a flex="~ items-center gap-2" href="/" class="text-unset! decoration-none">
        <AutoDarkImage h-8 :src="LcpuDark" :src-dark="LcpuLight" />
        <span text-xl font-semibold>LCPU</span>
      </a>
      <slot />
    </div>
  </div>
</template>
