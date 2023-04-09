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
import UpdateBlog from "../pages/UpdateBlog";
import ResetPassword from "../pages/ResetPassword";
import ForgotPassword from "../pages/ForgotPassword";
import SuccessPageResetPassword from "../components/SuccessPageResetPassword";
import UpdateProfile from "../pages/UpdateProfile";
import Children from "../pages/Children/index";
import Invition from "../pages/Invition";
import Reminder from "../pages/Reminder";
import History from "../pages/History";
import Career from "../pages/Career";

function Router() {
  return (
    <Routes>
      {/* public routes */}
      <Route index element={<Navigate to="home" replace />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="reset-password/:token" element={<ResetPassword />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route
        path="success-reset-password"
        element={<SuccessPageResetPassword />}
      />
      {/* main layout */}
      <Route path="/" element={<Layout />}>
        <Route path="home" element={<Home />} />
        <Route
          path="blog/:name/:titleBlog/:codeBlog/:username"
          element={<Blog />}
        />
        {/* private routes */}
        <Route element={<PrivateRoute />}>
          <Route path="category/:name" element={<Category />} />
          <Route path="create-post" element={<CreateBlog />} />
          <Route path="profile/:username" element={<Profile />} />
          <Route path="profile/update/:username" element={<UpdateProfile />} />
          <Route
            path="pending/:titleBlog/:codeBlog"
            element={<PendingPage />}
          />
          <Route path="edit/:titleBlog/:codeBlog" element={<UpdateBlog />} />
          <Route path="children-care" element={<Children />} />
          <Route path="invition" element={<Invition />} />
          <Route path="reminder" element={<Reminder />} />
          <Route path="history" element={<History />} />
          <Route path="career-support" element={<Career />} />
        </Route>
      </Route>
      {/* not found */}
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
}

export default Router;
