<template>
  <v-app>
    <NavigationDrawer v-model="drawer" @navigate="goAndClose" />

    <HeaderBar
      :auth="auth"
      :user="user"
      :showLoginDialog="showLoginDialog"
      @toggle-drawer="drawer = !drawer"
      @logout="logoutUser"
      @open-login="showLoginDialog = true"
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
  logout,
  getUser,
  showLoginDialog as sharedShowLoginDialog,
} from "@/api/dummyApi";
import NavigationDrawer from "@/components/NavigationDrawer.vue";
import HeaderBar from "@/components/HeaderBar.vue";

const drawer = ref(false);
const router = useRouter();
const go = (path: string) => router.push(path);
const goAndClose = (path: string) => {
  go(path);
  drawer.value = false;
};
const auth = computed(() => isAuthenticated());
const user = getUser();
const showLoginDialog = ref(false);
const updateShowLoginDialog = (v: boolean) => (showLoginDialog.value = v);
// sync with shared auth flag
watch(sharedShowLoginDialog, (v) => (showLoginDialog.value = v));
watch(showLoginDialog, (v) => (sharedShowLoginDialog.value = v));

const logoutUser = () => {
  logout();
  // after logout, navigate to home
  router.push("/").catch(() => {});
};

const onLoginSuccess = () => {
  // UI updates automatically via reactive getUser
};
</script>
