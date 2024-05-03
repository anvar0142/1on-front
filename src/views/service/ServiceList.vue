<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { FilterMatchMode } from 'primevue/api';
import axios from "axios";
import {findIndexById} from "@/helper";

const toast = useToast();

const services = ref(null);
const serviceDialog = ref(false);
const deleteServiceDialog = ref(false);
const deleteServicesDialog = ref(false);
const service = ref({});
const selectedServices = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

onBeforeMount(() => {
  initFilters();
});
onMounted(() => {
  getServiceList()
});

const getServiceList = () => {
  axios.get(`http://localhost/public/api/organization/1/service`)
      .then(res => services.value = res.data)
}

const openNew = () => {
  service.value = {};
  submitted.value = false;
  serviceDialog.value = true;
};

const hideDialog = () => {
  serviceDialog.value = false;
  submitted.value = false;
};

const saveService = () => {
  submitted.value = true;
  if (service.value.id) {
    axios.put(`http://localhost/public/api/organization/1/service/${service.value.id}`, service.value).then(() => {
      getServiceList()
    })
  } else {
    axios.post(`http://localhost/public/api/organization/1/service`, service.value).then(() => {
      getServiceList()
    })
  }
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
  serviceDialog.value = false;
  service.value = {};
};

const editServiceList = (editServiceList) => {
  service.value = { ...editServiceList };
  serviceDialog.value = true;
};

const confirmDeleteService = (editServiceList) => {
  service.value = editServiceList;
  deleteServiceDialog.value = true;
};

const deleteService = () => {
  service.value = service.value.filter((val) => val.id !== service.value.id);
  deleteServiceDialog.value = false;
  service.value = {};
  toast.add({ severity: 'success', summary: 'Successful', detail: 'service Deleted', life: 3000 });
};

const confirmDeleteSelected = () => {
  deleteServicesDialog.value = true;
};
const deleteSelectedService = () => {
  service.value = service.value.filter((val) => !selectedServices.value.includes(val));
  deleteServicesDialog.value = false;
  selectedServices.value = null;
  toast.add({ severity: 'success', summary: 'Successful', detail: 'services Deleted', life: 3000 });
};
const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  };
};
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-4">
        <template v-slot:end>
          <div class="my-2">
            <Button label="Добавить услугу" icon="pi pi-plus" class="mr-2" @click="openNew" />
            <Button label="Удалить" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedServices || !selectedServices.length" />
          </div>
        </template>
      </Toolbar>

      <DataTable
          ref="dt"
          :value="services"
          v-model:selection="selectedServices"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Показ {first} от {rows}"
      >
        <template #header>
          <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 class="m-0">Все услуги</h5>
            <span class="block mt-2 md:mt-0 p-input-icon-left">
              <i class="pi pi-search" />
              <InputText class="w-full sm:w-auto" v-model="filters.value" placeholder="Поиск" />
            </span>
          </div>
        </template>

        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column field="name" header="Название" :sortable="true" headerStyle="width:14%; min-width:10rem;">
          <template #body="slotProps">
            <span class="p-column-title">Название</span>
            {{ slotProps.data.name }}
          </template>
        </Column>
        <Column field="name" header="Цена" :sortable="true" headerStyle="width:14%; min-width:10rem;">
          <template #body="slotProps">
            <span class="p-column-title">Цена</span>
            {{ slotProps.data.price }}
          </template>
        </Column>
        <Column headerStyle="min-width:10rem;">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editServiceList(slotProps.data)" />
            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteService(slotProps.data)" />
          </template>
        </Column>
      </DataTable>

      <Dialog v-model:visible="serviceDialog" :style="{ width: '450px' }" header="Добавить услугу" :modal="true" class="p-fluid">
        <!--        <img :src="'/demo/images/service/' + service.image" :alt="service.image" v-if="service.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />-->
        <div class="field">
          <label for="name">Название</label>
          <InputText id="name" v-model.trim="service.name" required="true" autofocus/>
        </div>
        <div class="grid">
          <div class="field col-6">
            <label for="description">Цена</label>
            <InputText id="description" v-model.trim="service.price" required="true"/>
          </div>
          <div class="field col-6">
            <label for="time">Время</label>
            <InputText id="time" v-model.trim="service.time" required="true"/>
          </div>
        </div>
        <template #footer>
          <Button label="Отменить" icon="pi pi-times" outlined severity="secondary" @click="hideDialog" />
          <Button label="Добавить услугу" icon="pi pi-check" @click="saveService" />
        </template>
      </Dialog>

      <Dialog v-model:visible="deleteServiceDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="service"
          >Are you sure you want to delete <b>{{ service.name }}</b
          >?</span
          >
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="deleteServiceDialog = false" />
          <Button label="Yes" icon="pi pi-check" text @click="deleteService" />
        </template>
      </Dialog>

      <Dialog v-model:visible="deleteServicesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="service">Are you sure you want to delete the selected products?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="deleteServicesDialog = false" />
          <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedService" />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>