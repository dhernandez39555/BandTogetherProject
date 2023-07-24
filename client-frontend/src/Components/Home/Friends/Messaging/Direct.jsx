import React, { useEffect, useState, useRef } from 'react';
import './direct.css';
import { useParams, Link } from 'react-router-dom';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { IconButton, TextField } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';

function Direct() {

  const { otherUser_id } = useParams();
  const [ directs, setDirects ] = useState([]);
  const prevDate = useRef(new Date("January 1, 1970"));
  const [ message, setMessage ] = useState("");

  useEffect(() => {
    const options = {
      headers: new Headers({
        "Content-Type": "application/json",
        "authorization": localStorage.getItem("token")
      })
    }

    fetch(`http://127.0.0.1:4000/message/readAllFrom/${otherUser_id}`, options)
      .then(res => res.json())
      .then(data => setDirects(data))
      .catch(err => err.message)
  }, [])

  const sendMessage = () => {
    const options = {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "authorization": localStorage.getItem("token")
      }),
      body: JSON.stringify({ body: message })
    }

    fetch(`http://127.0.0.1:4000/message/makePostTo/${otherUser_id}`, options)
      .then(res => res.json())
      .then(data => setDirects([...directs, data.newMessage]))
      .catch(err => err.message)
  }

  const getDate = (date, i) => {
    const newDate = new Date(date);
    if (prevDate.current.getDate() === newDate.getDate()) return null;
    const newDateStr = `${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`
    prevDate.current = newDate;
    return (<div id="datestamp"><div className="line"></div><p>{newDateStr}</p><div className="line"></div></div>)
  }

  const getTime = date => {
    const newDate = new Date(date);
    const isPM = newDate.getHours() > 12;
    const hours = isPM ? newDate.getHours() - 12 : newDate.getHours();
    return `${hours}:${newDate.getMinutes()}${isPM ? "pm" : "am" }`
  }
  
  return (
    <div id="direct-page">
      <div id="direct-header">
        <Link to="/inbox">
          <ArrowBackIosIcon
            id="direct-back-btn"
            htmlColor='#7E12B3'
            fontSize={"large"}
          />
        </Link>
        <MoreHorizIcon onClick={null} id="new-direct-btn" htmlColor='#7E12B3' fontSize={"large"} />
        <h1>{!directs[0] ? null : directs[0].sender._id === otherUser_id ? directs[0].sender.bandName : directs[0].receiver.bandName }</h1>
      </div>
      { !directs
        ? <h1>loading</h1>
        : directs.length === 0
        ? null
        : <div id="direct-list">
            {directs.map((direct, i) =>
            <>
            {getDate(direct.createdAt, i)}
            <div className="direct-item" key={i}>
              <ControlPointIcon />
              <div className="direct-text">
                <div className="direct-top">
                  <h3>{direct.sender.bandName}</h3>
                  <p>{getTime(direct.createdAt)}</p>
                </div>
                <p>{direct.body}</p>
              </div>
            </div>
            </>
        )}</div>
      }
      <div id="footer-textbox">
        <div id="footer-wrap">
          <AttachFileIcon id="clip" htmlColor='#7E12B3' fontSize="large" />
          <TextField
            id="direct-input"
            label="Write a message..."
            variant="outlined"
            onChange={e => setMessage(e.target.value)}
            onKeyDown={ e => e.key === "Enter" ? sendMessage() : null }
            fullWidth={true}
          ></TextField>
          <KeyboardVoiceOutlinedIcon htmlColor='#7E12B3' fontSize="large" />
        </div>
      </div>
    </div>
  )
}

export default Direct