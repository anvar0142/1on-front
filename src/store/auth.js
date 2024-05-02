import { defineStore } from 'pinia';
import axios from "axios";
import {ref} from "vue";

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null)
  const userData = ref({})
  const CLIENT_ID = '816973990634-rbr4b66316n53kltqc0t5cd10t7a9osj.apps.googleusercontent.com'
  const CLIENT_SECRET = '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'
  const REDIRECT_URI = 'http://localhost:5173'

  const setAccessToken = (token) => {
    this.accessToken = token;
    localStorage.setItem('token', token)
  }
  const fetchUserData = async (code) => {
    try {
      localStorage.setItem('gCode', JSON.stringify(code))

      const { data } = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code',
        },
      )

      if (data) {
        const accessToken = data.access_token

        const userObj = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )

        if (userObj && userObj.data) {
          localStorage.setItem('user', JSON.stringify(userObj.data))
          userData.value = userObj.data
          await axios.post('http://localhost/public/api/auth/google', {
            email: userData.value.email,
            name: userData.value.name
          })
        }
        else {
          console.error('Failed to fetch user data')
        }
      }
    }
    catch (e) {
      console.error('Failed to exchaange token', e)
    }
  }

  return {
    userData,
    accessToken,
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
    setAccessToken,
    fetchUserData
  }

});