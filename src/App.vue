<template>
  <v-app>
    <NavigationDrawer v-model="drawer" @navigate="goAndClose" />

    <HeaderBar
      :auth="auth"
      :user="user"
      @toggle-drawer="toggleDrawer"
      @logout="logoutUser"
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
import { useUserStore } from "@/stores/userStore";
import NavigationDrawer from "@/components/NavigationDrawer.vue";
import HeaderBar from "@/components/HeaderBar.vue";

const router = useRouter();
const userStore = useUserStore();

// Data
// ==============================================================
/** ナビゲーションバーの開閉プロパティ */
const drawer = ref(false);
// dialog flow replaced by dedicated Login page
// Computed
// ==============================================================
const auth = computed(() => !!userStore.user);
const user = computed(() => userStore.user as { username?: string; name?: string } | null);


// Method
// ==============================================================
const go = (path: string) => router.push(path);
const goAndClose = (path: string) => {
  go(path);
  drawer.value = false;
};
const logoutUser = () => {
  userStore.logout();

  // ログアウト時はホームに遷移
  router.push("/").catch(() => {});
};

const onLoginSuccess = () => {
};

/** ナビゲーションバーの開閉処理 */
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

// no dialog open handler: login is a dedicated page
</script>
