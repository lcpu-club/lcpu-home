<template>
  <h1 m-t-4 lg:m-t-0>Planets</h1>
</template>

<script setup lang="ts">
import { SiteConfiguration } from '@/site'
import { useTitle } from '@vueuse/core'
import { useSSRContext } from 'vue'

defineOptions({
  name: 'PlanetsPage',
})

useTitle(`Planets | ${SiteConfiguration.titleSuffix}`)
if (import.meta.env.SSR) {
  const context = useSSRContext()
  if (context) {
    context.titlePrefix = 'Planets'
  }
}
</script>
