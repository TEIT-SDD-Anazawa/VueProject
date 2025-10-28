<template>
  <v-app-bar app class="pl-2 pr-2 header-color">
    <!-- サイドバーの開閉ボタン -->
    <v-btn @click="toggleDrawer" icon>
      <v-icon icon="mdi-menu" />
    </v-btn>

    <!-- タイトル -->
    <v-app-bar-title>勉強アプリ</v-app-bar-title>
    <v-spacer />

    <!-- ログイン/ログアウトボタン -->
    <template v-if="auth">
      <span class="me-4">{{ user?.name }}</span>
      <v-btn prepend-icon="mdi-logout" text variant="outlined" @click="logout">
        ログアウト
      </v-btn>
    </template>

    <template v-else>
      <v-btn
        color="orange"
        prepend-icon="mdi-login"
        variant="flat"
        @click="openLoginDialog"
      >
        ログイン
      </v-btn>
    </template>
  </v-app-bar>

  <!-- ログインダイアログ -->
  <LoginDialog
    v-model="showLoginDialogLocal"
    @login-success="loginSuccess"
    @open-signup="openSignupFromLogin"
  />
  <!-- サインアップダイアログ -->
  <SignupDialog
    v-model="showSignupDialogLocal"
    @signup-success="signupSuccess"
    @open-login="openLoginFromSignup"
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import LoginDialog from "@/components/LoginDialog.vue";
import SignupDialog from "@/components/SignupDialog.vue";

interface Props {
  auth: boolean;
  user?: { username?: string; name?: string } | null;
  showLoginDialog: boolean;
}

type Emits = {
  (e: "update:showLoginDialog", v: boolean): void;
  (e: "toggle-drawer"): void;
  (e: "logout"): void;
  (e: "open-login"): void;
  (e: "login-success"): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Data
// ==============================================================
/** ログインダイアログの表示状態 */
const showLoginDialogLocal = ref(props.showLoginDialog);
/** サインアップダイアログの表示状態 */
const showSignupDialogLocal = ref(false);

// Watch
// ==============================================================
/** ログインダイアログの表示状態を更新する */
watch(
  () => props.showLoginDialog,
  (v) => (showLoginDialogLocal.value = v)
);

/** ログインダイアログの表示状態を親コンポーネントに通知する */
watch(showLoginDialogLocal, (v) => emit("update:showLoginDialog", v));

// Method
// ==============================================================
/**
 * サインアップダイアログの開閉処理
 * ログインダイアログを閉じて、サインアップダイアログを開く
 */
const openSignupFromLogin = () => {
  showLoginDialogLocal.value = false;
  showSignupDialogLocal.value = true;
};

/**
 * ログインダイアログの開閉処理
 * サインアップダイアログを閉じて、ログインダイアログを開く
 */
const openLoginFromSignup = () => {
  showSignupDialogLocal.value = false;
  showLoginDialogLocal.value = true;
};

/** サイドバーの開閉処理 */
const toggleDrawer = () => {
  emit("toggle-drawer");
};

/** ログインダイアログの開閉処理 */
const openLoginDialog = () => {
  emit("open-login");
};

/** ログイン成功時の処理 */
const loginSuccess = () => {
  emit("login-success");
};

/** サインアップ成功時の処理 */
const signupSuccess = () => {
  showSignupDialogLocal.value = false;
};

/** ログアウト処理 */
const logout = () => {
  const ok = window.confirm("ログアウトしますか？");
  if (ok) {
    emit("logout");
  }
};
</script>

<style scoped>
.header-color {
  background-color: #1976d2 !important;
  color: white !important;
}
</style>
