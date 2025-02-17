<script setup lang="ts">
import MainComponent from './components/MainComponent.vue'
import { SiteConfiguration } from './site'
import NewYearBg from './components/NewYearBg.vue'
// import { useDark } from '@vueuse/core'
// useDark()
</script>

<template>
  <NewYearBg v-if="SiteConfiguration.theme === 'new-year'" />
  <Suspense>
    <MainComponent z-1 relative />
  </Suspense>
</template>
