<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { FilterMatchMode } from 'primevue/api';
import axios from "axios";
import {findIndexById} from "@/helper";

const toast = useToast();

const editing = ref(false)
const employees = ref(null);
const employeeDialog = ref(false);
const deleteEmployeeDialog = ref(false);
const deleteEmployeesDialog = ref(false);
const employee = ref({});
const errorForm = ref(false)
const emailExist = ref(false)
const selectedEmployees = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

onBeforeMount(() => {
  initFilters();
});
onMounted(() => {
  getEmployeeList()
});

const getEmployeeList = () => {
  axios.get(`http://localhost/public/api/organization/1/employee`)
      .then(res => employees.value = res.data)
}

const openNew = () => {
  employee.value = {};
  submitted.value = false;
  employeeDialog.value = true;
};

const hideDialog = () => {
  employeeDialog.value = false;
  emailExist.value = false;
  errorForm.value = false;
  editing.value = false;
};

const saveEmployee = () => {

  if (!employee.value.full_name || !employee.value.email || !employee.value.username || !employee.value.password) {
    errorForm.value = true
    return;
  }
  errorForm.value = false

  submitted.value = true;
  if (employee.value.id) {
    axios.put(`http://localhost/public/api/organization/1/employee/${employee.value.id}`, employee.value).then(() => {
      getEmployeeList()
    }).then(() => {
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Сотрудник успешно добавлен', life: 3000 });
      employeeDialog.value = false;
      employee.value = {};
    })
  } else {
    axios.post(`http://localhost/public/api/organization/1/employee`, employee.value).then(() => {
      getEmployeeList()
    }).then(() => {
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Сотрудник успешно добавлен', life: 3000 });
      employeeDialog.value = false;
      employee.value = {};
    }).catch(e => {
      console.log(e)
      if (e.response.status === 422) {
        emailExist.value = true
      }
    })
  }
};

const editEmployee = (editEmployee) => {
  employee.value = { ...editEmployee };
  editing.value = false
  employeeDialog.value = true;
};

const confirmDeleteEmployee = (editEmployee) => {
  employee.value = editEmployee;
  deleteEmployeeDialog.value = true;
};

const deleteEmployee = async () => {
  deleteEmployeeDialog.value = false;

  await axios.delete(`http://localhost/public/api/organization/1/employee/${employee.value.id}`)
    .then(() => {
      toast.add({ severity: 'success', detail: 'Сотрудник успешно удален', life: 3000 });
      employees.value = employees.value.filter((val) => val.id !== employee.value.id);
    })
    .catch(() => {
      toast.add({ severity: 'error', summary: 'Ошибка!', detail: 'Что-то пошло не так', life: 3000 });
    })

  employee.value = {};
};
const confirmDeleteSelected = () => {
  deleteEmployeesDialog.value = true;
};
const deleteSelectedEmployees = () => {
  employee.value = employee.value.filter((val) => !selectedEmployees.value.includes(val));
  deleteEmployeesDialog.value = false;
  selectedEmployees.value = null;
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Employees Deleted', life: 3000 });
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
            <Button label="Добавить сотрудника" icon="pi pi-plus" class="mr-2" @click="openNew" />
            <Button label="Удалить" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedEmployees || !selectedEmployees.length" />
          </div>
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="employees"
        v-model:selection="selectedEmployees"
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
            <h5 class="m-0">Все сотрудники</h5>
            <span class="block mt-2 md:mt-0 p-input-icon-left">
              <i class="pi pi-search" />
              <InputText class="w-full sm:w-auto" v-model="filters.value" placeholder="Поиск" />
            </span>
          </div>
        </template>

        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column field="name" header="Имя" :sortable="true" headerStyle="width:14%; min-width:10rem;">
          <template #body="slotProps">
            <span class="p-column-title">Name</span>
            {{ slotProps.data.full_name }}
          </template>
        </Column>
        <Column field="name" header="Имя" :sortable="true" headerStyle="width:14%; min-width:10rem;">
          <template #body="slotProps">
            <span class="p-column-title">Name</span>
            {{ slotProps.data.phone }}
          </template>
        </Column>
        <Column headerStyle="min-width:10rem;">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editEmployee(slotProps.data)" />
            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteEmployee(slotProps.data)" />
          </template>
        </Column>
      </DataTable>

      <Dialog v-model:visible="employeeDialog" :style="{ width: '550px' }" :header="editing ? 'Редактирование сотрудника' : 'Добавление сотрудника'" :modal="true" class="p-fluid">
<!--        <img :src="'/demo/images/employee/' + employee.image" :alt="employee.image" v-if="employee.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />-->
        <div class="grid">
          <div class="field col-6 pb-0">
            <label for="name">Имя</label>
            <span class="p-input-icon-left">
              <i class="pi pi-user" />
              <InputText
                :class="errorForm && !employee.full_name ? 'p-invalid' : ''"
                input-id="name"
                placeholder="Имя"
                v-model.trim="employee.full_name"
                required="true"
              />
            </span>
          </div>
          <div class="field col-6 pb-0">
            <label for="phone">Номер телефона</label>
            <span class="p-input-icon-left">
              <i class="pi pi-phone" />
              <InputMask
                input-id="phone"
                mask="99-999-99-99"
                placeholder="99-999-99-99"
                v-model.trim="employee.phone"
                required="true"
                :class="errorForm && !employee.phone ? 'p-invalid' : ''"
              />
            </span>
          </div>
          <div class="field col-6 pb-0">
            <label for="email">Почта</label>
            <span class="p-input-icon-left">
              <i class="pi pi-at" />
              <InputText
                placeholder="example@gmail.com"
                input-id="name"
                v-model.trim="employee.email"
                required="true"
                :class="errorForm && !employee.email ? 'p-invalid' : ''"
              />
              <small v-if="emailExist" class="p-error" id="username-help">Такая почта уже существует</small>
            </span>
          </div>
          <div class="field col-6 pb-0">
            <label for="username">Имя пользователя</label>
            <span class="p-input-icon-left">
              <i class="pi pi-user" />
              <InputText
                input-id="username"
                placeholder="Имя пользователя"
                v-model.trim="employee.username"
                required="true"
                :class="errorForm && !employee.username ? 'p-invalid' : ''"
              />
            </span>
          </div>
          <div class="field col-6 pb-0">
            <label for="password">Пароль</label>
            <span class="p-input-icon-left">
              <i class="pi pi-user" />
              <Password
                prompt-label="Напишите пароль"
                placeholder="Пароль"
                input-id="password"
                v-model.trim="employee.password"
                :class="errorForm && !employee.password ? 'p-invalid' : ''"
                toggleMask
              />
            </span>
          </div>
          <div class="field col-6">
            <label for="description">Фото</label>
            <FileUpload mode="basic" name="demo[]" accept="image/*" :maxFileSize="1000000" />
          </div>
        </div>
        <template #footer>
          <Button label="Отменить" icon="pi pi-times" outlined severity="secondary"  @click="hideDialog" />
          <Button :label="editing ? 'Сохранить' : 'Добавить'" icon="pi pi-check" @click="saveEmployee" />
        </template>
      </Dialog>

      <Dialog v-model:visible="deleteEmployeeDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="employee"
          >Are you sure you want to delete <b>{{ employee.name }}</b
          >?</span
          >
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="deleteEmployeeDialog = false" />
          <Button label="Yes" icon="pi pi-check" text @click="deleteEmployee" />
        </template>
      </Dialog>

      <Dialog v-model:visible="deleteEmployeesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="employee">Are you sure you want to delete the selected products?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="deleteEmployeesDialog = false" />
          <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedEmployees" />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>