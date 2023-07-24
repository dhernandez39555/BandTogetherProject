import React, { useEffect, useState } from 'react'
import './inbox.css'
import ControlPointIcon from '@mui/icons-material/ControlPoint';

function Inbox() {
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

  return (
    <div id="message-list">
      { 
        Object.keys(messages).map((item, i) => {
          return (
          <div key={i} className="message-item">
            <ControlPointIcon />
            <div className="message-text">
              <h3>{messages[item][0].sender === item ? messages[item][0].sender.bandName : messages[item][0].receiver.bandName}</h3>
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