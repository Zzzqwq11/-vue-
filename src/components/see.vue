<template>
      <div class="container">
        <el-row justify="start" align="middle" class="header-buttons">
          <el-col :span="8" :xs="24">
            <el-button type="primary" plain @click="navigateTo('/usersettings')"  >个人设置</el-button>
            <el-button type="primary" plain @click="navigateTo('/help')"  >帮助与支持</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-card shadow="never" style="overflow: hidden;">
              <div slot="header">SQL 查询</div>
              <el-input v-model="sql" placeholder="输入查询内容" @input="validateSql"></el-input>
              <el-button type="primary" :disabled="isSqlInvalid" @click="sendQuery">发送查询</el-button>
              <el-message v-if="sqlError" type="error">{{ sqlError }}</el-message>
              <pre>{{ sql }}</pre>
            </el-card>
          </el-col>
        </el-row>
        <!-- 动态地根据后端返回的数据展示表格列 -->
          <el-row :gutter="20">
            <el-col :span="24">
              <el-card shadow="never" style="overflow: hidden;">
                <div slot="header">查询结果</div>
                <el-table :data="tableData" border style="width: 100%">
                  <el-table-column v-for="(header, index) in tableHeaders" :key="index" :prop="header.key" :label="header.label" :width="header.width || '180'"></el-table-column>
                </el-table>
              </el-card>
            </el-col>
          </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-card shadow="never" style="overflow: hidden;">
              <div slot="header">可视化图表</div>
              <div id="chart-container" style="height: 400px;">
                <!-- 图表内容 -->
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>



</template>

<script setup>
import { defineComponent, ref } from 'vue';
import axios from 'axios';

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts';
import { useRouter } from 'vue-router';
// 定义navigateTo方法
const router = useRouter();
const navigateTo = (path) => {
  router.push(path);
};

const sql = ref('');
const sqlError = ref('');
const isSqlInvalid = ref(false);

const validateSql = () => {
  if (!sql.value.trim()) {
    sqlError.value = 'SQL 输入不能为空';
    alert('不能为空')
    isSqlInvalid.value = true;
  } else {
    sqlError.value = '';
    isSqlInvalid.value = false;
  }
};

const tableData = ref([]);// 假设tableData存储查询结果，
const chartContainer = ref(null);

const initChart = () => {
  const chart = echarts.init(chartContainer.value);
  const option = {
    // ... 你的图表配置
  };
  chart.setOption(option);
};

// 定义headers为响应式的ref，用于存储动态生成的表头信息
const tableHeaders = ref([]);
// 定义一个函数来生成表头信息
const generateHeaders = (data) => {
  if (data && data.length > 0) {
    const firstItem = data[0];
    return Object.keys(firstItem).map(key => ({
      key,
      label: key.toUpperCase().replace('_', ' '), // 将下划线替换为空格，并转为大写作为标题
      width: '180' // 默认宽度
    }));
  }
  return []; // 如果没有数据，返回空数组
};
// 发送查询请求
const sendQuery = async () => {
   //在 login.vue 中通过 localStorage.setItem('token', response.data.token); 将后端返回的令牌存储在本地存储中，
   //然后在 see.vue 或任何其他需要使用令牌的组件中通过 const token = localStorage.getItem('token'); 来获取这个令牌。
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
    console.log(sql.value)
    const response = await axios.post('http://localhost:8000/query/', { user_input: sql.value }, { headers });
    console.log(response.data)
    const { status, sql_queries } = response.data;
    // 打印status和sql_queries
    console.log('Status:', status);
    console.log('SQL Queries:', sql_queries);
    //严格相等运算符。它要求两边的值不仅要相等，而且数据类型也要相同。
    if (status === '200') {
      tableData.value = sql_queries; // 直接赋值数组，无需额外包装
      tableHeaders.value = generateHeaders(sql_queries); // 使用tableHeaders.value来更新表头
    console.log('Table Headers:', tableHeaders.value);
    console.log('Table Data:', tableData.value);
      // 确保图表容器存在并且数据已更新后，初始化图表
      initChart();// 重新初始化图表
    } else {
      alert('status 不为200查询失败');
    }
  } catch (error) {
    console.error('查询请求失败', error);
    alert('查询请求失败：' + error.message);
  }
};



/// 使用 onMounted 钩子初始化图表
//onMounted(() => {
//  // 如果有需要在页面加载时立即执行的初始化逻辑，可以在这里写，但注意检查是否依赖于已经渲染的 DOM
//  // 注意：如果图表依赖于从服务器获取的数据，那么这里的调用可能不适用，应确保数据存在后再初始化图表

//});


</script>

<style scoped>

.header-buttons {
  margin-bottom: 20px; /* 为下方内容留出空间 */
}

/* 可能需要覆盖Element UI的默认样式以达到最佳视觉效果 */
.button-circle .el-icon {
  font-size: 24px; /* 图标大小 */
}


.container {
  padding: 10px 80px;
  width: 100%;

}
</style>