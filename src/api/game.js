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

export const unlockAchievement = (gameId, achievementId) => {
  return API.post(`/game/add-achievement?gameId=${gameId}&achievementId=${achievementId}`);
};

export const searchGames = (query) => {
  return API.get(`/game/search?q=${encodeURIComponent(query)}`);
};

export const addGameToLibraries = (gameId, storeIds) => {
  return API.post(`/game/add-game-to-libraries?gameId=${gameId}`, { storeIds });
};
