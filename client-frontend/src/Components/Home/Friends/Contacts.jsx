import React, { useEffect, useState } from 'react'
import './contacts.css'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function Contacts() {
    const [ contacts, setContacts ] = useState([]);

    useEffect(() => {
        try {
            const getData = async () => {
                const options = {
                    method: "GET",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGI4NGRlNTI4MTVkNmIzNjE5NzcwY2UiLCJpYXQiOjE2ODk5NTM0NTAsImV4cCI6MTY5MDAzOTg1MH0.jO_sbxGP3KbRzLR02vBX22o6PvWfSVrk6nEanf4S1us"
                    })
                }
    
                const res = await fetch("http://127.0.0.1:4000/user", options);
                const data = await res.json();
    
                setContacts(data.foundUser.friendList);
            }
    
            getData();
        } catch (err) {
            console.log(err);
        }
    }, []);

    return (
        <div id="contact-page">
            <div id="contact-header">
                <AddCircleOutlineIcon id="add-contact-btn" />
                <h1>Contacts</h1>
            </div>
            <div id="contact-list">
                { !contacts
                    ? <h1>Error while loading, please refresh</h1>
                    : contacts.map((contact, i) => {
                        return (
                            <div key={i} id="contact-item">
                                <AddCircleOutlineIcon id="contact-icon" />
                                <h3>{contact.bandName}</h3>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Contacts