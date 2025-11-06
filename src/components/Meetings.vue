<template>
  <div class="p-4 bg-white rounded-lg shadow">
    <h1 class="text-2xl font-bold">Список собраний</h1>

    <div v-if="loading" class="mt-4 text-gray-500">Загрузка данных...</div>

    <div v-if="error" class="mt-4 text-red-500">
      <strong>Ошибка:</strong> {{ error }}
    </div>

    <ul v-if="meetings.length" class="mt-4 space-y-2">
      <li v-for="meeting in meetings" :key="meeting.id" class="p-3 border rounded-md">
        Собрание от: {{ new Date(meeting.date).toLocaleDateString() }}
      </li>
    </ul>

    <p v-if="!loading && !meetings.length && !error" class="mt-4 text-gray-700">
      Собрания не найдены.
    </p>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore.js';

export default {
  name: "MeetingsList",
  data() {
    return {
      meetings: [],
      loading: true,
      error: null,
      authStore: useAuthStore(),
    };
  },
  async mounted() {
    await this.fetchMeetings();
  },
  methods: {
    async fetchMeetings() {
      this.loading = true;
      this.error = null;

      if (!this.authStore.token) {
        this.error = "Вы не авторизованы.";
        this.loading = false;
        return;
      }

      try {
        // Загружаем собрания
        const response = await axios.get('http://127.0.0.1:8000/api/meetings', { // Убедись, что URL верный
          headers: {
            'Authorization': `Bearer ${this.authStore.token}`
          }
        });
        this.meetings = response.data;
      } catch (err) {
        console.error("Ошибка при загрузке собраний:", err);
        if (err.response && err.response.status === 401) {
          this.error = "Ошибка авторизации. Пожалуйста, войдите заново.";
          this.authStore.logout();
        } else {
          this.error = "Не удалось загрузить данные. " + (err.message || "");
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
