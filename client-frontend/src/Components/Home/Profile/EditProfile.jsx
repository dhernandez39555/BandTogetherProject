import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import './EditProfile.css'
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { TextField, MenuItem } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

function EditProfile() {
  
  const [ user, setUser ] = useState({});
  const [ userData, setUserData ] = useState(false)
  const [ updatedUser, setUpdatedUser ] = useState({
    profilePicture:"",
    coverPhoto:"",
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
      .then((data) => {;
        if (data.foundUser) {
            setUser(data.foundUser);
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

    if(['youtube','spotify','soundCloud','instagram'].includes(name)) {
      setUser({
          ...user,
          socials: {
            ...user.socials,
            [name]: value,
          }
        })
        } else {
        setUser({
          ...user,
          [name]: value,
        })
      }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const s3Url = "http://127.0.0.1:4000/utilities/s3-url"

    let putBody = {}

    if (updatedUser.bandName !== "") putBody.bandName = updatedUser.bandName;
    if (updatedUser.contactName !== "") putBody.contactName = updatedUser.contactName;
    if (updatedUser.location !== "") putBody.location = updatedUser.location;
    if (updatedUser.genre !== "") putBody.genre = updatedUser.genre;
    if (updatedUser.additionGenre !== "") putBody.additionGenre = updatedUser.additionGenre;
    if (updatedUser.bio !== "") putBody.bio = updatedUser.bio;

    putBody.socials = {};
    if (updatedUser.socials.youtube !== "") putBody.socials.youtube = updatedUser.socials.youtube;
    if (updatedUser.socials.spotify !== "") putBody.socials.spotify = updatedUser.socials.spotify;
    if (updatedUser.socials.soundCloud !== "") putBody.socials.soundCloud = updatedUser.socials.soundCloud;
    if (updatedUser.socials.instagram !== "") putBody.socials.instagram = updatedUser.socials.instagram;

    if (updatedUser.profilePicture !== "") {
      const uploadUrl = await fetch(s3Url).then(res => res.json());

      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "multipart/form-data"
        },
        body: updatedUser.profilePicture
      }).then(res => console.log(res.status));

      const imgUrl = uploadUrl.split("?")[0];
      putBody.profilePicture = imgUrl;
    }

    if (updatedUser.coverPhoto !== "") {
      const uploadUrl = await fetch(s3Url).then(res => res.json());

      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "multipart/form-data"
        },
        body: updatedUser.coverPhoto
      }).then(res => console.log(res.status));

      const imgUrl = uploadUrl.split("?")[0];
      putBody.coverPhoto = imgUrl;
    }

    console.log(putBody);

    fetch('http://127.0.0.1:4000/user/', {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem('token')
      },
      body: JSON.stringify(putBody),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      setMessage('Profile Updated successfully')
      setUser(data.updatedUser);
      const userId = getUserId();
      navigate(`/profile/${userId}`);
    })
    .catch((err) => {
      setMessage('Error updating profile')
      console.log(err)
    })
  };

const handleUpdateFile = async (e) => {
  const file = e.target.files[0];

  const name = e.target.name;
  setUpdatedUser({
    ...updatedUser,
    [name]: file,
  });

  setUser({
    ...user,
    [name]: file,
  });
};

const [sessionToken, setSessionToken] = useState(localStorage.getItem('token'))

