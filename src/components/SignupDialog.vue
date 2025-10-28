<template>
  <v-dialog v-model="show" max-width="500" persistent>
    <v-card>
      <!-- ヘッダー -->
      <v-card-title>アカウント登録</v-card-title>

      <!-- 入力欄 -->
      <template v-if="!signupSucceeded">
        <v-card-text>
          <v-form @submit.prevent="submit">
            <v-text-field
              v-model="userId"
              label="ユーザーID"
              autocomplete="username"
              :rules="userIdRules"
              @blur="onUserIdBlur"
            />
            <v-text-field
              v-model="displayName"
              label="表示名"
              autocomplete="name"
              :rules="displayNameRules"
              @blur="onDisplayNameBlur"
            />
            <v-text-field
              v-model="password"
              label="パスワード"
              type="password"
              autocomplete="new-password"
              :rules="passwordRules"
              @blur="onPasswordBlur"
            />
            <v-text-field
              v-model="passwordConfirm"
              label="パスワード（確認）"
              type="password"
              autocomplete="new-password"
              :rules="passwordConfirmRules"
              @blur="onPasswordConfirmBlur"
            />
            <!-- エラー表示 -->
            <div v-if="submitErrorMessages.length" class="error-list">
              <div
                v-for="(m, i) in submitErrorMessages"
                :key="i"
                class="error-item"
              >
                {{ m }}
              </div>
            </div>
          </v-form>
        </v-card-text>

        <!-- 実行ボタン -->
        <v-card-actions>
          <v-btn size="x-small" variant="text" @click="openLogin">
            アカウント作成済みの場合<span class="text-blue">【ログイン】</span>
          </v-btn>
          <v-spacer />
          <v-btn class="mr-2" variant="outlined" @click="close">
            キャンセル
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!canSubmit"
            variant="flat"
            @click="submit"
          >
            登録
          </v-btn>
        </v-card-actions>
      </template>

      <!-- 成功表示 -->
      <template v-else>
        <v-card-text>
          <v-card-title class="text-center">登録が完了しました</v-card-title>
          <p class="text-center">アカウントの作成に成功しました。</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="outlined" @click="onSuccessClose">閉じる</v-btn>
          <v-btn variant="text" @click="openLogin">ログイン</v-btn>
        </v-card-actions>
      </template>
      <!-- ローディングオーバーレイ -->
      <v-overlay :model-value="loading" :z-index="2500">
        <v-progress-circular indeterminate size="64" color="primary" />
      </v-overlay>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { createUser } from "@/api/dummyApi";
import { withLoading } from "@/utils/loading";
import { validatePassword } from "@/utils/validation";

interface Props {
  /** ダイアログの表示非表示 */
  modelValue: boolean;
}

type Emits = {
  /** ダイアログの表示非表示を更新 */
  (e: "update:modelValue", v: boolean): void;
  /** ユーザー登録成功時の処理 */
  (e: "signup-success"): void;
  /** ログインダイアログを開く要求 */
  (e: "open-login"): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Data
// ==============================================================
const userId = ref("");
const displayName = ref("");
const password = ref("");
const passwordConfirm = ref("");

const signupSucceeded = ref(false);
const loading = ref(false);

/** フォーム送信時のエラーメッセージ */
const submitErrorMessages = ref<string[]>([]);
/** ユーザーID入力欄にエラー表示させるかどうか */
const userIdTouched = ref(false);
/** ユーザー名入力欄にエラー表示させるかどうか */
const displayNameTouched = ref(false);
/** パスワード入力欄にエラー表示させるかどうか */
const passwordTouched = ref(false);
/** パスワード確認入力欄にエラー表示させるかどうか */
const passwordConfirmTouched = ref(false);

// Computed
// ==============================================================
/** ユーザーID入力欄のバリデーションルール */
const userIdRules = computed(() => [
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
]);

/** ユーザー名入力欄のバリデーションルール */
const displayNameRules = computed(() => [
  (v: string) => {
    if (!displayNameTouched.value) {
      // エラー表示のフラグが立っていないならエラーなし
      return true;
    }
    if (v && v.trim().length > 0) {
      return true;
    } else {
      // 入力値がないならエラー
      return "表示名を入力してください";
    }
  },
]);

/** パスワード入力欄のバリデーションルール */
const passwordRules = computed(() => [
  (v: string) => {
    if (!passwordTouched.value) {
      // エラー表示のフラグが立っていないならエラーなし
      return true;
    }
    const res = validatePassword(v);
    if (res.valid) {
      return true;
    } else {
      // バリデーション失敗時はエラー
      const resString = Array.isArray(res.reasons)
        ? res.reasons.join("\n")
        : res.reasons;
      return resString;
    }
  },
]);

/** パスワード確認入力欄のバリデーションルール */
const passwordConfirmRules = computed(() => [
  (v: string) => {
    if (!passwordConfirmTouched.value) {
      return true;
    }
    if (v === password.value) {
      return true;
    } else {
      // パスワードが一致しないならエラー
      return "パスワードが一致しません";
    }
  },
]);

/** ダイアログの開閉管理 */
const show = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:modelValue", v),
});

