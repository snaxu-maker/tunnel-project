<template>
    <div class="login-container">
        <el-form
            :model="loginForm"
            class="login-form"
            size="large"
        >
            <div class="title-container">
                <h3 class="title">隧道后台管理系统登录</h3>
            </div>
            <el-form-item>
                <el-input :prefix-icon="User" type='text' v-model="loginForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input :prefix-icon="Lock" type='password' show-password v-model="loginForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-button style="width:100%;margin-bottom: 30px;" type="primary" @click.prevent="handleLogin" :disabled="loading">
                {{ loading ? '登录中...' : '登录' }}
            </el-button>
        </el-form>
    </div>
</template>
<script setup>
import { reactive,ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginStore } from '@/stores/LoginStore';
import { addAdminRoutes } from '@/router/dynamicRoute'
import api from '@/api/index'
import {User,Lock} from '@element-plus/icons-vue'

const router = useRouter()
const loginStore = useLoginStore()
const loading = ref(false)
const loginForm = reactive({
    username:'',
    password:''
})
const handleLogin = ()=>{
    if(!loginForm.username || !loginForm.password) return ElMessage.info('请输入账号密码');
    loading.value = true
    api.getLogin(loginForm).then(res=>{
        if(res.status === 200){
            loginStore.username = res.username
            loginStore.token = res.token
            loginStore.permission = res.permission
            addAdminRoutes(router)
            loading.value = false
            ElMessage.success(`欢迎回来：${res.username||用户}`)
            router.push('/')
        }else{
            ElMessage.error('账号或密码错误')
            loading.value = false
        }
    })
    
}
</script>
<style scoped>
.login-container{
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: #2d3a4b;
}
.login-form{
    width: 400px;
    margin: 0 auto;
    padding: 160px 35px 0;
}
.title-container .title{
    font-size: 30px;
    color: #fff;
    text-align: center;
    margin: 20px;
}
</style>