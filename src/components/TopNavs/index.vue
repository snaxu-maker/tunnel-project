<template>
    <div class="nav">
        <div class="toggle-menu">
            <el-icon v-if="menuStore.isCollapse" class="toggle-icon" @click="openMenu(false)">
                <Expand />
            </el-icon>
            <el-icon v-else class="toggle-icon" @click="closeMenu(true)">
                <Fold />
            </el-icon>
        </div>
        <div class="toggle-menu-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>{{$t("message.navs")}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{ menuStore.breadcrumb }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="lang">
            <el-dropdown trigger="click" @command="langCommand">
                <span class="el-dropdown-link">
                    <span class="flag">{{ flags[currentLang] }}</span>
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="zh">
                            <span class="flag">🇨🇳</span>
                            中文
                        </el-dropdown-item>
                        <el-dropdown-item command="en">
                            <span class="flag">🇺🇸</span>
                            英文
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div class="user">
            <el-dropdown trigger="click" @command="userCommand">
                <span class="el-dropdown-link">
                    {{ loginStore.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="userCenter">个人中心</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>
<script setup>
import { useMenuStore } from '@/stores/MenuStore'
import { useLoginStore } from '@/stores/LoginStore'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const menuStore = useMenuStore()
const loginStore = useLoginStore()
const router = useRouter()
// language flag state
const flags = {
    zh: '🇨🇳',
    en: '🇺🇸'
}
const currentLang = ref(localStorage.getItem('lang') || 'zh')
const openMenu = (flag) => {
    menuStore.isCollapse = flag
}
const closeMenu = (flag) => {
    menuStore.isCollapse = flag
}
//个人中心
const userCenterHandler = ()=>{
    router.push('/user')
}
//退出登录
const loginoutHandler = ()=>{
    loginStore.username = "",
    loginStore.token = "",
    loginStore.permission = ""
    router.push('/login')
}
// dropdown command handlers 切换语言
const langCommand = (cmd) => {
    if (!cmd) return
    currentLang.value = cmd
    localStorage.setItem('lang', cmd)
    // 目前项目通过 reload 刷新语言资源
    location.reload()
}
const userCommand = (command) => {
    if (command === 'userCenter') return userCenterHandler()
    if (command === 'logout') return loginoutHandler()
}
</script>
<style>
.nav {
    width: 100%;
    height: 60px;
    background-color: #fff;
    box-shadow: 0 1px 3px 0 rgb(0, 0, 0 /12%), 0 0 3px 0 rgb(0 0 0 / 4%);
    position: relative;
}

.toggle-menu {
    height: 100%;
    line-height: 60px;
    padding-left: 10px;
    float: left
}

.toggle-icon {
    font-size: 30px;
}

.toggle-menu-breadcrumb {
    float: left;
    line-height: 60px;
    margin-top: 20px;
    margin-left: 20px;
}
.lang{
    position: absolute;
    top:20px;
    right: 120px;
}
.flag{
    font-size: 18px;
    display: inline-block;
    width: 20px;
    text-align: center;
    margin-right: 6px;
}
.user{
    float: right;
    margin-right: 30px;
    margin-top: 20px;
}
</style>