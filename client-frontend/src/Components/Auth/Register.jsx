import React, {useState} from 'react'; 

function Register() {
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ bandName, setBandName ] = useState("")
    const [ contactName, setContactName ] = useState("")
    const [ location, setLocation ] = useState("")
    const [ genre, setGenre ] = useState(undefined)
    const [ additionGenre, setAdditionGenre ] = useState(undefined)
    const [ bio, setBio ] = useState("")
    const [ youTube, setYouTube ] = useState("")
    const [ spotify, setSpotify ]= useState("")
    const [ soundCloud, setSoundCloud ] = useState("")
    const [ instagram, setInstagram ] = useState("")

    const handleOptionChange = () => {
        console.log("Hi.")
    } 

  return (
    <>
    <h1>Sign Up</h1>
    <form action="" className="form-wrapper">
        <input type="text" name="" id="emailInput" placeholder="Enter your email here."/>
        <input type="text" name="" id="passwordInput" placeholder="Enter your password here." />
        <input type="text" name="" id="bandNameInput" placeholder="Enter your band's name here." />
        <input type="text" name="" id="contactNameInput" placeholder="Enter your main contact's name here."/>
        <input type="text" name="" id="locationInput" placeholder="Enter your location here."/>
        <select value={genre} onChange={handleOptionChange} id="genreInput">
            <option value="">Select a genre.</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
        </select>
        <select value={additionGenre} onChange={handleOptionChange} id="additionGenreInput">
            <option value="">Select an additional genre.</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
        </select>
        <input type="text" name="" id="bioInput" placeholder="Enter your short bio here."/>
        <input type="text" name="" id="youtubeInput" placeholder="Link to a YouTube channel/video here."/>
        <input type="text" name="" id="spotifyInput" placeholder="Link to your Spotify page here."/>
        <input type="text" name="" id="soundCloudInput" placeholder="Link to your SoundCloud here."/>
        <input type="text" name="" id="instagramInput" placeholder="Link to your Instagram here."/>
        <button type="button">Submit</button>
    </form>
    </>
  )
}

export default Register