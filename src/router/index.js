import { createRouter, createWebHistory } from 'vue-router';
import Login_1 from '@/views/Login_1.vue';
import Home_1 from '@/views/Home_1.vue';
import { useStore } from 'vuex';

const routes = [
  { path: '/', component: Login_1 },
  { path: '/home_1', component: Home_1, meta: { requireAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const requireAuth = to.meta.requireAuth;
  const isLoggedIn = useStore().state.isLoggedIn;

  if (requireAuth && !isLoggedIn) {
    next('/');
  } else {
    next();
  }
});

export default router;
