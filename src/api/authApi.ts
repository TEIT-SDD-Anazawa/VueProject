import { apiPost } from "@/api/apiClient";

export async function fetchUser(userId: string) {
  try {
    const res = await apiPost("", { userId });
    return res;
  } catch (error) {
    console.error("Error fetchUser:", error);
    throw error;
  }
}

export async function loginUser(userId: string, password: string) {
  try {
    const res = await apiPost("/login", { userId, password });
    return res;
  } catch (error) {
    console.error("Error loginUser:", error);
    throw error;
  }
}

export async function logoutUser(userId: string) {
  try {
    const res = await apiPost("/logout", { userId });
    return res;
  } catch (error) {
    console.error("Error logoutUser:", error);
    throw error;
  }
}
