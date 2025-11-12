<template>
  <div class="quiz-home">
    <h2>クイズへようこそ</h2>
    <p>カテゴリを選んで開始してください。</p>

    <div v-if="loading" class="text-center">
      <v-progress-circular indeterminate color="primary" />
      <p>クイズを読み込み中...</p>
    </div>

    <div v-else>
      <v-select
        v-model="selectedCategory"
        :items="quizzes"
        item-title="title"
        item-value="id"
        label="クイズを選択"
        dense
      />

      <v-select
        v-model="numQuestions"
        :items="questionOptions"
        label="問題数"
        dense
      />

      <div style="margin-top:12px">
        <v-btn color="primary" :disabled="!selectedCategory" @click="start">
          開始
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Quiz {
  id: string;
  title: string;
  description?: string;
}

interface Props {
  quizzes: Quiz[];
  loading: boolean;
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'start', payload: { category: string; numQuestions: number }): void
}>()

const selectedCategory = ref<string | null>(null)
const numQuestions = ref<number>(5)

const questionOptions = [1, 2, 3, 5, 10]

// Auto-select first quiz when quizzes are loaded
watch(() => props.quizzes, (newQuizzes) => {
  if (newQuizzes && newQuizzes.length > 0 && !selectedCategory.value) {
    selectedCategory.value = newQuizzes[0].id
  }
}, { immediate: true })

const start = () => {
  if (!selectedCategory.value) return
  // emit start with chosen category and number of questions
  // payload: { category, numQuestions }
  // parent will move to question stage
  // @ts-ignore
  ;(emit as any)('start', { category: selectedCategory.value, numQuestions: numQuestions.value })
}
</script>

<style scoped>
.quiz-home {
  padding: 16px;
}
</style>