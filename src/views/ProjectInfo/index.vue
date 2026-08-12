<template>
    <!-- 搜索与添加 start -->
    <div class="search">
        <span class="title">项目状态:</span>
        <el-input size="large" @keyup.enter="searchHandler" class="input" placeholder="请输入搜索的内容" v-model="searchInfo" />
        <el-button size="large" type="primary" @click="searchHandler" plain>搜索</el-button>
        <el-button size="large" type="success" @click="addHandler" plain>添加</el-button>
    </div>
    <!-- 搜索与添加 end -->
    <!-- 表格展示数据 start -->
    <el-table :data="tableData.lists" :header-cell-style='tableHeaderStyle' :cell-style="tableBodyCellStyle"
        style="width: 100%">
        <el-table-column prop="name" label="项目名称" width="150" fixed />
        <el-table-column prop="number" label="项目编码" width="120" />
        <el-table-column prop="money" label="项目金额" width="120" />
        <el-table-column prop="address" label="项目地址" width="120" />
        <el-table-column prop="duration" label="项目工期(月)" width="120" />
        <el-table-column prop="startTime" label="开工时间" :formatter="(row) => dateFormater(Number(row.startTime))"
            width="150" />
        <el-table-column prop="endTime" label="结束时间" :formatter="(row) => dateFormater(Number(row.endTime))"
            width="150" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="status" label="项目状态" width="100">
            <template #default="scope">
                <el-tag :type="scope.row.status === '1' ? 'primary' : 'success'">
                    {{ statusText(scope.row.status) }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="remark" label="备注" width="200">
            <template #default="scope">
                <div v-html="scope.row.remark"></div>
            </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
            <template #default="scope">
                <el-button type="primary" size="small" @click="editHandler(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" size="small" @click="deleteHandler(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 表格展示数据 start -->
    <!-- 分页start -->
    <div class="page">
        <el-pagination size="large" background layout="total,prev, pager, next,jumper" :total="projectCount"
            @current-change="http" style="margin-top: 10px; text-align: right;" />
    </div>
    <!-- 分页end -->
    <!-- 添加对话框 start -->
    <el-dialog v-model="dialogAddVisible" width="50%" center :show-close="false" class="custom-dialog"
        @close="handleDialogClose" destroy-on-close>
        <!-- 自定义头部插槽 -->
        <template #header>
            <div class="custom-dialog-header">
                <h3>添加隧道信息</h3>
            </div>
        </template>

        <el-form :model="addForm" ref="ruleFormRef" :rules="addFormRules" :inline="true" label-width="90px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="项目名称" prop="name">
                        <el-input v-model="addForm.name" placeholder="请输入项目名称" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="项目编码" prop="number">
                        <el-input v-model="addForm.number" placeholder="请输入项目编码" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="项目金额" prop="money">
                        <el-input v-model="addForm.money" placeholder="请输入项目金额" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="项目地址" prop="address">
                        <el-input v-model="addForm.address" placeholder="请输入项目地址" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="开工时间" prop="startTime">
                        <el-date-picker type="date" v-model="addForm.startTime" value-format="x" placeholder="请选择开工时间"
                            style="width: 100%;" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="终止时间" prop="endTime">
                        <el-date-picker type="date" v-model="addForm.endTime" value-format="x" placeholder="请选择结束时间"
                            style="width: 100%;" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="项目工期" prop="duration">
                        <el-input v-model="addForm.duration" placeholder="请输入项目工期" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="隧道数量" prop="quantity">
                        <el-input v-model="addForm.quantity" placeholder="请输入隧道数量" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <!-- 重点：确保内部组件能够填满表单项容器 -->
                    <el-form-item label="项目状态" prop="status" style="width: 100%;">
                        <el-select v-model="addForm.status" placeholder="请选择项目状态" style="width: 100%; clear: both;">
                            <el-option label="施工中" value="1" />
                            <el-option label="已完工" value="0" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- 将 label-width 留出空间，并用样式穿透修复富文本对齐问题 -->
            <el-form-item label="项目备注" prop="remark" style="width: 90%;" class="quill-form-item">
                <quill-editor v-model:content="addForm.remark" contentType="html" placeholder="请输入项目备注..." theme="snow"
                    @blur="handleQuillBlur" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogAddVisible = false" round>取 消</el-button>
                <el-button type="primary" @click="addSureHandler(ruleFormRef)" round>确 定</el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 添加对话框 end -->
    <!-- 编辑对话框 start -->
    <el-dialog v-model="dialogEditVisible" width="50%" center :show-close="false" class="custom-dialog"
        @close="handleDialogClose" destroy-on-close>
        <!-- 自定义头部插槽 -->
        <template #header>
            <div class="custom-dialog-header">
                <h3>编辑隧道信息</h3>
            </div>
        </template>

        <el-form :model="editForm"   :inline="true" label-width="90px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="项目名称" prop="name">
                        <el-input v-model="editForm.name" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="项目编码" prop="number">
                        <el-input v-model="editForm.number" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="项目金额" prop="money">
                        <el-input v-model="editForm.money" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="项目地址" prop="address">
                        <el-input v-model="editForm.address" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="开工时间" prop="startTime">
                        <el-date-picker type="date" v-model="editForm.startTime" value-format="x"
                            style="width: 100%;" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="终止时间" prop="endTime">
                        <el-date-picker type="date" v-model="editForm.endTime" value-format="x" 
                            style="width: 100%;" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="项目工期" prop="duration">
                        <el-input v-model="editForm.duration"  />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="隧道数量" prop="quantity">
                        <el-input v-model="editForm.quantity"  />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <!-- 重点：确保内部组件能够填满表单项容器 -->
                    <el-form-item label="项目状态" prop="status" style="width: 100%;">
                        <el-select v-model="editForm.status"  style="width: 100%; clear: both;">
                            <el-option label="施工中" value="1" />
                            <el-option label="已完工" value="0" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- 将 label-width 留出空间，并用样式穿透修复富文本对齐问题 -->
            <el-form-item label="项目备注" prop="remark" style="width: 90%;" class="quill-form-item">
                <quill-editor v-model:content="editForm.remark" contentType="html"  theme="snow"
                    @blur="handleQuillBlur" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogEditVisible = false" round>取 消</el-button>
                <el-button type="primary" @click="editSureHandler" round>确 定</el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 编辑对话框 end -->
 </template>
<script setup>
import { onMounted, reactive, ref, shallowRef, onUnmounted } from 'vue';
import api from '@/api/index'
import { ElMessage, ElMessageBox } from 'element-plus';
import { dateFormater } from '@/utils/utils'
import { addFormRules } from '@/utils/rules'
// 1. 引入富文本组件与核心样式
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const tableData = reactive({
    lists: []
})
//添加对话框
const addForm = reactive({
    name: '',
    number: '',
    money: '',
    address: '',
    duration: '',
    startTime: '',
    endTime: '',
    quantity: '',
    status: '',
    remark: ''
})
//编辑对话框
const createEditForm = () => ({
    name: '',
    number: '',
    money: '',
    address: '',
    duration: '',
    startTime: '',
    endTime: '',
    quantity: '',
    status: '',
    remark: ''
})
const editForm = reactive(createEditForm())
const ruleFormRef = ref()// 获取表单实例的 ref
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
const dialogAddVisible = ref(false)//添加对话框是否显示
const dialogEditVisible = ref(false) //编辑对话框是否显示
const searchInfo = ref('')
const projectCount = ref(0)
// 1. 定义一个 shallowRef 用来保存定时器对象
const searchTimer = shallowRef(null)
onMounted(() => {
    http(1)
})
// 获取项目总数
onMounted(() => {
    fetchProjectCount()
})
const fetchProjectCount = () => {
    api.getProjectCount().then(res => {
        if (res.status === 200) {
            projectCount.value = res.total
        } else {
            ElMessage.info('获取项目总数失败')
        }
    }).catch(err => {
        console.log(err);
    })
}
const http = (page) => {
    api.getProjectInfo({ page }).then(res => {
        if (res.status === 200) {
            tableData.lists = res.result
            //Object.assign(tableData,res.result) 在处理 reactive 数组时会带来严重的副作用
            //直接赋值给 reactive 声明的变量，导致 Vue 的响应式追踪（Proxy）丢失。
            // tableData = res.result
        } else {
            ElMessage.info('no data')
        }
    }).catch(err => {
        console.log(err);
    })
}
/**
 * 隧道状态文本
 */
const statusText = (text) => {
    return text === '1' ? '施工中' : '已完工'
}
/**
 * 表头样式
 */
const tableHeaderStyle = ({ row, column, rowIndex, columnIndex }) => {
    if (rowIndex === 0) {
        return { color: '#999', fontWeight: 700, backgroundColor: '#dcdcdc' }
    }
}
/**
 * 表格内容样式
 */
// 2. ✨ 新增：普通数据行样式函数 (影响表头以下的所有行)
const tableBodyCellStyle = ({ row, column, rowIndex, columnIndex }) => {
    // 场景 A：所有普通行统一设置样式
    // return {
    //     color: '#606266',             // 整体内容文字颜色
    //     backgroundColor: '#ffffff',    // 整体内容背景色
    //     fontSize: '14px'               // 字体大小
    // }
    // 场景 B：如果你想实现隔行变色（斑马纹），可以解开这段注释：
    if (rowIndex % 2 === 1) {
        return { backgroundColor: '#fafafa' } // 奇数行背景色
    } else {
        return { backgroundColor: '#ffffff' } // 偶数行背景色
    }
    /*
    // 场景 C：如果你想给特定列的数据（比如第 3 列）加粗或改颜色：
    if (columnIndex === 2) {
        return { color: '#409EFF', fontWeight: 'bold' } // 蓝色加粗
    }
    */
}
/*
*编辑操作 row:行 column:列
*/
const editHandler = (rowIndex, row) => {
    dialogEditVisible.value = true
    Object.assign(editForm, createEditForm())
    if (row?.id) {
        api.getInfoById({ id: row.id }).then(res => {
            if (res.status === 200) {
                const detail = res.result[0]
                Object.assign(editForm, detail || {})
                editForm.startTime = Number(editForm.startTime)
                editForm.endTime = Number(editForm.endTime)
            } else {
                ElMessage.info(res.msg || '获取详情失败')
            }
        }).catch(err => {
            console.log(err)
            ElMessage.error('获取详情失败')
        })
    } else {
        ElMessage.info('some error happen')
    }
}
//编辑确认上传给服务器
const editSureHandler = () => {
    api.updateProjectInfo(editForm).then(res=>{
        dialogEditVisible.value = false
        if(res.status === 200){
            ElMessage.success('update info success')
            http(1)
        }else{
            ElMessage.error(res.msg)
        }
    })
}
/*
*删除操作
*/
const deleteHandler = (row) => {
    if (!row?.id) {
        return ElMessage.warning('删除失败：未找到当前记录')
    }

    ElMessageBox.confirm(
        '删除后该条记录将无法恢复，是否继续？',
        '删除确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            dangerouslyUseHTMLString: false,
            center: true,
        }
    ).then(() => {
        delSureHandler(row.id)
    }).catch(() => {
        ElMessage.info('已取消删除')
    })
}

