<template>
  <div id="app-wrapper" class="min-h-screen bg-[#f2f2f7] font-sans selection:bg-blue-100 selection:text-blue-900">

    <nav class="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl transition-all duration-300">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between gap-4">

          <div class="flex items-center gap-8 overflow-x-auto no-scrollbar">
            <router-link to="/" class="flex-shrink-0 transition-transform hover:scale-105 active:scale-95">
              <img src="/favicon.ico" width="38" height="38" alt="Logo" class="rounded-lg shadow-sm" />
            </router-link>

            <div class="flex items-center gap-1">
              <router-link
                v-for="item in menuItems"
                :key="item.route"
                :to="item.route"
                class="flex items-center gap-2 px-4 py-2 rounded-full text-[15px] font-medium transition-all duration-200"
                active-class="bg-black text-white shadow-md transform scale-[1.02]"
                class-exact-inactive="text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <i :class="item.icon"></i>
                <span class="whitespace-nowrap">{{ item.label }}</span>
              </router-link>
            </div>
          </div>

          <div class="flex items-center ml-auto">

            <div v-if="isAuthenticated && user" class="flex items-center gap-4">
              <div class="hidden md:flex flex-col items-end mr-2">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Вы вошли как</span>
                <span class="text-sm font-semibold text-gray-900">{{ user.name }}</span>
              </div>
              <Button
                @click="logout"
                icon="pi pi-sign-out"
                class="!rounded-full !w-10 !h-10 !p-0 !bg-gray-100 !text-gray-600 !border-none hover:!bg-red-50 hover:!text-red-500 transition-colors"
                v-tooltip.bottom="'Выйти'"
              />
            </div>

            <div v-else class="flex items-center gap-2">
              <form @submit.prevent="login" class="flex items-center gap-2">
                <div class="hidden sm:flex items-center gap-2">
                  <InputText
                    v-model="email"
                    type="email"
                    placeholder="E-mail"
                    class="!rounded-full !bg-gray-100 !border-transparent focus:!border-blue-500 focus:!bg-white !px-4 !py-2 !text-sm w-32 transition-all"
                    :class="{ '!border-red-300 !bg-red-50': authError }"
                  />
                  <InputText
                    v-model="password"
                    type="password"
                    placeholder="Пароль"
                    class="!rounded-full !bg-gray-100 !border-transparent focus:!border-blue-500 focus:!bg-white !px-4 !py-2 !text-sm w-32 transition-all"
                    :class="{ '!border-red-300 !bg-red-50': authError }"
                  />
                </div>
                <Button
                  type="submit"
                  icon="pi pi-arrow-right"
                  class="!rounded-full !w-10 !h-10 !p-0 !bg-black !border-black hover:!bg-gray-800 shadow-lg"
                />
              </form>
            </div>

          </div>
        </div>
      </div>

      <div v-if="authError" class="absolute bottom-0 left-0 w-full h-[2px] bg-red-500 animate-pulse"></div>
    </nav>

    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="isAuthenticated" />
        </transition>
      </router-view>
    </main>

  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore.js";
import { mapState, mapActions } from 'pinia';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

export default {
  components: { Button, InputText },
  data() {
    return {
      email: "",
      password: "",
      // menuItems убрали из data, перенесли в computed
    };
  },
  computed: {
    ...mapState(useAuthStore, ['isAuthenticated', 'user', 'authError', 'isAdmin']),

    // МЕНЮ ТЕПЕРЬ ЗАВИСИТ ОТ РОЛИ
    menuItems() {
      // 1. Для Админа
      if (this.isAuthenticated && this.isAdmin) {
        return [
          { label: 'Добавить дом', icon: 'pi pi-plus-circle', route: '/createHouse' },
          { label: 'Создать собрание', icon: 'pi pi-calendar-plus', route: '/createMeeting' },
          { label: 'Результаты', icon: 'pi pi-chart-bar', route: '/admin/results' },
        ];
      }

      // 2. Для Жильца
      if (this.isAuthenticated) {
        return [
          { label: 'Недвижимость', icon: 'pi pi-home', route: '/' },
          { label: 'Голосования', icon: 'pi pi-check-circle', route: '/meetings' },
        ];
      }

      // 3. Для Гостя
      return [];
    }
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

<style>
/* Плавное исчезновение страниц при переходе */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Скрываем скроллбар в меню на мобилках */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
