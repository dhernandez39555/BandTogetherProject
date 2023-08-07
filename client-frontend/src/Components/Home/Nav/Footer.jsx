import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import AddFriendIcon from '@mui/icons-material/PersonAddOutlined';
import MusicNoteIcon from '@mui/icons-material/MusicNoteOutlined';
import NewsIcon from '@mui/icons-material/Feed';
import ContactIcon from '@mui/icons-material/PersonPinOutlined';
import MessageIcon from '@mui/icons-material/MailOutline';
import './nav.css';

function Footer() {
    return (
        <div id="footer">
            <div className="nav-wrap">
                <Link to={`/meetbands`}><AddFriendIcon htmlColor='#DB9A35' fontSize='large' /></Link>
                <Link to={`/findshows`}><MusicNoteIcon htmlColor='#DB9A35' fontSize='large' /></Link>
                <Link to={`/news`}><NewsIcon htmlColor='#DB9A35' fontSize='large' /></Link>
                <Link to={`/friends`}><ContactIcon htmlColor='#DB9A35' fontSize='large' /></Link>
                <Link to={`/inbox`}><MessageIcon htmlColor='#DB9A35' fontSize='large' /></Link>
            </div>
        </div>
    )
}

export default Footer