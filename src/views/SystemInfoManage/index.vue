<template>
    <div class="add-user">
        <span>用户状态:</span>
        <el-input class="input" v-model="searchInfo" size="large" placeholder="请输入用户信息"
            @keyup.enter="searchUserHandler"></el-input>
        <el-button class="button" type="primary" size="large" plain @click="searchUserHandler">搜索</el-button>
        <el-button class="button" type="primary" size="large" plain @click="addUserDialogVisiable = true">添加</el-button>
    </div>
    <el-table :data="userList.data" width="100%">
        <el-table-column label="ID" prop="id" width="120"></el-table-column>
        <el-table-column label="用户名" prop="username" width="150"></el-table-column>
        <el-table-column label="权限" width="150">
            <template #default="scope">
                {{ scope.row.permission === 'admin' ? '管理员' : '普通用户' }}
            </template>
        </el-table-column>
        <el-table-column label="电话" prop="phone" width="150"></el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button size="small" @click="editPermissionHandler(scope.$index, scope.row)">编辑权限</el-button>
                <el-button type="danger" size="small"
                    @click="deleteUserHandler(scope.$index, scope.row)">删除用户</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 添加对话对话框 start -->
    <el-dialog v-model="addUserDialogVisiable" width="50%" center :show-close="false" class="custom-dialog"
        @close="handleDialogClose">
        <template #header>
            <div class="custom-dialog-header">
                <h3>添加用户</h3>
            </div>
        </template>
        <el-form :model="userForm" label-width="120px" :rules="addFormRules" ref="ruleFormRef">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="userForm.username" type="text" class="adduser-input"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="userForm.password" type="password" class="adduser-input"></el-input>
            </el-form-item>
            <el-form-item label="权限" prop="permission">
                <el-radio-group v-model="userForm.permission" size="large">
                    <el-radio-button value="admin" label="管理员" checked />
                    <el-radio-button value="vip" label="普通用户" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <el-input v-model="userForm.phone" type="text" class="adduser-input"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="addUserDialogVisiable = false" plain>取消</el-button>
            <el-button @click="sureAddUserHandler(ruleFormRef)" plain>确定</el-button>
        </template>

    </el-dialog>
    <!-- 添加对话对话框 end -->
    <!-- 删除对话框 start -->
    <el-dialog v-model="deleteUserDialogVisiable" width="38%" center :show-close="false"
        class="custom-dialog delete-dialog">
        <template #header>
            <div class="custom-dialog-header-delete">
                <div class="header-icon">!</div>
                <div class="header-text">
                    <h3>删除确认</h3>
                    <p>此操作不可撤销，请认真核对删除内容。</p>
                </div>
            </div>
        </template>
        <div class="delete-dialog-body">
            <p class="warning-label">警告</p>
            <p>删除后该用户将永久移除，相关权限和信息也会一并失效。</p>
        </div>
        <template #footer>
            <el-button @click="deleteUserDialogVisiable = false" plain>取消</el-button>
            <el-button type="danger" @click="sureDeleteUserHandler" plain>确定删除</el-button>
        </template>
    </el-dialog>
    <!-- 删除对话框 end -->
    <!-- 编辑对话框 start -->
    <el-dialog v-model="alterUserDialogVisiable" width="38%" center :show-close="false" class="custom-dialog">
        <template #header>
            <div class="custom-dialog-header">
                <h3>编辑用户</h3>
            </div>
        </template>
        <div v-if="alterUserLoading" class="edit-loading-state">
            <i class="el-icon-loading"></i>
            <span>正在加载用户信息，请稍候...</span>
        </div>
        <el-form v-else :model="alterUserForm" label-width="120px">
            <el-form-item label="用户名" prop="username">
                <h3>{{ alterUserForm.username }}</h3>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="alterUserForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="权限" prop="permission">
                <el-radio-group v-model="alterUserForm.permission" size="large">
                    <el-radio-button value="admin" label="管理员" checked />
                    <el-radio-button value="vip" label="普通用户" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <el-input v-model="alterUserForm.phone" type="text" width="300px"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="closeAlterDialog" :disabled="alterUserLoading" plain>取消</el-button>
            <el-button @click="sureAlterUserHandler" :loading="alterUserLoading" :disabled="alterUserLoading" plain>确定</el-button>
        </template>

    </el-dialog>
    <!-- 编辑对话框 end -->
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus'
import api from '@/api/index'
const addUserDialogVisiable = ref(false)
const deleteUserDialogVisiable = ref(false)
const alterUserDialogVisiable = ref(false)
const deleteID = ref('')
const searchInfo = ref("")
const userList = reactive(
    { data: [] }
)
const userForm = reactive({
    username: '',
    permission: 'vip',
    phone: '',
    password: ''
})
const alterUserForm = reactive({
    id: '',
    username: '',
    permission: '',
    phone: '',
    password: ''
})
const alterUserLoading = ref(false)
const alterUserBackup = ref(null)
//用于获取表单实例
const ruleFormRef = ref()
/**
 * 监听对话框关闭事件
 * 用于清除上一次遗留的表单验证红字提示
 */
