import React, { useEffect, useState } from 'react'
import { Button, private_createTypography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { IconButton, TextField } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';



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

  const [fetchResult,setFetchResult]=useState("")
  const [count, setCount]=useState(0)
  const [postBox,setPostBox]=useState(false)
  const [postBody, setPostBody]=useState({
    title:"",
    body:"",
    eventDate:"",
    user:{
      bandName:"",
      genre:"",
      contactName:""
    },
    genre:""
  })
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
    .then(data=>{console.log(data);setFetchResult(data)})
    .catch(err=>console.log(err))
  }
  
  useEffect(()=>{
    fetchAllEvents()
  }, [count])

  const renderEvents=()=>{
    return fetchResult.length===0||!fetchResult
      ?<p>Loading Events...</p>
      : <div className="renderContainer">
        {fetchResult.allEvents.map((result)=>(
          <div className="eventWrapper" key={result._id}>
            <h2 className='titleEach'>Title: {result.title}</h2>
            <h4 className='userEach'>Band: {result.user.bandName}</h4>
            <h4 className="genreEach">Genre: {result.genre}</h4>
            <h5 className='bodyEach'>Body: {result.body}</h5>
            <h4 className='dateEach'>Date: {result.eventDate}</h4>
            <Button variant='contained' onClick={e=>profileNav(result.user._id)}>Profile</Button>
            <Button variant="contained" onClick={e=>messageNav(result.user._id)}>Message</Button>
          </div>
        ))}
      </div>
  }
  const profileNav=(_id)=>{
    navigate(`/profile/${_id}`)
  }
  //TODO: change below to go to specific message
  const messageNav=(_id)=>{
    navigate(`/messaging`)
  }

//POST functions
  const handlePost= async ()=>{
    fetchPostEvent();
    await setCount(prevCount=>prevCount+1)
  }

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
    setPostBody({
      title:"",
      eventDate:"",
      body:"",
    })
    closePostBox()
    setCount(prevCount=>prevCount+1)
  }
  const handleNewEvent=(e)=>{
    const {name, value} = e.target;
        setPostBody(prevData => ({
            ...prevData,
            [name]: value
        }));
  }
  const closePostBox=()=>{
    setPostBox(false)
    setPostBody({
      title:"",
      eventDate:"",
      body:""
    })
    setCount(prevCount=>prevCount+1)
  }

  
  return (
    <>
      <Button variant="contained" size='small' onClick={()=>setPostBox(true)}>Click Me!</Button>
      {!postBox
        ?null
        :<div>
          <input type="text" name="title" value={postBody.title} onChange={e=>handleNewEvent(e)} placeholder='Enter event title'/>
          <input type="text" name="body" value={postBody.body} onChange={e=>handleNewEvent(e)} placeholder='Enter event description'/>
          <input type="text" value={postBody.eventDate} name="eventDate" onChange={e=>handleNewEvent(e)} placeholder='Enter event date'/>
          <input type="text" value={postBody.genre} name="genre" onChange={e=>handleNewEvent(e)} placeholder='Enter event genre'/>
          <button onClick={e=>handlePost()}>Submit</button>
          <button onClick={closePostBox}>Cancel</button>
        </div>}
      {renderEvents()}
    </>
  )
}

export default Showfinder
