import api from "./axiosInstance";
export async function merchantList() {
  return await api.get(`/merchants/get/${localStorage.getItem("adminId")}`);
}

export async function createMerchant(data: any) {
  return await api.post(`/merchants/create`, {
    user: localStorage.getItem("adminId"),
    name: data.name,
    mobile: data.mobile,
    address: data.address,
  });
}

export async function updateMerchant(id: string, data: any) {
  return await api.put(`/merchants/update/${id}`, {
    name: data.name,
    mobile: data.mobile,
    address: data.address,
  });
}

export async function deleteMerchant(id: string) {
  return await api.delete(`/merchants/delete/${id}`);
}

export async function getMerchant(id: string) {
  return await api.get(`/merchants/${id}`);
}
