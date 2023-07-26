import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import "./readProfile.css"
import { useHref, useParams } from 'react-router-dom'
// import ReactPlayer from "react-player"
import YouTubePlayer from 'react-player/youtube'
import SoundCloudPlayer from 'react-player/soundcloud'
import jwtDecode from 'jwt-decode' 

function ReadProfile() {
  const navigate = useNavigate()

  const [ profile, setProfile ] = useState({})

  const sessionToken = localStorage.getItem('token');

  const getUserId = () => {
        try {
            const decodedToken = jwtDecode(sessionToken)
            return decodedToken._id 
        } catch (error) {
            console.log(`error decoding`,error)
        }
    }
    
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
          <div id='photosDiv'>
            <img src={`${profile.coverPhoto}`} id='coverPhotoImage'/>
            <img src={`${profile.profilePicture}`} id='profilePhotoImage'/>
          </div>

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

          {params.user_id===getUserId()
            ? <div id='editProfileDiv'>
              <button type='button' onClick={() => navigate(`/profile/edit`)}> Edit Profile</button>
              </div> 
            : <div id='messageProfileDiv'> 
              <button type='button' onClick={() => navigate(`/messaging/${params.user_id}`)}> Message
              </button>
              </div>
          }

          {profile.socials.youtube && <YouTubePlayer url={profile.socials.youtube} 
            width="50%"/>}
          {profile.socials.soundCloud && <SoundCloudPlayer url={profile.socials.soundCloud} 
            width="50%"/>}
          {profile.socials.spotify && <iframe src={`https://open.spotify.com/embed/track/${spotifyShortened}`} 
            width="50%" height="352" frameBorder="0" allowFullScreen="" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"></iframe>} 

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