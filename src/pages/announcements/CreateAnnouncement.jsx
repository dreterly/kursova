
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PlusCircle } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { createAnnouncement } from "../../services/announcementsApi.js";
import { createPet } from "../../services/petsApi.js";

import "./createAnnouncement.css";

// Налаштування стандартного маркера Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Початковий центр карти — Житомир
const DEFAULT_CENTER = [50.2547, 28.6587];

// Компонент, який дозволяє вибрати точку натисканням на карту
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
    image: "",
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
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

    // Перевіряємо, чи користувач вибрав місце на карті
    if (form.latitude === null || form.longitude === null) {
      setError("Будь ласка, виберіть місце на карті.");
      return;
    }

    setLoading(true);

    try {
      // Отримуємо поточного користувача
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        alert("Спочатку увійдіть у свій акаунт");
        navigate("/login");
        return;
      }

      const user = JSON.parse(savedUser);

      // Створюємо запис про тварину
      const petData = await createPet({
        user_id: user.id,
        name: form.name,
        type: form.species,
        breed: form.breed,
        gender: form.gender,
        birth_date: null,
        color: form.color,
        chip_number: null,
        photo: form.image || null,
        is_own: false,
      });

      // Перевіряємо, чи сервер повернув ID тварини
      if (!petData?.id) {
        throw new Error("Не вдалося отримати ID створеної тварини");
      }

      // Створюємо оголошення разом із координатами
      await createAnnouncement({
        user_id: user.id,
        pet_id: petData.id,
        type: form.type,
        description: form.description,
        city: form.city,
        address: form.place,
        latitude: form.latitude,
        longitude: form.longitude,
        status: "active",
      });

      alert("Оголошення успішно створено!");

      if (form.type === "lost") {
        navigate("/lost");
      } else {
        navigate("/found");
      }
    } catch (error) {
      console.error("Помилка створення оголошення:", error);

      setError(error.message || "Не вдалося створити оголошення");
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
        {/* Верхня частина */}
        <div className="create-announcement-header">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
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
              <p>
                Заповніть інформацію про загублену або знайдену тварину
              </p>
            </div>
          </div>
        </div>

        {/* Форма */}
        <form
          className="announcement-form"
          onSubmit={handleSubmit}
        >
          {/* Тип оголошення */}
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
              >
                Знайдена тварина
              </button>
            </div>
          </div>

          {/* Інформація про тварину */}
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
                />
              </label>

              <label>
                Вид
                <select
                  name="species"
                  value={form.species}
                  onChange={handleChange}
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
                  type="text"
                  name="breed"
                  placeholder="Наприклад: Британський"
                  value={form.breed}
                  onChange={handleChange}
                />
              </label>

              <label>
                Стать
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="">Оберіть стать</option>
                  <option value="male">Самець</option>
                  <option value="female">Самка</option>
                </select>
              </label>

              <label>
                Вік
                <input
                  type="number"
                  name="age"
                  min="0"
                  placeholder="Вік у роках"
                  value={form.age}
                  onChange={handleChange}
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
                />
              </label>
            </div>

            <label>
              Посилання на фото
              <input
                type="url"
                name="image"
                placeholder="https://..."
                value={form.image}
                onChange={handleChange}
              />
            </label>
          </div>

          {/* Місце та дата */}
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
              />
            </label>

            <div className="location-picker-section">
              <h3>Виберіть місце на карті</h3>

              <p>
                Натисніть на карту в місці, де тварина загубилася
                або була знайдена. Маркер можна перемістити,
                натиснувши на іншу точку.
              </p>

              <div className="announcement-location-map">
                <MapContainer
                  center={selectedPosition || DEFAULT_CENTER}
                  zoom={13}
                  scrollWheelZoom={true}
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
                    <strong>Широта:</strong>{" "}
                    {form.latitude.toFixed(6)}
                  </p>

                  <p>
                    <strong>Довгота:</strong>{" "}
                    {form.longitude.toFixed(6)}
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

          {/* Додаткова інформація */}
          <div className="form-section">
            <h2>Додаткова інформація</h2>

            <label>
              Опис
              <textarea
                name="description"
                rows="5"
                placeholder="Опишіть зовнішність тварини, особливі прикмети та обставини..."
                value={form.description}
                onChange={handleChange}
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
              />
            </label>
          </div>

          {/* Повідомлення про помилку */}
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* Кнопки */}
          <div className="form-buttons">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Скасувати
            </button>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Створення..." : "Створити оголошення"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}