import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const token = localStorage.getItem("token");
    if (token == "undefined") localStorage.removeItem("token");
    //TODO add token expired logic
    return  !localStorage.getItem("token") ? <Navigate to="/welcome" /> : <Outlet />
}

export default PrivateRoute;