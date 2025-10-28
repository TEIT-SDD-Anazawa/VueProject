<template>
  <div class="quiz-question">
    <div v-if="loading">読み込み中...</div>
    <div v-else>
      <div v-if="currentIndex < questions.length">
        <h3>問題 {{ currentIndex + 1 }} / {{ questions.length }}</h3>
        <p>{{ current.questionText }}</p>

        <v-list>
          <v-list-item
            v-for="(option, idx) in current.options"
            :key="option.id"
            class="nav-item"
            :class="{ 'option-active': selectedOption === option.id }"
            @click="toggleSelect(option.id)"
          >
            <span class="option-num">{{ idx + 1 }}</span>
            <span class="option-text">{{ option.optionText }}</span>
          </v-list-item>
        </v-list>

        <div style="margin-top: 12px">
          <v-btn
            color="primary"
            :disabled="selectedOption === null || showResult"
            @click="submitAnswer"
            >回答する</v-btn
          >
        </div>

        <div v-if="showResult" style="margin-top: 12px">
          <QuizAnswer
            :correct="lastCorrect"
            :correctText="lastCorrectText"
            @next="nextQuestion"
          />
        </div>
      </div>
      <div v-else>
        <p>全問終了しました。</p>
        <v-btn color="primary" @click="emitFinish">結果へ</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import QuizAnswer from "@/components/quiz/QuizAnswer.vue";
import { fetchQuizQuestions } from "@/api/quizApi";

interface Option {
  id: number;
  optionText: string;
}
interface Question {
  questionId: number;
  questionText: string;
  options: Option[];
  answer: number;
}

const props = defineProps<{
  category: string;
  numQuestions: number;
  retryQuestionId?: number;
}>();
const emit = defineEmits<{
  (
    e: "finish",
    payload: {
      correctCount: number;
      total: number;
      mistakes: any[];
      answered: any[];
    }
  ): void;
  (e: "home"): void;
}>();

const loading = ref(true);
const questions = ref<Question[]>([]);
const currentIndex = ref(0);

const selectedOption = ref<number | null>(null);
const showResult = ref(false);
const lastCorrect = ref(false);
const lastCorrectText = ref("");

const answered = ref<
  Array<{ q: Question; selected: number; correct: boolean }>
>([]);

const current = computed(() => questions.value[currentIndex.value]);

onMounted(async () => {
  loading.value = true;
  const qs = await fetchQuizQuestions(props.category);
  // slice to requested number
  questions.value = qs.slice(0, props.numQuestions);
  // if retryQuestionId provided, find index
  if (props.retryQuestionId !== undefined) {
    const idx = questions.value.findIndex(
      (q) => q.questionId === props.retryQuestionId
    );
    if (idx !== -1) currentIndex.value = idx;
  }
  loading.value = false;
});

const toggleSelect = (id: number) => {
  if (showResult.value) return;
  if (selectedOption.value === id) selectedOption.value = null;
  else selectedOption.value = id;
};

const submitAnswer = () => {
  if (selectedOption.value === null) return;
  const id = selectedOption.value;
  const correct = current.value.answer === id;
  lastCorrect.value = correct;
  const correctOption = current.value.options.find(
    (o) => o.id === current.value.answer
  );
  lastCorrectText.value = correctOption ? correctOption.optionText : "";
  answered.value.push({ q: current.value, selected: id, correct });
  showResult.value = true;
};

const nextQuestion = () => {
  showResult.value = false;
  selectedOption.value = null;
  currentIndex.value += 1;
};

const emitFinish = () => {
  const correctCount = answered.value.filter((a) => a.correct).length;
  emit("finish", {
    correctCount,
    total: questions.value.length,
    mistakes: answered.value.filter((a) => !a.correct),
    answered: answered.value,
  });
};
</script>

<style scoped>
.quiz-question {
  padding: 16px;
}
.nav-item {
  cursor: pointer;
}

.option-num {
  display: inline-block;
  width: 28px;
  text-align: center;
  margin-right: 8px;
  font-weight: bold;
}

.option-text {
  display: inline-block;
}

.option-active {
  background-color: rgba(0, 123, 255, 0.08);
  border-radius: 6px;
}
</style>
