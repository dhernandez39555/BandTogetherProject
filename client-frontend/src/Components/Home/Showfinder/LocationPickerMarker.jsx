import React, { useEffect, useMemo, useRef } from 'react';
import { Marker, useMap, Popup } from 'react-leaflet';

function LocationMarker({ location, setLocation }) {
    const map = useMap();
    const markerRef = useRef(null);
    const eventHandlers = useMemo(() => ({
        dragend() {
            if (markerRef.current === null) return;
            setLocation(markerRef.current.getLatLng());
        },
    }), []);

    useEffect(() => {
        map.panTo(location, map.getZoom());
    }, [location])

    useEffect (() => {
        map.locate().on("locationfound", e => {
            setLocation(e.latlng);
            map.panTo(e.latlng, map.getZoom())
        })
    }, []);

    return (
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
    )
}

export default LocationMarker