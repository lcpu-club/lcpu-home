<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer text-center flex="~ col items-center" text-sm text-gray-400 dark:text-truegray-600>
    <div flex="~ items-center gap-2">
      <a text-unset href="/about/">关于我们</a>
      <a text-unset href="https://github.com/lcpu-club" target="_blank">GitHub</a>
      <a text-unset href="https://space.bilibili.com/3461562830424779" target="_blank">哔哩哔哩</a>
      <a text-unset href="mailto:linuxclub@pku.edu.cn">邮件联系</a>
    </div>
    <span text-xs m-t-2>Site under construction. For preview purposes only.</span>
    <span>© 2003 - {{ year }}, LCPU</span>
  </footer>
</template>
