import api from "./axiosInstance";
export async function login(data: any) {
  return await api.post(`/auth/login`, data);
}
