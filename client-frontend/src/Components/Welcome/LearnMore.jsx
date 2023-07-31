import React from 'react'
import { Button } from "@mui/material"
import "./LearnMore.css"
import { useNavigate } from 'react-router-dom'
import note from "../assets/8thnote.png";

function LearnMore() {

  const navigate=useNavigate()

  return (
    <div>
        <div id="welcome-container">
                <h1>BandTogether</h1>
                <img id="title-icon" src={note} alt="note" />
                <div id="title-underline"></div>
                <h2>Build relationships.<br/>Book shows.</h2>
            </div>
        <p id="aboutBT">
            BandTogether believes that a thriving music scene looks more like a community than an industry.<br/><br/>
            We believe that one meaningful relationship can make all the difference for an independent band. That is why we are here. We connect local bands with other local bands - and the venues that host them too. <br/><br/>
            BandTogether is here to support local live music.
            <br/><br/>
            See you at the next show.
        </p>
        <Button
            id='signUpBtn'
            variant="contained"
            size="large"
            onClick={()=>navigate('/welcome')}
        >Sign Up
        </Button>
    </div>
  )
}

export default LearnMore