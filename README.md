# data-co-pliot-vue3

> 需要安装

- npm 
- node
- git


请求体：所有接口的媒体类型为 JSON。请求头：除了登陆页面的没有设置，其他接口的请求头已经设置为 
Authorization: `Bearer ${token}`，其中const token = localStorage.getItem('token');



> 登陆页面
- 已设置后端api/login
- 没有请求头 
- 发送一个POST请求到后端的API端点，携带用户名和密码作为请求体。

- 已传入后端参数status=200，表示登录成功，


- 登陆成功后，后端应该返回一个token，前端已存储在localStorage中


> 可视化页面
## 大模型查询部分
- 已设置后端api/query/
- 请求头 已包含token
- 发送一个POST请求到后端的API端点，将Vue实例中的sql变量的值作为user_input字段发送给服务器。
- 后端参数status=200，表示查询成功，
- 查询成功后，tableData.value = [sql_queries];把后端的sql_queries值传给前端的tableData.value，即查询结果部分会更新表格数据源，表格显示新的查询结果。
- 已解决动态渲染


## 可视化图表部分
- 前端可以显示表格数据的图像可视化

> 用户个人信息页面
- 登录进入之后，点击个人设置，进入用户个人信息
- 已设置后端api
- 已发送一个get请求到后端的API端点，可以显示用户信息
- 已发送一个put请求到后端的API端点，可以修改用户信息
- 登陆成功后，后端应该返回一个token，前端已存储在localStorage中
## 安装

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