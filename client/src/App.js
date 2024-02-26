import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SetAvatar from "./components/SetAvatar";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminGetUser from "./pages/admin/AdminGetUser";
import AddStory from "./pages/AddStory";
import Story from "./pages/Story";
import InfoStory from "./pages/InfoStory";
import InfoUser from "./pages/InfoUser";
import ForgotPassword from "./pages/ForgotPassword";
import RefreshPassword from "./pages/RefreshPassword";

import PrivateRoute from "./middleware/TokenController";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="setAvatar" element={<SetAvatar />} />
        <Route path="admin" element={<AdminLogin />} />
        <Route path="admin/panel/:page" element={<AdminPanel />} />
        <Route path="admin/user/:userId" element={<AdminGetUser />} />
        <Route path="story/info" element={<InfoStory />} /> 
        <Route path="story" element={<Story />} />
        <Route path="story/upload" element={<AddStory />} /> 
        <Route path="/" element={<Chat />} />
        <Route path="/user/info" element={<InfoUser />} />
        <Route path="/account/password/reset" element={<ForgotPassword />} />
        <Route path="/account/password/reset/:refreshToken/:userId" element={<RefreshPassword />} />
        {/* <Route path="/story/upload" element={<PrivateRoute element={<AddStory />} />} /> */}
      </Routes>
    </BrowserRouter>
  );
};