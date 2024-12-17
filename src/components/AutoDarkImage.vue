<script setup lang="ts">
import { useDark } from '@vueuse/core';
import { computed } from 'vue';
const props = defineProps<{
    src: string;
    srcDark?: string;
    alt?: string;
}>();
const isDark = useDark();
const url = computed(() => (isDark.value && props.srcDark) ? props.srcDark : props.src)
</script>

<template>
    <img :src="url" :alt="alt">
</template>