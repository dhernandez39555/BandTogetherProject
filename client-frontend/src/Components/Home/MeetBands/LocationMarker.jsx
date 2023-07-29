import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Circle, Marker, useMap, Popup, LayersControl } from 'react-leaflet';
import './locationMarker.css';

function LocationMarker({ location, setLocation, setUserLocation, mileRadius }) {
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
            setUserLocation(e.latlng);
            map.panTo(e.latlng, map.getZoom())
        })
    }, []);

    return (
        <LayersControl position="topright">
            <LayersControl.Overlay name="Change Location">
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
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Miles Radius">
                <Circle center={location} radius={Number(mileRadius) * 1609.34} />
            </LayersControl.Overlay>
        </LayersControl>
    )
}

export default LocationMarker