import React, { useEffect, useState } from 'react'
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ShowMap from './ShowMap';

import "./Showfinder.css"
import LocationPicker from './LocationPicker';

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
  const [ location, _setLocation ] = useState({ lat: 49.1081214, lng: -70.1413931 });
  const [ openForm, setOpenForm ] = useState(false);
  const [ isMap, setIsMap ] = useState(false);
  //Below are for HTTP requests
  const [ isEdit, setIsEdit ] = useState(false);
  const [ allEvents, setAllEvents ] = useState("");
  const [ filterEvents, setFilterEvents ] = useState("");
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

  const setLocation = (newLocation) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${newLocation.lat}&lon=${newLocation.lng}&format=json`

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
          const { city, country, state } = data.address;
          const formatLocation = `${city}, ${state}, ${country}` 
          setPostBody(prevData => ({
            ...prevData,
            location: formatLocation,
            latitude: newLocation.lat,
            longitude: newLocation.lng
          }))
      })
      .catch((err) => {
          console.log("Error location cannot be found", err);
      })

    _setLocation(newLocation);
  }

  // Overall Render function
  const renderEvents=()=>{
    return filterEvents.length === 0 || !filterEvents
      ? <p>Loading Events...</p>
      : <div className="event-post">
        { filterEvents.map((event)=>(
          <div className="event-wrapper" key={event._id}>
            <div className="event-title">
              <h2 className='titleEach'>{event.title}</h2>
              <h4 className='dateEach'>{event.eventDate}</h4>
            </div>
            <div id='event-texts'>
              <h2 className='userEach'>{event.user.bandName}</h2>
              <h2 className="genreEach">{event.genre}</h2>
            </div>
            <p className='bodyEach'>{event.body}</p>
            <div className='options'>
            { event.user._id === getUserId()
              ? 
              <>
                <button className='editBtn' onClick={e => { setIsEdit(true); setupPostForm(event); }}>Edit</button>
                <button className='deleteBtn' onClick={e=>{deleteEvent(event._id)}}>Delete</button>
              </>
              :
              <>
                <button className='profileBtn' onClick={e=>profileNav(event.user._id)}>Profile</button>
                <button className='messageBtn' onClick={e=>messageNav(event.user._id)}>Message</button>
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
  
  function createNewEvent(){
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

    closePostForm()();
  }

  const setupPostForm = (event) => {
    setPostBody({
      title: isEdit ? event.title : "",
      body: isEdit ? event.body : "",
      eventDate: isEdit ? event.eventDate : "",
      genre: isEdit ? event.genre : "",
      user: isEdit ? event.user : "",
      location:  isEdit ? event.location : ""
    })
  }

  const closePostForm=()=>{
    setIsEdit(false);
    setOpenForm(false);
    setPostBody({
      title: "",
      body: "",
      eventDate: "",
      genre: "",
      user: "",
      location: "",
      latitude: "",
      longitude: ""
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
    .then(data => {
      setAllEvents(data);
      setFilterEvents(data);
    })
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
                name="title"
                label="Event Title"
                value={ postBody.title }
                onChange={ e => updatePostBody(e) }
                placeholder='Event title'
              />
              <TextField
                type="text"
                name="genre"
                label="Event Genre"
                value={ postBody.genre }
                onChange={ e => updatePostBody(e) }
                placeholder='Event genre'
              />
              <TextField
                type="text"
                name="eventDate"
                label="Event Date"
                value={ postBody.eventDate }
                onChange={ e => updatePostBody(e) }
                placeholder='Event date'
              />
              <TextField
                type="text"
                name="body"
                label="Event Description"
                value={ postBody.body }
                onChange={ e => updatePostBody(e) }
                placeholder='Event description'
              />
              <TextField
                type="text"
                name="location"
                label="Event Location"
                value={ postBody.location }
                onClick={ e => setIsMap(true) }
                disabled={ isMap }
                onChange={ e => updatePostBody(e) }
                placeholder='Event Location'
              />
              { isMap ?
                <>
                <button onClick={e => setIsMap(false)}>Done</button>
                <LocationPicker
                  location={ location }
                  setLocation={ setLocation }
                />
                </>
                : null
              }
              <div id='selectBtns'>
                <button onClick={ e => createNewEvent() }>Submit</button>
                <button onClick={ e => closePostForm() }>Cancel</button>
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
