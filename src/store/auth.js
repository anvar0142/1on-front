import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        accessToken: null
    }),
    actions: {
        setAccessToken(token) {
            this.accessToken = token;
            localStorage.setItem('token', token)
        }
    }
});