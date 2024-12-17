import { defineConfig, presetAttributify, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetUno({
      dark: 'media',
    }),
    presetAttributify(),
  ],
})
