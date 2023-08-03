import React, { useState } from 'react';
import './locationPicker.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import LocationPickerMarker from './LocationPickerMarker'
import { TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function LocationPicker({ location, setLocation }) {
    const [ inputLocation, setInputLocation ] = useState("");

    const searchAddress = () => {
        const url = `https://nominatim.openstreetmap.org/search?q=${inputLocation.replace(" ", "+")}&format=json`
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                if (data.length === 0) throw Error("Could not find address");
                const { lat, lon } = data[0];
                setLocation({ lat, lng: lon });
                console.log(data[0].display_name);
                setInputLocation(data[0].display_name);
            })
            .catch((err) => {
                console.log(err.message);
            })
    }

    return (
        <div id="location-picker">
            <div id="location-input">
                <TextField
                    type="text"
                    name="title"
                    label="Search Address"
                    fullWidth={true}
                    value={ inputLocation }
                    onKeyDown={ e => e.key === "Enter" && searchAddress() }
                    onChange={ e => setInputLocation(e.target.value) }
                    placeholder='Event title'
                    />
                <SearchIcon
                    id="search-icon"
                    htmlColor="#7E12B3"
                    fontSize="large"
                    onClick={ e => searchAddress() }
                />
            </div>
        <MapContainer id="map" center={ location } zoom={13} scrollWheelZoom={false}>
            <TileLayer
            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationPickerMarker
                location={location}
                setLocation={setLocation}
            />
        </MapContainer>
        </div>
      )
}

export default LocationPicker;