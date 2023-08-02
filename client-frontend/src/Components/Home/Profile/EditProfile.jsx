import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import './EditProfile.css'
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import { TextField, MenuItem } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

function EditProfile() {
  
  const [ user, setUser ] = useState({});
  const [ userData, setUserData ] = useState(false)
  const [ updatedUser, setUpdatedUser ] = useState({
    profilePicture:"",
    coverPhoto:"",
    email:"",
    password:"",
    bandName:"",
    contactName:"",
    location:"",
    genre:"",
    additionGenre:"",
    bio:"",
    socials:{
      youtube:"",
      spotify:"",
      soundCloud:"",
      instagram:""
    },
    
  });
  const [redirectToProfile, setRedirectToProfile] = useState(false);
  const [ message, setMessage ] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    fetch('http://127.0.0.1:4000/user/', {
      headers: new Headers({
        "Content-Type": "application/json",
        'authorization': localStorage.getItem('token')
      })
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.status} - ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('User data received:', data);
        if (data.foundUser) {
            setUser(data.foundUser);
            setUpdatedUser(data.foundUser)
            setUserData(true);
        } else {
          throw new Error('User not found');
        }
      })
      .catch((error) => {
        console.log('Error fetching user:', error);
      });
  }, []);
  
  const handleUpdate = (e) => {
    const { name, value } = e.target;
    if(['youtube','spotify','soundCloud','instagram'].includes(name)) {
      setUpdatedUser({
        ...updatedUser,
        socials: {
          ...updatedUser.socials,
          [name]: value,
        }
      })
    } else {
    setUpdatedUser({
      ...updatedUser,
      [name]: value,
    })
  }
};

  const handleSubmit = e => {
    e.preventDefault();
    fetch('http://127.0.0.1:4000/user/', {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem('token')
      },
      body: JSON.stringify(updatedUser),
    })
    .then((res) => res.json())
    .then((data) => {
      setMessage('Profile Updated successfully')
      setUser(data.updatedUser);
      const userId = getUserId();
      setRedirectToProfile(true)
    })
    .catch((err) => {
      setMessage('Error updating profile')
      console.log(err)
    })
  };

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
        resolve(fileReader.result)
    }
    fileReader.onerror = (error) => {
        reject(error) 
    }
    })
}

const handleUpdateFile = async (e) => {
  const file = e.target.files[0];
  const base64 = await convertToBase64(file);

    const name = e.target.name;
    setUpdatedUser({
      ...updatedUser,
      [name]: base64,
    });
    if(name === 'profilePicture') {
      setUser({
        ...user,
        profilePicture: base64,
      })
    } else if(name === 'coverPhoto') {
      setUser({
        ...user,
        coverPhoto: base64,
      })
    }
};
const [sessionToken, setSessionToken] =useState(localStorage.getItem('token'))

const getUserId = () => {
  if (!sessionToken) return null;
  try {
      const decodedToken = jwtDecode(sessionToken);
      return decodedToken._id;
  } catch (err) {
      console.log(`err decoding`, err);
  }
} 

useEffect(() => {
  if (redirectToProfile) {
    const userId = getUserId();
    navigate(`/profile/${userId}`)
  }
}, [redirectToProfile, navigate])

