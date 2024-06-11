<template>
  <div class="history-container">
    <h1>查询历史</h1>
    <el-table :data="historyData" style="width: 90%; margin: 0 auto;">
      <el-table-column prop="index" label="序号" type="index" width="60" align="center"></el-table-column>
      <el-table-column prop="userid" label="用户ID" width="100" align="center"></el-table-column>
      <el-table-column prop="queryid" label="查询ID" width="150" align="center"></el-table-column>
      <el-table-column prop="querycontent" label="查询内容" align="center"></el-table-column>
      <el-table-column prop="formatted_querytime" label="执行时间" width="180" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <el-button @click="deleteRow(scope.row.userid, scope.row.queryid, scope.$index)" type="danger" size="mini">删除</el-button>
          <el-button @click="reexecuteQuery(scope.row.querycontent)" type="primary" size="mini">重新执行</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  name: 'History',
  data() {
    return {
      historyData: []
    }
  },
  mounted() {
    this.fetchHistoryData();
  },
  methods: {
    async fetchHistoryData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Token not found, 请先登录.');
          return;  //没有token，提前终止请求
        }
        const response = await axios.get('http://localhost:8080/history/',
        //  {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: `${token}`
        //   }
        // } 
      );
        if (response.data.status === '200') {
          this.historyData = response.data.query_history;
          console(this.historyData)
          this.historyData.sort((a, b) => new Date(b.formatted_querytime) - new Date(a.formatted_querytime));
        }
      } catch (error) {
        console.error('获取查询历史记录失败', error);
      }
    },

    async deleteRow(userid, queryid, index) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete('http://localhost:8080/history/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`
          },
          data: { userid, queryid }
        });
        if (response.status === '200') {
          this.historyData.splice(index, 1);
        }
      } catch (error) {
        console.error('删除查询记录失败', error);
      }
    },
    reexecuteQuery(querycontent) {
      this.$router.push({ path: '/see', query: { querycontent, showAlert: true } });
    }
  }
}
</script>

<style scoped>
.history-container {
  text-align: center;
}

h1 {
  margin-bottom: 20px;
}

.el-table {
  margin-top: 20px;
}

.el-table th, .el-table td {
  padding: 12px 8px;
  text-align: center;
}

.el-table th {
  font-weight: bold;
}

.el-table-column--center .cell {
  text-align: center;
}
</style>