const delSureHandler = (id) => {
    api.deleteProjectInfo({ id }).then(res => {
        if (res.status === 200) {
            ElMessage.success('删除成功')
            fetchProjectCount()
            http(1)
        } else {
            ElMessage.error(res.msg || '删除失败')
        }
    }).catch(err => {
        console.log(err)
        ElMessage.error('删除出错')
    })
}
/**
 * 模糊查询（带 300ms 防抖）
 */
const searchHandler = () => {
    // 2. 每次点击时，先清除上一次未执行的定时器
    if (searchTimer.value) {
        clearTimeout(searchTimer.value)
    }

    // 3. 立即拦截空输入，提升用户体验（无需等待防抖延迟）
    if (!searchInfo.value) {
        return ElMessage.info('请输入查询内容')
    }

    // 4. 设置新的定时器，300 毫秒内没有新点击则触发请求
    searchTimer.value = setTimeout(() => {
        api.getSearchInfo({ search: searchInfo.value.trim() })
            .then(res => {
                tableData.lists = res.result
            })
            .catch(err => {
                ElMessage.error(err)
            })
    }, 300) // 300 毫秒延迟，可根据需求调整
}
/**
 * 添加
 */
const addHandler = () => {
    dialogAddVisible.value = true

}
/**
 * 确认添加
 * 先验证数据是否有效，再发送数据给后台
 */
