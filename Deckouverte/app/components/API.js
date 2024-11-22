import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

// Intercepteur pour ajouter le token JWT dans les en-têtes
API.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs globales
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Gérer la déconnexion/redirection
      // Exemple : dispatch une action de redux ou utiliser navigation
    }
    return Promise.reject(error);
  }
);

export default API;
