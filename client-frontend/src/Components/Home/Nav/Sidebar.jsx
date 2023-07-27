import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { slide as Menu } from 'react-burger-menu'
import { Link, Outlet } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

function Sidebar() {

  const [ isOpen, setIsOpen ]=useState(false)
  const navigate=useNavigate()

    const handleIsOpen=()=>{
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
  useEffect(()=>{
    if(!sessionToken){setTimeout(navigate("/welcome"),1000)}
  }, [sessionToken])

  return (
    <Menu
      width={'75%'}
      right 
      isOpen={ isOpen } 
      noTransition 
      onOpen={handleIsOpen} 
      onClick={handleIsOpen}>
      <br/><br/><br/>
      <Link to={`/profile/${getUserId()}`}>
        <button 
          id='toProfileBtn' 
          onClick={handleIsOpen}>
        My Profile</button>
      </Link>
      <Link to={`/profile/edit`}>
        <button
          id='toEditProfileBtn'
          onClick={handleIsOpen}
        >Edit My Profile</button>
      </Link>
      <Link to={`/logout`}>
        <button 
          id='toLogoutBtn' 
          onClick={handleIsOpen}>
        Logout</button>
      </Link>
      <Link to={`/invite`}>
        <button 
          id='toInviteBtn' 
          onClick={handleIsOpen}>
      Invite A Friend</button>
      </Link>
      <Link>
        <button 
          id='toDeleteAccountBtn' 
          onClick={()=>{handleIsOpen();deleteAccount()}}>
        Delete Account</button>
      </Link>
    </Menu>
  )
}

export default Sidebar