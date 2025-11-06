<template>
  <div id="app-wrapper" class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-md">
      <nav class="container mx-auto px-4 py-3 flex justify-between items-center">

        <div class="text-xl font-bold text-blue-600">
          Мой Проект
        </div>

        <div class="flex items-center space-x-4">

          <div v-if="isAuthenticated" class="flex space-x-3">
            <router-link to="/" class="px-3 py-2 rounded hover:bg-gray-200">Главная</router-link>
            <router-link to="/houses" class="px-3 py-2 rounded hover:bg-gray-200">Дома</router-link>
            <router-link to="/meetings" class="px-3 py-2 rounded hover:bg-gray-200">Собрания</router-link>
          </div>

          <div v-if="isAuthenticated && user" class="flex items-center space-x-2">
            <span>Привет, {{ user.name }}</span>
            <button @click="logout" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Выйти</button>
          </div>

          <div v-else>
            <form @submit.prevent="login" class="flex items-center space-x-2">
              <div>
                <label for="email" class="sr-only">Email</label>
                <input v-model="email" type="email" id="email" placeholder="Email" required class="px-2 py-1 border rounded"/>
              </div>
              <div>
                <label for="password" class="sr-only">Пароль</label>
                <input v-model="password" type="password" id="password" placeholder="Пароль" required class="px-2 py-1 border rounded"/>
              </div>
              <button type="submit" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Войти</button>
            </form>
            <p v-if="authError" class="error text-red-500 text-sm mt-1">{{ authError }}</p>
          </div>
        </div>

      </nav>
    </header>

    <main class="container mx-auto p-4">
      <router-view />
    </main>

  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore.js";
import { mapState, mapActions } from 'pinia';

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    ...mapState(useAuthStore, ['isAuthenticated', 'user', 'authError'])
  },
  methods: {
    ...mapActions(useAuthStore, ['logout', 'getUser']),

    async login() {
      const authStore = useAuthStore();
      await authStore.login({ email: this.email, password: this.password });

      this.email = "";
      this.password = "";
    },
  },
  mounted() {
    const token = localStorage.getItem("token");
    const authStore = useAuthStore();

    if (token && !authStore.isAuthenticated) {

      authStore.token = token;
      authStore.isAuthenticated = true;
      authStore.getUser(); // и загружаем данные пользователя
    }
  },
};
</script>

<style scoped>

.router-link-exact-active {
  font-weight: bold;
  color: #2563eb;
  background-color: #ebf4ff;
}

.error {
  color: red;
}
</style>
