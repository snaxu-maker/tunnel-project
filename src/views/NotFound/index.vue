<template>
  <div class="not-found-container">
    <h1>404</h1>
    <h2>抱歉，您访问的页面不存在</h2>
    <p class="error-path">当前路径: <code>{{ $route.params.pathMatch }}</code></p>
    <router-link to="/" class="back-home">返回首页</router-link>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  font-family: Arial, sans-serif;
}
h1 {
  font-size: 72px;
  margin-bottom: 0;
  color: #f5222d;
}
h2 {
  font-size: 24px;
  color: #333;
}
.error-path {
  color: #8c8c8c;
  margin: 15px 0;
}
code {
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  color: #c41d7f;
}
.back-home {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #1890ff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
.back-home:hover {
  background-color: #40a9ff;
}
</style>
