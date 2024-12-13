import api from "./axiosInstance";

export async function createStock(data: any) {
  return await api.post(`/stocks/create`, data);
}

export async function updateStock(id: string, data: any) {
  return await api.put(`/stocks/update/${id}`, data);
}
export async function stockMerchantWiseList(id: string) {
  return await api.get(`/stocks/view/${id}`);
}

export async function getStock(id: string) {
  return await api.get(`/stocks/single/${id}`);
}

export async function deleteStock(id: string) {
  return await api.delete(`/stocks/delete/${id}`);
}
