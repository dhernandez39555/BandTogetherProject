import React, { useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function News() {
  //TODO need GET -x-, POST, PUT, DELETE, Rendering

  const sessionToken=localStorage.getItem('token')
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

  const navigate=useNavigate()
  const [idUrl,setIdUrl]=useState("")
  const [fetchResult,setFetchResult]=useState("")

  const renderResult=()=>{
    return fetchResult.length===0||!fetchResult
      ?<p>Loading Posts...</p>
      :<div className='renderContainer'>
        {fetchResult.map((result)=>(
          <div className="eventWrapper" key={result._id}>
            <h2>{result.title}</h2>
            <h4>{result.user.bandName}</h4>
            <h5>{result.body}</h5>
            {result.user._id===getUserId()
              ?<div className='options'>
                <button className='editBtn' onClick={e=>{setIdUrl(result._id);console.log("make edit box and fetch real again")}}>Edit</button>
                <button className='deleteBtn' onClick={e=>{setIdUrl(result._id);console.log("make delete fetch real again")}}>Delete</button>
              </div>
              :<div className='externalNav'>
                <button className='profileBtn' onClick={e=>profileNav(result.user._id)}>Profile</button>
                <button className='messageBtn' onClick={e=>messageNav(result.user._id)}>Message</button>
              </div>}
          </div>
        ))}
      </div>
  }
  const profileNav=(_id)=>{
    navigate(`/profile/${_id}`)
  }
  const messageNav=(_id)=>{
    navigate(`/messaging/${_id}`)
  }
//fetch on repeat to ensure timely loading of all posts
  useEffect(()=>{
    fetch(`http://localhost:4000/post/`,{
      method: "GET",
      headers: new Headers({
        "Content-Type":"application/json",
        "authorization":sessionToken
      })
    })
    .then(res=>res.json())
    .then(data=>setFetchResult(data))
    .catch(err=>console.log(err))
  },[])
  return (
    <>
      <div>
        {renderResult()}
      </div>
    </>
  )
}

export default News