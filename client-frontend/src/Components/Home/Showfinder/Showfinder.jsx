import React, { useEffect, useState, useRef } from 'react'
import { TextField, MenuItem } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import PostAddIcon from '@mui/icons-material/PostAdd';
import MapIcon from '@mui/icons-material/Map';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import "./Showfinder.css"
import ShowMap from './ShowMap';
import LocationPicker from './LocationPicker';
import dayjs from 'dayjs';

dayjs()

//TODO: Send messaging to its corresponding route and fix useEffect rendering to properly re-render fetchAllEvents

function Showfinder() {
  const navigate=useNavigate();
  const sessionToken=localStorage.getItem("token");
  const getUserId = () => {
    const sessionToken = localStorage.getItem('token');
    if (sessionToken) {
        try {
            const decodedToken = jwtDecode(sessionToken);
            // console.log(decodedToken._id)
            return decodedToken._id;
        } catch (error) {
            console.log(`error decoding`,error);
        }
    }
  
    return null;
  }
  //Below are triggers for rendering
  const [ location, _setLocation ] = useState({ lat: 49.1081214, lng: -70.1413931 });
  const [ openForm, setOpenForm ] = useState(false);
  const [ isMap, setIsMap ] = useState(false);
  const [ openFilter, setOpenFilter ] = useState(false);
  const [ filterLocation, _setFilterLocation ] = useState({ lat: 49.1081214, lng: -70.1413931 });
  const mileFilter = useRef(10);
  const genreFilter = useRef("");

  //Below are for HTTP requests
  const [ isEdit, setIsEdit ] = useState(false);
  const allEvents = useRef([]);
  const [ filterEvents, setFilterEvents ] = useState("");
  const [ editID, setEditID ] = useState("");
  const [ postBody, setPostBody ] = useState({
    title:"",
    body:"",
    eventDate:"",
    genre:"",
    user: "",
    location: "",
    latitude: 0,
    longitude: 0
  });

  // Custom setLocation fx
  const setFilterLocation = (newLocation) => {
    _setFilterLocation(newLocation);
    const closeByEvents = getDistanceFromEvent(allEvents.current, newLocation);
    setFilterEvents(closeByEvents.filter(user => convertKmToMiles(user.distance) < mileFilter.current));
  }

  //DELETE function
  const deleteEvent = event_id => {
    fetch(`http://localhost:4000/event/${event_id}`,{
      method:"DELETE",
      headers:new Headers({
        "Content-Type":"application/json",
        "authorization":sessionToken
      })
    })
    .then(res=>res.json())
    .then(data => setFilterEvents(filterEvents.filter(event => event._id !== event_id)))
    .catch(err=>console.log(err))
  }

  // Get All Events
  useEffect(()=>{
    const options = {
      method:"GET",
      headers:new Headers({
        "Content-Type":"application/json",
        "authorization":sessionToken
      })
    }
    fetch("http://localhost:4000/event/all", options)
    .then(res => res.json())
    .then(data => {
      allEvents.current = data;
      setFilterEvents(data);

      if ('geolocation' in navigator) {
        // Get the user's current position
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setFilterLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
            console.error('Error getting user location:', error);
        });
      } else {
          console.error('Geolocation is not available in this browser.');
          fetch("http://127.0.0.1:4000/user/location", options)
              .then(res => res.json())
              .then(data => {
                  setFilterLocation({ lat: data.location.latitude, lng: data.location.longitude })
              })
      }
    })
    .catch(err => console.log(err))
  },[])

  function getDistanceFromEvent(eventArr, coords) {
    // console.log(eventArr);
    const addDistanceToEvent = eventArr.map((event) => {
        if (event.latitude && event.longitude) {
            const distance = calculateDistance(
                coords.lat,
                coords.lng,
                event.latitude,
                event.longitude
            );
            return { ...event, distance };
        }
        return event;
    });

    return addDistanceToEvent;
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const earthRadius = 6371; //kilometers
      
      const degToRad = (deg) => (deg * Math.PI) / 180;
      const dLat = degToRad(lat2 - lat1);
      const dLon = degToRad(lon2 - lon1);
      
      const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = earthRadius * c;
      
      return distance;
  };

  const convertKmToMiles = (km) => {
      const milesInKm = 0.621371;
      return km * milesInKm;
  }

  const changeFilter = () => {
      let sortedEvents = allEvents.current;
      if (isNaN(Number(mileFilter.current))) setFilterEvents(sortedEvents);
      if (mileFilter.current !== "") sortedEvents = sortedEvents.filter(event => convertKmToMiles(event.distance) < Number(mileFilter.current));
      if (genreFilter.current !== "") sortedEvents = sortedEvents.filter(event => event.genre === genreFilter.current);
      setFilterEvents(sortedEvents);
  }

  const changeLocationFilter = e => {
      mileFilter.current = e.target.value;
      changeFilter();
  }

  const changeGenreFilter = e => {
      genreFilter.current = e.target.value;
      changeFilter();
  }

  const setLocation = (newLocation) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${newLocation.lat}&lon=${newLocation.lng}&format=json`

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const { city, town, county, country, state } = data.address;
        console.log(city ? city : town ? town : county);
        const formatLocation = `${ city ? city : town ? town : county }, ${state}, ${country}` 
        setPostBody(prevData => ({
          ...prevData,
          location: formatLocation,
          latitude: newLocation.lat,
          longitude: newLocation.lng
        }))
      })
      .catch((err) => {
          console.log("Error location cannot be found", err);
      })

    _setLocation(newLocation);
  }

  // Overall Render function
  const renderEvents=()=>{
    return filterEvents.length === 0 || !filterEvents
      ? <p>Loading Events...</p>
      : <div className="event-post">
        { filterEvents.map((event)=>(
          <div className="event-wrapper" key={event._id}>
            <div className="event-title">
              <h2 className='titleEach'>{event.title}</h2>
              <div className="event-subtitle">
                <h4 className='dateEach'>{dayjs(event.eventDate).format('MM/DD/YYYY hh:mm a')}</h4>
                <h4 className="genreEach">{event.genre}</h4>
              </div>
            </div>
            <div id='event-texts'>
              <h2 className='userEach'>{event.user.bandName}</h2>
              <p className='bodyEach'>{event.body}</p>
            </div>
            <div className='options'>
            { event.user._id === getUserId()
              ? 
              <>
                <button className='editBtn' onClick={e => { setIsEdit(true); setupPostForm(event); }}>Edit</button>
                <button className='deleteBtn' onClick={e=>{deleteEvent(event._id)}}>Delete</button>
              </>
              :
              <>
                <button className='profileBtn' onClick={e=>profileNav(event.user._id)}>Profile</button>
                <button className='messageBtn' onClick={e=>messageNav(event.user._id)}>Message</button>
              </>
            }
            </div>
          </div>
        ))}
      </div>
  }
  //External Nav functions  
  
  const profileNav = (_id) => {
    navigate(`/profile/${_id}`);
  }

  const messageNav = (_id) => {
    navigate(`/messaging/${_id}`);
  }
  
  //POST functions
  function handleEventFetch(){
    const url = isEdit
      ? `http://localhost:4000/event/${editID}`
      : "http://localhost:4000/event/";
    
    const options = {
      method: isEdit ? "PUT" : "POST",
      headers: new Headers({
        "Content-Type":"application/json",
        "authorization":sessionToken
      }),
      body:JSON.stringify(postBody)
    }

    fetch(url, options)
      .then(res=>res.json())
      .then(data=> {
        allEvents.current = [...allEvents.current, data.newEvent];
      })
      .catch(err=>console.log(err));

    closePostForm();
  }

  const setupPostForm = (event) => {
    isEdit ? setEditID(event._id) : null;
    setPostBody({
      title: isEdit ? event.title : "",
      body: isEdit ? event.body : "",
      eventDate: isEdit ? event.eventDate : "",
      genre: isEdit ? event.genre : "",
      user: isEdit ? event.user : "",
      location:  isEdit ? event.location : "",
      latitude:  isEdit ? event.latitude : "",
      longitude:  isEdit ? event.longitude : ""
    })
  }

  const closePostForm=()=>{
    setIsEdit(false);
    setOpenForm(false);
    setEditID("");
    setPostBody({
      title: "",
      body: "",
      eventDate: "",
      genre: "",
      user: "",
      location: "",
      latitude: "",
      longitude: ""
    })
  }

  //Shared PUT and POST functions
  const updatePostBody=(e)=>{
    if (!e.target) {
      setPostBody(prevData => ({
        ...prevData,
        ["eventDate"]: e.$d
      }));
      return;
    }
    const {name, value} = e.target;
    setPostBody(prevData => ({
      ...prevData,
      [name]: value
    }));
  }

  //need fx to check if event poster is current user
  //cndt'l off of above to render buttons 'edit'+'delete'
  //add functionality to bring up modal prompt for edit and prompt for deletion certainty

  return (
    <>
      <div id='event-page'>
        <div id="event-btns">
          { openFilter
          ? <CloseIcon
              htmlColor="#7E12B3"
              fontSize="large"
              onClick={()=>{setOpenFilter(!openFilter)}}
            />
          : <MapIcon
              htmlColor="#7E12B3"
              fontSize="large"
              onClick={()=>{setOpenFilter(!openFilter);setOpenForm(false)}}
            />
          }
          { openForm
          ? <CloseIcon
              htmlColor="#7E12B3"
              fontSize="large"
              onClick={()=>{setOpenForm(!openForm)}}
            />
          : <PostAddIcon
              htmlColor="#7E12B3"
              fontSize="large"
              onClick={()=>{setOpenForm(!openForm);setOpenFilter(false)}}
            />
          }
        </div>
        {!openFilter
          ? null
          :
          <div id="filter-form">
            <TextField
              label="Miles"
              className="filter-input"
              value={mileFilter.current}
              onChange={changeLocationFilter}
              fullWidth={true}
            />

            <TextField
              select={true}
              label="Genre"
              className="filter-input"
              value={genreFilter.current}
              onChange={changeGenreFilter}
              fullWidth={true}
            >
              <MenuItem value=""></MenuItem>
              <MenuItem value={"rock"}>Rock</MenuItem>
              <MenuItem value={"jazz"}>Jazz</MenuItem>
              <MenuItem value={"pop"}>Pop</MenuItem>
            </TextField>
            { filterLocation
                ? <ShowMap
                  filterLocation={ filterLocation }
                  setFilterLocation={ setFilterLocation }
                  mileRadius={ mileFilter.current }
                  filterEvents={ filterEvents }
                />
                : null
            }
          </div>
        }
        {!openForm
          ? renderEvents()
          : isMap ?
            <>
            <LocationPicker
              location={ location }
              setLocation={ setLocation }
            />
            <button id="close-map-btn" onClick={e => setIsMap(false)}>Set Location</button>
            </>
            : 
            <div id="post-form-wrapper">
              <div id="post-form">
                <TextField
                  type="text"
                  name="title"
                  label="Event Title"
                  value={ postBody.title }
                  onChange={ e => updatePostBody(e) }
                  placeholder='Event title'
                />
                <TextField
                  type="text"
                  name="genre"
                  label="Event Genre"
                  value={ postBody.genre }
                  onChange={ e => updatePostBody(e) }
                  placeholder='Event genre'
                />
                <DateTimePicker
                  id="datePicker"
                  disablePast={true}
                  name="eventDate"
                  defaultValue={dayjs()}
                  label="Event Date"
                  value={ postBody.eventDate }
                  onChange={ e => updatePostBody(e) }
                />
                <TextField
                  type="text"
                  name="body"
                  multiline
                  rows={3}
                  label="Event Description"
                  value={ postBody.body }
                  onChange={ e => updatePostBody(e) }
                  placeholder='Event description'
                />
                <TextField
                  type="text"
                  name="location"
                  label="Event Location"
                  value={ postBody.location }
                  onFocus={ e => setIsMap(true) }
                  disabled={ isMap }
                  placeholder='Event Location'
                />
                <div id='selectBtns'>
                  <button onClick={ e => handleEventFetch() }>Submit</button>
                  <button onClick={ e => closePostForm() }>Cancel</button>
                </div>
              </div>
            </div>
        }
      </div>
    </>
  )
}

export default Showfinder
