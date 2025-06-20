import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/Register.vue'),
  },
  {
    path: '/',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/product'
      },
      {
        path: 'product',
        name: 'ProductList',
        component: () => import('@/pages/Home.vue'),
      },
      {
        path: 'product/:id',
        name: 'ProductDetail',
        component: () => import('@/pages/DetailProduct.vue'),
      },
    ]
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AuthLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/pages/admin/index.vue'),
      },

      {
        path: 'category',
        name: 'Categories',
        component: () => import('@/pages/admin/category/index.vue'),
      },
      {
        path: 'category/create',
        name: 'AddCategory',
        component: () => import('@/pages/admin/category/add.vue'),
      },
      {
        path: 'category/edit/:id',
        name: 'EditCategory',
        component: () => import('@/pages/admin/category/edit.vue'),
      },
      {
        path: 'product/create',
        name: 'ProductCreate',
        component: () => import('@/pages/admin/product/add.vue'),
      },
      {
        path: 'product/edit/:id',
        name: 'ProductEdit',
        component: () => import('@/pages/admin/product/edit.vue'),
      },
      {
        path: 'product',
        name: 'Product',
        component: () => import('@/pages/admin/product/index.vue'),
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue')
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'Login' })
  }

  if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
    return next({ name: 'ProductList' })
  }

  next()
})
