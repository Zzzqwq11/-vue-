<template>
    <div class="help-container">
      <h1>帮助中心</h1>
      <el-card class="help-card">
        <el-descriptions title="常见问题解答" :column="1">
          <el-descriptions-item label="如何登录？">
            访问登录页面，输入您的用户名和密码，然后点击“登录”按钮。如果您没有账户，请先注册。
          </el-descriptions-item>
          <el-descriptions-item label="如何进行 SQL 查询和数据可视化？">
            登录后，导航到“SQL 查询”页面，选择要查询的数据库，输入查询内容，然后点击“发送查询”按钮。
            查询结果将显示在“查询结果”区域，您可以在表格中查看详细信息。
            选择图表类型和要展示的列属性名，系统将自动生成相应的可视化图表。
          </el-descriptions-item>
          <el-descriptions-item label="如何查看我的查询历史？">
            登录后，导航到“查询历史”页面，您可以看到所有的查询记录。
          </el-descriptions-item>
          <el-descriptions-item label="如何删除查询记录？">
            在“查询历史”页面，每条记录的右侧有一个“删除”和“重新执行”按钮，点击“删除”按钮即可删除该条记录，
              点击“重新执行”按钮可以跳转到查询页面选择数据库后重新执行查询。
          </el-descriptions-item>
          <el-descriptions-item label="如何更新个人信息？">
            登录后，导航到“个人信息”页面，点击“更新个人信息”按钮，然后输入新的邮箱或密码，最后点击“保存更改”按钮。
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Help'
  }
  </script>
  
  <style scoped>
  .help-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }
  
  .help-container h1 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
  }
  
  .help-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .help-card .el-descriptions {
    padding: 20px;
  }
  
  .help-card .el-descriptions-item {
    margin-bottom: 10px;
    font-size: 16px;
  }
  </style>
  