<template>

  <div id="app">
    <header class="navbar">
      <el-menu
        mode="horizontal"
        background-color="#ffffff"
        text-color="#333"
        active-text-color="#409eff"
        class="el-menu-horizontal no-underline"
      >
        <div class="logo-container">
          <img src="@/assets/logo.png" alt="Logo" class="logo" />
        </div>
        <el-menu-item index="1"><RouterLink to="/"><el-icon><House /></el-icon>首页</RouterLink></el-menu-item>
        <el-menu-item index="2"><RouterLink to="/service"><el-icon><Service /></el-icon>服务</RouterLink></el-menu-item>
        <el-menu-item index="3"><RouterLink to="/contact"><el-icon><Connection /></el-icon>联系我们</RouterLink></el-menu-item>
        <el-menu-item index="4" ><RouterLink to="/login"><el-icon><UserFilled /></el-icon>登录</RouterLink></el-menu-item>
        <el-menu-item index="5" ><RouterLink to="/register"><el-icon><User /></el-icon>注册</RouterLink></el-menu-item>
      </el-menu>
    </header>
    <main>
        <router-view></router-view>
    </main>
    <footer class="text-center">
      &copy; 2024 data-co-pliot： 王宇祥；邹俊；蒋文强；孙兴；童鑫
    </footer>
  </div>
</template>

<script setup>
import { ElButton, ElIcon  } from 'element-plus';
import { UserFilled, User,Service,House,Connection } from '@element-plus/icons-vue';
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.navbar {
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 999;
  display: flex;
  align-items: center; /* 垂直居中 */
  padding: 10px;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  height: 30px;
  margin-right: 10px; /* Logo与菜单项之间的间距 */
  margin-top: 0px; /* Logo与菜单项之间的间距 */
}

.el-menu-horizontal {
  display: flex;
  justify-content: center; /* 保持这一行以确保菜单项水平居中 */
  width: 100%; /* 确保菜单项容器宽度铺满其父元素 */
  background-color:;
}
/* 或者如果你想要去除所有菜单项的下划线，可以使用以下样式 */
.no-underline .el-menu-item,
.no-underline .el-menu-item a {
  text-decoration: none;
}

.el-menu-item {
  margin: 0 10px; /* 左右各10px的间距，根据需要调整 */


}

main {
  flex: 1; /* 让 main 部分占据剩余空间 */
  padding: 20px;
}

.footer {
  padding: 10px;
  text-align: center;
  background-color: #f8f9fa;
  position: sticky;
  bottom: 0;
  width: 100%;
}

</style>
