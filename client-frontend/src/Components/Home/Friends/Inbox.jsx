import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './inbox.css';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import CloseIcon from '@mui/icons-material/Close';
import DriveFileRenameOutlineSharpIcon from '@mui/icons-material/DriveFileRenameOutlineSharp';
import { IconButton, TextField } from '@mui/material';

function Inbox() {
  const navigate = useNavigate();
  const textRef = useRef();
  const [ openForm, setOpenForm] = useState(false);
  const [ messages, setMessages ] = useState([]);
  const [ newEmail, setNewEmail ] = useState("");

  useEffect(() => {
    const options = {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        "authorization": localStorage.getItem("token")
      })
    }

    fetch("http://127.0.0.1:4000/message/all", options)
      .then(res => res.json())
      .then(data => setMessages(data.sortedMessages))
      .catch(err => err.message);
  }, []);

  const toogleForm = e => {
    setOpenForm(!openForm);
    if (openForm)textRef.value = "";
  }

  const addNewEmail = () => {
    const options = {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        "authorization": localStorage.getItem("token")
      })
    }

    fetch(`http://127.0.0.1:4000/user/checkEmail/${newEmail}`, options)
      .then(res => res.json())
      .then(data => {
        if (data.error) navigate("/invite")
        else navigate(`/messaging/${data.foundUser_id._id}`)
      })
      .catch(err => err.message);
  }

  const openDirect = otherUser_id => {
    navigate(`/messaging/${otherUser_id}`);
  }

  const getDate = date => {
    const newDate = new Date(date);
    return `${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`
  }

  return (
    <div id="inbox-page">
      <div id="message-header">
        <IconButton
            id="new-message-btn"
            onClick={toogleForm}
        >
          { openForm ? <CloseIcon htmlColor='#7E12B3' fontSize={"large"} /> : <DriveFileRenameOutlineSharpIcon htmlColor='#7E12B3' fontSize={"large"} /> }
        </IconButton>
        <h1>Inbox</h1>
      </div>
      { openForm 
          ? <div id="message-form">
              <div id="message-form-wrap">
                  <TextField
                      ref={textRef}
                      size="normal"
                      fullWidth={true}
                      autoFocus={true}
                      variant="outlined"
                      type={"email"}
                      label="new email"
                      onChange={e => setNewEmail(e.target.value)}
                  />
                  <IconButton
                      id="go-direct-btn"
                      onClick={addNewEmail}
                  >
                      <ControlPointIcon fontSize={"large"} />
                  </IconButton>
              </div>
          </div> : null }
      { 
        Object.keys(messages).map((item, i) => {
          return (
          <div key={i} className="message-item">
            <div className="message-img-container">
              <img src={messages[item][0].sender._id === item ? messages[item][0].sender.profilePicture || "/blank.png" : messages[item][0].receiver.profilePicture || "/blank.png" } alt="profile pic" />
            </div>
            <div className="message-text" onClick={ e => openDirect(item) }>
              <div className='message-top'>
                <h3>{messages[item][0].sender._id === item ? messages[item][0].sender.bandName : messages[item][0].receiver.bandName}</h3>
                <h3>{getDate(messages[item][0].createdAt)}</h3>
              </div>
              <p>{messages[item][0].body.split(":")[0] === "data" && messages[item][0].body.split(":")[1].slice(0, 5) === "image"
                  ? "image" : messages[item][0].body
              }</p>
            </div>
          </div>
          )
        })
      }
    </div>
  )
}

export default Inbox