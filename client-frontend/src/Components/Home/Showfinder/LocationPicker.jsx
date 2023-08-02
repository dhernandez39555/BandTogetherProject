import React, { useRef, useMemo, useEffect } from 'react';
import './showMap.css'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'

function LocationPicker({ location, setLocation }) {
    const map = useMap();
    const markerRef = useRef(null);
    const eventHandlers = useMemo(() => ({
        dragend() {
            if (markerRef.current === null) return;
            setLocation(markerRef.current.getLatLng());
        },
    }), []);

    useEffect (() => {
        map.locate().on("locationfound", e => {
            setLocation(e.latlng);
            map.panTo(e.latlng, map.getZoom())
        })
    }, []);

    return (
        <MapContainer id="map" center={ location } zoom={13} scrollWheelZoom={false}>
            <TileLayer
            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
                draggable={true}
                ref={markerRef}
                eventHandlers={eventHandlers}
                position={{lat: location.lat - 0.005, lng: location.lng}}
            >
                <Popup>
                    Drag Me.
                </Popup>
            </Marker>
        </MapContainer>
      )
}

export default LocationPicker;