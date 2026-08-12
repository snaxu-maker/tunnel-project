<template>
  <div class="setting-wrapper">
    <!-- Floating Trigger Button -->
    <button class="setting-trigger-btn" @click="drawer = true" aria-label="Open Settings">
      <el-icon class="trigger-icon"><SwitchButton /></el-icon>
    </button>

    <!-- Settings Drawer -->
    <el-drawer 
      v-model="drawer" 
      size="320px" 
      title="系统设置" 
      direction="rtl" 
      :before-close="handleClose"
      destroy-on-close
    >
      <div class="setting-content">
        <!-- Setting Item Box -->
        <div class="setting-item">
          <div class="setting-label">
            <el-icon class="item-icon"><Lock /></el-icon>
            <span>Logo 显示与隐藏</span>
          </div>
          <el-switch v-model="toggleStore.logoToggle" active-color="#409eff" />
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {useToggleStore} from '@/stores/toggleStore'
const toggleStore = useToggleStore();
const drawer = ref(false)

const handleClose = (done) => {
  done()
}
</script>

<style scoped>
/* Floating Tab Style */
.setting-wrapper {
  position: fixed;
  right: 0;
  top: 35%;
  z-index: 2000; /* Ensure it stays above other elements */
}

.setting-trigger-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background-color: #409eff;
  color: #ffffff;
  border: none;
  border-radius: 8px 0 0 8px; /* Smooth left rounded corners */
  cursor: pointer;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.setting-trigger-btn:hover {
  background-color: #66b1ff;
  transform: translateX(-2px); /* Subtle interactive pop-out effect */
}

.trigger-icon {
  font-size: 20px;
}

/* Drawer Content Styling */
.setting-content {
  padding: 8px 4px;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Pushes the switch to the right edge */
  padding: 14px 16px;
  background-color: #f8f9fa; /* Subtle card background */
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.setting-item:hover {
  background-color: #f0f2f5;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 10px; /* Perfect modern spacing between icon and text */
  font-size: 14px;
  color: #303133;
}

.item-icon {
  font-size: 16px;
  color: #909399; /* Neutral gray icon prevents visual clutter */
}
</style>
