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
    const [ bioLength, setBioLength ] = useState("0")
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

    const handleSubmit = async e => {
        e.preventDefault()

        const url = "http://127.0.0.1:4000/auth/register"
        const s3Url = "http://127.0.0.1:4000/utilities/s3-url"

        let profilePictureUrl = "";
        let coverPhotoUrl = "";

        if (profilePicture) {
            const uploadUrl = await fetch(s3Url).then(res => res.json());
    
            await fetch(uploadUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                body: profilePicture
            }).then(res => console.log(res));
            const imgUrl = uploadUrl.split("?")[0];
            profilePictureUrl = imgUrl;
        }
    
        if (coverPhoto) {
            const uploadUrl = await fetch(s3Url).then(res => res.json());

            await fetch(uploadUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                body: coverPhoto
            }).then(res => console.log(res));
    
            const imgUrl = uploadUrl.split("?")[0];
            coverPhotoUrl = imgUrl;
        }
        
        const socials = { youtube, spotify, soundCloud, instagram }

        const body = { profilePicture: profilePictureUrl, coverPhoto: coverPhotoUrl, email, password, bandName, contactName, 
        location, latitude, longitude, genre, additionGenre, bio, socials}

        console.log(body);
        
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
    
    const stageProfilePicture = async (e) => {
        const file = e.target.files[0];
        setProfilePicture(file)
    }

    const stageCoverPhoto = async (e) => {
        const file = e.target.files[0];
        setCoverPhoto(file)
    }

    const EndAdornment = ({visible, setVisible}) => {
        return <InputAdornment position="end">
            <IconButton onClick={() => setVisible(!visible)}>
                {visible ? <VisibilityOffIcon/> : <VisibilityIcon/>}
            </IconButton>
        </InputAdornment>
    }

    const handleBio = (e) => {
        setBio(e.target.value)
        setBioLength(e.target.value.length)
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
                            <img src={URL.createObjectURL(coverPhoto)} alt="cover-photo" />
                        }
                    </div>
                    
                    <input type="file" name="myFile" id="cover-upload" accept='.jpeg, .jpg, .png'
                        onChange={(e) => stageCoverPhoto(e)} />
                
                    <div id="preview-profile-pic">
                        {profilePicture === "" ?
                            <label htmlFor="file-upload">
                                <AddAPhotoOutlinedIcon id="AddProfileIcon" fontSize='large'/>
                                </label>
                        : <img src={URL.createObjectURL(profilePicture)} alt="profile-picture" />
                        }
                </div>

                <input type="file" name="myFile" id="file-upload" accept='.jpeg, .jpg, .png'
                    onChange={(e) => stageProfilePicture(e)} />
               
                <div id="emailDiv">
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
                <TextField
                    required={true}
                    fullWidth={true}
                    inputProps={{ minLength: 8 }}
                    type ={visible ? "text": "password"}
                    className="signUpInput"
                    id="passwordInput"
                    label="Password"
                    placeholder="Enter your password here." 
                    style={{marginBottom: "1em"}}
                    onChange={e => setPassword(e.target.value)}
                    InputProps={{
                        endAdornment: <EndAdornment visible={visible} setVisible={setVisible}/>
                    }}
                    />
                </div>
                <div>
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
                    <MenuItem value={"Rock"}>Rock</MenuItem>
                    <MenuItem value={"Country"}>Country</MenuItem>
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
                    <MenuItem value={"Rock"}>Rock</MenuItem>
                    <MenuItem value={"Country"}>Country</MenuItem>
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
                <TextField
                    required={true}
                    fullWidth={true}
                    multiline
                    rows={4}
                    inputProps={{ maxLength: 120 }}
                    type="text"
                    label="Bio"
                    className="signUpInput" 
                    id="bioInput"
                    placeholder="Enter your short bio here."
                    style={{marginBottom: "1em" }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">{bioLength}/120</InputAdornment>,
                    }}
                    sx={{ borderColor: 'error.main' }}
                    onChange={handleBio}/>
                </div>

                <div>
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