import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import ProfileIcon from '@mui/icons-material/PersonOutline';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

import './nav.css'
import Sidebar from './Sidebar';

function Header() {

    const getUserId = () => {
        const sessionToken = localStorage.getItem('token');

        if (!sessionToken) return null;
        try {
            const decodedToken = jwtDecode(sessionToken);
            return decodedToken._id;
        } catch (err) {
            console.log(`err decoding`, err);
        }
    }   

    return (
        <>
        <div id="header">
            <div className="nav-wrap">
                <Link to={`/profile/${getUserId()}`}><ProfileIcon htmlColor='#DB9A35' fontSize='large' /></Link>
                <Link to="/"><HomeOutlinedIcon htmlColor='#DB9A35' fontSize='large' /></Link>
                <Sidebar/>
            </div>
        </div>
        <Outlet />
        </>
    )
}

export default Header