<script setup>
import {ref} from "vue";
import MainCard from "@/views/dashboards/MainCard.vue";

const cards = ref([
  {
    name: 'Шохиста',
    queue: 1,
    free: '09:00',
  },
  {
    name: 'Шохиста',
    queue: 1,
    free: '09:00',
  },
])
</script>

<template>
    <div class="grid">
      <MainCard v-for="card in cards" :card="card" :key="card.name"/>
    </div>
</template>

<style lang="scss" scoped>
.grid {
  gap: 24px;
}
</style>