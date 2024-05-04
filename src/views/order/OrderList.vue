<script setup>
import {ref, onMounted, onBeforeMount, watch, reactive} from 'vue';
import { useToast } from 'primevue/usetoast';
import { FilterMatchMode } from 'primevue/api';
import axios from "axios";
import {findIndexById} from "@/helper";

const toast = useToast()

const orders = ref(null)
const selectedOrder = ref(null)
const orderDialog = ref(false)
const editing = ref(false)

const serviceList = ref([])
const employeeList = ref([])

const timeList = [
  {
    name: '12:00',
    code: '12:00:00',
  },
  {
    name: '12:30',
    code: '12:30:00',
  },
  {
    name: '13:00',
    code: '13:00:00',
  },
  {
    name: '15:00',
    code: '15:00:00',
  },
  {
    name: '16:00',
    code: '16:00:00',
  },
]
const phone = ref('')
const full_name = ref('')
const timeSelect = ref(null)
const calendarSelect = ref(null)
const employeeSelect = ref(null)
const serviceSelect = ref(null)

const deleteOrderDialog = ref(false)
const deleteOrdersDialog = ref(false)
const dt = ref(null)
const filters = ref({})

onBeforeMount(() => {
  initFilters();
});
onMounted(() => {
  getOrderList()
});

const getOrderList = () => {
  axios.get(`http://localhost/public/api/organization/1/order`)
    .then(res => orders.value = res.data)
}

const getDropdowns = async () => {
  await axios.get(`http://localhost/public/api/organization/1/service`)
    .then(res => {
      serviceList.value = res.data.map(item => ({name: item.name, code: item.id}))
    })
  await axios.get('http://localhost/public/api/organization/1/employee')
    .then(res => {
      employeeList.value = res.data.map(item => {
        return {name: item.full_name, code: item.id}
      })
    })
}

const openNew = () => {
  clearModal()
  getDropdowns()
  orderDialog.value = true;
};

const clearModal = () => {
  editing.value = false
  selectedOrder.value = {}
  serviceSelect.value = null
  calendarSelect.value = null
  timeSelect.value = null
  employeeSelect.value = null
  phone.value = ''
  full_name.value = ''
}

const hideDialog = () => {
  orderDialog.value = false;
  clearModal()
};

const saveOrder = () => {

  const data = {
    employee_id: employeeSelect.value.code,
    service_ids: [serviceSelect.value.code],
    start_time: `${formatDate(calendarSelect.value)} ${timeSelect.value.code}`,
    client_info: {
      full_name: full_name.value || '',
      phone: phone.value
    }
  }
  if (selectedOrder.value.id) {
    axios.put(`http://localhost/public/api/organization/1/order/${selectedOrder.value.id}`, {...selectedOrder.value, ...data}).then(() => {
      getOrderList()
    })
  } else {
    axios.post(`http://localhost/public/api/organization/1/order`, {...data, added_by: 1}).then(() => {
      getOrderList()
    })
  }
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
  orderDialog.value = false;
  clearModal()
};

const editOrderList = async (editOrderList) => {
  getDropdowns()
  editing.value = true
  selectedOrder.value = { ...editOrderList };
  const start_time = editOrderList.start_time.split(' ')
  calendarSelect.value = new Date(start_time[0])
  timeSelect.value = timeList.find(item => item.code === start_time[1])
  // serviceSelect.value = serviceList.value.find(item => item.code === editOrderList.service_ids[0]) || {}
  employeeSelect.value = employeeList.value.find(item => item.code === editOrderList.employee_id)
  full_name.value = editOrderList.client.full_name
  phone.value = editOrderList.client.phone
  orderDialog.value = true;
};

const confirmDeleteOrder = (editOrderList) => {
  selectedOrder.value = editOrderList
  deleteOrderDialog.value = true;
};

const confirmDeleteSelected = () => {
  deleteOrdersDialog.value = true;
};
const deleteSelectOrder = () => {
  orders.value = orders.value.filter((val) => !selectedOrder.value.includes(val));
  deleteOrdersDialog.value = false;
  selectedOrder.value = null;
  toast.add({ severity: 'success', summary: 'Successful', detail: 'orders Deleted', life: 3000 });
};

const deleteOrder = async () => {
  deleteOrderDialog.value = false;

  await axios.delete(`http://localhost/public/api/organization/1/order/${selectedOrder.value.id}`)
    .then(() => {
      toast.add({ severity: 'success', detail: 'Заказ успешно удален', life: 3000 });
      orders.value = orders.value.filter((val) => val.id !== selectedOrder.value.id);
    })
    .catch(() => {
      toast.add({ severity: 'error', summary: 'Ошибка!', detail: 'Что-то пошло не так', life: 3000 });
    })

  selectedOrder.value = {};
};

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  };
};

