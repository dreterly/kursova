
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./map.css";

import { getAnnouncements } from "../services/announcementsApi.js";

// Автоматично масштабуємо карту,
// щоб усі маркери були видимі
function MapBounds({ announcements }) {
  const map = useMap();

  useEffect(() => {
    if (announcements.length === 0) return;

    const bounds = announcements.map((announcement) => [
      Number(announcement.latitude),
      Number(announcement.longitude),
    ]);

    map.fitBounds(bounds, {
      padding: [50, 50],
    });
  }, [announcements, map]);

  return null;
}

// Створюємо красивий маркер
function createMarkerIcon(type) {
  const isLost = type === "lost";

  return L.divIcon({
    className: "custom-map-marker-wrapper",
    html: `
      <div class="custom-map-marker ${isLost ? "lost-marker" : "found-marker"}">
        <div class="marker-paw">🐾</div>
      </div>
      <div class="custom-map-marker-shadow"></div>
    `,
    iconSize: [46, 56],
    iconAnchor: [23, 52],
    popupAnchor: [0, -48],
  });
}

export function Map() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const data = await getAnnouncements();

        // Беремо тільки оголошення,
        // у яких є координати
        const announcementsWithLocation = data.filter(
          (announcement) =>
            announcement.latitude !== null &&
            announcement.longitude !== null
        );

        setAnnouncements(announcementsWithLocation);
      } catch (error) {
        console.error(error);
        setError("Не вдалося завантажити оголошення");
      } finally {
        setLoading(false);
      }
    }

    loadAnnouncements();
  }, []);

  if (loading) {
    return (
      <main className="map-page">
        <div className="map-state">
          <div className="map-spinner"></div>
          <p>Завантаження карти...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="map-page">
        <div className="map-state map-error">
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="map-page">
      <div className="map-header">
        <div>
          <h1>Карта повідомлень</h1>
          <p>
            Переглядайте місця, де були загублені або знайдені тварини
          </p>
        </div>

        <div className="map-counter">
          <strong>{announcements.length}</strong>
          <span>оголошень на карті</span>
        </div>
      </div>

      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-marker lost-legend"></span>
          <span>Загублені</span>
        </div>

        <div className="legend-item">
          <span className="legend-marker found-legend"></span>
          <span>Знайдені</span>
        </div>
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={[50.2547, 28.6587]}
          zoom={12}
          scrollWheelZoom={true}
          className="petfinder-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapBounds announcements={announcements} />

          {announcements.map((announcement) => (
            <Marker
              key={announcement.id}
              position={[
                Number(announcement.latitude),
                Number(announcement.longitude),
              ]}
              icon={createMarkerIcon(announcement.type)}
            >
              <Popup>
                <div className="map-popup">
                  <span
                    className={`map-popup-type ${announcement.type}`}
                  >
                    {announcement.type === "lost"
                      ? "Загублений"
                      : "Знайдений"}
                  </span>

                  <h3>
                    {announcement.name || "Тварина"}
                  </h3>

                  {announcement.pet_type && (
                    <p>
                      <strong>Тип:</strong>{" "}
                      {announcement.pet_type}
                    </p>
                  )}

                  {announcement.city && (
                    <p>
                      <strong>Місто:</strong>{" "}
                      {announcement.city}
                    </p>
                  )}

                  {announcement.address && (
                    <p>
                      <strong>Місце:</strong>{" "}
                      {announcement.address}
                    </p>
                  )}

                  {announcement.description && (
                    <p>{announcement.description}</p>
                  )}

                  <Link
                    to={`/announcements/${announcement.id}`}
                    className="map-popup-button"
                  >
                    Переглянути
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </main>
  );
}
