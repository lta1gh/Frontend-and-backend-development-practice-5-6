import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    "accept": "application/json",
  }
});

export const api = {
  createService: async (service) => {
    let response = await apiClient.post("/services", service);
    return response.data;
  },
  getServices: async () => {
    let response = await apiClient.get("/services");
    return response.data;
  },
  getServiceById: async (id) => {
    let response = await apiClient.get(`/services/${id}`);
    return response.data;
  },
  updateService: async (id, service) => {
    let response = await apiClient.patch(`/services/${id}`, service);
    return response.data;
  },
  deleteService: async (id) => {
    let response = await apiClient.delete(`/services/${id}`);
    return response.data;
  }
};