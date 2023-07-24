import React, { useEffect, useState } from 'react'
import './meetBands.css'
import { Link } from 'react-router-dom'

function MeetBands({ latitude, longitude}) {
    const [ users, setUsers ] = useState([]);

    useEffect(() => {

        const getUsers = async () => {
            const options = {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem("token")
                })
            }
            
            const res = await fetch("http://127.0.0.1:4000/user/all", options);
            const data = await res.json();

            setUsers(data.foundUsers);
    };

    getUsers();
}, []);

    useEffect(() => {
        if (latitude && longitude) {
            setUsers((prevUsers) => {
            return prevUsers.map((user) => {
        if (user.latitude && user.longitude) {
            const distance = calculateDistance(latitude, longitude, user.latitude, user.longitude);
            return { ...user, distance };
        }
        return user;
        }).filter((user) => user.latitude && user.longitude).sort((a, b) => a.distance - b.distance);
    });
    }
}, [latitude, longitude]);

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371; 
    // kilometers ^ 
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = earthRadius * c;
    return distance;
};
const degToRad = (deg) => deg * (Math.PI / 180);



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
                            <p>Distance: {user.distance.toFixed(2)} km</p>
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