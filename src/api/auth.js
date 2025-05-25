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

export const verifySteamLogin = async (urlParams) => {
  const formData = {};
  for (const [key, value] of urlParams.entries()) {
    formData[key] = value;
  }

  try {
    const response = await API.post(
      "/user/auth/steam/verify",
      formData, // ahora como objeto JSON
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return { ok: true, message: response.data };
  } catch (error) {
    const message =
      error.response?.data || error.message || "Error desconocido al verificar Steam";
    return { ok: false, message };
  }
};

