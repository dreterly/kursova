
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MapPin, Clock, ArrowLeft } from "lucide-react";

import {
  getPetById,
  updatePet,
  deletePet,
} from "../../services/petsApi.js";

import "./petProfile.css";

export function PetProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPetById(id)
      .then((data) => {
        setPet(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setPet({
      ...pet,
      [name]: value,
    });
  }

  async function handleSave() {
    try {
      await updatePet(id, {
        name: pet.name,
        type: pet.type,
        breed: pet.breed,
        gender: pet.gender,
        birth_date: pet.birth_date,
        color: pet.color,
        chip_number: pet.chip_number,
        photo: pet.photo,
      });

      setEditing(false);
      alert("Дані тварини оновлено!");
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Ви впевнені, що хочете видалити тварину "${pet.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePet(id);

      alert("Тварину видалено!");

      navigate("/profile");
    } catch (error) {
      setError(error.message);
    }
  }

  if (loading) {
    return (
      <main className="pet-profile-page">
        <h1>Завантаження...</h1>
      </main>
    );
  }

  if (error || !pet) {
    return (
      <main className="pet-profile-page">
        <h1>Тварину не знайдено</h1>
        <p>{error}</p>

        <Link to="/profile">
          Повернутися до профілю
        </Link>
      </main>
    );
  }

  return (
    <main className="pet-profile-page">
      <div className="pet-profile-container">

        <Link to="/profile" className="back-link">
          <ArrowLeft />
          Назад до профілю
        </Link>

        <section className="pet-profile-header">
          {pet.photo ? (
            <img src={pet.photo} alt={pet.name} />
          ) : null}

          <div>
            <h1>🐱 {pet.name}</h1>

            <p>
              {pet.type} • {pet.breed}
            </p>
          </div>
        </section>

        <nav className="pet-profile-tabs">
          <button
            className={activeTab === "info" ? "active" : ""}
            onClick={() => setActiveTab("info")}
          >
            Основна інформація
          </button>

          <button
            className={activeTab === "chip" ? "active" : ""}
            onClick={() => setActiveTab("chip")}
          >
            Мікрочип
          </button>

          <button
            className={activeTab === "gps" ? "active" : ""}
            onClick={() => setActiveTab("gps")}
          >
            GPS
          </button>

          <button
            className={activeTab === "history" ? "active" : ""}
            onClick={() => setActiveTab("history")}
          >
            Історія маршруту
          </button>
        </nav>

        {activeTab === "info" && (
          <section className="pet-profile-section">

            <div className="section-header">
              <h2>Основна інформація</h2>

              {!editing && (
                <div className="section-actions">

                  <button
                    onClick={() => setEditing(true)}
                  >
                    Редагувати
                  </button>

                  <button
                    className="delete-button"
                    onClick={handleDelete}
                  >
                    Видалити
                  </button>

                </div>
              )}
            </div>

            {editing ? (
              <div className="pet-edit-form">

                <label>
                  Ім'я

                  <input
                    name="name"
                    value={pet.name || ""}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Вид

                  <input
                    name="type"
                    value={pet.type || ""}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Порода

                  <input
                    name="breed"
                    value={pet.breed || ""}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Стать

                  <input
                    name="gender"
                    value={pet.gender || ""}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Дата народження

                  <input
                    type="date"
                    name="birth_date"
                    value={
                      pet.birth_date
                        ? pet.birth_date.slice(0, 10)
                        : ""
                    }
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Колір

                  <input
                    name="color"
                    value={pet.color || ""}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Номер мікрочипа

                  <input
                    name="chip_number"
                    value={pet.chip_number || ""}
                    onChange={handleChange}
                  />
                </label>

                <div>
                  <button onClick={handleSave}>
                    Зберегти зміни
                  </button>

                  <button onClick={() => setEditing(false)}>
                    Скасувати
                  </button>
                </div>

              </div>
            ) : (
              <div className="pet-info-grid">

                <div>
                  <span>Ім'я</span>
                  <strong>{pet.name}</strong>
                </div>

                <div>
                  <span>Вид</span>
                  <strong>{pet.type}</strong>
                </div>

                <div>
                  <span>Порода</span>
                  <strong>
                    {pet.breed || "Не вказано"}
                  </strong>
                </div>

                <div>
                  <span>Стать</span>
                  <strong>
                    {pet.gender || "Не вказано"}
                  </strong>
                </div>

                <div>
                  <span>Дата народження</span>

                  <strong>
                    {pet.birth_date
                      ? pet.birth_date.slice(0, 10)
                      : "Не вказано"}
                  </strong>
                </div>

                <div>
                  <span>Колір</span>

                  <strong>
                    {pet.color || "Не вказано"}
                  </strong>
                </div>

              </div>
            )}

          </section>
        )}

        {activeTab === "chip" && (
          <section className="pet-profile-section">

            <h2>Мікрочип</h2>

            <div className="chip-card">

              <div className="chip-icon">
                💳
              </div>

              <div>
                <span>Номер мікрочипа</span>

                <strong>
                  {pet.chip_number || "Мікрочип не вказано"}
                </strong>
              </div>

            </div>

          </section>
        )}

        {activeTab === "gps" && (
          <section className="pet-profile-section">

            <h2>GPS</h2>

            <div className="location-card">

              <MapPin />

              <div>
                <span>Останнє місцезнаходження</span>

                <strong>
                  GPS поки не підключено
                </strong>
              </div>

            </div>

            <p className="gps-demo">
              GPS-моніторинг поки працює в демонстраційному режимі.
            </p>

          </section>
        )}

        {activeTab === "history" && (
          <section className="pet-profile-section">

            <h2>Історія маршруту</h2>

            <div className="route-history">

              <div className="history-item">
                <Clock />

                <div>
                  <strong>
                    вул. Київська, 32
                  </strong>

                  <span>15:40</span>

                  <p>
                    Остання зафіксована точка
                  </p>
                </div>
              </div>

              <div className="history-item">
                <Clock />

                <div>
                  <strong>
                    Сквер на Соборному майдані
                  </strong>

                  <span>13:10</span>

                  <p>
                    Рух тварини
                  </p>
                </div>
              </div>

              <div className="history-item">
                <Clock />

                <div>
                  <strong>
                    вул. Київська, 14
                  </strong>

                  <span>09:00</span>

                  <p>
                    Початок маршруту
                  </p>
                </div>
              </div>

            </div>

          </section>
        )}

      </div>
    </main>
  );
}
