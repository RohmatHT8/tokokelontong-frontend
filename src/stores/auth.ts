import { defineStore } from 'pinia'
import axios from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
  }),
  actions: {
    async login(payload: { email: string, password: string }) {
      try {
        const res = await axios.post('/auth/signin', payload)
        this.token = res.data.access_token
        localStorage.setItem('token', this.token)
        return true
      } catch (err) {
        return false
      }
    },
    async register(payload: { email: string, password: string }) {
      try {
        await axios.post('/auth/register', payload)
        return true
      } catch (err) {
        return false
      }
    },
    logout() {
      this.token = ''
      localStorage.removeItem('token')
    }
  }
})
