import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import type { City } from '../types';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
console.log(import.meta);


type Props = {
    city: City | null;
};

const MapView: React.FC<Props> = ({ city }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | any>(null);
    const [forecastHtml, setForecastHtml] = useState<string | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);

    useEffect(() => {
        if (!mapRef.current && mapContainer.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [0, 0],
                zoom: 2,
            });
        }
    }, []);

    useEffect(() => {
        if (city && mapRef.current) {
            const { lat, lng } = city;
            mapRef.current.flyTo({ center: [lng, lat], zoom: 5 });

            getWeatherForecast(lat, lng).then((forecastHtml) => {
                // remove old marker
                if (markerRef.current) {
                    markerRef.current.remove();
                }
                setForecastHtml(forecastHtml);
                // const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(forecastHtml);

                const marker = new mapboxgl.Marker({ color: 'black' })
                    .setLngLat([lng, lat])
                    // .setPopup(popup)
                    .addTo(mapRef.current);

                // marker.togglePopup();
                markerRef.current = marker;
            });
        }
    }, [city]);


    return <>
        <div ref={mapContainer} style={{ height: '100vh', width: '100%' }} />
        {forecastHtml && (
            <WeatherModal content={forecastHtml} onClose={() => setForecastHtml(null)} />
        )}
    </>
};

export default MapView;


const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

export const getWeatherForecast = async (lat: number, lng: number): Promise<string> => {
    const url = `${BASE_URL}?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    const today = data.list[0];

    const tomorrow = data.list.find((item: any) =>
        item.dt_txt.includes('12:00:00') &&
        new Date(item.dt_txt).getDate() !== new Date().getDate()
    );

    return `
     <div style="
      font-family: Arial, sans-serif;
      padding: 10px;
      max-width: 200px;
      color: black;
      font-size: 14px;
      line-height: 1.4;
    ">
      <h3 style="margin: 0 0 8px; font-size: 16px; color: #333;">🌤 Weather Forecast</h3>
      <div style="margin-bottom: 8px;">
        <strong>City:</strong><br/>
        <span>${data.city.name}</span>
      </div>
      <div style="margin-bottom: 8px;">
        <strong>Today:</strong><br/>
        <span>${today.main.temp.toFixed(1)}°C, ${today.weather[0].description}</span>
      </div>
      <div>
        <strong>Tomorrow:</strong><br/>
        <span>${tomorrow?.main?.temp?.toFixed(1) ?? 'N/A'}°C, ${tomorrow?.weather?.[0]?.description ?? 'No data'}</span>
      </div>
    </div>
  `;
};


type WeatherModalProps = {
    content: string;
    onClose: () => void;
    duration?: number; // in milliseconds
};

const WeatherModal: React.FC<WeatherModalProps> = ({ content, onClose, duration = 10000 }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal}>
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
    );
};



const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        backgroundColor: 'rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '300px',
        width: '80%',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    },
};


