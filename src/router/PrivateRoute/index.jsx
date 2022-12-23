import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isAuthState } from "../../stores/auth";

function PrivateRoute() {
  // const isAuth = true;
  const isAuth = useRecoilValue(isAuthState);

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
