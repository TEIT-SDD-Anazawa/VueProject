<template>
  <div class="quiz-result">
    <h2>結果</h2>
    <p>あなたのスコア: {{ score.correct }} / {{ score.total }}</p>

    <div v-if="answered && answered.length">
      <h3>全問一覧</h3>
      <table>
        <thead>
          <tr>
            <th>番号</th>
            <th>問題文</th>
            <th>あなたの回答</th>
            <th>結果</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(m, idx) in answered" :key="idx">
            <td>
              <a href="#" @click.prevent="$emit('retry-question', m.q.id)">Q{{ m.q.id }}</a>
            </td>
            <td>{{ m.q.question }}</td>
            <td>{{ (m.q.options && m.q.options[m.selected]) ?? '' }}</td>
            <td>
              <span v-if="m.correct" style="color: green">◯</span>
              <span v-else style="color: red">✕</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="margin-top: 12px">
      <v-btn color="primary" @click="$emit('retry')">もう一度挑戦する</v-btn>
      <v-btn color="secondary" @click="$emit('home')">問題選択へ戻る</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  score: { correct: number; total: number };
  answered?: any[];
}>();
</script>

<style scoped>
.quiz-result {
  padding: 16px;
}
</style>
