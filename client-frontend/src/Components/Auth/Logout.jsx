import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Logout() {

    const navigate=useNavigate()
    const [ token, setToken ]=useState(localStorage.getItem('token'))

    function logout(){
        if(token){
            localStorage.clear()
            setToken(null);
        }
    }
    useEffect(()=>{
        setTimeout(()=>navigate("/"), 3000)
    },[token])

  return (
    <>
        {logout()}
        {!token
            ?<h3>You have been successfully logged out! We will be returning you to the welcome page shortly...</h3>:null}
    </>
  )
}

export default Logout