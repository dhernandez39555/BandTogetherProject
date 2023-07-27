import React, { useEffect, useState } from 'react'
import './meetBands.css'
import { Link } from 'react-router-dom'
import { TextField, MenuItem } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';

function MeetBands() {
    const [ users, setUsers ] = useState([]);
    const [ filterUsers, setFilterUsers ] = useState([]);
    const [ latitude, setLatitude ] = useState(null)
    const [ longitude, setLongitude ] = useState(null)
    const [ locationFilter, setLocationFilter ] = useState(50)
    const [ genreFilter, setGenreFilter ] = useState("")

    useEffect(() => {
        const getUsers = async () => {
            const options = {
                method: 'GET',
                headers: new Headers({
                'Content-Type': 'application/json',
                authorization: localStorage.getItem('token'),
                }),
            };
        
            const res = await fetch('http://127.0.0.1:4000/user/all', options);
            const data = await res.json();
        
            // Check if geolocation is available in the browser
            if ('geolocation' in navigator) {
                // Get the user's current position
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude: currentLatitude, longitude: currentLongitude } = position.coords;
                    setLatitude(currentLatitude);
                    setLongitude(currentLongitude);
        
                    const usersWithDistance = data.foundUsers.map((user) => {
                        if (user.latitude && user.longitude) {
                            const distance = calculateDistance(
                                currentLatitude,
                                currentLongitude,
                                user.latitude,
                                user.longitude
                            );
                            return { ...user, distance };
                        }
                        return user;
                    });
            
                    const sortedUsers = usersWithDistance.sort((a, b) => {
                        if (a.distance === undefined && b.distance === undefined) {
                            return 0;
                        } else if (a.distance === undefined) {
                            return 1;
                        } else if (b.distance === undefined) {
                            return -1;
                        }
                        return a.distance - b.distance;
                    })
        
                    setUsers(sortedUsers);
                    setFilterUsers(sortedUsers.slice(0, 4).filter(user => user.distance < locationFilter));
                },
                (error) => {
                    console.error('Error getting user location:', error);
                });
            } else {
                console.error('Geolocation is not available in this browser.');
            }
        };
        getUsers();
    }, []);

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
    };

    const changeFilter = () => {
        if (isNaN(Number(locationFilter))) return;
        let sortedUsers = users.slice(0, 4);
        if (locationFilter !== "") sortedUsers = users.filter(user => user.distance < Number(locationFilter)).slice(0, 4);
        if (genreFilter !== "") sortedUsers = users.filter(user => user.genre === genreFilter).slice(0, 4);
        setFilterUsers(sortedUsers);
    }

    const changeLocationFilter = e => {
        setLocationFilter(e.target.value);
        changeFilter();
    }

    const changeGenreFilter = e => {
        setGenreFilter(e.target.value);
        changeFilter();
    }

    return (
        <div id="meet-page">
            { !filterUsers
                ? <h1>Error while loading, please refresh</h1>
                : filterUsers.length === 0
                ? <h1>Loading</h1>
                : <>
                <div id="filter-form">
                    { locationFilter !== "" && genreFilter !== "" ? <FilterListIcon onClick={e => changeFilter()} /> : <FilterListOffIcon onClick="" />}
                    <TextField
                        label="Miles"
                        value={locationFilter}
                        onChange={changeLocationFilter}
                        fullWidth={true}
                    />

                    <TextField
                        select={true}
                        label="Genre"
                        value={genreFilter}
                        onChange={changeGenreFilter}
                        fullWidth={true}
                    >
                        <MenuItem value=""></MenuItem>
                        <MenuItem value={"rock"}>Rock</MenuItem>
                        <MenuItem value={"jazz"}>Jazz</MenuItem>
                        <MenuItem value={"pop"}>Pop</MenuItem>
                    </TextField>
                </div>
                { filterUsers.map((user, i) => {
                    return (
                    <div key={i} className="meet-preview-profile">
                        <div className="meet-cover">
                            { user.coverPhoto
                                ? <img src={user.coverPhoto} alt="cover-photo" />
                                : <h1>{user.bandName}</h1>}
                        </div>
                        <div className="meet-bottom">
                            <div className="meet-img-container">
                                <img src={ user.profilePicture || "/blank.png" } alt="cover-photo" />
                            </div>
                            <div className="meet-header">
                                <p className="meet-band-name">{user.bandName}</p>
                                <p className="meet-genre">{user.genre}</p>
                            </div>
                            <p className="meet-bio">{user.bio}</p>
                            <p>{user.location}</p>
                            <p>{user.distance !== undefined ? `${convertKmToMiles(user.distance).toFixed(2)} miles away` : "Distance: N/A"}</p>
                            <div id="meet-btns">
                                <Link to={`/profile/${user._id}`}><span>Profile</span></Link>
                                <Link to={`/messaging/${user._id}`}><span>Message</span></Link>
                            </div>
                        </div>
                    </div>
                )})}
            </>
            }
        </div>
    )
}

export default MeetBands