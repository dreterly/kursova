
import { Link, useParams } from "react-router-dom";

import { announcements } from "../../data/announcements.js";
import { pets } from "../../data/pets.js";

import "./announcementDetails.css";

export function AnnouncementDetails() {
  const { id } = useParams();

  const announcement = announcements.find(
    (announcement) => announcement.id === Number(id)
  );

  if (!announcement) {
    return (
      <main className="announcement-details">
        <h1>Оголошення не знайдено</h1>
        <Link to="/">Повернутися на головну</Link>
      </main>
    );
  }

  const pet = pets.find(
    (pet) => pet.id === announcement.petId
  );

  return (
    <main className="announcement-details">
      <div className="announcement-details-card">
        <img
          className="announcement-details-image"
          src={pet?.image}
          alt={pet?.name}
        />

        <div className="announcement-details-content">
          <span
            className={`announcement-details-status ${
              announcement.type
            }`}
          >
            {announcement.type === "lost"
              ? "Загублений"
              : "Знайдений"}
          </span>

          <h1>{pet?.name}</h1>

          <p>🐱 {pet?.type}</p>
          <p>🏷 {pet?.breed}</p>
          <p>🎂 {pet?.age} роки</p>
          <p>📍 {announcement.city}</p>
          <p>📅 {announcement.date}</p>

          <h2>Опис</h2>
          <p>{announcement.description}</p>

          <div className="contact-info">
            <h2>Контакт власника</h2>
            <p>👤 {announcement.contactName}</p>
            <p>📞 {announcement.contactPhone}</p>
          </div>

          <button className="map-button">
            Показати на карті
          </button>
        </div>
      </div>
    </main>
  );
}
