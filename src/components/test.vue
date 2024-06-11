<style scoped>
    .container {
        font-family: Arial, sans-serif;
    }

    .header-buttons {
        margin-bottom: 20px; /* 为下方内容留出空间 */
    }

    .el-checkbox-group {
        margin: 16px 0;
    }

    .el-checkbox {
        margin-right: 8px;
    }

    .send-query-button {
        background-color: #007bff !important;
        border-color: #007bff !important;
    }

        .send-query-button:hover {
            background-color: #0056b3 !important;
            border-color: #0056b3 !important;
        }

    .checkbox-group-container {
        /* 限制宽度，例如设置为300px，根据需要调整 */
        width: 100%;
    }


    .chart {
        height: 600px;
        margin-top: 20px; /* 添加上下边距 */
        margin-bottom: 20px; /* 添加上下边距 */
    }
</style>

<template>
    <div class="container">
        <!-- 头部按钮 -->
        <el-row justify="start" align="middle" class="header-buttons">
            <el-col :span="8" :xs="24">
                <el-button type="primary" plain @click="navigateTo('/usersettings')">个人设置</el-button>
                <el-button type="primary" plain @click="navigateTo('/help')">帮助与支持</el-button>
            </el-col>
        </el-row>
        <!-- SQL 查询区域 -->
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card shadow="always" style="border-radius: 8px;">
                    <div slot="header">SQL 查询</div>
                    <!-- 数据库下拉菜单 -->
                    <el-select v-model="selectedDatabase" placeholder="请选择要查询的数据库">
                        <el-option v-for="db in availableDatabases"
                                   :key="db"
                                   :label="db"
                                   :value="db" />
                    </el-select>
                    <!-- 切换数据库按钮 -->
                    <el-button type="primary" @click="switchDatabase">切换一个数据库</el-button>
                    <el-input v-model="sql" placeholder="输入查询内容"></el-input>
                    <el-button type="primary"
                               @click="sendQuery"
                               class="send-query-button">发送查询</el-button>
                    <pre>{{ sql }}</pre>
                </el-card>
            </el-col>
        </el-row>
        <!-- 查询结果表格 -->
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card shadow="never" style="overflow: hidden;">
                    <div slot="header">查询结果</div>
                    <el-table :data="tableData" border style="width: 100%">
                        <el-table-column v-for="(header, index) in tableHeaders" :key="index" :prop="header.key" :label="header.label" :width="header.width"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>

        <!-- 数据可视化配置区 -->
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card shadow="always">
                    <div slot="header" style="margin-bottom: 20px;">请选择您的可视化需求</div>
                    <div>
                        <!-- 使用嵌套的 el-row 来组织内容 -->
                        <el-row :gutter="8" v-if="tableData.length">
                            <!-- 第一行：图表类型 -->
                            <el-col :span="12">
                                <p style="display: flex; align-items: center;">①图表类型</p>
                                <el-radio-group v-model="chartType" @change="handleChartTypeChange">
                                    <el-radio :value="'bar'">条形图</el-radio>
                                    <el-radio :value="'pie'">饼图</el-radio>
                                </el-radio-group>
                            </el-col>
                        </el-row>
                        <!-- 第二行：列属性名 -->
                        <el-row :gutter="8" v-if="tableData.length">
                            <el-col :span="12">
                                <p style="display: flex; align-items: center;">②列属性名：</p>
                                <div class="checkbox-group-container">
                                    <el-checkbox-group v-model="selectedColumnsForChart" @change="handleColumnSelect">
                                        <el-checkbox v-for="header in tableHeaders" :key="header.key" :label="header.label" :value="header.key"></el-checkbox>
                                    </el-checkbox-group>
                                </div>
                            </el-col>
                        </el-row>
                        <el-button type="primary" @click="clearSelectedColumns" v-if="tableData.length">清除所有列</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 可视化图表 -->
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card shadow="never" style="overflow: hidden;">
                    <div slot="header">可视化图表</div>
                    <div style="height: 500px;" ref="chartContainer">
                        <v-chart :option="chartOption" autoresize />
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
    import { defineComponent } from 'vue';
    import axios from 'axios';

    import { useRouter, useRoute } from 'vue-router';

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
    import { ref, provide, watch, onMounted, onUnmounted, computed, nextTick } from "vue";
    import { ElMessage } from 'element-plus';

    // 定义navigateTo方法
    const router = useRouter();
    const route = useRoute();
    const navigateTo = (path) => {
        router.push(path);
    };

    const sql = ref('');

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

    //定义一个变量来持有图表实例，这样我们可以在需要时销毁它
    let chartInstance = null;
    const initChart = () => {
        if (chartInstance) {
            chartInstance.dispose(); // 销毁旧实例
        }
        if (chartContainer.value) {
            chartInstance = echarts.init(chartContainer.value);
            chartInstance.setOption(chartOption.value);
        }
    };
    const selectedColumnsForChart = ref([]);   // 用于存储用户选择的列
    const handleColumnSelect = (selection) => {
        // 更新选中的列信息
        selectedColumnsForChart.value = selection;

        // 检查是否至少有一个选项被选中
        if (selectedColumnsForChart.value.length > 0) {
            // 基于选中的列生成图表配置
            generateChartOption();
            // 初始化或更新图表
            initChart();
            // 如果用户选择的列超过三列，只保留前三列
            if (selectedColumnsForChart.value.length > 3) {
                ElMessage.warning('最多只能选择三列，请重新选择');
                if (chartInstance) {
                    chartInstance.clear();
                }
            }
        } else {
            // 如果没有选项被选中，可以清理现有图表考虑给出提示
            ElMessage.error('至少选择一列');
            if (chartInstance) {
                chartInstance.clear();
            }
        }
    };
    function clearSelectedColumns() {
        selectedColumnsForChart.value = []; // 清空选择的列名数组
    }

    const chartType = ref(''); // 不默认选择任何图表类型
    const handleChartTypeChange = () => {
        if (chartType.value === 'bar' || chartType.value === 'pie') {
            generateChartOption();
            initChart();
        } else {
            // 如果chartType为空，清除图表配置
            chartOption.value = {};
            if (chartInstance) {
                chartInstance.clear();
            }
        }
    };
    // 发送查询请求
    const sendQuery = async () => {
        selectedColumnsForChart.value = []; // 清空选择的列名数组
        // 输入验证逻辑
        if (!sql.value.trim()) {
            ElMessage.error('输入内容不能为空'); // 显示错误消息
            return; // 验证失败，直接返回，不执行后续查询逻辑
        }
        const response = {
            "status": "200",
            "sql_queries": [
                { "UserID": 1, "Username": "root", "Password": "root123", "Email": "root@example.com", "Role": "", "Year": 2012, "Region": "西安", "ActiveStatus": "不活跃", "Points": 823, "MembershipLevel": "金牌会员" },
                { "UserID": 2, "Username": "root", "Password": "root123", "Email": "root@example.com", "Role": "管理员", "Year": 2013, "Region": "成都", "ActiveStatus": "不活跃", "Points": 704, "MembershipLevel": "金牌会员" },
                { "UserID": 3, "Username": "test", "Password": "test123", "Email": "test@test.com", "Role": "普通用户", "Year": 2004, "Region": "西安", "ActiveStatus": "活跃", "Points": 17, "MembershipLevel": "普通会员" },
                { "UserID": 4, "Username": "user4", "Password": "pass456", "Email": "", "Role": "普通用户", "Year": 2002, "Region": "成都", "ActiveStatus": "不活跃", "Points": 578, "MembershipLevel": "金牌会员" },
                { "UserID": 5, "Username": "admin5", "Password": "admin567", "Email": "admin5@example.com", "Role": "管理员", "Year": 2003, "Region": "重庆", "ActiveStatus": "不活跃", "Points": 138, "MembershipLevel": "钻石会员" },
                { "UserID": 6, "Username": "guest6", "Password": "guest678", "Email": "", "Role": "管理员", "Year": 2017, "Region": "北京", "ActiveStatus": "活跃", "Points": 468, "MembershipLevel": "普通会员" },
                { "UserID": 7, "Username": "dev7", "Password": "dev789", "Email": "dev7@example.com", "Role": "管理员", "Year": 2015, "Region": "北京", "ActiveStatus": "不活跃", "Points": 126, "MembershipLevel": "金牌会员" },
                { "UserID": 8, "Username": "support8", "Password": "support890", "Email": "", "Role": "", "Year": 2001, "Region": "重庆", "ActiveStatus": "活跃", "Points": 886, "MembershipLevel": "银牌会员" }
            ]

        };
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
            await nextTick();
            initChart();// 重新初始化图表
        } else if (status === '300') {
            alert('无相关数据');
        } else if (status === '400') {
            alert('请求权限不足');
        } else {
            alert('未知错误');
        }

    };

    // 可用的数据库列表
    const availableDatabases = ref([]);

    // 当前选择的数据库
    const selectedDatabase = ref('');

    onMounted(async () => {


            const response = {
                "status": "200",
                "databases": [
                    "ai",
                    "datacopilot",
                ]
            };
            console.log(response)
            if (response.status === '200') {
                availableDatabases.value = response.databases;

            } else {
                // 如果status不是200，可以在这里处理错误情况
                ElMessage({
                    type: 'error',
                    message: '获取数据库列表时发生错误!',
                });
            }

    });

    // 切换数据库的方法
    const switchDatabase = async () => {
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

        if (!selectedDatabase.value) {
            ElMessage({
                type: 'warning',
                message: '请先选择一个数据库!',
            });
            return;
        }
        try {
            console.log(selectedDatabase.value)
            const response = await axios.post('http://localhost:8080/choosesql/', { database: selectedDatabase.value }, { headers });
            console.log(response.data)
            if (response.data.status === '200') {
                ElMessage({
                    type: 'success',
                    message: '数据库切换成功!',
                });
            } else {
                ElMessage({
                    type: 'error',
                    message: '数据库切换失败!',
                });
            }
        } catch (error) {
            console.error(error);
            ElMessage({
                type: 'error',
                message: '请求处理时发生错误!',
            });
        }
    };



    // 观察tableData的变化，更新图表配置
    watch(tableData, () => {
        generateChartOption();
        initChart();
    }, {
        deep: true // 深度观察
    });

    onMounted(() => {
        // 确保在DOM渲染后初始化图表
        initChart();
    });

    onUnmounted(() => {
        if (chartInstance) {
            chartInstance.dispose();
            chartInstance = null;
        }
    });


</script>