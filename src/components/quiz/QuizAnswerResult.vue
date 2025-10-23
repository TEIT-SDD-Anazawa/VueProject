<template>
  <div class="quiz-answer-result">
    <p v-if="correct">正解！</p>
    <p v-else>不正解：正解は「{{ correctText }}」です</p>
    <v-btn color="primary" @click="$emit('next')">次へ</v-btn>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ correct: boolean; correctText: string }>()
</script>

<style scoped>
.quiz-answer-result {
  padding: 12px;
}
</style>