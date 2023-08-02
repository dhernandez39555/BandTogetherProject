import React, { useState } from 'react';
import LocationMarker from '../MeetBands/LocationMarker';
import './showMap.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

function ShowMap({ location, setLocation, mileRadius, filterEvents }) {
    const [ userLocation, setUserLocation ] = useState(location);

    return (
        <MapContainer id="map" center={location} zoom={13} scrollWheelZoom={false}>
            <TileLayer
            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            { !userLocation
                ? null
                :
                <Marker id="user-marker" position={userLocation} >
                    <Popup>Your location</Popup>
                </Marker>
            }
            <LocationMarker
                location={location}
                setUserLocation={setUserLocation}
                setLocation={setLocation}
                mileRadius={mileRadius}
            />
            { !filterEvents
                ? null
                : filterEvents.map((event, i) =>
                    <Marker key={i} position={[event.latitude, event.longitude]}>
                        <Popup>
                            <div className="popup">
                                <p>{ event.user.bandName }</p>
                                <p>{ event.eventDate }</p>
                                <p>{ event.genre }</p>
                                <Link className="popup-link" to={`/profile/${ event.user._id }`}><PersonIcon className="popup-icon" htmlColor="#7E12B3" fontSize="large" /></Link>
                                <Link className="popup-link" to={`/messaging/${ event.user._id }`}><EmailIcon className="popup-icon" htmlColor="#7E12B3" fontSize="large" /></Link>
                            </div>
                        </Popup>
                    </Marker>
                )
            }
        </MapContainer>
      )
}

export default ShowMap;