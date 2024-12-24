<script setup lang="ts">
import { useRoute } from '@/router/router'
import { shallowRef, watch } from 'vue'
const route = useRoute(() => undefined)
const component = shallowRef(route.mainComponent)

watch(route, (newVal) => {
  component.value = newVal.mainComponent
})
</script>

<template>
  <component :is="component" />
</template>
