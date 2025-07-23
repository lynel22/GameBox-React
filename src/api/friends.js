import API from "./config";

export const getFriendCode = () => API.get("/user/friend-code");

export const searchFriendByCode = (code) =>
  API.get(`/user/search-by-friend-code/${code}`);

export const addFriend = (friendId) =>
  API.post(`/user/add-friend/${friendId}`);

export const getUserFriends = (userId) =>
  API.get(`/user/${userId}/friends`);
