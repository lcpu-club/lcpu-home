import { createApp } from './main'

const { app, router } = createApp()

router.go()
app.mount('#app')
