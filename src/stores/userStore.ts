import { defineStore } from "pinia";
import * as userApi from "@/api/userApi";

interface User {
  id: string;
  name: string;
}

const USER_STORAGE_KEY = 'vue_app_user'

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    // 初期化時にlocalStorageから認証状態を復元
    initializeAuth() {
      try {
        const stored = localStorage.getItem(USER_STORAGE_KEY)
        if (stored) {
          this.user = JSON.parse(stored)
        }
      } catch (e) {
        // パースエラーの場合はクリア
        localStorage.removeItem(USER_STORAGE_KEY)
      }
    },
    async login(userid: string, password: string) {
      const res = await userApi.login(userid, password);
      if (res && res.success && res.user) {
        this.user = res.user as any;
        // localStorageに保存
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(this.user))
      }
      return res;
    },
    async setUser(user: User) {
      this.user = user;
      // localStorageに保存
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    },
    logout() {
      this.user = null;
      // localStorageから削除
      localStorage.removeItem(USER_STORAGE_KEY)
      try {
        userApi.logout();
      } catch (e) {}
    },
  },
  getters: {
    getUserName: (state) => state.user?.name,
  },
});
