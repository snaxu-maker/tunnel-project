<template>
    <div class="layout-container">
        <div class="left-container" :style="{width:menuStore.isCollapse?'64px':'240px'}">
            <SlideNavs />
        </div>
        <div class="right-container" >
            <TopNavs />
            <div class="container">
                <Drawer/>
                <router-view />
            </div>
        </div>
    </div>
</template>

<script setup>
import SlideNavs from '@/components/SlideNavs/index.vue'
import TopNavs from '@/components/TopNavs/index.vue'
import api from '@/api/index'
import { onMounted } from 'vue';
import {useRouter} from 'vue-router'
import { useLoginStore } from '@/stores/LoginStore';
import { useMenuStore } from '@/stores/MenuStore'
import Drawer from '@/components/Drawers/index.vue'
const loginStore = useLoginStore()
const menuStore = useMenuStore()
const router = useRouter()
onMounted(() => {
    api.getRouter({ permission: loginStore.permission })
        .then(res => {
            if (res.status === 200) {
                menuStore.menusList = res.menusData.menus
            } else {
                ElMessage.error(res.msg)
            }

        }).catch(err => {
            console.log(err);
        })
})
</script>
<style scoped>
.layout-container {
    height: 100%;
    display: flex;
}
.left-container{
    transition: 0.3s ease-in;
}
.right-container {
    flex: 1;
    transition: 0.3s ease-in;
}
.container{
    padding: 10px;
}
</style>