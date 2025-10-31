import {
  login as dummyLogin,
  logout as dummyLogout,
  getUser as getDummyUser,
  updateUser as dummyUpdateUser,
} from "@/api/dummyApi";
import { login as authLogin } from "@/api/authApi";
import { createUser as dummyCreateUser } from "@/api/dummyApi";
import { showLoginDialog as dummyShowLoginDialog } from "@/api/dummyApi";

export const showLoginDialog = dummyShowLoginDialog;

export async function login(userid: string, password: string) {
  // Delegate to authApi (which currently delegates to dummyLogin)
  const res = await authLogin(userid, password);
  return res;
}

export function logout() {
  // Delegate to dummy logout
  try {
    dummyLogout();
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export function getUser() {
  return getDummyUser();
}

export async function updateUser(
  userid: string,
  data: { name?: string; password?: string }
) {
  return await dummyUpdateUser(userid, data);
}

export async function createUser(userObj: {
  username: string;
  password: string;
  name: string;
}) {
  return await dummyCreateUser(userObj);
}

export default {
  login,
  logout,
  getUser,
  updateUser,
  createUser,
  showLoginDialog: dummyShowLoginDialog,
};
