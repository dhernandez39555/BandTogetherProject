import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (token === "undefined") localStorage.removeItem("token");
    //TODO add token expired logic
    return  !token ? <Navigate to="/welcome" /> : <Outlet />
}

export default PrivateRoute;