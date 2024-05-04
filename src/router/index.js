import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'main-page',
                    meta: {
                        breadcrumb: ['Дэшбоард']
                    },
                    component: () => import('@/views/dashboards/Main.vue')
                },
                {
                    path: 'app',
                    children: [
                        {
                            path: 'employee',
                            name: 'app-employee',
                            meta: {
                                breadcrumb: ['Сотрудники']
                            },
                            component: () => import('@/views/employee/EmployeeList.vue')
                        },
                        {
                            path: 'service',
                            name: 'app-service',
                            meta: {
                                breadcrumb: ['Услуги']
                            },
                            component: () => import('@/views/service/ServiceList.vue')
                        },
                        {
                            path: 'order',
                            name: 'app-order',
                            meta: {
                                breadcrumb: ['Заказы']
                            },
                            component: () => import('@/views/order/OrderList.vue')
                        },
                        {
                            path: 'client',
                            name: 'app-client',
                            meta: {
                                breadcrumb: ['Клиенты']
                            },
                            component: () => import('@/views/client/ClientList.vue')
                        },
                        {
                            path: 'employee',
                            name: 'app-employee',
                            meta: {
                                breadcrumb: ['Сотрудники']
                            },
                            component: () => import('@/views/employee/EmployeeList.vue')
                        },
                        {
                            path: 'archive',
                            name: 'app-archive',
                            meta: {
                                breadcrumb: ['Сотрудники']
                            },
                            component: () => import('@/views/archive/ArchiveList.vue')
                        },
                    ]
                }
            ]
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        }
    ],
    scrollBehavior() {
        return { left: 0, top: 0 };
    }
});

router.beforeEach((to, from, next) => {
    if (to.name === 'login') return next()

    const token = localStorage.getItem('token');
    if (!token) {
        next({ name: 'login' })
    } else {
        next()
    }
})

export default router;
