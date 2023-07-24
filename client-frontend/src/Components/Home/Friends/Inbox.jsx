import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './inbox.css';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DriveFileRenameOutlineSharpIcon from '@mui/icons-material/DriveFileRenameOutlineSharp';
import { IconButton } from '@mui/material';

function Inbox() {
  const navigate = useNavigate();
  const [ contacts, setContacts ] = useState([]);
  const [ openForm, setOpenForm] = useState(false);
  const [ messages, setMessages ] = useState([]);

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
            onClick={null}
        >
          <DriveFileRenameOutlineSharpIcon htmlColor='#7E12B3' fontSize={"large"} />
        </IconButton>
        <h1>Inbox</h1>
      </div>
      { 
        Object.keys(messages).map((item, i) => {
          return (
          <div key={i} className="message-item">
            <ControlPointIcon />
            <div className="message-text" onClick={ e => openDirect(item) }>
              <div className='message-top'>
                <h3>{messages[item][0].sender._id === item ? messages[item][0].sender.bandName : messages[item][0].receiver.bandName}</h3>
                <h3>{getDate(messages[item][0].createdAt)}</h3>
              </div>
              <p>{messages[item][0].body}</p>
            </div>
          </div>
          )
        })
      }
    </div>
  )
}

export default Inbox