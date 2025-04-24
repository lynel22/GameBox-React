import API from "./config";

export const TOKEN_KEY = "token";

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

export const logout = () => {
  removeToken();
  window.location.href = "/";
};

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}


export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}