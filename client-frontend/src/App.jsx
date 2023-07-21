import React, { useState, useEffect } from 'react'
import './App.css';
import { Routes, Route } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';

import Welcome from './Components/Welcome/Welcome';
import LearnMore from './Components/Welcome/LearnMore';

import Register from './Components/Auth/Register';
import Login from './Components/Auth/Login';

import Home from './Components/Home/Home';
import Invite from './Components/Home/Invite';
import ReadProfile from './Components/Home/Profile/ReadProfile';
import EditProfile from './Components/Home/Profile/EditProfile';
import Showfinder from './Components/Home/Showfinder/Showfinder';
import Inbox from './Components/Home/Friends/Inbox';
import Contacts from './Components/Home/Friends/Contacts';
import NewMessage from './Components/Home/Friends/Messaging/NewMessage';
import Direct from './Components/Home/Friends/Messaging/Direct';
import MeetBands from './Components/Home/MeetBands/MeetBands';
import News from './Components/Home/News/News';

function App() {

  const [ sessionToken, setSessionToken ] = useState(undefined)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setSessionToken(localStorage.getItem("token"))
    }
  })

  const updateLocalStorage = newToken => {
    localStorage.setItem("token", newToken)
    setSessionToken(newToken)
  }

  return (
    <Routes>
      <Route path='/welcome' element={ <Welcome /> } />
      <Route path='/learnmore' element={ <LearnMore /> } />
      <Route path='/register' element={ <Register updateLocalStorage={updateLocalStorage}/> } />
      <Route path='/login' element={ <Login updateLocalStorage={updateLocalStorage}/> } />
      <Route element={ <PrivateRoute /> }>
        <Route path='/' element={ <Home /> } />
        <Route path='/invite' element={ <Invite /> } />
        <Route path='/profile/:user_id' element={ <ReadProfile /> } />
        <Route path='/profile/edit' element={ <EditProfile /> } />
        <Route path='/findshows' element={ <Showfinder /> } />
        <Route path='/inbox' element={ <Inbox /> } />
        <Route path='/friends' element={ <Contacts /> } />
        <Route path='/newmessage' element={ <NewMessage /> } />
        <Route path='/messaging' element={ <Direct /> } />
        <Route path='/meetbands' element={ <MeetBands /> } />
        <Route path='/news' element={ <News /> } />
      </Route>
    </Routes>
  );
}

export default App;