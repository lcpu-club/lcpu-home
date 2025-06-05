<script setup lang="ts">
defineProps<{
  tags: string[]
}>()

const selectedTag = defineModel<string>({
  default: '',
})
</script>

<template>
  <div flex="~ wrap" gap-2>
    <div v-for="tag in tags" :key="tag">
      <a
        rounded-full
        text-black
        dark:text-white
        bg-gray-100
        dark:bg-dark-600
        flex="~ col gap-2"
        p-x-2
        p-y-1
        box-border
        text-sm
        cursor-pointer
        decoration-none
        transition
        :href="`/tags/#${tag}`"
        :class="{
          'bg-blue-100! border-blue-300! text-primary! dark:bg-blue-900! dark:border-blue-700! dark:text-primary-dark!':
            tag == selectedTag,
        }"
        border="1 gray-200 dark:dark-100 solid"
        @click="selectedTag = tag"
      >
        {{ tag }}
      </a>
    </div>
  </div>
</template>
