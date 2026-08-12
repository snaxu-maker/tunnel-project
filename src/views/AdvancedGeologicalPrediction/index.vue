<template>
    <div class="china" id="china"></div>
</template>
<script setup>
import {getCurrentInstance,onMounted} from 'vue'
const {proxy} = getCurrentInstance()
onMounted(()=>{
    proxy.$china('china')
})
</script>
<style scoped>
.china{
    width: 1000px;
    height: 1200px;
    background-color: #fff;
    padding: 20px;
}

</style>