<template>
  <div id="app-wrapper" class="min-h-screen bg-gray-100">

    <Menubar :model="items">

      <template #start>
        <span>
          <img src="/favicon.ico" width="40" alt="Icon" class="mr-4"/>
        </span>
      </template>

      <template #item="{ item }">
        <router-link v-if="item.route" :to="item.route" class="flex items-center p-2">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </router-link>
      </template>

      <template #end>
        <div class="flex items-center gap-2">

          <div v-if="isAuthenticated && user" class="flex items-center space-x-2">
            <span class="pi pi-fw pi-user mr-2"/>
            <span>Привет, {{ user.name }}</span>
            <Button @click="logout" label="Выйти" icon="pi pi-sign-out" class="ml-4" text />
          </div>

          <div v-else>
            <form @submit.prevent="login" class="flex items-center space-x-2">

              <InputText
                v-model="email"
                type="email"
                id="email"
                required
                placeholder="Логин"
                class="sm:w-auto"
                :class="{ 'p-invalid': authError }"
              />

              <InputText
                v-model="password"
                type="password"
                id="password"
                required
                placeholder="Пароль"
                class="sm:w-auto"
                :class="{ 'p-invalid': authError }"
              />

              <Button type="submit" label="Войти" icon="pi pi-sign-in" />

            </form>

            <div class="ml-2" v-if="authError">
              <small class="error text-red-500">{{ authError }}</small>
            </div>

          </div>
        </div>
      </template>
    </Menubar>

    <main class="container mx-auto p-4">
      <router-view />
    </main>

  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore.js";
import { mapState, mapActions } from 'pinia';

import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

export default {
  components: {
    Menubar,
    Button,
    InputText
  },

  data() {
    return {
      email: "",
      password: "",

      items: [
        {
          label: 'Главная страница',
          icon: 'pi pi-fw pi-home',
          route: '/'
        },
        {
          label: 'Дома',
          icon: 'pi pi-fw pi-building',
          route: '/houses'
        },
        {
          label: 'Собрания',
          icon: 'pi pi-fw pi-users',
          route: '/meetings'
        },
      ]
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

      if (authStore.isAuthenticated) {
        this.email = "";
        this.password = "";
      }
    },
  },
  mounted() {
    const token = localStorage.getItem("token");
    const authStore = useAuthStore();

    if (token && !authStore.isAuthenticated) {
      authStore.token = token;
      authStore.isAuthenticated = true;
      authStore.getUser();
    }
  },
};
</script>

<style scoped>
.router-link-exact-active {
  font-weight: bold;
  color: #2563eb;
}

.error {
  color: red;
}

:deep(.p-invalid) {
  border-color: #ef4444 !important;
}
</style>
