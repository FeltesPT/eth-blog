import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Details from '../views/Article/Details.vue';
import Create from '../views/Article/Create.vue';
import Layout from '../views/Layout.vue';

const routes = [
  {
      path: '/',
      component: Layout,
      meta: { guest: true, title: 'Epic Code - Blog' },
      children: [
          {
              path: '',
              name: 'Home',
              component: Home,
              meta: { guest: true, title: 'Epic Code - Blog' },
          },
          {
              path: ':id',
              name: 'Details',
              component: Details,
              // meta: { requiresAuth: true },
              meta: { guest: true, title: 'Epic Code - About' },
          },
          {
            path: '/create',
            name: 'Create',
            component: Create,
            // meta: { requiresAuth: true },
            meta: { guest: true, title: 'Epic Code - Create' },
        },
      ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
      return { x: 0, y: 0 };
  },
});

export default router;