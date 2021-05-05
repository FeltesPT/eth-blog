import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Details from '../views/Article/Details.vue';
import Create from '../views/Article/Create.vue';
import Edit from '../views/Article/Edit.vue';
import Profile from '../views/Article/Profile.vue';
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
            meta: { guest: true, title: 'Epic Code - About' },
        },
        {
          path: '/create',
          name: 'Create',
          component: Create,
          meta: { guest: true, title: 'Epic Code - Create' },
        },
        {
          path: ':id/edit',
          name: 'Edit',
          component: Edit,
          meta: { guest: true, title: 'Epic Code - Edit' },
        },
        {
          path: 'profile',
          name: 'Profile',
          component: Profile,
          meta: { guest: true, title: 'Epic Code - Profile' },
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