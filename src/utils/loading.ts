import type { Ref } from 'vue'

export type Awaitable<T> = T | Promise<T>

/**
 * ローディング状態を管理する純粋関数
 * @param flagRef ローディングフラグのRef
 * @param fn 実行する非同期関数
 * @returns 実行結果
 */
export const withLoading = async <T>(
  flagRef: Ref<boolean>,
  fn: () => Awaitable<T>
): Promise<T> => {
  flagRef.value = true;
  try {
    return await fn();
  } finally {
    flagRef.value = false;
  }
};
