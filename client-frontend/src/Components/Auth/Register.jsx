import React, {useEffect, useState} from 'react'; 
import { Navigate } from 'react-router-dom';
import "./register.css"; 
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { TextField, MenuItem } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom'; 
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IconButton, InputAdornment } from '@mui/material';

function Register({ updateLocalStorage }) {
    const navigate=useNavigate()
    const [profilePicture, setProfilePicture] = useState("")
    const [coverPhoto, setCoverPhoto] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ visible, setVisible ] = useState(false)
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

        const body = { profilePicture, coverPhoto, email, password, bandName, contactName, 
        location, latitude, longitude, genre, additionGenre, bio, socials} 
        
        fetch(url, {
            method: "POST", 
            body: JSON.stringify(body),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        })
        .then(res => res.json())
        .then(data => !data.token?alert("Please fill in all fields that have an asterisk beside them."):updateLocalStorage(data.token))
        .catch(err => console.log(err))
    }
    
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
    
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const base64 = await  convertToBase64(file)
        setProfilePicture(base64)
    }

    const handleCoverUpload = async (e) => {
        const file = e.target.files[0];
        const coverBase64 = await convertToBase64(file)
        setCoverPhoto(coverBase64) 
    }

    const EndAdornment = ({visible, setVisible}) => {
        return <InputAdornment position="end">
            <IconButton onClick={() => setVisible(!visible)}>
                {visible ? <VisibilityOffIcon/> : <VisibilityIcon/>}
            </IconButton>
        </InputAdornment>
    }

  return (
    <>
    { localStorage.getItem("token") ? <Navigate to="/" /> : 
    <main id='register-main'>
        <ArrowBackIosIcon fontSize='large' id="backArrow"
        onClick={() => navigate(`/welcome`)}/>
        <div id='registerDiv'>
            <form className="form-wrapper">
                <h1>Sign Up</h1>
                
                    <div id="preview-cover" >
                        {coverPhoto === "" ?
                            <label htmlFor="cover-upload">
                                <AddPhotoAlternateIcon id="addCoverIcon" fontSize='medium'/>
                            </label>
                            :
                            <img src={coverPhoto} alt="cover-photo" />
                        }
                    </div>
                    
                    <input type="file" name="myFile" id="cover-upload" accept='.jpeg, .jpg, .png'
                        onChange={(e) => handleCoverUpload(e)} />
                
                    <div id="preview-profile-pic">
                        {profilePicture === "" ?
                            <label htmlFor="file-upload">
                                <AddAPhotoOutlinedIcon id="AddProfileIcon" fontSize='large'/>
                                </label>
                        : <img src={profilePicture} alt="profile-picture" />
                        }
                </div>

                <input type="file" name="myFile" id="file-upload" accept='.jpeg, .jpg, .png'
                    onChange={(e) => handleFileUpload(e)} />

                

                <div id="emailDiv">
                {/* <label htmlFor="emailInput">Email Address:</label> */}
                <TextField
                    required={true}
                    fullWidth={true}
                    type="email"
                    className="signUpInput"
                    id="emailInput"
                    label="Email"
                    placeholder='Enter your email here.'
                    style={{marginBottom: "1em"}}
                    onChange={e => setEmail(e.target.value)}
                    />
                </div>
                
                <div>
                {/* <label htmlFor="passwordInput">Password:</label> */}
                <TextField
                    required={true}
                    fullWidth={true}
                    inputProps={{ minLength: 8 }}
                    type="password"
                    className="signUpInput"
                    id="passwordInput"
                    label="Password"
                    placeholder="Enter your password here." 
                    style={{marginBottom: "1em"}}
                    onChange={e => setPassword(e.target.value)}/>
                </div>
                <div>
                {/* <label htmlFor="bandNameInput">Band Name:</label> */}
                <TextField
                    required={true}
                    fullWidth={true}
                    type="text"
                    className="signUpInput"
                    id="bandNameInput" 
                    label="Band Name"
                    placeholder="Enter your band's name here."
                    style={{marginBottom: "1em"}} 
                    onChange={e => setBandName(e.target.value)}/>
                </div>

                <div>
                {/* <label htmlFor="contactNameInput">Contact Name:</label> */}
                <TextField
                    required={true}
                    fullWidth={true}
                    type="text"
                    className="signUpInput"
                    id="contactNameInput"
                    label="Contact Name"
                    placeholder="Enter your main contact's name here."
                    style={{marginBottom: "1em"}}
                    onChange={e => setContactName(e.target.value)}/>
                </div> 

                <div>
                {/* <label htmlFor="locationInput">Location:</label> */}
                    {location ? (
                        <TextField 
                        fullWidth={true}
                        type="text"
                        name="location"
                        className="signUpInput" 
                        id="locationInput" 
                        value={location}
                        placeholder="Enter your location here."
                        style={{marginBottom: "1em"}}
                        onChange={handleLocationChange}/>
                    ) : (
                        <TextField
                            fullWidth={true}
                            type='text'
                            className="signUpInput" 
                            id='locationInput'
                            name='location'
                            placeholder='Enter your location here'
                            style={{marginBottom: "1em"}}
                            onChange={handleLocationChange}/>
                    )}
                </div>
        
                <div id='genreDropdown'>
                {/* <label htmlFor="genreInput">Genre:</label> */}
                <TextField
                    required={true}
                    fullWidth={true}
                    select={true}
                    className="signUpInput"
                    id="genreInput"
                    value={genre}
                    label="Genre"
                    style={{marginBottom: "1em"}}
                    onChange={handleGenreChange}
                >
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
                    className="signUpInput"
                    id="additionGenreInput"
                    value={additionGenre}
                    label="Additional Genre"
                    style={{marginBottom: "1em"}}
                    onChange={handleAddGenreChange}
                >
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
                    multiline
                    rows={4}
                    // inputProps={{ maxLength: 120 }}
                    type="text"
                    label="Bio"
                    className="signUpInput" 
                    id="bioInput"
                    placeholder="Enter your short bio here."
                    style={{marginBottom: "1em"}}
                    onChange={e => setBio(e.target.value)}/>
                </div>

                <div>
                {/* <label htmlFor="youtubeInput">YouTube Link:</label> */}
                <TextField
                    fullWidth={true}
                    type="text"
                    label="YouTube"
                    className="signUpInput"
                    id="youtubeInput"
                    placeholder="Link to a YouTube channel/video here."
                    style={{marginBottom: "1em"}}
                    onChange={e => setYoutube(e.target.value)}/>
                </div>

                <div>
                {/* <label htmlFor="spotifyInput">Spotify Link:</label> */}
                <TextField
                    fullWidth={true}
                    type="text"
                    label="Spotify"
                    className="signUpInput"
                    id="spotifyInput"
                    placeholder="Link to your Spotify track here."
                    style={{marginBottom: "1em"}}
                    onChange={e => setSpotify(e.target.value)}/>
                </div>

                <div>
                {/* <label htmlFor="soundCloudInput">SoundCloud Link:</label> */}
                <TextField
                    fullWidth={true}
                    type="text"
                    label="SoundCloud"
                    className="signUpInput"
                    id="soundCloudInput"
                    placeholder="Link to your SoundCloud here."
                    style={{marginBottom: "1em"}}
                    onChange={e => setSoundCloud(e.target.value)}/>
                </div>

                <div>
                {/* <label htmlFor="instagramInput">Instagram Link:</label> */}
                <TextField
                    fullWidth={true}
                    type="text"
                    label="Instagram"
                    className="signUpInput"
                    id="instagramInput"
                    placeholder="Link to your Instagram here."
                    style={{marginBottom: "1em"}}
                    onChange={e => setInstagram(e.target.value)}/>
                </div>

                        
            </form>
        </div>
    </main>
    }
    {localStorage.getItem('token')
        ?null
        :
        <footer id="footer-submit">
            <button id="registerSubmitButton" type="button" onClick={handleSubmit}>Submit</button>
        </footer>
    }    
    </> 
  )
}

export default Register