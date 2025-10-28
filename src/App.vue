<template>
  <v-app>
    <NavigationDrawer v-model="drawer" @navigate="goAndClose" />

    <HeaderBar
      :auth="auth"
      :user="user"
      :showLoginDialog="showLoginDialog"
      @toggle-drawer="toggleDrawer"
      @logout="logoutUser"
      @open-login="openLoginDialog"
      @update:showLoginDialog="updateShowLoginDialog"
      @login-success="onLoginSuccess"
    />

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import {
  isAuthenticated,
  showLoginDialog as sharedShowLoginDialog,
  getUser,
} from "@/api/dummyApi";
import { useUserStore } from "@/stores/userStore";
import NavigationDrawer from "@/components/NavigationDrawer.vue";
import HeaderBar from "@/components/HeaderBar.vue";

const router = useRouter();
const userStore = useUserStore();

// Data
// ==============================================================
/** ナビゲーションバーの開閉プロパティ */
const drawer = ref(false);
/** ログインダイアログの表示非表示 */
const showLoginDialog = ref(false);
const apiUserRef = getUser();

// Computed
// ==============================================================
const auth = computed(() => isAuthenticated());
const user = computed(() => apiUserRef.value as
  | { username?: string; name?: string }
  | null);

// Watch
// ==============================================================
watch(sharedShowLoginDialog, (v) => (showLoginDialog.value = v));
watch(showLoginDialog, (v) => (sharedShowLoginDialog.value = v));

// Method
// ==============================================================
const go = (path: string) => router.push(path);
const goAndClose = (path: string) => {
  go(path);
  drawer.value = false;
};
const updateShowLoginDialog = (v: boolean) => (showLoginDialog.value = v);
const logoutUser = () => {
  userStore.logout();

  // ログアウト時はホームに遷移
  router.push("/").catch(() => {});
};

const onLoginSuccess = () => {
  // UI updates automatically via reactive getUser
};

/** ナビゲーションバーの開閉処理 */
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

/** ログインダイアログを表示する */
const openLoginDialog = () => {
  showLoginDialog.value = true;
};
</script>
