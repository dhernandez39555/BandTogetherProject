import React, { useEffect, useState } from 'react'
import './meetBands.css'
import { Link } from 'react-router-dom'

function MeetBands() {
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
        }
        
        getUsers();
    }, []);



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