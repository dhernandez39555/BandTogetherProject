import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import ReactPlayer from "react-player"

function ReadProfile() {

  const [ profile, setProfile ] = useState({})

  const sessionToken = localStorage.getItem('token');

  const params = useParams();

  const fetchProfile = () => {
    const url = `http://127.0.0.1:4000/user/${params.user_id}`

    fetch(url, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application.json",
        "authorization": sessionToken,
      }),
    })
      .then(res => res.json())
      .then(data => setProfile(data.foundUser))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const renderProfile = () => {
    console.log(profile.socials.soundCloud)
    return (
      <>
      <h1>{profile.bandName}</h1>
      <p>{profile.bio}</p>
      <ReactPlayer url={profile.socials.soundCloud}/> 
      </>
    )
  }

  return (
    <div>
    {renderProfile()}
    </div>
  )
}

export default ReadProfile