import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import './EditProfile.css'
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';

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

  return (
    <div id='edit-profile'>
      <div id='registerDiv'>
    <form action="" id="form-inputs">
        <h1 id='banner'>Edit Profile</h1>
      
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
              style={{ width:50,height:50,borderRadius:100 }}
              loading='lazy'
          />
          <EditIcon/> 
          </label>
        </div>)
        : (
        <label htmlFor='profile-upload'>
          <AddAPhotoOutlinedIcon/>
        </label>
      )
      }

      {user.coverPhoto ? (
        <div>
          <label htmlFor='cover-upload'>
          <img  
            src={user.coverPhoto}
            alt='Cover'
            style={{ width: 500, height: 100 }}
            loading='lazy'
          />
          <EditIcon/>
          </label>
        </div>
      ) : (
        <label htmlFor='cover-upload'>
          <AddPhotoAlternateIcon/> 
        </label>
      )
      }

      <input 
        type='file'
        name='coverPhoto'
        id='cover-upload'
        accept='.jpeg, .jpg, .png'
        onChange={handleUpdateFile}
      />

        <div id="emailDiv">
        <label htmlFor="emailInput">Email Address:</label>
        <input 
        type="text" 
        name="email" 
        id="emailInput" 
        placeholder="Enter your email here." 
        value={updatedUser.email}
        onChange={handleUpdate}
        />
        </div>

        <div>
        <label htmlFor="bandNameInput">Band Name:</label>
        <input 
        type="text" 
        name="bandName" 
        id="bandNameInput" 
        placeholder="Enter your band's name here." 
        value={updatedUser.bandName}
        onChange={handleUpdate}
        />
        </div>

        <div>
        <label htmlFor="contactNameInput">Contact Name:</label>
        <input 
        type="text" 
        name="contactName" 
        id="contactNameInput" 
        placeholder="Enter your main contact's name here."
        value={updatedUser.contactName}
        onChange={handleUpdate}
        />
        </div> 

        <div>
        <label htmlFor="locationInput">Location:</label>
        <input 
        type="text" 
        name="location" 
        id="locationInput" placeholder="Enter your location here."
        value={updatedUser.location}
        onChange={handleUpdate}
        />
        </div>

        <div id='genreDropdown'>
        <label htmlFor="genreInput">Genre:</label>
        <select 
        name='genre'
        value={updatedUser.genre} 
        onChange={handleUpdate} 
        id="genreInput">
            <option value="">Select a genre.</option>
            <option value="rock">Rock</option>
            <option value="jazz">Jazz</option>
            <option value="pop">Pop</option>
        </select>
        </div>

        <div id='additionGenreDropdown'>
        <label htmlFor="additionalGenreInput">Genre:</label>
        <select 
        value={updatedUser.additionalGenre} 
        name='additionalGenre'
        onChange={handleUpdate} 
        id="additionGenreInput">
            <option value="">Select an additional genre.</option>
            <option value="rock">Rock</option>
            <option value="jazz">Jazz</option>
            <option value="pop">Pop</option>
        </select>
        </div>

        <div>
        <label htmlFor="bioInput">Bio:</label>
        <textarea 
        type="text" 
        name="bio" 
        id="bioInput" placeholder="Enter your short bio here."
        value={updatedUser.bio}
        onChange={handleUpdate}
        />
        </div>

        <div>
        <label htmlFor="youtubeInput">YouTube Link:</label>
        <input 
        type="text" 
        name="youtube" 
        id="youtubeInput" placeholder="Link to a YouTube channel/video here."
        value={updatedUser.socials.youtube}
        onChange={handleUpdate}
        />
        </div>

        <div>
        <label htmlFor="spotifyInput">Spotify Link:</label>
        <input 
        type="text" 
        name="spotify" 
        id="spotifyInput" placeholder="Link to your Spotify page here."
        value={updatedUser.socials.spotify}
        onChange={handleUpdate}
        />
        </div>

        <div>
        <label htmlFor="soundCloudInput">SoundCloud Link:</label>
        <input 
        type="text" 
        name="soundCloud" 
        id="soundCloudInput" placeholder="Link to your SoundCloud here."
        value={updatedUser.socials.soundCloud}
        onChange={handleUpdate}
        />
        </div>

        <div>
        <label htmlFor="instagramInput">Instagram Link:</label>
        <input 
        type="text" 
        name="instagram" 
        id="instagramInput" placeholder="Link to your Instagram here."
        value={updatedUser.socials.instagram}
        onChange={handleUpdate}
        />
        </div>

        <button id="edit-submitButton" type="submit" onClick={handleSubmit}>UpdateProfile</button>
        {message && <div>{message}</div>}
    </form>
    </div>
    </div>
  )
}

export default EditProfile