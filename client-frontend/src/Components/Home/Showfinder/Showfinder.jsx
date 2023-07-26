import React, { useEffect, useState } from 'react'
import { Button, private_createTypography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { IconButton, TextField } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

//TODO: Send messaging to its corresponding route and fix useEffect rendering to properly re-render fetchAllEvents

function Showfinder() {

  const navigate=useNavigate()

  const sessionToken=localStorage.getItem("token")
  const getUserId = () => {
    const sessionToken = localStorage.getItem('token');
    if (sessionToken) {
        try {
            const decodedToken = jwtDecode(sessionToken)
            // console.log(decodedToken._id)
            return decodedToken._id 
        } catch (error) {
            console.log(`error decoding`,error)
        }
    }
  
    return null;
  }
  //Below are triggers for rendering
  const [showModal, setShowModal] = useState(false);
  const [postBox,setPostBox]=useState(false)
  //Below are for HTTP requests
  const [idUrl,setIdUrl]=useState("")
  const [fetchResult,setFetchResult]=useState("")
  const [postBody, setPostBody]=useState({
    title:"",
    body:"",
    eventDate:"",
    genre:"",
    user:{
      bandName:""
    }
  })

//Overall Render function
  const renderEvents=()=>{
    return fetchResult.length===0||!fetchResult
      ?<p>Loading Events...</p>
      : <div className="renderContainer">
        {fetchResult.map((result)=>(
          <div className="eventWrapper" key={result._id}>
            <h2 className='titleEach'>{result.title}</h2>
            <h4 className='userEach'>{result.user.bandName}</h4>
            <h4 className="genreEach">{result.genre}</h4>
            <h5 className='bodyEach'>{result.body}</h5>
            <h4 className='dateEach'>{result.eventDate}</h4>
            {result.user._id===getUserId()
              ?<div className='options'>
                <button className='editBtn' onClick={e=>{setIdUrl(result._id);openModal()}}>Edit</button>
                <button className='deleteBtn' onClick={e=>{setIdUrl(result._id);deleteEvent(result._id)}}>Delete</button>
              </div>
              :<div className='externalNav'>
                <button className='profileBtn' onClick={e=>profileNav(result.user._id)}>Profile</button>
                <button className='messageBtn' onClick={e=>messageNav(result.user._id)}>Message</button>
              </div>}
          </div>
        ))}
      </div>
  }
  //GET+Render functions
  function fetchAllEvents(){
    fetch("http://localhost:4000/event/all",{
      method:"GET",
      headers:new Headers({
        "Content-Type":"application/json",
        "authorization":sessionToken
      })
    })
    .then(res=>res.json())
    .then(data=>setFetchResult(data))
    .catch(err=>console.log(err))
  }
  
  
  const profileNav=(_id)=>{
    navigate(`/profile/${_id}`)
  }
  //TODO: change below to go to specific message
  const messageNav=(_id)=>{
    navigate(`/messaging/${_id}`)
  }
  
  //POST functions
  
  function fetchPostEvent(){
    fetch("http://localhost:4000/event/",{
      method:"POST",
      headers: new Headers({
        "Content-Type":"application/json",
        "authorization":sessionToken
      }),
      body: JSON.stringify(postBody)
    })
    .then(res=>res.json())
    .catch(err=>console.log(err))
    closePostBox()
  }
  const closePostBox=()=>{
    setPostBox(false)
    setPostBody({
      title:"",
      body:"",
      eventDate:"",
      genre:"",
      user:{
        bandName:""
      }
    })
  }
  //Shared PUT and POST functions
  const handleNewEvent=(e)=>{
    const {name, value} = e.target;
    setPostBody(prevData => ({
      ...prevData,
      [name]: value
    }));
  }
  
  //PUT functions
  
  const handleUpdate= async()=>{
    updateEvent()
    closeModal()
  }
  const updateEvent=()=>{
    try{
      fetch(`http://localhost:4000/event/${idUrl}`,{
        method:"PUT",
        body:JSON.stringify(postBody),
        headers: new Headers({
          "Content-Type":"application/json",
          "authorization":sessionToken
        })
      })
      .then (res=>res.json())
      .catch(err=>console.log(err))
    } catch(err){
      console.log(err)
    }
    setIdUrl("")
  }
  //need fx to check if event poster is current user
  //cndt'l off of above to render buttons 'edit'+'delete'
  //add functionality to bring up modal prompt for edit and prompt for deletion certainty
  
  //DELETE functions
  
  const deleteEvent=(id)=>{
    fetch(`http://localhost:4000/event/${id}`,{
      method:"DELETE",
      headers:new Headers({
        "Content-Type":"application/json",
        "authorization":sessionToken
      })
    })
    .then(res=>res.json())
    .catch(err=>console.log(err))
    setIdUrl("")
  }
  
  //PUT+DELETE functions
  const closeModal=()=>{
    setPostBody({
      title:"",
      body:"",
      eventDate:"",
      genre:"",
      user:{
        bandName:""
      }
    })
    setShowModal(false)
  }
  const openModal=()=>{
    setShowModal(true)
  }
  //!UseEffect -> not re-rendering after second render
  useEffect(()=>{
      fetchAllEvents()
  })
  //RETURN
  return (
    <>
      <button onClick={()=>setPostBox(!postBox)}>Add an event!</button>
      {!postBox
        ?null
        :<div>
          <input type="text" name="title" value={postBody.title} onChange={e=>handleNewEvent(e)} placeholder='Enter event title'/>
          <input type="text" name="body" value={postBody.body} onChange={e=>handleNewEvent(e)} placeholder='Enter event description'/>
          <input type="text" value={postBody.eventDate} name="eventDate" onChange={e=>handleNewEvent(e)} placeholder='Enter event date'/>
          <input type="text" value={postBody.genre} name="genre" onChange={e=>handleNewEvent(e)} placeholder='Enter event genre'/>
          <button onClick={e=>{fetchPostEvent()}}>Submit</button>
          <button onClick={closePostBox}>Cancel</button>
        </div>}
      {showModal
        ?<div className='modal'>
          <input type="text" name="title" value={postBody.title} onChange={e=>handleNewEvent(e)} placeholder='Enter new event title'/>
          <input type="text" name="body" value={postBody.body} onChange={e=>handleNewEvent(e)} placeholder='Enter new event description'/>
          <input type="text" value={postBody.eventDate} name="eventDate" onChange={e=>handleNewEvent(e)} placeholder='Enter new event date'/>
          <input type="text" value={postBody.genre} name="genre" onChange={e=>handleNewEvent(e)} placeholder='Enter new event genre'/>
          <button onClick={e=>handleUpdate()}>Submit</button>
          <button onClick={e=>closeModal()}>Cancel</button>
        </div>
        :null
      }
      {renderEvents()}
    </>
  )
}

export default Showfinder
