<template>
  <div class="user-profile">
    <h1>个人信息</h1>
    <el-card class="profile-card">
      <el-descriptions title="当前个人信息" :column="1">
        <el-descriptions-item label="用户名：">{{ userProfile.username }}</el-descriptions-item>
        <el-descriptions-item label="密&nbsp;&nbsp;&nbsp;码：">{{ userProfile.password }}</el-descriptions-item>
        <el-descriptions-item label="邮&nbsp;&nbsp;&nbsp;箱：">{{ userProfile.email }}</el-descriptions-item>
      </el-descriptions>
      <el-button type="primary" @click="showUpdateForm = true" plain>更新个人信息</el-button>
      <!-- 将整个表单包裹在一个元素中，并使用v-if控制 -->
      <div v-if="showUpdateForm">
          <el-form  :model="updateInfo"  label-width="80px" class="update-form">
                <el-form-item label="更新邮箱" >
                  <el-input v-model="updateInfo.email" placeholder="请输入新邮箱，不输入邮箱不变"></el-input>
                </el-form-item>
                <el-form-item label="更新密码" >
                  <el-input v-model="updateInfo.password" show-password placeholder="请输入新密码，不输入密码不变"></el-input>
                </el-form-item>
              <el-button type="primary" @click="updateUserInfo">保存更改</el-button>
          </el-form>
      </div>
    </el-card>
    <el-button type="primary" @click="logout" class="logout-button">退出</el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';


// 假设使用Vue Router，确保已经正确设置
import { useRouter } from 'vue-router';

const router = useRouter();
const userProfile = ref({});

// 模拟获取用户信息
const fetchUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Token not found, 请先登录.');
    return;  //没有token，提前终止请求
  }

  const headers = {
    'Content-Type': 'application/json',  // 指定请求体的媒体类型为 JSON，以便服务器知道如何解析请求内容
    Authorization: `${token}`            // 添加认证信息，用于验证请求者的身份
  };

  try {
    console.log(userProfile.value)
    const response = await axios.get('http://localhost:8080/UserCRUD/',{ headers });
    if (response.data.status === '200') {
      userProfile.value = response.data.users[0];
      console.log(userProfile.value)
    } else {
      ElMessage.error('获取用户信息失败');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    ElMessage.error('网络错误，请稍后重试');
  }
};

// 退出登录方法
const logout = () => {
  // 清理本地存储中的token或其他登录状态信息
  localStorage.removeItem('token');
  router.push('/login');
};

// 页面加载时获取用户信息
onMounted(() => {
  fetchUserProfile();
});


// 新增数据模型以存储待更新的用户信息
const updateInfo = ref({
  email: '',
  password: ''
});

// 新增状态变量用于控制表单的显示
const showUpdateForm = ref(false);

// 更新用户信息的方法
const updateUserInfo = async () => {
      try {
          const token = localStorage.getItem('token');
          if (!token) {
            alert('Token not found, 请先登录.');
            return;  //没有token，提前终止请求
          }
          const headers = {
            'Content-Type': 'application/json',  // 指定请求体的媒体类型为 JSON，以便服务器知道如何解析请求内容
            Authorization: `${token}`            // 添加认证信息，用于验证请求者的身份
          };
        console.log(updateInfo.value)
        const response = await axios.put('http://localhost:8080/UserCRUD/', updateInfo.value,{ headers });
        if (response.data.status === '200') {
          ElMessage.success('个人信息更新成功');
          // 如果需要，可以在此处刷新用户信息
          await fetchUserProfile();
        } else {
          ElMessage.error('更新个人信息失败');
        }
      } catch (error) {
        console.error('Error updating user profile:', error);
        ElMessage.error('网络错误，请稍后重试');
      } finally {
        // 关闭表单
        showUpdateForm.value = false;
      }

};



</script>

<style scoped>
.user-profile {
  max-width: 600px;
  margin: 0px auto;
  padding: 20px;
  border-radius: 8px;
}

.user-profile h1 {
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
}

.profile-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.user-profile .el-descriptions {
  padding: 20px;
}

.user-profile .el-descriptions-item {
  margin-bottom: 10px;
  font-size: 16px;
}

.update-form {
  padding: 20px;
}

.logout-button {
  display: block;
  margin: 20px auto 0;
  border-radius: 0px;
  font-size: 18px;
  transition: transform 0.3s ease;
}

.logout-button:hover {
  transform: scale(1.05);
}

/* 添加过渡效果 */
.update-form .el-form-item {
  margin-bottom: 22px;
}

.update-form .el-form-item:last-child {
  margin-bottom: 0;
}

.update-form .el-input__inner {
  border-radius: 20px;
  padding: 12px 20px;
  font-size: 16px;
  transition: box-shadow 0.3s ease;
}

.update-form .el-input__inner:focus {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.5);
}
</style>