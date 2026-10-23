import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  MapPin,
  Navigation,
  Pencil,
  PawPrint,
  RefreshCw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { getPetById, updatePet, deletePet } from "../../services/petsApi.js";

import { getPhotoUrl } from "../../utils/photoUrl.js";

import "./petProfile.css";

const GPS_API_URL = "http://localhost:5000/api/gps";

function formatDate(value) {
  if (!value) return "Не вказано";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Не вказано";

  return date.toLocaleDateString("uk-UA");
}

function formatDateTime(value) {
  if (!value) return "Час не вказано";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Час не вказано";

  return date.toLocaleString("uk-UA");
}

function getStoredUserId() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.id || user?.user_id || null;
  } catch {
    return null;
  }
}

function getCoordinates(locationItem) {
  const latitude = Number(locationItem?.latitude ?? locationItem?.lat);

  const longitude = Number(
    locationItem?.longitude ?? locationItem?.lng ?? locationItem?.lon,
  );

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return { latitude, longitude };
}

export function PetProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("info");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    gender: "",
    birth_date: "",
    color: "",
    chip_number: "",
  });

  const [editingChip, setEditingChip] = useState(false);
  const [chipNumber, setChipNumber] = useState("");

  const [gpsLocations, setGpsLocations] = useState([]);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");

  const loadPet = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getPetById(id);

      const loadedPet = data?.pet || data;

      if (!loadedPet) {
        throw new Error("Тварину не знайдено");
      }

      setPet(loadedPet);

      setFormData({
        name: loadedPet.name || "",
        type: loadedPet.type || "",
        breed: loadedPet.breed || "",
        gender: loadedPet.gender || "",
        birth_date: loadedPet.birth_date
          ? String(loadedPet.birth_date).slice(0, 10)
          : "",
        color: loadedPet.color || "",
        chip_number: loadedPet.chip_number || "",
      });

      setChipNumber(loadedPet.chip_number || "");
    } catch (err) {
      console.error("Помилка завантаження тварини:", err);
      setError(err.message || "Не вдалося завантажити профіль тварини");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPet();
  }, [loadPet]);

  const loadGpsLocations = useCallback(async () => {
    if (!pet) return;

    const userId = pet.user_id || getStoredUserId();

    if (!userId) {
      setGpsLocations([]);
      setGpsError("Не вдалося визначити користувача для GPS-запиту.");
      return;
    }

    setGpsLoading(true);
    setGpsError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${GPS_API_URL}/user/${encodeURIComponent(userId)}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Не вдалося отримати GPS-дані із сервера.",
        );
      }

      const records = Array.isArray(data)
        ? data
        : Array.isArray(data?.locations)
          ? data.locations
          : Array.isArray(data?.history)
            ? data.history
            : [];

      const locations = records
        .filter(
          (locationItem) => String(locationItem.pet_id) === String(pet.id),
        )
        .filter((locationItem) => getCoordinates(locationItem))
        .sort((a, b) => {
          const dateA = new Date(a.recorded_at || a.created_at || 0).getTime();
          const dateB = new Date(b.recorded_at || b.created_at || 0).getTime();

          return dateB - dateA;
        });

      setGpsLocations(locations);
    } catch (err) {
      console.error("Помилка завантаження GPS:", err);
      setGpsLocations([]);
      setGpsError(
        err.message ||
          "Не вдалося завантажити GPS-дані. Перевір роботу сервера.",
      );
    } finally {
      setGpsLoading(false);
    }
  }, [pet]);

  useEffect(() => {
    if (activeTab === "gps") {
      loadGpsLocations();
    }
  }, [activeTab, loadGpsLocations]);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSavePet(event) {
    event.preventDefault();

    if (!pet) return;

    setSaving(true);
    setError("");

    try {
      await updatePet(pet.id, {
        ...formData,
        user_id: pet.user_id || getStoredUserId(),
      });

      setIsEditing(false);
      await loadPet();
    } catch (err) {
      console.error("Помилка оновлення тварини:", err);
      setError(err.message || "Не вдалося зберегти зміни");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveChip() {
    if (!pet) return;

    setSaving(true);
    setError("");

    try {
      await updatePet(pet.id, {
        ...formData,
        chip_number: chipNumber.trim(),
        user_id: pet.user_id || getStoredUserId(),
      });

      setEditingChip(false);
      await loadPet();
    } catch (err) {
      console.error("Помилка оновлення номера чипа:", err);
      setError(err.message || "Не вдалося зберегти номер чипа");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletePet() {
    if (!pet) return;

    const confirmed = window.confirm(
      `Видалити профіль тварини «${pet.name}»? Цю дію не можна скасувати.`,
    );

    if (!confirmed) return;

    try {
      await deletePet(pet.id);
      navigate("/profile");
    } catch (err) {
      console.error("Помилка видалення тварини:", err);
      setError(err.message || "Не вдалося видалити тварину");
    }
  }

  function openGpsMonitoring() {
    navigate("/gps", {
      state: {
        petId: pet.id,
        petName: pet.name,
      },
    });
  }

  function openPointOnGpsMap(locationItem) {
    navigate("/gps", {
      state: {
        petId: pet.id,
        petName: pet.name,
        selectedLocation: locationItem,
      },
    });
  }

  if (loading) {
    return (
      <main className="pet-profile-page">
        <div className="pet-profile-message">
          Завантаження профілю тварини...
        </div>
      </main>
    );
  }

  if (!pet) {
    return (
      <main className="pet-profile-page">
        <div className="pet-profile-message">
          <p>{error || "Тварину не знайдено."}</p>

          <button
            type="button"
            className="pet-profile-button"
            onClick={() => navigate("/profile")}
          >
            <ArrowLeft size={18} />
            До профілю
          </button>
        </div>
      </main>
    );
  }

  const photoUrl = getPhotoUrl(pet.photo);

  return (
    <main className="pet-profile-page">
      <div className="pet-profile-container">
        <button
          type="button"
          className="pet-profile-back"
          onClick={() => navigate("/profile")}
        >
          <ArrowLeft size={18} />
          Назад до профілю
        </button>

        {error && (
          <div className="pet-profile-error" role="alert">
            {error}
          </div>
        )}

        <section className="pet-profile-card">
          <div className="pet-profile-header">
            <div className="pet-profile-photo">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={pet.name || "Фото тварини"}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <PawPrint size={52} />
              )}
            </div>

            <div className="pet-profile-heading">
              <span className="pet-profile-eyebrow">Особистий кабінет</span>

              <h1>{pet.name}</h1>

              <p>
                {[pet.type, pet.breed].filter(Boolean).join(" · ") ||
                  "Домашній улюбленець"}
              </p>

              {pet.chip_number && (
                <span className="pet-profile-chip-badge">
                  <ShieldCheck size={15} />
                  Чип: {pet.chip_number}
                </span>
              )}
            </div>

            <div className="pet-profile-header-actions">
              <button
                type="button"
                className="pet-profile-button"
                onClick={() => {
                  setIsEditing((previous) => !previous);
                  setError("");
                }}
              >
                {isEditing ? (
                  <>
                    <X size={17} />
                    Скасувати
                  </>
                ) : (
                  <>
                    <Pencil size={17} />
                    Редагувати
                  </>
                )}
              </button>

              <button
                type="button"
                className="pet-profile-delete"
                onClick={handleDeletePet}
              >
                <Trash2 size={17} />
                Видалити
              </button>
            </div>
          </div>

          <nav className="pet-profile-tabs" aria-label="Розділи профілю">
            <button
              type="button"
              className={activeTab === "info" ? "active" : ""}
              onClick={() => setActiveTab("info")}
            >
              <PawPrint size={17} />
              Інформація
            </button>

            <button
              type="button"
              className={activeTab === "chip" ? "active" : ""}
              onClick={() => setActiveTab("chip")}
            >
              <ShieldCheck size={17} />
              Мікрочип
            </button>

            <button
              type="button"
              className={activeTab === "gps" ? "active" : ""}
              onClick={() => setActiveTab("gps")}
            >
              <Navigation size={17} />
              GPS
            </button>
          </nav>

          <div className="pet-profile-content">
            {activeTab === "info" && (
              <section>
                <h2>Інформація про улюбленця</h2>

                {isEditing ? (
                  <form className="pet-profile-form" onSubmit={handleSavePet}>
                    <label>
                      Ім'я
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </label>

                    <label>
                      Вид тварини
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Оберіть вид</option>
                        <option value="Кіт">Кіт</option>
                        <option value="Кішка">Кішка</option>
                        <option value="Собака">Собака</option>
                        <option value="Інше">Інше</option>
                      </select>
                    </label>

                    <label>
                      Порода
                      <input
                        name="breed"
                        value={formData.breed}
                        onChange={handleInputChange}
                      />
                    </label>

                    <label>
                      Стать
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                      >
                        <option value="">Не вказано</option>
                        <option value="Самець">Самець</option>
                        <option value="Самка">Самка</option>
                      </select>
                    </label>

                    <label>
                      Дата народження
                      <input
                        type="date"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleInputChange}
                      />
                    </label>

                    <label>
                      Забарвлення
                      <input
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                      />
                    </label>

                    <label>
                      Номер чипа
                      <input
                        name="chip_number"
                        value={formData.chip_number}
                        onChange={handleInputChange}
                      />
                    </label>

                    <div className="pet-profile-form-actions">
                      <button
                        type="submit"
                        className="pet-profile-button pet-profile-button-primary"
                        disabled={saving}
                      >
                        <Check size={17} />
                        {saving ? "Збереження..." : "Зберегти"}
                      </button>

                      <button
                        type="button"
                        className="pet-profile-button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: pet.name || "",
                            type: pet.type || "",
                            breed: pet.breed || "",
                            gender: pet.gender || "",
                            birth_date: pet.birth_date
                              ? String(pet.birth_date).slice(0, 10)
                              : "",
                            color: pet.color || "",
                            chip_number: pet.chip_number || "",
                          });
                        }}
                      >
                        Скасувати
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="pet-profile-info-grid">
                    <div className="pet-profile-info-item">
                      <span>Ім'я</span>
                      <strong>{pet.name || "Не вказано"}</strong>
                    </div>

                    <div className="pet-profile-info-item">
                      <span>Вид</span>
                      <strong>{pet.type || "Не вказано"}</strong>
                    </div>

                    <div className="pet-profile-info-item">
                      <span>Порода</span>
                      <strong>{pet.breed || "Не вказано"}</strong>
                    </div>

                    <div className="pet-profile-info-item">
                      <span>Стать</span>
                      <strong>{pet.gender || "Не вказано"}</strong>
                    </div>

                    <div className="pet-profile-info-item">
                      <span>
                        <CalendarDays size={15} />
                        Дата народження
                      </span>
                      <strong>{formatDate(pet.birth_date)}</strong>
                    </div>

                    <div className="pet-profile-info-item">
                      <span>Забарвлення</span>
                      <strong>{pet.color || "Не вказано"}</strong>
                    </div>
                  </div>
                )}
              </section>
            )}

            {activeTab === "chip" && (
              <section className="pet-profile-chip-section">
                <div className="pet-profile-section-heading">
                  <div>
                    <h2>Мікрочип тварини</h2>
                    <p>Номер чипа допомагає ідентифікувати улюбленця.</p>
                  </div>

                  <ShieldCheck size={32} />
                </div>

                {editingChip ? (
                  <div className="pet-profile-chip-edit">
                    <label htmlFor="chipNumber">Номер мікрочипа</label>

                    <input
                      id="chipNumber"
                      value={chipNumber}
                      onChange={(event) => setChipNumber(event.target.value)}
                      placeholder="Введіть номер чипа"
                    />

                    <div className="pet-profile-form-actions">
                      <button
                        type="button"
                        className="pet-profile-button pet-profile-button-primary"
                        onClick={handleSaveChip}
                        disabled={saving}
                      >
                        <Check size={17} />
                        {saving ? "Збереження..." : "Зберегти"}
                      </button>

                      <button
                        type="button"
                        className="pet-profile-button"
                        onClick={() => {
                          setChipNumber(pet.chip_number || "");
                          setEditingChip(false);
                        }}
                      >
                        <X size={17} />
                        Скасувати
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pet-profile-chip-value">
                    <div>
                      <span>Номер чипа</span>
                      <strong>
                        {pet.chip_number || "Чип не зареєстровано"}
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="pet-profile-button"
                      onClick={() => {
                        setChipNumber(pet.chip_number || "");
                        setEditingChip(true);
                      }}
                    >
                      <Pencil size={17} />
                      Змінити
                    </button>
                  </div>
                )}
              </section>
            )}

            {activeTab === "gps" && (
              <section className="pet-profile-gps-section">
                <div className="pet-profile-section-heading">
                  <div>
                    <h2>GPS-моніторинг</h2>
                    <p>
                      Переглядай моніторинг місцезнаходження свого улюбленця.
                    </p>
                  </div>

                  <Navigation size={32} />
                </div>

                <div className="pet-profile-gps-actions">
                  <button
                    type="button"
                    className="pet-profile-button pet-profile-button-primary"
                    onClick={openGpsMonitoring}
                  >
                    <Navigation size={17} />
                    Відкрити GPS-моніторинг
                  </button>

                  <button
                    type="button"
                    className="pet-profile-button"
                    onClick={loadGpsLocations}
                    disabled={gpsLoading}
                  >
                    <RefreshCw size={17} />
                    {gpsLoading ? "Оновлення..." : "Оновити координати"}
                  </button>
                </div>

                {gpsError && (
                  <p className="pet-profile-error" role="alert">
                    {gpsError}
                  </p>
                )}

                {gpsLoading ? (
                  <p className="pet-profile-muted">Завантаження координат...</p>
                ) : gpsLocations.length > 0 ? (
                  <div className="pet-profile-gps-locations">
                    <h3>Останні збережені координати</h3>

                    {gpsLocations.slice(0, 3).map((locationItem, index) => {
                      const coordinates = getCoordinates(locationItem);

                      return (
                        <article
                          className="pet-profile-location"
                          key={
                            locationItem.id ??
                            `${coordinates.latitude}-${coordinates.longitude}-${index}`
                          }
                        >
                          <MapPin size={20} />

                          <div>
                            <strong>
                              {coordinates.latitude.toFixed(6)},{" "}
                              {coordinates.longitude.toFixed(6)}
                            </strong>

                            <p>
                              {formatDateTime(
                                locationItem.recorded_at ||
                                  locationItem.created_at,
                              )}
                            </p>

                            <button
                              type="button"
                              className="pet-profile-link-button"
                              onClick={() => openPointOnGpsMap(locationItem)}
                            >
                              Переглянути на карті
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  !gpsError && (
                    <div className="pet-profile-empty">
                      <MapPin size={30} />
                      <h3>Координат поки немає</h3>
                      <p>
                        Коли сервер отримає GPS-координати цієї тварини, вони
                        з'являться тут.
                      </p>
                    </div>
                  )
                )}
              </section>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
