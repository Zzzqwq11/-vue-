<template>
  <div class="register-container">
    <div class="register-form-wrapper">
        <el-form :model="form" ref="formRef" class="register-form" :rules="rules">
          <el-alert v-if="showAlert" :closable="true" type="error" title="注册失败" :description="errorDescription" show-icon
           effect="dark" center @close="showAlert = false" class="custom-alert"></el-alert>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" required></el-input>
          </el-form-item>
          <el-form-item label="密&nbsp;&nbsp;&nbsp;码" prop="password">
            <el-input type="password" v-model="form.password" placeholder="请输入密码" required></el-input>
          </el-form-item>
          <el-form-item label="邮&nbsp;&nbsp;&nbsp;箱" prop="email">
            <el-input type="email" v-model="form.email" placeholder="请输入邮箱" required></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="register" >注册</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router';
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus';
import axios from 'axios';

const router = useRouter();

// 添加一个响应式变量来控制警告弹窗的显示
const showAlert = ref(false);
// 定义响应式变量来存储用户名、邮箱和密码
const form = ref({
  username: "",
  password: "",
  email: ""
});
// 错误描述
const errorDescription = ref('');

// 定义表单实例引用
const formRef = ref<FormInstance>(null)

// 定义表单验证规则
const rules = ref({
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
    email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
  ]
});

const register = async () => {
  if (!formRef.value) return;
    // 直接检查用户名和密码是否为空
  if (!form.value.username || !form.value.password || !form.value.email) {
    ElMessage.error('输入不能为空');
    return;
  }
  const valid = await formRef.value.validate();
  if (valid) {
    try {
      console.log(form.value)
      const response = await axios.post('http://localhost:8080/register/', form.value);
      console.log(response.data);
      if (response.data.status === '200') {
        ElMessage.success('注册成功，去登陆');
        router.push('/login');
      } else {
        showAlert.value = true;
        errorDescription.value = response.data.message;
        setTimeout(() => { showAlert.value = false; }, 5000);
      }
    } catch (error) {
      console.error('注册请求失败', error);
      ElMessage.error('注册请求失败：' + error.message);
    }
  } else {
    console.log('表单验证失败!');
  }
};
</script>

<style scoped>

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  //background-color: #f5f7fa;
  background-image:  url('@/assets/login.jpg'); /* 替换为你的背景图片路径 */
  background-size: 100% 100%; /* 背景图片随容器大小变化 */
  background-position: center center;
  background-repeat: no-repeat;
}

.register-form-wrapper {
  backdrop-filter: blur(10px); /* 添加背景模糊效果 */
  background-color: rgba(255, 255, 255, 0.8); /* 半透明背景色 */
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.register-form {
  width: 100%; /* 表单宽度调整为100%，以适应wrapper */
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

/* 自定义 ElAlert 组件的样式 */
.custom-alert {
  /* 在这里添加你的自定义样式 */
  background-color: #f8d7da; /* 示例背景色 */
  color: #721c24; /* 示例文字色 */
  border: 1px solid #f5c6cb; /* 示例边框样式 */
  margin-bottom: 20px;
}
</style>
