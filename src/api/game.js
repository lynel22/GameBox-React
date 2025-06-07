import API from "./config";

export const getGeneralLibrary = () => {
  return API.get("/game/library");
};

export const getSteamLibrary = () => {
  return API.get("/game/library/steam");
};

export const getEpicLibrary = () => {
  return API.get("/game/library/epic");
};
