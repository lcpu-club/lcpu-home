import type { Component } from 'vue'

import { type MarkdownItHeader } from '@mdit-vue/plugin-headers'

export interface Module {
  default: Component
  __headers?: MarkdownItHeader[]
}
