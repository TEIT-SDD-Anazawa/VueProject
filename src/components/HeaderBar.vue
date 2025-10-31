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

  <!-- サインアップダイアログ（ログインはページ化したためダイアログは埋め込まない） -->
  <SignupDialog
    v-model="showSignupDialogLocal"
    @signup-success="signupSuccess"
    @open-login="openLoginFromSignup"
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import SignupDialog from "@/components/SignupDialog.vue";
import { useRouter } from 'vue-router'

interface Props {
  auth: boolean;
  user?: { username?: string; name?: string } | null;
}

type Emits = {
  (e: "toggle-drawer"): void;
  (e: "logout"): void;
  (e: "login-success"): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const router = useRouter()

// Data
// ==============================================================
/** サインアップダイアログの表示状態 */
const showSignupDialogLocal = ref(false);

// Method
// ==============================================================
// Method
// ==============================================================
/**
 * サインアップダイアログの開閉処理
 * ログインダイアログを閉じて、サインアップダイアログを開く
 */
const openSignupFromLogin = () => {
  showSignupDialogLocal.value = true;
};

/**
 * ログインダイアログの開閉処理
 * サインアップダイアログを閉じて、ログインダイアログを開く
 */
const openLoginFromSignup = () => {
  showSignupDialogLocal.value = false;
  // open the login page instead of showing a dialog
  router.push({ name: 'Login' }).catch(() => {})
};

/** サイドバーの開閉処理 */
const toggleDrawer = () => {
  emit("toggle-drawer");
};

/** ログインページへ遷移する */
const openLoginDialog = () => {
  router.push({ name: 'Login' }).catch(() => {})
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
