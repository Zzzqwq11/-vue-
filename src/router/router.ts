import { createRouter,createWebHistory,createWebHashHistory } from 'vue-router'
import see   from '../components/see.vue'
import login from '../components/login.vue'
import home  from '../components/home.vue'
import contact   from '../components/contact.vue'
import register  from '../components/register.vue'
import usersettings  from '../components/usersettings.vue'
import help   from '../components/help.vue'
import test   from '../components/test.vue'
import history   from '../components/history.vue'
const routes = [
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
    },
        {
        path: '/test',
        component:test
    },
    {
        path: '/history',
        component:history
    }
]

const router = createRouter({
    //history: createWebHistory(),
    history:createWebHashHistory(),
    routes,
})


export default router;

