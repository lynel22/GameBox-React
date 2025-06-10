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

export const getGameDetail = (gameId) => {
  return API.get(`/game/detail?gameId=${gameId}`)
};
