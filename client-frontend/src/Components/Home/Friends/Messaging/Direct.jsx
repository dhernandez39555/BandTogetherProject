import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import './direct.css';
import { useParams, Link } from 'react-router-dom';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { IconButton, TextField, menuClasses } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

function Direct() {

  const { otherUser_id } = useParams();
  const [ directs, setDirects ] = useState([]);
  const prevDate = useRef(new Date("January 1, 1970"));
  const messageInput = useRef("");
  const [ message, setMessage ] = useState("");
  const [ picture, setPicture ] = useState("");
  const [ socket, setSocket ] = useState(null);
  const messageContainerRef = useRef(null)

  //function to scroll the message container to bottom
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo(0, messageContainerRef.current.scrollHeight)
    }
  }

  //calls the scroll to bottom function when page loads
  useLayoutEffect(() => {
    scrollToBottom();
  },[])

  useLayoutEffect(() => {
    scrollToBottom()
  },[directs])

  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:8000')
    setSocket(ws)
    return () => {
      ws.close();
    }
  },[])

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  },[])


  useEffect(() => {
    const handleReceiveMessage = e => {
      const receivedMessage = JSON.parse(e.data);
      setDirects((prevDirects) => [...prevDirects,receivedMessage])

      if(Notification.permission === 'granted') {
        const notification = new Notification('New Message', {
          body: 'New Message in BandTogether!'
        })
          notification.onclick = () => {
            // todo: do something 
          }
      }
    }

    if(socket) {
      socket.addEventListener('message', handleReceiveMessage)
    }

    return () => {
      if(socket) {
        socket.removeEventListener('message', handleReceiveMessage)
      }
    }
  }, [socket])
  

  const sendingMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ message }));
    }
  }


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
        //todo see if this works 
        scrollToBottom();
        //todo-----------------
      })
      .catch(err => err.message)
  }, [])

  useEffect(() => {
    prevDate.current = new Date("January 1, 1970");
  }, [directs] )

  const sendMessage = () => {
    if (!(message !== "" || picture !== "")) return;
      const messageToSend = message === "" ? picture : message;
      sendingMessage(messageToSend)
      setMessage("")
      setPicture("")

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
  }

  const getDate = (date) => {
    const newDate = new Date(date);
    if (prevDate.current.getDate() === newDate.getDate()) return null;
    const newDateStr = `${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`
    prevDate.current = newDate;
    return (<div className="datestamp"><div className="line"></div><p>{newDateStr}</p><div className="line"></div></div>)
  }

  const getTime = date => {
    const newDate = new Date(date);
    const isPM = newDate.getHours() > 12;
    const hours = isPM ? newDate.getHours() - 12 : newDate.getHours();
    return `${hours}:${newDate.getMinutes()}${isPM ? "pm" : "am" }`
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
  }

  const removeImg = () => {
    setPicture("");
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
        : <div id="direct-list" ref={messageContainerRef}>
            {directs.map((direct, i) =>
            <>
            { direct.createdAt
              ? getDate(direct.createdAt)
              : <div className="datestamp" key={i}><div className="line"></div><p>new conversation</p><div className="line"></div></div>}
            <div className="direct-item" key={i}>
              <img src={direct.sender.profilePicture ? direct.sender.profilePicture : "/blank.png" } alt="profile pic" />
              <div className="direct-text">
                <div className="direct-top">
                  <h3>{direct.sender.bandName}</h3>
                  <p>{ direct.createdAt ? getTime(direct.createdAt) : null }</p>
                </div>
                { direct.body.split(":")[0] === "data" && direct.body.split(":")[1].slice(0, 5) === "image"
                    ? <img src={direct.body} alt="message image" />
                    : <p>{direct.body}</p> }
              </div>
            </div>
            </>
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