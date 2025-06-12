import { api } from "./api";

export const login = async (username, password) => {
  try {
    const response = await api.post("/user/signin", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    return { success: false, msg: error?.response?.data?.msg || "Login failed" };
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/user/logout");
    return response.data;
  } catch (error) {
    return { success: false, msg: error?.response?.data?.msg || "Logout failed" };
  }
};
