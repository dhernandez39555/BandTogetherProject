import React from 'react'
import { Button } from '@mui/material';
import AddFriendIcon from '@mui/icons-material/PersonAddOutlined';
import MusicNoteIcon from '@mui/icons-material/MusicNoteOutlined';
import ContactIcon from '@mui/icons-material/PersonPinOutlined';
import MessageIcon from '@mui/icons-material/MailOutline';
import NewsIcon from '@mui/icons-material/Feed';
import ProfileIcon from '@mui/icons-material/PersonOutline';
import './Home.css'



function Home() {

  return (
    <div>
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
                onClick={e=> {console.log('clicked')}}
                />
                <p>Meet Bands</p>
                <p>& Venues</p>
            </div>
            <div id='find-shows'>
                <Button
                id='button-1'
                startIcon={<MusicNoteIcon/>} 
                aria-label='Find-Shows'
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
                />
                <p>Find Shows</p>
            </div>
            <div id='messages'>
                <Button
                id='button-1'
                startIcon={<MessageIcon/>}
                aria-label='Messages'
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
                />
                <p>Music News</p>
            </div>
            <div id='my profile'>
                <Button
                id='button-1'
                startIcon={<ProfileIcon/>}
                aria-label='My Profile'
                />
                <p id='my-profile-text'>My Profile</p>
            </div>
        </div>


    </div>
  );
}

export default Home