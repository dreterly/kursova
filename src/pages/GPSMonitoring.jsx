import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, Battery, Clock, MapPin, PawPrint } from "lucide-react";

import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  useMap,
} from "react-leaflet";

import { getMyPetLocations, saveDemoGpsLocations } from "../services/gpsApi.js";

import "leaflet/dist/leaflet.css";
import "./gpsMonitoring.css";

function createGpsMarkerIcon() {
  return L.divIcon({
    className: "gps-marker-wrapper",
    html: `
      <div class="gps-marker">
        <span>🐾</span>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -24],
  });
}

function SelectedPetMap({ pet, selectedPoint, onPointSelect }) {
  const map = useMap();

  const route = useMemo(() => {
    if (!pet?.history) return [];

    return pet.history.map((location) => [
      Number(location.latitude),
      Number(location.longitude),
    ]);
  }, [pet]);

  useEffect(() => {
    if (!pet || route.length === 0) return;

    const bounds = L.latLngBounds(route);

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 16,
    });
  }, [pet, map, route]);

  useEffect(() => {
    if (!selectedPoint) return;

    map.setView(
      [Number(selectedPoint.latitude), Number(selectedPoint.longitude)],
      17,
      { animate: true },
    );
  }, [selectedPoint, map]);

  return (
    <>
      {route.length > 1 && (
        <Polyline
          positions={route}
          pathOptions={{
            color: "#E6195E",
            weight: 4,
            opacity: 0.8,
          }}
        />
      )}

      {pet.history.map((location, index) => {
        const latitude = Number(location.latitude);
        const longitude = Number(location.longitude);
        const isLast = index === pet.history.length - 1;

        return (
          <CircleMarker
            key={`${pet.pet_id}-${location.id ?? index}`}
            center={[latitude, longitude]}
            radius={isLast ? 8 : 6}
            pathOptions={{
              color: "#ffffff",
              weight: 3,
              fillColor: isLast ? "#E6195E" : "#F6E033",
              fillOpacity: 1,
              opacity: 1,
            }}
            eventHandlers={{
              click: () => onPointSelect(location),
            }}
          >
            <Popup>
              <div className="gps-popup">
                <h3>{pet.name}</h3>

                <p>
                  <strong>Точка маршруту:</strong> {index + 1}
                </p>

                <p>
                  <strong>Час:</strong>{" "}
                  {new Date(location.recorded_at).toLocaleString("uk-UA")}
                </p>

                <p>
                  <strong>Координати:</strong> {latitude.toFixed(5)},{" "}
                  {longitude.toFixed(5)}
                </p>

                <p>
                  <strong>Батарея:</strong> {location.battery}%
                </p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      {route.length > 0 && (
        <Marker
          position={route[route.length - 1]}
          icon={createGpsMarkerIcon()}
          eventHandlers={{
            click: () => onPointSelect(pet.history[pet.history.length - 1]),
          }}
        >
          <Popup>
            <div className="gps-popup">
              <h3>{pet.name}</h3>

              <p>
                <strong>Остання відома позиція</strong>
              </p>

              <p>
                <strong>Координати:</strong>{" "}
                {route[route.length - 1][0].toFixed(5)},{" "}
                {route[route.length - 1][1].toFixed(5)}
              </p>

              <p>
                <strong>Батарея:</strong> {pet.battery}%
              </p>
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
}

export function GPSMonitoring() {
  const location = useLocation();
  const navigationState = useMemo(() => location.state || {}, [location.state]);

  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(
    navigationState.petId ?? null,
  );
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useMemo(() => {
    try {
      const storedUser = localStorage.getItem("user");

      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadGpsData(showLoader = false) {
      if (!user?.id) {
        if (!cancelled) {
          setError("Користувача не знайдено");
          setLoading(false);
        }

        return;
      }

      try {
        if (showLoader && !cancelled) {
          setLoading(true);
        }

        const data = await getMyPetLocations(user.id);
        const grouped = {};

        data.forEach((locationItem) => {
          const petId = locationItem.pet_id;

          if (!grouped[petId]) {
            grouped[petId] = {
              pet_id: petId,
              name: locationItem.name,
              type: locationItem.type,
              breed: locationItem.breed,
              chip_number: locationItem.chip_number,
              history: [],
            };
          }

          grouped[petId].history.push(locationItem);
        });

        const petsArray = Object.values(grouped).map((pet) => {
          const lastLocation = pet.history[pet.history.length - 1];

          return {
            ...pet,
            latitude: Number(lastLocation.latitude),
            longitude: Number(lastLocation.longitude),
            battery: lastLocation.battery,
            recorded_at: lastLocation.recorded_at,
          };
        });

        if (cancelled) return;

        setPets(petsArray);
        setError("");

        const preferredId = navigationState.petId;

        setSelectedPetId((currentId) => {
          const candidate = preferredId ?? currentId;

          if (
            petsArray.some((pet) => String(pet.pet_id) === String(candidate))
          ) {
            return candidate;
          }

          return petsArray[0]?.pet_id ?? null;
        });

        if (navigationState.selectedLocation) {
          const targetPetId = navigationState.petId;
          const targetPet = petsArray.find(
            (p) => String(p.pet_id) === String(targetPetId),
          );

          if (targetPet) {
            const incoming = navigationState.selectedLocation;

            const matched = targetPet.history.find((loc) => {
              if (incoming.id != null && loc.id != null) {
                return String(loc.id) === String(incoming.id);
              }

              return (
                Number(loc.latitude) === Number(incoming.latitude) &&
                Number(loc.longitude) === Number(incoming.longitude) &&
                String(loc.recorded_at) === String(incoming.recorded_at)
              );
            });

            setSelectedPoint(matched || incoming);
          } else {
            setSelectedPoint(null);
          }
        } else {
          setSelectedPoint(null);
        }
      } catch (err) {
        console.error("Помилка завантаження GPS:", err);

        if (!cancelled) {
          setError(err.message || "Не вдалося отримати GPS-дані");
        }
      } finally {
        if (showLoader && !cancelled) {
          setLoading(false);
        }
      }
    }

    loadGpsData(true);

    const intervalId = setInterval(
      async () => {
        if (!user?.id || cancelled) return;

        try {
          await saveDemoGpsLocations(user.id);

          if (!cancelled) {
            await loadGpsData(false);
          }
        } catch (err) {
          console.error("Помилка автоматичного оновлення GPS:", err);

          if (!cancelled) {
            setError(err.message || "Не вдалося автоматично оновити GPS-дані");
          }
        }
      },
      10 * 60 * 1000,
    );

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [user, navigationState]);

  const selectedPet = pets.find(
    (pet) => String(pet.pet_id) === String(selectedPetId),
  );

  const handlePetChange = (pet) => {
    setSelectedPetId(pet.pet_id);
    setSelectedPoint(null);
  };

  const handlePointSelect = (locationItem) => {
    setSelectedPoint(locationItem);
  };

  if (loading) {
    return (
      <main className="gps-monitoring">
        <div className="gps-state">
          <div className="gps-spinner"></div>
          <p>Завантаження GPS-даних...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="gps-monitoring">
        <div className="gps-state gps-error">
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (pets.length === 0) {
    return (
      <main className="gps-monitoring">
        <div className="gps-empty">
          <PawPrint />

          <h2>GPS-даних поки немає</h2>

          <p>Для ваших тварин ще не записано жодної GPS-позиції.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="gps-monitoring">
      <div className="gps-monitoring-container">
        <button
          type="button"
          className="back-button"
          onClick={() => window.history.back()}
        >
          <ArrowLeft />
          Повернутися назад
        </button>

        <div className="gps-monitoring-header">
          <div className="gps-monitoring-icon">
            <MapPin />
          </div>

          <div>
            <h1>GPS-Моніторинг</h1>
            <p>Відстежуйте місцезнаходження своїх тварин</p>
          </div>
        </div>

        <div className="gps-content">
          <aside className="gps-pets-panel">
            <div className="gps-panel-title">
              <h2>Мої тварини</h2>
              <span>{pets.length}</span>
            </div>

            <div className="gps-pets-list">
              {pets.map((pet) => (
                <button
                  key={pet.pet_id}
                  type="button"
                  className={`gps-pet-card ${
                    String(selectedPetId) === String(pet.pet_id) ? "active" : ""
                  }`}
                  onClick={() => handlePetChange(pet)}
                >
                  <div className="gps-pet-icon">
                    <PawPrint />
                  </div>

                  <div className="gps-pet-info">
                    <h3>{pet.name}</h3>

                    <p>
                      {pet.type}
                      {pet.breed ? ` • ${pet.breed}` : ""}
                    </p>
                  </div>

                  <div className="gps-pet-battery">
                    <Battery />
                    {pet.battery}%
                  </div>
                </button>
              ))}
            </div>

            {selectedPet && (
              <div className="gps-details">
                <h3>Інформація</h3>

                <div className="gps-detail-row">
                  <MapPin />

                  <div>
                    <span>Останні координати</span>
                    <strong>
                      {selectedPet.latitude.toFixed(5)},{" "}
                      {selectedPet.longitude.toFixed(5)}
                    </strong>
                  </div>
                </div>

                <div className="gps-detail-row">
                  <Battery />

                  <div>
                    <span>Батарея</span>
                    <strong>{selectedPet.battery}%</strong>
                  </div>
                </div>

                <div className="gps-detail-row">
                  <Clock />

                  <div>
                    <span>Останнє оновлення</span>
                    <strong>
                      {new Date(selectedPet.recorded_at).toLocaleString(
                        "uk-UA",
                      )}
                    </strong>
                  </div>
                </div>

                <div className="gps-history-count">
                  <Clock />

                  <span>
                    Точок маршруту:{" "}
                    <strong>{selectedPet.history.length}</strong>
                  </span>
                </div>
              </div>
            )}
          </aside>

          {selectedPet && (
            <section className="gps-map-section">
              <div className="gps-map-header">
                <div>
                  <h2>{selectedPet.name}</h2>
                  <p>Натисніть на точку маршруту або запис історії</p>
                </div>

                <span className="gps-live-badge">GPS активний</span>
              </div>

              <div className="gps-map-wrapper">
                <MapContainer
                  center={[selectedPet.latitude, selectedPet.longitude]}
                  zoom={15}
                  scrollWheelZoom={true}
                  className="gps-map"
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <SelectedPetMap
                    pet={selectedPet}
                    selectedPoint={selectedPoint}
                    onPointSelect={handlePointSelect}
                  />
                </MapContainer>
              </div>

              <div className="gps-history">
                <div className="gps-history-header">
                  <div>
                    <h2>Історія переміщення</h2>

                    <p>Натисніть на запис, щоб переглянути його на карті</p>
                  </div>

                  <span className="gps-history-total">
                    {selectedPet.history.length} точок
                  </span>
                </div>

                <div className="gps-history-list">
                  {selectedPet.history
                    .slice()
                    .reverse()
                    .map((locationItem, reverseIndex) => {
                      const originalIndex =
                        selectedPet.history.length - 1 - reverseIndex;

                      const isSelected =
                        selectedPoint &&
                        ((selectedPoint.id != null &&
                          locationItem.id != null &&
                          String(selectedPoint.id) ===
                            String(locationItem.id)) ||
                          (Number(selectedPoint.latitude) ===
                            Number(locationItem.latitude) &&
                            Number(selectedPoint.longitude) ===
                              Number(locationItem.longitude) &&
                            String(selectedPoint.recorded_at) ===
                              String(locationItem.recorded_at)));

                      return (
                        <button
                          key={`${selectedPet.pet_id}-${
                            locationItem.id ?? originalIndex
                          }`}
                          type="button"
                          className={`gps-history-item ${
                            isSelected ? "selected" : ""
                          }`}
                          onClick={() => handlePointSelect(locationItem)}
                        >
                          <div className="gps-history-dot">
                            <MapPin />
                          </div>

                          <div className="gps-history-info">
                            <strong>Точка маршруту {originalIndex + 1}</strong>

                            <span>
                              {new Date(
                                locationItem.recorded_at,
                              ).toLocaleString("uk-UA")}
                            </span>

                            <span>
                              📍 {Number(locationItem.latitude).toFixed(5)},{" "}
                              {Number(locationItem.longitude).toFixed(5)}
                            </span>
                          </div>

                          <div className="gps-history-battery">
                            <Battery />
                            {locationItem.battery}%
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
