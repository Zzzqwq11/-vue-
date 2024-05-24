<template>
  <div class="login-container">
    <el-form :model="form" ref="formRef" @submit.native.prevent="login" class="login-form">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" required></el-input>
      </el-form-item>
      <el-form-item label="密&nbsp;&nbsp;&nbsp;码" prop="password">
        <el-input type="password" v-model="form.password" required></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录进入可视化页面</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
import axios from 'axios';

const router = useRouter();

// 定义响应式变量来存储用户名和密码
const form = ref({
  username: '',
  password: ''
});

/*后端要求在除了login页面，在请求头中加入token字段，是因为它们希望对访问其API的用户进行身份验证。这通常是为了保护API免受未授权访问，
确保只有经过验证的用户才能访问敏感数据或执行特定操作。
在后端定义的login接口中，当用户成功登录时，会返回一个token，这个token是用户身份验证的凭证。*/

// 设置请求头，如果API需要其他特殊头，请添加它们
const headers = {
  'Content-Type': 'application/json'
};

const login = async () => {
  try {
    //console.log(form.value)
    const response = await axios.post('http://localhost:8000/login/', form.value, { headers });
    console.log(form.value)
    console.log(response.data)
    // 根据后端返回的数据结构调整这里的判断逻辑
    if (response.data.status === '200') {
      // 登录成功，解析后端返回的数据
      // 存储token，例如：
      localStorage.setItem('token', response.data.token);
      // 重定向到可视化界面
      router.push('/see');
    } else {
      // 登录失败，显示错误消息
      alert(response.data.message || '用户名或者密码错误');
    }
  } catch (error) {
    // 错误处理
    console.error('登录请求失败', error);
    alert('登录请求失败：' + error.message);
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  //background-color: #f5f7fa;
}
.login-form {
  width: 350px;
  padding: 30px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.el-input {
  width: 100%;
}

/* 增加标签与输入框之间的垂直间距 */
.el-form-item__label {
  font-weight: bold;
  margin-bottom:20px; /*控制垂直间距 根据需要调整此值 */

}


.el-button--primary {
  margin-top: 20px;
}

</style>