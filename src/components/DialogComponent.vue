<script setup lang="ts">
import { ref } from 'vue'

const shown = ref(false)

function toggleShown(specify: boolean | undefined = undefined) {
  if (specify === undefined) shown.value = !shown.value
  else shown.value = specify
}

defineExpose({
  toggleShown,
})
</script>
<template>
  <div
    fixed
    bottom-0
    left-0
    w-full
    h-full
    :class="[shown ? '' : 'pointer-events-none']"
    md:flex="~ items-center justify-center"
  >
    <div
      absolute
      top-0
      left-0
      w-full
      h-full
      transition
      duration-300
      @click="toggleShown(false)"
      :class="{ 'backdrop-brightness-60': shown }"
    ></div>
    <div
      absolute
      bottom-0
      left-0
      w-full
      transition
      duration-300
      ease-in-out
      md:max-w-200
      md:position-unset
      md:h-150
      :class="[shown ? 'translate-y-0' : 'translate-y-full opacity-0']"
      class="h-90% grid rows-[auto_1fr]"
      bg-white
      dark:bg-dark
      rounded-t-2xl
      md:rounded-2xl
      box-border
      p-4
      md:p-8
    >
      <slot name="title" />
      <div overflow-auto>
        <slot />
      </div>
    </div>
  </div>
</template>
