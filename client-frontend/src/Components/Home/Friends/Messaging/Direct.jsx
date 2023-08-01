import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import './direct.css';
import { useParams, Link, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode' 
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { IconButton, TextField, menuClasses } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';


function Direct() {

  const [ directs, setDirects ] = useState([]);
  const prevDate = useRef(new Date("January 1, 1970"));
  const messageInput = useRef("");
  const [ message, setMessage ] = useState("");
  const [ picture, setPicture ] = useState("");
  const [ socket, setSocket ] = useState(null);
  const messageContainerRef = useRef(null)
  const lastMessageRef = useRef(null);
  const { otherUser_id } = useParams();
  
  
  const sessionToken = localStorage.getItem('token');
  
  const getUserId = () => {
    try {
      const decodedToken = jwtDecode(sessionToken)
      return decodedToken._id 
    } catch (error) {
      console.log(`error decoding`,error)
    }
  }
  
  const loggedInUserId = getUserId();
  

    //function to scroll the message container to bottom
    useEffect(() => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }, [directs])

    

  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:8000?user-id=${loggedInUserId}&receiver-id=${otherUser_id}`)
    ws.onopen = () => {
      console.log('WS connected with other user')
      setSocket(ws)
    };
    ws.onerror = (err) => {
      console.log('WS error', err)
    }
    return () => {
      if(socket) {
      socket.close();
      }
    }
  },[])

  const showNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('New Message', {
        body: 'New Message in BandTogether!',
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('New Message', {
            body: 'New Message in BandTogether!',
          });
        }
      });
    }
  };

  const addNewMessage = (message) => {
    setDirects((prevDirects) => [...prevDirects,message])

  }
  useEffect(() => {
    const handleReceiveMessage = e => {
      console.log('function handleReceivedMessage')
      const receivedMessage = JSON.parse(e.data);
      console.log('recivedMessage:', receivedMessage)
      const newMessage = {
        body: receivedMessage,
        createdAt: new Date().toISOString(),
        sender: {
          bandName: 'bandName',
          profilePicture: 'profile picture'
        }
      }
      
      addNewMessage(newMessage)
      showNotification();
    }

    if(socket) {
      socket.addEventListener('message', handleReceiveMessage)
      console.log('socket event listener added')
    }

    return () => {
      if(socket) {
        socket.removeEventListener('message', handleReceiveMessage)
      }
    }
  }, [socket])
  

  const sendingMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify( message ));
      console.log('socket open when sending:', message)
    }
  }


  useEffect(() => {
    const options = {
      headers: new Headers({
        "Content-Type": "application/json",
        "authorization": localStorage.getItem("token")
      })
    }
    console.log("before");
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
    prevDate.current = new Date("January 1, 1970");
  }

  const getDate = (date) => {
    const newDate = new Date(date);
    if (prevDate.current.getDate() === newDate.getDate()) return null;
    const newDateStr = `${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`
    prevDate.current = newDate;
    return (<div key={date} className="datestamp"><div className="line"></div><p>{newDateStr}</p><div className="line"></div></div>)
  }

  const getTime = date => {
    const newDate = new Date(date);
    const militaryHour = newDate.getHours()
    const hours = militaryHour < 12 ? militaryHour + 1 : (militaryHour % 12) || 12;
    const minutes = newDate.getMinutes();
    const amOrPm = militaryHour >= 12 ? 'pm' : 'am';
    return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}${amOrPm}`
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
        : <div id="direct-list" ref={messageContainerRef}>
            {directs.map((direct, i) =>
            <>
            { direct.createdAt
              ? getDate(direct.createdAt)
              : <div className="datestamp" key={i}><div className="line"></div><p>new conversation</p><div className="line"></div></div>}
            <div className="direct-item" 
            key={i}
            ref={i === directs.length - 1 ? lastMessageRef : null}>
              <div className="direct-img-container">
              {direct.sender && direct.sender.profilePicture
                ? <img src={direct.sender.profilePicture} alt="profile pic" />
                : <img src="/blank.png" alt="default profile pic" />
              }
              </div>
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