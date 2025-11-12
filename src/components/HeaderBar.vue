<template>
  <v-app-bar app class="pl-2 pr-2 header-color">
    <!-- サイドバーの開閉ボタン（ログインページでは非表示） -->
    <v-btn
      v-if="!isLoginPage"
      class="ma-2"
      icon
      variant="tonal"
      @click="toggleDrawer"
    >
      <v-icon icon="mdi-menu" />
    </v-btn>

    <!-- タイトル（クリックでホームへ、トーナル見た目 + ツールチップ） -->
    <v-tooltip location="bottom">
      <template #activator="{ props: tprops }">
        <v-btn
          v-bind="tprops"
          class="ma-2 title-button"
          role="link"
          variant="tonal"
          @click="goHome"
        >
          勉強アプリ
        </v-btn>
      </template>
      <span>ホームに戻る</span>
    </v-tooltip>
    <v-spacer />
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

type Emits = {
  (e: "toggle-drawer"): void;
};

const emit = defineEmits<Emits>();
const route = useRoute();
import { useRouter } from "vue-router";

const router = useRouter();

// Computed
// ==============================================================
/** ログインページかどうかの判定 */
const isLoginPage = computed(() => route.name === "Login");

// Method
// ==============================================================
/** サイドバーの開閉処理 */
const toggleDrawer = () => {
  emit("toggle-drawer");
};

const goHome = () => {
  router.push("/").catch(() => {});
};
</script>

<style scoped>
.header-color {
  background-color: #1976d2 !important;
  color: white !important;
}

.clickable-title {
  cursor: pointer;
  user-select: none;
}

.title-button {
  height: 40px;
  line-height: 40px;
  padding: 0 12px;
  font-weight: 600;
  color: white !important;
}
</style>
