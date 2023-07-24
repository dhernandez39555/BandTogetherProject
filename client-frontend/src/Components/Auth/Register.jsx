import React, {useEffect, useState} from 'react'; 
import "./register.css"

function Register({ updateLocalStorage }) {
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ bandName, setBandName ] = useState("")
    const [ contactName, setContactName ] = useState("")
    const [ location, setLocation ] = useState("")
    const [ latitude, setLatitude ] = useState("")
    const [ longitude, setLongitude ] = useState("")
    const [ genre, setGenre ] = useState("")
    const [ additionGenre, setAdditionGenre ] = useState("")
    const [ bio, setBio ] = useState("")
    const [ youtube, setYoutube ] = useState("")
    const [ spotify, setSpotify ]= useState("")
    const [ soundCloud, setSoundCloud ] = useState("")
    const [ instagram, setInstagram ] = useState("")

    useEffect(() => {
        if('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    setLatitude(latitude)
                    setLongitude(longitude)
                    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`

                    fetch(url)
                        .then((res) => res.json())
                        .then((data) => {
                            const { city, country, state, postcode } = data.address;
                            const formatLocation = `${city}, ${state}, ${country}` 
                            setLocation(formatLocation)
                        })
                        .catch((err) => {
                            console.log("Error location cannot be found", err);
                        })
                }

            )
        }
    }, [])

    const handleLocationChange = e => {
        setLocation(e.target.value)
    }

    
    const handleGenreChange = (e) => {
        setGenre(e.target.value)
    }

    const handleAddGenreChange = (e) => {
        setAdditionGenre(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault()

        const url = "http://127.0.0.1:4000/auth/register"

        const socials = { youtube, spotify, soundCloud, instagram }

        const body = { email, password, bandName, contactName, 
        location, latitude, longitude, genre, additionGenre, bio, socials} 

        fetch(url, {
            method: "POST", 
            body: JSON.stringify(body),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        })
        .then(res => res.json())
        .then(data => updateLocalStorage(data.token))
        .catch(err => console.log(err))
    }

  return (
    <div id='registerDiv'>
    <form action="" className="form-wrapper">
        <h1>Sign Up</h1>
        <div id="emailDiv">
        <label htmlFor="emailInput">Email Address:</label>
        <input type="text" name="" id="emailInput" placeholder="Enter your email here."
            onChange={e => setEmail(e.target.value)}/>
        </div>

        <div>
        <label htmlFor="passwordInput">Password:</label>
        <input type="text" name="" id="passwordInput" placeholder="Enter your password here." 
            onChange={e => setPassword(e.target.value)}/>
        </div>

        <div>
        <label htmlFor="bandNameInput">Band Name:</label>
        <input type="text" name="" id="bandNameInput" placeholder="Enter your band's name here." 
            onChange={e => setBandName(e.target.value)}/>
        </div>

        <div>
        <label htmlFor="contactNameInput">Contact Name:</label>
        <input type="text" name="" id="contactNameInput" placeholder="Enter your main contact's name here."
            onChange={e => setContactName(e.target.value)}/>
        </div> 

        <div>
        <label htmlFor="locationInput">Location:</label>
            {location ? (
                <input 
                type="text"
                name="location" 
                id="locationInput" 
                value={location}
                placeholder="Enter your location here."
                onChange={handleLocationChange}/>
            ) : (
                <input
                    type='text'
                    id='locationInput'
                    name='location'
                    placeholder='Enter your location here'
                    onChange={handleLocationChange}/>
            )}
        </div>

        <div id='genreDropdown'>
        <label htmlFor="genreInput">Genre:</label>
        <select value={genre} onChange={handleGenreChange} id="genreInput">
            <option value="">Select a genre.</option>
            <option value="rock">Rock</option>
            <option value="jazz">Jazz</option>
            <option value="pop">Pop</option>
        </select>
        </div>

        <div id='additionGenreDropdown'>
        <label htmlFor="additionalGenreInput">Genre:</label>
        <select value={additionGenre} onChange={handleAddGenreChange} id="additionGenreInput">
            <option value="">Select an additional genre.</option>
            <option value="rock">Rock</option>
            <option value="jazz">Jazz</option>
            <option value="pop">Pop</option>
        </select>
        </div>

        <div>
        <label htmlFor="bioInput">Bio:</label>
        <input type="text" name="" id="bioInput" placeholder="Enter your short bio here."
            onChange={e => setBio(e.target.value)}/>
        </div>

        <div>
        <label htmlFor="youtubeInput">YouTube Link:</label>
        <input type="text" name="" id="youtubeInput" placeholder="Link to a YouTube channel/video here."
            onChange={e => setYoutube(e.target.value)}/>
        </div>

        <div>
        <label htmlFor="spotifyInput">Spotify Link:</label>
        <input type="text" name="" id="spotifyInput" placeholder="Link to your Spotify page here."
            onChange={e => setSpotify(e.target.value)}/>
        </div>

        <div>
        <label htmlFor="soundCloudInput">SoundCloud Link:</label>
        <input type="text" name="" id="soundCloudInput" placeholder="Link to your SoundCloud here."
            onChange={e => setSoundCloud(e.target.value)}/>
        </div>

        <div>
        <label htmlFor="instagramInput">Instagram Link:</label>
        <input type="text" name="" id="instagramInput" placeholder="Link to your Instagram here."
            onChange={e => setInstagram(e.target.value)}/>
        </div>

        <button id="submitButton" type="button" onClick={handleSubmit}>Submit</button>
    </form>
    </div>
  )
}

export default Register