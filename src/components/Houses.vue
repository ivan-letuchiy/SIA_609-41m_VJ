<template>
  <div class="p-4 bg-white rounded-lg shadow">
    <h1 class="text-2xl font-bold">Список домов</h1>

    <div v-if="loading" class="mt-4 text-gray-500">Загрузка данных...</div>

    <div v-if="error" class="mt-4 text-red-500">
      <strong>Ошибка:</strong> {{ error }}
    </div>

    <ul v-if="houses.length" class="mt-4 space-y-2">
      <li v-for="house in houses" :key="house.id" class="p-3 border rounded-md">
        {{ house.house_name }}
      </li>
    </ul>

    <p v-if="!loading && !houses.length && !error" class="mt-4 text-gray-700">
      Дома не найдены.
    </p>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore.js'; // Путь к твоему store

export default {
  name: "HousesList",
  data() {
    return {
      houses: [],
      loading: true,
      error: null,
      authStore: useAuthStore(),
    };
  },
  async mounted() {
    await this.fetchHouses();
  },
  methods: {
    async fetchHouses() {
      this.loading = true;
      this.error = null;

      if (!this.authStore.token) {
        this.error = "Вы не авторизованы.";
        this.loading = false;
        return;
      }

      try {

        const response = await axios.get('http://127.0.0.1:8000/api/houses', { // Убедись, что URL верный
          headers: {
            'Authorization': `Bearer ${this.authStore.token}`
          }
        });
        this.houses = response.data;
      } catch (err) {
        console.error("Ошибка при загрузке домов:", err);
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
