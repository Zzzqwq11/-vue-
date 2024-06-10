# data-co-pliot-vue3

> 需要安装

- npm 
- node
- git


请求体：所有接口的媒体类型为 JSON。请求头：除了登陆页面的没有设置，其他接口的请求头已经设置为 
Authorization: `Bearer ${token}`，其中const token = localStorage.getItem('token');



## 登陆页面
- 已设置后端api/login/
- 没有请求头 
- 发送一个POST请求到后端的API端点，携带用户名和密码作为请求体。

- 已传入后端参数status=200，表示登录成功，


- 登陆成功后，后端应该返回一个token，前端已存储在localStorage中

## 注册页面
- 输入用户名，密码，邮箱进行注册



## 可视化页面
> 大模型查询部分
- 已设置后端api/query/
- 请求头 已包含token
- 发送一个POST请求到后端的API端点，将Vue实例中的sql变量的值作为user_input字段发送给服务器。
- 后端参数status=200，表示查询成功，
- 查询成功后，tableData.value = [sql_queries];把后端的sql_queries值传给前端的tableData.value，即查询结果部分会更新表格数据源，表格显示新的查询结果。
- 已解决动态渲染
- 新增了数据库切换功能，根据后端返回的数据库列表来让用户选择要切换的数据库

> 数据库切换部分
- 前端已实现，获取数据库，供用户选择



> 可视化图表部分
- 
- 前端可以供用户选择可视化配置，图像类型和列名
- 前端可以根据配置（最多显示三列），根据选择的1-3列，生成条形图或者饼图

## 用户个人信息页面
- 登录进入之后，点击个人设置，进入用户个人信息
- 已设置后端api
- 已发送一个get请求到后端的API端点，可以显示用户信息
- 已发送一个put请求到后端的API端点，可以修改用户信息
- 登陆成功后，后端应该返回一个token，前端已存储在localStorage中

## 历史记录页面
- 登录进入之后，点击查询历史，进入查询历史
- 已设置后端api
- 以发送一个get请求到后端API端点, 可以显示用户的查询记录
- 后端应返回的数据格式应该是一个 JSON 数组（列表），
- 每个元素都是一个对象，包含 userID、queryID、queryContent 和 executionTime 四个字段
- 例如下面这样
[
    { "userID": 1, "queryID": "Q123", "queryContent": "查询1", "executionTime": "2024-06-01 12:00:00" },
    { "userID": 2, "queryID": "Q124", "queryContent": "查询2", "executionTime": "2024-06-02 13:00:00" },
    { "userID": 3, "queryID": "Q125", "queryContent": "查询3", "executionTime": "2024-06-03 14:00:00" },
    { "userID": 4, "queryID": "Q126", "queryContent": "查询4", "executionTime": "2024-06-04 15:00:00" }
]
- 然后点击删除按钮后, 以发送一个delete请求到后端API端点, 
- 给后端一个请求体 data: { userID, queryID } ,即标识要删除的数据
   
# 安装

```bash
npm install
npm install -D sass
```

### 运行

```bash
npm run dev
```

## 使用

```bash
git 
cd 
npm install
npm run dev
```