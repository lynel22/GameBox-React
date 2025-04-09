import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080", // puedes usar una variable de entorno luego
});

export const login = (credentials) => {
  return API.post("/user/login", credentials);
};

export const register = (userData) => {
  return API.post("/user/register", userData);
}
