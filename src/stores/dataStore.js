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
    errorCode: 0,
  }),

  actions: {
    async get_houses(page = 0, perpage = 5) {
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
        this.handleError(error)
      }
    },

    async get_houses_total() {
      const authStore = useAuthStore()
      const token = authStore.token

      if (!token) return

      try {
        const response = await axios.get(backendUrl + '/houses_total', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        this.houses_total = response.data
      } catch (error) {
        this.handleError(error)
      }
    },

    async create_house(formData) {
      const authStore = useAuthStore()
      const token = authStore.token

      this.errorMessage = ''
      this.errorCode = 0

      try {
        const response = await axios.post(backendUrl + '/houses', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        })

        this.errorCode = response.data.code;
        this.errorMessage = response.data.message;

        if (this.errorCode === 0) {
          await this.get_houses();
          await this.get_houses_total();
        }

      } catch (error) {
        if (error.response) {
          this.errorCode = 11;
          this.errorMessage = error.response.data.message || 'Ошибка сервера';
          console.log(error);
        } else if (error.request) {
          this.errorCode = 12;
          this.errorMessage = error.message;
          console.log(error);
        } else {
          this.errorCode = 15;
          this.errorMessage = 'Неизвестная ошибка';
          console.log(error);
        }
      }
    },

    async get_user_properties() {
      const authStore = useAuthStore()
      const token = authStore.token

      if (!token) return []

      try {
        const response = await axios.get(backendUrl + '/my-flats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
      } catch (error) {
        console.error(error);
        return [];
      }
    },

    async get_meetings_with_status() {
      const authStore = useAuthStore()
      const token = authStore.token

      if (!token) return []

      try {
        const response = await axios.get(backendUrl + '/my-meetings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
      } catch (error) {
        console.error(error);
        return [];
      }
    },

    async get_meetings(page = 0, perpage = 5) {
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
        this.handleError(error)
      }
    },

    async get_meetings_total() {
      const authStore = useAuthStore()
      const token = authStore.token

      if (!token) return

      try {
        const response = await axios.get(backendUrl + '/meetings_total', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        this.meetings_total = response.data
      } catch (error) {
        this.handleError(error)
      }
    },

    async get_meeting_details(id) {
      const authStore = useAuthStore()
      const token = authStore.token
      try {
        const response = await axios.get(`${backendUrl}/meetings/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    async submit_vote(votesPayload) {
      const authStore = useAuthStore()
      const token = authStore.token
      this.errorMessage = ''
      try {
        await axios.post(`${backendUrl}/vote`, votesPayload, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return true;
      } catch (error) {
        console.error(error);
        this.errorMessage = error.response?.data?.message || 'Ошибка голосования';
        return false;
      }
    },

    async get_meeting_results(id) {
      const authStore = useAuthStore()
      const token = authStore.token
      try {
        const response = await axios.get(`${backendUrl}/meetings/${id}/results`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    async create_meeting(payload) {
      const authStore = useAuthStore()
      const token = authStore.token
      this.errorMessage = ''

      try {
        const response = await axios.post(`${backendUrl}/meetings`, payload, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data.code === 0) {
          return true;
        } else {
          this.errorMessage = response.data.message;
          return false;
        }
      } catch (error) {
        console.error(error);
        this.errorMessage = error.response?.data?.message || 'Ошибка создания собрания';
        return false;
      }
    },

    async get_house_meetings(houseId) {
      const authStore = useAuthStore()
      const token = authStore.token
      try {
        const response = await axios.get(`${backendUrl}/houses/${houseId}/meetings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
      } catch (e) {
        console.error(e);
        return [];
      }
    },

    handleError(error) {
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
  }
})
