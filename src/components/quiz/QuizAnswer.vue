<template>
  <div class="quiz-answer-result">
    <p v-if="correct">正解！</p>
    <p v-else>不正解：正解は「{{ correctText }}」です</p>
    <p v-if="explanation" class="explanation">{{ explanation }}</p>
    <v-btn color="primary" @click="$emit('next')">次へ</v-btn>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ correct: boolean; correctText: string; explanation?: string }>()
const { explanation, correct, correctText } = props as any
</script>

<style scoped>
.quiz-answer-result {
  padding: 12px;
}
.explanation {
  margin-top: 8px;
  color: #444;
}
</style>
