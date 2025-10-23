<template>
  <v-app>
    <NavigationDrawer v-model="drawer" @navigate="goAndClose" />

    <HeaderBar
      :auth="auth"
      :user="user"
      :showDialog="showDialog"
      @toggle-drawer="drawer = !drawer"
      @logout="logoutUser"
      @open-login="showDialog = true"
      @update:showDialog="updateShowDialog"
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
import { isAuthenticated, logout, getUser, showLoginDialog } from "@/api/dummyApi";
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
const showDialog = ref(false);
const updateShowDialog = (v: boolean) => (showDialog.value = v);
// sync with shared auth flag
watch(showLoginDialog, (v) => (showDialog.value = v));
watch(showDialog, (v) => (showLoginDialog.value = v));

const logoutUser = () => {
  logout();
  // after logout, navigate to home
  router.push('/').catch(() => {});
};

const onLoginSuccess = () => {
  // UI updates automatically via reactive getUser
};
</script>
