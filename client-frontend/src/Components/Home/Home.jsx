import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import jwtDecode from 'jwt-decode';
import AddFriendIcon from '@mui/icons-material/PersonAddOutlined';
import MusicNoteIcon from '@mui/icons-material/MusicNoteOutlined';
import ContactIcon from '@mui/icons-material/PersonPinOutlined';
import MessageIcon from '@mui/icons-material/MailOutline';
import NewsIcon from '@mui/icons-material/Feed';
import ProfileIcon from '@mui/icons-material/PersonOutline';
import './Home.css'



function Home() {
const navigate = useNavigate();

const getUserId = () => {
    const sessionToken = localStorage.getItem('token');
    if (sessionToken) {
        try {
            const decodedToken = jwtDecode(sessionToken)
            return decodedToken._id 
        } catch (error) {
            console.log(`error decoding`,error)
        }
    }

    return null;
}

return (
    <div id='all-Home'>
        <div id='banner'>
            <h1 id='banner-text'>BandTogether</h1>
            <div id='banner-underline'></div>
            
        </div>

        <div id='top'>

            <div id='meet-bands'>
                <Button
                id='button-1'
                startIcon={<AddFriendIcon/>} 
                aria-label='Meet Bands & Venues'
                onClick={() => navigate('/meetbands')}
                />
                <p>Meet Bands</p>
                <p>& Venues</p>
            </div>
            <div id='find-shows'>
                <Button
                id='button-1'
                startIcon={<MusicNoteIcon/>} 
                aria-label='Find-Shows'
                onClick={() => navigate(`/findshows`)}
                />
                <p>Find Shows</p>
            </div>
        </div>

        <div id='middle'>
            <div id='contacts'>
                <Button
                id='button-1'
                startIcon={<ContactIcon/>} 
                aria-label='My Contacts'
                onClick={() => navigate('/friends')}
                />
                <p>My Contacts</p>
            </div>
            <div id='messages'>
                <Button
                id='button-1'
                startIcon={<MessageIcon/>}
                aria-label='Messages'
                onClick={() => navigate('/inbox')}
                />
                <p>Messages</p>
            </div>
        </div>
        <div id='bottom'>
            <div id='News'>
                <Button
                id='button-1'
                startIcon={<NewsIcon/>}
                aria-label='Music News'
                onClick={() => navigate('/news')}
                />
                <p>Music News</p>
            </div>
            <div id='my profile'>
                <Button
                id='button-1'
                startIcon={<ProfileIcon/>}
                aria-label='My Profile'
                onClick={() => { 
                    const userId = getUserId();

                        if(userId) {
                            navigate(`/profile/${userId}`)
                        } else {
                            alert(`Ah ah ah, you didn't say the magic word`)
                        }
                        
                    }}
                />
                <p id='my-profile-text'>My Profile</p>
            </div>
        </div>


    </div>
  );
}

export default Home