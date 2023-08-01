import React, { useEffect, useState, useRef } from 'react'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import './news.css'

function News() {

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

  const [postBody,setPostBody]=useState({
    title:"",
    body:"",
    user:{
      bandName:""
    }
  })

  const [ postBox, setPostBox ]=useState(false)
  const [ modal, setModal ]=useState(false)
  //functions for organizing mongoDB date into readable strings
  const prevDate = useRef(new Date("January 1, 1970"));

  const getDate = (date) => {
    const newDate = new Date(date);
    if (prevDate.current.getDate() === newDate.getDate()) return null;
    const newDateStr = `${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`
    prevDate.current = newDate;
    return (<div key={date} className="datestamp"><p>{newDateStr}</p></div>)
  }
  //rendering out each fetch GET index with title, body, and bandName alongside either edit and delete or navigation buttons depending on the current user
  const renderResult=()=>{
    return fetchResult.length===0||!fetchResult
      ?<p>Loading Posts...</p>
      :<div className='renderContainer'>
        {fetchResult.map((result)=>(
          <div className="eventWrapper" key={result._id}>

            <div id="dateDiv">
            <h6 className='dateHeader'>{getDate(result.createdAt)}</h6>
            </div>

            <div className="messageBodyDiv">
            <h2 className='titleHeader'>{result.title}</h2>
            <h4 className='bandNameHeader'>{result.user.bandName}</h4>
            <h5 className='messageBodyHeader'>{result.body}</h5>
            </div>

            {result.user._id===getUserId()
              ?<div className='options'>
                <button className='newsButton' onClick={e=>{setIdUrl(result._id);setModal(!modal); setPostBody({title:"",body:"",user:{bandName:""}})}}>Edit</button>
                <button className='newsButton' onClick={e=>{fetchDelete(result._id)}}>Delete</button>
              </div>
              :<div className='externalNav'>
                <button className='newsButton' onClick={e=>profileNav(result.user._id)}>Profile</button>
                <button className='newsButton' onClick={e=>messageNav(result.user._id)}>Message</button>
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
//fetch POST 
  const handleNewPost=(e)=>{
    const {name, value} = e.target;
    setPostBody(prevData => ({
      ...prevData,
      [name]: value
    }));
  }
  function fetchPost(){
    fetch(`http://localhost:4000/post/create`,{
      method:"POST",
      body:JSON.stringify(postBody),
      headers:new Headers({
        "Content-Type":"application/json",
        "authorization":sessionToken
      })
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
      user:{
        bandName:""
      }
    })
  }
//fetch DELETE
  function fetchDelete(id){
    fetch(`http://localhost:4000/post/delete/${id}`,{
      method:"DELETE",
      headers: new Headers({
        "Content-Type":"application/json",
        "authorization":sessionToken
      })
    })
    .then(res=>res.json())
    .catch(err=>console.log(err))
  }
//fetch PUT
  function fetchUpdate(){
    fetch(`http://localhost:4000/post/update/${idUrl}`,{
      method:"PUT",
      body:JSON.stringify(postBody),
      headers: new Headers({
        "Content-Type":"application/json",
        "authorization":sessionToken
      })
    })
    .then(res=>res.json())
    .catch(err=>console.log(err))
    setPostBody({
      title:"",
      body:"",
      user:{
        bandName:""
      }
    })
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
      <div id='eventBtnWrapper'>
        <button onClick={()=>setPostBox(!postBox)} id='newPostBtn'>
          Add a post!</button>
      </div>
      {postBox
        ?<div className='postBox'>
          <TextField 
            type="text" 
            name='title'
            value={postBody.title}
            onChange={e=>handleNewPost(e)}
            placeholder='Enter post title'/>
          <TextField 
            type="text" 
            name='body' 
            value={postBody.body} 
            onChange={e=>handleNewPost(e)} 
            placeholder='Enter post content'/>
          <div id="selectBtns">
            <button onClick={e=>fetchPost()}>Submit</button>
            <button onClick={e=>closePostBox()}>Cancel</button>
          </div>
        </div>
        :null
      }
      {!modal
        ?null
        :<div className='modal'>
          <TextField 
            type="text" 
            name='title' 
            value={postBody.title} 
            onChange={e=>handleNewPost(e)} 
            placeholder='Enter updated title'/>
          <TextField 
            type="text" 
            name='body' 
            value={postBody.body} 
            onChange={e=>handleNewPost(e)} 
            placeholder='Enter updated content'/>
          <div id="selectBtns">
            <button onClick={e=>fetchUpdate()}>Submit</button>
            <button 
              onClick={(e)=>{
                setModal(!modal)
                setPostBody({
                  title:"",
                  body:"",
                  user:{bandName:""}
                })
              }}>Cancel</button>
              
          </div>

        </div>
      }
      {renderResult()}
    </>
  )
}

export default News