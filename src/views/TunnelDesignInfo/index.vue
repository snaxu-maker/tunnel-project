<template>
    <div class="tunnel">
        <div class="tunnel-list">
            <h3>选择断面</h3>
            <el-tree ref="treeRef" node-key="id" :current-node-key="currentNodeKey" lazy :props="defaultProps"
                @node-click="handleNodeClick" :load="loadNode" accordion>

            </el-tree>
        </div>
        <div class="tunnel-content">
            <el-table :data="tunnelData" style="width: 100%">
                <el-table-column prop="id" label="序号" width="120"></el-table-column>
                <el-table-column prop="tunnelname" label="隧道名称" width="180"></el-table-column>
                <el-table-column prop="imagename" label="图名" width="180"></el-table-column>
                <el-table-column prop="num" label="图号" width="180"></el-table-column>
                <el-table-column prop="url" label="url" width="240"></el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button link type="danger" size="small" @click="previewHandler(scope.$index,scope.row)">预览</el-button>
                        <el-button link type="primary" size="small" @click="uploadHandler(scope.$index,scope.row)">上传</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
    <!-- 上传对话框 start-->
    <el-dialog destroy-on-close v-model="dialogUploadVisible" title="文件上传"  center style="width:500px;" >
        <el-upload v-model:file-list="fileList" 
        action="http://localhost:3000/api/upload"
        :limit="1"
        :on-exceed="handleExceed" 
        class="upload-file"
        :on-success="handleFileSuccess"
        >
            <el-button type="primary" class="upload-btn">点击上传</el-button>
        </el-upload>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogUploadVisible = false">取消</el-button>
                <el-button type="success" @click="dialogUploadVisible = false">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 上传对话框 end-->

</template>
<script setup>
import api from '@/api/index'
import { ElMessage } from 'element-plus'
import { nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
//上传文件
const fileList = ref([])
const currentId = ref(0)
const dialogUploadVisible = ref(false)
const tunnelData = ref([])
const treeRef = ref(null)
const defaultProps = {
    label: 'name',
}
const firstRootParentCid = ref(null)
const currentNodeKey = ref(null)
const selectFirstChild = (children, attempt = 0) => {
    if (!treeRef.value || !children.length) return

    const firstChild = children[0]
    if (!firstChild) return

    const currentNode = treeRef.value.getNode(firstChild.id)
    if (currentNode) {
        currentNodeKey.value = firstChild.id
        treeRef.value.setCurrentKey(firstChild.id)
        handleNodeClick(currentNode.data)
        return
    }

    if (attempt < 15) {
        setTimeout(() => {
            selectFirstChild(children, attempt + 1)
        }, 50)
    }
}
const handleNodeClick = (data) => {
    if (!data.content) return tunnelData.value = []
    api.getTunnelContent({ content: data.content }).then(res => {
        if (res.status === 200) {
            tunnelData.value = res.result
        }
    }).catch(err => {
        console.log(err);

    })

}
const loadNode = (node, resolve) => {
    //一级tree
    if (node.level === 0) {
        api.getTunnelList().then(res => {
            if (res.status === 200) {
                const list = res.result || []
                resolve(list)

                if (!firstRootParentCid.value && list.length) {
                    firstRootParentCid.value = list[0].cid
                    nextTick(() => {
                        const firstRootNode = treeRef.value?.getNode(list[0].id)
                        if (firstRootNode) {
                            firstRootNode.expand()
                        }
                    })
                }
                return
            }
            resolve([])
        }).catch(err => {
            console.log(err);

        })
    }
    //二级tree
    if (node.level === 1) {
        api.getTunnelListChild({ cid: node.data.cid }).then(res => {
            if (res.status === 200) {
                const children = res.result || []
                resolve(children)

                if (node.data.cid === firstRootParentCid.value && children.length) {
                    nextTick(() => {
                        selectFirstChild(children)
                    })
                }
                return
            }
            resolve([])
        }).catch(err => {
            console.log(err);

        })
    }
    if (node.level > 1) {
        return resolve([])
    }
}
//预览
const previewHandler = (index, row) => {
    router.push('/pdf/'+row.id)
}
//上传
const uploadHandler = (index, row) => {
    //console.log(index, row);
    dialogUploadVisible.value = true;
    currentId.value = row.id

}
//文件上传超出时
const handleExceed = (files, uploadFiles) => {
    ElMessage.warning(
        `The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length} totally`
    )
}
//文件上传成功
const handleFileSuccess = (response, uploadFile) => {
    console.log(response, uploadFile);
    api.updateTunnelContentUrl({
        url:response.data.filename,
        id:currentId.value
    }).then(result => {
        if(result.status === 200){
            ElMessage.success(result.msg)
        }else{
            ElMessage.info(result.msg)
        }
    }).catch(err => {
        console.log(err);
    })
}
</script>
<style scoped>
.tunnel {
    display: flex;

}

.tunnel-list {
    width: 250px;
    padding: 10px;
    margin-right: 10px;
    background-color: #fff;
}

.tunnel-content {
    flex: 1;
    background-color: #fff;
}

.tunnel-list h3 {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 10px;
}

.upload-file {
    display: inline-block;
}
.upload-btn{
    margin-left: 20px;
}
</style>