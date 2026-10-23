import { defineConfig, presetAttributify, presetWind3, transformerDirectives } from 'unocss'
import { SiteConfiguration } from './src/site'

export default defineConfig({
  presets: [
    presetWind3({
      dark: 'media',
    }),
    presetAttributify(),
  ],
  transformers: [transformerDirectives()],
  shortcuts:
    SiteConfiguration.theme === 'normal'
      ? {
          'text-primary': 'text-blue-500',
          'text-primary-dark': 'text-blue-300',
        }
      : {
          'text-primary': 'text-red-500',
          'text-primary-dark': 'text-red-300',
        },
})
