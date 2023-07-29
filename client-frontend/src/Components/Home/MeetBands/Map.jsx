import React, { useState } from 'react';
import LocationMarker from './LocationMarker';
import './map.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

function Map({ location, setLocation, mileRadius, filterUsers }) {
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
            { !filterUsers ? null : filterUsers.map((user, i) => <Marker key={i} position={[user.latitude, user.longitude]}><Popup>{user.bandName}</Popup></Marker>) }
        </MapContainer>
      )
}

export default Map;