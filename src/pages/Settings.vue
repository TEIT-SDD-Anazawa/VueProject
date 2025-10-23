<template>
  <v-container class="pa-4">
    <h2>設定</h2>
    <v-card class="pa-4">
      <v-card-title>ユーザー情報</v-card-title>
      <v-card-text>
        <v-text-field label="表示名" v-model="name" />
        <v-text-field label="新しいパスワード" v-model="password" type="password" />
      </v-card-text>
      <v-card-actions>
        <div v-if="errorMessages.length" class="error-list">
          <div v-for="(m, idx) in errorMessages" :key="idx" class="error-item">{{ m }}</div>
        </div>
        <v-spacer />
        <v-btn color="primary" @click="saveUser">保存</v-btn>
      </v-card-actions>

      <v-divider class="my-4" />

      <v-card-title>テーマ設定</v-card-title>
      <v-card-text>
        <v-switch v-model="dark" label="ダークモード" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTheme } from 'vuetify'
import { getUser, updateUser } from '@/api/dummyApi'
import { validatePassword } from '@/utils/validation'

const dark = ref(false)
const name = ref('')
const password = ref('')

// initialize name from current user if available
const currentUser = getUser()
if (currentUser && currentUser.value) {
  name.value = currentUser.value.name || ''
}
// initialize from localStorage
if (typeof window !== 'undefined') {
  dark.value = (window.localStorage.getItem('theme') || 'light') === 'dark'
}

const theme = useTheme()

watch(dark, (v) => {
  const name = v ? 'dark' : 'light'
  try {
    theme.global.name.value = name
  } catch (e) {
    // fallback
  }
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('theme', name)
  }
}, { immediate: true })

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
  // use the stored username (user ID); fall back to 'alice' for demo
  const username = currentUser && currentUser.value ? currentUser.value.username : 'alice'
  await updateUser(username, { name: name.value, password: password.value || undefined })
  password.value = ''
  // optionally show a notification
}
</script>

<!-- moved to src/styles/common.css -->
