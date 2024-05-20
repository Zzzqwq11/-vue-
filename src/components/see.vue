<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="never" style="overflow: hidden;">  <!--shadow="never" 移除了阴影效果，style="overflow: hidden;" 限制了卡片内容不会溢出。-->
          <div slot="header">SQL 查询</div>
          <pre>{{ sql }}</pre>
        </el-card>

      </el-col>
      <el-col :span="8">
        <el-card shadow="never" style="overflow: hidden;">
          <div slot="header">查询结果</div>
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="180"></el-table-column>
            <el-table-column prop="username" label="用户名" width="180"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
            <el-table-column prop="age" label="年龄" width="180"></el-table-column>
            <el-table-column prop="gender" label="性别" width="180"></el-table-column>
            <el-table-column prop="city" label="城市" width="180"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never" style="overflow: hidden;">
          <div slot="header">可视化图表</div>
          <div id="chart-container">
            <!-- 图表内容 -->
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts";

export default defineComponent({
  name: "See",
  setup() {
    const sql = ref("");
    const tableData = ref([]);
    const chartContainer = ref(null);

    // 示例数据
    const sampleData = [
      { id: 3, username: "王五", email: "wangwu@example.com", age: 40, gender: "男", city: "广州" },
      { id: 7, username: "小华", email: "xiaohua@example.com", age: 32, gender: "男", city: "天津" },
      { id: 9, username: "小李", email: "xiaoli2@example.com", age: 38, gender: "男", city: "武汉" }
    ];

    // 初始化图表
    function initChart() {
      let chart = echarts.init(chartContainer.value);
      let option = {
        title: {
          text: "User Information"
        },
        tooltip: {},
        legend: {
          data: ["广州", "天津", "武汉"]
        },
        xAxis: {
          data: ["王五", "小华", "小李"]
        },
        yAxis: {},
        series: [
          {
            name: "广州",
            type: "bar",
            data: [40]
          },
          {
            name: "天津",
            type: "bar",
            data: [32]
          },
          {
            name: "武汉",
            type: "bar",
            data: [38]
          }
        ]
      };

      chart.setOption(option);
    }

    return {
      sql,
      tableData,
      chartContainer,
      initChart,
      sampleData
    };
  }
});
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>