<template>
    <div class="container">
        <!-- 表格部分 -->
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

        <!-- 图表部分 -->
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card shadow="never" style="overflow: hidden;">
                    <div slot="header">可视化图表</div>
                    <div ref="chart-container" style="height: 400px;">
                        <v-chart :option="chartOption" />
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
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
    import { ref, provide, onMounted, computed } from "vue";
    import axios from "axios";



    // 模拟数据
    const tableData = ref([
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
        },
        {
            "UserID": 4,
            "Username": "user4",
            "Password": "pass456",
            "Email": "",
            "Role": "普通用户"
        },
        {
            "UserID": 5,
            "Username": "admin5",
            "Password": "admin567",
            "Email": "admin5@example.com",
            "Role": "管理员"
        },
        {
            "UserID": 6,
            "Username": "guest6",
            "Password": "guest678",
            "Email": "",
            "Role": "管理员"
        },
        {
            "UserID": 7,
            "Username": "dev7",
            "Password": "dev789",
            "Email": "dev7@example.com",
            "Role": "管理员"
        },
        {
            "UserID": 8,
            "Username": "support8",
            "Password": "support890",
            "Email": "",
            "Role": ""
        }
    ]);
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
    tableHeaders.value = generateHeaders(tableData.value);
    // 定义一个函数来生成表头信息

    // ECharts 相关
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
                title: {
                    text: 'User Data Statistics',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: xAxisData
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


</script>

<style scoped>
    .chart {
        height: 400px;
        margin-top: 20px; /* 添加上下边距 */
    }
</style>