import React, { useState } from 'react'

function EditProfile({ initialProfileData, updateLocalStorage }) {

  const {
    email: initialEmail,
    password: initialPassword,
    bandName: initialBandName,
    contactName: initialContactName,
    location: initialLocation,
    genre: initialGenre,
    additionGenre: initialAdditionGenre,
    bio: initialBio,
    youtube: initialYoutube,
    spotify: initialSpotify,
    soundCloud: initialSoundCloud,
    instagram: initialInstagram,
  } = initialProfileData;

  const [ email, setEmail ] = useState(initialEmail);
  const [ password,setPassword ] = useState(initialPassword);
  const [ bandName, setBandName ] = useState(initialBandName);
  const [ contactName, setContactName] = useState(initialContactName);
  const [ location, setLocation ] = useState(initialLocation);
  const [ genre, setGenre ] = useState(initialGenre);
  const [ additionGenre, setAdditionGenre] = useState(initialAdditionGenre);
  const [ bio, setBio ] = useState(initialBio);
  const [ youtube, setYoutube ] = useState(initialYoutube);
  const [ spotify, setSpotify ] = useState(initialSpotify);
  const [ soundCloud, setSoundCloud ] = useState(initialSoundCloud);
  const [ instagram, setInstagram ] = useState(initialInstagram);

  const handleGenreChange = (e) => {
    setGenre(e.target.value)
}

const handleAddGenreChange = (e) => {
    setAdditionGenre(e.target.value)
}

  const handleSubmit = e => {
    e.preventDefault();

    const url = "http://127.0.0.1:4000/user/"

    const socials = { youtube, spotify, soundCloud, instagram };

    const body = {
      email, 
      password,
      bandName,
      contactName,
      location,
      genre,
      additionGenre,
      bio,
      socials,
    };

    fetch(url, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: new Headers({
        "Content-Type": "application/json",
      })
    })
    .then((res) => res.json())
    .then((data) => {
      updateLocalStorage(data.token);
    })
    .catch((err) => console.log(err));
  } 


  return (
    <div>
      <div id='registerDiv'>
    <form action="" className="form-wrapper">
        <h1>Edit Profile</h1>

        <div id="emailDiv">
        <label htmlFor="emailInput">Email Address:</label>
        <input 
        type="text" 
        name="" 
        id="emailInput" 
        placeholder="Enter your email here." 
        value={email}
        onChange={e => setEmail(e.target.value)}
        />
        </div>

        <div>
        <label htmlFor="passwordInput">Password:</label>
        <input 
        type="text"
        name="" 
        id="passwordInput" 
        placeholder="Enter your password here." 
        onChange={e => setPassword(e.target.value)}
        />
        </div>

        <div>
        <label htmlFor="bandNameInput">Band Name:</label>
        <input 
        type="text" 
        name="" 
        id="bandNameInput" 
        placeholder="Enter your band's name here." 
        onChange={e => setBandName(e.target.value)}
        />
        </div>

        <div>
        <label htmlFor="contactNameInput">Contact Name:</label>
        <input 
        type="text" 
        name="" 
        id="contactNameInput" 
        placeholder="Enter your main contact's name here."
        onChange={e => setContactName(e.target.value)}
        />
        </div> 

        <div>
        <label htmlFor="locationInput">Location:</label>
        <input 
        type="text" 
        name="" 
        id="locationInput" placeholder="Enter your location here."
        onChange={e => setLocation(e.target.value)}
        />
        </div>

        <div id='genreDropdown'>
        <label htmlFor="genreInput">Genre:</label>
        <select 
        value={genre} 
        onChange={handleGenreChange} 
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
        value={additionGenre} 
        onChange={handleAddGenreChange} 
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
        name="" 
        id="bioInput" placeholder="Enter your short bio here."
        onChange={e => setBio(e.target.value)}
        />
        </div>

        <div>
        <label htmlFor="youtubeInput">YouTube Link:</label>
        <input 
        type="text" 
        name="" 
        id="youtubeInput" placeholder="Link to a YouTube channel/video here."
        onChange={e => setYoutube(e.target.value)}
        />
        </div>

        <div>
        <label htmlFor="spotifyInput">Spotify Link:</label>
        <input 
        type="text" 
        name="" 
        id="spotifyInput" placeholder="Link to your Spotify page here."
        onChange={e => setSpotify(e.target.value)}
        />
        </div>

        <div>
        <label htmlFor="soundCloudInput">SoundCloud Link:</label>
        <input 
        type="text" 
        name="" 
        id="soundCloudInput" placeholder="Link to your SoundCloud here."
        onChange={e => setSoundCloud(e.target.value)}
        />
        </div>

        <div>
        <label htmlFor="instagramInput">Instagram Link:</label>
        <input 
        type="text" 
        name="" 
        id="instagramInput" placeholder="Link to your Instagram here."
        onChange={e => setInstagram(e.target.value)}
        />
        </div>

        <button id="submitButton" type="button" onClick={handleSubmit}>Submit</button>
    </form>
    </div>
    </div>
  )
}

export default EditProfile