import React, {useState, useEffect} from 'react'
import "./readProfile.css"
import { useHref, useParams } from 'react-router-dom'
// import ReactPlayer from "react-player"
import YouTubePlayer from 'react-player/youtube'
import SoundCloudPlayer from 'react-player/soundcloud'

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
  }, [params])
  
  const renderProfile = () => {

    
    if (profile.socials) {

      const spotifyInitial = `${profile.socials.spotify}` 
      const parts = spotifyInitial.split('/')
      const trackIndex = parts.indexOf('track')
      const spotifyShortened = parts[trackIndex + 1]

      return (
        <div id='profileDiv'>
          <img src={`${profile.profilePicture}`} style={{maxWidth:200, maxHeight:200}}/>
          <h1>{profile.bandName}</h1>
          <p>{profile.bio}</p> 

        <div id='socialMediaSpan'>

          <span id="instagramSpan" >
          <img className='socialIcons' src="/assets/instagram.png" alt="" srcSet="" 
            onClick={(e) => {window.location.href = `${profile.socials.instagram}`}}/>
          </span>

          <span id="soundCloudSpan">
          <img className='socialIcons' src="/assets/soundcloud.png" alt="" srcSet="" 
            onClick={(e) => {window.location.href = `${profile.socials.soundCloud}`}}/>
          </span>

          <span id="spotifySpan">
          <img className='socialIcons' src="/assets/spotify.png" alt="" srcSet=""
            onClick={(e) => {window.location.href = `${profile.socials.spotify}`}}/>
          </span>

          <span id="youtubeSpan">
          <img className='socialIcons' src="/assets/youtube.png" alt="" srcSet="" 
            onClick={(e) => {window.location.href = `${profile.socials.youtube}`}}/>
          </span> 
        </div>

          <div id='editProfileDiv'>
          <button type='button'>Edit Profile</button>
          </div>

          {profile.socials.youtube && <YouTubePlayer url={profile.socials.youtube} />}
          {profile.socials.soundCloud && <SoundCloudPlayer url={profile.socials.soundCloud} />}

          <iframe src={`https://open.spotify.com/embed/track/${spotifyShortened}`} width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

        </div>
      );
    } else {
      return <div>Loading...</div>;
    }
  };
  
  return (
    <div>
    {renderProfile()}
    </div>
  )
}

export default ReadProfile