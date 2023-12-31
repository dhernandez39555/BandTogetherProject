import React, { useEffect, useState, useRef } from 'react'
import './meetBands.css'
import { Link } from 'react-router-dom'
import Map from './Map';
import { TextField, MenuItem } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import CloseIcon from '@mui/icons-material/Close';

function MeetBands() {
    const users = useRef([]);
    const [ filterUsers, setFilterUsers ] = useState("");
    const [ location, _setLocation ] = useState({ lat: 49.1081214, lng: -70.1413931 });
    const [ openFilter, setOpenFilter ] = useState(false);
    const mileFilter = useRef(10);
    const genreFilter = useRef("");

    const setLocation = (newLocation) => {
        _setLocation(newLocation);
        const closeByUsers = sortUsersByDistance(users.current, newLocation);
        users.current = closeByUsers;
        changeFilter();
    }

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

            users.current = data.foundUsers;

            // Check if geolocation is available in the browser
            if ('geolocation' in navigator) {
                // Get the user's current position
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error('Error getting user location:', error);
                });
            } else {
                console.error('Geolocation is not available in this browser.');
                fetch("http://127.0.0.1:4000/user/location")
                    .then(res => res.json())
                    .then(data => {
                        console.log(setLocation({ lat: data.location.latitude, lng: data.location.longitude }))
                    })
            }
            
            
        };
        getUsers();
    }, []);

    function sortUsersByDistance(userArr, coords) {
        // console.log(userArr);
        const usersWithDistance = userArr.map((user) => {
            if (user.latitude && user.longitude) {
                const distance = calculateDistance(
                    coords.lat,
                    coords.lng,
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

        return sortedUsers;
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
        let sortedUsers = users.current.slice(0, 10);
        if (isNaN(Number(mileFilter.current))) setFilterUsers(sortedUsers);
        if (mileFilter.current !== "") sortedUsers = sortedUsers.filter(user => convertKmToMiles(user.distance.toFixed(2)) < Number(mileFilter.current)).slice(0, 10);
        if (genreFilter.current !== "") sortedUsers = sortedUsers.filter(user => user.genre === genreFilter.current).slice(0, 10);
        setFilterUsers(sortedUsers);
    }

    const changeLocationFilter = e => {
        mileFilter.current = e.target.value;
        changeFilter();
    }

    const changeGenreFilter = e => {
        genreFilter.current = e.target.value;
        changeFilter();
    }

    return (
        <div id="meet-page">
            <div id="filter-menu">
                { openFilter
                ? <CloseIcon
                    htmlColor="#7E12B3"
                    fontSize="large"
                    onClick={()=>{setOpenFilter(!openFilter)}}
                />
                : <MapIcon
                    htmlColor="#7E12B3"
                    fontSize="large"
                    onClick={e => setOpenFilter(!openFilter)}
                />
                }
                { !openFilter ? null
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
                            <MenuItem value={"Country"}>Country</MenuItem>
                            <MenuItem value={"Rock"}>Rock</MenuItem>
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
                        { location
                            ? <Map
                                location={ location }
                                setLocation={ setLocation }
                                mileRadius={ mileFilter.current }
                                filterUsers={filterUsers}
                            />
                            : null
                        }
                    </div>
                }
            </div>
            { !filterUsers
                ? <h1>Loading Bands and Venues</h1>
                : filterUsers.length === 0
                ? <h1>Nobody in your area</h1>
                : <>
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
                                <p className="meet-band-name">{user.coverPhoto?user.bandName:user.contactName}</p>
                                <p className="meet-genre">{user.genre}</p>
                            </div>
                            <p className="meet-bio">{user.bio}</p>
                            <p>{user.location}</p>
                            <p>{user.distance !== undefined ? `${convertKmToMiles(user.distance).toFixed(2)} miles away` : "Distance: N/A"}</p>
                            <div id="meet-btns">
                                <Link to={`/profile/${user._id}`}><button>Profile</button></Link>
                                <Link to={`/messaging/${user._id}`}><button>Message</button></Link>
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