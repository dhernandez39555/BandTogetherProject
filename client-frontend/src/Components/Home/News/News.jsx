import React, { useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';
import { TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddLinkIcon from '@mui/icons-material/AddLink';
import dayjs from 'dayjs';
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
    link: ""
  })

  const [ singlePost, setSinglePost ] = useState(null);
  const [ postBox, setPostBox ]=useState(false)
  const [ isEdit, setIsEdit ]=useState(false)

  //rendering out each fetch GET index with title, body, and bandName alongside either edit and delete or navigation buttons depending on the current user
  const renderResult=()=>{
    return fetchResult.length===0||!fetchResult
      ?<p>Loading Posts...</p>
      :<div className='renderContainer'>
        {fetchResult.map((result)=>(
          <div className={`postWrapper`} key={result._id}>
            <div className="post-content">
                <h6 className='dateHeader'>{dayjs(result.createdAt).format("MM/DD/YYYY")}</h6>
              <div id="dateDiv">
                <h2 className='titleHeader'>{result.title}</h2>
                <p className='bandNameHeader'>{`Posted by: ${result.user.bandName}`}</p>
              </div>
              <div>
                <p className='messageBodyHeader' onClick={e=> setSinglePost(result)}>{result.body}</p>
              </div>
              { result.linkPreview
              ?<Link to={result.link} target="_blank" rel="noopener noreferrer">
                <div className="link-preview">
                  <img src={result.linkPreview.image} />
                  <div className="link-text">
                    <p>{result.linkPreview.title}</p>
                  </div>
                </div>
              </Link>
              : null
              }
              {result.user._id===getUserId()
              ?<div className='externalNav'>
                <button onClick={e=>{editPostForm(result)}}>Edit</button>
                <button onClick={e=>{fetchDelete(result._id)}}>Delete</button>
              </div>
              :<div className='externalNav'>
                <button onClick={e=>profileNav(result.user._id)}>Profile</button>
                <button onClick={e=>messageNav(result.user._id)}>Message</button>
              </div>}
            </div>
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
  const updatePostBody=(e)=>{
    const {name, value} = e.target;
    setPostBody(prevData => ({
      ...prevData,
      [name]: value
    }));
  }

  async function submitForm(){
    const url = isEdit
      ? `http://localhost:4000/post/update/${idUrl}`
      : `http://localhost:4000/post/create`
    
    const options = {
      method: isEdit ? "PUT" : "POST",
      body:JSON.stringify(postBody),
      headers: new Headers({
        "Content-Type":"application/json",
        "authorization":sessionToken
      })
    }

    const resolveData=(data)=>{
      if (isEdit) {
        const updatedIndex = fetchResult.findIndex(post => post._id == data.postUpdates._id);
        let editedPost = fetchResult[updatedIndex];
        if(data.postUpdates.title){editedPost.title = data.postUpdates.title};
        if(data.postUpdates.body){editedPost.body = data.postUpdates.body};
        if(data.postUpdates.link){editedPost.link = data.postUpdates.link};
        if(data.postUpdates.linkPreview){editedPost.linkPreview = data.postUpdates.linkPreview};
        console.log(editedPost);
        setFetchResult([ ...fetchResult ]);
      }
      else {
        setFetchResult([ data.newPost, ...fetchResult ]);
      }
    }

    fetch(url, options)
      .then(res=>res.json())
      .then(data=> {
        resolveData(data)
      })
      .catch(err=>console.log(err))

    closePostBox()
  }

  //Setup for PUT
  function editPostForm(post) {
    setIsEdit(true);
    setPostBox(true);
    setIdUrl(post._id);
    setPostBody({
      title: post.title,
      body: post.body,
      link: post.link
    })
  }

  const closePostBox=()=>{
    setIsEdit(false)
    setPostBox(false)
    setPostBody({
      title:"",
      body:"",
      link:""
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
    .then(data=> setFetchResult(fetchResult.filter(post => post._id !== id)))
    .catch(err=>console.log(err))
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
    <div id="posts-page">
      { singlePost
      ? <div className='postWrapper fullscreen'>
        <div className="post-content">
          <CloseIcon
            htmlColor='#7E12B3'
            fontSize='large'
            onClick={()=>setSinglePost(null)}
          />
          <div id="dateDiv">
            <h6 className='dateHeader'>{dayjs(singlePost.createdAt).format("MM/DD/YYYY")}</h6>
            <h2 className='titleHeader'>{singlePost.title}</h2>
            <p className='bandNameHeader'>{`Posted by: ${singlePost.user.bandName}`}</p>
          </div>
          <div>
            <p className='messageBodyHeader'>{singlePost.body}</p>
          </div>
          { singlePost.linkPreview
            ?<Link to={singlePost.link} target="_blank" rel="noopener noreferrer">
              <div className="link-preview">
                <img src={singlePost.linkPreview.image} />
                <p>{singlePost.linkPreview.title}</p>
              </div>
            </Link>
            : null
          }
          {singlePost.user._id===getUserId()
          ?<div className='externalNav'>
            <button onClick={e=>{editPostForm(singlePost)}}>Edit</button>
            <button onClick={e=>{fetchDelete(singlePost._id)}}>Delete</button>
          </div>
          :<div className='externalNav'>
            <button onClick={e=>profileNav(singlePost.user._id)}>Profile</button>
            <button onClick={e=>messageNav(singlePost.user._id)}>Message</button>
          </div>}
        </div>
      </div>
      : <><div id='postBtnWrapper'>
        { postBox
        ? <CloseIcon
          htmlColor='#7E12B3'
          fontSize='large'
          onClick={()=>setPostBox(!postBox)}
        />
        : <AddLinkIcon
          htmlColor='#7E12B3'
          fontSize='large'
          onClick={()=>setPostBox(!postBox)}
        />
        }
      </div>
      { postBox
        ? <div className='postBox'>
          <TextField
            className="filter-input"
            fullWidth={true}
            type="text" 
            label="Title"
            name='title'
            value={postBody.title}
            onChange={e=>updatePostBody(e)}
            placeholder='Enter post title'/>
          <TextField
            className="filter-input"
            fullWidth={true}
            type="text" 
            label="Body"
            name='body' 
            value={postBody.body} 
            onChange={e=>updatePostBody(e)} 
            placeholder='Enter post content'/>
          <TextField
            className="filter-input"
            fullWidth={true}
            type="text"
            label="Link"
            name='link'
            value={postBody.link} 
            onChange={e=>updatePostBody(e)} 
            placeholder='Enter post content'/>
          <div id="selectBtns">
            <button onClick={e=>submitForm()}>Submit</button>
            <button onClick={e=>closePostBox()}>Cancel</button>
          </div>
        </div>
        : renderResult()
      }
    </>}
    </div>
  )
}

export default News
