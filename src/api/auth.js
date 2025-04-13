import axios from "axios";

const TOKEN_KEY = 'token';


const API = axios.create({
  baseURL: "http://localhost:8080", 
});

export const login = async (credentials) => {
  const response = await API.post("/user/login", credentials);
  if (response.status === 200) {
    const token = response.data.token;
    saveToken(token);
  } else {
    throw new Error("Login failed");
  }
  return response;
};


export const register = (userData) => {
  return API.post("/user/register", userData);
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}


export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}