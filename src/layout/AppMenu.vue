<script setup>
import { ref } from 'vue';

import AppSubMenu from './AppSubMenu.vue';

const model = ref([
    {
        items: [
            {
              label: 'Дэшбоард',
              icon: 'pi pi-home',
              to: '/'
            },
            {
              label: 'Сотрудники',
              icon: 'pi pi-fw pi-briefcase',
              to: '/app/employee'
            },
            {
              label: 'Услуги',
              icon: 'pi pi-fw pi-book',
              to: '/app/service'
            },
            {
              label: 'Заказы',
              icon: 'pi pi-fw pi-bookmark',
              to: '/app/order'
            },
            // {
            //   label: 'Архив',
            //   icon: 'pi pi-fw pi-trash',
            //   to: '/app/archive'
            // },
            {
              label: 'Клиенты',
              icon: 'pi pi-fw pi-users',
              to: '/app/client'
            },
        ]
    },
]);
</script>

<template>
    <AppSubMenu :model="model" />
</template>

<style lang="scss" scoped></style>
