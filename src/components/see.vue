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
                <!--  ref 来引用图表的容器元素 -->
              <div style="height: 400px;" ref="chartContainer">
                <!-- 图表内容 -->
                  <v-chart :option="chartOption" />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>



</template>

<script setup>
import { defineComponent } from 'vue';
import axios from 'axios';

import { useRouter } from 'vue-router';

    import { use } from "echarts/core";
    import * as echarts from 'echarts';
    import { CanvasRenderer } from "echarts/renderers";
    import { BarChart } from "echarts/charts";
    import {
        TitleComponent,
        TooltipComponent,
        LegendComponent,
        GridComponent
    } from "echarts/components";
    import VChart, { THEME_KEY } from "vue-echarts";
    import { ref, provide, onMounted, onUnmounted, computed, nextTick } from "vue";

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

// 定义headers为响应式的ref，用于存储动态生成的表头信息
const tableHeaders = ref([]);

const chartContainer = ref(null);
const chartOption = ref({});
use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);

provide(THEME_KEY, "dark");

// 根据tableData生成图表配置
const generateChartOption = () => {
  if (tableData.value.length > 0) {
    const xAxisData = tableHeaders.value.map(header => header.label);
    const seriesData = tableHeaders.value.map(header => {
       return tableData.value.reduce((count, row) => {
           // 只有当row[header.key]存在且不为空时，才会计数
          if (row[header.key] !== null && row[header.key] !== undefined && row[header.key] !== '') {
            return count + 1;
              }
            return count;
          }, 0); // 初始计数为0
      });

    chartOption.value = {

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Count'] // 只包含实际存在的系列名称
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: xAxisData
      },
      series: [
        {
          name: 'Count',
          type: 'bar',
          data: seriesData,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          }
        }
      ]
    };
  }
};


    // 初始化图表
    const initChart = () => {
        if (chartContainer.value) {
            const chart = echarts.init(chartContainer.value);
            chart.setOption(chartOption.value);
        }
    };
    onMounted(() => {
        generateChartOption();
        initChart();
    });


// 发送查询请求
const sendQuery = async () => {
    const response = {
    "status": "200",
    "sql_queries": [
        {
            "UserID": 1,
            "Username": "root",
            "Password": "root123",
            "Email": "root@example.com",
            "Role": ""
        },
        {
            "UserID": 2,
            "Username": "root",
            "Password": "root123",
            "Email": "root@example.com",
            "Role": "管理员"
        },
        {
            "UserID": 3,
            "Username": "test",
            "Password": "test123",
            "Email": "test@test.com",
            "Role": "普通用户"
        }
    ]
};
    console.log(response)
    const { status, sql_queries } = response;
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
      // 在sendQuery方法中
      await nextTick(); // 确保DOM更新
      initChart();// 重新初始化图表
      console.log("好")
    } else {
      alert('status 不为200查询失败');
    }
};





</script>

<style scoped>

.header-buttons {
  margin-bottom: 20px; /* 为下方内容留出空间 */
}

/* 可能需要覆盖Element UI的默认样式以达到最佳视觉效果 */
.button-circle .el-icon {
  font-size: 24px; /* 图标大小 */
}

    .chart {
        height: 400px;
        margin-top: 20px; /* 添加上下边距 */
    }

</style>