import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { IconButton, TextField } from '@mui/material';



function Showfinder() {

  const sessionToken=localStorage.getItem("token")
  const [fetchResult,setFetchResult]=useState("")
  const [count, setCount]=useState(0)
  const [postBox,setPostBox]=useState(false)
  const [postBody, setPostBody]=useState({
    title:"",
    body:"",
    eventDate:""
  })
  //GET functionality
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
  
  useEffect(()=>{
    fetchAllEvents()
    console.log(count)
  }, [count])

  const renderEvents=()=>{
    return fetchResult.length===0||!fetchResult
      ?<p>No Events Found</p>
      : <div className="renderContainer">
        {fetchResult.allEvents.map((result)=>(
          <div className="eventWrapper" key={result._id}>
            <h3 className='titleEach'>{result.title}</h3>
            <h3 className='userEach'>{result.user?result.user.bandName:"User is null or undefined"}</h3>
            <h4 className='dateEach'>{result.eventDate}</h4>
            <h5 className='bodyEach'>{result.body}</h5>
          </div>
        ))}
      </div>
  }

//POST TIME
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
    setCount(prevCount=> prevCount+1)
    closePostBox()
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
    setCount(prevCount=> prevCount+1)
  }
//"eqeqeqeqeqe"
  return (
    <>
      <Button variant="contained" onClick={()=>setPostBox(true)}>Click Me!</Button>
      {!postBox
        ?null
        :<div>
          <input type="text" name="title" value={postBody.title} onChange={e=>handleNewEvent(e)} placeholder='Enter event title'/>
          <input type="text" name="body" value={postBody.body} onChange={e=>handleNewEvent(e)} placeholder='Enter event description'/>
          <input type="text" value={postBody.eventDate} name="eventDate" onChange={e=>handleNewEvent(e)} placeholder='Enter event date'/>
          <button onClick={fetchPostEvent}>Submit</button>
          <button onClick={closePostBox}>Cancel</button>
        </div>}
      {renderEvents()}
    </>
  )
}

export default Showfinder
