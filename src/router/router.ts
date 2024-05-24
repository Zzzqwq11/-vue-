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
        //,meta: { requiresAuth: true } // Ê¾Àý£º±íÊ¾´ËÒ³ÃæÐèÒªÑéÖ¤µÇÂ¼
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
// // Â·ÓÉÊØÎÀ
// router.beforeEach((to) => {
//    // ¸ù¾ÝtokenÅÐ¶ÏÊÇ·ñµÇÂ¼
//    let token = localStorage.getItem('Token');
//    // ÓÐtokenµ«ÊÇ·ÃÎÊµÄÊÇµÇÂ¼Ò³ => Ç¿ÖÆÈ¥Ê×Ò³
//    if (token && to.path === '/login')
//       return "/home";
//   // Ã»ÓÐtokenµ«ÊÇ·ÃÎÊµÄÊÇÆäËû => Ç¿ÖÆÈ¥µÇÂ¼Ò³
//    else if (!token && to.path !== '/login')
//        return "/login";
// });
=======
// è·¯ç”±å®ˆå«
router.beforeEach((to) => {
    // æ ¹æ®tokenåˆ¤æ–­æ˜¯å¦ç™»å½•
    let token = localStorage.getItem('Token');
    // æœ‰tokenä½†æ˜¯è®¿é—®çš„æ˜¯ç™»å½•é¡µ => å¼ºåˆ¶åŽ»é¦–é¡µ
    if (token && to.path === '/login')
       return "/home";
   // æ²¡æœ‰tokenä½†æ˜¯è®¿é—®çš„æ˜¯å…¶ä»– => å¼ºåˆ¶åŽ»ç™»å½•é¡µ
    else if (!token && to.path !== '/login')
        return "/login";
});
>>>>>>> 490301dea23c28457c89db24d3879edab8f95432


export default router;

