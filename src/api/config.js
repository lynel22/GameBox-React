import axios from "axios";

// Crea una única instancia
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
});

API.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );


// Interceptor para manejar errores globales 
API.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response?.status === 401 &&
        window.location.pathname !== "/login"
      ) {
        console.warn("No autorizado. Redirigiendo al login.");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

export default API;
  