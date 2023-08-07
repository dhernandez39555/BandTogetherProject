import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Circle, Marker, useMap, Popup, LayersControl } from 'react-leaflet';
import './locationMarker.css';

function LocationMarker({ location, setLocation, mileRadius }) {
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

    const validateRadius = useMemo(() => {
        const radiusValue = parseFloat(mileRadius);
        return isNaN(radiusValue) || radiusValue <=0 ? 0 : radiusValue;
    }, [mileRadius])

    return (
        <LayersControl position="topright">
            <Marker
                draggable={true}
                ref={markerRef}
                eventHandlers={eventHandlers}
                position={location}
            >
                <Popup>
                    Drag Me.
                </Popup>
            </Marker>
            <LayersControl.Overlay name="Miles Radius">
                <Circle center={location} radius={Number(validateRadius) * 1609.34} />
            </LayersControl.Overlay>
        </LayersControl>
    )
}

export default LocationMarker