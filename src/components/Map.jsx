import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';

import styles from './Map.module.css';
import Button from './Button';
import { useCities } from '../contexts/CitiesContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { useUrlPosition } from '../hooks/useUrlPosition';



export default function Map() {
    const [mapPosition, setMapPosition] = useState([51.505, -0.09]);
    const { cities } = useCities();
    const {
        isLoading: isLoadingPosition,
        position: geolocationPosition,
        getPosition
    } = useGeolocation();

    const [mapLat, mapLng] = useUrlPosition();

    useEffect(function () {
        if (mapLat && mapLng)
            setMapPosition([mapLat, mapLng])
    }, [mapLat, mapLng])

    useEffect(function () {
        if (geolocationPosition)
            setMapPosition(geolocationPosition);
    }, [geolocationPosition])

    return (
        <div className={styles.mapContainer}>
            {
                !geolocationPosition && (
                    <Button type='position' onClick={getPosition} >
                        {isLoadingPosition ? 'Loading...' : 'Use your position'}
                    </Button>
                )
            }

            <MapContainer
                className={styles.map}
                center={mapPosition}
                zoom={8}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.fe/hot/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    cities.map((city) => (
                        <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
                            <Popup>

                                <span> {city.emoji} </span>
                                <span> {city.cityName} </span>
                            </Popup>
                        </Marker>
                    ))
                }

                {/* <ChangeCenter position={[mapLat || 51.505, mapLng || -0.09]} /> */}
                <ChangeCenter position={mapPosition} />
                <DetectClick />
            </MapContainer>
        </div>
    )
}

function ChangeCenter({ position }) {
    const map = useMap();
    // if (position.every(pos => pos !== null))
    map.setView(position);

    return null;
}

function DetectClick() {
    const navigate = useNavigate();

    useMapEvents({
        click: (event) => {
            navigate(`form?lat=${event.latlng.lat}&lng=${event.latlng.lng}`)
        }
    })
}