<template>
  <v-navigation-drawer
    app
    class="navigation-drawer d-flex justify-space-between"
    temporary
    v-model="internal"
  >
    <!-- ヘッダー -->
    <v-toolbar flat>
      <div class="drawer-user">
        <template v-if="isAuth">
          <v-avatar size="40" class="mr-3">
            <v-icon icon="mdi-account-circle" />
          </v-avatar>
          <div class="user-info">
            <div class="user-name">{{ userStore.user?.name }}</div>
          </div>
        </template>
        <template v-else>
          <v-btn text @click="onLogin">ログイン</v-btn>
        </template>
      </div>
      <v-spacer />
      <v-btn @click="close" aria-label="閉じる" icon>
        <v-icon aria-hidden="true" icon="mdi-close" />
      </v-btn>
    </v-toolbar>

    <!-- ページ一覧のリスト -->
    <v-list>
      <!-- ホーム -->
      <v-list-item
        append-icon="mdi-chevron-right"
        class="nav-item"
        link
        prepend-icon="mdi-home-outline"
        title="HOME"
        @click="select('/')"
      />

      <!-- アバウト -->
      <v-list-item
        append-icon="mdi-chevron-right"
        class="nav-item"
        link
        prepend-icon="mdi-information-outline"
        title="about"
        @click="select('/about')"
      />

      <!-- クイズ -->
      <v-list-item
        append-icon="mdi-chevron-right"
        class="nav-item"
        link
        prepend-icon="mdi-help-circle-outline"
        title="Quiz"
        @click="selectWithAuth('/quiz')"
      />

      <!-- 設定 -->
      <v-list-item
        append-icon="mdi-chevron-right"
        class="nav-item"
        link
        prepend-icon="mdi-cog-outline"
        title="設定"
        @click="selectWithAuth('/settings')"
      />
    </v-list>

    <!-- フッター（ログアウト） -->
    <template v-if="isAuth" #append>
      <div class="pa-4">
        <v-btn color="error" variant="outlined" @click="onLogout" block>
          <v-icon left icon="mdi-logout" /> ログアウト
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";

interface Props {
  modelValue: boolean;
}
type Emits = {
  (e: "update:modelValue", v: boolean): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const router = useRouter();
const userStore = useUserStore();

// Computed
// ==============================================================
const isAuth = computed(() => !!userStore.user);

/** ナビゲーションバーの表示管理 */
const internal = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:modelValue", v),
});

// Method
// ==============================================================
/**
 * 選択したページに遷移する
 * @param path 遷移先のパス
 */
const select = (path: string) => {
  internal.value = false;
  router.push(path).catch(() => {});
};

/** 未ログインならログインダイアログを表示する */
const selectWithAuth = (path: string) => {
  if (!isAuth.value) {
    // navigate to login page
    internal.value = false;
    router.push({ name: "Login" }).catch(() => {});
    return;
  }
  select(path);
};

/** ナビゲーションバーを閉じる */
const close = () => {
  internal.value = false;
};

const onLogout = () => {
  internal.value = false;
  try {
    userStore.logout();
  } catch (e) {}
  router.push("/").catch(() => {});
};

const onLogin = () => {
  internal.value = false;
  router.push({ name: 'Login' }).catch(() => {});
};
</script>

<style scoped>
.navigation-drawer {
  top: 64px;
}
.nav-item {
  width: 100%;
  box-sizing: border-box;
  padding-left: 8px;
  padding-right: 8px;
  margin: 12px 6px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 6px;
}
.nav-item-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drawer-user {
  display: flex;
  align-items: center;
  padding-left: 12px;
}
.user-info {
  display: flex;
  flex-direction: column;
}
.user-name {
  font-weight: 600;
}
</style>
