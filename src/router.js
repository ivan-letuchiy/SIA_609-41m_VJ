import {createRouter, createWebHistory} from 'vue-router';
import Home from './components/Home.vue';
import Houses from './components/Houses.vue';
import Meetings from './components/Meetings.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/houses',
    name: 'Houses',
    component: Houses,
  },
  {
    path: '/meetings',
    name: 'Meetings',
    component: Meetings,
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