const handleDialogClose = () => {
    if (!ruleFormRef.value) return
    // 方案 A：仅清除红字警告，保留用户之前填写的输入内容
    // ruleFormRef.value.clearValidate()

    // 方案 B（推荐）：重置整个表单（既清除红字警告，又将表单字段值恢复到初始状态）
    ruleFormRef.value.resetFields()
}
//添加用户验证规则
const addFormRules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' },
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
        },
    ],
    phone: [
        {
            required: true,
            message: '请输入电话',
            trigger: 'blur',
        },
    ]
})
onMounted(() => {
    userListUpdate()
})
const userListUpdate = () => {
    api.getUserList().then(res => {
        if (res.status === 200) {
            userList.data = res.result
        } else {
            ElMessage.info(res.msg)
        }
    }).catch(err => {
        ElMessage.error(err)
    })
}
//搜索用户
const searchUserHandler = () => {
    if (!searchInfo.value) {
        return ElMessage.info('请输入要搜索的内容')
    }
    console.log(searchInfo.value);

    api.searchUser({ search: searchInfo.value }).then(res => {
        if (res.status === 200) {
            userList.data = res.result
        } else {
            userList.data = []
        }
    }).catch(err => {
        ElMessage.error(err)
    })
}
//确定添加用户
const sureAddUserHandler = async (formEl) => {
    if (!formEl) return
    // ❌ 错误排除：必须删除原本写在这里的 formEl.resetFields() 
    // 否则每次点确定都会先清空数据，导致永远校验失败
    await formEl.validate((valid, fields) => {
        if (valid) {
            api.addUser(userForm).then(res => {
                if (res.status === 200) {
                    ElMessage.success('用户添加成功')
                    userListUpdate()
                } else {
                    ElMessage.error(res.msg)
                }
            }).catch(err => {
                ElMessage.error(err)
            })
        } else {
            ElMessage.error('error submit!', fields)
        }
        addUserDialogVisiable.value = false
    })
}
//编辑用户权限
const editPermissionHandler = async (index, row) => {
    alterUserDialogVisiable.value = true
    alterUserLoading.value = true
    alterUserBackup.value = { ...alterUserForm }
    try {
        const res = await api.previewUser({ id: row.id })
        if (res.status === 200) {
            Object.assign(alterUserForm, res.result)
        } else {
            throw new Error(res.msg || 'fetch user info failed')
        }
    } catch (err) {
        if (alterUserBackup.value) {
            Object.assign(alterUserForm, alterUserBackup.value)
        }
        alterUserDialogVisiable.value = false
        ElMessage.error(err.message || err)
    } finally {
        alterUserLoading.value = false
    }
}
const closeAlterDialog = () => {
    alterUserDialogVisiable.value = false
    Object.assign(alterUserForm, {
        id: '',
        username: '',
        permission: '',
        phone: '',
        password: ''
    })
    alterUserBackup.value = null
}
//确定修改用户
const sureAlterUserHandler = async () => {
    if (alterUserLoading.value) return
    alterUserLoading.value = true
    const backup = alterUserBackup.value ? { ...alterUserBackup.value } : null
    try {
        const res = await api.updateUser(alterUserForm)
        if (res.status === 200) {
            ElMessage.success(res.msg || '用户更新成功')
            userListUpdate()
            alterUserDialogVisiable.value = false
        } else {
            throw new Error(res.msg || '用户更新失败')
        }
    } catch (err) {
        if (backup) {
            Object.assign(alterUserForm, backup)
        }
        ElMessage.error(err.message || err)
    } finally {
        alterUserLoading.value = false
    }
}
//删除用户
const deleteUserHandler = (index, row) => {
    deleteUserDialogVisiable.value = true
    deleteID.value = row.id

}
//确认删除
const sureDeleteUserHandler = () => {
    api.deleteUser({ id: deleteID.value }).then(res => {
        if (res.status === 200) {
            ElMessage.success('delete user success')
            userListUpdate()
        } else {
            ElMessage.error('delete user failed')
        }
        deleteUserDialogVisiable.value = false
    }).catch(err => {
        ElMessage.error(err)
    })
}
</script>
<style scoped>
.add-user {
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #fff;
    box-sizing: border-box;
    width: 100%
}

.add-user span {
    font-weight: 700;
    margin-right: 5px;
}

.add-user .input {
    width: 300px;
    margin-right: 5px;
}

.adduser-input {
    width: 500px;
}

/* 对话框整体圆角美化 */
:deep(.custom-dialog) {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 12px 32px 4px rgba(0, 0, 0, .04), 0 8px 20px rgba(0, 0, 0, .08);
}

/* 取消原生的 header 内边距 */
:deep(.custom-dialog .el-dialog__header) {
    padding: 0;
    margin-right: 0;
}

/* 自定义头部渐变背景和字体样式 */
.custom-dialog-header {
    background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
    /* 渐变科技蓝 */
    padding: 20px 24px;
    text-align: center;
}

.custom-dialog-header h3 {
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    letter-spacing: 1px;
}

.custom-dialog-header-delete {
    display: flex;
    align-items: center;
    gap: 12px;
    background: linear-gradient(135deg, #ff4d4f 0%, #c40000 100%);
    padding: 16px 20px;
    border-radius: 12px 12px 0 0;
}

.custom-dialog-header-delete .header-icon {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    color: #ffffff;
    font-size: 22px;
    font-weight: 700;
}

.custom-dialog-header-delete .header-text {
    color: #ffffff;
}

.custom-dialog-header-delete h3 {
    color: #ffffff;
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    letter-spacing: 0.5px;
}

.custom-dialog-header-delete p {
    margin: 4px 0 0;
    color: rgba(255, 255, 255, 0.9);
    font-size: 13px;
}

.delete-dialog-body {
    padding: 24px 20px;
    background: #fff7f7;
    border-radius: 0 0 12px 12px;
    color: #922b21;
}

.delete-dialog-body p {
    margin: 0;
    line-height: 1.8;
}

.warning-label {
    display: inline-block;
    margin-bottom: 12px;
    padding: 4px 10px;
    background: #ffe7e6;
    color: #d4380d;
    border-radius: 10px;
    font-weight: 700;
}

.custom-dialog .el-dialog__footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 20px;
    background: #fff;
}
.edit-loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 180px;
    color: #409eff;
    font-size: 14px;
}
.edit-loading-state i {
    font-size: 18px;
}
</style>