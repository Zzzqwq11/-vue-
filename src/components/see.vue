<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="never" style="overflow: hidden;">
          <div slot="header">SQL 查询</div>
          <el-input v-model="sql" placeholder="输入查询内容"></el-input>
          <el-button type="primary" @click="sendQuery">发送查询</el-button>
          <pre>{{ sql }}</pre>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="never" style="overflow: hidden;">
          <div slot="header">查询结果</div>

          <!--tableData是一个响应式的数据属性，它绑定了表格的数据源。表格列定义了六个列，每列通过prop属性指定与数据对象的对应字段名，
          label属性定义了列头的文本，width则指定了列的宽度。当tableData的值改变时，表格会自动更新以反映新的数据。-->
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="UserID" label="UserID" width="180"></el-table-column>
            <el-table-column prop="Username" label="用户名" width="180"></el-table-column>
            <el-table-column prop="Email" label="邮箱" width="180"></el-table-column>
            <el-table-column prop="Role" label="用户" width="180"></el-table-column>

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

<script>
import { defineComponent, ref } from 'vue';
import axios from 'axios';

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts';

export default defineComponent({
  name: 'see',
  setup() {
    //ref 是一个用于创建响应式引用的函数。当你使用 ref 来定义一个变量时，你实际上创建了一个响应式的引用对象，该对象有一个 .value 属性，用于存储实际的值。
    const sql = ref('');
    const tableData = ref([]);// 假设tableData存储查询结果，
    const chartContainer = ref(null);

    // 初始化图表
    function initChart() {
      let chart = echarts.init(chartContainer.value);
      let option = {
        // ... 你的图表配置
      };

      chart.setOption(option);
    }

    // 发送查询请求
    async function sendQuery() {
      try {
        //在 login.vue 中通过 localStorage.setItem('token', response.data.token); 将后端返回的令牌存储在本地存储中，
        //然后在 see.vue 或任何其他需要使用令牌的组件中通过 const token = localStorage.getItem('token'); 来获取这个令牌。
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Token not found, 请先登录.'); // 使用alert显示错误信息
          return; // 如果没有token，则提前终止请求
        }

        // 在请求头中设置token
        const headers = {
          'Content-Type': 'application/json',  // 指定请求体的媒体类型为 JSON，以便服务器知道如何解析请求内容
           Authorization: `Bearer ${token}`     // 添加认证信息，用于验证请求者的身份
        };

        /* 发送带有token的请求，将Vue实例中的sql变量的值作为user_input字段发送给服务器。*/
        const response = await axios.post('http://localhost:8000/query/', { user_input: sql.value }, { headers });

        const { status, sql_queries } = response.data;

        //严格相等运算符。它要求两边的值不仅要相等，而且数据类型也要相同。
        if (status === '200') {
          tableData.value = [sql_queries];
          initChart(); // 重新初始化图表
        } else {
          alert('status 不为200查询失败');
        }
      } catch (error) {
        console.error('查询请求失败', error);
        alert('查询请求失败：' + error.message);
      }
    }

    return {
      sql,
      tableData,
      chartContainer,
      initChart,
      sendQuery
    };
  }
});

</script>

<style scoped>
.container {
  padding: 10px 80px;
  width: 100%;


}
</style>