const addSureHandler = async (formEl) => {
    if (!formEl) return
    // ❌ 错误排除：必须删除原本写在这里的 formEl.resetFields() 
    // 否则每次点确定都会先清空数据，导致永远校验失败
    await formEl.validate((valid, fields) => {
        if (valid) {
            api.addProjectInfo(addForm).then(res => {
                if (res.status === 200) {
                    ElMessage.success('添加成功')
                    fetchProjectCount()
                    http(1)
                } else {
                    ElMessage.error(res.msg)
                }
            })
            dialogAddVisible.value = false
        } else {
            ElMessage.error('error submit!', fields)
        }
    })
}
// 3. 关键：富文本失去焦点时，手动触发 Element Plus 的单个字段校验
const handleQuillBlur = () => {
    if (ruleFormRef.value) {
        ruleFormRef.value.validateField('remark')
    }
}
//清除searchTimer
onUnmounted(() => {
    clearTimeout(searchTimer.value)
})
</script>
<style scoped>
.search {
    margin-top: 10px;
    background-color: #fff;
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
}

.search .title {
    font-weight: 700;
}

.search .input {
    width: 300px;
    margin-right: 2px;
}

.page {
    margin-top: 10px;
    position: fixed;
    right: 10px;
}

.dialog-footer {
    margin-top: 20px;
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



/* 4. 优化主体内容的间距（可选：避免内容顶到最上面） */
:deep(.custom-dialog .el-dialog__body) {
    padding: 30px 40px 10px 40px !important;
}


/* 修复富文本与 Element 表单在一行时的对齐及高度问题 */
.quill-form-item :deep(.el-form-item__content) {
    display: block;
    /* 覆盖 inline-block 避免工具栏换行错位 */
    line-height: normal;
}

/* 限制富文本编辑器的高度与滚动条 */
.quill-form-item :deep(.ql-container) {
    min-height: 150px;
    max-height: 250px;
    overflow-y: auto;
}

/* 统一输入框边框颜色，使其向 Element Plus 看齐 */
.quill-form-item :deep(.ql-toolbar.ql-snow),
.quill-form-item :deep(.ql-container.ql-snow) {
    border: 1px solid var(--el-border-color-base, #dcdfe6);
}

.quill-form-item :deep(.ql-container.ql-snow) {
    border-top: none;
}

</style>