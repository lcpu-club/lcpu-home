---
title: 关于我们
---

> Ciallo～(∠・ω< )⌒★

## write here

**Markdown enabled**

<script setup lang="ts">
// override page title with this
import { useTitle } from '@vueuse/core'
import { useSSRContext } from 'vue'
import { SiteConfiguration } from '@/site'

useTitle(`关于我们 | ${SiteConfiguration.titleSuffix}`)
if (import.meta.env.SSR) {
  const context = useSSRContext()
  if (context) {
    context.titlePrefix = '关于我们'
  }
}
</script>
