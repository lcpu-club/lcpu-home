<script setup lang="ts">
import { usePreferredDark } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'
const props = defineProps<{
  src: string
  srcDark?: string
  alt?: string
}>()

const url = ref('')
const isDark = usePreferredDark()
onMounted(() => {
  watch(
    isDark,
    (newVal) => {
      const src = newVal ? (props.srcDark ?? props.src) : props.src
      url.value = src
    },
    { immediate: true },
  )
})
</script>

<template>
  <img :src="url" :alt="alt" />
</template>
