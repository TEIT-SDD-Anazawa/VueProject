<template>
  <v-container class="pa-4">
    <h2>設定</h2>
    <v-card class="pa-4">
      <v-card-title>ユーザー情報</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="saveUser">
          <v-text-field 
            label="表示名" 
            v-model="name" 
            autocomplete="name"
          />
          <v-text-field 
            label="新しいパスワード" 
            v-model="password" 
            type="password" 
            autocomplete="new-password"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <div v-if="errorMessages.length" class="error-list">
          <div v-for="(m, idx) in errorMessages" :key="idx" class="error-item">{{ m }}</div>
        </div>
        <v-spacer />
        <v-btn color="primary" @click="saveUser">保存</v-btn>
      </v-card-actions>

      <v-divider class="my-4" />

    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { validatePassword } from '@/utils/validation'

const name = ref('')
const password = ref('')

// initialize name from current user in store
const userStore = useUserStore()
if (userStore.user) {
  name.value = (userStore.user as any).name || ''
}
// no theme reactive logic anymore; app stays on light theme

const errorMessages = ref<string[]>([])

const saveUser = async () => {
  errorMessages.value = []
  if (password.value) {
    const res = validatePassword(password.value)
    if (!res.valid) {
      errorMessages.value = res.reasons
      return
    }
  }
  // use the stored user id from store; fall back to 'alice' for demo
  const userid = userStore.user ? (userStore.user as any).id || 'alice' : 'alice'
  await userStore.login(userid, password.value).then(() => {
    // after updating password via userApi, update name via updateUser wrapper
    // call userApi.updateUser through store or directly (we'll use userApi via store action setUser)
    // For now, call userApi directly to update name
  })
  // call update via userApi (we kept updateUser in userApi)
  const userApi = await import('@/api/userApi')
  await userApi.updateUser(userid, { name: name.value, password: password.value || undefined })
  password.value = ''
  // optionally show a notification
}
</script>

<!-- moved to src/styles/common.css -->
