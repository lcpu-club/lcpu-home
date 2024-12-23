import { createApp } from './main'

const { app, router } = createApp()

router.go().then(() => {
  app.mount('#app')
})
