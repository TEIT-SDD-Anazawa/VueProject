<template>
  <v-container class="pa-4">
    <v-card class="pa-4" max-width="480" style="margin: 0 auto">
      <v-card-title>ログイン</v-card-title>
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
          <div v-if="submitErrorMessage" class="login-error">
            {{ submitErrorMessage }}
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn class="mr-2" variant="outlined" @click="goHome">キャンセル</v-btn>
        <v-btn color="primary" :disabled="!canSubmit" @click="submit">ログイン</v-btn>
      </v-card-actions>

      <v-overlay contained scrim :model-value="loading" :z-index="2500" class="login-overlay">
        <v-progress-circular indeterminate size="48" color="primary" />
      </v-overlay>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { withLoading } from '@/utils/loading'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const userId = ref('')
const password = ref('')
const loading = ref(false)
const submitErrorMessage = ref('')
const userIdTouched = ref(false)
const passwordTouched = ref(false)

const userIdRules = computed(() => [
  (v: string) => {
    if (!userIdTouched.value) return true
    return v && v.trim().length > 0 ? true : 'ユーザーIDを入力してください'
  }
])
const passwordRules = computed(() => [
  (v: string) => {
    if (!passwordTouched.value) return true
    return v && v.trim().length > 0 ? true : 'パスワードを入力してください'
  }
])

const canSubmit = computed(() => userId.value.trim().length > 0 && password.value.trim().length > 0)

const onUserIdBlur = () => (userIdTouched.value = true)
const onPasswordBlur = () => (passwordTouched.value = true)

const goHome = () => router.push('/')

const submit = async () => {
  submitErrorMessage.value = ''
  const res = await withLoading(loading, () => userStore.login(userId.value, password.value))
  if (res && res.success && res.user) {
    // success - navigate to redirect from sessionStorage
    const redirect = sessionStorage.getItem('loginRedirect') || '/'
    sessionStorage.removeItem('loginRedirect') // cleanup
    router.push(redirect).catch(() => {})
  } else {
    submitErrorMessage.value = 'ユーザーIDまたはパスワードが違います'
  }
}
</script>

<style scoped>
.login-error { color: red; margin-top: 8px }
</style>
