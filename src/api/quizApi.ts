import { fetchQuizzes as dummyFetchQuizzes, fetchQuizQuestions as dummyFetchQuizQuestions } from '@/api/dummyApi'

export async function fetchQuizzes() {
  return await dummyFetchQuizzes()
}

export async function fetchQuizQuestions(category: string) {
  return await dummyFetchQuizQuestions(category)
}

export default {
  fetchQuizzes,
  fetchQuizQuestions,
}
