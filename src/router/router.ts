import { createRouter,createWebHistory,createWebHashHistory } from 'vue-router'
import File1 from '../components/File1.vue'
import see   from '../components/see.vue'
import login from '../components/login.vue'
import home  from '../components/home.vue'
import service   from '../components/service.vue'
import contact   from '../components/contact.vue'
import register  from '../components/register.vue'
import usersettings  from '../components/usersettings.vue'
import help   from '../components/help.vue'

const routes = [
    {
        path: '/file1',
        component:File1
    },
    {
        path: '/see',
        component:see
    },
    {
        path: '/login',
        component:login
    },
    {
        path: '/',
        component:home
        //,meta: { requiresAuth: true } // ʾ������ʾ��ҳ����Ҫ��֤��¼
    },
    {
        path: '/service',
        component:service
    },
    {
        path: '/contact',
        component:contact
    },
    {
        path: '/register',
        component:register
    },
    {
        path: '/usersettings',
        component:usersettings
    },
    {
        path: '/help',
        component:help
    }
]

const router = createRouter({
    //history: createWebHistory(),
    history:createWebHashHistory(),
    routes,
})

<<<<<<< HEAD
// // ·������
// router.beforeEach((to) => {
//    // ����token�ж��Ƿ��¼
//    let token = localStorage.getItem('Token');
//    // ��token���Ƿ��ʵ��ǵ�¼ҳ => ǿ��ȥ��ҳ
//    if (token && to.path === '/login')
//       return "/home";
//   // û��token���Ƿ��ʵ������� => ǿ��ȥ��¼ҳ
//    else if (!token && to.path !== '/login')
//        return "/login";
// });
=======
// 路由守卫
router.beforeEach((to) => {
    // 根据token判断是否登录
    let token = localStorage.getItem('Token');
    // 有token但是访问的是登录页 => 强制去首页
    if (token && to.path === '/login')
       return "/home";
   // 没有token但是访问的是其他 => 强制去登录页
    else if (!token && to.path !== '/login')
        return "/login";
});
>>>>>>> 490301dea23c28457c89db24d3879edab8f95432


export default router;

