<template>
  <v-app-bar app class="pl-2 pr-2">
    <!-- サイドバーの開閉ボタン -->
    <v-btn @click="$emit('toggle-drawer')" icon>
      <v-icon icon="mdi-menu" />
    </v-btn>

    <!-- タイトル -->
    <v-app-bar-title>勉強アプリ</v-app-bar-title>
    <v-spacer />

    <!-- ログイン/ログアウトボタン -->
    <template v-if="auth">
      <span class="me-4">{{ user?.name }}</span>
      <v-btn
        prepend-icon="mdi-logout"
        text
        variant="outlined"
        @click="$emit('logout')"
      >
        ログアウト
      </v-btn>
    </template>

    <template v-else>
      <v-btn
        color="primary"
        prepend-icon="mdi-login"
        variant="tonal"
        @click="$emit('open-login')"
      >
        ログイン
      </v-btn>
    </template>
  </v-app-bar>

  <!-- ログインダイアログ -->
  <LoginDialog
    v-model="showLoginDialogLocal"
    @login-success="$emit('login-success')"
    @open-signup="openSignupFromLogin"
  />
  <!-- サインアップダイアログ -->
  <SignupDialog
    v-model="showSignupDialogLocal"
    @signup-success="showSignupDialogLocal = false"
    @open-login="openLoginFromSignup"
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import LoginDialog from "@/components/LoginDialog.vue";
import SignupDialog from "@/components/SignupDialog.vue";

interface Props {
  auth: boolean;
  user?: { username?: string; name?: string };
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

/** ログインダイアログの表示状態 */
const showLoginDialogLocal = ref(props.showLoginDialog);

/** サインアップダイアログの表示状態 */
const showSignupDialogLocal = ref(false);

/** ログインダイアログの表示状態を更新する */
watch(
  () => props.showLoginDialog,
  (v) => (showLoginDialogLocal.value = v)
);

/** props.showDialog の変更を親へ通知する */
watch(showSignupDialogLocal, (v) => {});

/** ログインダイアログの表示状態を親コンポーネントに通知する */
watch(showLoginDialogLocal, (v) => emit("update:showLoginDialog", v));

/**
 * emitを受けてダイアログ開閉を行う
 * 1. ログインダイアログを閉じる
 * 2. サインアップダイアログを開く
 */
const openSignupFromLogin = () => {
  showLoginDialogLocal.value = false;
  showSignupDialogLocal.value = true;
};

/**
 * emitを受けてダイアログ開閉を行う
 * 1. サインアップダイアログを閉じる
 * 2. ログインダイアログを開く
 */
const openLoginFromSignup = () => {
  showSignupDialogLocal.value = false;
  showLoginDialogLocal.value = true;
};
</script>
