import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const token = localStorage.getItem("token");
    //TODO add token expired logic
    return  !token ? <Navigate to="/login" /> : <Outlet />
}

export default PrivateRoute;