import './assets/tailwind.css'
import 'remixicon/fonts/remixicon.css'
import 'element-plus/theme-chalk/index.css'
import './assets/main.scss'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'

import i18n from '@/i18n'
import messages from '@/i18n/messages'

import { pinia } from '@/stores'
import router from '@/router'
import App from '@/App.vue'

import { DEFAULT_LANG } from '@/env'

const app = createApp(App)

app.use(pinia)

app.use(i18n)
app.use(ElementPlus, { locale: messages[DEFAULT_LANG] })

app.use(router)

app.mount('#app')
