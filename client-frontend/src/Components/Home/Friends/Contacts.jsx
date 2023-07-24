import React, { useEffect, useState } from 'react';
import './contacts.css';
import CloseIcon from '@mui/icons-material/Close';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { IconButton, TextField } from '@mui/material';

function Contacts() {
    const [ contacts, setContacts ] = useState([]);
    const [ filteredContacts, setFilteredContacts ] = useState([]);
    const [ openForm, setOpenForm] = useState(false);

    const [ newContact, setNewContact ] = useState("");

    useEffect(() => {
        const options = {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                "authorization": localStorage.getItem("token")
            })
        }

        console.log("fetched");

        fetch("http://127.0.0.1:4000/user", options)
            .then(res => res.json())
            .then(data => {
                setContacts(data.foundUser.friendList)
                setFilteredContacts(data.foundUser.friendList)
            })
            .catch(err => console.log(err));
    }, []);

    const toogleForm = e => {
        setOpenForm(!openForm);
    }

    const addContact = () => {
        const options = {
            method: "PUT",
            headers: new Headers({
                "Content-Type": "application/json",
                "authorization": localStorage.getItem("token")
            }),
            body: JSON.stringify({ email: newContact })
        }
        fetch("http://127.0.0.1:4000/user/addcontact", options)
            .then(res => res.json())
            .then(data => {
                if (data.error) throw Error (data.error);
                console.log(data.newContact);
                setContacts([...contacts, data.newContact]);
                setFilteredContacts([...contacts, data.newContact]);
                setOpenForm(false);
            })
            .then(console.log(filteredContacts))
            .catch(err => console.log(err.message));
    }

    const filterContacts = e => {
        setNewContact(e.target.value);
        const names = contacts.map(b => b.bandName.toLowerCase());
        const filteredNames = names.filter(b => b.includes(e.target.value.toLowerCase()));
        const newNames = contacts.filter(contact => filteredNames.includes(contact.bandName.toLowerCase()));
        setFilteredContacts(newNames);
    }

    return (
        <div id="contact-page">
            <div id="contact-header">
                <IconButton
                    id="open-form-btn"
                    onClick={toogleForm}
                >
                    { openForm ? <CloseIcon fontSize={"large"} /> : <ControlPointIcon fontSize={"large"} />}
                </IconButton>
                <h1>Contacts</h1>
            </div>
            { openForm 
                ? <div id="contact-form">
                    <div id="contact-form-wrap">
                        <TextField
                            size="normal"
                            fullWidth={true}
                            autoFocus={true}
                            variant="outlined"
                            type={"email"}
                            label="search or add email"
                            onChange={filterContacts}
                        />
                        <IconButton
                            id="add-contact-btn"
                            onClick={addContact}
                        >
                            <ControlPointIcon fontSize={"large"} />
                        </IconButton>
                    </div>
                </div> : null }
            <div id="contact-list">
                { !filteredContacts
                    ? <h1>Error while loading, please refresh</h1>
                    : filteredContacts.map((contact, i) => {
                        return (
                            <div key={i} className="contact-item">
                                <ControlPointIcon id="contact-icon" />
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