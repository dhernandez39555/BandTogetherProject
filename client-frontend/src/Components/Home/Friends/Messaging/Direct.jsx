import React, { useEffect, useState, useRef } from 'react';
import './direct.css';
import { useParams, Link } from 'react-router-dom';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { IconButton, TextField } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

function Direct() {

  const { otherUser_id } = useParams();
  const [ directs, setDirects ] = useState([]);
  const prevDate = useRef(new Date("January 1, 1970"));
  const messageInput = useRef("");
  const [ message, setMessage ] = useState("");
  const [ picture, setPicture ] = useState("");

  useEffect(() => {
    const options = {
      headers: new Headers({
        "Content-Type": "application/json",
        "authorization": localStorage.getItem("token")
      })
    }
    fetch(`http://127.0.0.1:4000/message/readAllFrom/${otherUser_id}`, options)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setDirects(data)
      })
      .catch(err => err.message)
  }, [])

  const sendMessage = () => {
    if (!(message !== "" || picture !== "")) return;
    const options = {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "authorization": localStorage.getItem("token")
      }),
      body: JSON.stringify({ body: message === "" ? picture : message })
    }

    fetch(`http://127.0.0.1:4000/message/makePostTo/${otherUser_id}`, options)
      .then(res => res.json())
      .then(data => {
        console.log(data.newMessage)
        setDirects([...directs, data.newMessage])})
      .catch(err => err.message)
    
    setMessage("");
    setPicture("");
    prevDate.current = new Date("January 1, 1970");
  }

  const addDateLine = (date) => {
    const newDate = dayjs(date).format("MM/DD/YYYY");
    return (<div key={date} className="datestamp"><div className="line"></div><p className="normal-text">{newDate}</p><div className="line"></div></div>)
  }

  const convertToBase64 = file => {
    return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
        resolve(fileReader.result)
    }
    fileReader.onerror = (error) => {
        reject(error) 
    }
    })
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setMessage("");
    setPicture(base64);
    prevDate.current = new Date("January 1, 1970");
  }

  const removeImg = () => {
    setPicture("");
    prevDate.current = new Date("January 1, 1970");
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
            { directs.map((direct, i) =>
              <div key={i}>
              { addDateLine(direct.createdAt ? direct.createdAt : new Date())}
              <div className="direct-item">
                
                <div className="direct-img-container">
                  <img src={direct.sender.profilePicture ? direct.sender.profilePicture : "/blank.png" } alt="profile pic" />
                </div>

                <div className="direct-text">
                  <div className="direct-top">
                    <h3>{direct.sender.bandName}</h3>
                    <p className="normal-text">{ direct.createdAt ? dayjs(direct.createdAt).format("h:m a") : null }</p>
                  </div>

                  { direct.body.split(":")[0] === "data"
                    && direct.body.split(":")[1].slice(0, 5) === "image"
                      ? <img src={direct.body} alt="message image" />
                      : <p className="normal-text">{direct.body}</p> }

                </div>
              </div>
            </div>
        )}</div>
      }
      <div id="footer-textbox">
        { picture !== ""
          ? <div id="direct-preview-photo">
              <img src={picture} alt="preview-photo" />
            </div>
          : null
        }
        <div id="footer-wrap">
          { picture !== ""
            ? <CloseIcon htmlColor='#7E12B3' onClick={e => removeImg()} fontSize={"large"} />
            : <label htmlFor="file-upload">
                <AttachFileIcon id="clip" htmlColor='#7E12B3' fontSize="large" />
              </label>
          }
          <input
            type="file"
            id="file-upload"
            name="file-upload"
            accept='.jpeg, .jpg, .png'
            onChange={(e) => handleFileUpload(e)}
          />
          <TextField
            disabled={picture !== ""}
            id="direct-input"
            ref={messageInput}
            label={picture !== "" ? "Send attactment" : "Write a message..." }
            variant="outlined"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={ e => e.key === "Enter" ? sendMessage() : null }
            fullWidth={true}
          ></TextField>
          <SendIcon onClick={e => sendMessage()} htmlColor='#7E12B3' fontSize="large" />
        </div>
      </div>
    </div>
  )
}

export default Direct