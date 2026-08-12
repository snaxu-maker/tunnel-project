<template>
    <div class="slide-nav" :style="{width:menuStore.isCollapse?'64px':'240px'}">
        <div v-show="toggleStore.logoToggle" class="logo">
            <template v-if="menuStore.isCollapse">
                <el-icon><Help /></el-icon>
            </template>
            <template v-else>
                隧道管理系统
            </template>
        </div>
        <el-menu :key="menuStore.isCollapse" active-text-color="#ffd04b" background-color="#1e293b" text-color="#fff" :default-active="active"
            class="slide-menu" router :collapse="menuStore.isCollapse">
            
            <template v-for="item in menuStore.menusList" :key="item.path">
                <el-sub-menu v-if="item.children" :index="item.path">
                    <template #title>
                        <component :is="item.icon" class="icon"></component>
                        <span>{{ item.name }}</span>
                    </template>
                    <el-menu-item v-for="childItem in item.children" :key="childItem.path"
                        :index="childItem.path">
                        <span>{{ childItem.name }}</span>
                    </el-menu-item>
                </el-sub-menu>
                <el-menu-item v-else :key="item.path" :index="item.path">
                    <component :is="item.icon" class="icon"></component>
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </template>

        </el-menu>
    </div>

</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useToggleStore } from '@/stores/toggleStore'
import { useMenuStore } from '@/stores/MenuStore'
import { Help } from '@element-plus/icons-vue'
const active = ref('/')
const menuStore = useMenuStore()
const toggleStore = useToggleStore()
onMounted(() => {
    if (localStorage.getItem('active')) {
        active.value = localStorage.getItem('active')
    }
})

</script>
<style>
.slide-nav {
    width:240px;
    height: 100%;
    background-color: #1e293b;
    transition: 0.3s ease-in;
}

.icon {
    width: 16px;
    height: 16px;
    margin-right: 5px;
}

.logo {
    height: 60px;
    line-height: 60px;
    font-size: 25px;
    /* text-align: center; */
    margin-left: 20px;
    background-color: #1e293b;
    color: #fff;
    transition: 0.3s ease-in;
}
.slide-nav .slide-menu {
  transition: 0.3s ease-in;
}

.slide-nav .slide-menu.el-menu {
  border-right: none;
}
</style>