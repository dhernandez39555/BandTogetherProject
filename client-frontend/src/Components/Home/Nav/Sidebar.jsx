import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { slide as Menu } from 'react-burger-menu'
import { Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import './sidebar.css';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

function Sidebar() {

  const [ isOpen, setIsOpen ]=useState(false)
  const [ loggedInUser, setLoggedInUser ]=useState(false)

  const navigate=useNavigate()

    const handleIsOpen=(e)=>{
      if (e.target.id === "side-wrap"
          || e.target.id === "sidebar"
          || e.target.id === ""
          && e.target.parentNode.id !== "toggle-side-btn"
        ) return;
      setIsOpen(!isOpen)
    }

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

  function deleteAccount(){
    const resp=window.confirm("Are you sure you wish to delete your account?")
    if(resp){
      fetch(`http://localhost:4000/user`,{
        method:"DELETE",
        headers:new Headers({
          "Content-Type":"application.json",
          "authorization":sessionToken
        })
      })
      .then(res=>res.json())
      .catch(err=>console.log(err))
      .then(localStorage.clear())
      .then(window.alert("Account has successfully been deleted"))
      .then(setSessionToken(null))
    }
  }

  // useEffect(() => {
  //   const options = {
  //     method: "GET",
  //     headers: new Headers({
  //       "Content-Type": "application/json",
  //       "authorization": sessionToken
  //     })
  //   }

  //   fetch("http://localhost:4000/user", options)
  //     .then(res => res.json())
  //     .then(data => setLoggedInUser(data.foundUser));
  // }, []);

  useEffect(()=>{
    if(!sessionToken){setTimeout(navigate("/welcome"),1000)}
  }, [sessionToken])

  return (
    <>
    { isOpen ? <CloseIcon
        id="toggle-side-btn"
        className="side-icon"
        style={{ zIndex: 2, position: 'fixed', right: "0.5em" }}
        onClick={handleIsOpen}
        htmlColor="#DB9A35"
        fontSize="large" />
      : 
      <MenuIcon
        id="toggle-side-btn"
        className="side-icon"
        onClick={handleIsOpen}
        htmlColor="#DB9A35"
        fontSize="large" />
    }
    {
      isOpen ? 
      <div id="side-menu" onClick={handleIsOpen}>
        <div id="sidebar">
          <div id="side-wrap">
            <div id="side-img-container">
              {/* <img src={loggedInUser.profilePicture ? loggedInUser.profilePicture : "/blank.png"} alt="profile-pic" /> */}
              <img src={"/blank.png"} alt="profile-pic" />
            </div>
            <h1>{ loggedInUser.bandName ? loggedInUser.bandName : "Loading" }</h1>
            <div className="line"></div>
            <Link to={`/profile/${getUserId()}`}>
              <button 
                id='toProfileBtn' 
                onClick={handleIsOpen}>
              My Profile</button>
            </Link>
            <Link to={`/profile/edit`}>
              <button
                id='toEditProfileBtn'
              >Edit My Profile</button>
            </Link>
            <Link to={`/logout`}>
              <button 
                id='toLogoutBtn' >
              Logout</button>
            </Link>
            <Link to={`/invite`}>
              <button 
                id='toInviteBtn'>
            Invite A Friend</button>
            </Link>
            <Link>
              <button 
                id='toDeleteAccountBtn' 
                onClick={()=>{deleteAccount()}}>
              Delete Account</button>
            </Link>
          </div>
        </div>
      </div>
      : <></>
    }
    </>
  )
}

export default Sidebar