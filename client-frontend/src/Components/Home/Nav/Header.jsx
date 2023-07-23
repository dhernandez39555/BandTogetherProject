import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import ProfileIcon from '@mui/icons-material/PersonOutline';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

function Header() {
    const getUserId = () => {
        const sessionToken = localStorage.getItem('token');

        if (!sessionToken) return;
        try {
            const decodedToken = jwtDecode(sessionToken)
            console.log(decodedToken._id)
            return decodedToken._id 
        } catch (error) {
            console.log(`error decoding`,error)
        }
    }

    

    return (
        <div id="header">
            <div className="nav-wrap">
                <Link to={`/profile/${getUserId()}`}><ProfileIcon htmlColor='#DB9A35' fontSize='large' /></Link>
                <Link to="/"><HomeOutlinedIcon htmlColor='#DB9A35' fontSize='large' /></Link>
            </div>
        </div>
    )
}

export default Header