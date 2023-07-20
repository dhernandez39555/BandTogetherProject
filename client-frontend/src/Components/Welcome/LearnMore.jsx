import React from 'react'
import { Button } from "@mui/material"
import "./LearnMore.css"

function LearnMore() {
  return (
    <div>
        <h1>Band Together</h1>
        <h3>Build relationships.</h3>
        <h3>Book shows.</h3>
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
            onClick={()=>console.log("Clicked, make sure to add a route to the sign-up page here.")}
        >Sign Up
        </Button>
    </div>
  )
}

export default LearnMore