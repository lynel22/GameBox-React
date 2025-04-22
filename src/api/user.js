import API from "./config";

export const updateProfile = (userData) => {
  return API.post("/user/profile/update", userData);
};

export const getCurrentUser = () => {
  return API.get("/user/profile");
};
