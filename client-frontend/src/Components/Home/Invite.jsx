import React, { useState } from 'react'
import './Invite.css'
import { TextField } from '@mui/material';



function Invite() {

    const [ email, setEmail ] = useState('')
    const [ message, setMessage ] = useState('')

    const handleEmail = e => {
        setEmail(e.target.value)
    }

    const handleMessage = e => {
        setMessage(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault();
        const requestBody = {
            to: email,
            text: message,
        };
        fetch('http://127.0.0.1:4000/email/send-email', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(requestBody),
        })
        .then((res) => {
            console.log('Response status:', res.status);
            console.log('Response headers:', res.headers);
            return res.json();
        })
        .then((data) => {
            console.log('data response', data);
            alert("Email sent to your fellow musician")
        })
        .catch((error) => {
            console.log(`error`,error)
        })
    }
return (
    <div id='invite-component'>
        <h1 id='invite-banner'>Invite a Friend</h1>
        <form id='email-form' onSubmit={handleSubmit}>
            
                <TextField 
                id='email-text'
                label='Enter Friends Email'
                required={true}
                fullWidth={true}
                type="email" 
                value={email} 
                onChange={handleEmail} 
                placeholder='Enter friends email address here'/>

            <div id='invite-spacer'></div>

                <TextField
                
                className='email-message-invite'
                label='Enter Message'
                multiline
                rows={10}
                maxRows={Infinity}
                fullWidth={true}
                type="text" 
                value={message} 
                onChange={handleMessage} 
                placeholder='Enter Message Here'
                />

            <div id='invite-spacer'></div>
        <div id='button-parent'>
            <button id='invite-button' type='submit'>Send</button>
        </div>
        </form>
    </div>
)
}

export default Invite