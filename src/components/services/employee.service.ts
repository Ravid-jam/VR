import api from "./axiosInstance";

export async function employeeList() {
  return await api.get(`/employee/get/${localStorage.getItem("adminId")}`);
}

export async function createEmployeeWorks(data: any) {
  return await api.post(`/employeeWork/create`, {
    employeeId: data.employeeId,
    itemName: data.itemName,
    quantity: data.quantity,
    itemPrice: parseFloat(data.itemPrice),
  });
}

export async function createEmployee(data: any) {
  return await api.post(`/employee/create`, {
    user: localStorage.getItem("adminId"),
    name: data.name,
    mobile: data.mobile,
    address: data.address,
  });
}

export async function getEmployeeWorks(employeeId: string) {
  const currentDate = new Date();

  const currentMonth = currentDate.getMonth();
  return await api.get(
    `/employeeWork/view-monthly/${employeeId}/${currentMonth + 1}`,
  );
}

export async function getEmployee(id: string) {
  return await api.get(`/employee/get-employee/${id}`);
}

export async function updateEmployee(id: string, data: any) {
  return await api.put(`/employee/update/${id}`, data);
}

export async function deleteEmployee(id: string) {
  return await api.delete(`/employee/delete-employee/${id}`);
}

export async function updateEmployeeWork(id: string, data: any) {
  return await api.put(`/employeeWork/update/${id}`, {
    itemName: data.itemName,
    quantity: data.quantity,
    itemPrice: parseFloat(data.itemPrice),
  });
}

export async function deleteEmployeeWork(id: string) {
  return await api.delete(`/employeeWork/delete/${id}`);
}

export async function getEmployeeWork(id: string) {
  return await api.get(`/employeeWork/view-single/${id}`);
}
