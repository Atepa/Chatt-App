export const host = "http://127.0.0.1:8081";
export const loginRoute = `${host}/api/auth/login`;
export const forgotPassword = `${host}/api/auth/forgot/password`;
export const RefreshPassword = `${host}/api/auth/Refresh/password`;
export const registerRoute = `${host}/api/auth/register`;
export const logoutRoute = `${host}/api/auth/logout`;
export const allUsersRoute = `${host}/api/auth/allusers`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const recieveMessageRoute = `${host}/api/messages/getmsg`;
export const setAvatarRoute = `${host}/api/auth/setavatar`;
export const postStory = `${host}/api/auth/add-story/user`;
export const getStories = `${host}/api/auth/story`;
export const deleteStory = `${host}/api/auth/story/delete`;
export const getUserInfo = `${host}/api/auth/user/info`;
export const putUserInfo = `${host}/api/auth/user/update`;
export const putUserPasswordInfo = `${host}/api/auth/user/update-password`;
export const adminRoute = `${host}/api/admin/login`;
export const adminUsersRoute = `${host}/api/admin/users`;
export const adminUserRoute = `${host}/api/admin/user`;