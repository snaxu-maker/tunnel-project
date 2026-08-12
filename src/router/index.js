import { createRouter, createWebHistory } from "vue-router";
import home from '@/views/Home/index.vue'
import layout from '@/views/layout.vue'
import { useLoginStore } from "@/stores/LoginStore";
import { useMenuStore } from "@/stores/MenuStore";
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'layout',
            meta:{requiresAuth:true},
            component: layout,
            children: [
                {
                    path: '/',
                    name: 'home',
                    meta:{requiresAuth:true,key:'首页'},
                    component: home
                },
                {
                    path: '/project',
                    name: 'project',
                    meta:{requiresAuth:true,key:'项目基础信息'},
                    component: () => import('@/views/ProjectInfo/index.vue')
                },
                {
                    path: '/tunnel',
                    name: 'tunnel',
                    meta:{requiresAuth:true,key:'隧道设计信息'},
                    component: () => import('@/views/TunnelDesignInfo/index.vue')
                },
                {
                    path: '/construct',
                    name: 'construct',
                    meta:{requiresAuth:true,key:'施工监控检测'},
                    component: () => import('@/views/ConstructionMonitorTest/index.vue')
                },
                {
                    path: '/plan',
                    name: 'plan',
                    meta:{requiresAuth:true,key:'检测计划'},
                    component: () => import('@/views/ConstructionMonitorTest/plan/index.vue')
                },
                {
                    path: '/section',
                    name: 'section',
                    meta:{requiresAuth:true,key:'切面检测'},
                    component: () => import('@/views/ConstructionMonitorTest/section/index.vue')
                },
                {
                    path: '/geological',
                    name: 'geological',
                    meta:{requiresAuth:true,key:'超前地质预报'},
                    component: () => import('@/views/AdvancedGeologicalPrediction/index.vue')
                },
                {
                    path: '/user',
                    name: 'user',
                    meta:{requiresAuth:true,key:'个人中心'},
                    component: () => import('@/views/UserCenter/index.vue')
                }
            ]
        },
        {
            path:'/login',
            name:'login',
            component:()=>import('@/views/Login/index.vue')
        },
        {
            path:'/pdf/:id',
            name:'pdf',
            component:()=>import('@/views/TunnelDesignInfo/PDFViewer/index.vue')
        },
        {
            //必须放在最后面！捕获所有不匹配的路径，并渲染 404 页面
            path:'/:pathMatch(.*)*',
            name:'notfound',
            component:()=>import('@/views/NotFound/index.vue')
        }

    ]
})

router.beforeEach((to,from)=>{
    const loginStore = useLoginStore()
    if(to.meta.requiresAuth){
        if(!loginStore.token){
            return {
                path:'/login'
            }
        }
    }
})
router.afterEach((to,from)=>{
    //存储路由路径
  localStorage.setItem("active", to.path)
    if(to.meta.key){
        const menuStore = useMenuStore()
        menuStore.breadcrumb = to.meta.key
    }
})
export default router


