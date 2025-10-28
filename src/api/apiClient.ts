import axios from "axios";
import { useConfigStore } from "@/stores/configStore";

function buildHeaders(token?: string, isFormData?: boolean) {
  const headers: Record<string, string> = {
    "Content-Type": isFormData ? "multipart/form-data" : "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function getBaseURL() {
  const config = useConfigStore();
  return config.api.baseURL;
}

export async function apiPost<T>(
  path: string,
  body?: any,
  opts?: any
): Promise<T> {
  const url = `${getBaseURL().replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  const headers = buildHeaders(opts?.token, opts?.isFormData);
  try {
    const response = await axios.post<T>(url, body, { headers });
    return response.data;
  } catch (error) {
    console.error("API POST error:", error);
    throw error;
  }
}
