export const host = "http://127.0.0.1:8080/";
export const loginRoute = `${host}user-service/auth/login`;
export const forgotPassword = `${host}user-service/auth/forgot/password`;
export const refreshPassword = `${host}user-service/auth/refresh/password`;
export const hasRefreshPassword = `${host}user-service/auth/refresh/has-refresh-password`;
export const registerRoute = `${host}user-service/auth/register`;
export const logoutRoute = `${host}user-service/auth/logout`;
export const searchUser = `${host}user-service/auth/search-user`; 
export const addFriend = `${host}user-service/auth/add-friend`;
export const getFriends = `${host}user-service/auth/friends-list`;
export const removeFriend = `${host}user-service/auth/remove-friend`;
export const allUsersRoute = `${host}user-service/auth/allusers`;
export const sendMessageRoute = `${host}message-service/messages/addmsg`;
export const recieveMessageRoute = `${host}message-service/messages/getmsg`;
export const setAvatarRoute = `${host}user-service/auth/setavatar`;
export const postStory = `${host}user-service/auth/add-story/user`;
export const getStories = `${host}user-service/auth/story`;
export const postAccessStory = `${host}user-service/auth/post-access-story`;
export const getAccessStory = `${host}user-service/auth/get-access-story`;
export const deleteStory = `${host}user-service/auth/story/delete`;
export const getUserInfo = `${host}user-service/auth/user/info`;
export const putUserInfo = `${host}user-service/auth/user/update`;
export const putUserPasswordInfo = `${host}user-service/auth/user/update-password`;
export const adminRoute = `${host}admin-service/admin/login`;
export const adminUsersRoute = `${host}admin-service/admin/users`;
export const adminUserRoute = `${host}admin-service/admin/user`;