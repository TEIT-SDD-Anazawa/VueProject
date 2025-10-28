import { defineStore } from "pinia";

export const useConfigStore = defineStore("config", {
  state: () => ({
    api: {
      baseURL: import.meta.env.VITE_API_BASE_URL,
    },
  }),
  actions: {
    async loadConfig() {},
  },
});
