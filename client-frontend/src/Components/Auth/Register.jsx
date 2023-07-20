import React, {useState} from 'react'; 

function Register() {
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ bandName, setBandName ] = useState("")
    const [ contactName, setContactName ] = useState("")
    const [ location, setLocation ] = useState("")
    const [ genre, setGenre ] = useState("")
    const [ additionGenre, setAdditionGenre ] = useState("")
    const [ bio, setBio ] = useState("")
    const [ youtube, setYoutube ] = useState("")
    const [ spotify, setSpotify ]= useState("")
    const [ soundCloud, setSoundCloud ] = useState("")
    const [ instagram, setInstagram ] = useState("")

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

        const body = { email, password, bandName, contactName, location, 
        genre, additionGenre, bio, socials} 

        fetch(url, {
            method: "POST", 
            body: JSON.stringify(body),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        })
        .then(res => res.json())
        .catch(err => console.log(err))
    }

  return (
    <div id='registerDiv'>
    <h1>Sign Up</h1>
    <form action="" className="form-wrapper">
        
        <input type="text" name="" id="emailInput" placeholder="Enter your email here."
            onChange={e => setEmail(e.target.value)}/>
        <input type="text" name="" id="passwordInput" placeholder="Enter your password here." 
            onChange={e => setPassword(e.target.value)}/>
        <input type="text" name="" id="bandNameInput" placeholder="Enter your band's name here." 
            onChange={e => setBandName(e.target.value)}/>
        <input type="text" name="" id="contactNameInput" placeholder="Enter your main contact's name here."
            onChange={e => setContactName(e.target.value)}/>
        <input type="text" name="" id="locationInput" placeholder="Enter your location here."
            onChange={e => setLocation(e.target.value)}/>
        <div id='genreDropdown'>
        <select value={genre} onChange={handleGenreChange} id="genreInput">
            <option value="">Select a genre.</option>
            <option value="rock">Rock</option>
            <option value="jazz">Jazz</option>
            <option value="pop">Pop</option>
        </select>
        </div>
        <div id='additionGenreDropdown'>
        <select value={additionGenre} onChange={handleAddGenreChange} id="additionGenreInput">
            <option value="">Select an additional genre.</option>
            <option value="rock">Rock</option>
            <option value="jazz">Jazz</option>
            <option value="pop">Pop</option>
        </select>
        </div>
        <input type="text" name="" id="bioInput" placeholder="Enter your short bio here."
            onChange={e => setBio(e.target.value)}/>
        <input type="text" name="" id="youtubeInput" placeholder="Link to a YouTube channel/video here."
            onChange={e => setYoutube(e.target.value)}/>
        <input type="text" name="" id="spotifyInput" placeholder="Link to your Spotify page here."
            onChange={e => setSpotify(e.target.value)}/>
        <input type="text" name="" id="soundCloudInput" placeholder="Link to your SoundCloud here."
            onChange={e => setSoundCloud(e.target.value)}/>
        <input type="text" name="" id="instagramInput" placeholder="Link to your Instagram here."
            onChange={e => setInstagram(e.target.value)}/>
        <button type="button" onClick={handleSubmit}>Submit</button>
    </form>
    </div>
  )
}

export default Register