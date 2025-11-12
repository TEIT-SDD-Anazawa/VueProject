<template>
  <v-container class="pa-4">
    <div class="grid-home">
      <div class="left-top">
        <v-card class="home-card" elevation="2">
          <v-card-title>Quiz</v-card-title>
          <v-card-text>クイズを開始します</v-card-text>
          <v-card-actions>
            <v-btn block color="primary" variant="flat" @click="go('/quiz')">
              クイズを開始
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>

      <div class="left-bottom">
        <v-card class="home-card" elevation="2">
          <v-card-title>アバウト</v-card-title>
          <v-card-text>このアプリについて</v-card-text>
          <v-card-actions>
            <v-btn block color="primary" variant="flat" @click="go('/about')">
              概要を見る
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>

      <div class="right-all">
        <v-card class="home-card" elevation="2">
          <v-card-title>設定</v-card-title>
          <v-card-text>ユーザー設定を行います</v-card-text>
          <v-card-actions>
            <v-btn
              block
              color="primary"
              variant="flat"
              @click="go('/settings')"
            >
              設定変更
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const go = (path: string) => router.push(path).catch(() => {});
</script>

<style scoped>
.grid-home {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(2, 140px);
  gap: 16px;
  align-items: stretch;
}
.left-top {
  grid-column: 1;
  grid-row: 1;
}
.left-bottom {
  grid-column: 1;
  grid-row: 2;
}
.right-all {
  grid-column: 2;
  grid-row: 1 / span 2;
}
.home-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
}

/* Responsive: on small screens stack into single column (quiz, about, settings) */
@media (max-width: 600px) {
  .grid-home {
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }
  .left-top {
    grid-column: 1;
    grid-row: 1;
  }
  .left-bottom {
    grid-column: 1;
    grid-row: 2;
  }
  .right-all {
    grid-column: 1;
    grid-row: 3;
  }
}
</style>
