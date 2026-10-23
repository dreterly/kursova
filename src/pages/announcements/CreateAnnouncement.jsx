import { useEffect, useState } from "react";
import { ArrowLeft, PlusCircle, ImagePlus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { createAnnouncement } from "../../services/announcementsApi.js";
import { createPet } from "../../services/petsApi.js";

import "./createAnnouncement.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = [50.2547, 28.6587];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function LocationPicker({ position, onLocationSelect }) {
  useMapEvents({
    click(event) {
      onLocationSelect({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return position ? <Marker position={position} /> : null;
}

export function CreateAnnouncement() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "lost",
    name: "",
    species: "",
    breed: "",
    gender: "",
    age: "",
    color: "",
    description: "",
    date: "",
    city: "",
    place: "",
    contact: "",
    latitude: null,
    longitude: null,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Будь ласка, виберіть файл зображення.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Розмір фото не повинен перевищувати 5 МБ.");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview("");
  }

  function handleLocationSelect({ latitude, longitude }) {
    setForm((previousForm) => ({
      ...previousForm,
      latitude,
      longitude,
    }));

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.latitude === null || form.longitude === null) {
      setError("Будь ласка, виберіть місце на карті.");
      return;
    }

    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      alert("Спочатку увійдіть у свій акаунт.");
      navigate("/login");
      return;
    }

    let user;

    try {
      user = JSON.parse(savedUser);
    } catch {
      setError("Не вдалося визначити користувача. Увійдіть знову.");
      navigate("/login");
      return;
    }

    if (!user?.id) {
      setError("Не вдалося визначити користувача. Увійдіть знову.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const petFormData = new FormData();

      petFormData.append("user_id", String(user.id));
      petFormData.append("name", form.name.trim());
      petFormData.append("type", form.species);
      petFormData.append("breed", form.breed.trim());
      petFormData.append("gender", form.gender);
      petFormData.append("birth_date", "");
      petFormData.append("color", form.color.trim());
      petFormData.append("chip_number", "");
      petFormData.append("is_own", "false");

      if (imageFile) {
        petFormData.append("photo", imageFile);
      }

      const petData = await createPet(petFormData);

      if (!petData?.id) {
        throw new Error(
          "Тварину не вдалося створити: сервер не повернув її ID.",
        );
      }

      await createAnnouncement({
        user_id: user.id,
        pet_id: petData.id,
        type: form.type,
        description: form.description.trim(),
        city: form.city.trim(),
        address: form.place.trim(),
        latitude: form.latitude,
        longitude: form.longitude,
        status: "active",
        ...(form.date ? { date: form.date } : {}),
        ...(form.contact.trim() ? { contact: form.contact.trim() } : {}),
        ...(form.age !== "" ? { age: Number(form.age) } : {}),
      });

      alert("Оголошення успішно створено!");

      if (form.type === "lost") {
        navigate("/lost");
      } else {
        navigate("/found");
      }
    } catch (error) {
      console.error("Помилка створення оголошення:", error);
      setError(error.message || "Не вдалося створити оголошення.");
    } finally {
      setLoading(false);
    }
  }

  const selectedPosition =
    form.latitude !== null && form.longitude !== null
      ? [form.latitude, form.longitude]
      : null;

  return (
    <main className="create-announcement">
      <div className="create-announcement-container">
        <div className="create-announcement-header">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            <ArrowLeft />
            Повернутися назад
          </button>

          <div className="create-title">
            <div className="create-title-icon">
              <PlusCircle />
            </div>

            <div>
              <h1>Створення оголошення</h1>
              <p>Заповніть інформацію про загублену або знайдену тварину</p>
            </div>
          </div>
        </div>

        <form className="announcement-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Тип оголошення</h2>

            <div className="type-buttons">
              <button
                type="button"
                className={`type-button lost-type ${
                  form.type === "lost" ? "active" : ""
                }`}
                onClick={() =>
                  setForm((previousForm) => ({
                    ...previousForm,
                    type: "lost",
                  }))
                }
                disabled={loading}
              >
                Загублена тварина
              </button>

              <button
                type="button"
                className={`type-button found-type ${
                  form.type === "found" ? "active" : ""
                }`}
                onClick={() =>
                  setForm((previousForm) => ({
                    ...previousForm,
                    type: "found",
                  }))
                }
                disabled={loading}
              >
                Знайдена тварина
              </button>
            </div>
          </div>

          <div className="form-section">
            <h2>Інформація про тварину</h2>

            <div className="form-grid">
              <label>
                Ім'я тварини
                <input
                  type="text"
                  name="name"
                  placeholder="Наприклад: Мурчик"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </label>

              <label>
                Вид
                <select
                  name="species"
                  value={form.species}
                  onChange={handleChange}
                  required
                  disabled={loading}
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
                  type="text"
                  name="breed"
                  placeholder="Наприклад: Британська короткошерста"
                  value={form.breed}
                  onChange={handleChange}
                  disabled={loading}
                />
              </label>

              <label>
                Стать
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Оберіть стать</option>
                  <option value="male">Самець</option>
                  <option value="female">Самка</option>
                </select>
              </label>

              <label>
                Вік (років)
                <input
                  type="number"
                  name="age"
                  min="0"
                  placeholder="Наприклад: 3"
                  value={form.age}
                  onChange={handleChange}
                  disabled={loading}
                />
              </label>

              <label>
                Колір
                <input
                  type="text"
                  name="color"
                  placeholder="Наприклад: сірий"
                  value={form.color}
                  onChange={handleChange}
                  disabled={loading}
                />
              </label>
            </div>

            <div className="announcement-photo-field">
              <label htmlFor="announcement-photo">
                <ImagePlus size={18} />
                Фото тварини
              </label>

              <input
                id="announcement-photo"
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
              />

              <p>Оберіть зображення у форматі JPG, PNG або WebP, до 5 МБ.</p>

              {imagePreview && (
                <div className="announcement-image-preview">
                  <img
                    src={imagePreview}
                    alt="Попередній перегляд фото тварини"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={loading}
                  >
                    <X size={16} />
                    Видалити фото
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>Місце та дата</h2>

            <div className="form-grid">
              <label>
                Дата
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  disabled={loading}
                />
              </label>

              <label>
                Місто
                <input
                  type="text"
                  name="city"
                  placeholder="Наприклад: Житомир"
                  value={form.city}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </label>
            </div>

            <label>
              Адреса або орієнтир
              <input
                type="text"
                name="place"
                placeholder="Наприклад: біля парку"
                value={form.place}
                onChange={handleChange}
                disabled={loading}
              />
            </label>

            <div className="location-picker-section">
              <h3>Виберіть місце на карті</h3>

              <p>
                Натисніть на карту в місці, де тварина загубилася або була
                знайдена.
              </p>

              <div className="announcement-location-map">
                <MapContainer
                  center={selectedPosition || DEFAULT_CENTER}
                  zoom={13}
                  scrollWheelZoom
                  className="location-map"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <LocationPicker
                    position={selectedPosition}
                    onLocationSelect={handleLocationSelect}
                  />
                </MapContainer>
              </div>

              {selectedPosition ? (
                <div className="selected-coordinates">
                  <p>
                    <strong>Широта:</strong> {form.latitude.toFixed(6)}
                  </p>

                  <p>
                    <strong>Довгота:</strong> {form.longitude.toFixed(6)}
                  </p>

                  <button
                    type="button"
                    className="clear-location-button"
                    onClick={() =>
                      setForm((previousForm) => ({
                        ...previousForm,
                        latitude: null,
                        longitude: null,
                      }))
                    }
                    disabled={loading}
                  >
                    Очистити вибрану точку
                  </button>
                </div>
              ) : (
                <p className="location-warning">
                  Точку ще не вибрано. Натисніть на карту.
                </p>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>Додаткова інформація</h2>

            <label>
              Опис
              <textarea
                name="description"
                rows={5}
                placeholder="Опишіть зовнішність тварини, особливі прикмети та обставини..."
                value={form.description}
                onChange={handleChange}
                disabled={loading}
              />
            </label>

            <label>
              Контакт
              <input
                type="text"
                name="contact"
                placeholder="Телефон або email"
                value={form.contact}
                onChange={handleChange}
                disabled={loading}
              />
            </label>
          </div>

          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Скасувати
            </button>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Створення..." : "Створити оголошення"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
