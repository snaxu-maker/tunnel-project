export const workRoute = {
    path: '/work',
    name: 'work',
    meta: { requiresAuth: true, key: '工作监督管理' },
    component: () => import('@/views/WorkMonitorManage/index.vue')
}
export const systemRoute = {
    path: '/system',
    name: 'system',
    meta: { requiresAuth: true, key: '系统信息管理' },
    component: () => import('@/views/SystemInfoManage/index.vue')
}

export function addAdminRoutes(router) {
    if (!router.hasRoute('work')) {
        router.addRoute('layout', workRoute)
    }
    if (!router.hasRoute('system')) {
        router.addRoute('layout', systemRoute)
    }
}