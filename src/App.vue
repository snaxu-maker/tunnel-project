<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
<RouterView/>
</template>

<style>
/* 公共样式 */
body,html,#app{
  width: 100%;
  height: 100%;
}
/* 修改dialog的header样式 */
.el-dialog{
 padding-left: 0 !important;
 padding-right: 0 !important;
 padding-top: 0 !important;
}
.el-tree-node.is-current {
  background-color: #e8f4ff !important;
}
.el-tree > .el-tree-node.is-current {
  background-color: transparent !important;
}
</style>
