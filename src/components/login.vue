<template>
  <div class="login-container">
    <el-form :model="form" ref="formRef" class="login-form" :rules="rules">
      <el-alert v-if="showAlert" :closable="true" type="error" title="登录失败" description="用户名或密码错误，请重试。" show-icon
       effect="dark" center @close="showAlert = false" class="custom-alert"></el-alert>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" required></el-input>
      </el-form-item>
      <el-form-item label="密&nbsp;&nbsp;&nbsp;码" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码" required></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="login" >登录进入可视化页面</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { FormInstance, FormRules,ElMessage } from 'element-plus'
import { useRouter } from 'vue-router';
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
import axios from 'axios';

const router = useRouter();

// 添加一个响应式变量来控制警告弹窗的显示
const showAlert = ref(false);
// 定义响应式变量来存储用户名和密码
const form = ref({
  username: "",
  password: ""
});

// 定义表单实例引用
const formRef = ref<FormInstance>(null)

// 定义表单验证规则
const rules = ref({
username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
});

// 用户名验证为空
const validateUsername = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('用户名不能为空'));
  } else {
    callback();   // 验证通过
  }
};

// 密码验证为空
const validatePassword = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('密码不能为空'));
  } else {
    callback();  // 验证通过
  }
};

// 更新rules以使用自定义验证器
rules.value.username.push({ validator: validateUsername, trigger: 'blur' });
rules.value.password.push({ validator: validatePassword, trigger: 'blur' });

/*后端要求在除了login页面，在请求头中加入token字段，是因为它们希望对访问其API的用户进行身份验证。这通常是为了保护API免受未授权访问，
确保只有经过验证的用户才能访问敏感数据或执行特定操作。
在后端定义的login接口中，当用户成功登录时，会返回一个token，这个token是用户身份验证的凭证。*/

// 设置请求头，如果API需要其他特殊头，请添加它们
const headers = {
  'Content-Type': 'application/json'
};

const login = async () => {
  if (!formRef.value)   return;
  // 直接检查用户名和密码是否为空
  if (!form.value.username || !form.value.password) {
    ElMessage.error('用户名或密码为空');
    return;
  }
  // 在提交前进行表单验证
  const valid = await formRef.value.validate();
  if (valid) {
    try {
      // 登录请求逻辑
      console.log(form.value)
      const response = await axios.post('http://127.0.0.1:8080/login/', form.value, { headers });
      console.log(response.data);
      // 根据后端返回的数据结构调整这里的判断逻辑
      if (response.data.status === '200') {
        // 登录成功，解析后端返回的数据
        localStorage.setItem('token', response.data.token);
        router.push('/see');
      } else {
        // 登录失败，显示警告弹窗
        showAlert.value = true;
        // 可以设置一个定时器在一段时间后自动关闭弹窗
        setTimeout(() => { showAlert.value = false; }, 5000); // 5秒后自动关闭
      }
    } catch (error) {
      console.error('登录请求失败', error);
      alert('登录请求失败：' + error.message);
    }
  } else {
    console.log('表单验证失败!');
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

/* 自定义 ElAlert 组件的样式 */
.custom-alert {
  /* 在这里添加你的自定义样式 */
  background-color: #f8d7da; /* 示例背景色 */
  color: #721c24; /* 示例文字色 */
  border: 1px solid #f5c6cb; /* 示例边框样式 */
  margin-bottom: 20px;
}
</style>