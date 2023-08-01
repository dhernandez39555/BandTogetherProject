import React, { useEffect, useState } from 'react'
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import PostAddIcon from '@mui/icons-material/PostAdd';

import "./Showfinder.css"

//TODO: Send messaging to its corresponding route and fix useEffect rendering to properly re-render fetchAllEvents

function Showfinder() {
  const navigate=useNavigate();

  const sessionToken=localStorage.getItem("token");
  const getUserId = () => {
    const sessionToken = localStorage.getItem('token');
    if (sessionToken) {
        try {
            const decodedToken = jwtDecode(sessionToken);
            // console.log(decodedToken._id)
            return decodedToken._id;
        } catch (error) {
            console.log(`error decoding`,error);
        }
    }
  
    return null;
  }
  //Below are triggers for rendering
  const [ openForm, setOpenForm ] = useState(false);
  //Below are for HTTP requests
  const [ isEdit, setIsEdit ] = useState(false);
  const [ allEvents, setAllEvents ] = useState("");
  const [ postBody, setPostBody ] = useState({
    title:"",
    body:"",
    eventDate:"",
    genre:"",
    user: "",
    location: "",
    latitude: 0,
    longitude: 0
  });

//Overall Render function
  const renderEvents=()=>{
    return allEvents.length === 0||!allEvents
      ? <p>Loading Events...</p>
      : <div className="event-post">
        { allEvents.map((result)=>(
          <div className="event-wrapper" key={result._id}>
            <div className="event-title">
              <h2 className='titleEach'>{result.title}</h2>
              <h4 className='dateEach'>{result.eventDate}</h4>
            </div>
            <div id='event-texts'>
              <h2 className='userEach'>{result.user.bandName}</h2>
              <h2 className="genreEach">{result.genre}</h2>
            </div>
            <p className='bodyEach'>{result.body}</p>
            <div className='options'>
            { result.user._id === getUserId()
              ? 
              <>
                <button className='editBtn' onClick={e=>{ setIsEdit(true); setOpenForm(!openForm); }}>Edit</button>
                <button className='deleteBtn' onClick={e=>{deleteEvent(result._id)}}>Delete</button>
              </>
              :
              <>
                <button className='profileBtn' onClick={e=>profileNav(result.user._id)}>Profile</button>
                <button className='messageBtn' onClick={e=>messageNav(result.user._id)}>Message</button>
              </>
            }
            </div>
          </div>
        ))}
      </div>
  }
  //External Nav functions  
  
  const profileNav = (_id) => {
    navigate(`/profile/${_id}`);
  }

  const messageNav = (_id) => {
    navigate(`/messaging/${_id}`);
  }
  
  //POST functions
  
  function fetchPostEvent(){
    const url = isEdit
      ? `http://localhost:4000/event/${getUserId()}`
      : "http://localhost:4000/event/";
    
    const options = {
      method: isEdit ? "PUT" : "POST",
      headers: new Headers({
        "Content-Type":"application/json",
        "authorization":sessionToken
      }),
      body:JSON.stringify(postBody)
    }

    fetch(url, options)
      .then(res=>res.json())
      .catch(err=>console.log(err));

    closePostForm();
  }

  const closePostForm=()=>{
    setOpenForm(false);
    setPostBody({
      title: "",
      body: "",
      eventDate: "",
      genre: "",
      user: "",
      location: ""
    })
  }

  //Shared PUT and POST functions
  const updatePostBody=(e)=>{
    const {name, value} = e.target;
    setPostBody(prevData => ({
      ...prevData,
      [name]: value
    }));
  }

  //need fx to check if event poster is current user
  //cndt'l off of above to render buttons 'edit'+'delete'
  //add functionality to bring up modal prompt for edit and prompt for deletion certainty
  
  //DELETE function
  const deleteEvent = () => {
    fetch(`http://localhost:4000/event/${getUserId()}`,{
      method:"DELETE",
      headers:new Headers({
        "Content-Type":"application/json",
        "authorization":sessionToken
      })
    })
    .then(res=>res.json())
    .catch(err=>console.log(err))
  }

  useEffect(()=>{
    fetch("http://localhost:4000/event/all", {
      method:"GET",
      headers:new Headers({
        "Content-Type":"application/json",
        "authorization":sessionToken
      })
    })
    .then(res => res.json())
    .then(data => setAllEvents(data))
    .catch(err => console.log(err))
  },[])

  return (
    <>
      <div id='event-page'>
        <PostAddIcon htmlColor="#7E12B3" fontSize="large" onClick={()=>setOpenForm(!openForm)} id='newEventBtn' />
        {!openForm
          ? null
          :
          <div id="post-form-wrapper">
            <div id="post-form">
              <TextField
                type="text"
                label="Event Title"
                value={ postBody.title }
                onChange={ e => updatePostBody(e) }
                placeholder='Event title'
              />
              <TextField
                type="text"
                label="Event Genre"
                value={ postBody.genre }
                onChange={ e => updatePostBody(e) }
                placeholder='Event genre'
              />
              <TextField
                type="text"
                label="Event Date"
                value={ postBody.eventDate }
                onChange={ e => updatePostBody(e) }
                placeholder='Event date'
              />
              <TextField
                type="text"
                label="Event Description"
                value={ postBody.body }
                onChange={ e => updatePostBody(e) }
                placeholder='Event description'
              />
              <TextField
                type="text"
                value={ postBody.location }
                onChange={ e => updatePostBody(e) }
                placeholder='Event Location'
              />
              <div id='selectBtns'>
                <button onClick={ e => fetchPostEvent() }>Submit</button>
                <button onClick={ e => closePostForm }>Cancel</button>
              </div>
            </div>
          </div>
          }
          {renderEvents()}
      </div>
    </>
  )
}

export default Showfinder
