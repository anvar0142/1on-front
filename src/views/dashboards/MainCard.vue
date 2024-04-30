<script setup>
defineProps({
  card: {
    type: Object,
  }
})

const book = () => {

}
</script>

<template>
  <div class="card">
    <h3 class="text-600 text-xl font-semibold">{{card.name}}</h3>
    <div class="grid">
      <p class="col-6 p-0 mb-0">Очередь <i class="pi pi-fw pi-users ml-2"></i></p>
      <p class="col-6 p-0 mb-0">Свободен(на) от</p>
      <p class="col-6 p-0 mb-0 text-4xl text-600 font-semibold">{{card.queue}}</p>
      <p class="col-6 p-0 mb-0 text-4xl text-600 font-semibold">{{card.free}}</p>
    </div>
    <div class="flex justify-content-end">
      <Button label="Забронировать" @click="book" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  flex: 0 0 auto;
  margin-bottom: 0;
  width: 25%;

  @media (max-width: 1340px) {
    width: 33.3333%;
  }
  @media (max-width: 768px) {
    width: 50%;
  }

  .grid {
    padding: 1rem
  }
}
</style>