import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material';


function Showfinder() {

  const [fetchResult,setFetchResult]=useState("")
  const [flag, setFlag]=useState(false)
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
        "Content-Type":"application/json"
      })
    })
    .then(res=>res.json())
    .then(data=>setFetchResult(data))
    .catch(err=>console.log(err))
  }

  useEffect(()=>{
    fetchAllEvents()
  }, [flag])

  const renderEvents=()=>{
    return fetchResult.length===0||!fetchResult
      ?<p>No Events Found</p>
      : <div className="renderContainer">
        {fetchResult.allEvents.map((result)=>(
          <div className="eventWrapper" key={result._id}>
            <h3 className='titleEach'>{result.title}</h3>
            <h4 className='dateEach'>{result.eventDate}</h4>
            <h5 className='bodyEach'>{result.body}</h5>
          </div>
        ))}
      </div>
  }

//POST TIME
  const fetchPostEvent=()=>{
    fetch("http://localhost:4000/event/",{
      method:"POST",
      body:JSON.stringify(postBody),
      headers:new Headers({
        "Content-Type":"application/json"
      })
    })
    .then(res=>res.json())
    .then(data=>setFetchResult(data))
    .catch(err=>console.log(err))
    setPostBody({
      title:"",
      eventDate:"",
      body:""
    })
    setFlag("post")
    closePostBox()
  }
  const closePostBox=()=>{
    setPostBox(false)
    setPostBody({
      title:"",
      eventDate:"",
      body:""
    })
  }

  return (
    <>
      <Button variant="contained" onClick={()=>setPostBox(true)}>Click Me!</Button>
      {!postBox
        ?null
        :<form>
          <input type="text" value={postBody.title} onChange={e=>setPostBody(e.target.value)} placeholder='Enter event title'/>
          <input type="text" value={postBody.body} onChange={e=>setPostBody(e.target.value)} placeholder='Enter event description'/>
          <input type="text" value={postBody.eventDate} onChange={e=>setPostBody(e.target.value)} placeholder='Enter event date'/>
          <button onClick={fetchPostEvent}>Submit</button>
          <button onClick={closePostBox}>Cancel</button>
        </form>}
      {renderEvents()}
    </>
  )
}

export default Showfinder