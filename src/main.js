import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './output.css'

import 'primeicons/primeicons.css';

import PrimeVue from 'primevue/config';

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

app.mount('#app')
