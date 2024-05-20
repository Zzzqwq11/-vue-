import { createApp } from "vue";
import App from "./App.vue";


// 导入路由
import router from './router/router.ts'
// 导入全局样式

import 'uno.css'
// 如果需要全面使用ElementPlus UI库，可以取消下面两行的注释
// 导入ElementPlus库
// import ElementPlus from "element-plus";
// 导入ElementPlus的全局样式
// import "element-plus/dist/index.css";

// 如果你只想使用ElementPlus的某个组件的样式，比如消息提示组件，可以单独导入它的样式
import ElementPlus from 'element-plus'
import "element-plus/dist/index.css";

// 创建一个新的Vue应用实例
const app = createApp(App);
app.use(ElementPlus, { size: 'default', zIndex: 3000 })

// 如果全面使用ElementPlus，可以通过app.use()方法将其注册为Vue应用的插件
// app.use(ElementPlus);

// 将路由挂载到Vue应用上
app.use(router)

// 将Vue应用挂载到ID为'app'的DOM元素上
app.mount("#app");
