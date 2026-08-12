import { createApp } from 'vue'
import App from './App.vue'
import {createPinia} from 'pinia'
import router from '@/router/index.js'
import { useLoginStore } from '@/stores/LoginStore'
import { addAdminRoutes } from '@/router/dynamicRoute'
import '@/assets/init.css'
import 'element-plus/dist/index.css'
import IconElement from '@/plugins/icon.js'
import echarts from '@/plugins/echarts.js'
import piniaPersist from 'pinia-plugin-persistedstate'
import i18n from './plugins/i18n.js'
import ElementPlus from 'element-plus'
import zh from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

// Suppress browser extension communication errors
if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onMessage.addListener(() => {})
}

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersist)
app.use(pinia)
const loginStore = useLoginStore()
if (loginStore.permission === 'admin') {
    addAdminRoutes(router)
}
app.use(i18n)
app.use(IconElement)
app.use(echarts)
app.use(router)
app.use(ElementPlus,{
    locale:localStorage.getItem('lang') === 'zh'? zh:en
})
app.mount('#app')
