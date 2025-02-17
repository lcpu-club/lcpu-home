// used to fix typescript errors

import { type MarkdownItHeader } from '@mdit-vue/plugin-headers'

export interface Module {
  default: never
  __headers?: MarkdownItHeader[]
}
