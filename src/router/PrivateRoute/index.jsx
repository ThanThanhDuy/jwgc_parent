import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const isAuth = true;

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;