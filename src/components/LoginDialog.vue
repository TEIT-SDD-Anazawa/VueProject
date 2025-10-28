<template>
  <v-dialog v-model="show" max-width="500" persistent>
    <v-card>
      <!-- ヘッダー -->
      <v-card-title>ログイン</v-card-title>

      <!-- 入力欄 -->
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="userId"
            autocomplete="username"
            label="ユーザーID"
            :rules="userIdRules"
            @blur="onUserIdBlur"
          />
          <v-text-field
            v-model="password"
            autocomplete="current-password"
            label="パスワード"
            type="password"
            :rules="passwordRules"
            @blur="onPasswordBlur"
          />
          <!-- エラー表示 -->
          <div v-if="submitErrorMessage" class="login-error">
            {{ submitErrorMessage }}
          </div>
        </v-form>
      </v-card-text>

      <!-- 実行ボタン -->
      <v-card-actions>
        <v-btn size="x-small" variant="text" @click="$emit('open-signup')">
          アカウント登録は<span class="text-blue">【こちら】</span>
        </v-btn>
        <v-spacer />
        <v-btn class="mr-2" variant="outlined" @click="close">キャンセル</v-btn>
        <v-btn
          color="primary"
          :disabled="!canSubmit"
          variant="flat"
          @click="submit"
        >
          ログイン
        </v-btn>
      </v-card-actions>

      <!-- ローディングオーバーレイ -->
      <v-overlay
        contained
        scrim
        :model-value="loading"
        :z-index="2500"
        class="login-overlay"
      >
        <v-progress-circular indeterminate size="48" color="primary" />
      </v-overlay>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { login } from "@/api/dummyApi";
import { withLoading } from "@/utils/loading";

interface Props {
  /** ダイアログの表示非表示 */
  modelValue: boolean;
}

type Emits = {
  /** ダイアログの表示非表示を更新 */
  (e: "update:modelValue", v: boolean): void;
  /** ログイン成功時の処理 */
  (e: "login-success"): void;
  /** アカウント登録画面を開く処理 */
  (e: "open-signup"): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Data
// ==============================================================
const userId = ref("");
const password = ref("");
const loading = ref(false);

/** フォーム送信時のエラーメッセージ */
const submitErrorMessage = ref("");
/** ユーザーID入力欄にエラー表示させるかどうか */
const userIdTouched = ref(false);
/** パスワード入力欄にエラー表示させるかどうか */
const passwordTouched = ref(false);

// Computed
// ==============================================================
/** ユーザーID入力欄のバリデーションルール */
const userIdRules = computed(() => {
  return [
    (v: string) => {
      if (!userIdTouched.value) {
        // エラー表示のフラグが立っていないならエラーなし
        return true;
      }
      if (v && v.trim().length > 0) {
        return true;
      } else {
        // 入力値がないならエラー
        return "ユーザーIDを入力してください";
      }
    },
  ];
});

/** パスワード入力欄のバリデーションルール */
const passwordRules = computed(() => {
  return [
    (v: string) => {
      if (!passwordTouched.value) {
        // エラー表示のフラグが立っていないならエラーなし
        return true;
      }
      if (v && v.trim().length > 0) {
        return true;
      } else {
        // 入力値がないならエラー
        return "パスワードを入力してください";
      }
    },
  ];
});

/** ダイアログの開閉管理 */
const show = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:modelValue", v),
});

/**
 * ログインボタンを押下可能か確認する
 * - 押下可能条件：ユーザーIDとパスワードが入力済み
 */
const canSubmit = computed(() => {
  const filled =
    userId.value.trim().length > 0 && password.value.trim().length > 0;
  return filled;
});

// Watch
// ==============================================================
/** ダイアログ開閉に応じて、入力欄とエラーメッセージを初期化する */
watch(show, (v) => {
  if (v) {
    // ダイアログを開いたとき
    userIdTouched.value = false;
    passwordTouched.value = false;
    submitErrorMessage.value = "";
  } else {
    // ダイアログを閉じた時
    userId.value = "";
    password.value = "";
    userIdTouched.value = false;
    passwordTouched.value = false;
    submitErrorMessage.value = "";
  }
});

// Method
// ==============================================================
/** ダイアログを閉じる */
const close = () => emit("update:modelValue", false);

/** ユーザーIDの入力欄にエラー表示させる */
const onUserIdBlur = () => {
  userIdTouched.value = true;
};

/** パスワードの入力欄にエラー表示させる */
const onPasswordBlur = () => {
  passwordTouched.value = true;
};

/**
 * ログイン処理
 * - 成功時はダイアログを閉じる
 * - 失敗時はダイアログは開いたままエラーメッセージを表示する
 */
const submit = async () => {
  // ログイン認証
  const res = await withLoading(loading, () =>
    login(userId.value, password.value)
  );
  if (res.success) {
    // 認証成功
    submitErrorMessage.value = "";
    emit("login-success");
    close();
  } else {
    // 認証失敗
    submitErrorMessage.value = "ユーザーIDまたはパスワードが違います";
  }
};
</script>
