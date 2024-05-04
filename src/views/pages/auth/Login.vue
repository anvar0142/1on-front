<script setup>
import {computed, reactive, ref} from 'vue';
import {useRouter} from 'vue-router';
import {useLayout} from '@/layout/composables/layout';
import AppConfig from '@/layout/AppConfig.vue';
import {useAuthStore} from "@/store/auth";
import axios from "axios";
import {googleSdkLoaded} from "vue3-google-login";

const authStore = useAuthStore();
const router = useRouter();
const rememberMe = ref(false);
const {layoutConfig} = useLayout();

const darkMode = computed(() => {
  return layoutConfig.colorScheme.value !== 'light';
});

const state = reactive({
  username: '',
  password: '',
  errorMessage: ''
});

const login = () => {
  try {
    axios.post('http://localhost/public/api/auth/login', {
      username: state.username,
      password: state.password
    }).then(r => {
      const accessToken = r.data.access_token;
      authStore.setAccessToken(accessToken);
      router.push({name: 'main-page'});
    });
  } catch (error) {
    console.error('Ошибка при аутентификации:', error);
    state.errorMessage = 'Неверный username или пароль.';
    state.username = '';
    state.password = '';
  }
};

const signInWithGoogle = () => {
  googleSdkLoaded(google => {
    google.accounts.oauth2
      .initCodeClient({
        client_id: authStore.CLIENT_ID,
        scope: 'email profile openid',
        redirect_uri: authStore.REDIRECT_URI,
        callback: response => {
          console.log(response)
          if (response.code)
            authStore.fetchUserData(response.code)
        },
      })
      .requestCode()
  })
}
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 800" class="fixed left-0 top-0 min-h-screen min-w-screen" preserveAspectRatio="none">
    <rect :fill="darkMode ? 'var(--primary-900)' : 'var(--primary-500)'" width="1600" height="800"/>
    <path :fill="darkMode ? 'var(--primary-800)' : 'var(--primary-400)'" d="M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z" />
    <path :fill="darkMode ? 'var(--primary-700)' : 'var(--primary-300)'" d="M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z" />
    <path :fill="darkMode ? 'var(--primary-600)' : 'var(--primary-200)'" d="M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z" />
    <path :fill="darkMode ? 'var(--primary-500)' : 'var(--primary-100)'" d="M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z" />
  </svg>
  <div class="px-5 min-h-screen flex justify-content-center align-items-center">
    <div class="border-1 surface-border surface-card border-round py-7 px-4 md:px-7 z-1">
      <div class="mb-4">
        <div class="text-900 text-xl font-bold mb-2">Вход</div>
        <span class="text-600 font-medium">Пожалуйста, введите свои данные</span>
      </div>
      <div class="flex flex-column">
        <span class="p-input-icon-left w-full mb-4">
          <i class="pi pi-envelope"></i>
          <InputText id="username" v-model="state.username" type="text" class="w-full md:w-25rem" placeholder="Логин"/>
        </span>
        <span class="p-input-icon-left w-full mb-4">
          <i class="pi pi-lock"></i>
          <InputText id="password" type="password" v-model="state.password" class="w-full md:w-25rem" placeholder="Пароль"/>
        </span>
        <div class="mb-4 flex flex-wrap gap-3">
          <div>
            <Checkbox name="checkbox" v-model="rememberMe" binary class="mr-2"></Checkbox>
            <label for="checkbox" class="text-900 font-medium mr-8"> Запомнить меня </label>
          </div>
          <a class="text-600 cursor-pointer hover:text-primary cursor-pointer ml-auto transition-colors transition-duration-300">
            Забыли пароль?
          </a>
        </div>
        <Button label="Вход" class="w-full mb-4 flex flex-wrap gap-3" @click="login"></Button>
        <div>
          <button class="mb-2 flex flex-wrap p-button p-component w-full gap-3 p-button-info font-medium border-1 hover:surface-0 active:surface-200 text-blue-50 hover:text-blue-500" type="button" data-pc-name="button" data-pc-section="root" data-pd-ripple="true">
            <i class="pi pi-facebook mr-2"></i>
            <span>Sign in With Facebook</span>
            <span role="presentation" aria-hidden="true" data-p-ink="true" data-p-ink-active="false" class="p-ink" data-pc-name="ripple" data-pc-section="root" style="height: 278px; width: 278px; top: -103px; left: -51px;"></span>
          </button>
          <button
            class="mb-2 flex flex-wrap p-button p-component w-full gap-3 p-button-danger font-medium border-1 hover:surface-0 active:surface-200 text-red-50 hover:text-red-500"
            type="button"
            data-pc-name="button"
            data-pc-section="root"
            data-pd-ripple="true"
            @click="signInWithGoogle"
          >
            <i class="pi pi-google mr-2"></i>
            <span>Sign in With Google</span>
            <span
              role="presentation"
              aria-hidden="true"
              data-p-ink="true"
              data-p-ink-active="false"
              class="p-ink"
              data-pc-name="ripple"
              data-pc-section="root"
              style="height: 278px; width: 278px; top: -103px; left: -51px;"
            ></span>
          </button>
          <button class="mb-2 flex flex-wrap p-button p-component w-full gap-3 surface-900 font-medium border-1 hover:surface-200 active:surface-200  hover:text-black-alpha-90" type="button" data-pc-name="button" data-pc-section="root" data-pd-ripple="true">
            <i class="pi pi-apple mr-2"></i>
            <span>Sign in With AppleID</span>
            <span role="presentation" aria-hidden="true" data-p-ink="true" data-p-ink-active="false" class="p-ink" data-pc-name="ripple" data-pc-section="root" style="height: 278px; width: 278px; top: -103px; left: -51px;"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <AppConfig simple/>
</template>
