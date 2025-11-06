import { defineStore } from "pinia";
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    authError: "",
  }),

  actions: {
    async login(credentials) {
      this.authError = "";
      try {
        const response = await axios.post(`${BASE_URL}/api/login`, credentials);

        this.token = response.data.token;
        this.user = response.data.user;
        this.isAuthenticated = true;
        localStorage.setItem('token', response.data.token);

      } catch (error) {
        if (error.response) {
          this.authError = error.response.data.message || "Ошибка входа";
        } else if (error.request) {
          this.authError = "Сервер не отвечает";
        } else {
          this.authError = "Произошла неизвестная ошибка";
        }
        console.error("Login error:", error);
      }
    },

    async getUser() {
      this.authError = "";

      if (!this.token) {
        this.isAuthenticated = false;
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });

        this.user = response.data;
        this.isAuthenticated = true;

      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.logout();
        }

        if (error.response) {
          this.authError = error.response.data.message || "Не удалось получить данные пользователя";
        } else if (error.request) {
          this.authError = "Сервер не отвечает";
        } else {
          this.authError = "Произошла неизвестная ошибка";
        }
        console.error("Get user error:", error);
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
    }
  }
})
