import React, { useEffect, useState } from 'react'
import './meetBands.css'
import { Link } from 'react-router-dom'

function MeetBands() {
    const [ users, setUsers ] = useState([]);
    const [ latitude, setLatitude ] = useState(null)
    const [ longitude, setLongitude ] = useState(null)


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
            navigator.geolocation.getCurrentPosition(
            (position) => {
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
                });
    
                setUsers(sortedUsers);
            },
            (error) => {
                console.error('Error getting user location:', error);
            }
            );
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
    


    return (
        <div id="meet-page">
            { !users
                ? <h1>Error while loading, please refresh</h1>
                : users.length === 0
                ? <h1>Loading</h1>
                : users.map((user, i) => {
                    return (
                    <div key={i} className="preview-profile">
                        <h1>{user.bandName}</h1>
                        <p className="genre">{user.genre}</p>
                        <p>{user.bandName}</p>
                        <p>{user.bio}</p>
                        {user.distance !== undefined ? ( 
                            <p>Distance: {convertKmToMiles(user.distance).toFixed(2)} miles</p>
                        ) :
                            <p>Distance: N/A</p>
                        }
                        <div id="meet-btns">
                            <Link to={`/profile/${user._id}`}><span>Profile</span></Link>
                            <Link to="/message"><span>Message</span></Link>
                        </div>
                    </div>   
                    )
                })
            }
        </div>
    )
}

export default MeetBands