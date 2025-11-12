<template>
  <div class="quiz-question">
    <div v-if="quizStore.loading">読み込み中...</div>
    <div v-else-if="currentQuestion">
      <h3>問題 {{ questionProgress.current }} / {{ questionProgress.total }}</h3>
      <p>{{ currentQuestion.question }}</p>

      <v-list>
        <v-list-item
          v-for="(option, idx) in currentQuestion.options"
          :key="idx"
          class="nav-item"
          :class="{ 'option-active': selectedOption === idx }"
          @click="toggleSelect(idx)"
        >
          <span class="option-num">{{ idx + 1 }}</span>
          <span class="option-text">{{ option }}</span>
        </v-list-item>
      </v-list>

      <div style="margin-top: 12px">
        <v-btn
          color="primary"
          :disabled="selectedOption === null || showResult"
          @click="submitAnswer"
        >
          回答する
        </v-btn>
      </div>

      <div v-if="showResult" style="margin-top: 12px">
        <QuizAnswer
          :correct="lastCorrect"
          :correctText="lastCorrectText"
          :explanation="currentQuestion?.explanation"
          @next="nextQuestion"
        />
      </div>
    </div>
    <div v-else-if="quizStore.questions.length === 0">
      <p>問題が見つかりません。</p>
      <v-btn @click="$emit('home')">ホームに戻る</v-btn>
    </div>
    <div v-else>
      <p>全問終了しました。</p>
      <v-btn color="primary" @click="emitFinish">結果へ</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuizStore } from "@/stores/quizStore";
import QuizAnswer from "@/components/quiz/QuizAnswer.vue";

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

const quizStore = useQuizStore();

const selectedOption = ref<number | null>(null);
const showResult = ref(false);
const lastCorrect = ref(false);
const lastCorrectText = ref("");

const answered = ref<
  Array<{ q: any; selected: number; correct: boolean }>
>([]);

// Computed properties from store
const currentQuestion = computed(() => quizStore.currentQuestion);
const questionProgress = computed(() => quizStore.questionProgress);

const toggleSelect = (id: number) => {
  if (showResult.value) return;
  if (selectedOption.value === id) selectedOption.value = null;
  else selectedOption.value = id;
};

const submitAnswer = () => {
  if (selectedOption.value === null || !currentQuestion.value) return;
  const selectedIdx = selectedOption.value;
  const correct = currentQuestion.value.correctAnswer === selectedIdx;
  lastCorrect.value = correct;
  const correctOption = currentQuestion.value.options[currentQuestion.value.correctAnswer];
  lastCorrectText.value = correctOption || "";
  answered.value.push({ 
    q: currentQuestion.value, 
    selected: selectedIdx, 
    correct 
  });
  showResult.value = true;
};

const nextQuestion = () => {
  showResult.value = false;
  selectedOption.value = null;
  
  // Check if this is the last question
  if (quizStore.isLastQuestion) {
    // Move to finish
    emitFinish();
  } else {
    // Move to next question in store
    quizStore.nextQuestion();
  }
};

const emitFinish = () => {
  const correctCount = answered.value.filter((a) => a.correct).length;
  emit("finish", {
    correctCount,
    total: answered.value.length,
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
