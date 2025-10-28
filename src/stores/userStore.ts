import { defineStore } from "pinia";
// ↓↓↓↓↓↓ TODO ↓↓↓↓↓↓
import { logout as apiLogout } from "@/api/dummyApi";
// ↑↑↑↑↑↑ TODO ↑↑↑↑↑↑

interface User {
  id: string;
  name: string;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    async setUser(user: User) {
      this.user = user;
    },
    logout() {
      this.user = null;
      // ↓↓↓↓↓↓ TODO ↓↓↓↓↓↓
      try {
        apiLogout();
      } catch (e) {}
      // ↑↑↑↑↑↑ TODO ↑↑↑↑↑↑
    },
  },
  getters: {
    getUserName: (state) => state.user?.name,
  },
});
