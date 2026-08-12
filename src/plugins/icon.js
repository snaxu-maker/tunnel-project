import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const IconElement = (app) => {
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }
}
export default IconElement

