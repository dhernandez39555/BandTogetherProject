import React from 'react'
import './welcome.css'
import { Link } from 'react-router-dom'
import MusicNoteIcon from '@mui/icons-material/MusicNote';

function Welcome() {
    return (
        <main id="welcome-page">
            <div id="welcome-container">
                <h1>BandTogether</h1>
                <img id="title-icon" src={'/assets/8thnote.png'} alt="note" />
                <div id="title-underline"></div>
                <h2>Build relationships.<br/>Book shows.</h2>
                <div id="welcome-btns">
                    <Link to="/login" ><span>Sign In</span></Link>
                    <Link to="/register" ><span>Sign Up</span></Link>
                </div>
            </div>
            <div id="welcome-info">
                    <p id='welcome-text'>
                    BandTogether is a networking platform for Vermont’s local music scene.
                    <br />
                    <br />
                    Started by musicians, for musicians, our goal is to connect the bands and venues that make our little community special.
                    <br />
                    <br />
                    See you at the next show.
                </p>
                <div id="welcome-footer">
                    <Link to="/learnmore" ><span>Learn More</span></Link>
                </div>
            </div>
        </main>
    )
}

export default Welcome