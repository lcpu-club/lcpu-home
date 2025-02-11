<script setup lang="ts">
import AutoDarkImage from '@/components/AutoDarkImage.vue'

import LcpuDark from '../assets/404-dark.svg'
import LcpuLight from '../assets/404-light.svg'
import { useTitle } from '@vueuse/core'
import { useSSRContext } from 'vue'
import { SiteConfiguration } from '@/site'

useTitle(`404 NOT FOUND | ${SiteConfiguration.titleSuffix}`)
if (import.meta.env.SSR) {
  const context = useSSRContext()
  if (context) {
    context.titlePrefix = '404 NOT FOUND'
    if (!context.meta) {
      context.meta = {}
    }
    context.meta.description = '未找到此页面...'
  }
}
</script>

<template>
  <div flex="~ col items-center" m-t-24>
    <AutoDarkImage h-36 :src="LcpuDark" :src-dark="LcpuLight" alt="LCPU 标识" />
    <h1>404 NOT FOUND!</h1>
    <p m-0 text-lg>Country roads, take me home.</p>
    <p m-0 text-lg>To the place, I belong.</p>
    <a
      m-t-6
      p-x-6
      p-y-3
      rounded-full
      bg-black
      dark:bg-white
      decoration-none
      class="text-white dark:text-black"
      href=" /"
      >Go Home</a
    >
  </div>
</template>
