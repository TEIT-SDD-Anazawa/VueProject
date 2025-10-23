<template>
  <div class="quiz-home">
    <h2>クイズへようこそ</h2>
    <p>カテゴリを選んで開始してください。</p>

    <v-select
      v-model="selectedCategory"
      :items="categories"
      item-title="category"
      item-value="category"
      label="カテゴリ"
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const emit = defineEmits<{
  (e: 'start', payload: { category: string; numQuestions: number }): void
}>()
import { fetchQuizzes } from '@/api/dummyApi'

const selectedCategory = ref<string | null>(null)
const numQuestions = ref<number>(5)
const categories = ref<Array<any>>([])

const questionOptions = [1, 2, 3, 5, 10]

onMounted(async () => {
  const data = await fetchQuizzes()
  categories.value = data
  if (data && data.length > 0) selectedCategory.value = data[0].category
})

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