import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const PrivateRoute = () => {
    const token = localStorage.getItem("token");
    console.log(token)
    const decodedToken = token && token !== "undefined" && jwtDecode(token);

    if (!decodedToken || Date.now() >= decodedToken.exp * 1000) localStorage.removeItem("token");

    return  !localStorage.getItem("token") ? <Navigate to="/welcome" /> : <Outlet />
}

export default PrivateRoute;