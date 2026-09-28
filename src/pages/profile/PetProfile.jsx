
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, Clock, ArrowLeft } from "lucide-react";

import { pets } from "../../data/pets.js";

import "./petProfile.css";

export function PetProfile() {
  const { id } = useParams();

  const pet = pets.find((item) => item.id === Number(id));

  const [activeTab, setActiveTab] = useState("info");

  if (!pet) {
    return (
      <main className="pet-profile-page">
        <h1>Тварину не знайдено</h1>
        <Link to="/profile">Повернутися до профілю</Link>
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

        {/* Заголовок тварини */}
        <section className="pet-profile-header">

          <img
            src={pet.image}
            alt={pet.name}
          />

          <div>
            <h1>🐱 {pet.name}</h1>
            <p>
              {pet.type} • {pet.breed}
            </p>
          </div>

        </section>

        {/* Вкладки */}
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

        {/* Основна інформація */}
        {activeTab === "info" && (
          <section className="pet-profile-section">

            <h2>Основна інформація</h2>

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
                <strong>{pet.breed}</strong>
              </div>

              <div>
                <span>Стать</span>
                <strong>{pet.gender}</strong>
              </div>

              <div>
                <span>Вік</span>
                <strong>{pet.age} роки</strong>
              </div>

              <div>
                <span>Колір</span>
                <strong>{pet.color}</strong>
              </div>

            </div>

            <div className="pet-description">
              <span>Особливі ознаки</span>
              <p>{pet.description}</p>
            </div>

          </section>
        )}

        {/* Мікрочип */}
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
                  {pet.chipNumber || "Мікрочип не вказано"}
                </strong>
              </div>

            </div>

          </section>
        )}

        {/* GPS */}
     
{activeTab === "gps" && (
  <section className="pet-profile-section">

    <h2>GPS</h2>

    <div className="location-card">
      <MapPin />

      <div>
        <span>Останнє місцезнаходження</span>
        <strong>📍 {pet.city}</strong>
      </div>
    </div>

    <p className="gps-demo">
      GPS-моніторинг поки працює в демонстраційному режимі.
    </p>

  </section>
)}



        {/* Історія маршруту */}
        {activeTab === "history" && (
          <section className="pet-profile-section">

            <h2>Історія маршруту</h2>

            <div className="route-history">

              <div className="history-item">
                <Clock />

                <div>
                  <strong>вул. Київська, 32</strong>
                  <span>15:40</span>
                  <p>Остання зафіксована точка</p>
                </div>
              </div>

              <div className="history-item">
                <Clock />

                <div>
                  <strong>Сквер на Соборному майдані</strong>
                  <span>13:10</span>
                  <p>Рух тварини</p>
                </div>
              </div>

              <div className="history-item">
                <Clock />

                <div>
                  <strong>вул. Київська, 14</strong>
                  <span>09:00</span>
                  <p>Початок маршруту</p>
                </div>
              </div>

            </div>

          </section>
        )}

      </div>

    </main>
  );
}
