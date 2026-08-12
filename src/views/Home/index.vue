<template>
    <div class="card">
        <div class="box">
            <!-- 1. 科技深蓝 (沉稳、专业) -->
            <el-icon class="box-icon" style="color:#1e80ff">
                <ElementPlus />
            </el-icon>
            <span class="box-title">隧道数量:1000个</span>
        </div>
        <div class="box">
            <!-- 2. 薄荷清新绿 (生机、安全) -->
            <el-icon class="box-icon" style="color:#00b578">
                <SuccessFilled />
            </el-icon>
            <span class="box-title">检验合格:805个</span>
        </div>
        <div class="box">
            <!-- 3. 高级冷橙 (活力、明亮) -->
            <el-icon class="box-icon"  style="color:#ff7a00">
                <WarningFilled />
            </el-icon>
            <span class="box-title">正在施工:120个</span>
        </div>
        <div class="box">
            <!-- 4. 优雅茱萸粉 (温柔、精致) -->
            <el-icon class="box-icon" style="color:#ff69b4">
                <Warning />
            </el-icon>
            <span class="box-title">地质预报:30个</span>
        </div>
    </div>
    <div class="line" id="line"></div>
    <div class="charts">
        <div class="radar" id="radar"></div>
        <div class="scatter" id="scatter"></div>
        <div class="pie" id="pie"></div>
    </div>

</template>
<script setup>
import {getCurrentInstance,onMounted} from 'vue'
import api from '@/api/index'
const {proxy} = getCurrentInstance()
onMounted(()=>{
    api.getLineData().then(res=>{
        if(res.status===200){
            proxy.$line('line',res.result)
        }
    }).catch(err=>{
        console.log(err);
    })
    proxy.$radar('radar')
    proxy.$scatter('scatter')
    proxy.$pie('pie')
})

</script>
<style scoped>
.card {
    display: flex;
}

.card .box {
    flex: 1;
    height: 130px;
    margin: 20px;
    padding: 20px;
    background-color: #fff;
}
.card .box:nth-child(1){
    margin-left: 0;
}
.card .box:nth-child(4){
    margin-right: 0;
}
.box-icon {
    display: block;
    float: left;
    font-size: 35px;
    color: #40c9c6;
    padding-left: 10px;
    line-height: 130px;
    margin-right: 5px;

}

.box-title {
    display: block;
    float: left;
    line-height: 130px;
    font-size: 13px;
    color: #666
}
.line{
    width: 100%;
    height: 300px;
    background-color: #fff;
}

.charts{
    display: flex;
    width: 100%;
    height: 450px;
    margin-top: 10px;
}
.charts div{
    flex: 1;
    padding: 10px;
    margin: 10px;
    background-color: #fff;
}
.charts div:first-child{
    margin-left: 0;
}
.charts div:last-child{
    margin-right: 0;
}
</style>