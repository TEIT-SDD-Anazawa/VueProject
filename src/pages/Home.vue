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
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const auth = computed(() => !!userStore.user)
const user = computed(() => userStore.user)
</script>