/**
 * 登録ボタンを押下可能か確認する
 * - 押下可能となる条件
 * 1. ユーザーID、ユーザー名、パスワード、パスワード確認が入力済み
 * 2. バリデーションエラーがない
 */
const canSubmit = computed(() => {
  const filled =
    userId.value.trim().length > 0 &&
    displayName.value.trim().length > 0 &&
    password.value.trim().length > 0 &&
    passwordConfirm.value.trim().length > 0;

  const valid =
    userIdRules.value[0](userId.value) === true &&
    displayNameRules.value[0](displayName.value) === true &&
    passwordRules.value[0](password.value) === true &&
    passwordConfirmRules.value[0](passwordConfirm.value) === true;

  return filled && valid;
});

// Watch
// ==============================================================
/** ダイアログ開閉に応じて、入力欄とエラーメッセージを初期化する */
watch(show, (v) => {
  if (v) {
    // ダイアログを開いたとき
    userIdTouched.value = false;
    displayNameTouched.value = false;
    passwordTouched.value = false;
    passwordConfirmTouched.value = false;
  } else {
    // ダイアログを閉じたとき
    // フォームを初期化
    resetForm();
    // ダイアログの閉じアニメーションが終わるまで成功フラグを残すことで
    // 成功表示からフォームへ切り替わる際のちらつきを防ぐ
    setTimeout(() => {
      signupSucceeded.value = false;
    }, 300);
  }
});

// Method
// ==============================================================
/** ユーザーIDの入力欄にエラー表示させる */
const onUserIdBlur = () => (userIdTouched.value = true);
/** ユーザー名の入力欄にエラー表示させる */
const onDisplayNameBlur = () => (displayNameTouched.value = true);
/** パスワードの入力欄にエラー表示させる */
const onPasswordBlur = () => (passwordTouched.value = true);
/** パスワード確認の入力欄にエラー表示させる */
const onPasswordConfirmBlur = () => (passwordConfirmTouched.value = true);

/** ダイアログを閉じる */
const close = () => emit("update:modelValue", false);

/**
 * ユーザー登録処理
 * - 成功時はダイアログを閉じる
 * - 失敗時はダイアログは開いたままエラーメッセージを表示する
 */
const submit = async () => {
  // ユーザー作成処理（ローディングを表示）
  const res = await withLoading(loading, () =>
    createUser({
      username: userId.value,
      password: password.value,
      name: displayName.value,
    })
  );
  if (res.success) {
    // 作成成功
    // フォーム全体を初期化
    resetForm();
    signupSucceeded.value = true;
  } else {
    // 作成失敗
    submitErrorMessages.value = [];
    submitErrorMessages.value.push(res.message || "作成に失敗しました");
    // 失敗したらパスワード欄のみリセット
    password.value = "";
    passwordConfirm.value = "";
    passwordTouched.value = false;
    passwordConfirmTouched.value = false;
  }
};

/** フォームを初期化 */
const resetForm = () => {
  userId.value = "";
  displayName.value = "";
  password.value = "";
  passwordConfirm.value = "";
  submitErrorMessages.value = [];
  userIdTouched.value = false;
  displayNameTouched.value = false;
  passwordTouched.value = false;
  passwordConfirmTouched.value = false;
};

const onSuccessClose = () => {
  // 成功ポップアップの閉じるを押したらダイアログを閉じ、親に成功を伝える
  emit("signup-success");
  close();
};

/** サインアップダイアログからログインダイアログを開く */
const openLogin = () => {
  // 先にこのダイアログを閉じて、親へログインを開く合図を送る
  close();
  emit("open-login");
};
</script>
