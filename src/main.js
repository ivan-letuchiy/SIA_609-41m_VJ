import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './style.css'

import 'primeicons/primeicons.css';

import PrimeVue from 'primevue/config';
// 👇 1. Импортируем сервис уведомлений
import ToastService from 'primevue/toastservice';

import Aura from '@primevue/themes/aura';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: ' '
    }
  }
});

// 👇 2. Подключаем сервис к приложению
app.use(ToastService);

app.mount('#app')
