<template>
  <v-navigation-drawer
    app
    class="navigation-drawer"
    temporary
    v-model="internal"
  >
    <!-- ヘッダー -->
    <v-toolbar flat>
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

      <!-- 設定 -->
      <v-list-item
        v-if="isAuth"
        append-icon="mdi-chevron-right"
        class="nav-item"
        link
        prepend-icon="mdi-cog-outline"
        title="設定"
        @click="select('/settings')"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { isAuthenticated } from "@/api/dummyApi";

interface Props {
  modelValue: boolean;
}
type Emits = {
  (e: "update:modelValue", v: boolean): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const router = useRouter();
const isAuth = computed(() => isAuthenticated());

/** ナビゲーションバーの表示管理 */
const internal = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:modelValue", v),
});

/**
 * 選択したページに遷移する
 * @param path 遷移先のパス
 */
const select = (path: string) => {
  internal.value = false;
  router.push(path).catch(() => {});
};

/** ナビゲーションバーを閉じる */
const close = () => {
  internal.value = false;
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
  margin: 6px 6px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 6px;
}
.nav-item-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
