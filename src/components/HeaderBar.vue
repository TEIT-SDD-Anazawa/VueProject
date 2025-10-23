<template>
  <v-app-bar app>
    <!-- サイドバーの開閉ボタン -->
    <v-btn @click="$emit('toggle-drawer')" icon>
      <v-icon icon="mdi-menu" />
    </v-btn>

    <!-- タイトル -->
    <v-app-bar-title>サンプルアプリ</v-app-bar-title>
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
    v-model="showDialogLocal"
    @login-success="$emit('login-success')"
    @open-signup="showSignupLocal = true"
  />
  <!-- サインアップダイアログ -->
  <SignupDialog v-model="showSignupLocal" @signup-success="showSignupLocal = false" />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import LoginDialog from "@/components/LoginDialog.vue";
import SignupDialog from "@/components/SignupDialog.vue";

interface Props {
  auth: boolean;
  user?: { username?: string; name?: string };
  showDialog: boolean;
}

type Emits = {
  (e: "update:showDialog", v: boolean): void;
  (e: "toggle-drawer"): void;
  (e: "logout"): void;
  (e: "open-login"): void;
  (e: "login-success"): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

/** ログインダイアログの表示状態 */
const showDialogLocal = ref(props.showDialog);

/** サインアップダイアログの表示状態 */
const showSignupLocal = ref(false);

/** ログインダイアログの表示状態を更新する */
watch(
  () => props.showDialog,
  (v) => (showDialogLocal.value = v)
);

/** props.showDialog の変更を親へ通知する */
watch(showSignupLocal, (v) => {
});

/** ログインダイアログの表示状態を親コンポーネントに通知する */
watch(showDialogLocal, (v) => emit("update:showDialog", v));
</script>
