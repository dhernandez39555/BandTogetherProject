import React from 'react'
import { Button } from "@mui/material"
import "./LearnMore.css"
import { useNavigate } from 'react-router-dom'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'; 

function LearnMore() {

  const navigate=useNavigate()

  return (
    <main id='aboutPage'>
      <ArrowBackIosIcon fontSize='large' id="backArrow"
            onClick={() => navigate(`/welcome`)}/>
        <div id="title-container">
                <h1 id='title-headline'>BandTogether</h1>
                <img id="title-icon" src={'/assets/8thnote.png'} alt="note" />
                <div id="title-underline">
                  <h2>Build relationships.<br/>Book shows.</h2>
                </div>
            </div>
        <div id="aboutWrapper">
          <p id="aboutBT">
              BandTogether believes that a thriving music scene looks more like a community than an industry.
              <br/><br/>
              We believe that one meaningful relationship can make all the difference for an independent band. That is why we are here. We connect local bands with other local bands - and the venues that host them too. 
              <br/><br/>
              BandTogether is here to support local live music.
              <br/><br/>
              See you at the next show.
          </p>
          <div id='signUpWrapper'>
            <Button
                id='signUpBtn'
                variant="contained"
                size="large"
                onClick={()=>navigate('/register')}
            >Sign Up
            </Button>
          </div>
        </div>
    </main>
  )
}

export default LearnMore