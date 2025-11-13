import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './authStore'

const backendUrl = import.meta.env.VITE_BACKEND_URL

export const useDataStore = defineStore('data', {
  state: () => ({
    houses: [],
    houses_total: null,
    meetings: [],
    meetings_total: null,
    items: [],
    errorMessage: '',
  }),

  actions: {
    async get_houses(page, perpage = 5) {
      const authStore = useAuthStore()
      const token = authStore.token

      if (!token) {
        this.errorMessage = 'Нет токена авторизации'
        return
      }

      this.errorMessage = ''
      try {
        const response = await axios.get(backendUrl + '/houses', {
          params: {
            page: page,
            perpage: perpage,
          },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        this.houses = response.data
      } catch (error) {
        if (error.response) {
          this.errorMessage = error.response.data.message
          console.log(error)
        } else if (error.request) {
          this.errorMessage = error.message
          console.log(error)
        } else {
          console.log(error)
        }
      }
    },

    async get_houses_total() {
      const authStore = useAuthStore()
      const token = authStore.token

      if (!token) {
        this.errorMessage = 'Нет токена авторизации'
        return
      }

      this.errorMessage = ''
      try {
        const response = await axios.get(backendUrl + '/houses_total', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        this.houses_total = response.data
      } catch (error) {
        if (error.response) {
          this.errorMessage = error.response.data.message
          console.log(error)
        } else if (error.request) {
          this.errorMessage = error.message
          console.log(error)
        } else {
          console.log(error)
        }
      }
    },

    async get_meetings(page, perpage = 5) {
      const authStore = useAuthStore()
      const token = authStore.token

      if (!token) {
        this.errorMessage = 'Нет токена авторизации'
        return
      }

      this.errorMessage = ''
      try {
        const response = await axios.get(backendUrl + '/meetings', {
          params: {
            page: page,
            perpage: perpage,
          },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        this.meetings = response.data
      } catch (error) {
        if (error.response) {
          this.errorMessage = error.response.data.message
          console.log(error)
        } else if (error.request) {
          this.errorMessage = error.message
          console.log(error)
        } else {
          console.log(error)
        }
      }
    },

    async get_meetings_total() {
      const authStore = useAuthStore()
      const token = authStore.token

      if (!token) {
        this.errorMessage = 'Нет токена авторизации'
        return
      }

      this.errorMessage = ''
      try {
        const response = await axios.get(backendUrl + '/meetings_total', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        this.meetings_total = response.data
      } catch (error) {
        if (error.response) {
          this.errorMessage = error.response.data.message
          console.log(error)
        } else if (error.request) {
          this.errorMessage = error.message
          console.log(error)
        } else {
          console.log(error)
        }
      }
    },
  },
})
