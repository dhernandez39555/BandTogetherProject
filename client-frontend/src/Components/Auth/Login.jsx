import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom' 
import "./login.css"
import { IconButton, InputAdornment, TextField } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'; 
import note from "../assets/8thnote.png"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Login({ updateLocalStorage }) {

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ visible, setVisible ] = useState(false)

    const navigate = useNavigate()

    const handleLogin = e => {
        e.preventDefault()

        const url = "http://127.0.0.1:4000/auth/login"

        const body = { email, password }

        fetch(url, {
            method: "POST", 
            body: JSON.stringify(body),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        })
        .then(res => res.json())
        .then(data => {
            !data.token
                ? alert(`${data.message}`)
                : updateLocalStorage(data.token)
        })
        .catch(err => console.log(err));

    }
    
    const EndAdornment = ({visible, setVisible}) => {
        return <InputAdornment position="end">
            <IconButton onClick={() => setVisible(!visible)}>
                {visible ? <VisibilityOffIcon/> : <VisibilityIcon/>}
            </IconButton>
        </InputAdornment>
    }

  return (
    <>
    { localStorage.getItem("token") ? <Navigate to="/" /> : 
    <main id='login-main'>
        <div id='loginPageDiv'>
            <ArrowBackIosIcon fontSize='large' id="backArrow"
                onClick={() => navigate(`/welcome`)}/>

            <div id="logo-container">
                <h1>BandTogether</h1>
                <img id="title-icon" src={note} alt="note" />
                <div id="title-underline"></div>
                <h2>Build relationships.<br/>Book shows.</h2>
            </div> 

            <form action="" className="form-wrapper" id='loginForm'>
                
                <div id='emailDiv'>
                    <TextField
                    required={true}
                    fullWidth={true}
                    type="text"
                    id="emailInput"
                    label="Email"
                    placeholder='Enter your email here.'
                    onChange={e => setEmail(e.target.value)}/>
                </div>

                <div id='passwordDiv'>
                    {/* <label htmlFor="passwordInput">Password:</label> */}
                    <TextField 
                    required={true}
                    fullWidth={true}
                    type ="password"
                    id="passwordInput"
                    label="Password"
                    placeholder="Enter your password here."
                    onChange={e => setPassword(e.target.value)}/> 
                </div>

                <div id="loginButtonDiv">
                    <button type="button" id='loginButton' 
                        onClick={handleLogin}
                    >Log In</button>
                </div>
            </form>
            <p className='splash-desc'>BandTogether is a networking platform for Vermont's local music scene.<br/>
            See you at the next show.</p>
        </div>
    </main>
    }
    </>
    
  )
}

export default Login