const formatDate = (initDate) => {
  const date = new Date(initDate)
  const year = date.toLocaleString("default", { year: "numeric" });
  const month = date.toLocaleString("default", { month: "2-digit" });
  const day = date.toLocaleString("default", { day: "2-digit" });
  return year + "-" + month + "-" + day;
}

watch(phone, () => {
  if (!phone.value.length) return
  axios.get(`http://localhost/public/api/organization/1/check-phone/${phone.value}`)
    .then(res => {
      full_name.value = res.data.full_name
    })
    .catch(res => null)
})
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-4">
        <template v-slot:end>
          <div class="my-2">
            <Button label="Добавить заказ" icon="pi pi-plus" class="mr-2" @click="openNew" />
            <Button label="Удалить" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedOrder || !selectedOrder.length" />
          </div>
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="orders"
        v-model:selection="selectedOrder"
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
            <h5 class="m-0">Активные заказы</h5>
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
            {{ slotProps.data.client.full_name }}
          </template>
        </Column>
        <Column field="name" header="Номер телефона" :sortable="true" headerStyle="width:16%; min-width:10rem;">
          <template #body="slotProps">
            <span class="p-column-title">Номер телефона</span>
            {{ slotProps.data.client.phone }}
          </template>
        </Column>
        <Column field="name" header="Исполнитель" :sortable="true" headerStyle="width:17%; min-width:10rem;">
          <template #body="slotProps">
            <span class="p-column-title">Исполнитель</span>
            {{ slotProps.data.employee.full_name }}
          </template>
        </Column>
        <Column headerStyle="min-width:10rem;">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editOrderList(slotProps.data)" />
            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteOrder(slotProps.data)" />
          </template>
        </Column>
      </DataTable>

      <Dialog
        v-model:visible="orderDialog"
        :style="{ width: '550px' }"
        :header="editing ? 'Редактирование заказа' : 'Добавить заказ'"
        :modal="true"
        class="p-fluid"
      >
        <div class="grid">
          <div class="field col-6">
            <label for="name">Имя</label>
            <span class="p-input-icon-left">
              <i class="pi pi-user" />
              <InputText type="text" placeholder="Имя" v-model.trim="full_name" />
            </span>
          </div>
          <div class="field col-6">
            <label for="description">Номер телефона</label>
            <span class="p-input-icon-left">
              <i class="pi pi-phone" />
              <InputMask
                id="description"
                mask="99-999-99-99"
                placeholder="99-999-99-99"
                v-model.trim="phone"
                required="true"
                autofocus
              />
            </span>
          </div>
          <hr class="col-12 p-0">
          <div class="field col-6">
            <label for="time">Услуги</label>
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon">
                <i class="pi pi-tags"></i>
              </span>
              <Dropdown v-model="serviceSelect" :options="serviceList" optionLabel="name" empty-message="Ничего не найдено" placeholder="Выбрать услугу" />
            </div>
          </div>
          <div class="field col-6">
            <label for="time">Исполнитель</label>
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon">
                <i class="pi pi-user"></i>
              </span>
              <Dropdown v-model="employeeSelect" :options="employeeList" optionLabel="name" empty-message="Ничего не найдено" placeholder="Выбрать исполнителя" />
            </div>
          </div>
          <hr class="col-12 p-0">
          <div class="field col-6">
            <label for="time">Дата брони</label>
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon">
                <i class="pi pi-calendar"></i>
              </span>
              <Calendar :showButtonBar="true" placeholder="Выбрать дату" v-model="calendarSelect"></Calendar>
            </div>
          </div>
          <div class="field col-6">
            <label for="time">Время</label>
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon">
                <i class="pi pi-calendar-times"></i>
              </span>
              <Dropdown v-model="timeSelect" :options="timeList" optionLabel="name" empty-message="Ничего не найдено" placeholder="Выбрать время" />
            </div>
          </div>
        </div>
        <template #footer>
          <Button label="Отменить" icon="pi pi-times" outlined severity="secondary" @click="hideDialog" />
          <Button :label="editing ? 'Сохранить услугу' : 'Добавить услугу'" icon="pi pi-check" @click="saveOrder" />
        </template>
      </Dialog>

      <Dialog v-model:visible="deleteOrderDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="order"
          >Are you sure you want to delete <b>{{ order.name }}</b
          >?</span
          >
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="deleteOrderDialog = false" />
          <Button label="Yes" icon="pi pi-check" text @click="deleteOrder" />
        </template>
      </Dialog>

      <Dialog v-model:visible="deleteOrdersDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="order">Are you sure you want to delete the selected products?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="deleteOrdersDialog = false" />
          <Button label="Yes" icon="pi pi-check" text @click="deleteSelectOrder" />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>