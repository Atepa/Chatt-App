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
        <Route path="story" element={<Story />} />
        <Route path="story/upload" element={<AddStory />} />
        <Route path="/" element={<Chat />} />
        

      </Routes>
    </BrowserRouter>
  );
};