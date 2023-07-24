import React, { useEffect, useState } from 'react'
// todo problem with backend get currently logged in user due to session validation? maybe change decoding sessionToken to middleware?
function EditProfile() {

  const [ user, setUser ] = useState({});
  const [ updatedUser, setUpdatedUser ] = useState({
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
  }

  });
  const [ message, setMessage ] = useState('');

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
          setUpdatedUser(data.foundUser);
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
    setUpdatedUser({
      ...updatedUser,
      [name]:value,
    })
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
    .then(() => {
      setMessage('Profile Updated successfully')
      setUser(updatedUser);
    })
    .catch((err) => {
      setMessage('Error updating profile')
      console.log(err)
    })
  };


  return (
    <div>
      <div id='registerDiv'>
    <form action="" className="form-wrapper">
        <h1>Edit Profile</h1>

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
        value={updatedUser.additionGenre} 
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
        <input 
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
        value={updatedUser.spotify}
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

        <button id="submitButton" type="submit" onClick={handleSubmit}>UpdateProfile</button>
        {message && <div>{message}</div>}
    </form>
    </div>
    </div>
  )
}

export default EditProfile