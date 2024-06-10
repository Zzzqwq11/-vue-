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
                    <el-input v-model="sql" placeholder="输入查询内容" ></el-input>
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
    import { ref, provide, watch, onMounted, onUnmounted, computed, nextTick } from "vue";
    import { ElMessage } from 'element-plus'
    const router = useRouter();
    const navigateTo = (path) => {
        router.push(path);
    };

    const sql = ref('');

    const tableData = ref([]); // 假设tableData存储查询结果
    const tableHeaders = ref([]);
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

    const generateChartOption = () => {
        if (selectedColumnsForChart.value.length > 0) {
            if (chartType.value === 'bar') {
                // 条形图配置生成逻辑
                if (selectedColumnsForChart.value.length === 1) {
                    // 获取所选列的键
                    const columnKey = selectedColumnsForChart.value[0];

                    // 创建一个对象来存储每个分类的计数
                    const seriesCounts = {};

                    // 遍历表格数据，为每个分类计数
                    tableData.value.forEach(row => {
                        let value = row[columnKey];
                        if (value === null || value === undefined || value === '') {
                            value = '无数据'; // 将空值、null、undefined统一为'空值'
                        }
                        // 如果该值尚未在seriesCounts中，则初始化为0
                        seriesCounts[value] = (seriesCounts[value] || 0) + 1;
                    });

                    // 过滤出计数不为0的分类
                    const xAxisData = Object.keys(seriesCounts).filter(value => seriesCounts[value] > 0);

                    // 对应的Y轴数据
                    const seriesData = xAxisData.map(xAxisValue => seriesCounts[xAxisValue]);
                    // 设置图表选项
                    chartOption.value = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        legend: {
                            data: ['Count'] // 只有一个系列，名为'Count'
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category', // X轴是分类数据
                            data: xAxisData, // X轴数据
                            name: columnKey + '分类', // 设置X轴名称
                            nameLocation: 'middle', // X轴名称位置
                            nameGap: 25 // X轴名称与轴线的距离
                        },
                        yAxis: {
                            type: 'value', // Y轴是数值
                            name: '数量', // 设置Y轴名称
                            nameLocation: 'middle', // Y轴名称位置
                            nameGap: 25 // Y轴名称与轴线的距离
                        },
                        series: [
                            {
                                name: 'Count',
                                type: 'bar',
                                data: seriesData, // Y轴数据
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
                } else if (selectedColumnsForChart.value.length === 2) {
                    const xAxisKey = selectedColumnsForChart.value[0]; // X轴分类的键
                    const yAxisKey = selectedColumnsForChart.value[1]; // Y轴数据的键

                    // 创建一个对象来存储每个分类的计数
                    const seriesCounts = {};

                    // 遍历表格数据，为每个分类计数
                    tableData.value.forEach(row => {
                        const xAxisValue = row[xAxisKey];
                        const yAxisValue = row[yAxisKey];

                        // 初始化分类
                        if (!seriesCounts[xAxisValue]) {
                            seriesCounts[xAxisValue] = {};
                        }

                        // 计算每个Y轴值在对应X轴分类下的计数
                        if (yAxisValue !== null && yAxisValue !== undefined && yAxisValue !== '') {
                            if (!seriesCounts[xAxisValue][yAxisValue]) {
                                seriesCounts[xAxisValue][yAxisValue] = 0;
                            }
                            seriesCounts[xAxisValue][yAxisValue]++;
                        } else {
                            // 如果Y轴值为空、null或undefined，则将其计数设置为0
                            if (!seriesCounts[xAxisValue]['无数据']) {
                                seriesCounts[xAxisValue]['无数据'] = 0;
                            }
                            seriesCounts[xAxisValue]['无数据']++;
                        }
                    });

                    // 提取X轴数据（分类）
                    const xAxisData = Object.keys(seriesCounts).sort(); // 排序（可选）

                    // 准备系列数据
                    const yAxisValues = Object.values(seriesCounts).reduce((acc, curr) => {
                        return acc.concat(Object.keys(curr));
                    }, []).filter((value, index, self) => self.indexOf(value) === index); // 获取所有唯一的Y轴值

                    const series = yAxisValues.map(yAxisValue => {
                        return {
                            name: yAxisValue,
                            type: 'bar', // 簇状条形图
                            data: xAxisData.map(xAxisValue => {
                                return {
                                    name: xAxisValue,
                                    value: seriesCounts[xAxisValue][yAxisValue] || 0
                                };
                            })
                        };
                    });

                    // 设置图表选项
                    chartOption.value = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        legend: {
                            data: yAxisValues // 使用Y轴值作为图例数据
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            data: xAxisData,
                            name: xAxisKey + '分类', // 设置X轴名称
                            nameLocation: 'middle', // X轴名称位置
                            nameGap: 25 // X轴名称与轴线的距离
                        },
                        yAxis: {
                            type: 'value',
                            name: yAxisKey + '数量', // 设置Y轴名称
                            nameLocation: 'middle', // Y轴名称位置
                            nameGap: 25 // Y轴名称与轴线的距离
                        },
                        series: series
                    };

                } else if (selectedColumnsForChart.value.length === 3) {
                    // 三列条形图配置
                    const xAxisKey = selectedColumnsForChart.value[0]; // X轴分类的键
                    const yAxisKey = selectedColumnsForChart.value[1]; // Y轴分类的键
                    const heightKey = selectedColumnsForChart.value[2]; // 高度（计数）的键
                    // 创建一个对象来存储每个分类的计数
                    const seriesCounts = {};

                    // 遍历表格数据，为每个分类计数
                    tableData.value.forEach(row => {
                        const xAxisValue = row[xAxisKey];
                        const yAxisValue = row[yAxisKey];
                        const heightValue = row[heightKey];

                        // 如果Y轴值或高度值是空、null或undefined，则跳过
                        if (!yAxisValue || !heightValue) {
                            return;
                        }

                        // 初始化分类
                        if (!seriesCounts[xAxisValue]) {
                            seriesCounts[xAxisValue] = {};
                        }

                        // 初始化Y轴分类
                        if (!seriesCounts[xAxisValue][yAxisValue]) {
                            seriesCounts[xAxisValue][yAxisValue] = 0;
                        }

                        // 累加计数
                        seriesCounts[xAxisValue][yAxisValue] += heightValue;
                    });

                    // 提取X轴数据（分类）
                    const xAxisData = Object.keys(seriesCounts).sort(); // 排序（可选）

                    // 提取Y轴数据（分类）
                    const yAxisData = xAxisData.reduce((acc, xAxisValue) => {
                        return acc.concat(Object.keys(seriesCounts[xAxisValue]));
                    }, []).filter((value, index, self) => self.indexOf(value) === index); // 获取所有唯一的Y轴值

                    // 准备系列数据
                    const series = yAxisData.map(yAxisValue => {
                        return {
                            name: yAxisValue,
                            type: 'bar', // 簇状条形图
                            data: xAxisData.map(xAxisValue => {
                                return {
                                    name: xAxisValue,
                                    value: seriesCounts[xAxisValue][yAxisValue] || 0
                                };
                            })
                        };
                    });

                    // 设置图表选项
                    chartOption.value = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        legend: {
                            data: yAxisData // 使用Y轴值作为图例数据
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            data: xAxisData,
                            name: xAxisKey + '分类', // 设置X轴名称
                            nameLocation: 'middle', // X轴名称位置
                            nameGap: 25 // X轴名称与轴线的距离
                        },
                        yAxis: {
                            type: 'value',
                            name: heightKey + '总计', // 设置X轴名称
                            nameLocation: 'middle', // X轴名称位置
                            nameGap: 25 // X轴名称与轴线的距离
                        },
                        series: series
                    };

                }
            } else if (chartType.value === 'pie') {
                // 饼图配置生成逻辑
                if (selectedColumnsForChart.value.length === 1) {
                    // 获取所选列的键和标签
                    const columnKey = selectedColumnsForChart.value[0];
                    const columnLabel = tableHeaders.value.find(h => h.key === columnKey)?.label || '';

                    // 创建一个对象来统计每个不同值的出现次数，并加入“无数据”的分类
                    const valueCounts = {
                        '无数据': 0 // 初始化“无数据”的计数为0
                    };
                    let totalCount = 0;

                    // 遍历数据，统计每个值的出现次数
                    tableData.value.forEach(row => {
                        const value = row[columnKey];
                        if (value !== null && value !== undefined && value !== '') {
                            // 如果值不是空值，则增加其计数
                            valueCounts[value] = (valueCounts[value] || 0) + 1;
                        } else {
                            // 如果值是空值，则增加“无数据”的计数
                            valueCounts['无数据']++;
                        }
                        totalCount++; // 总计数包括所有行，无论值是否为空
                    });

                    // 生成饼图的配置数据，只包括比例不为0的分类
                    const seriesData = Object.entries(valueCounts).filter(([_, count]) => count > 0).map(([value, count]) => {
                        return {
                            name: value, // 使用数据值或“无数据”作为扇形的名称
                            value: (count / totalCount) * 100 // 计算每个值所占的比例
                        };
                    });

                    chartOption.value = {
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b}: {c} ({d}%)' // 格式化提示信息，显示百分比
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left'
                        },
                        series: [
                            {
                                name: columnLabel, // 使用列的标签作为系列名称
                                type: 'pie',
                                radius: '50%',
                                data: seriesData,
                                emphasis: {
                                    itemStyle: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };
                } else if (selectedColumnsForChart.value.length === 2) {
                    // 获取所选列的键和标签
                    const mainColumnKey = selectedColumnsForChart.value[0];
                    const countColumnKey = selectedColumnsForChart.value[1];
                    const mainColumnLabel = tableHeaders.value.find(h => h.key === mainColumnKey)?.label || '';
                    const countColumnLabel = tableHeaders.value.find(h => h.key === countColumnKey)?.label || '';

                    // 创建一个对象来统计每个不同值的出现次数
                    const categoryCounts = {};

                    // 遍历数据，统计每个分类的计数
                    tableData.value.forEach(row => {
                        const category = row[mainColumnKey];
                        const count = row[countColumnKey];

                        // 如果分类是空值，则使用“无数据”作为分类
                        if (category === null || category === undefined || category === '') {
                            // 只有当有空值时才初始化“无数据”分类
                            if (!categoryCounts['无数据']) {
                                categoryCounts['无数据'] = 0;
                            }
                            categoryCounts['无数据'] += count;
                        } else {
                            // 如果分类不是空值，则增加其计数
                            categoryCounts[category] = (categoryCounts[category] || 0) + count;
                        }
                    });

                    // 生成饼图的配置数据
                    const seriesData = Object.keys(categoryCounts).map(category => {
                        return {
                            name: category,
                            value: categoryCounts[category]
                        };
                    });

                    chartOption.value = {
                        tooltip: {
                            trigger: 'item',
                            formatter: function (params) {
                                // 如果是“无数据”分类，则不显示第二列的标签
                                if (params.name === '无数据') {
                                    return params.seriesName + '<br/>' + params.name + ': ' + params.value;
                                }
                                // 否则，显示第二列的标签和计数
                                return params.seriesName + '<br/>' + params.name + ': ' + params.value + ' (' + countColumnLabel + ')';
                            }
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left'
                        },
                        series: [
                            {
                                name: mainColumnLabel,
                                type: 'pie',
                                radius: '50%',
                                data: seriesData,
                                emphasis: {
                                    itemStyle: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };
                } else if (selectedColumnsForChart.value.length === 3) {
                    // 三列饼图配置
                    // 获取所选列的键和标签
                    const mainColumnKey = selectedColumnsForChart.value[0];
                    const subColumnKey = selectedColumnsForChart.value[1];
                    const valueColumnKey = selectedColumnsForChart.value[2];
                    const mainColumnLabel = tableHeaders.value.find(h => h.key === mainColumnKey)?.label || '';
                    const subColumnLabel = tableHeaders.value.find(h => h.key === subColumnKey)?.label || '';
                    const valueColumnLabel = tableHeaders.value.find(h => h.key === valueColumnKey)?.label || '';

                    // 创建一个对象来存储每个主要分类及其子分类的计数
                    const mainCategories = {};
                    // 分别创建两个对象来存储主要分类和子分类的计数
                    const mainCategoriesSummary = {};
                    const subCategoriesSummary = {};
                    // 遍历数据，统计每个主要分类和子分类的计数

                    tableData.value.forEach(row => {
                        const mainCategory = row[mainColumnKey];
                        const subCategory = row[subColumnKey] || '无数据'; // 将空值或未定义统一视为'无数据'
                        const value = row[valueColumnKey];

                        // 累加到主分类总计
                        if (!mainCategoriesSummary[mainCategory]) {
                            mainCategoriesSummary[mainCategory] = 0;
                        }
                        mainCategoriesSummary[mainCategory] += value;

                        // 累加到子分类总计
                        if (!subCategoriesSummary[subCategory]) {
                            subCategoriesSummary[subCategory] = {
                                total: 0,
                                belongsToMain: mainCategory // 记录子分类属于哪个主分类
                            };
                        }
                        subCategoriesSummary[subCategory].total += value;
                    });

                    // 生成两个环形图的数据
                    const mainSeriesData = Object.entries(mainCategoriesSummary).map(([name, total]) => ({
                        name: name === '无数据' ? '无数据（主）' : `${name}（主）`, // 特殊处理“无数据”的主分类
                        value: total,
                        itemStyle: { color: getColor() }, // 可以自定义颜色函数
                    }));

                    // 对于子分类数据，我们需要特别处理“无数据”项
                    const subSeriesData = Object.entries(subCategoriesSummary)
                        .map(([subCategory, { total, belongsToMain }]) => {
                            // 特殊处理“无数据”的子分类，显示其归属的主分类
                            const displayName = subCategory === '无数据' ? `${belongsToMain}（无数据）` : subCategory;
                            return {
                                name: displayName,
                                value: total,
                                itemStyle: { color: getColor() },
                            };
                        })
                        .filter(data => data.value > 0); // 过滤掉总和为0的子分类

                    // 更新chartOption以在tooltip中显示第三列的名称和值
                    chartOption.value = {
                        tooltip: {
                            trigger: 'item',
                            formatter: (params) => {
                                const { name, data } = params;
                                // 根据name判断是主分类还是子分类，并获取对应的列名
                                const isMainCategory = name.includes('（主）');
                                const columnToShow = isMainCategory ? mainColumnLabel : subColumnLabel;
                                return `${columnToShow}:${name}<br/>${valueColumnLabel}:${data.value} (${data.percent}%)`;
                            }
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            data: [...new Set([...Object.keys(mainCategoriesSummary), ...Object.keys(subCategoriesSummary)])]
                        },
                        series: [
                            {
                                name: `${mainColumnLabel}（小环）`,
                                type: 'pie',
                                radius: ['40%', '50%'], // 调整内外半径以形成小环
                                data: mainSeriesData,
                                emphasis: { scale: false }, // 取消高亮放大效果，避免遮挡内部环
                            },
                            {
                                name: `${subColumnLabel}（大环）`,
                                type: 'pie',
                                radius: ['60%', '80%'], // 调整内外半径以形成大环
                                data: subSeriesData,
                                emphasis: { scale: false }, // 同上
                            },
                        ],
                    };
                    // 辅助函数示例，用于生成随机颜色
                    function getColor() {
                        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
                    }
                }
            }
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
        //在 login.vue 中通过 localStorage.setItem('token', response.data.token); 将后端返回的令牌存储在本地存储中，
        //然后在 see.vue 或任何其他需要使用令牌的组件中通过 const token = localStorage.getItem('token'); 来获取这个令牌。
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Token not found, 请先登录.');
            return;  //没有token，提前终止请求
        }
        // 输入验证逻辑
        if (!sql.value.trim()) {
            ElMessage.error('输入内容不能为空'); // 显示错误消息
            return; // 验证失败，直接返回，不执行后续查询逻辑
        }
        const headers = {
            'Content-Type': 'application/json',  // 指定请求体的媒体类型为 JSON，以便服务器知道如何解析请求内容
            Authorization: `${token}`            // 添加认证信息，用于验证请求者的身份
        };
        try {
            console.log(sql.value)
            console.log(selectedDatabase)
            const response = await axios.post('http://localhost:8080/query/', { user_input: sql.value,database:selectedDatabase }, { headers });
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
                await nextTick();
                initChart();// 重新初始化图表
            } else if (status === '300') {
                alert('无相关数据');
            } else if (status === '400') {
                alert('请求权限不足');
            } else {
                alert('未知错误');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('查询失败');
        }
    };

    // 可用的数据库列表
    const availableDatabases = ref([]);

    // 当前选择的数据库
    const selectedDatabase = ref('');

    onMounted(async () => {
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
            const response = await axios.get('http://localhost:8080/choosesql/', { headers });
            console.log(response.data)
            if (response.data.status === '200') {
                availableDatabases.value = response.data.databases;
            } else {
                // 如果status不是200，可以在这里处理错误情况
                ElMessage({
                    type: 'error',
                    message: '获取数据库列表时发生错误!',
                });
            }
        } catch (error) {
            // 在这里处理请求失败的情况，例如网络问题
            console.error(error);
            ElMessage({
                type: 'error',
                message: '网络请求失败，请检查网络连接!',
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