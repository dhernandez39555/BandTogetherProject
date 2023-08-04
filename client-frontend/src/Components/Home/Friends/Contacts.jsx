import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './contacts.css';
import CloseIcon from '@mui/icons-material/Close';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { IconButton, TextField } from '@mui/material';

function Contacts() {
    const navigate = useNavigate();
    const allContacts = useRef([]);
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

        fetch("http://127.0.0.1:4000/user", options)
            .then(res => res.json())
            .then(data => {
                allContacts.current = data.foundUser.friendList;
                setFilteredContacts(allContacts.current)
            })
            .catch(err => console.log(err));
    }, []);

    const toogleForm = e => {
        setOpenForm(!openForm);
    }

    const addContact = () => {
        console.log(newContact);
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
                allContacts.current.push(data.newContact);
                setFilteredContacts([...data.newContact]);
                setOpenForm(false);
            })
            .catch(err => console.log(err.message));
    }

    const filterContacts = e => {
        setNewContact(e.target.value);
        const names = allContacts.current.map(b => b.bandName.toLowerCase());
        const filteredNames = names.filter(b => b.includes(e.target.value.toLowerCase()));
        const newNames = allContacts.current.filter(contact => filteredNames.includes(contact.bandName.toLowerCase()));
        setFilteredContacts(newNames);
    }

    const openProfile = otherUser_id => {
        navigate(`/profile/${otherUser_id}`);
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
                            <div key={i} onClick={e => openProfile(contact._id)} className="contact-item">
                                <div className="contact-img-container">
                                    <img src={contact.profilePicture ? contact.profilePicture : "/blank.png"} alt="profile-pic" />
                                </div>
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