<script setup>
import AppBreadcrumb from './AppBreadcrumb.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import {useAuthStore} from "@/store/auth";

const { onMenuToggle, onProfileSidebarToggle, onConfigSidebarToggle } = useLayout();

const { logout } = useAuthStore()

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

const showProfileSidebar = () => {
    onProfileSidebarToggle();
};
const onConfigButtonClick = () => {
    onConfigSidebarToggle();
};
</script>

<template>
    <div class="layout-topbar">
        <div class="topbar-start">
            <Button type="button" class="topbar-menubutton p-link p-trigger" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </Button>

            <AppBreadcrumb class="topbar-breadcrumb"></AppBreadcrumb>
        </div>

        <div class="topbar-end">
            <ul class="topbar-menu">
                <li class="ml-3">
                    <Button label="Log out" icon="pi pi-power-off" text rounded severity="secondary" @click="logout"></Button>
                </li>
<!--                <li class="topbar-profile">-->
<!--                    <Button type="button" class="p-link" @click="showProfileSidebar"><img src="/demo/images/avatar/avatar.png" alt="Profile" /></Button>-->
<!--                </li>-->
            </ul>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