const getUserId = () => {
  if (!sessionToken) return null;
  try {
      const decodedToken = jwtDecode(sessionToken);
      return decodedToken._id;
  } catch (err) {
      console.log(`err decoding`, err);
  }
} 

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

      { user.coverPhoto ? (
        <div>
          <label htmlFor='cover-upload'>
          <img  
            src={ !updatedUser.coverPhoto ?  user.coverPhoto : URL.createObjectURL(user.coverPhoto)}
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
              src={ !updatedUser.profilePicture ? user.profilePicture : URL.createObjectURL(user.profilePicture)}
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
          value={user.email}
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
          value={user.bandName}
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
          value={user.contactName}
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
          value={user.location}
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
          value={user.genre} 
          onChange={handleUpdate} 
          label="Genre"
          style={{marginBottom: "1em"}}>
              <MenuItem value=""></MenuItem>
              <MenuItem value={"Country"}>Country</MenuItem>
              <MenuItem value={"Rock"}>Rock</MenuItem>
              <MenuItem value={"Folk"}>Folk</MenuItem>
              <MenuItem value={"Indie"}>Indie</MenuItem>
              <MenuItem value={"Jazz"}>Jazz</MenuItem>
              <MenuItem value={"Blues"}>Blues</MenuItem>
              <MenuItem value={"Bluegrass"}>Bluegrass</MenuItem>
              <MenuItem value={"Metal"}>Metal</MenuItem>
              <MenuItem value={"Punk"}>Punk</MenuItem>
              <MenuItem value={"Hip Hop"}>Hip Hop</MenuItem>
              <MenuItem value={"R&B"}>R&B</MenuItem>
              <MenuItem value={"Latin"}>Latin</MenuItem>
              <MenuItem value={"Electronic"}>Electronic</MenuItem>
              <MenuItem value={"Experimental"}>Experimental</MenuItem>
              <MenuItem value={"Reggae"}>Reggae</MenuItem>
              <MenuItem value={"Alternative"}>Alternative</MenuItem>
              <MenuItem value={"Dance"}>Dance</MenuItem>
              <MenuItem value={"Ambient"}>Ambient</MenuItem>
              <MenuItem value={"Gospel"}>Gospel</MenuItem>
              <MenuItem value={"Ska"}>Ska</MenuItem>
              <MenuItem value={"Pop"}>Pop</MenuItem>
              <MenuItem value={"Orchestral"}>Orchestral</MenuItem>
              <MenuItem value={"Psychedelic"}>Psychedelic</MenuItem>
              <MenuItem value={"Other"}>Other</MenuItem>
        </TextField>
        </div>

        <div id='additionGenreDropdown'>
        {/* <label htmlFor="additionalGenreInput">Genre:</label> */}
        <TextField 
          fullWidth={true}
          select={true}
          className="editProfileInput"
          value={user.additionGenre} 
          name='additionGenre'
          onChange={handleUpdate} 
          id="additionGenreInput"
          label="Additional Genre"
          style={{marginBottom: "1em"}}>
            <MenuItem value=""></MenuItem>
            <MenuItem value={"Country"}>Country</MenuItem>
            <MenuItem value={"Rock"}>Rock</MenuItem>
            <MenuItem value={"Folk"}>Folk</MenuItem>
            <MenuItem value={"Indie"}>Indie</MenuItem>
            <MenuItem value={"Jazz"}>Jazz</MenuItem>
            <MenuItem value={"Blues"}>Blues</MenuItem>
            <MenuItem value={"Bluegrass"}>Bluegrass</MenuItem>
            <MenuItem value={"Metal"}>Metal</MenuItem>
            <MenuItem value={"Punk"}>Punk</MenuItem>
            <MenuItem value={"Hip Hop"}>Hip Hop</MenuItem>
            <MenuItem value={"R&B"}>R&B</MenuItem>
            <MenuItem value={"Latin"}>Latin</MenuItem>
            <MenuItem value={"Electronic"}>Electronic</MenuItem>
            <MenuItem value={"Experimental"}>Experimental</MenuItem>
            <MenuItem value={"Reggae"}>Reggae</MenuItem>
            <MenuItem value={"Alternative"}>Alternative</MenuItem>
            <MenuItem value={"Dance"}>Dance</MenuItem>
            <MenuItem value={"Ambient"}>Ambient</MenuItem>
            <MenuItem value={"Gospel"}>Gospel</MenuItem>
            <MenuItem value={"Ska"}>Ska</MenuItem>
            <MenuItem value={"Pop"}>Pop</MenuItem>
            <MenuItem value={"Orchestral"}>Orchestral</MenuItem>
            <MenuItem value={"Psychedelic"}>Psychedelic</MenuItem>
            <MenuItem value={"Other"}>Other</MenuItem>
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
          value={user.bio}
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
          value={user.socials.youtube}
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
          value={user.socials.spotify}
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
          value={user.socials.soundCloud}
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
          value={user.socials.instagram}
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

export default EditProfile;