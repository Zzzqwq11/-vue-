<template>
    <!-- 查询结果显示表格 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="never" style="overflow: hidden;">
          <div slot="header">查询结果</div>
          <el-table :data="mockTableData" border style="width: 100%">
            <el-table-column v-for="(header, index) in mockHeaders" :key="index" :prop="header.key" :label="header.label" :width="header.width || '180'"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>


</template>

<script setup>
import { ref } from 'vue';
import * as echarts from 'echarts';

// 生成表头信息的函数
const generateHeaders = (data) => {
  return Object.keys(data[0]).map(key => ({ key, label: key.toUpperCase().replace('_', ' '), width: '180' }));
};

// 模拟数据
const mockTableData = ref([
  { id: 1,  revenue: 12000, cost: 8000 },
  { id: 2,  revenue: 9000, cost: 6000 },
  // 更多数据...
]);

// 基于模拟数据生成表头
const mockHeaders = ref(generateHeaders(mockTableData.value));

</script>
<style scoped>

</style>