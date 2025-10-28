import { defineStore } from "pinia";
import * as userApi from "@/api/userApi";

interface User {
  id: string;
  name: string;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    async login(userid: string, password: string) {
      const res = await userApi.login(userid, password);
      if (res && res.success && res.user) {
        this.user = res.user as any;
      }
      return res;
    },
    async setUser(user: User) {
      this.user = user;
    },
    logout() {
      this.user = null;
      try {
        userApi.logout();
      } catch (e) {}
    },
  },
  getters: {
    getUserName: (state) => state.user?.name,
  },
});
