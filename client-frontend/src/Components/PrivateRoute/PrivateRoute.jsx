import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const token = localStorage.getItem("token");
    //TODO add token expired logic
    return  !token ? <Navigate to="/welcome" /> : <Outlet />
}

export default PrivateRoute;