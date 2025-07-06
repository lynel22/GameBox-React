import API from "./config";

export const getGeneralLibrary = () => {
  return API.get("/game/library");
};

export const getLibraryByStore = (storeName) => {
  return API.get(`/game/library-by-store?store=${encodeURIComponent(storeName)}`);
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

export const getLibraryGameCounts = () => {
  return API.get("/game/library-game-count");
};

export const addGameToWishlist = (gameId) => {
  return API.post(`/game/add-game-to-wishlist?gameId=${gameId}`);
};

export const removeGameFromWishlist = (gameId) => {
  return API.delete(`/game/remove-game-from-wishlist?gameId=${gameId}`);
}

export const getUserWishlist = () => {
  return API.get("/game/user-wishlist");
};
