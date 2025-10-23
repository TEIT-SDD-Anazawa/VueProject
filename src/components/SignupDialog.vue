<template>
  <v-dialog v-model="show" max-width="500" persistent>
    <v-card>
      <!-- ヘッダー -->
      <v-card-title>アカウント登録</v-card-title>

      <!-- 入力欄 -->
      <v-card-text>
        <v-text-field
          :error-messages="userIdError"
          label="ユーザーID"
          v-model="userId"
        />
        <v-text-field
          :error-messages="displayNameError"
          label="表示名"
          v-model="displayName"
        />
        <v-text-field
          :error-messages="passwordError"
          label="パスワード"
          v-model="password"
          type="password"
        />
        <v-text-field
          :error-messages="passwordConfirmError"
          label="パスワード（確認）"
          v-model="passwordConfirm"
          type="password"
        />
        <!-- エラー表示 -->
        <div v-if="errorMessages.length" class="error-list">
          <div v-for="(m, i) in errorMessages" :key="i" class="error-item">
            {{ m }}
          </div>
        </div>
      </v-card-text>

      <!-- 実行ボタン -->
      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" @click="close">キャンセル</v-btn>
        <v-btn
          color="primary"
          :disabled="!canSubmit"
          variant="contained"
          @click="submit"
        >
          登録
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { createUser } from "@/api/dummyApi";
import { validatePassword } from "@/utils/validation";

interface Props {
  modelValue: boolean;
}

type Emits = {
  (e: "update:modelValue", v: boolean): void;
  (e: "signup-success"): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const userId = ref("");
const displayName = ref("");
const password = ref("");
const passwordConfirm = ref("");
const errorMessages = ref<string[]>([]);
const userIdError = ref("");
const displayNameError = ref("");
const passwordError = ref("");
const passwordConfirmError = ref("");
const errorMessages = ref<string[]>([]);

const userIdError = computed(() => {
  if (userId.value.trim().length === 0) return "ユーザーIDを入力してください";
  return "";
});

const displayNameError = computed(() => {
  if (displayName.value.trim().length === 0) return "表示名を入力してください";
  return "";
});

const passwordError = computed(() => {
  const res = validatePassword(password.value);
  if (!res.valid) return res.reasons;
  return "";
});

const passwordConfirmError = computed(() => {
  if (password.value !== passwordConfirm.value) return "パスワードが一致しません";
  return "";
});

/** ダイアログの開閉管理 */
const show = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:modelValue", v),
});

/** ダイアログ開閉に応じて、入力欄とエラーメッセージを初期化する */
watch(show, (v) => {
  if (!v) {
    userId.value = "";
    displayName.value = "";
    password.value = "";
    passwordConfirm.value = "";
    errorMessages.value = [];
  }
});

/** ユーザーIDとパスワードが入力されているか確認する */
const canSubmit = computed(() => {
  return (
    userId.value.trim().length > 0 &&
    displayName.value.trim().length > 0 &&
    password.value.trim().length > 0 &&
    passwordConfirm.value.trim().length > 0
  );
});

/** ダイアログを閉じる */
const close = () => emit("update:modelValue", false);

/**
 * ユーザー登録処理
 * - 成功時はダイアログを閉じる
 * - 失敗時はダイアログは開いたままエラーメッセージを表示する
 */
const submit = async () => {
  // ユーザー登録
  const res = await createUser({
    username: userId.value,
    password: password.value,
    name: displayName.value,
  });
  if (res.success) {
    // 登録成功
    emit("signup-success");
    close();
  } else {
    // 登録失敗
    errorMessages.value.push(res.message || "作成に失敗しました");
  }
};
</script>