const handleBackArrow = async (e) => {
  const userId = getUserId();
  navigate(`/profile/${userId}`)
}

  return (
  <>  
    <div id='edit-profile'>
      {Object.keys(user).length === 0 ? (<p>Loading Content...</p>)
      : 
      <div id='registerDiv'>
    <form action="" id="form-inputs">
    
      <ArrowBackIosIcon fontSize='large' id="editBackArrow"
      onClick={handleBackArrow}/>

      <h1 id='banner'>
      Edit Profile</h1>
      
      <input 
        type='file'
        name='coverPhoto'
        id='cover-upload'
        accept='.jpeg, .jpg, .png'
        onChange={handleUpdateFile}
      />

      {user.coverPhoto ? (
        <div>
          <label htmlFor='cover-upload'>
          <img  
            src={user.coverPhoto}
            alt='Cover'
            loading='lazy'
            id='updated-cover-preview'
          />
          {/* <EditIcon/> */}
          </label>
        </div>
      ) : (
        <div id="preview-updated-cover-div">
          <label htmlFor='cover-upload'>
            <AddPhotoAlternateIcon fontSize='medium'/> 
          </label>
        </div>
      )
      }

      <input
        type="file"
        name='profilePicture'
        id='profile-upload'
        accept='.jpeg, .jpg, .png'
        onChange={handleUpdateFile}
        />

      {user.profilePicture ? (
        <div>
          <label htmlFor='profile-upload'>
            <img 
              src={user.profilePicture}
              alt='Profile'
              loading='lazy'
              id='updated-profile-preview'
          />
          {/* <EditIcon/>  */}
          </label>
        </div>)
        : (
        <div id="preview-updated-profile-div">
          <label htmlFor='profile-upload'>
            <AddAPhotoOutlinedIcon fontSize='large'/>
          </label>
        </div>
      )
      }

        <div id="emailDiv">
        {/* <label htmlFor="emailInput">Email Address:</label> */}
        <TextField 
          required={true} 
          fullWidth={true}
          className="editProfileInput"
          id="emailInput" 
          type='email'
          name="email"
          label="Email"
          placeholder="Enter your email here." 
          style={{marginBottom: "1em"}}
          value={updatedUser.email}
          onChange={handleUpdate}
        />
        </div>

        <div>
        {/* <label htmlFor="bandNameInput">Band Name:</label> */}
        <TextField 
          required={true} 
          fullWidth={true}
          className="editProfileInput"
          name="bandName" 
          id="bandNameInput" 
          label="Band Name"
          placeholder="Enter your band's name here." 
          value={updatedUser.bandName}
          style={{marginBottom: "1em"}} 
          onChange={handleUpdate}
        />
        </div>

        

        <div>
        {/* <label htmlFor="contactNameInput">Contact Name:</label> */}
        <TextField
          required={true}
          fullWidth={true}
          className="editProfileInput"
          name="contactName" 
          id="contactNameInput" 
          label="Contact Name"
          placeholder="Enter your main contact's name here."
          style={{marginBottom: "1em"}}
          value={updatedUser.contactName}
          onChange={handleUpdate}
        />
        </div> 


        <div>
        {/* <label htmlFor="locationInput">Location:</label> */}
        <TextField 
          fullWidth={true}
          className="editProfileInput"
          name="location" 
          id="locationInput" placeholder="Enter your location here."
          label="Location"
          style={{marginBottom: "1em"}}
          value={updatedUser.location}
          onChange={handleUpdate}
        />
        </div>

        <div id='genreDropdown'>
        {/* <label htmlFor="genreInput">Genre:</label> */}
        <TextField 
          required={true}
          fullWidth={true}
          select={true}
          className="editProfileInput"
          id="genreInput"
          name='genre'
          value={updatedUser.genre} 
          onChange={handleUpdate} 
          label="Genre"
          style={{marginBottom: "1em"}}>
              <MenuItem value=""></MenuItem>
              <MenuItem value={"rock"}>Rock</MenuItem>
              <MenuItem value={"jazz"}>Jazz</MenuItem>
              <MenuItem value={"pop"}>Pop</MenuItem>
        </TextField>
        </div>

        <div id='additionGenreDropdown'>
        {/* <label htmlFor="additionalGenreInput">Genre:</label> */}
        <TextField 
          fullWidth={true}
          select={true}
          className="editProfileInput"
          value={updatedUser.additionGenre} 
          name='additionGenre'
          onChange={handleUpdate} 
          id="additionGenreInput"
          label="Additional Genre"
          style={{marginBottom: "1em"}}>
            <MenuItem value=""></MenuItem>
            <MenuItem value={"rock"}>Rock</MenuItem>
            <MenuItem value={"jazz"}>Jazz</MenuItem>
            <MenuItem value={"pop"}>Pop</MenuItem>
        </TextField>
        </div>

        <div>
        {/* <label htmlFor="bioInput">Bio:</label> */}
        <TextField 
          required={true}
          fullWidth={true}
          className="editProfileInput"
          multiline
          rows={4}
          name="bio" 
          id="bioInput" placeholder="Enter your short bio here."
          label="Bio"
          style={{marginBottom: "1em"}}
          value={updatedUser.bio}
          onChange={handleUpdate}
        />
        </div>

        <div>
        {/* <label htmlFor="youtubeInput">YouTube Link:</label> */}
        <TextField 
          fullWidth={true}
          className="editProfileInput"
          name="youtube" 
          id="youtubeInput" placeholder="Link to a YouTube channel/video here."
          label="YouTube"
          style={{marginBottom: "1em"}}
          value={updatedUser.socials.youtube}
          onChange={handleUpdate}
        />
        </div>

        <div>
        {/* <label htmlFor="spotifyInput">Spotify Link:</label> */}
        <TextField 
          fullWidth={true}
          className="editProfileInput"
          name="spotify" 
          id="spotifyInput" placeholder="Link to your Spotify page here."
          label="Spotify"
          style={{marginBottom: "1em"}}
          value={updatedUser.socials.spotify}
          onChange={handleUpdate}
        />
        </div>

        <div>
        {/* <label htmlFor="soundCloudInput">SoundCloud Link:</label> */}
        <TextField  
          fullWidth={true}
          className="editProfileInput"
          name="soundCloud" 
          id="soundCloudInput" placeholder="Link to your SoundCloud here."
          label="SoundCloud"
          style={{marginBottom: "1em"}}
          value={updatedUser.socials.soundCloud}
          onChange={handleUpdate}
        />
        </div>

        <div>
        {/* <label htmlFor="instagramInput">Instagram Link:</label> */}
        <TextField 
          fullWidth={true}
          className="editProfileInput"
          name="instagram" 
          id="instagramInput" placeholder="Link to your Instagram here."
          label="Instagram"
          value={updatedUser.socials.instagram}
          onChange={handleUpdate}
        />
        </div>

    </form>
    </div>}
    </div>

    {Object.keys(user).length === 0 ? null : 
        (<div id="edit-profile-button-div">
        <button id="edit-submitButton" type="submit" onClick={handleSubmit}>Submit</button>
        {/* {message && <div>{message}</div>} */}
        </div>)}

  </>      
  )
}

export default EditProfile