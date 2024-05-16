<template>
  <el-container>
    <el-main>
      <el-row type="flex" justify="center" align="middle" style="height: 100vh">
        <el-col :span="6">
          <el-card>
            <h1>登录</h1>
            <el-form @submit.prevent="login">
              <el-form-item label="用户名">
                <el-input v-model="username"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input type="password" v-model="password"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="login">登录</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const username = ref('');
const password = ref('');
const router = useRouter();
const store = useStore();

const login = () => {
  if (username.value === 'admin' && password.value === '123') {
    store.commit('login');
    router.push('/home_1');
  }
};

export default {
  setup() {
    return {
      username,
      password,
      login
    };
  }
};
</script>

