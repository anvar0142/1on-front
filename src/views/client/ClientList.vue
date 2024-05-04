<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { FilterMatchMode } from 'primevue/api';
import axios from "axios";

const toast = useToast();

const clients = ref(null);
const clientDialog = ref(false);
const deleteClientDialog = ref(false);
const deleteClientsDialog = ref(false);
const client = ref({});
const selectedClient = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

onBeforeMount(() => {
  initFilters();
});
onMounted(() => {
  getClientList()
});

const getClientList = () => {
  axios.get(`http://localhost/public/api/organization/`)
      .then(res => clients.value = res.data)
}

const openNew = () => {
  client.value = {};
  submitted.value = false;
  clientDialog.value = true;
};

const hideDialog = () => {
  clientDialog.value = false;
  submitted.value = false;
};

const saveClient = () => {
  submitted.value = true;
  if (client.value.id) {
    axios.put(`http://localhost/public/api/organization/${client.value.id}`, client.value).then(() => {
      getClientList()
    })
  } else {
    axios.post(`http://localhost/public/api/organization/`, client.value).then(() => {
      getClientList()
    })
  }
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
  clientDialog.value = false;
  client.value = {};
};

const editClientList = (editClientList) => {
  client.value = { ...editClientList };
  clientDialog.value = true;
};

const confirmDeleteClient = (editClientList) => {
  client.value = editClientList;
  deleteClientDialog.value = true;
};

const deleteClient = () => {
  client.value = client.value.filter((val) => val.id !== client.value.id);
  deleteClientDialog.value = false;
  client.value = {};
  toast.add({ severity: 'success', summary: 'Successful', detail: 'client Deleted', life: 3000 });
};

const confirmDeleteSelected = () => {
  deleteClientsDialog.value = true;
};
const deleteSelectClient = () => {
  client.value = client.value.filter((val) => !selectedClient.value.includes(val));
  deleteClientsDialog.value = false;
  selectedClient.value = null;
  toast.add({ severity: 'success', summary: 'Successful', detail: 'clients Deleted', life: 3000 });
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
      <DataTable
          ref="dt"
          :value="clients"
          v-model:selection="selectedClient"
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
            <h5 class="m-0">Все клиенты</h5>
            <span class="block mt-2 md:mt-0 p-input-icon-left">
              <i class="pi pi-search" />
              <InputText class="w-full sm:w-auto" v-model="filters.value" placeholder="Поиск" />
            </span>
          </div>
        </template>

        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column field="name" header="Имя" :sortable="true" headerStyle="width:14%; min-width:10rem;">
          <template #body="slotProps">
            <span class="p-column-title">Имя</span>
            {{ slotProps.data.name }}
          </template>
        </Column>
        <Column field="name" header="Цена" :sortable="true" headerStyle="width:14%; min-width:10rem;">
          <template #body="slotProps">
            <span class="p-column-title">Номер телефона</span>
            {{ slotProps.data.phone }}
          </template>
        </Column>
        <Column headerStyle="min-width:10rem;">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editClientList(slotProps.data)" />
            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteClient(slotProps.data)" />
          </template>
        </Column>
      </DataTable>

      <Dialog v-model:visible="clientDialog" :style="{ width: '450px' }" header="Добавить клиент" :modal="true" class="p-fluid">
        <!--        <img :src="'/demo/images/client/' + client.image" :alt="client.image" v-if="client.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />-->
        <div class="field">
          <label for="name">Название</label>
          <InputText id="name" v-model.trim="client.name" required="true" autofocus/>
        </div>
        <div class="grid">
          <div class="field col-6">
            <label for="description">Цена</label>
            <InputText id="description" v-model.trim="client.price" required="true"/>
          </div>
          <div class="field col-6">
            <label for="time">Время</label>
            <InputText id="time" v-model.trim="client.time" required="true"/>
          </div>
        </div>
        <template #footer>
          <Button label="Отменить" icon="pi pi-times" outlined severity="secondary" @click="hideDialog" />
          <Button label="Добавить услугу" icon="pi pi-check" @click="saveClient" />
        </template>
      </Dialog>

      <Dialog v-model:visible="deleteClientDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="client"
          >Are you sure you want to delete <b>{{ client.name }}</b
          >?</span
          >
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="deleteClientDialog = false" />
          <Button label="Yes" icon="pi pi-check" text @click="deleteClient" />
        </template>
      </Dialog>

      <Dialog v-model:visible="deleteClientsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="client">Are you sure you want to delete the selected products?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="deleteClientsDialog = false" />
          <Button label="Yes" icon="pi pi-check" text @click="deleteSelectClient" />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>