<template>
  <v-container class="pa-4">
    <div v-if="auth">
      <h1>こんにちは、{{ user?.name }} さん！</h1>
    </div>
    <div v-else>
      <h1>ようこそ！ログインしてください</h1>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { isAuthenticated, getUser } from '@/api/dummyApi'

const auth = computed(() => isAuthenticated())
const user = getUser()
</script>
