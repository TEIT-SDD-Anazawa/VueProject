import { ref as vueRef } from "vue";
import users from "@/models/tempUser.json";
import quizzes from "@/models/tempQuiz.json";

function fetchUser(
  userAddress?: string
): Promise<{ id: number; name: string }> {
  const name = userAddress ? `User for ${userAddress}` : "Username";
  return Promise.resolve({ id: 1, name });
}

// simulate network latency
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- simple in-memory auth (moved from auth.ts) ---
const token = vueRef<string | null>(null);
// include username (user id) and display name
const user = vueRef<{ id: string; name: string } | null>(null);

// work with a mutable copy of users loaded from JSON
// JSON now uses { userid: string, password: string, username: string }
type StoredUser = { userid: string; password: string; username: string };
let userList: Array<StoredUser> = JSON.parse(JSON.stringify(users));

async function persistUsersToFile() {
  // Only possible when running in a Node environment (dev server). Guard to avoid bundler issues.
  if (typeof window !== "undefined") return false;
  try {
    // @ts-ignore - dynamic import of Node builtins only in dev Node environment
    const { writeFile } = await import("fs/promises");
    // @ts-ignore - dynamic import of Node builtins only in dev Node environment
    const { fileURLToPath } = await import("url");
    const filePath = fileURLToPath(
      new URL("../models/tempUser.json", import.meta.url)
    );
    await writeFile(filePath, JSON.stringify(userList, null, 2), "utf-8");
    return true;
  } catch (e) {
    // ignore write errors in non-node environments
    return false;
  }
}

export async function login(userid: string, password: string) {
  // simulate network latency
  await delay(2000);

  // here `userid` param is the user ID (login id). Stored user has `userid` and `username` (display)
  const found = userList.find(
    (u) => u.userid === userid && u.password === password
  );
  if (found) {
    token.value = "dummy-token";
    // map stored fields to app user shape: username = user id, name = display name
    user.value = { id: found.userid, name: found.username };
    return { success: true, token: token.value, user: user.value };
  }

  return { success: false };
}

export async function updateUser(
  userid: string,
  data: { name?: string; password?: string }
) {
  // simulate network latency
  await delay(2000);
  // userid param is user id (stored as userid)
  const idx = userList.findIndex((u) => u.userid === userid);
  if (idx === -1) return { success: false, message: "not found" };
  if (data.name !== undefined) userList[idx].username = data.name;
  if (data.password !== undefined) userList[idx].password = data.password;
  const persisted = await persistUsersToFile();
  return { success: true, persisted };
}

export async function createUser(userObj: {
  username: string;
  password: string;
  name: string;
}) {
  // incoming userObj: username = user id, name = display name
  const exists = userList.some((u) => u.userid === userObj.username);
  if (exists) return { success: false, message: "exists" };
  userList.push({
    userid: userObj.username,
    password: userObj.password,
    username: userObj.name,
  });
  const persisted = await persistUsersToFile();
  await delay(2000);
  return { success: true, persisted };
}

export async function deleteUser(username: string) {
  // simulate network latency
  await delay(2000);
  // username param = user id
  const idx = userList.findIndex((u) => u.userid === username);
  if (idx === -1) return { success: false, message: "not found" };
  userList.splice(idx, 1);
  const persisted = await persistUsersToFile();
  return { success: true, persisted };
}

export function logout() {
  token.value = null;
  user.value = null;
}

export function isAuthenticated() {
  return token.value !== null;
}

export function getUser() {
  return user;
}

// Shared reactive flag to request showing the login dialog
export const showLoginDialog = vueRef(false);

export { fetchUser };

// --- quiz dummy APIs ---
export async function fetchQuizzes() {
  // simulate latency
  await delay(300);
  // return a deep copy to avoid accidental mutation by consumers
  return JSON.parse(JSON.stringify(quizzes));
}

export async function fetchQuizByCategory(category: string) {
  await delay(200);
  const found = (quizzes as any[]).find((q) => q.category === category);
  return found ? JSON.parse(JSON.stringify(found)) : null;
}

export async function fetchQuizQuestions(category: string) {
  const quiz = await fetchQuizByCategory(category);
  return quiz ? quiz.questions : [];
}
