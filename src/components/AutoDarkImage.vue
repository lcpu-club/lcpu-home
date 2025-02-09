<script setup lang="ts">
const props = defineProps<{
  src: string
  srcDark?: string
  alt?: string
}>()
const srcDarkValue = `url(${props.srcDark || props.src})`
</script>

<template>
  <img class="auto-dark-img" :src="props.src" :alt="alt" />
</template>

<style lang="css" scoped>
@media (prefers-color-scheme: dark) {
  .auto-dark-img {
    content: v-bind(srcDarkValue);
  }
}
</style>
