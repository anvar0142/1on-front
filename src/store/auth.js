import { defineStore } from 'pinia';
import axios from "axios";
import {ref} from "vue";
import {useRouter} from "vue-router";

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const accessToken = ref(null)
  const userData = ref({})
  const CLIENT_ID = '816973990634-rbr4b66316n53kltqc0t5cd10t7a9osj.apps.googleusercontent.com'
  const REDIRECT_URI = 'http://localhost:5173'

  const setAccessToken = (token) => {
    accessToken.value = token;
    localStorage.setItem('token', token)
  }

  const fetchUserData = async (code) => {
    try {
      console.log(code)
      await axios.post(`http://localhost/public/api/auth/google`, {
        code,
        is_client: false,
      }).then(({data}) => {
        setAccessToken(data.access_token)
        router.push({name: 'main-page'})
      })
    }
    catch (e) {
      console.error('Failed to exchaange token', e)
    }
  }

  const refreshToken = async () => {
    const { data } = await axios.post('http://localhost/public/api/auth/refresh', {is_client: false})
      .catch(e => {
        logout()
      })
    setAccessToken(data.accessToken)
  }

  const logout = () => {
    axios.post('http://localhost/public/api/auth/logout', {is_client: false})
    localStorage.removeItem('token')
    router.push({name: 'login'})
  }

  return {
    userData,
    accessToken,
    CLIENT_ID,
    REDIRECT_URI,
    logout,
    setAccessToken,
    fetchUserData,
    refreshToken
  }
});