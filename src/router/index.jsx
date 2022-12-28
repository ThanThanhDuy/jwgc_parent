import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
// auth
import PrivateRoute from "./PrivateRoute";
// screens
import Notfound from "../components/Notfound";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Layout from "../layout";
import Category from "../pages/Category";
import Register from "../pages/Register";
import CreateBlog from "../pages/CreateBlog";
import Blog from "../pages/Blog";
import Profile from "../pages/Profile";
import PendingPage from "../pages/PendingPage";

function Router() {
  return (
    <Routes>
      {/* public routes */}
      <Route index element={<Navigate to="home" replace />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="reset-password/:token" element={<Register />} />
      {/* main layout */}
      <Route path="/" element={<Layout />}>
        <Route path="home" element={<Home />} />
        <Route path="blog/:name/:titleBlog/:codeBlog" element={<Blog />} />
        {/* private routes */}
        <Route element={<PrivateRoute />}>
          <Route path="category/:name" element={<Category />} />
          <Route path="create-post" element={<CreateBlog />} />
          <Route path="profile/:username" element={<Profile />} />
          <Route
            path="pending/:titleBlog/:codeBlog"
            element={<PendingPage />}
          />
        </Route>
      </Route>
      {/* not found */}
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
}

export default Router;
