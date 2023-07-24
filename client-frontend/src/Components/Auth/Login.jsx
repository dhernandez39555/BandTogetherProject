import React, { useState } from 'react'
import { Navigate } from 'react-router-dom' 

function Login({ updateLocalStorage }) {

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

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
            updateLocalStorage(data.token) 
        })
        .catch(err => console.log(err));

    }

  return (
    <>
    { localStorage.getItem("token") ? <Navigate to="/" /> : 

        <div>
        <h1>BandTogether</h1>
        <h2>Build relationships.</h2>
        <h2>Book shows.</h2>
        <form action="" className="form-wrapper">
            <div id='emailDiv'>
                <label htmlFor="emailInput">Email:</label>
                <input type="text" id="emailInput" placeholder="Enter your email here."
                    onChange={e => setEmail(e.target.value)}/>
            </div>
            <div id='passwordDiv'>
                <label htmlFor="passwordInput">Password:</label>
                <input type="password" id="passwordInput" placeholder="Enter your password here."
                    onChange={e => setPassword(e.target.value)}/>
            </div>
            <button type="button" id='loginButton' 
                onClick={handleLogin}
            >Log In</button>
        </form>
        <p>BandTogether is a networking platform for Vermont's local music scene.</p>
        <p>See you at the next show.</p>
    </div>
    }
    </>
    
  )
}

export default Login