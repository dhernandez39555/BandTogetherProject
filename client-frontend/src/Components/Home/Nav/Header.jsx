import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

import './nav.css'
import Sidebar from './Sidebar';

function Header() {

    return (
        <>
        <div id="header">
            <div className="nav-wrap">
                <Link to="/"><HomeOutlinedIcon htmlColor='#DB9A35' fontSize='large' /></Link>
                <Sidebar/>
            </div>
        </div>
        <Outlet />
        </>
    )
}

export default Header