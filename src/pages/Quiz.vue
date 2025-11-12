<template>
  <div class="quiz-page">
    <h1>Quiz</h1>

    <QuizHome
      v-if="stage === 'home'"
      :quizzes="quizStore.quizzes"
      :loading="quizStore.loading"
      @start="onStart"
    />

    <QuizQuestion
      v-else-if="stage === 'question'"
      :category="currentParams?.category || ''"
      :numQuestions="currentParams?.numQuestions || 5"
      :retryQuestionId="currentParams?.retryQuestionId"
      @finish="onFinish"
      @home="onHome"
      @retry-question="onRetryQuestion"
    />

    <QuizResult
      v-else
      :score="result"
      :answered="mistakes"
      @retry="onRetry"
      @home="onHome"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useQuizStore } from "@/stores/quizStore";
import QuizHome from "@/components/quiz/QuizHome.vue";
import QuizQuestion from "@/components/quiz/QuizQuestion.vue";
import QuizResult from "@/components/quiz/QuizResult.vue";

type Stage = "home" | "question" | "result";

const quizStore = useQuizStore();
const stage = ref<Stage>("home");
const result = ref({ correct: 0, total: 0 });
const mistakes = ref<any[]>([]);
const currentParams = ref<{
  category?: string;
  numQuestions?: number;
  retryQuestionId?: number;
} | null>(null);

// Initialize quiz data on mount
onMounted(() => {
  quizStore.fetchQuizzes();
});

const currentComponent = computed(() => {
  if (stage.value === "home") return QuizHome;
  if (stage.value === "question") return QuizQuestion;
  return QuizResult;
});

const currentProps = computed(() => {
  if (stage.value === "home") return {
    quizzes: quizStore.quizzes,
    loading: quizStore.loading
  };
  if (stage.value === "question")
    return {
      category: currentParams.value?.category || "",
      numQuestions: currentParams.value?.numQuestions || 5,
      retryQuestionId: currentParams.value?.retryQuestionId,
    };
  if (stage.value === "result")
    return { score: result.value, answered: mistakes.value };
  return {};
});

const onStart = async (payload: { category: string; numQuestions: number }) => {
  currentParams.value = payload;
  // Load questions for the selected quiz
  await quizStore.fetchQuizQuestions(payload.category);
  stage.value = "question";
};

const onFinish = (payload: {
  correctCount: number;
  total: number;
  mistakes?: any[];
  answered?: any[];
}) => {
  result.value = { correct: payload.correctCount, total: payload.total };
  mistakes.value = payload.answered || payload.mistakes || [];
  stage.value = "result";
};

const onRetryQuestion = (questionId: number) => {
  // try to find index of question in current quiz and set stage to question with that index
  // we'll pass questionId via a ref that QuizQuestion can use to jump
  // simplest: set currentParams with a special field retryQuestionId
  currentParams.value = {
    ...(currentParams.value || {}),
    retryQuestionId: questionId,
  } as any;
  stage.value = "question";
};

const onRetry = () => {
  result.value = { correct: 0, total: 0 };
  stage.value = "question";
};

const onHome = () => {
  quizStore.resetQuiz();
  stage.value = "home";
};
</script>

<style scoped>
.quiz-page {
  padding: 16px;
}
</style>
