import { defineStore } from "pinia";
import * as quizApi from "@/api/quizApi";

interface Quiz {
  id: string;
  title: string;
  description?: string;
}

interface Question {
  id: string;
  quizId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export const useQuizStore = defineStore("quiz", {
  state: () => ({
    quizzes: [] as Quiz[],
    currentQuiz: null as Quiz | null,
    questions: [] as Question[],
    currentQuestionIndex: 0,
    loading: false,
  }),
  actions: {
    async fetchQuizzes() {
      this.loading = true;
      try {
        const result = await quizApi.fetchQuizzes();
        if (result && Array.isArray(result)) {
          this.quizzes = result;
        }
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchQuizQuestions(quizId: string) {
      this.loading = true;
      try {
        const result = await quizApi.fetchQuizQuestions(quizId);
        if (result && Array.isArray(result)) {
          this.questions = result;
          this.currentQuestionIndex = 0;
          // Set current quiz if not already set
          if (!this.currentQuiz || this.currentQuiz.id !== quizId) {
            this.currentQuiz = this.quizzes.find(q => q.id === quizId) || null;
          }
        }
      } catch (error) {
        console.error('Failed to fetch quiz questions:', error);
      } finally {
        this.loading = false;
      }
    },
    setCurrentQuiz(quiz: Quiz) {
      this.currentQuiz = quiz;
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      }
    },
    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
      }
    },
    resetQuiz() {
      this.currentQuiz = null;
      this.questions = [];
      this.currentQuestionIndex = 0;
    },
  },
  getters: {
    currentQuestion: (state) => 
      state.questions.length > 0 ? state.questions[state.currentQuestionIndex] : null,
    isFirstQuestion: (state) => state.currentQuestionIndex === 0,
    isLastQuestion: (state) => state.currentQuestionIndex === state.questions.length - 1,
    questionProgress: (state) => ({
      current: state.currentQuestionIndex + 1,
      total: state.questions.length
    }),
  },
});