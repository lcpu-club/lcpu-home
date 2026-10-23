<script setup lang="ts">
function retry() {
  window.location.reload()
}
</script>

<template>
  <div role="alert" p-y-12>
    <p>页面加载失败，请检查网络后重试。</p>
    <button @click="retry">重新加载</button>
  </div>
</template>
