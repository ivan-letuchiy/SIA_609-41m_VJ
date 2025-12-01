import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore'; // Импорт стора

import Home from './components/Home.vue';
import Meetings from './components/Meetings.vue';
import Vote from './components/Vote.vue';
import VotingResults from './components/VotingResults.vue';
import CreateHouse from './components/CreateHouse.vue';

// Импортируем новые компоненты (их создадим ниже)
import CreateMeeting from './components/CreateMeeting.vue';
import AdminResults from './components/AdminResults.vue';

const routes = [
  // Общие маршруты
  { path: '/', name: 'Home', component: Home },
  { path: '/meetings', name: 'Meetings', component: Meetings },
  { path: '/vote/:id', name: 'Vote', component: Vote },
  { path: '/voting-results/:id', name: 'VotingResults', component: VotingResults },

  // АДМИНСКИЕ МАРШРУТЫ (Защищены)
  {
    path: '/createHouse',
    name: 'CreateHouse',
    component: CreateHouse,
    meta: { requiresAdmin: true }
  },
  {
    path: '/createMeeting',
    name: 'CreateMeeting',
    component: CreateMeeting,
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/results',
    name: 'AdminResults',
    component: AdminResults,
    meta: { requiresAdmin: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ЗАЩИТА МАРШРУТОВ
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Если данных пользователя нет, но есть токен - загрузим их
  if (authStore.token && !authStore.user) {
    await authStore.getUser();
  }

  // Если маршрут требует админки, а юзер не админ -> на главную
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/');
  } else {
    next();
  }
});

export default router;
